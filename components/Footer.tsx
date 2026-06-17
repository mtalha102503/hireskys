"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Heart,} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FaThreads } from "react-icons/fa6";
// Custom Official SVGs for a Professional Look
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);
const MailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
    <rect x="3" y="5" width="18" height="14" rx="2" />
  </svg>
);
// 🟢 NEW: Category Data Array mapped directly to your correct slugs
const jobCategories = [
  { name: "Development", path: "development" },
  { name: "Mobile App", path: "mobile-app" },
  { name: "AI & Machine Learning", path: "ai-machine-learning" },
  { name: "Design & Creative", path: "design-creative" },
  { name: "Video & Animation", path: "video-animation" },
  { name: "Audio & Voice", path: "audio-voice" },
  { name: "Writing & Translation", path: "writing-translation" },
  { name: "Marketing & Sales", path: "marketing-sales" },
  { name: "Admin & Support", path: "admin-support" },
  { name: "Customer Service", path: "customer-service" },
  { name: "Finance & Accounting", path: "finance-accounting" },
  { name: "Legal & HR", path: "legal-hr" },
  { name: "Education & Coaching", path: "education-coaching" },
  { name: "Data Science & Analytics", path: "data-science-analytics" },
  { name: "Engineering & Architecture", path: "engineering-architecture" }
];
// Upar data array bana lo
const trendingSearches = [
  { name: "Remote Finance Jobs", path: "/remote-jobs/all/finance" },
  { name: "Global AI Remote Jobs", path: "/remote-jobs/all/global-work-ai" },
  { name: "Remote Data Entry Jobs", path: "/remote-jobs/all/data-entry" },
  { name: "Remote HR Jobs", path: "/remote-jobs/all/hr" },
  { name: "Remote Customer Support Jobs", path: "/remote-jobs/all/customer-support" },
  { name: "Remote Software Engineer Jobs", path: "/remote-jobs/all/software-engineer" }
];
// Location Data Array for cleaner code
const remoteLocations = [
  { name: "United States", path: "/united-states/all" },
  { name: "United Kingdom", path: "/united-kingdom/all" },
  { name: "Canada", path: "/canada/all" },
  { name: "Singapore", path: "/singapore/all" },
  { name: "Germany", path: "/germany/all" },
  { name: "Spain", path: "/spain/all" },
  { name: "Portugal", path: "/portugal/all" },
  { name: "Poland", path: "/poland/all" },
  { name: "India", path: "/india/all" },
  { name: "Pakistan", path: "/pakistan/all" },
  { name: "Philippines", path: "/philippines/all" },
  { name: "Brazil", path: "/brazil/all" },
  { name: "Ukraine", path: "/ukraine/all" },
  { name: "South Africa", path: "/south-africa/all" },
  { name: "Argentina", path: "/argentina/all" },
  { name: "Mexico", path: "/mexico/all" }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Hide footer logic
  if (
    pathname?.startsWith('/embed') || 
    pathname?.startsWith('/p/') || 
    pathname?.startsWith('/community')||
    pathname?.startsWith('/employer')
  ) {
    return null;
  }
  
  return (
    <footer className="w-full bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* MAIN GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* COL 1: BRANDING */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-5 md:gap-5">
              <Image 
                src="/logo2.png" 
                alt="HireSkys Logo"
                width={0}
                height={0}
                sizes="100vw"
                className="h-9 w-auto md:h-9 object-contain -mr-2 md:-mr-3" 
                priority
              />
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white z-10">
                HireSkys
              </span>
            </Link>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pr-4">
              Your gateway to elite remote work. We connect top talent with verified work-from-anywhere opportunities and freelance contracts.
            </p>
            
           {/* SOCIAL & COMMUNITY ICONS */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a href="https://x.com/hireskys" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all duration-300">
                <XIcon className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/hireskys/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-[#E1306C] hover:bg-[#E1306C]/10 dark:hover:bg-[#E1306C]/20 dark:hover:text-[#E1306C] transition-all duration-300">
                <InstagramIcon className="w-4 h-4" />
              </a>
              {/* 🟢 UPDATED: THREADS LINK */}
<a href="https://www.threads.net/@hireskys" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-black hover:bg-slate-200 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300">
  <FaThreads className="w-4 h-4" />
</a>
              <a href="https://discord.gg/BmfgGfX5" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-[#5865F2] hover:bg-[#5865F2]/10 dark:hover:bg-[#5865F2]/20 dark:hover:text-[#5865F2] transition-all duration-300">
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a href="https://t.me/hireskys_jobs" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-[#0088cc] hover:bg-[#0088cc]/10 dark:hover:bg-[#0088cc]/20 dark:hover:text-[#0088cc] transition-all duration-300">
                <TelegramIcon className="w-4 h-4" />
              </a>
              {/* 🟢 NEW: EMAIL LINK */}
              <a href="mailto:contact@hireskys.com" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-all duration-300">
                <MailIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COL 2: PLATFORM */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Browse Jobs</Link></li>
              <li><Link href="/how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">How It Works</Link></li>
              <li><Link href="/post-job" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Post a Job</Link></li>
              <li><Link href="/share-story" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Share Your Success</Link></li>
              <li>
                <Link href="/ats" className="group inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Free ATS 
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm group-hover:scale-105 transition-transform">
                    Hot
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: RESOURCES */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/success-stories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Success Stories</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Blog</Link></li>
              <li><Link href="/career-advice" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Career Advice</Link></li>
              <li><Link href="/salary-guide" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Salary Guide</Link></li>
              <li><Link href="/support" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Help & Support</Link></li>
              <li><Link href="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Faqs</Link></li>
            </ul>
          </div>

          {/* COL 4: LEGAL */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cookie Policy</Link></li>
              <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link href="/refund-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Refund and Cancellation</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Sitemap</Link></li>
            </ul>
          </div>

        </div>
        
        <hr className="my-12 border-slate-200 dark:border-slate-800/60" />

{/* 🟢 NEW: TRENDING SEARCHES SECTION */}
<div>
  <h4 className="text-xs font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase mb-6">
    Trending Remote Searches
  </h4>
  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm text-slate-500 dark:text-slate-400">
    {trendingSearches.map((search) => (
      <li key={search.path}>
        <Link 
          href={search.path} 
          className="hover:text-indigo-600 dark:hover:text-slate-200 transition-colors"
        >
          {search.name}
        </Link>
      </li>
    ))}
  </ul>
</div>
        {/* 🟢 REMOTE.IO STYLE SEO DIRECTORY SECTION */}
        <div className="w-full flex flex-col gap-10 pt-12 mt-12 border-t border-slate-200 dark:border-slate-800">
          
          {/* 🟢 UPDATED: BY CATEGORY */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase mb-6">
              Browse Remote Jobs By Category
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm text-slate-500 dark:text-slate-400">
              {jobCategories.map((cat) => (
                <li key={cat.path}>
                  <Link 
                    href={`/category/${cat.path}`} 
                    className="hover:text-indigo-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Remote {cat.name} jobs
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-slate-200 dark:border-slate-800/60" />

          {/* BY COUNTRY */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase mb-6">
              Browse Remote Jobs By Country
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm text-slate-500 dark:text-slate-400">
              {remoteLocations.map((loc) => (
                <li key={loc.path}>
                  <Link 
                    href={`/remote-jobs/${loc.path}`} 
                    className="hover:text-indigo-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Remote jobs in {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR - CLEAN & MINIMAL */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
                &copy; {currentYear} HireSkys Inc. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                Built with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> for the Elite.
            </p>
        </div>

      </div>
    </footer>
  );
}
