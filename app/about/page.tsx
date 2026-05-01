import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'; // ✅ Supabase Import
import type { Metadata } from 'next';
import { Target, ShieldCheck, Linkedin, Rocket, Instagram, MapPin } from 'lucide-react';
import { XIcon } from 'lucide-react'; // X ko XIcon kar diya taake Next.js me masla na aye

// 🔥 SEO METADATA
export const metadata: Metadata = {
  title: 'About Us | The Radar for Remote Workers - HireSkys',
  description: 'Built by developers for the remote elite. We scout verified, active remote jobs with clear residency requirements. No fake listings, no office mandates.',
  alternates: {
    canonical: 'https://www.hireskys.com/about', 
  }
};

// 👇 Faster Page Load (1 ghante baad data refresh hoga automatically)
export const revalidate = 3600; 

export default async function AboutUs() {
  
  // 🟢 DYNAMIC COUNT LOGIC (Sirf Active Jobs ka Count laye ga bina sara data load kiye)
  const { count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true }) // head: true ka matlab sirf number laye ga, data nahi (Super Fast)
    .eq('active', true);

  // Agar database se count nahi aata toh fallback 500+ dikhaye ga
  const activeJobsCount = count || 500;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        
        {/* HERO SECTION - UPDATED FOR GEO-REMOTE FOCUS */}
        <div className="text-center mb-20 space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-4">
            <Rocket size={16} /> The Origin Story
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            We Built the Radar for <br className="hidden md:block" />
            <span className="text-indigo-600 dark:text-indigo-400">Remote & Freelance Elite.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            HireSkys wasn't built for office politics. It was built by developers who were tired of scrolling through fake listings and low-ball gigs. We decided to stop searching and start scouting verified <strong>Geo-Specific & Global Remote</strong> opportunities.
          </p>
        </div>

        {/* MISSION GRID - UPDATED FOR RESIDENCY REALITY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Remote-First Scouting</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              We don't just aggregate; we filter for freedom. Our radar specifically hunts for remote roles, whether they are strictly "Remote in specific country" or fully "Work From Anywhere".
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Verified Gigs Only</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Every job on HireSkys is manually verified. We filter out sneaky "hybrid" mandates and fake listings. If it requires a daily commute, it's not on our radar.
            </p>
          </div>

          {/* Card 3 (UPDATED: Clear Residency Focus) */}
          <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">No Residency Surprises</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Remote doesn't always mean global. If a company requires you to be a resident of India, UK, or any other country, we highlight that upfront so you never waste time applying to the wrong roles.
            </p>
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Meet the Minds
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              The duo behind the radar. We are developers, designers, and remote work advocates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            
            {/* FOUNDER & CEO */}
            <div className="group relative bg-white dark:bg-[#111625] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="aspect-square relative w-full h-100 bg-slate-200 dark:bg-slate-800">
                <Image 
                    src="/founder.png" 
                    alt="Founder & CEO"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Muhammad Talha</h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider mt-1">
                            Founder & CEO
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a href="https://www.linkedin.com/in/mtalha1025031" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-blue-500 hover:text-white transition">
                            <Linkedin size={18}/>
                        </a>
                        <a href="https://x.com/mtalhaexe" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-sky-500 hover:text-white transition">
                            <XIcon size={18}/>
                        </a>
                        <a href="https://www.instagram.com/mtalha.exe" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-pink-500 hover:text-white transition">
                            <Instagram size={18}/>
                        </a>
                    </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    The architect behind HireSkys. With a background in Shopify & Full Stack Development, he built the initial radar algorithm to solve his own frustration with finding quality remote work. Now, he leads the vision to make freelancing accessible to the elite.
                </p>
              </div>
            </div>

            {/* CO-FOUNDER */}
            <div className="group relative bg-white dark:bg-[#111625] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="aspect-square relative w-full h-100 bg-slate-200 dark:bg-slate-800">
                <Image 
                    src="/cofounder.jpeg" 
                    alt="Co-Founder"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Abdullah Zubair</h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider mt-1">
                            Co-Founder & COO
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-blue-500 hover:text-white transition"><Linkedin size={18}/></a>
                        <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-sky-500 hover:text-white transition"><XIcon size={18}/></a>
                    </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    The operations engine. He ensures that every job passing through the radar is verified and purely remote. His focus is on scaling the scout network and building partnerships with top-tier tech companies.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* STATS STRIP (🟢 UPDATED WITH DYNAMIC LIVE COUNT) */}
        <div className="bg-slate-900 dark:bg-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    {/* Yahan Direct Database ka count show ho raha hai */}
                    <h4 className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md text-emerald-400">{activeJobsCount}+</h4>
                    <p className="text-indigo-100 font-bold tracking-wide uppercase text-sm">Active Remote Roles</p>
                </div>
                <div>
                    <h4 className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md">12k+</h4>
                    <p className="text-indigo-100 font-bold tracking-wide uppercase text-sm">Freelancers Scouted</p>
                </div>
                <div>
                    <h4 className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md text-red-400">0</h4>
                    <p className="text-indigo-100 font-bold tracking-wide uppercase text-sm">Office Jobs Allowed</p>
                </div>
             </div>
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] z-0" />
             {/* Live Data Badge */}
             <div className="absolute top-4 right-6 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest">Live Sync</span>
             </div>
        </div>

      </main>
    </div>
  );
}
