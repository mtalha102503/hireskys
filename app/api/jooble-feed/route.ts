import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

// Ab force-dynamic hata do, aur revalidate ek reasonable value pe rakho
export const revalidate = 900; // 15 minute cache

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function formatJoobleDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

// 👇 Ye function ab cached hai — 15 minute mein sirf ek dafa DB se fetch karega
const getCachedJobsFeed = unstable_cache(
  async () => {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, title, slug, source, company_logo_url, location, description, created_at, salary_range, job_type')
      .eq('active', true)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Supabase Query Failed: ${error.message}`);
    return jobs || [];
  },
  ['jooble-jobs-feed'],
  { revalidate: 900 } // 15 minute
);

export async function GET() {
  try {
    const jobs = await getCachedJobsFeed();

    if (jobs.length === 0) {
      return new NextResponse(`<?xml version="1.0" encoding="utf-8"?><jobs></jobs>`, {
        headers: { 'Content-Type': 'application/xml' }
      });
    }

    let xmlItems = '';
    for (const job of jobs) {
      const jobUrl = `https://www.hireskys.com/jobs/${job.slug}`;
      const xmlLocation = job.location === "Remote (Global)" ? "United States" : job.location;
      const expireDate = new Date(job.created_at);
      expireDate.setDate(expireDate.getDate() + 60);
      const hasSalary = job.salary_range && job.salary_range !== 'Not Disclosed';

      xmlItems += `
  <job id="${job.id}">
    <link><![CDATA[${jobUrl}]]></link>
    <name><![CDATA[${job.title}]]></name>
    <region><![CDATA[${xmlLocation}]]></region>
    <description><![CDATA[${job.description}]]></description>
    <pubdate>${formatJoobleDate(job.created_at)}</pubdate>
    <updated>${formatJoobleDate(job.created_at)}</updated>
    <company><![CDATA[${job.source}]]></company>
    <expire>${formatJoobleDate(expireDate)}</expire>
    <jobtype><![CDATA[${job.job_type}]]></jobtype>
    ${hasSalary ? `<salary><![CDATA[${job.salary_range}]]></salary>` : ''}
    ${job.company_logo_url ? `<logo><![CDATA[${job.company_logo_url}]]></logo>` : ''}
  </job>`;
    }

    const fullXml = `<?xml version="1.0" encoding="utf-8"?>\n<jobs>${xmlItems}\n</jobs>`;

    return new NextResponse(fullXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=900, s-maxage=900', // 👈 browsers/CDN ko bhi bolo cache karo
      },
    });

  } catch (error) {
    console.error("Jooble XML Feed Error:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="utf-8"?><jobs></jobs>`,
      { status: 500, headers: { 'Content-Type': 'application/xml' } }
    );
  }
}
