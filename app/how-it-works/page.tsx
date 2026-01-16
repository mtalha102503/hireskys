"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  Zap, Search, Bell, ShieldCheck, FileText, DollarSign, 
  Clock, CheckCircle, ArrowRight, Target, Database, Cpu 
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#111625] text-white text-center">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/50 text-indigo-300 text-sm font-bold uppercase tracking-wide">
                  <Cpu size={16} /> The HireSkys Engine
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  Stop Searching. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Start Applying.</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Most freelancers fail because they apply late. We fixed that. 
                  Our AI scans the web 24/7 so you never miss a verified opportunity.
              </p>
          </div>
      </div>

      {/* --- THE 4-STEP PROCESS (A to Z) --- */}
      <div className="py-20 px-4 container mx-auto max-w-6xl">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">From Signup to Salary 💸</h2>
              <p className="text-slate-500">Here is exactly how our system gets you hired.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">1</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center">
                          <Target size={28} />
                      </div>
                      <h3 className="text-xl font-bold">Smart Profiling</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          You don't just "sign up." You build a <strong>Smart Profile</strong>. Add your WhatsApp, skills, and take our specialized tests to earn the <span className="text-green-600 font-bold">Green Badge</span>.
                      </p>
                  </div>
              </div>

              {/* Step 2 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">2</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                          <Database size={28} />
                      </div>
                      <h3 className="text-xl font-bold">AI Scanners</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          We don't wait for employers. Our team scan <strong>Upwork, LinkedIn, & Job Boards</strong> gradually. We filter out spam and only pick high paying verified roles.
                      </p>
                  </div>
              </div>

              {/* Step 3 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">3</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                          <Zap size={28} />
                      </div>
                      <h3 className="text-xl font-bold">Instant Alert</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          The moment a job matches your skills, our system triggers a <strong>WhatsApp & Email</strong> alert immediately. Speed is our #1 priority.
                      </p>
                  </div>
              </div>

              {/* Step 4 */}
              <div className="relative p-8 bg-white dark:bg-[#151b2d] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:-translate-y-2 transition duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">4</div>
                  <div className="mt-6 space-y-4">
                      <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
                          <FileText size={28} />
                      </div>
                      <h3 className="text-xl font-bold">Apply & Win</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                          We send you a <strong>Pre-Written AI Proposal</strong> tailored to that specific job. You just Copy, Paste, and Apply before anyone else.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* --- THE SPEED DIFFERENCE (Why we don't miss jobs) --- */}
      <div className="bg-[#111625] py-24 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-12">
                  
                  {/* Left Text */}
                  <div className="flex-1 space-y-6">
                      <h2 className="text-3xl md:text-4xl font-black">
                          Why we never miss a job. <br/>
                          <span className="text-indigo-400">The "Zero Latency" Protocol.</span>
                      </h2>
                      <p className="text-slate-400 text-lg leading-relaxed">
                          Traditional job boards are slow. By the time you see a job, 50 people have already applied. 
                          HireSkys is different. We built a direct pipeline.
                      </p>
                      <ul className="space-y-4 mt-4">
                          <li className="flex items-center gap-3">
                              <CheckCircle className="text-green-500" size={20} />
                              <span><strong>Real-time Scraping:</strong> We update every minute.</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <CheckCircle className="text-green-500" size={20} />
                              <span><strong>WhatsApp API:</strong> Alerts land in your pocket instantly.</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <CheckCircle className="text-green-500" size={20} />
                              <span><strong>Pre-Vetted Clients:</strong> We filter out 90% of scams automatically.</span>
                          </li>
                      </ul>
                  </div>

                  {/* Right Visual Card */}
                  <div className="flex-1 w-full">
                      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 p-8 rounded-3xl relative">
                          <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">LIVE MONITORING</div>
                          
                          <div className="space-y-4">
                              <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                                  <span>Job Detection Speed</span>
                                  <span>Average Time</span>
                              </div>
                              
                              {/* Comparison Bar 1 */}
                              <div>
                                  <div className="flex justify-between text-white font-bold text-sm mb-1">
                                      <span>Other Platforms</span>
                                      <span>2 - 4 Hours Late</span>
                                  </div>
                                  <div className="w-full h-3 bg-slate-700 rounded-full">
                                      <div className="w-[80%] h-3 bg-slate-500 rounded-full"></div>
                                  </div>
                              </div>

                              {/* Comparison Bar 2 */}
                              <div>
                                  <div className="flex justify-between text-indigo-400 font-bold text-sm mb-1">
                                      <span className="flex items-center gap-2"><Zap size={14}/> HireSkys</span>
                                      <span>&lt; 2 Minutes</span>
                                  </div>
                                  <div className="w-full h-3 bg-slate-700 rounded-full relative overflow-hidden">
                                      <div className="absolute top-0 left-0 h-full w-[10%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                                  </div>
                              </div>
                          </div>

                          <div className="mt-8 p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-4">
                              <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                                  <Bell size={24} />
                              </div>
                              <div>
                                  <p className="text-xs text-slate-400">System Status</p>
                                  <p className="font-bold text-white">Detecting Jobs...</p>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto bg-indigo-600 text-white rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10" />
              
              <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-black">Ready to beat the competition?</h2>
                  <p className="text-indigo-100 text-lg">
                      Join 5,000+ elite freelancers who stopped searching and started earning.
                  </p>
                  <Link href="/login?view=signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition transform hover:-translate-y-1">
                      Start For Free <ArrowRight size={20}/>
                  </Link>
              </div>
          </div>
      </div>

    </div>
  );
}