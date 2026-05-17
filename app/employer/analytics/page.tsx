"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Users, Briefcase, TrendingUp, 
  Loader2, MousePointerClick, Activity, ChevronRight,
  Filter, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    avgMatchScore: 0, // 👈 VIP JADOO: Naya Metric
    pipeline: { new: 0, shortlisted: 0, interview: 0, rejected: 0 },
    topJobs: [] as any[]
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }

      // 🟢 1. Fetch jobs + applications + AI Scores
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
          id, 
          title, 
          created_at,
          applications ( id, status, ai_match_score )
        `)
        .eq('employer_id', session.user.id);

      if (error) throw error;

      if (jobsData) {
        let applicantsCount = 0;
        let totalScore = 0;
        let scoredAppsCount = 0;
        let pipelineCounts = { new: 0, shortlisted: 0, interview: 0, rejected: 0 };
        
        // 🟢 2. Calculate Top Jobs & Pipeline & Scores
        const jobsWithStats = jobsData.map(job => {
          const apps = job.applications || [];
          applicantsCount += apps.length;

          apps.forEach((app: any) => {
            // Pipeline Tracking
            const status = (app.status || 'New').toLowerCase();
            if (status === 'new') pipelineCounts.new++;
            else if (status === 'shortlisted') pipelineCounts.shortlisted++;
            else if (status === 'interview') pipelineCounts.interview++;
            else if (status === 'rejected') pipelineCounts.rejected++;
            else pipelineCounts.new++; // fallback

            // AI Score Tracking
            if (app.ai_match_score) {
              totalScore += app.ai_match_score;
              scoredAppsCount++;
            }
          });

          return {
            id: job.id,
            title: job.title,
            applicantCount: apps.length,
            date: new Date(job.created_at).toLocaleDateString()
          };
        });

        // Sort by most applicants
        const sortedTopJobs = jobsWithStats.sort((a, b) => b.applicantCount - a.applicantCount).slice(0, 5);

        setStats({
          totalJobs: jobsData.length,
          totalApplicants: applicantsCount,
          avgMatchScore: scoredAppsCount > 0 ? Math.round(totalScore / scoredAppsCount) : 0, // 👈 Average Score
          pipeline: pipelineCounts,
          topJobs: sortedTopJobs
        });
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Crunching your data...</p>
      </div>
    );
  }

  const maxPipeline = Math.max(...Object.values(stats.pipeline), 1); 

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 📌 HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="text-indigo-600" size={32} />
          Hiring Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Deep insights into your hiring pipeline and candidate quality.
        </p>
      </div>

      {/* 🟢 TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#111625] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/50 transition-all">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Briefcase size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalJobs}</div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Active Jobs</div>
        </div>

        <div className="bg-white dark:bg-[#111625] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/50 transition-all">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalApplicants}</div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Total Candidates</div>
        </div>

        {/* 🤖 VIP JADOO: AI Match Score Stat */}
        <div className="bg-white dark:bg-[#111625] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-fuchsia-500/50 transition-all relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-fuchsia-500/20 transition-colors"></div>
          <div className="w-12 h-12 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.avgMatchScore}%</div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Avg. AI Match Score</div>
        </div>

        <div className="bg-white dark:bg-[#111625] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-emerald-500/50 transition-all">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MousePointerClick size={20} />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            {stats.totalApplicants > 0 ? Math.round((stats.pipeline.shortlisted / stats.totalApplicants) * 100) : 0}%
          </div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Shortlist Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 PIPELINE FUNNEL (Upgraded UI) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-black flex items-center gap-2 mb-8 text-slate-900 dark:text-white tracking-tight">
            <Filter className="text-indigo-500" size={20} /> Candidate Pipeline
          </h2>
          
          <div className="space-y-7">
            {/* New */}
            <div className="group">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">1. New Applications</span>
                <span className="text-slate-900 dark:text-white font-black">{stats.pipeline.new}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80" 
                  style={{ width: `${(stats.pipeline.new / maxPipeline) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Shortlisted */}
            <div className="group">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">2. Shortlisted</span>
                <span className="text-slate-900 dark:text-white font-black">{stats.pipeline.shortlisted}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out delay-100 group-hover:opacity-80" 
                  style={{ width: `${(stats.pipeline.shortlisted / maxPipeline) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Interviewing */}
            <div className="group">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">3. Interviewing</span>
                <span className="text-slate-900 dark:text-white font-black">{stats.pipeline.interview}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out delay-200 group-hover:opacity-80" 
                  style={{ width: `${(stats.pipeline.interview / maxPipeline) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Rejected */}
            <div className="group">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">4. Rejected</span>
                <span className="text-slate-900 dark:text-white font-black">{stats.pipeline.rejected}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 h-full rounded-full transition-all duration-1000 ease-out delay-300 group-hover:opacity-80" 
                  style={{ width: `${(stats.pipeline.rejected / maxPipeline) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 🟢 TOP PERFORMING JOBS */}
        <div className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h2 className="text-xl font-black flex items-center gap-2 mb-6 text-slate-900 dark:text-white tracking-tight">
            <Activity className="text-pink-500" size={20} /> Top Performing Jobs
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {stats.topJobs.length === 0 ? (
              <p className="text-slate-500 text-sm font-bold text-center mt-10">No data available yet.</p>
            ) : (
              stats.topJobs.map((job, index) => (
                <Link key={job.id} href={`/employer/candidates?job=${job.id}`} className="block group">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800 group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-colors relative overflow-hidden">
                    {/* Rank Badge */}
                    <div className="absolute top-0 right-0 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-2 py-1 rounded-bl-lg">
                      #{index + 1}
                    </div>
                    
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm pr-6 truncate mb-2 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>{job.date}</span>
                      <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md">
                        <Users size={12} /> {job.applicantCount}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          {stats.topJobs.length > 0 && (
            <Link href="/employer/jobs" className="mt-6 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center justify-center gap-1 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
              View All Jobs <ChevronRight size={16} />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}