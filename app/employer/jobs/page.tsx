"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { 
  Briefcase, 
  Plus, 
  Users, 
  ExternalLink, 
  Edit, 
  Trash2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { createSlug } from '@/lib/utils'; // Agar slug function tumhare paas lib/utils mein hai

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Component load hote hi data fetch karega
  useEffect(() => {
    fetchMyJobs();
  }, []);

  async function fetchMyJobs() {
    try {
      // 1. Current Login HR (User) ka pata lagao
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      // 🟢 NAYA VIP LOGIC: Workspace ID nikalo
      const { workspaceId } = await getActiveWorkspaceId(user.id);

      // 2. 🟢 SECURE QUERY: Workspace ki jobs nikal lao
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id, 
          link,
          slug,
          title, 
          category, 
          location, 
          created_at,
          date_posted,
          approved, 
          ats_approved,
          applications ( count )
        `)
        .eq('employer_id', workspaceId) // 👈 Ab yahan workspaceId aayega!
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setJobs(data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error.message || error);
    } finally {
      setLoading(false);
    }
  }

  // ⏳ Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading your postings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 📌 Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-indigo-500" size={28} />
            My Postings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your job listings and view applicant stats.
          </p>
        </div>
        
        <Link 
          href="/employer/jobs/create" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30"
        >
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      {/* 📌 Jobs Table Area */}
      <div className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="col-span-5">Job Details</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Applicants</div>
          <div className="col-span-2 text-center">Date Posted</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* 🟢 Real Database Jobs List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {jobs.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
               <Briefcase size={40} className="text-slate-300 mb-3" />
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs posted yet</h3>
               <p className="text-slate-500 text-sm mt-1 mb-4">You haven't posted any remote jobs using this account.</p>
               <Link href="/employer/jobs/create" className="text-indigo-600 font-bold hover:underline">Post your first job</Link>
            </div>
          ) : (
            jobs.map((job) => {
              // Supabase relational count logic
              const applicantCount = job.applications?.[0]?.count || 0;
              
              return (
                <div key={job.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center hover:bg-slate-50 dark:hover:bg-[#151b2e] transition-colors group">
                  
                  {/* Job Title & Info */}
                  <div className="col-span-1 md:col-span-5 flex flex-col">
                    <span className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                      {job.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs">{job.job_type || 'Full-time'}</span>
                      <span>•</span>
                      <span>{job.location || 'Remote'}</span>
                    </div>
                  </div>

                  {/* Status Badge (Approved/Pending) */}
                  <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      job.ats_approved 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                      : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                    }`}>
                      {job.ats_approved ? 'Active' : 'Pending Review'}
                    </span>
                  </div>

                  {/* Real Applicant Count */}
                  <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center mt-2 md:mt-0">
                    <Link href={`/employer/candidates?job=${job.id}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors">
                      <Users size={16} className={applicantCount > 0 ? "text-indigo-500" : ""} />
                      {applicantCount}
                    </Link>
                  </div>

                  {/* Date Posted */}
                  <div className="col-span-1 md:col-span-2 text-sm font-medium text-slate-500 dark:text-slate-400 text-left md:text-center mt-2 md:mt-0">
                    {new Date(job.date_posted).toLocaleDateString()}
                  </div>

{/* Actions */}
<div className="col-span-1 md:col-span-1 flex justify-end gap-2 mt-4 md:mt-0">
                    {/* 🟢 VIP JADOO: Direct database wala link use kiya hai */}
                    <Link 
                      href={job.link || `/jobs/${job.slug}/apply`} 
                      target="_blank" 
                      className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" 
                      title="View Public Job"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <Link 
  href={`/employer/jobs/${job.slug}/edit`} 
  className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
  title="Edit Job"
>
  <Edit size={18} />
</Link>
                    <button className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Close Job">
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
        
        {/* Table Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/50 text-sm font-medium text-slate-500 flex justify-between items-center">
          <span>Showing {jobs.length} job(s)</span>
        </div>

      </div>
    </div>
  );
}