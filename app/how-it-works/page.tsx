import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next'; // ✅ SEO type import
import { 
  Search, ShieldCheck, Zap, 
  CheckCircle, ArrowRight, Target, FileText, Send, AlertTriangle
} from 'lucide-react';

// 🔥 SEO METADATA FOR "HOW IT WORKS" PAGE
export const metadata: Metadata = {
  title: 'How It Works | Stop Applying to Ghost Jobs',
  description: 'Discover how HireSkys curates premium, verified remote jobs daily. We manually filter out ghost jobs and 3-month-old listings so you only apply to real roles less than 24 hours old. 100% Free.',
  keywords: ['how hireskys works', 'verified remote jobs', 'find real remote work', 'no ghost jobs', 'daily remote job drops', 'premium job curation'],
  alternates: {
    canonical: 'https://www.hireskys.com/how-it-works', // Apne actual route path ke mutabiq adjust karlena
  },
  openGraph: {
    title: 'How HireSkys Works | Premium Remote Jobs',
    description: 'We manually filter out ghost jobs so you only apply to roles less than 24 hours old. No signups, 100% free premium data.',
    url: 'https://www.hireskys.com/how-it-works',
    siteName: 'HireSkys',
    images: [{
      url: '/og-main.png', 
      width: 1200,
      height: 630,
      alt: 'How HireSkys curates remote jobs',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | HireSkys Premium Jobs',
    description: 'We manually filter out ghost jobs so you only apply to roles less than 24 hours old.',
  }
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#111625] text-white text-center">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm font-bold uppercase tracking-wide">
                  <ShieldCheck size={16} /> 100% Free • No Signup Required
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  Stop Applying to Ghost Jobs. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Get Today's Premium Roles.</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Other platforms waste your time with 3-month-old jobs disguised as "New". 
                  We hand-pick and manually format real global jobs daily. <strong className="text-white">Our Promise: No job is older than 24 hours.</strong>
              </p>
          </div>
      </div>

      {/* --- THE 4-STEP PROCESS (How we work for you) --- */}
      <div className="py-20 px-4 container mx-auto max-w-6xl">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Behind The Scenes 🛠️</h2>
              <p className="text-slate-500">How we deliver the most premium remote job data on the internet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">1</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center">
                          <Search size={28} />
                      </div>
                      <h3 className="text-xl font-bold">The Morning Scrape</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          Every morning, our custom scrapers hunt across the web to find only the latest global remote opportunities posted within the last few hours.
                      </p>
                  </div>
              </div>

              {/* Step 2 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">2</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                          <FileText size={28} />
                      </div>
                      <h3 className="text-xl font-bold">Manual Curation</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          We don't do automated junk. Our team manually reviews each job, removes spam, and formats the description beautifully so it's perfectly readable for you.
                      </p>
                  </div>
              </div>

              {/* Step 3 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">3</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-full flex items-center justify-center">
                          <Send size={28} />
                      </div>
                      <h3 className="text-xl font-bold">Daily Live Drops</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          Once our premium batch is formatted and verified, it goes live. Users with a profile also get an exclusive ping directly via <strong className="text-slate-700 dark:text-slate-300">Telegram</strong>. 
                      </p>
                  </div>
              </div>

              {/* Step 4 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">4</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center">
                          <Zap size={28} />
                      </div>
                      <h3 className="text-xl font-bold">Zero-Friction Apply</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          See a job you like? Apply directly. <strong className="text-slate-700 dark:text-slate-300">No account creation, no paywalls, no hidden fees.</strong> 100% free premium data, forever.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* --- THE REALITY CHECK (Why traditional boards suck) --- */}
      <div className="bg-[#111625] py-24 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-12">
                  
                  {/* Left Text */}
                  <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20">
                          <AlertTriangle size={14} /> The Industry Dirty Secret
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black">
                          The "Fake New" Trap. <br/>
                          <span className="text-indigo-400">Why your applications fail.</span>
                      </h2>
                      <p className="text-slate-400 text-lg leading-relaxed">
                          90% of job boards recycle dead jobs. They take roles that are 2 or 3 months old, slap a shiny "New" tag on them, and make you waste your energy applying to ghost positions. 
                      </p>
                      <ul className="space-y-4 mt-4">
                          <li className="flex items-start gap-3">
                              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                              <span><strong>The 24-Hour Rule:</strong> We promise that every single job on HireSkys is less than 1 day old. Period.</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                              <span><strong>Real Global Roles:</strong> We only curate high-quality, verified remote jobs from legitimate companies.</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                              <span><strong>Premium Formatting:</strong> We clean up messy job descriptions so you can instantly see the salary, requirements, and tech stack.</span>
                          </li>
                      </ul>
                  </div>

                  {/* Right Visual Card */}
                  <div className="flex-1 w-full">
                      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 p-8 rounded-3xl relative shadow-2xl">
                          <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">100% VERIFIED</div>
                          
                          <div className="space-y-6">
                              <div className="flex justify-between items-center text-sm text-slate-400 mb-2 border-b border-slate-800 pb-2">
                                  <span>Job Authenticity Check</span>
                                  <span>Listing Age</span>
                              </div>
                              
                              {/* Comparison Bar 1 - Bad Guys */}
                              <div>
                                  <div className="flex justify-between text-slate-300 font-bold text-sm mb-2">
                                      <span>Other Job Boards</span>
                                      <span className="text-red-400">2-3 Months Old</span>
                                  </div>
                                  <div className="w-full h-3 bg-slate-800 rounded-full flex">
                                      <div className="w-full h-3 bg-red-500/50 rounded-full flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('/stripe-pattern.svg')] opacity-20 mix-blend-overlay"></div>
                                      </div>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">Ghost jobs with fake "New" tags.</p>
                              </div>

                              {/* Comparison Bar 2 - HireSkys */}
                              <div className="pt-4 border-t border-slate-800">
                                  <div className="flex justify-between text-indigo-400 font-bold text-sm mb-2">
                                      <span className="flex items-center gap-2"><Target size={14}/> HireSkys Premium Data</span>
                                      <span className="text-emerald-400">&lt; 24 Hours</span>
                                  </div>
                                  <div className="w-full h-3 bg-slate-800 rounded-full relative overflow-hidden">
                                      <div className="absolute top-0 left-0 h-full w-[15%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 font-medium">Manually verified, fresh, and actively hiring.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10" />
              
              <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-black">Ready to apply to real jobs?</h2>
                  <p className="text-indigo-100 text-lg max-w-xl mx-auto">
                      Stop wasting your energy on closed positions. Browse today's manually verified, premium global roles completely free.
                  </p>
                  <div className="pt-4">
                      <Link href="/" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-indigo-600 font-extrabold rounded-xl shadow-xl hover:bg-slate-50 transition transform hover:-translate-y-1 w-full sm:w-auto">
                          Browse Today's Jobs <ArrowRight size={20}/>
                      </Link>
                  </div>
                  <p className="text-sm text-indigo-200 mt-4 opacity-80">
                      Zero signups. Zero hidden fees. 100% free premium data.
                  </p>
              </div>
          </div>
      </div>

    </div>
  );
}
