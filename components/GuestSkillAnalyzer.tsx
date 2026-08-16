"use client";
import Link from 'next/link';
import { ExternalLink, BrainCircuit, Lock, Clock } from 'lucide-react';
import { getCourseForSkill, getSafeSlug } from '@/lib/courseDirectory';

interface GuestSkillAnalyzerProps {
  jobSkills: string[];
}

export default function GuestSkillAnalyzer({ jobSkills }: GuestSkillAnalyzerProps) {
  const skillsWithCourses = jobSkills.filter(skill => getCourseForSkill(skill));
  const normalSkills = jobSkills.filter(skill => !getCourseForSkill(skill));

  if (jobSkills.length === 0) return null;

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0B0F19]/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm mt-8 relative overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-200 dark:bg-slate-800 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Key Skills Required</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Master these to land this role</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        
        {/* 1. VIP Affiliate Courses (Compact Rows) */}
        {skillsWithCourses.length > 0 && (
          <div className="flex flex-col gap-2 mb-2">
            {skillsWithCourses.map(skill => {
              const courseInfo = getCourseForSkill(skill)!;
              return (
                <div key={skill} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#111625] rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-400">
  
  {/* 👇 LEFT SIDE: Skill Name + Duration + Badge */}
  <div className="flex flex-wrap items-center gap-2.5">
    <span className="font-bold text-slate-900 dark:text-white text-sm">
      {skill}
    </span>
    
    {/* 🕒 NAYA: Time / Duration Badge */}
    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
      <Clock size={12} />
      {courseInfo.duration}
    </span>

    {/* ✨ FREE TRIAL BADGE (Emoji fixed) */}
    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-sm whitespace-nowrap">
      Free Trial ✨
    </span>
  </div>
  
  {/* 👇 RIGHT SIDE: Button */}
  <Link 
    href={`/go/${getSafeSlug(skill)}`} 
    target="_blank" 
    className="w-full sm:w-auto text-xs font-bold px-4 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 group-hover:shadow-md"
  >
    Start 10-Day Free Trial <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
  </Link>
</div>
              );
            })}
          </div>
        )}

        {/* 2. Normal Skills (Small Chips) */}
        {normalSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {normalSkills.map(skill => (
              <span key={skill} className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* 🚀 SIGNUP CTA BANNER */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-indigo-500/20 rounded-full text-indigo-500 flex-shrink-0">
               <Lock size={16} />
             </div>
             <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
               Want to know if you're a match for this job?
             </p>
          </div>
          <Link href="/login" className="whitespace-nowrap px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto text-center">
            Calculate My Match Score
          </Link>
        </div>
      </div>

    </div>
  );
}