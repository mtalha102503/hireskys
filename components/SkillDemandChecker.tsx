"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Briefcase, Check, Share2 } from 'lucide-react';

type JobSample = {
  id: number;
  slug: string;
  title: string;
  company: string | null;
  category: string | null;
  job_type: string | null;
  location: string | null;
};

type CountRow = { name: string; count: number };

type SkillResult = {
  found: boolean;
  skill: string;
  matchedAs: string | null;
  total: number;
  totalActive: number;
  sharePct: number;
  categories: CountRow[];
  jobTypes: CountRow[];
  jobs: JobSample[];
  truncated: boolean;
  suggestions?: { skill: string; count: number }[];
};

// Shown only if the live popular-skills fetch fails. Names only — counts
// always come from the API, never from this list.
const FALLBACK_SKILLS = [
  'Python',
  'SQL',
  'AWS',
  'SEO',
  'DevOps',
  'Salesforce',
  'Machine Learning',
  'Project Management',
  'Lead Generation',
  'Customer Support',
];

function bandFor(total: number): { label: string; classes: string } {
  if (total >= 1000)
    return { label: 'Very High', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  if (total >= 300)
    return { label: 'High', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
  if (total >= 50)
    return { label: 'Moderate', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
  return { label: 'Niche', classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };
}

export default function SkillDemandChecker() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SkillResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topSkills, setTopSkills] = useState<string[]>(FALLBACK_SKILLS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/skill-demand')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.topSkills) && d.topSkills.length > 0) {
          setTopSkills(d.topSkills.map((s: { skill: string }) => s.skill));
        }
      })
      .catch(() => {
        // Keep the fallback chips; the tool still works for typed searches.
      });

    const initial = new URLSearchParams(window.location.search).get('skill');
    if (initial) {
      setQuery(initial);
      runSearch(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(raw: string) {
    const skill = raw.trim();
    if (skill.length < 2) {
      setError('Please type at least 2 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/skill-demand?skill=${encodeURIComponent(skill)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Something went wrong. Please try again.');
        return;
      }
      setResult(data as SkillResult);
      const url = `${window.location.pathname}?skill=${encodeURIComponent(skill)}`;
      window.history.replaceState(null, '', url);
    } catch {
      setError('Could not reach the checker. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Skill Demand Checker | HireSkys', text: `Live demand for ${query} on HireSkys`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  }

  const band = result && result.found ? bandFor(result.total) : null;

  return (
    <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
      >
        <label htmlFor="skill-search" className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Type a skill
        </label>
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input
            id="skill-search"
            type="text"
            placeholder="e.g. Python, SQL, SEO…"
            className="w-full py-4 pl-12 pr-32 rounded-2xl bg-slate-50 dark:bg-[#151b2d] border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Check demand'}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider py-2">Popular:</span>
        {topSkills.slice(0, 10).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuery(s);
              runSearch(s);
            }}
            className="px-3 py-1.5 text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 font-medium">
          {error}
        </div>
      )}

      {result && result.found && band && (
        <div className="mt-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Live listings asking for “{result.matchedAs}”
              </p>
              <p className="text-5xl font-black text-slate-900 dark:text-white mt-1">
                {result.total.toLocaleString()}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {result.sharePct}% of {result.totalActive.toLocaleString()} active listings
              </p>
              {result.matchedAs !== result.skill && (
                <p className="text-sm text-slate-500 mt-1">Matched tag: {result.matchedAs}</p>
              )}
            </div>
            <div className="md:ml-auto flex items-center gap-2">
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${band.classes}`}>
                <TrendingUp size={14} /> {band.label} demand
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-indigo-600 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
                {copied ? 'Link copied!' : 'Share result'}
              </button>
            </div>
          </div>

          {result.truncated && (
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Category and job-type breakdowns are based on the latest 5,000 matching listings.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Top categories</h3>
              <div className="space-y-3">
                {result.categories.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-slate-500">{c.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${Math.max(2, Math.round((c.count / result.total) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">By job type</h3>
              <div className="flex flex-wrap gap-2">
                {result.jobTypes.map((t) => (
                  <span
                    key={t.name}
                    className="px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full"
                  >
                    {t.name} · {t.count.toLocaleString()}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Demand bands are this tool’s own scale (1,000+ Very High, 300+ High, 50+ Moderate, under 50
                Niche) — a guide to where demand sits, not a hiring guarantee.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase size={18} /> Latest jobs asking for this skill
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {result.jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="block py-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition px-2 -mx-2 rounded-xl"
                >
                  <p className="font-bold text-slate-900 dark:text-white">{job.title}</p>
                  <p className="text-sm text-slate-500">
                    {[job.company, job.category, job.job_type, job.location].filter(Boolean).join(' · ')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && !result.found && (
        <div className="mt-8">
          <p className="font-bold text-lg text-slate-900 dark:text-white">
            No exact tag match for “{result.skill}”.
          </p>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Demand counts only listings whose tags include that exact skill, so close spellings don’t
            inflate the number. Try one of these instead:
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {(result.suggestions ?? []).length > 0 ? (
              result.suggestions!.map((s) => (
                <button
                  key={s.skill}
                  type="button"
                  onClick={() => {
                    setQuery(s.skill);
                    runSearch(s.skill);
                  }}
                  className="px-3 py-1.5 text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 transition"
                >
                  {s.skill} ({s.count.toLocaleString()})
                </button>
              ))
            ) : (
              <span className="text-sm text-slate-500">No close popular skill found — try a broader skill name.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
