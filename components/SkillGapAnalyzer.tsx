"use client";
import Link from 'next/link';
import { CheckCircle2, XCircle, ExternalLink, BrainCircuit, TrendingUp, Clock } from 'lucide-react';
import { getCourseForSkill, getSafeSlug } from '@/lib/courseDirectory';

interface SkillGapAnalyzerProps {
  jobSkills: string[];
  userSkills: string[];
}

export default function SkillGapAnalyzer({ jobSkills, userSkills }: SkillGapAnalyzerProps) {
  const normalizedUserSkills = userSkills.map(s => s.trim().toLowerCase());
  
  const matchedSkills = jobSkills.filter(tag => 
    normalizedUserSkills.includes(tag.trim().toLowerCase())
  );
  
  const missingSkills = jobSkills.filter(tag => 
    !normalizedUserSkills.includes(tag.trim().toLowerCase())
  );

  const matchPercentage = jobSkills.length > 0 
    ? Math.round((matchedSkills.length / jobSkills.length) * 100) 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  const missingWithCourses = missingSkills.filter(skill => getCourseForSkill(skill));
  const missingWithoutCourses = missingSkills.filter(skill => !getCourseForSkill(skill));

  return (
    <div className="w-full bg-white dark:bg-[#0B0F19]/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg backdrop-blur-sm mt-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">AI Skill Match</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Based on your profile vs job requirements</p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold ${getScoreColor(matchPercentage)}`}>
          <TrendingUp className="w-5 h-5" />
          <span className="text-xl">{matchPercentage}% Match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ✅ MATCHED SKILLS SECTION */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            You Have ({matchedSkills.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.length > 0 ? (
              matchedSkills.map(skill => (
                <span key={skill} className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500 italic">No matching skills found.</span>
            )}
          </div>
        </div>

        {/* ❌ MISSING SKILLS & UPSELL SECTION */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            Missing Skills ({missingSkills.length})
          </h4>
          
          <div className="flex flex-col gap-4">
            
            {/* 1. VIP Affiliate Courses (Compact Rows) */}
            {missingWithCourses.length > 0 && (
              <div className="flex flex-col gap-2">
                {missingWithCourses.map(skill => {
                  const courseInfo = getCourseForSkill(skill)!;
                  return (
                    
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-400 group">
  
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

            {/* 2. Standard Missing Skills (Compact Red Chips) */}
            {missingWithoutCourses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {missingWithoutCourses.map(skill => (
                  <span key={skill} className="px-3 py-1.5 text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {missingSkills.length === 0 && (
              <span className="text-sm text-slate-500 italic">You meet all requirements! 🎉</span>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}