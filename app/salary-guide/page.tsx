"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  DollarSign, TrendingUp, Globe, Code, PenTool, BarChart3, 
  ArrowRight, Search, Smartphone, Video, Layout, Edit3, Cpu, Info, 
  Calculator, CheckCircle, Flame, Share2, Copy, Check
} from 'lucide-react';

// --- 📊 COMPLETE SALARY DATA (BASE ANNUAL) ---
const SALARY_DATA: Record<string, any> = {
  "Development": {
    icon: Code,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    roles: [
      { title: "React Developer", us: 135000, global: 70000, demand: "High Demand" },
      { title: "Next.js Engineer", us: 145000, global: 80000, demand: "🔥 Exploding" },
      { title: "Node.js Backend", us: 130000, global: 75000, demand: "High Demand" },
      { title: "Python Developer", us: 140000, global: 85000, demand: "Very High" },
      { title: "Shopify Developer", us: 110000, global: 55000, demand: "Stable" },
      { title: "WordPress Dev", us: 90000, global: 45000, demand: "Steady" },
      { title: "Web3 / Blockchain", us: 180000, global: 110000, demand: "Volatile" },
      { title: "Frontend Engineer", us: 125000, global: 65000, demand: "High Demand" },
      { title: "Backend Engineer", us: 135000, global: 75000, demand: "High Demand" },
    ]
  },
  "Mobile App": {
    icon: Smartphone,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
    roles: [
      { title: "React Native", us: 130000, global: 70000, demand: "High Demand" },
      { title: "Flutter Developer", us: 115000, global: 65000, demand: "Rising" },
      { title: "iOS (Swift)", us: 140000, global: 80000, demand: "Stable" },
      { title: "Android (Kotlin)", us: 135000, global: 75000, demand: "Stable" },
    ]
  },
  "New Era (AI)": {
    icon: Cpu,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    roles: [
      { title: "AI Engineer", us: 220000, global: 140000, demand: "🚀 Nuclear" },
      { title: "Automation Expert", us: 130000, global: 80000, demand: "🔥 Exploding" },
      { title: "LLM Specialist", us: 250000, global: 160000, demand: "🚀 Nuclear" },
      { title: "Python Scripting", us: 110000, global: 60000, demand: "High Demand" },
    ]
  },
  "Video & Motion": {
    icon: Video,
    color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    roles: [
      { title: "Video Editor", us: 85000, global: 45000, demand: "High Demand" },
      { title: "Premiere Pro Expert", us: 90000, global: 50000, demand: "Stable" },
      { title: "After Effects", us: 100000, global: 60000, demand: "High Demand" },
      { title: "3D Artist", us: 110000, global: 65000, demand: "Rising" },
      { title: "Thumbnail Artist", us: 60000, global: 35000, demand: "🔥 Viral" },
      { title: "Short Form Editor", us: 80000, global: 45000, demand: "🔥 Exploding" },
    ]
  },
  "Design & UI": {
    icon: Layout,
    color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400",
    roles: [
      { title: "UI/UX Designer", us: 115000, global: 65000, demand: "High Demand" },
      { title: "Figma Expert", us: 100000, global: 55000, demand: "Very High" },
      { title: "Web Design", us: 95000, global: 50000, demand: "Stable" },
      { title: "Logo Design", us: 80000, global: 40000, demand: "Saturated" },
      { title: "Graphic Design", us: 75000, global: 35000, demand: "Steady" },
    ]
  },
  "Marketing": {
    icon: Globe,
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
    roles: [
      { title: "SEO Specialist", us: 95000, global: 50000, demand: "High Demand" },
      { title: "Facebook Ads", us: 105000, global: 60000, demand: "Very High" },
      { title: "Google Ads", us: 110000, global: 65000, demand: "Stable" },
      { title: "Email Marketing", us: 90000, global: 50000, demand: "Rising" },
      { title: "Copywriter", us: 100000, global: 55000, demand: "High Demand" },
      { title: "Growth Hacker", us: 140000, global: 85000, demand: "🔥 Exploding" },
    ]
  },
  "Writing": {
    icon: Edit3,
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
    roles: [
      { title: "Ghostwriter", us: 120000, global: 70000, demand: "🔥 Viral" },
      { title: "Technical Writer", us: 110000, global: 60000, demand: "Stable" },
      { title: "Scriptwriter", us: 95000, global: 50000, demand: "Rising" },
      { title: "Content Writer", us: 75000, global: 40000, demand: "Saturated" },
    ]
  }
};

// --- 🔢 PPP DATA ---
const PPP_RATES: Record<string, number> = {
    "Pakistan": 4.5, "India": 4.2, "Nigeria": 4.0, "Philippines": 3.8,
    "Brazil": 3.2, "Eastern Europe": 2.5, "UK": 1.1, "Canada": 1.2
};

export default function SalaryGuide() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly' | 'hourly'>('yearly');
  const [copied, setCopied] = useState(false);
  
  // Calculator State
  const [salaryInput, setSalaryInput] = useState<number | "">("");
  const [selectedCountry, setSelectedCountry] = useState("Pakistan");
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);

  const handleCalculate = () => {
      if (typeof salaryInput === 'number') {
          const multiplier = PPP_RATES[selectedCountry];
          setCalculatedValue(Math.floor(salaryInput * multiplier));
      }
  };

  // --- SHARE FUNCTION (TRAFFIC MAGNET) ---
  const handleShare = async () => {
    const shareData = {
        title: 'Remote Salary Guide 2026 | HireSkys',
        text: 'Stop guessing your worth. Check the real 2026 Remote Salary Benchmarks on HireSkys! 🚀',
        url: window.location.href,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) { console.log(err); }
    } else {
        try {
            await navigator.clipboard.writeText(`${shareData.text} \n${shareData.url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) { console.log(err); }
    }
  };

  // Helper to format currency
  const formatSalary = (amount: number) => {
      if (viewMode === 'hourly') {
          // Approx 2000 working hours/year
          const hourly = Math.round(amount / 2000);
          return `$${hourly}/hr`;
      }
      if (viewMode === 'monthly') {
          const monthly = Math.round(amount / 12);
          return `$${monthly.toLocaleString()}/mo`;
      }
      return `$${(amount / 1000).toFixed(0)}k/yr`;
  };

  // Filter Logic
  const filteredData = Object.entries(SALARY_DATA).reduce((acc, [category, data]) => {
    const matchingRoles = data.roles.filter((role: any) => 
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchingRoles.length > 0) acc[category] = { ...data, roles: matchingRoles };
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        
        {/* HERO */}
        <div className="text-center mb-12 space-y-6 relative">
          
          {/* 🌟 VIRAL SHARE BUTTON (Top Right) */}
          <div className="absolute top-0 right-0 hidden md:block">
             <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition text-sm font-bold text-indigo-600 border border-slate-200 dark:border-slate-700"
             >
                {copied ? <CheckCircle size={16} /> : <Share2 size={16} />}
                {copied ? 'Link Copied!' : 'Share Guide'}
             </button>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-sm mb-4 border border-green-200 dark:border-green-800">
            <DollarSign size={16} /> Updated for 2026 Market
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Know Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Real Worth</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive salary benchmarks for remote roles. <br/>
            Compare Annual, Monthly, and Hourly rates instantly.
          </p>

          {/* 🔘 3-WAY TOGGLE (YEARLY | MONTHLY | HOURLY) */}
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
              {['yearly', 'monthly', 'hourly'].map((mode) => (
                  <button 
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                        viewMode === mode 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transform scale-105' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                      {mode === 'yearly' ? 'Annual Salary' : mode === 'monthly' ? 'Monthly Pay' : 'Hourly Rate'}
                  </button>
              ))}
          </div>

          {/* Mobile Share Button (Visible only on mobile) */}
          <div className="md:hidden mt-6 flex justify-center">
             <button onClick={handleShare} className="text-indigo-500 font-bold flex items-center gap-2 text-sm">
                <Share2 size={16} /> Share this Guide
             </button>
          </div>

          <div className="max-w-xl mx-auto relative mt-8">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
             </div>
             <input 
                type="text" 
                placeholder="Search specific role (e.g. 'Ghostwriter', 'React')..." 
                className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white dark:bg-[#151b2d] border border-slate-200 dark:border-slate-800 shadow-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        {/* 🧮 LIFESTYLE CALCULATOR */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 mb-16 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                        <Calculator size={14}/> Lifestyle Calculator
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Are you richer than you think?</h2>
                    <p className="text-indigo-200 text-lg leading-relaxed mb-6">
                        Earning <strong>$3,000/mo</strong> remotely in Pakistan or India often buys a better lifestyle than earning <strong>$10,000/mo</strong> in New York due to PPP.
                    </p>
                    <p className="text-sm text-indigo-300">
                        *Check your "US Equivalent" salary power.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-indigo-200 uppercase ml-1">Your Annual Salary (USD)</label>
                            <div className="relative mt-2">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl py-3 pl-8 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. 30000"
                                    value={salaryInput}
                                    onChange={(e) => setSalaryInput(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-indigo-200 uppercase ml-1">Where do you live?</label>
                            <select 
                                className="w-full mt-2 bg-slate-900/50 border border-indigo-500/30 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                            >
                                {Object.keys(PPP_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={handleCalculate}
                            className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-500/20"
                        >
                            Calculate Power 🚀
                        </button>

                        {calculatedValue && (
                            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center animate-in fade-in zoom-in">
                                <p className="text-green-300 text-sm font-bold uppercase mb-1">Your NYC Lifestyle Equivalent</p>
                                <p className="text-3xl font-black text-white">${calculatedValue.toLocaleString()}<span className="text-lg opacity-70">/yr</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl"></div>
        </div>

        {/* 📉 SALARY TABLES */}
        <div className="space-y-12">
            {Object.entries(filteredData).map(([category, data]) => {
                const Icon = data.icon;
                return (
                    <div key={category} className="bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${data.color}`}><Icon size={24} /></div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{category}</h2>
                            </div>
                            <div className="hidden md:flex ml-auto items-center gap-2 text-xs font-medium text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                <Info size={12}/> Showing {viewMode} compensation
                            </div>
                        </div>

                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50 dark:bg-slate-900/30 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="col-span-4">Role</div>
                            <div className="col-span-3 text-indigo-600 dark:text-indigo-400">🇺🇸 US / Tier-1</div>
                            <div className="col-span-3 text-slate-600 dark:text-slate-300">🌍 Global Avg.</div>
                            <div className="col-span-2 text-right">Demand Level</div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {data.roles.map((role: any, idx: number) => {
                                const isExploding = role.demand.includes('Exploding') || role.demand.includes('Nuclear') || role.demand.includes('Viral');
                                const isHigh = role.demand.includes('High') || role.demand.includes('Very High');
                                
                                return (
                                    <div key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors p-6 md:px-8 md:py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        
                                        {/* Role Title */}
                                        <div className="col-span-4 font-bold text-lg text-slate-800 dark:text-white">{role.title}</div>
                                        
                                        {/* US Rate */}
                                        <div className="col-span-3 flex flex-col md:block">
                                            <span className="md:hidden text-xs text-indigo-500 font-bold uppercase mb-1">US Rate</span>
                                            <span className="font-mono font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded w-fit">
                                                {formatSalary(role.us)}
                                            </span>
                                        </div>

                                        {/* Global Rate */}
                                        <div className="col-span-3 flex flex-col md:block">
                                            <span className="md:hidden text-xs text-slate-500 font-bold uppercase mb-1">Global Rate</span>
                                            <span className="font-mono text-slate-600 dark:text-slate-400">
                                                {formatSalary(role.global)}
                                            </span>
                                        </div>

                                        {/* Demand Badge */}
                                        <div className="col-span-2 flex items-center md:justify-end gap-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${
                                                isExploding 
                                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse' 
                                                : isHigh 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {isExploding ? <Flame size={12} className="fill-current"/> : isHigh ? <TrendingUp size={12}/> : <CheckCircle size={12}/>} 
                                                {role.demand}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to upgrade your income?</h2>
            <Link href="/" className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition inline-flex items-center gap-2">
                Find High Paying Jobs <ArrowRight size={20} />
            </Link>
        </div>

      </main>
    </div>
  );
}