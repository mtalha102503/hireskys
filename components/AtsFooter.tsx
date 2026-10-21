import Link from 'next/link';

// 🎯 ATS subdomain ki apni saaf footer — sirf product, company aur legal links.
// Job-board wala bara crowded footer yahan nahi chalega.
export default function AtsFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B0F19]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg font-black text-white shadow-md shadow-indigo-500/30">
                H
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                HireSkys <span className="text-indigo-600 dark:text-indigo-400">ATS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Hiring software for remote-first teams. Post jobs, track every
              candidate on a visual pipeline, and hire — without the $299/mo
              subscription trap.
            </p>
            <a
              href="mailto:contact@hireskys.com"
              className="mt-4 inline-block text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              contact@hireskys.com
            </a>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Product
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/#pricing" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/post-job" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  Employer Login
                </Link>
              </li>
              <li>
                <a href="https://www.hireskys.com" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  HireSkys Job Board ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Company / Legal */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              <li>
                <a href="https://www.hireskys.com/about" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  About HireSkys
                </a>
              </li>
              <li>
                <a href="https://www.hireskys.com/contact" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="https://www.hireskys.com/privacy" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://www.hireskys.com/terms" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs font-medium text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} HireSkys ATS — a HireSkys product.</p>
          <a href="https://www.hireskys.com" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Looking for a job? Find remote jobs at hireskys.com →
          </a>
        </div>
      </div>
    </footer>
  );
}
