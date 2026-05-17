"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { supabase } from '@/lib/supabaseClient';
import { 
  Menu, X, Sun, Moon, LogOut, User as UserIcon, 
  LayoutDashboard, Users, Briefcase, Settings, ArrowLeft
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function EmployerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }

  // Mobile Menu Links
  const navLinks = [
    { name: 'Dashboard', href: '/employer/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'My Postings', href: '/employer/jobs', icon: <Briefcase size={18} /> },
    { name: 'Candidates', href: '/employer/candidates', icon: <Users size={18} /> },
    { name: 'Settings', href: '/employer/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-full flex flex-col font-sans relative">
      <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] relative z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          
          {/* LOGO AREA */}
          <Link href="/employer/dashboard" className="flex items-center gap-5 md:gap-5" onClick={() => setIsOpen(false)}>
            <Image 
              src="/logo2.png" // 👇 Wapas logo2.png lagaya
              alt="HireSkys ATS"
              width={0}
              height={0}
              sizes="100vw"
              // 👇 Exact main site wali sizing laga di (h-9 aur normal margins)
              className="h-9 w-auto md:h-9 object-contain -mr-2 md:-mr-3" 
              priority
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                HireSkys
              </span>
              <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 w-fit">
                  <span className="text-[8px] md:text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">
                    ATS System
                  </span>
              </div>
            </div>
          </Link>

          {/* DESKTOP RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4">
            
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <ArrowLeft size={16} /> Back to Main Site
            </Link>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>


            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
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

        {/* MOBILE DROPDOWN (ATS Links) */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl animate-fade-in-down z-40">
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">ATS Menu</div>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium ${
                    pathname === link.href 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                    {link.icon} {link.name}
                </Link>
              ))}
              
              <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-2"></div>
              
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                  <ArrowLeft size={18} /> Back to Main Site
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}