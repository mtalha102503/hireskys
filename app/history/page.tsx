"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  History, Calendar, Building2, ExternalLink, Loader2, 
  Search, TrendingUp, CheckCircle2, Clock, Trash2, 
  Settings, MoreVertical, X // 👈 Added icons for the menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showMenu, setShowMenu] = useState(false); // 👈 State for Dropdown
  const router = useRouter();

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    const fetchHistoryAndLogos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: historyData, error } = await supabase
        .from('application_history')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (!historyData || error) {
        setLoading(false);
        return;
      }

      // Logos Fetching Logic
      const companyNames = historyData
          .map((h) => h.company_name)
          .filter((name) => name && name !== "Unknown Company");

      let companiesMap: any = {};
      if (companyNames.length > 0) {
          const { data: companiesData } = await supabase
              .from('companies')
              .select('name, logo_url')
              .in('name', companyNames);

          if (companiesData) {
              companiesData.forEach((comp) => {
                  companiesMap[comp.name] = comp.logo_url;
              });
          }
      }

      const historyWithLogos = historyData.map(item => ({
          ...item,
          logo_url: companiesMap[item.company_name] || null 
      }));

      setHistory(historyWithLogos);
      setLoading(false);
    };

    fetchHistoryAndLogos();
  }, [router]);

  // 🔥 EXISTING SINGLE DELETE FUNCTION (Untouched)
  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this record?")) return;

      // 1. UI se foran hata do (Fast Feel ke liye)
      setHistory(prev => prev.filter(item => item.id !== id));

      // 2. Database se delete karo
      const { error } = await supabase
          .from('application_history')
          .delete()
          .eq('id', id);

      if (error) {
          console.error("Delete Error:", error);
          alert("Failed to delete. Please try again.");
      }
  };

  // 🚀 NEW: BULK DELETE LOGIC (Plan A)
  const handleBulkDelete = async (period: '24h' | '7d' | '30d' | 'all') => {
      setShowMenu(false); // Close menu
      
      const label = period === 'all' ? 'ALL history' : `history from the last ${period}`;
      if (!confirm(`Are you sure you want to delete ${label}? This cannot be undone.`)) return;

      const { data: { user } } = await supabase.auth.getUser();
      if(!user) return;

      let query = supabase.from('application_history').delete().eq('user_id', user.id);
      
      const now = new Date();
      let cutoffDate = new Date();

      // Date Logic: Calculate the cutoff time based on selection
      if (period !== 'all') {
          if (period === '24h') cutoffDate.setTime(now.getTime() - (24 * 60 * 60 * 1000));
          if (period === '7d') cutoffDate.setTime(now.getTime() - (7 * 24 * 60 * 60 * 1000));
          if (period === '30d') cutoffDate.setTime(now.getTime() - (30 * 24 * 60 * 60 * 1000));

          // Delete items NEWER than cutoff (greater than cutoff date)
          query = query.gt('applied_at', cutoffDate.toISOString());
      }

      const { error } = await query;

      if (error) {
          console.error("Bulk Delete Error:", error);
          alert("Failed to delete. Please try again.");
      } else {
          // UI Update: Keep items OLDER than cutoff
          if (period === 'all') {
              setHistory([]);
          } else {
              setHistory(prev => prev.filter(item => new Date(item.applied_at) <= cutoffDate));
          }
      }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getLogoColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-emerald-500'];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const filteredHistory = history.filter(item => 
    item.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300 font-sans">
      <Navbar />

      <div className="container mx-auto px-4 pt-8 pb-12 max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                    Application History
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Manage your job applications history.
                </p>
            </div>

            {!loading && history.length > 0 && (
                <div className="flex items-center gap-3">
                    {/* Stats Card */}
                    <div className="bg-white dark:bg-[#151B2B] border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applied</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{history.length}</p>
                        </div>
                    </div>

                    {/* 🔥 PLAN A: SETTINGS DROPDOWN MENU */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className={`p-3.5 rounded-2xl border transition-all ${showMenu 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-600' 
                                : 'bg-white dark:bg-[#151B2B] border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
                        >
                            <Settings size={22} className={showMenu ? 'animate-spin-slow' : ''} />
                        </button>

                        {/* Dropdown Content */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1E2536] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Manage History</p>
                                </div>
                                <div className="p-1">
                                    <button onClick={() => handleBulkDelete('24h')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                                        <Clock size={16} className="text-indigo-500" /> Delete last 24 hours
                                    </button>
                                    <button onClick={() => handleBulkDelete('7d')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                                        <Calendar size={16} className="text-indigo-500" /> Delete last 7 days
                                    </button>
                                    <button onClick={() => handleBulkDelete('30d')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                                        <History size={16} className="text-indigo-500" /> Delete last 30 days
                                    </button>
                                    <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1 mx-2"></div>
                                    <button onClick={() => handleBulkDelete('all')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                                        <Trash2 size={16} /> Clear All History
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Search Bar */}
        {!loading && history.length > 0 && (
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search history..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-[#151B2B] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                />
            </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-slate-500 font-medium animate-pulse">Fetching your records...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="bg-white dark:bg-[#151B2B] border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <History size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No applications yet</h2>
            <Link href="/">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
                Explore Jobs
              </button>
            </Link>
          </div>
        )}

        {/* History List */}
        <div className="grid gap-4">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white dark:bg-[#151B2B] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Logo Section */}
                <div className="shrink-0">
                    {item.logo_url ? (
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 dark:border-slate-700 p-1 flex items-center justify-center shadow-sm">
                            <img 
                                src={item.logo_url} 
                                alt={item.company_name} 
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className={`w-12 h-12 ${getLogoColor(item.company_name)} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
                            {item.company_name ? item.company_name.charAt(0).toUpperCase() : "C"}
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.job_title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Building2 size={14} className="text-indigo-500" />
                        {item.company_name || "Unknown Company"}
                    </span>
                    <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(item.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0 w-full md:w-auto">
                <div className="flex flex-col items-end mr-2 md:mr-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-md uppercase tracking-wide">
                        <CheckCircle2 size={12} /> Applied
                    </span>
                    <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={10} /> {getRelativeTime(item.applied_at)}
                    </span>
                </div>

                {/* View Button */}
                <Link href={`/jobs/${item.job_id}`}>
                  <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-indigo-600">
                    <ExternalLink size={16} />
                  </button>
                </Link>

                {/* DELETE BUTTON */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center p-2.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-500 hover:text-white text-red-500 dark:text-red-400 rounded-xl transition-all border border-red-100 dark:border-red-800 hover:border-red-500"
                  title="Delete Application"
                >
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}