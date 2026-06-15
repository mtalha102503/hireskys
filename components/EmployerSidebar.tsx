"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // 👈 useRouter add kiya
import { supabase } from '@/lib/supabaseClient'; // 👈 Supabase add kiya
import { 
  LayoutDashboard, Users, Briefcase, Settings, 
  ChartSpline, CreditCard, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function EmployerSidebar() {
  const pathname = usePathname();
  const router = useRouter(); // 👈 Router initialize kiya
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 🟢 VIP JADOO: Logout Function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Logout hone ke baad user ko kahan bhejna hai? (e.g., '/', '/login')
      router.push('/login'); 
    } catch (error: any) {
      alert("Error logging out: " + error.message);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'My Postings', href: '/employer/jobs', icon: Briefcase },
    { name: 'Candidates', href: '/employer/candidates', icon: Users },
    { name: 'Analytics', href: '/employer/analytics', icon: ChartSpline },
    { name: 'Billing & Credits', href: '/employer/billing', icon: CreditCard },
  ];

  return (
    <aside 
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16 z-10 transition-all duration-300 ease-in-out`}
    >
      
      {/* 🟢 TOGGLE BUTTON */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} p-4 pb-2`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-4'} py-4 space-y-2 overflow-y-auto custom-scrollbar`}>
        
        {!isCollapsed && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Overview</div>
        )}
        
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);

          return (
            <Link 
              key={link.name}
              href={link.href} 
              title={isCollapsed ? link.name : ""} 
              className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'} rounded-xl font-bold transition-all relative overflow-hidden group ${
                isActive 
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
              )}
              
              <Icon size={20} className={`shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} /> 
              
              {!isCollapsed && (
                <span className="truncate whitespace-nowrap">{link.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className={`p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-[#111625] mt-auto flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        <Link 
          href="/employer/settings" 
          title={isCollapsed ? "Settings" : ""}
          className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'} w-full rounded-xl font-bold transition-all relative ${
            pathname.startsWith('/employer/settings') 
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'
          }`}
        >
          {pathname.startsWith('/employer/settings') && (
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full"></div>
          )}
          <Settings size={20} className="shrink-0" /> 
          {!isCollapsed && <span>Settings</span>}
        </Link>

        {/* 🟢 YAHAN CLICK HANDLER LAGAYA HAI */}
        <button 
          onClick={handleLogout}
          title={isCollapsed ? "Log out" : ""}
          className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'} w-full rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold transition-colors`}
        >
          <LogOut size={20} className="shrink-0" /> 
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
      
    </aside>
  );
}