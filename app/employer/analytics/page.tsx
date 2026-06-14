"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { 
  BarChart3, Users, Briefcase, TrendingUp, 
  Loader2, MousePointerClick, Activity, ChevronRight,Lock,
  Filter, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
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

      // 🟢 NAYA VIP LOGIC: Workspace ID nikalo
      const { workspaceId } = await getActiveWorkspaceId(session.user.id);

      // 🟢 1. Sab se pehle Company ka Plan check karo!
      const { data: compData } = await supabase
        .from('companies')
        .select('plan_tier')
        .eq('employer_id', workspaceId) // 👈 Yahan workspaceId lagaya
        .single();

      const plan = compData?.plan_tier || 'Free';
      const hasAccess = ['Scale', 'Urgent', 'Bulk 5 Pack', 'Bulk 10 Pack'].includes(plan);
      
      setIsPremium(hasAccess);

      // 🚫 Agar access nahi hai, toh aagay data fetch hi mat karo (Database bachega!)
      if (!hasAccess) {
        setLoading(false);
        return; 
      }

      // 🟢 2. Fetch jobs + applications + AI Scores (Sirf premium walon ke liye)
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
          id, 
          title, 
          created_at,
          applications ( id, status, ai_match_score )
        `)
        .eq('employer_id', workspaceId); // 👈 Yahan bhi workspaceId lagaya

      if (error) throw error;
      if (jobsData) {
        let applicantsCount = 0;
        let totalScore = 0;
        let scoredAppsCount = 0;
        let pipelineCounts = { new: 0, shortlisted: 0, interview: 0, rejected: 0 };
        
        const jobsWithStats = jobsData.map(job => {
          const apps = job.applications || [];
          applicantsCount += apps.length;

          apps.forEach((app: any) => {
            const status = (app.status || 'New').toLowerCase();
            if (status === 'new') pipelineCounts.new++;
            else if (status === 'shortlisted') pipelineCounts.shortlisted++;
            else if (status === 'interview') pipelineCounts.interview++;
            else if (status === 'rejected') pipelineCounts.rejected++;
            else pipelineCounts.new++; 

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

        const sortedTopJobs = jobsWithStats.sort((a, b) => b.applicantCount - a.applicantCount).slice(0, 5);

        // 🟢 VIP JADOO: Conversion Rates Calculations
        const total = applicantsCount > 0 ? applicantsCount : 1; // Avoid divide by zero
        
        setStats({
          totalJobs: jobsData.length,
          totalApplicants: applicantsCount,
          avgMatchScore: scoredAppsCount > 0 ? Math.round(totalScore / scoredAppsCount) : 0, 
          pipeline: pipelineCounts,
          topJobs: sortedTopJobs,
          
          // 🟢 NAYA JADOO: Conversion Rates in State
          conversionRates: {
            toShortlist: Math.round(((pipelineCounts.shortlisted + pipelineCounts.interview) / total) * 100),
            toInterview: Math.round((pipelineCounts.interview / total) * 100),
            rejectionRate: Math.round((pipelineCounts.rejected / total) * 100)
          }
        } as any);
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
// 🟢 VIP JADOO: Locked State Paywall
  if (!isPremium) {
    return (
      <div className="max-w-3xl mx-auto mt-10 md:mt-20 p-8 md:p-16 bg-white dark:bg-[#111625] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Background Blur Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 shadow-inner">
          <Lock size={40} />
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 relative z-10 tracking-tight">
          Analytics are <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Locked</span>
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto relative z-10 font-medium">
          Upgrade to the <strong className="text-indigo-600 dark:text-indigo-400">Scale Plan</strong> to unlock deep insights into your hiring pipeline, candidate drop-off rates, and AI match score averages.
        </p>

        <Link 
          href="/employer/billing" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-indigo-500/30 hover:-translate-y-1 relative z-10"
        >
          <Sparkles size={20} /> Upgrade to Scale
        </Link>
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
          
          <div className="space-y-8">
            {/* New */}
            <div className="group relative">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Total Applications</span>
                <span className="text-slate-900 dark:text-white font-black">{stats.pipeline.new + stats.pipeline.shortlisted + stats.pipeline.interview + stats.pipeline.rejected}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80" 
                  style={{ width: '100%' }} // Total hamesha 100% hota hai
                ></div>
              </div>
            </div>

            {/* Down Arrow Indicator */}
            <div className="flex justify-center -my-3 relative z-10 opacity-50">
               <div className="bg-white dark:bg-[#111625] px-2 text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full">
                 {(stats as any).conversionRates?.toShortlist}% Pass Rate
               </div>
            </div>

            {/* Shortlisted */}
            <div className="group">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Shortlisted</span>
                <span className="text-slate-900 dark:text-white font-black">{stats.pipeline.shortlisted}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden shadow-inner flex justify-end">
                <div 
                  className="bg-gradient-to-l from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-out delay-100 group-hover:opacity-80" 
                  style={{ width: `${((stats.pipeline.shortlisted) / maxPipeline) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Down Arrow Indicator */}
            <div className="flex justify-center -my-3 relative z-10 opacity-50">
               <div className="bg-white dark:bg-[#111625] px-2 text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full">
                 {(stats as any).conversionRates?.toInterview}% Interview Rate
               </div>
            </div>

            {/* Interviewing */}
            <div className="group">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Interviewing</span>
                <span className="text-slate-900 dark:text-white font-black">{stats.pipeline.interview}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden shadow-inner flex justify-end">
                <div 
                  className="bg-gradient-to-l from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out delay-200 group-hover:opacity-80" 
                  style={{ width: `${(stats.pipeline.interview / maxPipeline) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Rejected Info Box (No Bar Needed) */}
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <Users size={14}/>
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rejected Candidates</p>
                   <p className="text-sm font-medium text-slate-400">Not a good fit</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-xl font-black text-slate-700 dark:text-slate-300">{stats.pipeline.rejected}</p>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{(stats as any).conversionRates?.rejectionRate}% Drop-off</p>
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
