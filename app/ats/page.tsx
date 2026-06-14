"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Layout, CheckCircle2, ArrowRight, Bot, Globe, 
  CreditCard, Briefcase, X, Star, Sparkles, TrendingUp,
  FileText, Building2, Zap, AlertOctagon, Layers, HelpCircle, Users, CalendarDays, Mail,ChevronDown
} from 'lucide-react';
const TRUSTED_COMPANIES = [
  { name: "Confluent", domain: "Confluent.io" },
  { name: "Distro", domain: "distro.io" },
  { name: "Motive", domain: "gomotive.com" },
  { name: "Alphasense", domain: "alpha-sense.com" },
  { name: "Discord", domain: "discord.com" },
  { name: "Render", domain: "render.com" },
  { name: "Notion", domain: "notion.so" },
  { name: "Slack", domain: "slack.com" },
  { name: "Linear", domain: "linear.app" },
  { name: "Netflix", domain: "netflix.com" }
];
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

      {/* 🛡️ PREMIUM INFINITE SCROLL TRUST BANNER */}
      <div className="border-y border-slate-200/60 dark:border-slate-800/50 bg-white/40 dark:bg-[#111625]/40 backdrop-blur-md py-12 mb-24 overflow-hidden relative">
        {/* Custom CSS for Marquee Animation */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="container mx-auto px-4 text-center mb-10">
          <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
            Empowering Teams with True Borderless Curation Standards
          </p>
        </div>
        
        {/* Infinite Scroll Container */}
        <div className="relative w-full max-w-7xl mx-auto flex items-center">
          {/* Edge Gradients for Smooth Fade (Right & Left) */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-slate-50 dark:from-[#0B0F19] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-slate-50 dark:from-[#0B0F19] to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Track */}
          <div className="flex animate-marquee w-max items-center gap-12 md:gap-20 px-6">
            {/* Array is mapped TWICE to create a seamless loop */}
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map((company, index) => (
              <div key={index} className="flex items-center gap-3 group cursor-pointer">
                {/* Logo Icon */}
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 bg-white flex items-center justify-center p-1.5 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <img 
                    src={`https://img.logo.dev/${company.domain}?token=pk_aH9IPqwYQqW08DI-epK7yw&size=200&format=png`} 
                    alt={company.name} 
                    className="h-full w-full object-contain"
                  />
                </div>
                {/* Company Name */}
                <span className="text-lg font-black text-slate-700 dark:text-slate-300 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✨ 2. THE ALTERNATING FEATURE SECTIONS (ZIG-ZAG LAYOUT) */}
      <div className="container mx-auto px-4 pb-32">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Everything You Need to Hire Faster</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-lg">
            We replaced clunky spreadsheets with a lightning-fast candidate management system designed specifically for modern remote-first companies.
          </p>
        </div>
        
        <div className="flex flex-col gap-32 max-w-[1150px] mx-auto">
          
          {/* 🚀 Feature 1: Kanban (Text Left, Illustration Right) */}
          <div className="flex flex-col md:flex-row items-center gap-12 group">
            <div className="flex-1 space-y-6 md:pr-10">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm">
                <Layout size={28} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Visual Kanban Pipeline</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg font-medium">
                Visualize your entire hiring process. Instantly move candidates from "New" to "Interviewing" with a single smooth drag-and-drop. No page reloads, just pure speed.
              </p>
            </div>
{/* 🎥 Video Player Container */}
<div className="flex-1 w-full h-[350px] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.02] bg-slate-100 dark:bg-slate-900">
  
  {/* 🌞 Light Mode Video (Dark mode mein hide ho jayegi) */}
  <video 
    autoPlay 
    muted 
    loop 
    playsInline 
    className="w-full h-full object-cover object-left-top block dark:hidden"
  >
    <source src="/kanban-light.mp4" type="video/mp4" />
  </video>

  {/* 🌙 Dark Mode Video (Light mode mein hide rahey gi) */}
  <video 
    autoPlay 
    muted 
    loop 
    playsInline 
    className="w-full h-full object-cover object-left-top hidden dark:block"
  >
    <source src="/kanban-dark.mp4" type="video/mp4" />
  </video>

</div>
          </div>

          {/* 🚀 Feature 2: AI Scoring (Illustration Left, Text Right) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
            {/* 🚀 Feature 2: AI Scoring (Illustration Left, Text Right) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
            <div className="flex-1 space-y-6 md:pl-10">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm">
                <Bot size={28} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">AI Match Scoring</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg font-medium">
                Stop guessing who fits best. Our AI reads resumes and calculates an automated 1-100% Match Score based on your job requirements. Filter out the noise instantly.
              </p>
            </div>
            
            {/* 🎥 Video Player Container for AI Match */}
<div className="flex-1 w-full h-[350px] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.02] bg-slate-50 dark:bg-[#111625] flex items-center justify-center p-6 md:p-8">
  
  {/* 🌞 Light Mode Video */}
  <video 
    autoPlay 
    muted 
    loop 
    playsInline 
    className="w-full h-full object-contain rounded-xl drop-shadow-2xl block dark:hidden"
  >
    <source src="/ai-match-light.mp4" type="video/mp4" />
  </video>

  {/* 🌙 Dark Mode Video */}
  <video 
    autoPlay 
    muted 
    loop 
    playsInline 
    className="w-full h-full object-contain rounded-xl drop-shadow-2xl hidden dark:block"
  >
    <source src="/ai-match-dark.mp4" type="video/mp4" />
  </video>

</div>
          </div>
            {/* CSS Illustration */}
            <div className="flex-1 w-full h-[350px] bg-gradient-to-tr from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
              {/* Center Core */}
              <div className="relative z-10 w-32 h-32 bg-white dark:bg-slate-900 rounded-full shadow-2xl border-4 border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center z-20 group-hover:shadow-emerald-500/30 transition-all duration-700">
                <Bot size={48} className="text-emerald-500 animate-pulse" />
              </div>
              {/* Orbital Rings */}
              <div className="absolute w-64 h-64 border border-emerald-200 dark:border-emerald-800/50 rounded-full group-hover:rotate-180 transition-transform duration-[3s] ease-linear"></div>
              <div className="absolute w-96 h-96 border border-dashed border-emerald-200 dark:border-emerald-800/30 rounded-full group-hover:-rotate-90 transition-transform duration-[4s] ease-linear"></div>
              {/* Floating Badges */}
              <div className="absolute top-1/4 left-8 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 font-black text-emerald-600 dark:text-emerald-400 transform group-hover:-translate-y-4 transition-transform duration-500">
                98% Match
              </div>
              <div className="absolute bottom-1/4 right-8 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 text-sm transform group-hover:translate-y-4 transition-transform duration-500 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500"/> React.js
              </div>
            </div>
          </div>

          {/* 🚀 Feature 3: Smart Location (Text Left, Illustration Right) */}
          <div className="flex flex-col md:flex-row items-center gap-12 group">
            <div className="flex-1 space-y-6 md:pr-10">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center shadow-sm">
                <Globe size={28} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Smart Location Alerts</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg font-medium">
                Hiring for a specific timezone? We instantly warn candidates and flag applicants whose country profile doesn't match your job's required location.
              </p>
            </div>
            
            {/* CSS Illustration */}
            <div className="flex-1 w-full h-[350px] bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-[#111625] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
              <Globe size={180} className="text-orange-200 dark:text-orange-900/30 group-hover:rotate-45 transition-transform duration-1000" strokeWidth={1} />
              
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Good Pin */}
                <div className="absolute -mt-20 ml-20 bg-white dark:bg-slate-800 p-2 rounded-full shadow-xl border border-slate-100 dark:border-slate-700 transform group-hover:scale-110 transition-transform delay-100">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full relative"></div>
                </div>
                {/* Warning Card */}
                <div className="absolute mt-24 -ml-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-rose-100 dark:border-rose-900/50 flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center">
                    <AlertOctagon size={16} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">Timezone Alert</div>
                    <div className="text-[10px] font-bold text-rose-500">Candidate in UTC+8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
{/* ----------------------------------------------------- */}
          {/* 🍱 THE BENTO GRID (POWER FEATURES) */}
          {/* ----------------------------------------------------- */}
          
          <div className="pt-20">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">More Power, Less Clutter.</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-lg">
                Everything else you need is packed into a seamless, enterprise-grade experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1150px] mx-auto">
              
             {/* 🚀 BENTO 1: Automated Interviews (WIDE - 2 Columns) */}
              <div className="md:col-span-2 bg-white dark:bg-[#111625] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-500">
                {/* 👇 YAHAN SE CHANGE KIYA HAI (h-72, p-6, object-contain) 👇 */}
                <div className="h-72 bg-slate-50 dark:bg-[#0B0F19] relative flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800 p-6 md:p-8">
                  
                  {/* 🌞 Light Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl block dark:hidden">
                    <source src="/automated-interviews-light.mp4" type="video/mp4" />
                  </video>
                  
                  {/* 🌙 Dark Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl hidden dark:block">
                    <source src="/automated-interviews-dark.mp4" type="video/mp4" />
                  </video>

                </div>
                {/* 👆 YAHAN TAK 👆 */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <CalendarDays size={20} className="text-blue-500" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Automated Interviews</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Connect Google Calendar, Outlook, or Calendly. Drag a candidate to "Interviewing" and our system will automatically email them your booking link.
                  </p>
                </div>
              </div>

              {/* 🚀 BENTO 2: Custom Email Templates (SQUARE - 1 Column) */}
              <div className="md:col-span-1 bg-white dark:bg-[#111625] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-500">
                {/* 👇 YAHAN SE CHANGE KIYA HAI (h-72, p-6, object-contain) 👇 */}
                <div className="h-72 bg-slate-50 dark:bg-[#0B0F19] relative flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800 p-6 md:p-8">
                  
                  {/* 🌞 Light Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl block dark:hidden">
                    <source src="/email-template-light.mp4" type="video/mp4" />
                  </video>
                  
                  {/* 🌙 Dark Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl hidden dark:block">
                    <source src="/email-template-dark.mp4" type="video/mp4" />
                  </video>

                </div>
                {/* 👆 YAHAN TAK 👆 */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail size={20} className="text-fuchsia-500" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Custom Templates</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                    Write your own interview invite emails using smart variables. Every candidate gets a personalized message perfectly tailored to your brand.
                  </p>
                </div>
              </div>

              {/* 🚀 BENTO 3: Team Collab (SQUARE - 1 Column) */}
              <div className="md:col-span-1 bg-white dark:bg-[#111625] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-500">
                <div className="h-72 bg-slate-50 dark:bg-[#0B0F19] relative flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800 p-6 md:p-8">
                  
                  {/* 🌞 Light Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl block dark:hidden">
                    <source src="/team-access-light.mp4" type="video/mp4" />
                  </video>
                  
                  {/* 🌙 Dark Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl hidden dark:block">
                    <source src="/team-access-dark.mp4" type="video/mp4" />
                  </video>

                </div>
                <div className="p-8 flex-1 flex flex-col pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={18} className="text-fuchsia-500" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Team Access</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                    Invite recruiters and managers to review and hire together.
                  </p>
                </div>
              </div>

              {/* 🚀 BENTO 4: CV Viewer (SQUARE - 1 Column) */}
              <div className="md:col-span-1 bg-white dark:bg-[#111625] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-500">
                <div className="h-72 bg-slate-50 dark:bg-[#0B0F19] relative flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800 p-6 md:p-8">
                  
                  {/* 🌞 Light Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl block dark:hidden">
                    <source src="/cv-viewer-light.mp4" type="video/mp4" />
                  </video>
                  
                  {/* 🌙 Dark Mode Video */}
                  <video autoPlay muted loop playsInline className="w-full h-full object-contain rounded-xl drop-shadow-2xl hidden dark:block">
                    <source src="/cv-viewer-dark.mp4" type="video/mp4" />
                  </video>

                </div>
                <div className="p-8 flex-1 flex flex-col pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={18} className="text-pink-500" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Built-in CV Viewer</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                    Read cover letters and view portfolios in a distraction-free popup.
                  </p>
                </div>
              </div>

              {/* 🚀 BENTO 5: Profile Hub (SQUARE - 1 Column) */}
              <div className="md:col-span-1 bg-white dark:bg-[#111625] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group flex flex-col hover:-translate-y-1 transition-transform duration-500">
                <div className="h-48 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/10 relative flex items-center justify-center overflow-hidden px-8">
                  <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                    <div className="h-10 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                    <div className="p-4 pt-2">
                      <div className="h-2 w-1/3 bg-slate-800 dark:bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-1"></div>
                      <div className="h-1.5 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 size={18} className="text-cyan-500" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Profile Hub</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                    Build trust with applicants using a central company bio and settings.
                  </p>
                </div>
              </div>

            </div>
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

              {/* 🟢 VIP JADOO: Naya Growth Hack Link yahan add kiya */}
              <div className="mt-6 text-center lg:text-left">
                <Link 
                  href="/blog/zero-budget-hiring-guide" 
                  className="inline-flex items-center gap-2 text-sm font-black text-white hover:text-pink-200 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full transition-all border border-white/10 shadow-sm"
                >
                  <Sparkles size={14} className="text-pink-400 animate-pulse" />
                  Read our Zero-Budget Hiring Guide &rarr;
                </Link>
              </div>
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
              <div className="mb-4 text-center">
                <Link 
                  href="/blog/zero-budget-hiring-guide" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <HelpCircle size={12} /> Learn how to promote for 100% free
                </Link>
              </div>
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
{/* 🙋‍♂️ 4. FREQUENTLY ASKED QUESTIONS (FAQs) */}
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">Got Questions?</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            Everything you need to know about HireSkys ATS and billing.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* FAQ 1 */}
          <details className="group bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm [&_summary::-webkit-details-marker]:hidden open:border-indigo-300 dark:open:border-indigo-700 transition-colors duration-300">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-slate-900 dark:text-white select-none">
              Is there a monthly subscription fee?
              <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full">
                <ChevronDown size={20} />
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              No! Unlike traditional ATS platforms that trap you in expensive $299/month contracts, HireSkys uses a pay-per-post model. You only pay when you actively need to hire, with zero recurring hidden fees.
            </div>
          </details>

          {/* FAQ 2 */}
          <details className="group bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm [&_summary::-webkit-details-marker]:hidden open:border-indigo-300 dark:open:border-indigo-700 transition-colors duration-300">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-slate-900 dark:text-white select-none">
              How do the free trial credits work?
              <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full">
                <ChevronDown size={20} />
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              When you create a new employer account, we instantly credit your account with 2 Free Job Posts. You can publish jobs, manage candidates on the Kanban board, and test our core features completely free without entering a credit card.
            </div>
          </details>

          {/* FAQ 3 */}
          <details className="group bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm [&_summary::-webkit-details-marker]:hidden open:border-indigo-300 dark:open:border-indigo-700 transition-colors duration-300">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-slate-900 dark:text-white select-none">
              Do my bulk job credits expire?
              <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full">
                <ChevronDown size={20} />
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Never. If you purchase a 5-Pack or 10-Pack Enterprise bundle to lock in the volume discount, those credits will stay in your account forever until you decide to use them.
            </div>
          </details>

          {/* FAQ 4 */}
          <details className="group bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm [&_summary::-webkit-details-marker]:hidden open:border-indigo-300 dark:open:border-indigo-700 transition-colors duration-300">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-slate-900 dark:text-white select-none">
              Can I post hybrid or on-site jobs?
              <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full">
                <ChevronDown size={20} />
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              No. HireSkys is strictly a 100% remote job platform. We manually review every job post to ensure it meets our remote-only standard. This maintains high trust with our global talent pool and ensures you only get applicants looking for remote work.
            </div>
          </details>

          {/* FAQ 5 */}
          <details className="group bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm [&_summary::-webkit-details-marker]:hidden open:border-indigo-300 dark:open:border-indigo-700 transition-colors duration-300">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-slate-900 dark:text-white select-none">
              How does the AI Match Scoring work?
              <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full">
                <ChevronDown size={20} />
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Available on the Scale and Urgent plans, our AI engine automatically analyzes the candidate's resume, screening answers, and location against your original job description. It generates a 1-100% match score instantly, saving you hours of manual screening.
            </div>
          </details>

        </div>
      </div>
      </div>
    </div>
  );
}
