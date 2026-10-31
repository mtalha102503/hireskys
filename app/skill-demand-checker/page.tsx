import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SkillDemandChecker from '@/components/SkillDemandChecker';

const SITE_URL = 'https://www.hireskys.com';

export const metadata: Metadata = {
  title: 'Skill Demand Checker: Check Live Demand for Any Skill | HireSkys',
  description:
    'Check how many live remote job listings on HireSkys ask for a skill — with top categories, job types and the latest matching jobs. Counts come from live HireSkys listings and refresh hourly.',
  alternates: { canonical: `${SITE_URL}/skill-demand-checker` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Skill Demand Checker | HireSkys',
    description:
      'Check live demand for any skill across thousands of active remote job listings on HireSkys.',
    url: `${SITE_URL}/skill-demand-checker`,
    siteName: 'HireSkys',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill Demand Checker | HireSkys',
    description:
      'Check live demand for any skill across thousands of active remote job listings on HireSkys.',
    images: [`${SITE_URL}/og-default.png`],
  },
};

const FAQS = [
  {
    q: 'What does "demand" mean here?',
    a: 'The number of currently active HireSkys job listings whose tags include that exact skill. It measures how often employers ask for the skill right now — not how many people get hired.',
  },
  {
    q: 'Why does it need an exact skill match?',
    a: 'Tags are exact labels ("Python" is not the same tag as "Python Scripting"). Counting exact matches keeps the number honest instead of inflating it with near-misses. If there is no exact match, the checker suggests the closest popular skills.',
  },
  {
    q: 'How fresh are the numbers?',
    a: 'Counts are computed from live HireSkys listings and cached for one hour, so repeat searches do not hammer the database. The underlying listings change daily as jobs open and close.',
  },
  {
    q: 'Can one listing count for several skills?',
    a: 'Yes. A listing usually carries several tags, so the same job can count toward Python, SQL and AWS at once. That is why shares for different skills overlap and do not add up to 100%.',
  },
  {
    q: 'Does a high demand number mean I will get hired?',
    a: 'No. Demand shows opportunity, not outcome. Skills, experience, portfolio and application quality still decide hiring. Use the number to pick what to learn, then check the linked jobs for what employers actually ask for.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function SkillDemandCheckerPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        <div className="text-center mb-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-sm border border-green-200 dark:border-green-800">
            Live data · Refreshes hourly
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Skill Demand{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Checker
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Type any skill and see how many live remote listings on HireSkys ask for it — plus the
            categories hiring for it and the latest jobs you can apply to.
          </p>
        </div>

        <SkillDemandChecker />

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-black text-indigo-600 text-xl mb-2">1 · Type a skill</p>
            <p className="text-slate-600 dark:text-slate-400">
              Use the exact skill name if you can — “Python”, “SQL”, “SEO”. Popular skills are one
              tap away as chips above the results.
            </p>
          </div>
          <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-black text-indigo-600 text-xl mb-2">2 · Read the demand</p>
            <p className="text-slate-600 dark:text-slate-400">
              See the live count, its share of all active listings, the top hiring categories and
              whether the work is mostly full-time, contract or freelance.
            </p>
          </div>
          <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-black text-indigo-600 text-xl mb-2">3 · Open real jobs</p>
            <p className="text-slate-600 dark:text-slate-400">
              The latest matching listings link straight to their job pages, so you can check the
              actual requirements before you decide what to learn next.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 mt-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How the numbers are counted</h2>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc pl-5">
            <li>
              <strong className="text-slate-900 dark:text-white">Source:</strong> HireSkys job
              listings marked active, counted by their skill tags.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Exact match:</strong> only listings
              whose tags include that exact skill are counted — close spellings are suggested, not
              silently counted.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Freshness:</strong> results are
              cached for one hour so the checker stays fast without loading the database on every
              search.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Demand bands:</strong> the tool’s
              own scale — 1,000+ Very High, 300+ High, 50+ Moderate, under 50 Niche. Bands describe
              where a skill sits, they are not a hiring promise.
            </li>
          </ul>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
              >
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Keep exploring HireSkys
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/salary-guide"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition"
            >
              Remote Salary Guide
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 bg-white dark:bg-slate-800 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Career Blog
            </Link>
            <Link
              href="/career-advice"
              className="px-6 py-3 bg-white dark:bg-slate-800 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Career Advice
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
