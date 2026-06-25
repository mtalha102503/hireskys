"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  MapPin, Briefcase, Star, Search, Award, 
  ChevronRight, Globe, Loader2
} from 'lucide-react';

type TalentProfile = {
  id: string;
  full_name: string;
  username: string;
  primary_role: string;
  avatar_url: string;
  bio: string;
  country: string;
  experience_level: string;
  skills: string[];
  hourly_rate: string;
  is_available: boolean;
  profile_score: number;
  is_guest?: boolean;
};

export default function TalentDirectory() {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Paginaton Logic
  const [visibleCount, setVisibleCount] = useState(20);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All'); // 🌍 Naya Country Filter
  // 🎯 Auto-Scroll / Infinite Scroll Logic
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Agar observer target screen par nazar aa jaye, aur mazeed data bacha ho
        if (entries[0].isIntersecting && visibleCount < filteredTalents.length) {
          setVisibleCount((prev) => prev + 20); // Agle 20 load kardo
        }
      },
      { threshold: 0.1 } // Jaise hi 10% hissa nazar aaye, trigger kardo
    );

    // Observer ko target par laga do
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // Cleanup taake memory leak na ho
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleCount, filteredTalents.length]);
  useEffect(() => {
    fetchRankedTalent();
  }, []);

  // Real-time filtering logic
  useEffect(() => {
    let result = talents;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.full_name?.toLowerCase().includes(query) || 
        t.primary_role?.toLowerCase().includes(query) ||
        t.skills?.some(s => s.toLowerCase().includes(query))
      );
    }

    if (roleFilter !== 'All') {
      result = result.filter(t => t.primary_role?.toLowerCase().includes(roleFilter.toLowerCase()));
    }

    if (expFilter !== 'All') {
      result = result.filter(t => t.experience_level === expFilter);
    }

    if (countryFilter !== 'All') {
      result = result.filter(t => t.country === countryFilter);
    }

    setFilteredTalents(result);
    setVisibleCount(20); // 🔄 Filter change hone par wapis pehle 20 results dikhao
  }, [searchQuery, roleFilter, expFilter, countryFilter, talents]);

  async function fetchRankedTalent() {
    setLoading(true);
    // ✅ WAPAS PURANA FUNCTION LAGA DIYA
    const { data, error } = await supabase.rpc('get_ranked_talent'); 
    
    if (error) {
      console.error("Error fetching talent:", error);
    } else {
      setTalents(data || []);
      setFilteredTalents(data || []);
    }
    setLoading(false);
  }

  // Get unique lists for dropdowns
  const uniqueRoles = Array.from(new Set(talents.map(t => t.primary_role).filter(Boolean)));
  const uniqueCountries = Array.from(new Set(talents.map(t => t.country).filter(Boolean)));

  // Sliced data for Pagination
  const displayedTalents = filteredTalents.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans pb-24">
      <Navbar />

      {/* 🌟 HERO SECTION */}
      <div className="relative pt-32 pb-16 px-4 bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-6 border border-indigo-100 dark:border-indigo-500/20">
            <Star size={16} className="fill-current" /> Top 1% Ranked Profiles
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Hire Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Remote Talent</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Browse our curated directory of fully verified developers, designers, and marketers ready to join your team.
          </p>

          {/* 🔍 SEARCH & FILTERS */}
          <div className="max-w-5xl mx-auto bg-white dark:bg-[#151b2d] p-2 md:p-3 rounded-2xl md:rounded-full shadow-xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-3">
            
            <div className="flex-1 flex items-center gap-3 px-4 w-full md:w-auto border-b md:border-b-0 border-slate-100 dark:border-slate-800 pb-2 md:pb-0">
              <Search className="text-slate-400 flex-shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Search name, role, or skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white py-3 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="hidden md:block w-[1px] h-8 bg-slate-200 dark:bg-slate-700"></div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto px-2">
              {/* 💼 ROLE FILTER */}
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-bold text-slate-700 dark:text-slate-300 py-3 cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">All Roles</option>
                {uniqueRoles.map((role, i) => (
                  <option key={i} value={role} className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">{role}</option>
                ))}
              </select>

              {/* 📈 EXPERIENCE FILTER */}
              <select 
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-bold text-slate-700 dark:text-slate-300 py-3 cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">Any Experience</option>
                <option value="Entry Level" className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">Entry Level</option>
                <option value="Mid Level" className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">Mid Level</option>
                <option value="Senior Level" className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">Senior Level</option>
              </select>

              {/* 🌍 COUNTRY FILTER */}
              <select 
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-bold text-slate-700 dark:text-slate-300 py-3 cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">Any Country</option>
                {uniqueCountries.map((country, i) => (
                  <option key={i} value={country} className="bg-white dark:bg-[#151b2d] text-slate-900 dark:text-white">{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 TALENT LIST (LIST VIEW) */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {loading ? (
          // ✨ Skeleton Loader (List View)
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-[200px] animate-pulse flex gap-6">
                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 flex-shrink-0"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 w-1/3 rounded"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
                  <div className="h-16 bg-slate-200 dark:bg-slate-800 w-full rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTalents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#111625] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <Search className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold">No talent found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or location.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {displayedTalents.map((talent, index) => (
              <Link 
                href={`/p/${talent.username || talent.id}`} 
                key={talent.id}
                className="group relative bg-white dark:bg-[#111625] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 items-start"
              >
                {/* 🥇 Top Ranked Badge (For top 3) */}
                {index < 3 && !searchQuery && roleFilter === 'All' && countryFilter === 'All' && (
                  <div className="absolute -top-3 left-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] md:text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10">
                    <Award size={14} /> Top Ranked
                  </div>
                )}

                {/* Left Side: Avatar */}
                <div className="relative flex-shrink-0 flex items-center gap-4 md:block">
                  <div className="w-16 h-16 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center shadow-sm">
                    {talent.avatar_url ? (
                      <img src={talent.avatar_url} alt={talent.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl md:text-5xl font-black text-indigo-500">{(talent.full_name || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>
                  {/* Online Status Dot */}
                  <div className="absolute -bottom-2 -right-2 md:bottom-[-5px] md:right-[-5px] w-5 h-5 bg-green-500 border-4 border-white dark:border-[#111625] rounded-full hidden md:block"></div>
                </div>

                {/* Middle: Content */}
                <div className="flex-1 min-w-0 w-full pt-1">
                  <h3 className="font-black text-xl md:text-2xl text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                    {talent.full_name || 'Anonymous Professional'}
                  </h3>
                  <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 truncate mb-3">
                    {talent.primary_role || 'Remote Professional'}
                  </p>

                  {/* Location & Experience */}
                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 mb-4">
                    {talent.country && (
                      <div className="flex items-center gap-1.5">
                        <Globe size={16} className="text-emerald-500" /> {talent.country}
                      </div>
                    )}
                    {talent.experience_level && (
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={16} className="text-blue-500" /> {talent.experience_level}
                      </div>
                    )}
                  </div>

                  {/* Bio Preview - Now much larger and readable */}
                  <p className="text-sm md:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 md:line-clamp-3 mb-5">
                    {talent.bio || `A highly skilled ${talent.primary_role || 'professional'} from ${talent.country || 'around the globe'}, looking for remote opportunities. Check out the full profile to see experience, projects, and skills in detail.`}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2">
                    {(talent.skills || []).slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg">
                        {skill}
                      </span>
                    ))}
                    {(talent.skills || []).length > 5 && (
                      <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg">
                        +{talent.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Rate & Action Button */}
                <div className="w-full md:w-auto md:min-w-[180px] flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-8 mt-2 md:mt-0 h-full">
                  <div className="text-center w-full md:w-auto">
                    <div className="font-black text-xl md:text-3xl text-slate-900 dark:text-white leading-none">
                      {talent.hourly_rate ? `$${talent.hourly_rate}` : <span className="text-slate-400 text-lg">Negotiable</span>}
                    </div>
                    {talent.hourly_rate && <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Per Hour</div>}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors w-full md:w-auto">
                      View Profile <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 🔄 AUTO-LOAD SENSOR (Invisible unless loading) */}
        {visibleCount < filteredTalents.length && (
          <div 
            ref={observerTarget} 
            className="mt-12 mb-8 flex justify-center items-center gap-3 text-slate-500 font-medium"
          >
            <Loader2 size={24} className="animate-spin text-indigo-500" />
            Loading more talent...
          </div>
        )}

      </div>
    </div>
  );
}
