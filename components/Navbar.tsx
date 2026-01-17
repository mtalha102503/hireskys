"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { supabase } from '@/lib/supabaseClient';
import { 
  Menu, X, Sun, Moon, LogOut, User as UserIcon, 
  ArrowRight, ShieldAlert 
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image'; // <--- Ye line sabse upar imports mein add karo
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu State
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration fix for Theme Icon
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

  // Admin Check (Optional: Agar tumhari email ho to Admin Link dikhana)
  const isAdmin = user?.email === 'mtalha1025031@gmail.com'; 

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        
        {/* LOGO */}
       {/* LOGO SECTION - UPDATED */}
{/* LOGO SECTION - UPDATED (No 'fill', No extra Gap) */}
{/* LOGO SECTION - FIXED */}
{/* LOGO SECTION - FORCED FIX */}
{/* LOGO SECTION - RESPONSIVE (Mobile: Small, Desktop: Big) */}
<Link href="/" className="flex items-center gap-1 md:gap-5" onClick={() => setIsOpen(false)}>
  
  <Image 
    src="/logo2.png" 
    alt="HireSkys Logo"
    width={0}
    height={0}
    sizes="100vw"
    // Mobile: h-9 (chota), Desktop: h-14 (bada)
    // Mobile: -mr-2 gap fix, Desktop: -mr-3 gap fix
    className="h-9 w-auto md:h-9 object-contain -mr-2 md:-mr-3" 
    priority
  />

  <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              HireSkys
            </span>
            {/* Premium Tech Badge */}
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

        {/* DESKTOP MENU (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Post Job Button (Pro Style) */}
          <Link 
            href="/post-job" 
            className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full transition shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5"
          >
            Post a Job <ArrowRight size={16} />
          </Link>

          {/* User / Login Link */}
          {user ? (
            <div className="flex items-center gap-3">
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
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition">
              Login
            </Link>
          )}

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON (Hamburger) */}
        <div className="md:hidden flex items-center gap-3">
             {/* Mobile Theme Toggle */}
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

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl animate-fade-in-down">
          <div className="flex flex-col space-y-4">
            
            <Link 
                href="/post-job" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl"
            >
                Post a Job <ArrowRight size={18} />
            </Link>

            {user ? (
                <>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                        <UserIcon size={18} /> My Profile & Alerts
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
                <Link href="/login" onClick={() => setIsOpen(false)} className="py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                    Login / Sign Up
                </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
