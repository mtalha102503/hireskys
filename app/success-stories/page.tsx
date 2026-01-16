"use client";
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Quote, Star, TrendingUp, Clock, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';

export default function SuccessStories() {
  
  // Placeholder Data (Future mein database se aa sakta hai)
  const stories = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Senior React Developer",
      company: "FinTech Startup (Remote)",
      image: "/story1.png", // Public folder mein image daalna
      quote: "I was tired of Upwork bidding wars. HireSkys' radar found a direct hiring tweet 10 minutes after it was posted. I emailed them, skipped the queue, and got hired in 3 days.",
      stats: [
        { label: "Time to Hire", value: "3 Days" },
        { label: "Salary Hike", value: "+40%" },
        { label: "Source", value: "Twitter Radar" }
      ]
    },
    {
      id: 2,
      name: "Omar Farooq",
      role: "Video Editor",
      company: "YouTuber (2M Subs)",
      image: "/story2.png",
      quote: "Most job boards only have corporate roles. HireSkys found a hidden post from a big YouTuber looking for an editor. It wasn't listed anywhere else. Now I'm on a $3k monthly retainer.",
      stats: [
        { label: "Time to Hire", value: "24 Hours" },
        { label: "Contract", value: "Retainer" },
        { label: "Source", value: "YouTube Community" }
      ]
    },
    {
      id: 3,
      name: "David Chen",
      role: "UX Designer",
      company: "SaaS Agency",
      image: "/story3.png",
      quote: "I applied to 50 jobs on LinkedIn and heard nothing. On HireSkys, I applied to 3 'Verified' jobs. Got 2 interviews the next day. The 'No-Scam' filter saves so much time.",
      stats: [
        { label: "Time to Hire", value: "1 Week" },
        { label: "Interviews", value: "2/3 Applications" },
        { label: "Source", value: "LinkedIn Deep Search" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-sm mb-4 animate-bounce">
            <Star size={16} className="fill-current" /> Real Results, Real People.
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            From "Hidden Gem" to <br className="hidden md:block" />
            <span className="text-indigo-600 dark:text-indigo-400">Hired in Record Time.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            See how smart freelancers and developers are skipping the competition by using the HireSkys Radar.
          </p>
        </div>

        {/* FEATURED STORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col h-full bg-white dark:bg-[#111625] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              
              {/* Image Header */}
              <div className="h-48 bg-slate-100 dark:bg-slate-900 relative">
                {/* User Image */}
                <div className="absolute -bottom-10 left-8">
                    <div className="h-20 w-20 rounded-2xl border-4 border-white dark:border-[#111625] bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-md">
                         <Image src={story.image} alt={story.name} fill className="object-cover" />
                         {/* Note: Agar image na ho to yahan fallback code laga dena */}
                    </div>
                </div>
                {/* Quote Icon Background */}
                <Quote className="absolute top-4 right-4 text-slate-200 dark:text-slate-800 h-24 w-24 opacity-50" />
              </div>

              {/* Content Body */}
              <div className="p-8 pt-12 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{story.name}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">{story.role}</p>
                    <p className="text-slate-400 text-xs mt-1">Hired at {story.company}</p>
                </div>

                <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed text-sm">
                  "{story.quote}"
                </p>

                <div className="mt-auto space-y-3">
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-4" />
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {story.stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{stat.label}</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* METRICS / TRUST BANNER */}
        <div className="bg-slate-900 dark:bg-indigo-950 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to be the next story?</h3>
                    <p className="text-indigo-200">The radar is scanning for opportunities right now.</p>
                </div>
                
                <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl text-green-400"><TrendingUp size={24}/></div>
                        <div>
                            <p className="text-2xl font-bold text-white">85%</p>
                            <p className="text-xs text-indigo-200">Interview Rate</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl text-blue-400"><Clock size={24}/></div>
                        <div>
                            <p className="text-2xl font-bold text-white">48h</p>
                            <p className="text-xs text-indigo-200">Avg. Discovery Time</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Button */}
            <div className="mt-8 md:mt-0 md:absolute md:right-12 md:top-1/2 md:-translate-y-1/2 hidden md:block">
                 {/* Layout adjust for mobile above */}
            </div>
        </div>

        {/* FINAL CTA */}
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Stop Searching. Start Scouting.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition flex items-center justify-center gap-2">
                    <Briefcase size={20} /> Browse Jobs
                </Link>
                <Link href="/share-story" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                    Post a Success Story <ArrowRight size={20} />
                </Link>
            </div>
        </div>

      </main>
    </div>
  );
}