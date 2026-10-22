import Link from 'next/link';
import Image from 'next/image';

// 🎯 ATS subdomain (ats.hireskys.com) ki apni halki navbar —
// koi job-board wala crowded menu nahi, sirf product ki cheezain.
export default function AtsNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.webp"
            alt="HireSkys Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            HireSkys
          </span>
          <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-black tracking-wide text-white">
            ATS
          </span>
        </Link>

        {/* Product links */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <Link href="/#pricing" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Pricing
          </Link>
          <Link href="/post-job" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            Post a Job
          </Link>
          <a
            href="https://www.hireskys.com"
            className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Job Board ↗
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/ats-login"
            className="text-sm font-bold text-slate-700 dark:text-slate-200 transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Log in
          </Link>
          <Link
            href="/post-job"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-700"
          >
            Start Hiring — Free
          </Link>
        </div>
      </div>
    </header>
  );
}
