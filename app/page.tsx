"use client";
import { useEffect, useState, useRef } from 'react'; // useRef add kar dia
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation'; 
import { 
  Search, Globe, Briefcase, ShieldCheck, 
  Video, Code, PenTool, Layout, Layers, ArrowRight, Clock,
  User as UserIcon, Smartphone, Cpu, Edit3, X, Zap, Facebook, Linkedin,
  Heart, ChevronDown, Filter, Users, Award, Bell, Bookmark, Rocket, CheckCircle, IdCard, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import Image from 'next/image'; // Logo ke liye
import { motion } from 'framer-motion';
const JOBS_PER_PAGE = 30;
// --- PLATFORM ICONS ---
const getPlatformIcon = (platform: string) => {
  const p = platform || 'Web'; 
  switch(p) {
    case 'X': return <X size={14} className="text-sky-500" />;
    case 'Facebook': return <Facebook size={14} className="text-blue-600" />;
    case 'LinkedIn': return <Linkedin size={14} className="text-blue-700" />;
    default: return <Globe size={14} className="text-slate-400" />;
  }
};

// --- DATA: CATEGORIES ---
const CATEGORIES = {
  "Development": { icon: Code, sub: ["React", "Next.js", "Node.js", "Python", "Shopify", "WordPress", "Web3", "Frontend", "Backend"] },
  "Mobile App": { icon: Smartphone, sub: ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin"] },
  "Video & Motion": { icon: Video, sub: ["Video Editor", "Premiere Pro", "After Effects", "3D Artist", "Thumbnail Artist", "Short Form"] },
  "Design & UI": { icon: Layout, sub: ["UI/UX", "Figma", "Web Design", "Logo Design", "Graphic Design"] },
  "Marketing": { icon: Globe, sub: ["SEO", "Facebook Ads", "Google Ads", "Email Marketing", "Copywriter", "Growth"] },
  "Writing": { icon: Edit3, sub: ["Ghostwriter", "Technical Writer", "Scriptwriter", "Content Writer"] },
  "New Era (AI)": { icon: Cpu, sub: ["AI Engineer", "Automation", "LLM", "Python Script"] }
};

type Job = {
  id: number;
  title: string;
  source: string;
  link: string;
  category: string;
  date_posted: string;
  is_verified: boolean;
  approved: boolean;
  tags?: string[];
  platform?: string;
};

export default function Home() {
  const router = useRouter();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HireSkys",
    "alternateName": ["Hire Skys", "HireSkys Job Radar", "HireSkys Remote Jobs"], // Log ghalat spellings bhi search karte hain
    "url": "https://www.hireskys.com",
    "description": "The elite job radar for developers and creatives. Find verified remote jobs and prove your skills.",
    "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://www.hireskys.com/logo1.png" // Tumhara logo
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://hireskys.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    // Social Links (Google Knowledge Graph ke liye zaroori)
    "sameAs": [
        "https://twitter.com/hireskys",
        "https://www.linkedin.com/company/hireskys",
        "https://www.facebook.com/hireskys"
    ],
    "publisher": {
        "@type": "Organization",
        "name": "HireSkys",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.hireskys.com/logo1.png"
        }
    },
    "inLanguage": "en-US"
  };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'jobs' | 'talent'>('jobs');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubTag, setActiveSubTag] = useState('');
  const jobsSectionRef = useRef<HTMLDivElement>(null);
  // Fallback State
  const [isFallback, setIsFallback] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  // ❤️ SAVED JOBS STATE
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  // 🔔 POPUP STATE
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    checkUser();
    fetchJobs();
  }, []);

  useEffect(() => {
    if (currentUser) {
        fetchSavedJobs();
    }
  }, [currentUser]);
// 📜 AUTO SCROLL EFFECT (Updated: Only for SubTags)
  useEffect(() => {
    // Check: Agar 'activeSubTag' majood hai (matlab user ne sub-category select ki hai)
    if (activeSubTag && jobsSectionRef.current) {
        setTimeout(() => {
            jobsSectionRef.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
  }, [activeSubTag]); // 👈 Dependency array mein sirf 'activeSubTag' rakha hai
  // Debounce Search
  useEffect(() => {
    if (searchType === 'jobs') {
        const timer = setTimeout(() => {
          setPage(0);         // Page number 0 kar do
          fetchJobs(0, true); // Nayi list mangwao (Reset = true)
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [searchQuery, activeCategory, activeSubTag, searchType]);
// 👇 Isay 'useEffect' ke baad paste karna
  useEffect(() => {
    const ensureProfileComplete = async () => {
      // 1. Pehle User nikalo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Phir Database se Skills check karo
        const { data: profile } = await supabase
          .from('profiles')
          .select('skills')
          .eq('id', user.id)
          .single();

        // 3. Agar Skills khali hain -> Redirect
        if (!profile?.skills || profile.skills.length === 0) {
          router.push('/complete-profile');
        }
      }
    };
    ensureProfileComplete();
  }, []);
  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        setCurrentUser(session.user);
    } else {
        // 👇 AGAR USER LOGGED IN NAHI HAI, TO 2 SECOND BAAD POPUP DIKHAO
        setTimeout(() => {
            const hasSeenPopup = sessionStorage.getItem('popup_seen');
            // Agar session mein pehle nahi dekha, to dikhao
            if (!hasSeenPopup) {
                setShowPopup(true);
                sessionStorage.setItem('popup_seen', 'true');
            }
        }, 10000);
    }
    
    supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
  }

  const handleManualSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchType === 'talent') {
          router.push(`/talent?search=${encodeURIComponent(searchQuery)}`);
      } else {
          fetchJobs();
      }
  }

  async function fetchSavedJobs() {
      if (!currentUser) return;
      const { data } = await supabase.from('saved_jobs').select('job_id').eq('user_id', currentUser.id);
      if (data) setSavedJobIds(data.map(item => item.job_id));
  }

  async function toggleSave(jobId: number) {
      if (!currentUser) {
          setShowPopup(true); // Save dabane par bhi popup khul jaye
          return;
      }
      const isAlreadySaved = savedJobIds.includes(jobId);
      if (isAlreadySaved) {
          setSavedJobIds(prev => prev.filter(id => id !== jobId));
          await supabase.from('saved_jobs').delete().match({ user_id: currentUser.id, job_id: jobId });
      } else {
          setSavedJobIds(prev => [...prev, jobId]);
          await supabase.from('saved_jobs').insert({ user_id: currentUser.id, job_id: jobId });
      }
  }

  async function fetchJobs(pageNumber = 0, reset = false) {
    if (reset) {
        setLoading(true);
        setHasMore(true);
    } else {
        setLoadingMore(true);
    }

    // Calculation: Konsi jobs uthani hain
    const from = pageNumber * JOBS_PER_PAGE;
    const to = from + JOBS_PER_PAGE - 1;

    let query = supabase
      .from('jobs')
      .select('*')
      .eq('approved', true)
      .order('date_posted', { ascending: false }) // Latest First
      .range(from, to);

    // --- FILTERS (Fixed: Removed forceFallback) ---
    
    // 1. Category Filter
    if (activeCategory !== 'All') {
      query = query.ilike('category', `%${activeCategory}%`);
    }

    // 2. SubTag Filter
    if (activeSubTag) {
        query = query.or(`tags.cs.{${activeSubTag}},title.ilike.%${activeSubTag}%`);
    }

    // 3. Search Filter
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,source.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (data) {
        if (reset) {
            setJobs(data);
        } else {
            setJobs(prev => {
                // 🛡️ DUPLICATE FILTER: IDs check karke duplicate roko
                const existingIds = new Set(prev.map(job => job.id));
                const uniqueNewJobs = data.filter(job => !existingIds.has(job.id));
                return [...prev, ...uniqueNewJobs];
            });
        }

        // Agar jobs 20 se kam hain, matlab list khatam
        if (data.length < JOBS_PER_PAGE) {
            setHasMore(false);
        }
    }
    setLoading(false);
    setLoadingMore(false);
  }

  // 👇 YE BHI ADD KARO (Button dabane par ye chalega)
  const handleLoadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJobs(nextPage, false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0B0F19] overflow-x-hidden">
      <Navbar />

      {/* --- 🚀 SIGNUP POPUP (MODAL) --- */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white dark:bg-[#151b2d] rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                
                {/* Close Button */}
                <button 
                    onClick={() => setShowPopup(false)} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                    <X size={20} className="text-slate-500" />
                </button>

                {/* Modal Content */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-2">
                        <Rocket size={40} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                            Join the Elite.
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Create your free profile to unlock exclusive features.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl text-left space-y-3 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                            <span className="font-medium">Get Verified <span className="text-green-500">Green Badge</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                            <span className="font-medium">Save Jobs & Apply Later</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                            <span className="font-medium">Get Instant Job Alert Related to your skill on Whatsapp and Email</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link href="/login?view=signup" className="block w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-1">
                            Create Free Account
                        </Link>
                        <button onClick={() => setShowPopup(false)} className="block w-full py-3 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold transition">
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- PROFESSIONAL HERO HEADER --- */}
      <header className="relative pt-24 pb-8 md:pt-28 md:pb-12 px-4 text-center bg-white dark:bg-[#0B0F19] overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[1000px] h-[300px] md:h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 relative z-10">
          
          {/* --- NEW HERO SECTION (No Icon - Conflict Free) --- */}
          <div className="space-y-8 mb-14 relative z-10">
              
              {/* 1. BADGES ROW */}
              <div className="flex flex-wrap justify-center gap-3">
                
                {/* Badge A: REMOTE ONLY */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30"
                >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-400"></span>
                    </span>
                    <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
                        100% Remote & Freelance Only
                    </span>
                </motion.div>

                {/* Badge B: New Gigs Count */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30"
                >
                    <Zap size={14} className="text-amber-600 dark:text-amber-400 fill-current" />
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                        1,240+ Fresh Gigs Added
                    </span>
                </motion.div>
              </div>

              {/* 2. MAIN HEADING */}
              <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]"
              >
                  Find High-Paying <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                      Remote & Contract Work
                  </span>
              </motion.h1>

              {/* 3. DESCRIPTION (Clean Text Only) */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="max-w-4xl mx-auto flex flex-col gap-5"
              >
                  <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      The elite job radar for <span className="text-slate-900 dark:text-white font-black decoration-indigo-500/30 underline decoration-4 underline-offset-4">Developers, Designers, & Marketers</span>.
                  </p>
                  
                  {/* Updated Line: Just Text Chip */}
                  <div className="text-lg md:text-xl text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-2">
                      <span>Skip the office politics. Get verified</span>
                      
                      {/* Work From Home Chip (Text Only - No Icon) */}
                      <span className="inline-flex items-center px-4 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold text-base shadow-sm transform hover:scale-105 transition-transform cursor-default">
                         Work from Home
                      </span>
                      
                      <span>jobs instantly.</span>
                  </div>
              </motion.div>

          </div>

          {/* --- SEARCH BAR (RESPONSIVE) --- */}
          <div className="max-w-3xl mx-auto w-full">
            {/* ... (Search Bar ka code waisa hi rahega) ... */}
            <div className="flex justify-center mb-4 gap-2">
                <button 
                    onClick={() => setSearchType('jobs')}
                    className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                        searchType === 'jobs' 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                        : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    Find Jobs
                </button>
                <button 
                    onClick={() => setSearchType('talent')}
                    className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                        searchType === 'talent' 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                        : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    Find Talent
                </button>
            </div>

            {/* Input Container */}
            <form onSubmit={handleManualSearch} className="relative group flex items-center bg-white dark:bg-[#151b2d] p-1.5 md:p-2 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 transition-all transform md:hover:scale-[1.01]">
                
                {/* Mobile: Compact Icon, Desktop: Text + Icon */}
                <div className="pl-3 pr-2 border-r border-slate-200 dark:border-slate-700 text-slate-400 flex items-center gap-2">
                    {searchType === 'jobs' ? <Briefcase size={18} /> : <Users size={18} />}
                    <span className="text-sm font-medium hidden sm:block capitalize">{searchType}</span>
                  
                </div>

                <input 
                    type="text" 
                    placeholder={searchType === 'jobs' ? "Search roles..." : "Search talent..."} 
                    className="flex-1 h-10 md:h-12 pl-3 pr-2 bg-transparent outline-none text-base md:text-lg text-slate-800 dark:text-white placeholder:text-slate-400 min-w-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 md:px-8 md:py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 flex-shrink-0">
                    <Search size={18} className="md:w-5 md:h-5" />
                    <span className="hidden md:inline">Search</span>
                </button>
            </form>
          </div>

          {/* CATEGORIES (Now with Framer Motion Animation) */}
          <div className="flex flex-wrap justify-center gap-3 pt-6 px-2 max-w-5xl mx-auto">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveCategory('All'); setActiveSubTag(''); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-colors border shadow-sm ${
                  activeCategory === 'All'
                    ? 'bg-white dark:bg-[#151b2d] text-indigo-600 border-indigo-200 dark:border-indigo-900 ring-2 ring-indigo-500/20'
                    : 'bg-white/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'
                }`}
            >
              <Filter size={18} /> All
            </motion.button>
            
            {Object.entries(CATEGORIES).map(([name, data], index) => {
                const Icon = data.icon;
                const isActive = activeCategory === name;
                return (
                    <motion.button
                        key={name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setActiveCategory(name); setActiveSubTag(''); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm md:text-base font-medium transition-colors border whitespace-nowrap shadow-sm ${
                        isActive
                            ? 'bg-indigo-600 text-white border-transparent shadow-indigo-500/30 shadow-lg'
                            : 'bg-white/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-md'
                        }`}
                    >
                        <Icon size={18} /> {name}
                    </motion.button>
                )
            })}
          </div>

          {/* SUB TAGS (Animated Entry) */}
          {activeCategory !== 'All' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-3 pt-6 pb-4 px-2 max-w-4xl mx-auto"
              >
                  {CATEGORIES[activeCategory as keyof typeof CATEGORIES].sub.map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSubTag(activeSubTag === tag ? '' : tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            activeSubTag === tag
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                          {tag}
                      </motion.button>
                  ))}
              </motion.div>
          )}

        </div>
      </header>

      {/* WHY JOIN SECTION (Animated & Interactive) */}
      {!currentUser && (
        <div className="bg-white dark:bg-[#111625] border-y border-slate-200 dark:border-slate-800 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Why create an account?
                    </h2>
                    <p className="text-slate-500 mt-3 text-lg">Join elite freelancers getting hired faster.</p>
                </div>

                {/* Animated Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* Card 1: Verified Badge */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Award size={28} className="fill-current" />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Get Verified Badge</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Pass skill tests to earn the coveted <span className="text-green-600 font-bold">Green Badge</span>.
                        </p>
                    </motion.div>

                    {/* Card 2: Public Profile */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <IdCard size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Public Profile</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Create a professional portfolio page to share directly with clients.
                        </p>
                    </motion.div>

                    {/* Card 3: Instant Alerts */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Bell size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Instant Alerts</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Get notified via Email/WhatsApp the second a job drops.
                        </p>
                    </motion.div>

                    {/* Card 4: Save Jobs */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Bookmark size={28} className="fill-current" />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Save Jobs</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Bookmark interesting roles and apply when you are ready.
                        </p>
                    </motion.div>

                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <Link href="/login?view=signup" className="inline-flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-full shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-1">
                        Create Free Account <ArrowRight size={20}/>
                    </Link>
                </div>
            </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main 
      ref={jobsSectionRef}
      className="container mx-auto px-4 pt-12 md:pt-16 pb-8 max-w-5xl">
        {isFallback && (
            <div className="mb-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-200 dark:border-orange-800/50 flex flex-col md:flex-row items-start gap-4 shadow-sm">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                    <Zap className="text-orange-500" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-orange-900 dark:text-orange-200">No exact matches found</h3>
                    <p className="text-orange-800 dark:text-orange-300/80 mt-1 text-sm md:text-base">
                        We couldn't find verified jobs for <strong>"{searchQuery || activeSubTag}"</strong>. 
                        Showing you the latest <strong>{activeCategory === 'All' ? 'opportunities' : activeCategory + ' roles'}</strong> instead.
                    </p>
                </div>
            </div>
        )}

        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
  <Briefcase size={20} className="text-indigo-500" />
  {/* 👇 Agar filter nahi hai to "Fresh Arrivals" likho, warna "Recent Jobs" */}
  {activeCategory === 'All' && !searchQuery ? 'Latest Remote Opportunities' : 'Search Results'}
</h2>
          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 md:px-3 rounded-full">
            {jobs.length} Results
          </span>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />)
          ) : jobs.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-[#111625] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Search className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs found</h3>
              <p className="text-slate-500">Try adjusting your search filters.</p>
            </div>
            
          ) : (
            
            jobs.map((job) => {
              const jobDate = new Date(job.date_posted);
              const now = new Date();
              const diffHrs = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
              const diffDays = Math.floor(diffHrs / 96);
              const isJustNow = diffHrs <= 4;
              const isSaved = savedJobIds.includes(job.id);
              
              return (
                <div key={job.id} className="group relative bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 p-4 md:p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                  
                 {/* Job Icon - Now using Professional Lucide Icons */}
                  <div className="hidden sm:flex h-12 w-12 md:h-14 md:w-14 rounded-xl bg-slate-50 dark:bg-slate-800/50 items-center justify-center border border-slate-100 dark:border-slate-700 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {(() => {
                        // 1. Category ka naam match karo
                        const categoryData = CATEGORIES[job.category as keyof typeof CATEGORIES];
                        // 2. Agar icon mil jaye to wo lo, warna default Briefcase lo
                        const IconComponent = categoryData ? categoryData.icon : Briefcase;
                        
                        return (
                          <IconComponent 
                            size={24} 
                            className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" 
                          />
                        );
                      })()}
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-full">
                        {job.title}
                      </h3>
                      {job.is_verified && (
                        <div className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                            <ShieldCheck size={12} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Verified</span>
                        </div>
                      )}
                      {isJustNow && (
                          <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 uppercase animate-pulse border border-red-100 dark:border-red-900">
                              🔥 New
                          </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        {getPlatformIcon(job.platform || 'Web')} 
                        {job.source}
                      </span>
                      <span className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          {job.category}
                      </span>
                      {job.tags && job.tags.length > 0 && (
                         <span className="flex items-center gap-2 hidden sm:flex">
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                {job.tags[0]}
                            </span>
                         </span>
                      )}
                      <span className="flex items-center gap-1 ml-auto md:ml-0"><Clock size={12} className="md:w-3.5 md:h-3.5" /> {diffHrs < 1 ? 'Just now' : diffHrs < 96 ? `${diffHrs}h ago` : `${diffDays}d ago`}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons: Full width on mobile, Auto on Desktop */}
                  <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <button 
                        onClick={() => toggleSave(job.id)}
                        className={`p-3 rounded-xl border transition-all ${
                            isSaved 
                            ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 dark:bg-slate-800 dark:border-slate-700'
                        }`}
                      >
                          <Heart size={20} className={isSaved ? "fill-current" : ""} />
                      </button>

                      <Link href={`/jobs/${job.id}`} className="flex-1 md:flex-none px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-slate-200 transition-all shadow-md hover:shadow-xl text-center flex items-center justify-center gap-2 text-sm md:text-base">
                        View <ArrowRight size={18}/>
                      </Link>
                  </div>
                </div>
              );
            })
          )}
          {/* 👇 PREMIUM LOAD MORE BUTTON */}
        {hasMore && !loading && jobs.length > 0 && (
            <div className="pt-8 pb-0 flex justify-center">
                <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loadingMore ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <span>Load More Jobs</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
        )}
        </div>
      </main>
    </div>
  );
}
