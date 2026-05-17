"use client";
import Link from 'next/link';
import Image from 'next/image';
import { X, Linkedin, Github, Heart , Instagram} from 'lucide-react';
import { usePathname } from 'next/navigation'; // 🟢 1. YEH IMPORT ADD KIYA

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname(); // 🟢 2. CURRENT URL GET KIYA

  // 🟢 3. THE MAGIC: Agar URL /embed ya /p/ (talent profiles) se shuru ho raha hai, toh Footer gayab
  if (pathname?.startsWith('/embed') || pathname?.startsWith('/p/')) {
    return null;
  }

  return (
    <footer className="w-full bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* COL 1: BRANDING */}
          <div className="space-y-2">
            {/* LOGO SECTION */}
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
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Your gateway to elite remote work. We connect top talent with verified work-from-anywhere opportunities and freelance contracts.
            </p>
            
            <div className="flex gap-4 pt-2">
              <a href="https://x.com/hireskys" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                <X size={20} />
              </a>
              <a href="https://www.instagram.com/hireskys/" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                <Instagram size={20} />
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
              <li><Link href="/refund-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Refund & Cancellation</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cookie Policy</Link></li>
              <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Sitemap</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
                &copy; {currentYear} HireSkys Inc. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
                Built with <Heart size={14} className="text-red-500 fill-red-500" /> for the Elite.
            </p>
        </div>

      </div>
    </footer>
  );
}
