"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { supabase } from '@/lib/supabaseClient';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, X, Sun, Moon, LogOut, User as UserIcon, 
  ArrowRight, ShieldAlert, History, Building2,
  Briefcase, Users, Bell, CheckCircle2, CheckCheck, LayoutDashboard
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import OneSignal from 'react-onesignal';
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
const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;
useEffect(() => {
    if (typeof window !== 'undefined') {
      const setupOneSignal = async () => {
        try {
          // 1. Agar pehle se init hai toh dubara mat karo
          if (!window.hasOwnProperty('OneSignal') || !(OneSignal as any).initialized) {
            await OneSignal.init({
              appId: "db29acc7-7561-4ed0-a434-9f1575225026",
              allowLocalhostAsSecureOrigin: true,
              serviceWorkerParam: { scope: "/" },
              serviceWorkerPath: "OneSignalSDKWorker.js",
            });
          }

          // 2. Login ko thora sa delay do taake SDK ready ho jaye
          if (user?.id) {
            setTimeout(async () => {
              console.log("Linking User:", user.id);
              await OneSignal.login(user.id);
            }, 1000); 
          }
        } catch (error) {
          console.log("OneSignal Status:", error);
        }
      };

      setupOneSignal();
    }
  }, [user?.id]);
  useEffect(() => {
    if (user) {
      const fetchNotifs = async () => {
        const { data } = await supabase
          .from('community_notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (data) setNotifications(data);
      };
      fetchNotifs();
    }
  }, [user]);

  const handleNotificationClick = async (notifId: string, postId: string) => {
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    await supabase.from('community_notifications').update({ is_read: true }).eq('id', notifId);
    setShowNotifs(false);
    router.push(`/community/${postId}`);
  };
  // 🚀 MARK ALL AS READ FUNCTION
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Dropdown ko band hone se rokne ke liye
    
    // 1. Screen par foran blue dots hata do (Optimistic Update)
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    
    // 2. Background mein database update kar do
    if (user) {
      await supabase
        .from('community_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    }
  };
  // 🚀 CLEAR ALL NOTIFICATIONS FUNCTION
  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Dropdown ko band hone se roko
    
    // 1. UI se foran saaf kar do (Inbox Zero!)
    setNotifications([]);
    
    // 2. Database se hamesha ke liye delete kar do
    if (user) {
      await supabase
        .from('community_notifications')
        .delete()
        .eq('user_id', user.id);
    }
  };
  return (
    <div className="w-full flex flex-col font-sans relative">
      {/* 🔵 NAVBAR START */}
    <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md shadow-sm relative z-40">
      {/* 🚀 THE FIX: max-w-5xl ko max-w-7xl kar diya taake Hero section ke elements ke saath theek se align ho */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl lg:px-8">
        
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
        
        {/* Baqi sab code as it is... */}

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* 👇 JOBS BUTTON (Sirf Logged-out users ke liye) */}
          {!user && (
            <Link 
              href="/#jobs" 
              className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-xl transition-all duration-200"
            >
                Jobs
            </Link>
          )}

          {/* 👇 TALENT BUTTON (Sab ke liye) */}
          <Link 
            href="/talent" 
            className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-xl transition-all duration-200"
          >
              Talent
          </Link>

          {/* COMPANIES BUTTON */}
          {pathname !== '/onboarding' && (
            <Link 
              href="/companies" 
              className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-xl transition-all duration-200"
            >
                Companies
            </Link>
          )}

          {/* 👇 ATS BUTTON - HIGH CONVERSION DESIGN */}
          {!user && (
            <Link 
              href="/ats" 
              className="relative flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
                {/* Blinking Dot for Attention */}
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400"></span>
                </span>
                
                Free ATS
                
                {/* Optional 'NEW' Badge */}
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-sm transform rotate-3">
                  Hot
                </span>
            </Link>
          )}

          {/* HISTORY BUTTON */}
          {user && (
            <Link 
              href="/history" 
              className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-xl transition-all duration-200"
            >
                History
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
              {/* 🔔 BELL ICON UI */}
               <div className="relative">
                  <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 transition">
                      <Bell size={20} />
                      {unreadCount > 0 && (
                          <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-[#0B0F19]"></span>
                          </span>
                      )}
                  </button>
                  {showNotifs && (
                      <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                          <div className="p-4 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                              <h3 className="font-black text-slate-900 dark:text-white">Notifications</h3>
                              {unreadCount > 0 && (
                                  <div className="flex items-center gap-3">
                                      {/* 🚀 MARK ALL AS READ BUTTON */}
                                      <button 
                                          onClick={handleMarkAllAsRead}
                                          className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                      >
                                          <CheckCheck size={14} /> Mark all read
                                      </button>
                                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 px-2.5 py-1 rounded-md">
                                          {unreadCount} New
                                      </span>
                                  </div>
                              )}
                          </div>
                          <div className="max-h-[350px] overflow-y-auto">
                              {notifications.length === 0 ? (
                                  <div className="p-6 text-center text-slate-500 text-sm">You're all caught up! 🎉</div>
                              ) : (
                                  notifications.map((notif) => (
                                      <div key={notif.id} onClick={() => handleNotificationClick(notif.id, notif.post_id)} className={`p-4 border-b cursor-pointer flex gap-3 ${!notif.is_read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                          <img 
    src={notif.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.sender_name?.replace(/\s+/g, '') || 'User'}`} 
    alt="avatar" 
    className="w-8 h-8 rounded-full bg-slate-200 mt-1 object-cover" 
/>
                                          <div>
                                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                                  <span className="font-bold">{notif.sender_name}</span> {notif.type === 'reply' ? 'replied to you.' : 'commented on your post.'}
                                              </p>
                                          </div>
                                          {!notif.is_read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 ml-auto"></div>}
                                      </div>
                                  ))
                              )}
                          </div>
                          {/* 🚀 THE NEW FOOTER: CLEAR ALL BUTTON */}
                          {notifications.length > 0 && (
                              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                  <button 
                                      onClick={handleClearAll}
                                      className="text-xs font-bold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors py-1 px-3 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
                                  >
                                      Clear all notifications
                                  </button>
                              </div>
                          )}
                      </div>
                  )}
              </div>
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
            {/* 👇 MOBILE: ATS BUTTON (Sirf Logged out) */}
            {!user && (
                <Link href="/ats" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-500">
                    <LayoutDashboard size={18} /> Free ATS
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

          </div>
        </div>
      )}
    </nav>
    
    </div>
  );
}