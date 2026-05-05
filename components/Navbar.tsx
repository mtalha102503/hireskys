"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { supabase } from '@/lib/supabaseClient';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Sun, Moon, LogOut, User as UserIcon, 
  ArrowRight, ShieldAlert, History, Building2,
  Briefcase, Users 
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 🚀 THE FIX: Sirf Client Browser par check lagao, Vercel Server ko bypass karo!
    if (typeof window !== 'undefined') {
        checkUser();
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user ?? null);
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
    }
  }, []);

  async function checkUser() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
    } catch (error) {
        console.error("Auth check failed:", error);
    }
  }

  const isAdmin = user?.email === 'mtalha1025031@gmail.com'; 

  return (
    <div className="w-full flex flex-col font-sans relative">
      {/* 🔵 NAVBAR START */}
    <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md shadow-sm relative z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        
        <Link href="/" className="flex items-center gap-5 md:gap-5" onClick={() => setIsOpen(false)}>
          <Image 
            src="/logo2.png" 
            alt="HireSkys Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-9 w-auto md:h-9 object-contain -mr-2 md:-mr-3" 
            priority
          />

          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              HireSkys
            </span>
            <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 w-fit">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                </span>
                <span className="text-[8px] md:text-[9px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest leading-none">
                  Remote Only
                </span>
            </div>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* 👇 JOBS BUTTON (Sirf Logged-out users ke liye) */}
          {!user && (
            <Link 
              href="/#jobs" 
              className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 px-4 py-2.5 rounded-xl transition-all duration-200 border border-transparent dark:hover:border-indigo-500/30"
            >
                <Briefcase size={18} />
                <span>Jobs</span>
            </Link>
          )}

          {/* 👇 TALENT BUTTON (Sab ke liye) */}
          <Link 
            href="/talent" 
            className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 px-4 py-2.5 rounded-xl transition-all duration-200 border border-transparent dark:hover:border-indigo-500/30"
          >
              <Users size={18} />
              <span>Talent</span>
          </Link>

          {/* COMPANIES BUTTON */}
          {pathname !== '/onboarding' && (
            <Link 
              href="/companies" 
              className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 px-4 py-2.5 rounded-xl transition-all duration-200 border border-transparent dark:hover:border-indigo-500/30"
            >
                <Building2 size={18} />
                <span>Companies</span>
            </Link>
          )}

          {/* HISTORY BUTTON */}
          {user && (
            <Link 
              href="/history" 
              className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 px-4 py-2.5 rounded-xl transition-all duration-200 border border-transparent dark:hover:border-indigo-500/30"
            >
                <History size={18} />
                <span>History</span>
            </Link>
          )}

          {!user && (
            <Link 
              href="/post-job" 
              className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full transition shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5"
            >
              Post a Job <ArrowRight size={16} />
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 ml-2">
               {isAdmin && (
                 <Link href="/admin" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg" title="Admin">
                    <ShieldAlert size={20} />
                 </Link>
               )}
               <Link href="/profile" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg transition">
                  <UserIcon size={16} /> Profile
               </Link>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition ml-2">
              Login
            </Link>
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition ml-2"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* 👇 COMMUNITY LINKS - DESKTOP */}
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4 ml-1">
            <Link 
              href="YOUR_DISCORD_LINK_HERE" 
              target="_blank" 
              title="Join our Discord"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#5865F2] hover:bg-[#5865F2]/10 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </Link>
            
            <Link 
              href="YOUR_TELEGRAM_LINK_HERE" 
              target="_blank" 
              title="Join our Telegram"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#0088cc] hover:bg-[#0088cc]/10 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </Link>
          </div>

        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-3">
             {mounted && (
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-slate-500">
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
             )}

             <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 text-slate-700 dark:text-slate-200"
             >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl animate-fade-in-down z-40">
          <div className="flex flex-col space-y-4">
            
            {!user && (
                <Link 
                    href="/post-job" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl mb-2 shadow-md shadow-indigo-500/20"
                >
                    Post a Job <ArrowRight size={18} />
                </Link>
            )}

            {/* 👇 MOBILE: JOBS BUTTON (Sirf Logged out) */}
            {!user && (
                <Link href="/#jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                    <Briefcase size={18} /> Find Jobs
                </Link>
            )}

            {/* 👇 MOBILE: TALENT BUTTON */}
            <Link href="/talent" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                <Users size={18} /> Find Talent
            </Link>

            {pathname !== '/onboarding' && (
                <Link href="/companies" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                    <Building2 size={18} /> Top Companies
                </Link>
            )}
            
            {user ? (
                <>
                    <Link href="/history" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                        <History size={18} /> Job History
                    </Link>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                        <UserIcon size={18} /> My Profile
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-red-500 font-medium">
                            <ShieldAlert size={18} /> Admin Dashboard
                        </Link>
                    )}
                    <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="flex items-center gap-2 py-2 text-slate-500 font-medium hover:text-red-500 text-left">
                        <LogOut size={18} /> Sign Out
                    </button>
                </>
            ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500 border-t border-slate-100 dark:border-slate-800 pt-4">
                    Login / Sign Up
                </Link>
            )}

            {/* 👇 COMMUNITY LINKS - MOBILE */}
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Join Community</span>
              <div className="flex gap-3">
                <Link 
                  href="https://discord.gg/BmfgGfX5" 
                  target="_blank"
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2] hover:text-white rounded-xl font-semibold transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                  Discord
                </Link>
                <Link 
                  href="https://t.me/hireskys_jobs" 
                  target="_blank"
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white rounded-xl font-semibold transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </nav>
    
    </div>
  );
}
