import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings,
  ChartSpline, 
  CreditCard,
  LogOut
} from 'lucide-react';
import EmployerNavbar from '@/components/EmployerNavbar'; // 👇 Navbar Import Kiya
import VIPWhatsApp from '@/components/SupportChat';
export const metadata = {
  title: 'Employer ATS | HireSkys',
  description: 'Manage your remote hiring pipeline seamlessly.',
};

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col font-sans">
      
      {/* 📌 TOP NAVBAR (Jo abhi humne banaya hai) */}
      <EmployerNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* 📌 SIDEBAR (Navigation) - Ab yeh Navbar ke neechay se shuru hogi */}
        <aside className="w-64 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16 z-10">
          
          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Overview</div>
            
            <Link href="/employer/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            
            <Link href="/employer/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              <Briefcase size={18} /> My Postings
            </Link>

            <Link href="/employer/candidates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              <Users size={18} /> Candidates
            </Link>

            <Link href="/employer/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              <ChartSpline size={18} /> Analytics
            </Link>

            <Link href="/employer/billing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              <CreditCard size={18} /> Billing & Credits
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/50 mt-auto">
            <Link href="/employer/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 font-medium transition-all text-sm shadow-sm">
              <Settings size={18} /> Settings
            </Link>
            <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors text-sm">
              <LogOut size={18} /> Log out
            </button>
          </div>
        </aside>

        {/* 📌 MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div> {/* 👈 Yeh Sidebar aur Main ka wrapper close ho raha hai */}
      
      {/* 🟢 2. VIP WhatsApp Component Yahan Ayega! */}
      <VIPWhatsApp />
      
    </div> // 👈 Yeh sab se main/root div close ho raha hai
  );
}