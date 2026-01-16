"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  ShieldAlert, CheckCircle, Trash2, ExternalLink, 
  Loader2, LogOut, LayoutDashboard, Layers, Activity, CalendarClock
} from 'lucide-react';
import Link from 'next/link';

// --- SECURITY ---
const ADMIN_EMAIL = 'mtalha1025031@gmail.com'; 

type Job = {
  id: number;
  title: string;
  source: string;
  link: string;
  category: string;
  tags: string[];
  date_posted: string;
  approved: boolean;
  // 👇 Ye 3 lines add kar lo
  description?: string; 
  location?: string;
  salary_range?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [cleaning, setCleaning] = useState(false); // For bulk delete spinner

  useEffect(() => {
    checkAdmin();
  }, [activeTab]); 

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      router.push('/'); 
    } else {
      fetchJobs();
    }
  }

  async function fetchJobs() {
    setLoading(true);
    const isApproved = activeTab === 'active';
    
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('approved', isApproved)
      .order('date_posted', { ascending: false });

    if (error) console.error(error);
    else setJobs(data || []);
    
    setLoading(false);
  }

  // --- ACTIONS ---
  async function approveJob(id: number) {
    setActionLoading(id);

    // 1. Job ka data nikaalo (List se remove hone se pehle)
    const jobToApprove = jobs.find(j => j.id === id);

    // 2. Supabase me Approve karo
    const { error } = await supabase.from('jobs').update({ approved: true }).eq('id', id);
    
    if (!error) {
        // UI se hatao
        setJobs(jobs.filter(job => job.id !== id));

        // 🌟 3. TRIGGER ALERT (Sirf Approved Jobs ke liye)
        if (jobToApprove) {
            try {
                await fetch('/api/job-alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: jobToApprove.title,
                        source: jobToApprove.source,
                        link: jobToApprove.link,
                        // Agar fields missing hon to default values
                        salary_range: jobToApprove.salary_range || 'Not Disclosed',
                        location: jobToApprove.location || 'Remote',
                        category: jobToApprove.category,
                        description: jobToApprove.description || 'Job Approved by Admin',
                        company: jobToApprove.source
                    })
                });
                console.log("🔔 Alert Sent to Users!");
            } catch (alertErr) {
                console.error("⚠️ Alert Failed:", alertErr);
            }
        }
    }
    setActionLoading(null);
  }
  async function deleteJob(id: number) {
    if(!confirm("Are you sure you want to DELETE this job permanently?")) return;
    setActionLoading(id);
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) setJobs(jobs.filter(job => job.id !== id));
    setActionLoading(null);
  }

  async function unapproveJob(id: number) {
    setActionLoading(id);
    const { error } = await supabase.from('jobs').update({ approved: false }).eq('id', id);
    if (!error) setJobs(jobs.filter(job => job.id !== id));
    setActionLoading(null);
  }

  // --- 🔥 NEW: BULK CLEANUP FUNCTION ---
  async function cleanOldJobs(days: number) {
      const msg = `⚠️ WARNING: This will PERMANENTLY DELETE all jobs older than ${days} days.\n\nAre you sure?`;
      if (!confirm(msg)) return;

      setCleaning(true);
      
      // Calculate Date
      const date = new Date();
      date.setDate(date.getDate() - days);
      const isoDate = date.toISOString();

      try {
          const { count, error } = await supabase
            .from('jobs')
            .delete({ count: 'exact' }) // Count wapis mangwayenge
            .lt('date_posted', isoDate); // lt = Less Than (Older than)

          if (error) throw error;
          
          alert(`✅ Cleanup Complete! Deleted ${count} jobs.`);
          fetchJobs(); // Refresh list
      } catch (err: any) {
          alert(`Error: ${err.message}`);
      } finally {
          setCleaning(false);
      }
  }

  if (loading && jobs.length === 0) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19]"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      {/* HEADER */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
            <ShieldAlert size={24} />
            <span className="text-xl font-bold tracking-tight">Admin Console</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-indigo-500 flex items-center gap-1">
                <LogOut size={16}/> Exit
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* --- 🧹 MAINTENANCE PANEL (New) --- */}
        <div className="mb-8 p-6 bg-white dark:bg-[#111625] rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-white">
                <CalendarClock className="text-red-500"/> System Maintenance
            </h2>
            <div className="flex flex-wrap gap-4">
                <button 
                    onClick={() => cleanOldJobs(30)} 
                    disabled={cleaning}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                >
                    {cleaning ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16}/>}
                    Delete Jobs &gt; 30 Days Old
                </button>
                <button 
                    onClick={() => cleanOldJobs(60)} 
                    disabled={cleaning}
                    className="px-4 py-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                >
                    {cleaning ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16}/>}
                    Delete Jobs &gt; 60 Days Old
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
                * Note: This action is irreversible. It helps keep the database fast.
            </p>
        </div>

        {/* TABS HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
                <LayoutDashboard className="text-indigo-500"/> Dashboard
            </h1>
            
            {/* TAB BUTTONS */}
            <div className="flex bg-white dark:bg-[#111625] p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition ${
                        activeTab === 'pending' 
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' 
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <Layers size={16}/> Pending
                </button>
                <button 
                    onClick={() => setActiveTab('active')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition ${
                        activeTab === 'active' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <Activity size={16}/> Active / Live
                </button>
            </div>
        </div>

        {/* JOBS LIST */}
        <div className="space-y-4">
            {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <CheckCircle className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold">No {activeTab} jobs</h2>
                    <p className="text-slate-500">Everything looks clean here.</p>
                </div>
            ) : (
                jobs.map((job) => (
                    <div key={job.id} className="bg-white dark:bg-[#111625] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:border-indigo-500 transition">
                        
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                                    job.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {job.approved ? 'Live' : 'Pending'}
                                </span>
                                <span className="text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{job.category}</span>
                                <span className="text-xs text-slate-400 font-mono">
                                    {new Date(job.date_posted).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                <a href={job.link} target="_blank" className="hover:underline flex items-center gap-2">
                                    {job.title} <ExternalLink size={14} className="text-slate-400"/>
                                </a>
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">@{job.source}</p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => deleteJob(job.id)}
                                disabled={actionLoading === job.id}
                                className="px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
                            >
                                {actionLoading === job.id ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16}/>}
                                Delete
                            </button>
                            
                            {activeTab === 'pending' ? (
                                <button 
                                    onClick={() => approveJob(job.id)}
                                    disabled={actionLoading === job.id}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition"
                                >
                                    Approve
                                </button>
                            ) : (
                                <button 
                                    onClick={() => unapproveJob(job.id)}
                                    disabled={actionLoading === job.id}
                                    className="px-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-sm transition"
                                >
                                    Hide (Unapprove)
                                </button>
                            )}
                        </div>

                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
}