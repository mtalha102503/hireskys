"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, Briefcase, Clock, TrendingUp, ChevronRight, Loader2, 
  Globe, Zap, Plus, AlertCircle, Sparkles, Search, Copy, CheckCircle, Lock // 👈 Lock add kiya
} from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    pending: 0
  });
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // 🟢 1. YAHAN HONA CHAHIYE PREMIUM CHECK!
  // Component ke re-render hone par yeh khud update ho jayega
  const hasPremiumFeatures = ['Scale', 'Urgent', 'Bulk 5 Pack', 'Bulk 10 Pack'].includes(company?.plan_tier);

  const handleCopyCode = () => {
    if (!company?.slug) return;
    
    const embedCode = `<div id="hireskys-jobs-widget" data-company="${company.slug}"></div>\n<script src="https://www.hireskys.com/widget.js" async></script>`;
    
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const currentUser = session.user;
      setUser(currentUser);

      const { data: compData } = await supabase
        .from('companies')
        .select('*')
        .eq('employer_id', currentUser.id)
        .single();
      setCompany(compData);

      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, approved')
        .eq('employer_id', currentUser.id);
      
      const activeJobsCount = jobs?.filter(j => j.approved).length || 0;

      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          ai_match_score,
          job_id,
          jobs!inner ( title, employer_id ),
          profiles!candidate_id ( full_name, country )
        `)
        .eq('jobs.employer_id', currentUser.id) 
        .order('applied_at', { ascending: false });

      if (error) throw error;

      const apps = applications || [];
      setStats({
        activeJobs: activeJobsCount,
        totalApplicants: apps.length,
        shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
        pending: apps.filter(a => a.status === 'New').length,
      });

      setRecentApplicants(apps.slice(0, 6));

    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { label: 'Active Jobs', value: stats.activeJobs, icon: <Briefcase size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Total Applicants', value: stats.totalApplicants, icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: <TrendingUp size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Pending Review', value: stats.pending, icon: <Clock size={20} />, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Synchronizing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* 🚀 TOP ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#111625] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Employer Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Welcome back! Managing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{company?.name || 'your company'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end px-4 py-2 border-r border-slate-200 dark:border-slate-700 mr-2">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase">
              <Zap size={14} fill="currentColor" /> {company?.job_credits || 0} Credits
            </div>
            <Link href="/employer/billing" className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 underline uppercase tracking-tighter">Top up</Link>
          </div>

          <Link 
            href="/employer/jobs/create" 
            className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={20} /> Post a Job
          </Link>
        </div>
      </div>

      {/* 🔔 SMART ALERT: Needs Attention */}
      {stats.pending > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/50 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 text-orange-700 dark:text-orange-400">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">You have <span className="underline">{stats.pending} new candidates</span> waiting for your review!</p>
          </div>
          <Link href="/employer/candidates?status=New" className="text-xs font-black bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-800 shadow-sm hover:bg-orange-100 transition-colors uppercase">Review Now</Link>
        </div>
      )}

      {/* 📊 STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-[#111625] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/50 transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 🚀 VIP JADOO: EMBED INTEGRATION BLOCK */}
      {company?.slug && (
        <div className="relative bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl border border-indigo-800/50 shadow-2xl overflow-hidden text-white mt-8">
          
          {/* 🔒 THE LOCK OVERLAY (Agar Scale/Urgent nahi hai) */}
          {!hasPremiumFeatures && (
            <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-indigo-400" size={30} />
               </div>
               <h3 className="text-2xl font-black text-white mb-2">Unlock Embed Features</h3>
               <p className="text-indigo-200 mb-6 max-w-md">Upgrade to the <strong className="text-white">Scale Plan</strong> to embed jobs directly on your website and track analytics.</p>
               <Link href="/employer/billing" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30">
                  Upgrade to Scale
               </Link>
            </div>
          )}

          <div className={`p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 ${!hasPremiumFeatures ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
            
            <div className="flex-1 space-y-3 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                <Sparkles size={12} className="animate-pulse" /> Premium Integration
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Embed Jobs on Your Website</h2>
              <p className="text-indigo-200 text-sm font-medium leading-relaxed max-w-lg">
                Copy and paste this snippet anywhere on your website. It automatically syncs with your HireSkys jobs and matches your site's design seamlessly! No coding required.
              </p>
            </div>

            <div className="w-full lg:w-auto flex-1 bg-[#0B0F19] rounded-2xl border border-slate-700/50 p-1 relative group shadow-inner max-w-full overflow-hidden">
              <div className="absolute top-3 right-3">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-md"
                >
                  {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Snippet'}
                </button>
              </div>
              <pre className="p-5 pt-12 md:pt-5 pb-5 text-[11px] md:text-xs text-indigo-300 font-mono overflow-x-auto custom-scrollbar">
                <code>
                  &lt;div id="hireskys-jobs-widget" data-company="{company.slug}"&gt;&lt;/div&gt;{'\n'}
                  &lt;script src="https://www.hireskys.com/widget.js" async&gt;&lt;/script&gt;
                </code>
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* 📊 VIP JADOO: WIDGET ANALYTICS HOOK */}
      {company?.embed_views > 0 && hasPremiumFeatures && (
        <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-indigo-500" /> Embedded Page Analytics
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Real-time performance of your website's career widget.</p>
            </div>
            <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/60 hover:border-indigo-200 transition-colors">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Widget Views</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{company?.embed_views || 0}</p>
              <p className="text-xs text-slate-500 font-medium mt-2">Times loaded on your site</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/60 hover:border-indigo-200 transition-colors">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Applications</p>
              <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{stats.totalApplicants}</p>
              <p className="text-xs text-slate-500 font-medium mt-2">Received via HireSkys</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/60 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-opacity duration-500">
                <Sparkles size={100} className="text-emerald-500" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Conversion Rate</p>
              <p className="text-4xl font-black text-emerald-500">
                {company?.embed_views > 0 ? ((stats.totalApplicants / company.embed_views) * 100).toFixed(1) : '0.0'}%
              </p>
              <p className="text-xs text-slate-500 font-medium mt-2">View-to-Apply ratio</p>
            </div>
          </div>
        </div>
      )}

      {/* 📑 RECENT APPLICANTS TABLE */}
      <div className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-500" size={20} />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent Candidates</h2>
          </div>
          <Link href="/employer/candidates" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">
            See All Candidates
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AI Match Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {recentApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-bold">No applications found yet. Keep growing! 🚀</td>
                </tr>
              ) : (
                recentApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-indigo-900/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{app.profiles?.full_name}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-0.5">
                          <Globe size={12} /> {app.profiles?.country || 'Remote'}
                        </div>
                      </div>
                    </td>

                    {/* 🤖 3. FIX: PROPER AI MATCH SCORE FLEX WITHOUT 3 DOTS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center">
                        {hasPremiumFeatures ? (
                          <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${
                            (app.ai_match_score || 0) > 80 
                            ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:border-fuchsia-500/20' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20'
                          }`}>
                            <Sparkles size={12} className={app.ai_match_score > 80 ? "animate-pulse" : ""} />
                            <span className="text-xs font-black">{app.ai_match_score || 0}% Match</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5 border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed group/lock relative">
                            <Lock size={12} className="text-slate-400" />
                            <span className="text-xs font-black text-transparent blur-sm select-none">85% Match</span>
                            <div className="absolute bottom-full mb-2 hidden group-hover/lock:block w-32 bg-slate-900 text-white text-[10px] text-center p-2 rounded-lg z-50">
                               Upgrade to Scale to view AI Scores
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-400 italic">
                      {app.jobs?.title}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                        app.status === 'Rejected' ? 'bg-red-50 text-red-500 border-red-200' :
                        'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/employer/candidates/${app.id}`}
                        className="inline-flex p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm group-hover:translate-x-1"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}