"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, Briefcase, Clock, TrendingUp, ChevronRight, Loader2, 
  Globe, Zap, Plus, AlertCircle, Sparkles, Search, Copy, CheckCircle, Lock ,X, Link as LinkIcon, Save, Phone, Linkedin, HelpCircle, FileText, Mail// 👈 Lock add kiya
} from 'lucide-react';
import Link from 'next/link';
import { getActiveWorkspaceId } from '@/lib/workspace';
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
  // 🟢 VIP JADOO: Alert Dismiss State
  const [dismissAlert, setDismissAlert] = useState(false);
const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (selectedCandidate) {
      setNoteText(selectedCandidate.employer_notes || "");
    }
  }, [selectedCandidate]);

  // Status Update Function
  async function updateStatus(applicationId: string, newStatus: string) {
    try {
      setRecentApplicants(recentApplicants.map(c => 
        c.id === applicationId ? { ...c, status: newStatus } : c
      ));
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;
      fetchDashboardData(); // Dashboard ke counters update karne ke liye
    } catch (error: any) {
      alert("Status update fail ho gaya: " + error.message);
    }
  }

  // Private Note Save Function
  async function saveNote() {
    if (!selectedCandidate) return;
    setSavingNote(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ employer_notes: noteText })
        .eq('id', selectedCandidate.id);

      if (error) throw error;
      
      setRecentApplicants(recentApplicants.map(c => 
        c.id === selectedCandidate.id ? { ...c, employer_notes: noteText } : c
      ));
      setSelectedCandidate({ ...selectedCandidate, employer_notes: noteText });
    } catch (error: any) {
      alert("Note save fail ho gaya: " + error.message);
    } finally {
      setSavingNote(false);
    }
  }
  // 🟢 VIP JADOO: Smart Tier Hierarchy Logic (Case Insensitive & Inclusive)
  const currentPlan = (company?.plan_tier || 'free').toLowerCase();

  // 1. Startup Level Features (Startup aur us se oopar saare plans ko milenge)
  const hasStartupFeatures = ['startup', 'scale', 'urgent', 'bulk 5', 'bulk 10'].some(tier => currentPlan.includes(tier));

  // 2. Scale Level Features (Scale, Urgent, aur Bulk walon ko milenge - Embeds & AI)
  // Note: Startup walon ko ye nahi milega
  const hasPremiumFeatures = ['scale', 'urgent', 'bulk 5', 'bulk 10'].some(tier => currentPlan.includes(tier));

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
      setUser(currentUser); // User ki apni details save rakhein UI ke liye

      // 🟢 NAYA VIP LOGIC: Workspace ID nikalo (Owner aur Team Member dono ke liye)
      const { workspaceId } = await getActiveWorkspaceId(currentUser.id);

      const { data: compData } = await supabase
        .from('companies')
        .select('*')
        .eq('employer_id', workspaceId) // 👈 Yahan workspaceId lagaya
        .single();
      setCompany(compData);

      // 👇 NAYA VIP LOGIC: job_status aur ats_approved dono mangwao
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, ats_approved, job_status') 
        .eq('employer_id', workspaceId); 
      
      // 🟢 FIX: Active job sirf wo hai jo ATS se approved ho AUR uska status 'Active' ho
      const activeJobsCount = jobs?.filter(j => 
        j.ats_approved && (j.job_status === 'Active' || !j.job_status)
      ).length || 0;

      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *, 
          jobs!inner ( title, employer_id ),
          profiles!candidate_id ( full_name, country, avatar_url )
        `)
        .eq('jobs.employer_id', workspaceId) // 👈 Yahan workspaceId lagaya
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

      {/* 🔔 VIP JADOO SMART ALERT: Dismissible & Dynamic */}
      {stats.pending > 0 && !dismissAlert && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border border-orange-200 dark:border-orange-800/50 p-4 md:p-5 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group shadow-sm">
          
          {/* Side Indicator Line */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-400 to-amber-500"></div>

          <div className="flex items-center gap-4 pl-2">
            <div className="p-3 bg-white dark:bg-orange-950/50 rounded-2xl shadow-sm animate-bounce-slow border border-orange-100 dark:border-orange-800/50">
              <Zap size={22} className="text-orange-500" fill="currentColor" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {stats.pending === 1 ? '1 candidate is' : `${stats.pending} candidates are`} waiting for your review! 🔥
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Top talent usually gets hired within 48 hours. Don't miss out.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2 sm:pl-0 w-full sm:w-auto">
            <Link 
              href="/employer/candidates?status=New" 
              className="flex-1 sm:flex-none text-center text-xs font-black bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
            >
              Review Now
            </Link>
            <button 
              onClick={() => setDismissAlert(true)}
              className="p-2.5 text-slate-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:text-orange-500 rounded-xl transition-colors"
              title="Dismiss for now"
            >
              <X size={20} />
            </button>
          </div>
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
        <div className="relative bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl border border-indigo-800/50 shadow-2xl overflow-hidden text-white mt-8 min-h-[360px] flex flex-col justify-center">
          
          {/* 🔒 THE VIP LOCK OVERLAY */}
          {!hasPremiumFeatures && (
            <div className="absolute inset-0 z-50 bg-[#0B0F19]/70 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center border border-white/5">
               <div className="relative mb-5 group">
                  {/* Glowing effect behind lock */}
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 rounded-full group-hover:opacity-60 transition-opacity duration-500"></div>
                  
                  {/* Lock Circle */}
                  <div className="relative w-16 h-16 bg-gradient-to-b from-slate-800 to-[#0B0F19] border border-slate-700/50 rounded-full flex items-center justify-center shadow-2xl">
                     <Lock className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" size={24} />
                  </div>
               </div>
               
               <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">
                 Unlock Embed Features
               </h3>
               
               <p className="text-slate-300 mb-6 max-w-md text-xs md:text-sm leading-relaxed font-medium px-4">
                 Take your hiring to the next level. Upgrade to the <strong className="text-indigo-300">Scale Plan</strong> to seamlessly embed jobs on your site and track live analytics.
               </p>
               
               <Link 
                 href="/employer/billing" 
                 className="px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 flex items-center gap-2 text-sm"
               >
                 <Sparkles size={16} className="text-indigo-600" />
                 Upgrade to Scale
               </Link>
            </div>
          )}

          <div className={`p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 w-full ${!hasPremiumFeatures ? 'opacity-20 blur-md pointer-events-none' : ''}`}>
            
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
                        {/* 🟢 FIX: Pehle direct application se naam uthao, phir profile se */}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {app.full_name || app.profiles?.full_name || 'Anonymous Candidate'}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-0.5">
                          {/* 🟢 FIX: Country bhi direct application se uthao */}
                          <Globe size={12} /> {app.country || app.profiles?.country || 'Remote'}
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
                      {/* 🟢 Yahan Link ki jagah Button kar diya */}
                      <button 
                        onClick={() => setSelectedCandidate(app)}
                        className="inline-flex p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm group-hover:translate-x-1"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* 🟢 VIP JADOO: Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white dark:bg-[#0B0F19] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedCandidate.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.full_name || selectedCandidate.profiles?.full_name || 'C')}&background=random&color=fff`} 
                  alt="avatar" 
                  className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover"
                />
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedCandidate.full_name || selectedCandidate.profiles?.full_name}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Applied for: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedCandidate.jobs?.title}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Match Score */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Match Score</div>
                  {hasPremiumFeatures ? (
                    <div className="text-lg font-black text-emerald-600">{selectedCandidate.ai_match_score || 0}%</div>
                  ) : (
                    <>
                      <div className="text-lg font-black text-slate-300 dark:text-slate-600 blur-[4px] select-none">95%</div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#0B0F19]/60 backdrop-blur-[2px]">
                        <Link href="/employer/billing" className="flex items-center gap-1.5 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-105">
                          <Lock size={12} /> Unlock
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Applied Date */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Applied Date</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(selectedCandidate.applied_at).toLocaleDateString()}</div>
                </div>

                {/* Phone Number */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone size={10}/> Phone / WhatsApp</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedCandidate.phone || 'N/A'}</div>
                </div>

                {/* Location */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Globe size={10}/> Location</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                    {selectedCandidate.city ? `${selectedCandidate.city}, ` : ''}{selectedCandidate.country || selectedCandidate.profiles?.country || 'N/A'}
                  </div>
                </div>

                {/* Work Auth */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Work Auth</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {selectedCandidate.legal_authorization || 'N/A'}
                    {selectedCandidate.authorized_country && <span className="text-[10px] font-medium text-slate-500 block leading-tight">({selectedCandidate.authorized_country})</span>}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 md:px-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl">
                <a 
                  href={`mailto:${selectedCandidate.email}`} 
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#0B0F19] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all w-full sm:w-auto justify-center border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm"
                  title="Click to send email"
                >
                  <Mail size={16} className="text-indigo-500" /> 
                  {selectedCandidate.email || 'No Email Provided'}
                </a>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => { updateStatus(selectedCandidate.id, 'Rejected'); setSelectedCandidate(null); }}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-sm rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => { updateStatus(selectedCandidate.id, 'Interview'); setSelectedCandidate(null); }}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Move to Interview
                  </button>
                </div>
              </div>

              {/* Screening Answers */}
              {selectedCandidate.screening_answers && Object.keys(selectedCandidate.screening_answers).length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <HelpCircle size={18} className="text-fuchsia-500" /> Screening Answers
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedCandidate.screening_answers).map(([question, answer], idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{question}</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{String(answer) || 'No answer provided.'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selectedCandidate.cover_letter && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-500" /> Cover Letter
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedCandidate.cover_letter}
                  </div>
                </div>
              )}

              {/* Links & Attachments */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <LinkIcon size={18} className="text-teal-500" /> Attachments & Links
                </h3>
                
                {selectedCandidate.resume_url && (
                  <a href={selectedCandidate.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group shadow-sm">
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2"><FileText size={16}/> View Resume / CV</span>
                    <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
                
                {selectedCandidate.linkedin_url && (
                  <a href={selectedCandidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Linkedin size={16} className="text-blue-600"/> LinkedIn Profile</span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {selectedCandidate.portfolio_link && (
                  <a href={selectedCandidate.portfolio_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><LinkIcon size={16}/> Portfolio / Website</span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>

              {/* Private Notes */}
              <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-rose-500" /> Private Notes 
                  <span className="text-[9px] font-bold bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-wider ml-2">Only visible to you</span>
                </h3>
                <div className="relative">
                  <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type your secret interview notes, salary expectations, etc. here..." 
                    className="w-full p-4 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-sm text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/50 min-h-[120px] custom-scrollbar"
                  ></textarea>
                  <div className="flex justify-end mt-3">
                    <button 
                      onClick={saveNote}
                      disabled={savingNote || noteText === selectedCandidate.employer_notes}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                      {savingNote ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {savingNote ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}