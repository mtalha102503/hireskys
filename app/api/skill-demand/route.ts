import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

// Public read-only client (anon key only — same pattern as the /tools page).
// No service-role key, no writes, no secrets in this file.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const MAX_ROWS = 5000;
const TOP_LIMIT = 20;
const SUGGESTION_LIMIT = 6;

type JobSample = {
  id: number;
  slug: string;
  title: string;
  company: string | null;
  category: string | null;
  job_type: string | null;
  location: string | null;
  date_posted: string | null;
};

type CountRow = { name: string; count: number };

function isValidSkill(raw: string): boolean {
  if (raw.length < 2 || raw.length > 40) return false;
  return /^[A-Za-z0-9.#][A-Za-z0-9 .#+#-]*$/.test(raw);
}

// Tags are stored Title Case ("Python", "Project Management") but a few are
// acronyms ("AWS", "SQL"). Try the typed form, then Title Case, then UPPER.
function variants(skill: string): string[] {
  const title = skill
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');
  return Array.from(new Set([skill, title, skill.toUpperCase()]));
}

async function getTotalActive(): Promise<number> {
  const { count } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('active', true);
  return count ?? 0;
}

const getCachedTotalActive = unstable_cache(getTotalActive, ['skill-demand-total-active'], {
  revalidate: 3600,
});

// Full tag aggregation, cached hourly — the same full-fetch + JS-aggregate
// pattern the /tools directory page already uses, so repeat searches cost
// the database nothing.
async function getTagCounts(): Promise<{ skill: string; count: number }[]> {
  const counts = new Map<string, number>();
  const pageSize = 1000;
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from('jobs')
      .select('tags')
      .eq('active', true)
      .range(from, from + pageSize - 1);
    if (error || !data) break;
    for (const row of data as { tags: string[] | null }[]) {
      for (const tag of row.tags ?? []) {
        const t = tag.trim();
        if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return Array.from(counts.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);
}

const getCachedTagCounts = unstable_cache(getTagCounts, ['skill-demand-tag-counts'], {
  revalidate: 3600,
});

async function computeSkill(skill: string) {
  const totalActive = await getCachedTotalActive();
  const tagCounts = await getCachedTagCounts();

  for (const variant of variants(skill)) {
    const { count } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('active', true)
      .contains('tags', [variant]);
    const total = count ?? 0;
    if (total <= 0) continue;

    const rows: JobSample[] = [];
    const pageSize = 1000;
    let from = 0;
    while (rows.length < Math.min(total, MAX_ROWS)) {
      const { data, error } = await supabase
        .from('jobs')
        .select('id,slug,title,company,category,job_type,location,date_posted')
        .eq('active', true)
        .contains('tags', [variant])
        .order('date_posted', { ascending: false })
        .range(from, from + pageSize - 1);
      if (error || !data || data.length === 0) break;
      rows.push(...(data as JobSample[]));
      if (data.length < pageSize) break;
      from += pageSize;
    }

    const catMap = new Map<string, number>();
    const typeMap = new Map<string, number>();
    for (const r of rows) {
      const cat = r.category ?? 'Not specified';
      const typ = r.job_type ?? 'Not specified';
      catMap.set(cat, (catMap.get(cat) ?? 0) + 1);
      typeMap.set(typ, (typeMap.get(typ) ?? 0) + 1);
    }
    const top = (m: Map<string, number>, n: number): CountRow[] =>
      Array.from(m.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n);

    return {
      found: true,
      skill,
      matchedAs: variant,
      total,
      totalActive,
      sharePct: totalActive > 0 ? Math.round((total / totalActive) * 10000) / 100 : 0,
      categories: top(catMap, 8),
      jobTypes: top(typeMap, 8),
      jobs: rows.slice(0, 12),
      truncated: total > MAX_ROWS,
      generatedAt: new Date().toISOString(),
    };
  }

  const q = skill.toLowerCase();
  const suggestions = tagCounts
    .filter((t) => t.skill.toLowerCase().includes(q))
    .slice(0, SUGGESTION_LIMIT);
  return {
    found: false,
    skill,
    matchedAs: null,
    total: 0,
    totalActive,
    sharePct: 0,
    categories: [],
    jobTypes: [],
    jobs: [],
    truncated: false,
    suggestions,
    generatedAt: new Date().toISOString(),
  };
}

function cachedSkill(skill: string) {
  return unstable_cache(async () => computeSkill(skill), ['skill-demand', skill], {
    revalidate: 3600,
  })();
}

export async function GET(req: NextRequest) {
  const skillRaw = req.nextUrl.searchParams.get('skill');

  // No skill requested: serve the popular-skills list for the chips.
  if (!skillRaw) {
    const tagCounts = await getCachedTagCounts();
    const totalActive = await getCachedTotalActive();
    return NextResponse.json(
      {
        topSkills: tagCounts.slice(0, TOP_LIMIT),
        totalActive,
        generatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  const skill = skillRaw.trim();
  if (!isValidSkill(skill)) {
    return NextResponse.json(
      { error: 'Invalid skill. Use 2-40 characters: letters, numbers, spaces and . # + - only.' },
      { status: 400 }
    );
  }

  const result = await cachedSkill(skill);
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
