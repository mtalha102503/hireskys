"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Layout, CheckCircle2, ArrowRight, Bot, Globe, 
  CreditCard, Briefcase, X, Star, Sparkles, TrendingUp,
  FileText, Building2, Zap, AlertOctagon, Layers
} from 'lucide-react';

export default function ATSLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-indigo-500/30">
      <Navbar />

      {/* 🚀 1. HERO SECTION */}
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-8 border border-indigo-200 dark:border-indigo-700/50 shadow-sm">
              <Briefcase size={16} className="text-indigo-500" />
              <span>Premium Remote Hiring Software</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
              Hire Remote Talent <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                Without the Chaos.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Ditch the messy email threads. Manage applications, filter candidates with AI, and track your hiring pipeline seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 flex items-center justify-center gap-2">
                Create Employer Account <ArrowRight size={20} />
              </Link>
              <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#111625] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-lg font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center shadow-sm">
                View ATS Plans
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ 2. THE 6 FEATURE CARDS */}
      <div className="container mx-auto px-4 pb-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Everything You Need to Hire Faster</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            We replaced clunky spreadsheets with a lightning-fast candidate management system designed specifically for modern remote-first companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1150px] mx-auto">
          {/* Feature 1: Kanban */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Layout size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Kanban Pipeline</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
              Visualize your entire hiring process. Instantly move candidates from "New" to "Interviewing" with a single click. No page reloads.
            </p>
          </div>

          {/* Feature 2: AI Scoring */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <Bot size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">AI Match Scoring</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
              Stop guessing who fits best. Our AI reads resumes and calculates an automated 1-100% Match Score based on your job requirements.
            </p>
          </div>

          {/* Feature 3: Location Alerts */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Globe size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Smart Location Alerts</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
              Hiring for a specific timezone? We instantly warn candidates and flag applicants whose country profile doesn't match your job's location.
            </p>
          </div>

          {/* Feature 4: CV Viewer */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Integrated CV Viewer</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
              Say goodbye to downloading messy PDFs. Read cover letters, view portfolios, and check GitHub links directly in a beautiful popup modal.
            </p>
          </div>

          {/* Feature 5: Company Profile */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Building2 size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Branded Profile Hub</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
              Build trust with applicants. Setup your company's bio, website, and primary remote HQ timezone from a centralized settings dashboard.
            </p>
          </div>

          {/* Feature 6: Secure & Fast */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Lightning Fast & Secure</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
              Your candidate data is locked down securely. The entire ATS is built on modern tech to guarantee zero lag while you manage hundreds of CVs.
            </p>
          </div>
        </div>
      </div>

      {/* 💳 3. PRICING PLANS SECTION */}
      <div id="pricing" className="container mx-auto px-4 py-16 scroll-mt-10">
        
        {/* 🟢 COST COMPARISON BANNER */}
        <div className="max-w-[1250px] mx-auto mb-20 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900/60 dark:to-purple-900/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
                <AlertOctagon size={14} /> The Industry Trap
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Stop paying $299/mo <br className="hidden md:block"/> just to read resumes.
              </h2>
              <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Other platforms lock your hiring data behind expensive, recurring monthly subscriptions. With HireSkys, you get full enterprise-level ATS power with <strong className="text-white underline decoration-pink-500 underline-offset-4 decoration-2">zero recurring fees</strong>.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 shrink-0">
              <div className="bg-black/20 backdrop-blur-sm p-6 rounded-3xl border border-white/10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                <span className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-2 block">Other Platforms</span>
                <span className="text-3xl font-black text-white/50 line-through decoration-red-500 decoration-4">$299<span className="text-xl">/mo</span></span>
                <span className="text-sm text-indigo-300 mt-2 font-medium">Monthly subscriptions</span>
              </div>
              
              <div className="bg-white dark:bg-[#0B0F19] p-6 rounded-3xl shadow-xl border-2 border-indigo-200 dark:border-indigo-700 flex flex-col justify-center items-center lg:items-start text-center lg:text-left transform sm:scale-110 z-10 rotate-1 hover:rotate-0 transition-transform duration-300">
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest mb-2 block flex items-center gap-1">
                  <Sparkles size={12} /> HireSkys Way
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                  $49<span className="text-xl text-slate-500 dark:text-slate-400">/post</span>
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> One-time payment
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16 animate-in fade-in duration-700 fill-mode-both">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
            ATS Hiring Packages
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-lg">
            Choose your hiring velocity. Pay once per job post.
          </p>
        </div>

        {/* 🟢 PRICING CARDS (Synced with Billing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-[1250px] mx-auto items-start">
          
          {/* TIER 0: FREE TRIAL */}
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden hover:-translate-y-2 group h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10 transition-colors duration-500">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Free Trial</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">
                Test our platform risk-free. Get 2 credits to start hiring immediately.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">$0</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" /> 
                  <span>5 Free Job Posts</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" /> 
                  <span>Basic Kanban Pipeline</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400 dark:text-slate-600 text-sm font-medium">
                  <X size={20} className="shrink-0 mt-0.5" /> 
                  <span>No Premium Features</span>
                </li>
              </ul>
              <Link href="/login?plan=trial" className="block w-full py-4 text-center rounded-xl font-bold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 transition-all duration-300 mt-auto">
                Claim 2 Credits
              </Link>
            </div>
          </div>

          {/* TIER 1: STARTUP ($49) */}
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-2 group h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151b2e]/50 transition-colors duration-500">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Startup</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">
                The essentials for lean teams to manage candidates effectively.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">$49</span>
                <span className="text-slate-500 font-medium mb-1">/post</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Unlimited Kanban Pipeline</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Smart App Forms (Location Check)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Shareable Link for Socials</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400 dark:text-slate-600 text-sm font-medium">
                  <X size={20} className="shrink-0 mt-0.5" /> 
                  <span>No AI Automation Features</span>
                </li>
              </ul>
              <Link href="/login?plan=startup" className="block w-full py-4 text-center rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all duration-300 mt-auto">
                Select Startup Plan
              </Link>
            </div>
          </div>

          {/* TIER 2: SCALE ($79) - HIGHLIGHTED */}
          <div className="bg-indigo-600 dark:bg-[#1A1F36] rounded-[2rem] border-2 border-indigo-400 shadow-2xl flex flex-col hover:shadow-indigo-500/30 transition-all duration-500 overflow-hidden relative transform xl:-translate-y-4 xl:scale-105 z-10 h-full">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            
            <div className="p-8 border-b border-indigo-500/30 bg-indigo-700/30 dark:bg-indigo-900/40 relative">
              <div className="absolute top-6 right-6 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star size={12} fill="currentColor" /> Most Popular
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2">Scale</h3>
              <p className="text-sm text-indigo-100 dark:text-indigo-200 min-h-[40px] pr-20">
                Automate your hiring with AI filtering and custom screening.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-white">$79</span>
                <span className="text-indigo-200 font-medium mb-1">/post</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-white text-sm font-medium">
                  <CheckCircle2 size={20} className="text-pink-400 shrink-0 mt-0.5" /> 
                  <span><strong className="text-white">Everything in Startup</strong>, plus:</span>
                </li>
                <li className="flex items-center gap-3 text-white text-sm font-bold bg-indigo-500/30 dark:bg-indigo-800/50 p-2.5 -ml-2.5 rounded-xl border border-indigo-400/30 shadow-inner transition-transform hover:scale-105">
                  <Bot size={20} className="text-pink-400 shrink-0" /> 
                  <span>AI Match Scoring Engine</span>
                </li>
                <li className="flex items-start gap-3 text-indigo-50 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-300 shrink-0 mt-0.5" /> 
                  <span>Embed Jobs on Career Page</span>
                </li>
                <li className="flex items-start gap-3 text-indigo-50 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-300 shrink-0 mt-0.5" /> 
                  <span>AI Job Description Generator</span>
                </li>
              </ul>
              <Link href="/login?plan=scale" className="block w-full py-4 text-center rounded-xl font-black bg-white text-indigo-600 hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.03] mt-auto">
                Select Scale Plan
              </Link>
            </div>
          </div>

          {/* TIER 3: URGENT ($99) */}
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-2 group h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151b2e]/50 transition-colors duration-500">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Urgent</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">
                Maximum priority, cross-posting, and dedicated support.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">$99</span>
                <span className="text-slate-500 font-medium mb-1">/post</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span><strong className="text-slate-900 dark:text-white">Everything in Scale</strong>, plus:</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 dark:text-white text-sm font-bold bg-amber-50 dark:bg-amber-900/20 p-2.5 -ml-2.5 rounded-xl border border-amber-200 dark:border-amber-800/40 transition-transform hover:scale-105">
                  <TrendingUp size={20} className="text-amber-500 shrink-0" /> 
                  <span>Promoted through our job board</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Dedicated Account Manager</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Priority 24/7 VIP Support</span>
                </li>
              </ul>
              <Link href="/login?plan=urgent" className="block w-full py-4 text-center rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all duration-300 mt-auto">
                Select Urgent Plan
              </Link>
            </div>
          </div>
        </div>

        {/* 📦 PREMIUM BULK PRICING BANNER */}
        <div className="max-w-[1250px] mx-auto mt-12 bg-slate-900 dark:bg-[#0B0F19] rounded-[2.5rem] border border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 relative overflow-hidden group">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="flex-1 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider mb-4 backdrop-blur-sm">
              <Layers size={14} className="text-indigo-400" /> Enterprise Option
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">
              Hiring at Scale? Buy in Bulk.
            </h3>
            <p className="text-slate-400 font-medium text-lg max-w-lg mx-auto lg:mx-0">
             Everything in Urgent plan plus; Lock in volume discounts with our <strong className="text-white">Scale Pass</strong>. Post whenever you want—your credits never expire.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto shrink-0 justify-center relative z-10">
            <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto shrink-0 justify-center relative z-10">
            
            {/* 5 Jobs Pack */}
            <div className="bg-slate-800/40 backdrop-blur-md px-6 py-6 rounded-3xl border border-slate-700 text-center flex flex-col justify-center hover:bg-slate-800/80 transition-colors min-w-[200px]">
              <div>
                <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">5 Job Pack</div>
                <div className="text-3xl font-black text-white mb-1">$445</div>
                <div className="text-sm font-medium text-slate-500">($89 / post)</div>
              </div>
              <Link href="/login?plan=bulk" className="mt-4 w-full py-3 bg-slate-700/80 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center">
                Select 5 Credits
              </Link>
            </div>
            
            {/* 10 Jobs Pack - Premium Highlight */}
            <div className="bg-gradient-to-b from-indigo-900/80 to-slate-900 px-6 py-6 rounded-3xl border border-indigo-500/50 text-center relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.2)] transform hover:scale-105 transition-transform duration-300 min-w-[220px]">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500"></div>
              <div className="absolute top-3 -right-8 bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-8 py-1 transform rotate-45 shadow-lg">
                Save 20%
              </div>
              
              <div>
                <div className="text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider mt-1">10 Job Pack</div>
                <div className="text-3xl font-black text-white mb-1">$790</div>
                <div className="text-sm font-medium text-indigo-300/70">($79 / post)</div>
              </div>
              <Link href="/login?plan=bulk" className="mt-4 w-full py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 text-sm">
                Get Bulk Credits <ArrowRight size={16} />
              </Link>
            </div>
            
          </div>
          </div>
        </div>

      </div>
    </div>
  );
}
