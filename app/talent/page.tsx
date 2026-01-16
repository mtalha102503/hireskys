"use client";
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, MapPin, User, Briefcase, Star, ChevronDown, 
  ArrowRight, ShieldCheck, AlertCircle, Zap, Award
} from 'lucide-react';
import Link from 'next/link';

export default function TalentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">Loading...</div>}>
      <TalentContent />
    </Suspense>
  );
}

function TalentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'jobs' | 'talent'>('talent'); 

  useEffect(() => {
    fetchTalent(initialQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'jobs') {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      fetchTalent(searchQuery);
    }
  };

 // --- 🧠 SMART SEARCH ENGINE (Word-by-Word Matching) ---
  async function fetchTalent(queryText: string) {
    setLoading(true);
    
    const [profilesRes, skillsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('is_available', true),
        supabase.from('user_skills').select('*')
    ]);

    if (profilesRes.error) {
      console.error(profilesRes.error);
      setLoading(false);
      return;
    }

    let allProfiles = profilesRes.data || [];
    const allSkills = skillsRes.data || [];

    // Data Merging
    allProfiles = allProfiles.map(profile => {
        const userSkills = allSkills.filter(s => s.user_id === profile.id);
        return { ...profile, user_skills: userSkills };
    });

    if (queryText) {
        const searchTerms = queryText.toLowerCase().split(" ").filter(w => w.length > 1);

        // FILTER
        let filtered = allProfiles.filter(profile => {
            const searchableText = `
                ${profile.full_name || ''} 
                ${profile.bio || ''} 
                ${Array.isArray(profile.skills) ? profile.skills.join(" ") : ""} 
                ${profile.user_skills.map((s:any) => s.skill_name).join(" ")}
            `.toLowerCase();

            return searchTerms.some(term => searchableText.includes(term));
        });

        // RANKING
        filtered = filtered.sort((a, b) => {
            const getScore = (profile: any) => {
                let points = 0;
                searchTerms.forEach(term => {
                    // A. Verified Skill Match
                    const matchedRatedSkill = profile.user_skills.find((s: any) => s.skill_name.toLowerCase().includes(term));
                    if (matchedRatedSkill) {
                        points += (matchedRatedSkill.proficiency_score || 0) * 10; 
                        if (matchedRatedSkill.proficiency_score >= 9) points += 50; 
                    }

                    // B. Unverified Tag Match
                    if (Array.isArray(profile.skills) && profile.skills.some((s: string) => s.toLowerCase().includes(term))) {
                        points += 20;
                    }

                    // C. Name/Bio Match
                    if (profile.full_name?.toLowerCase().includes(term)) points += 10;
                    if (profile.bio?.toLowerCase().includes(term)) points += 5;
                });
                return points;
            };
            return getScore(b) - getScore(a);
        });

        setTalents(filtered);
    } else {
        setTalents(allProfiles);
    }
    setLoading(false);
  }

  // --- SMART BADGE GENERATOR ---
  const getSkillBadge = (user: any) => {
      let score = 0;
      if (searchQuery) {
          const specificSkill = user.user_skills.find((s: any) => s.skill_name.toLowerCase().includes(searchQuery.toLowerCase()));
          score = specificSkill ? specificSkill.proficiency_score : 0;
      } else {
          if (user.user_skills.length > 0) {
              score = Math.max(...user.user_skills.map((s: any) => s.proficiency_score));
          }
      }

      if (score >= 9) {
          return (
            <span className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full border border-green-200 whitespace-nowrap">
                <ShieldCheck size={12}/> Verified Expert
            </span>
          );
      } else if (score >= 4) {
          return (
            <span className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold rounded-full border border-blue-200 whitespace-nowrap">
                <Zap size={12}/> Skilled ({score}/10)
            </span>
          );
      } else {
          return (
            <span className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 bg-slate-100 text-slate-500 text-[10px] md:text-xs font-bold rounded-full border border-slate-200 whitespace-nowrap">
                <AlertCircle size={12}/> Unverified
            </span>
          );
      }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0B0F19] overflow-x-hidden">
      <Navbar />

      <header className="pt-24 pb-8 md:pt-28 md:pb-12 px-4 text-center bg-white dark:bg-[#0B0F19]">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          
          <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
             Hire Top <span className="text-green-600">Talent</span>
          </h1>
          
          <div className="max-w-3xl mx-auto w-full">
            {/* TABS */}
            <div className="flex justify-center mb-4 gap-2">
                <button 
                    onClick={() => { setSearchType('jobs'); router.push('/'); }} 
                    className="px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Find Jobs
                </button>
                <button 
                    onClick={() => setSearchType('talent')} 
                    className="px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg transition-colors"
                >
                    Find Talent
                </button>
            </div>
            
            {/* INPUT SEARCH BAR */}
            <form onSubmit={handleSearch} className="relative flex items-center bg-white dark:bg-[#151b2d] p-1.5 md:p-2 rounded-full shadow-xl border border-slate-200 dark:border-slate-700">
                
                {/* Icon Label */}
                <div className="pl-3 pr-2 md:pl-4 md:pr-3 border-r border-slate-200 dark:border-slate-700 text-slate-400 flex items-center gap-2">
                    <User size={18} className="text-green-500 md:w-5 md:h-5"/>
                    <span className="text-sm font-medium hidden sm:block">Talent</span>
                </div>
                
                {/* Text Field */}
                <input 
                    type="text" 
                    placeholder="Search talent..." 
                    className="flex-1 h-10 md:h-12 pl-3 pr-2 md:pl-4 md:pr-4 bg-transparent outline-none text-base md:text-lg text-slate-800 dark:text-white min-w-0" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* Button */}
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white p-2.5 md:px-8 md:py-3 rounded-full font-bold flex items-center gap-2 flex-shrink-0 transition-colors shadow-lg shadow-green-500/20">
                    <Search size={18} className="md:w-5 md:h-5" />
                    <span className="hidden md:inline">Search</span>
                </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-24 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <Star size={20} className="text-yellow-500 fill-yellow-500"/> Professionals
            </h2>
            <span className="text-[10px] md:text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 md:px-3 rounded-full">
                {talents.length} found
            </span>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1,2,3].map(i => <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />)}
            </div>
        ) : talents.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#111625] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <User className="mx-auto h-16 w-16 text-slate-300 mb-4"/>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No talent found</h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {talents.map((user) => {
                    const badge = getSkillBadge(user);
                    
                    return (
                        <div key={user.id} className={`bg-white dark:bg-[#111625] rounded-2xl border p-4 md:p-6 transition-all hover:shadow-xl group flex flex-col h-full border-slate-200 dark:border-slate-800`}>
                            
                            {/* --- VERIFICATION BADGE AREA --- */}
                            <div className="flex justify-end mb-2">
                                {badge}
                            </div>

                            <div className="flex items-start justify-between mb-3 md:mb-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <img 
                                        src={user.avatar_url || 'https://via.placeholder.com/150'} 
                                        alt={user.full_name} 
                                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 flex-shrink-0`} 
                                    />
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white group-hover:text-green-500 transition truncate pr-2">
                                            {user.full_name || 'Anonymous'}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <MapPin size={12} className="flex-shrink-0" /> 
                                            <span className="truncate">{user.location || 'Remote'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
                                {user.bio || "No bio available."}
                            </p>

                            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                                {user.skills && user.skills.slice(0, 3).map((skill: string) => (
                                    <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] md:text-xs rounded-md font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <Link href={`/profile/${user.id}`} className="w-full mt-auto py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 hover:border-green-200 transition text-center flex items-center justify-center gap-2 text-sm md:text-base">
                                View Profile <ArrowRight size={16} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        )}
      </main>
    </div>
  );
}