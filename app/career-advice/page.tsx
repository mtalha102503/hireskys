"use client";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BookOpen, Monitor, DollarSign, ShieldAlert, CheckCircle2, ArrowRight, Lightbulb, PenTool } from 'lucide-react';

export default function CareerAdvice() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm mb-4">
            <BookOpen size={16} /> The Remote Playbook
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Don't Just Apply. <br className="hidden md:block" />
            <span className="text-indigo-600 dark:text-indigo-400">Audition for the Role.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The remote market is competitive. Here is the elite strategy to skip the queue, ace the interview, and negotiate like a pro.
          </p>
        </div>

        {/* FEATURED GUIDE (Large Card) */}
        <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 mb-20 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <div className="inline-block bg-indigo-700 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                        Featured Guide
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                        The "6-Second" Resume Rule: How to pass the ATS Scanner
                    </h2>
                    <p className="text-indigo-200 text-lg leading-relaxed">
                        Recruiters scan resumes in 6 seconds. If your skills aren't visible, you're out. Learn the exact keyword strategy we use to get our candidates past the bots.
                    </p>
                    
                    {/* 👇 LINK ADDED HERE */}
                    <Link href="/career-advice/resume-rule">
                        <button className="flex items-center gap-2 font-bold text-white border-b-2 border-white/20 pb-1 hover:border-white transition w-fit">
                            Read Full Guide <ArrowRight size={18} />
                        </button>
                    </Link>

                </div>
                {/* Visual Graphic */}
                <div className="flex-1 w-full max-w-sm bg-white text-slate-900 p-6 rounded-xl shadow-lg rotate-2 hover:rotate-0 transition duration-500">
                    <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                        <div className="h-10 w-10 bg-slate-200 rounded-full" />
                        <div>
                            <div className="h-3 w-32 bg-slate-200 rounded mb-2" />
                            <div className="h-2 w-20 bg-slate-100 rounded" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-3/4 bg-slate-100 rounded" />
                    </div>
                    <div className="mt-6 p-3 bg-green-50 text-green-700 text-sm font-bold rounded-lg flex items-center gap-2">
                        <CheckCircle2 size={16} /> ATS Score: 98/100
                    </div>
                </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 z-0" />
        </div>

        {/* STRATEGY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            
            {/* Card 1: Interview */}
            {/* 👇 LINK ADDED & WRAPPED AROUND CARD */}
            <Link href="/career-advice/zoom-interview" className="group block">
                <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition h-full">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <Monitor size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Mastering the Zoom Interview</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                        Eye contact, lighting, and the "cheat sheet" method. How to look confident even if you're nervous.
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Tips <ArrowRight size={14} />
                    </span>
                </div>
            </Link>

            {/* Card 2: Negotiation */}
            <Link href="/career-advice/salary-negotiation" className="group block">
                <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition h-full">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <DollarSign size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Salary Negotiation Scripts</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                        Never say the first number. Use these exact scripts to increase your offer by 10-20% without losing the job.
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Get Scripts <ArrowRight size={14} />
                    </span>
                </div>
            </Link>

            {/* Card 3: Scams */}
            <Link href="/career-advice/ghost-jobs" className="group block">
                <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition h-full">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Spotting Ghost Jobs</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                        Some jobs are fake. Learn to spot generic emails, Telegram interviews, and requests for "training fees".
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Stay Safe <ArrowRight size={14} />
                    </span>
                </div>
            </Link>

            {/* Card 4: Portfolio */}
            <Link href="/career-advice/portfolio-guide" className="group block">
                <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition h-full">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <PenTool size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">The "Proof of Work" Portfolio</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                        Don't just tell them you can code/write. Show them. How to build a portfolio even if you have zero clients.
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Build Portfolio <ArrowRight size={14} />
                    </span>
                </div>
            </Link>

            {/* Card 5: Tools */}
            <Link href="/career-advice/tools-trade" className="group block">
                <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition h-full">
                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <Lightbulb size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Tools of the Trade</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                        Slack, Jira, Loom, Notion. If you know these tools before joining, you're already ahead of 50% of applicants.
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        See Tools <ArrowRight size={14} />
                    </span>
                </div>
            </Link>

        </div>

        {/* CHECKLIST SECTION */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                        Are you "Hire-Ready"?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
                        Before you send your next application, make sure you can check all these boxes. This simple checklist doubles your response rate.
                    </p>
                    <Link href="/" className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition inline-block">
                        Find Jobs Now
                    </Link>
                </div>
                
                <div className="flex-1 w-full bg-white dark:bg-[#111625] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                    {[
                        "Resume is PDF (not Word)",
                        "LinkedIn Profile matches Resume",
                        "Portfolio link is working",
                        "Cover Letter is customized (not AI copy-paste)",
                        "Checked company reviews on Glassdoor"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-default">
                            <div className="h-6 w-6 rounded-full border-2 border-indigo-500 flex items-center justify-center text-indigo-500">
                                <CheckCircle2 size={14} className="opacity-0 hover:opacity-100 transition" />
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}