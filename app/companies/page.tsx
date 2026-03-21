"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  ArrowDownAZ, 
  ArrowUpZA, 
  Rocket, 
  BriefcaseBusiness, 
  DollarSign, 
  ChevronDown 
} from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState('a-z'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalCompanies, setTotalCompanies] = useState(0);
  
  useEffect(() => {
    const fetchTotalCount = async () => {
      const { count } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true }); // head: true ka matlab sirf count lao, data nahi
      
      if (count) setTotalCompanies(count);
    };
    fetchTotalCount();
  }, []);
  // Har option ke liye text aur icon ka map
  const sortOptionsData: Record<string, { text: string; icon: JSX.Element }> = {
    'a-z': { text: 'Alphabetical (A-Z)', icon: <ArrowDownAZ className="w-4 h-4 text-gray-500" /> },
    'z-a': { text: 'Alphabetical (Z-A)', icon: <ArrowUpZA className="w-4 h-4 text-gray-500" /> },
    'newest': { text: 'Newest Arrivals', icon: <Rocket className="w-4 h-4 text-gray-500" /> },
    'most-jobs': { text: 'Most Jobs Posted', icon: <BriefcaseBusiness className="w-4 h-4 text-gray-500" /> },
    'highest-salary': { text: 'Highest Salaries', icon: <DollarSign className="w-4 h-4 text-gray-500" /> }
  };
  const LIMIT = 30; 

  const fetchCompanies = async (currentPage: number, currentSort: string, isReset = false) => {
    setLoading(true);
    const from = currentPage * LIMIT;
    const to = from + LIMIT - 1;

    let finalCompanies: any[] = [];
    let hasMoreFlag = true;

    // ... (Filter Logic Same Hai) ...
    if (currentSort === 'most-jobs' || currentSort === 'highest-salary') {
      if (currentSort === 'most-jobs') {
        const { data: jobData } = await supabase.from('jobs').select('source').eq('active', true).eq('approved', true);
        const counts: Record<string, number> = {};
        (jobData || []).forEach(j => { if (j.source) counts[j.source] = (counts[j.source] || 0) + 1; });
        const sortedNames = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(e => e[0]);
        const pageNames = sortedNames.slice(from, to + 1);
        if (pageNames.length === 0) hasMoreFlag = false;
        else {
          const { data: comps } = await supabase.from('companies').select('*').in('name', pageNames);
          finalCompanies = pageNames.map(name => (comps || []).find(c => c.name === name)).filter(Boolean);
          if (finalCompanies.length < LIMIT) hasMoreFlag = false;
        }
      } else if (currentSort === 'highest-salary') {
       const { data: jobData } = await supabase.from('jobs').select('source, salary_range').not('salary_range', 'is', null).eq('active', true).eq('approved', true);
        const maxSals: Record<string, number> = {};
        (jobData || []).forEach(j => {
          if (j.source && j.salary_range && !j.salary_range.toLowerCase().includes('not disclosed')) {
            const nums = j.salary_range.match(/\d+(?:,\d+)*/g);
            if (nums) {
              const maxVal = Math.max(...nums.map(n => parseInt(n.replace(/,/g, ''), 10)));
              if (maxVal > (maxSals[j.source] || 0)) maxSals[j.source] = maxVal;
            }
          }
        });
        const sortedNames = Object.entries(maxSals).sort((a, b) => b[1] - a[1]).map(e => e[0]);
        const pageNames = sortedNames.slice(from, to + 1);
        if (pageNames.length === 0) hasMoreFlag = false;
        else {
          const { data: comps } = await supabase.from('companies').select('*').in('name', pageNames);
          finalCompanies = pageNames.map(name => (comps || []).find(c => c.name === name)).filter(Boolean);
          if (finalCompanies.length < LIMIT) hasMoreFlag = false;
        }
      }
    } else {
      let query = supabase.from('companies').select('*');
      if (currentSort === 'a-z') query = query.order('name', { ascending: true });
      else if (currentSort === 'z-a') query = query.order('name', { ascending: false });
      else if (currentSort === 'newest') query = query.order('created_at', { ascending: false });
      const { data, error } = await query.range(from, to);
      if (error) console.error(error);
      if (data) finalCompanies = data;
      if (!data || data.length < LIMIT) hasMoreFlag = false;
    }

    // 🚨 NEW: HAR COMPANY KI JOBS AUR SALARY KA HISAB LAGAYO
    if (finalCompanies.length > 0) {
      const companyNames = finalCompanies.map(c => c.name);
      const { data: jobsData } = await supabase.from('jobs').select('source, salary_range').in('source', companyNames).eq('active', true).eq('approved', true);

      finalCompanies = finalCompanies.map(company => {
        const companyJobs = (jobsData || []).filter(j => j.source === company.name);
        const activeJobsCount = companyJobs.length;

        // Salary Average Calculator
        let totalSalary = 0;
        let validSalaries = 0;
        companyJobs.forEach(job => {
          if (job.salary_range && !job.salary_range.toLowerCase().includes('not disclosed')) {
            const nums = job.salary_range.match(/\d+(?:,\d+)*/g);
            if (nums) {
              const parsedNums = nums.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => n > 1000); // Saal/Mahina ignore karne ke liye >1000
              if (parsedNums.length > 0) {
                const avg = parsedNums.reduce((a, b) => a + b, 0) / parsedNums.length;
                totalSalary += avg;
                validSalaries++;
              }
            }
          }
        });

        let avgSalaryStr = 'Not Disclosed';
        if (validSalaries > 0) {
          const finalAvg = Math.round(totalSalary / validSalaries);
          avgSalaryStr = `$${(finalAvg / 1000).toFixed(0)}k/yr`; // e.g. $120k/yr
        }

        return { ...company, activeJobsCount, avgSalaryStr }; // Company data mein attach kar diya
      });
    }

    if (isReset || currentPage === 0) setCompanies(finalCompanies);
    else setCompanies((prev) => [...prev, ...finalCompanies]);
    
    setHasMore(hasMoreFlag);
    setLoading(false);
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchCompanies(0, sortOption, true);
  }, [sortOption]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCompanies(nextPage, sortOption, false);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Top Companies</span>
            </h1>
           <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore <span className="font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">{totalCompanies > 0 ? totalCompanies : '...'}</span> global companies and startups hiring the best remote talent right now.
            </p>
          </div>

          {/* 🎯 THE ULTIMATE SMOOTH Dropdown */}
          <div className="flex justify-end mb-6">
            <div className="relative inline-block text-left z-20">
              <div className="flex items-center gap-2">
                <label htmlFor="sort-filter" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sort by:
                </label>
                
                {/* 🚨 Naya Dropdown Button */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm rounded-xl bg-white dark:bg-[#131b2b] text-gray-900 dark:text-white shadow-sm cursor-pointer min-w-56"
                >
                  {/* Selected Option ka Icon */}
                  {sortOptionsData[sortOption].icon}
                  {/* Selected Option ka Text */}
                  {sortOptionsData[sortOption].text}
                  {/* Dropdown Arrow */}
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </button>

                {/* 🚨 Animated Options List */}
                <ul 
                  className={`absolute right-0 top-full mt-2 w-full p-2 bg-white dark:bg-[#131b2b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg transform transition-all duration-300 ease-out z-20 ${
                    isDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {Object.entries(sortOptionsData).map(([key, data]) => (
                    <li key={key}>
                      <button 
                        onClick={() => {
                          setSortOption(key);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full p-3 text-left text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a2333] rounded-lg transition-colors"
                      >
                        {data.icon}
                        {data.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* 🚨 Click-Outside Logic (Transparent layer to close dropdown) */}
            {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>}
          </div>

          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {companies.map((company, index) => (
              <div 
                key={`${company.slug}-${index}`} 
                className="group flex flex-col sm:flex-row bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 relative gap-6 items-start"
              >
                {/* 1. Left: Smart Logo (Thora chota aur top-aligned) */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 dark:bg-[#0b0f19] border border-gray-100 dark:border-gray-800 p-2.5 flex-shrink-0 overflow-hidden flex items-center justify-center mt-1">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={`${company.name} logo`} className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">{company.name.charAt(0)}</span>
                  )}
                </div>

                {/* 2. Middle: Details, Text AND Badges (Sab ek column mein) */}
                <div className="flex-1 flex flex-col w-full">
                  
                  {/* Title & Industry */}
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {company.name}
                      {company.verified && (
                        <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </h3>
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                      • {company.industry || "Tech & Innovation"}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      📍 {company.location || "Remote / Global"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed line-clamp-2">
                    {company.description || `Join ${company.name} and work on exciting new projects with a dynamic global team.`}
                  </p>

                  {/* 🚨 Badges Ab Yahan Hain (Description ke neechay) */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60">
                    
                    {/* Active Jobs Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                      <BriefcaseBusiness className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-[13px] font-bold text-indigo-900 dark:text-indigo-200">
                        {company.activeJobsCount} <span className="font-medium text-indigo-600 dark:text-indigo-400">Open {company.activeJobsCount === 1 ? 'Role' : 'Roles'}</span>
                      </span>
                    </div>

                    {/* Avg Salary Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[13px] font-bold text-emerald-900 dark:text-emerald-200">
                        {company.avgSalaryStr !== 'Not Disclosed' ? (
                          <>Avg: <span className="text-emerald-700 dark:text-emerald-300">{company.avgSalaryStr}</span></>
                        ) : (
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">Not Disclosed</span>
                        )}
                      </span>
                    </div>

                  </div>
                </div>

                {/* 3. Right: Action Button (Center aligned vertically) */}
                <div className="w-full sm:w-auto flex flex-col justify-center self-center sm:pl-6 sm:border-l border-gray-100 dark:border-gray-800">
                  <Link 
                    href={`/companies/${company.slug}`} 
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 py-2.5 px-5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap"
                  >
                    View Company 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            {loading ? (
              <div className="flex items-center gap-2 text-indigo-500 font-medium">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Companies...
              </div>
            ) : hasMore ? (
              <button 
                onClick={handleLoadMore}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Load More Companies
              </button>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                You've reached the end! 🚀
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}