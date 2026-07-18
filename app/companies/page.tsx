"use client";

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  ArrowDownAZ, 
  ArrowUpZA, 
  Rocket, 
  BriefcaseBusiness, 
  DollarSign, 
  ChevronDown 
} from 'lucide-react';

// data/countries.ts
export const COUNTRIES = [
  { name: 'Afghanistan', flag: '🇦🇫' },
  { name: 'Albania', flag: '🇦🇱' },
  { name: 'Algeria', flag: '🇩🇿' },
  { name: 'Andorra', flag: '🇦🇩' },
  { name: 'Angola', flag: '🇦🇴' },
  { name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Armenia', flag: '🇦🇲' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Azerbaijan', flag: '🇦🇿' },
  { name: 'Bahamas', flag: '🇧🇸' },
  { name: 'Bahrain', flag: '🇧🇭' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Barbados', flag: '🇧🇧' },
  { name: 'Belarus', flag: '🇧🇾' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Belize', flag: '🇧🇿' },
  { name: 'Benin', flag: '🇧🇯' },
  { name: 'Bhutan', flag: '🇧🇹' },
  { name: 'Bolivia', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { name: 'Botswana', flag: '🇧🇼' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Brunei', flag: '🇧🇳' },
  { name: 'Bulgaria', flag: '🇧🇬' },
  { name: 'Burkina Faso', flag: '🇧🇫' },
  { name: 'Burundi', flag: '🇧🇮' },
  { name: 'Cabo Verde', flag: '🇨🇻' },
  { name: 'Cambodia', flag: '🇰🇭' },
  { name: 'Cameroon', flag: '🇨🇲' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Central African Republic', flag: '🇨🇫' },
  { name: 'Chad', flag: '🇹🇩' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Comoros', flag: '🇰🇲' },
  { name: 'Congo (Congo-Brazzaville)', flag: '🇨🇬' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Cuba', flag: '🇨🇺' },
  { name: 'Cyprus', flag: '🇨🇾' },
  { name: 'Czechia (Czech Republic)', flag: '🇨🇿' },
  { name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Djibouti', flag: '🇩🇯' },
  { name: 'Dominica', flag: '🇩🇲' },
  { name: 'Dominican Republic', flag: '🇩🇴' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'El Salvador', flag: '🇸🇻' },
  { name: 'Equatorial Guinea', flag: '🇬🇶' },
  { name: 'Eritrea', flag: '🇪🇷' },
  { name: 'Estonia', flag: '🇪🇪' },
  { name: 'Eswatini', flag: '🇸🇿' },
  { name: 'Ethiopia', flag: '🇪🇹' },
  { name: 'Fiji', flag: '🇫🇯' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Gabon', flag: '🇬🇦' },
  { name: 'Gambia', flag: '🇬🇲' },
  { name: 'Georgia', flag: '🇬🇪' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Grenada', flag: '🇬🇩' },
  { name: 'Guatemala', flag: '🇬🇹' },
  { name: 'Guinea', flag: '🇬🇳' },
  { name: 'Guinea-Bissau', flag: '🇬🇼' },
  { name: 'Guyana', flag: '🇬🇾' },
  { name: 'Haiti', flag: '🇭🇹' },
  { name: 'Honduras', flag: '🇭🇳' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Iran', flag: '🇮🇷' },
  { name: 'Iraq', flag: '🇮🇶' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Israel', flag: '🇮🇱' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Jamaica', flag: '🇯🇲' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Jordan', flag: '🇯🇴' },
  { name: 'Kazakhstan', flag: '🇰🇿' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Kiribati', flag: '🇰🇮' },
  { name: 'Kuwait', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', flag: '🇰🇬' },
  { name: 'Laos', flag: '🇱🇦' },
  { name: 'Latvia', flag: '🇱🇻' },
  { name: 'Lebanon', flag: '🇱🇧' },
  { name: 'Lesotho', flag: '🇱🇸' },
  { name: 'Liberia', flag: '🇱🇷' },
  { name: 'Libya', flag: '🇱🇾' },
  { name: 'Liechtenstein', flag: '🇱🇮' },
  { name: 'Lithuania', flag: '🇱🇹' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Madagascar', flag: '🇲🇬' },
  { name: 'Malawi', flag: '🇲🇼' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Maldives', flag: '🇲🇻' },
  { name: 'Mali', flag: '🇲🇱' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Marshall Islands', flag: '🇲🇭' },
  { name: 'Mauritania', flag: '🇲🇷' },
  { name: 'Mauritius', flag: '🇲🇺' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Micronesia', flag: '🇫🇲' },
  { name: 'Moldova', flag: '🇲🇩' },
  { name: 'Monaco', flag: '🇲🇨' },
  { name: 'Mongolia', flag: '🇲🇳' },
  { name: 'Montenegro', flag: '🇲🇪' },
  { name: 'Morocco', flag: '🇲🇦' },
  { name: 'Mozambique', flag: '🇲🇿' },
  { name: 'Myanmar (formerly Burma)', flag: '🇲🇲' },
  { name: 'Namibia', flag: '🇳🇦' },
  { name: 'Nauru', flag: '🇳🇷' },
  { name: 'Nepal', flag: '🇳🇵' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Nicaragua', flag: '🇳🇮' },
  { name: 'Niger', flag: '🇳🇪' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'North Korea', flag: '🇰🇵' },
  { name: 'North Macedonia', flag: '🇲🇰' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Oman', flag: '🇴🇲' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Palau', flag: '🇵🇼' },
  { name: 'Palestine State', flag: '🇵🇸' },
  { name: 'Panama', flag: '🇵🇦' },
  { name: 'Papua New Guinea', flag: '🇵🇬' },
  { name: 'Paraguay', flag: '🇵🇾' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Philippines', flag: '🇵🇭' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Qatar', flag: '🇶🇦' },
  { name: 'Romania', flag: '🇷🇴' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { name: 'Saint Lucia', flag: '🇱🇨' },
  { name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { name: 'Samoa', flag: '🇼🇸' },
  { name: 'San Marino', flag: '🇸🇲' },
  { name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Senegal', flag: '🇸🇳' },
  { name: 'Serbia', flag: '🇷🇸' },
  { name: 'Seychelles', flag: '🇸🇨' },
  { name: 'Sierra Leone', flag: '🇸🇱' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Slovakia', flag: '🇸🇰' },
  { name: 'Slovenia', flag: '🇸🇮' },
  { name: 'Solomon Islands', flag: '🇸🇧' },
  { name: 'Somalia', flag: '🇸🇴' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'South Sudan', flag: '🇸🇸' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Sudan', flag: '🇸🇩' },
  { name: 'Suriname', flag: '🇸🇷' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Syria', flag: '🇸🇾' },
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'Tajikistan', flag: '🇹🇯' },
  { name: 'Tanzania', flag: '🇹🇿' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Timor-Leste', flag: '🇹🇱' },
  { name: 'Togo', flag: '🇹🇬' },
  { name: 'Tonga', flag: '🇹🇴' },
  { name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { name: 'Tunisia', flag: '🇹🇳' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Turkmenistan', flag: '🇹🇲' },
  { name: 'Tuvalu', flag: '🇹🇻' },
  { name: 'Uganda', flag: '🇺🇬' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Uzbekistan', flag: '🇺🇿' },
  { name: 'Vanuatu', flag: '🇻🇺' },
  { name: 'Vatican City', flag: '🇻🇦' },
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'Yemen', flag: '🇾🇪' },
  { name: 'Zambia', flag: '🇿🇲' },
  { name: 'Zimbabwe', flag: '🇿🇼' }
];

function CompaniesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL params, default to page 1
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState('a-z'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [filterCountry, setFilterCountry] = useState('All');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const LIMIT = 30; 
  const totalPages = Math.ceil(totalCompanies / LIMIT);

  useEffect(() => {
    const fetchTotalCount = async () => {
      const { count } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true }); 
      
      if (count) setTotalCompanies(count);
    };
    fetchTotalCount();
  }, []);

  const sortOptionsData: Record<string, { text: string; icon: React.ReactNode }> = {
    'a-z': { text: 'Alphabetical (A-Z)', icon: <ArrowDownAZ className="w-4 h-4 text-gray-500" /> },
    'z-a': { text: 'Alphabetical (Z-A)', icon: <ArrowUpZA className="w-4 h-4 text-gray-500" /> },
    'newest': { text: 'Newest Arrivals', icon: <Rocket className="w-4 h-4 text-gray-500" /> },
    'most-jobs': { text: 'Most Jobs Posted', icon: <BriefcaseBusiness className="w-4 h-4 text-gray-500" /> },
    'highest-salary': { text: 'Highest Salaries', icon: <DollarSign className="w-4 h-4 text-gray-500" /> }
  };

  const fetchCompanies = async (pageToFetch: number, currentSort: string) => {
    setLoading(true);
    // Page 1 means offset 0, Page 2 means offset 30
    const from = (pageToFetch - 1) * LIMIT;
    const to = from + LIMIT - 1;

    let finalCompanies: any[] = [];
    let hasMoreFlag = true;

    // 🏆 1. MOST JOBS
    if (currentSort === 'most-jobs') {
      const locFilter = filterCountry !== 'All' ? filterCountry : '';
      
      const { data: topCompaniesData } = await supabase.rpc('get_top_companies_by_job_count', { 
          limit_count: LIMIT, 
          offset_count: from,
          search_location: locFilter 
      });

      if (!topCompaniesData || topCompaniesData.length === 0) {
          hasMoreFlag = false;
      } else {
          const pageNames = topCompaniesData.map((c: any) => c.company_name);
          const { data: comps } = await supabase.from('companies').select('name, slug, logo_url, industry, location, description').in('name', pageNames);
          finalCompanies = pageNames.map((name: string) => (comps || []).find((c: any) => c.name === name)).filter(Boolean);
          if (finalCompanies.length < LIMIT) hasMoreFlag = false;
      }

    // 💰 2. HIGHEST SALARY
    } else if (currentSort === 'highest-salary') {
      let jobQuery = supabase.from('jobs').select('source, salary_range').not('salary_range', 'is', null).eq('active', true).eq('approved', true);
      if (filterCountry !== 'All') {
          jobQuery = jobQuery.ilike('location', `%${filterCountry}%`); 
      }
      const { data: jobData } = await jobQuery;

      const maxSals: Record<string, number> = {};
      (jobData || []).forEach(j => {
        if (j.source && j.salary_range && !j.salary_range.toLowerCase().includes('not disclosed')) {
          const nums = j.salary_range.match(/\d+(?:,\d+)*/g);
          if (nums) {
            const maxVal = Math.max(...nums.map((n: string) => parseInt(n.replace(/,/g, ''), 10)));
            if (maxVal > (maxSals[j.source] || 0)) maxSals[j.source] = maxVal;
          }
        }
      });

      const sortedNames = Object.entries(maxSals).sort((a, b) => b[1] - a[1]).map(e => e[0]);
      const pageNames = sortedNames.slice(from, to + 1);
      
      if (pageNames.length === 0) {
          hasMoreFlag = false;
      } else {
        const { data: comps } = await supabase.from('companies').select('name, slug, logo_url, industry, location, description').in('name', pageNames);
        finalCompanies = pageNames.map(name => (comps || []).find(c => c.name === name)).filter(Boolean);
        if (finalCompanies.length < LIMIT) hasMoreFlag = false;
      }

    // 🔤 3. ALPHABETICAL & NEWEST
    } else {
      let query = supabase.from('companies').select('name, slug, logo_url, industry, location, description');
      if (filterCountry !== 'All') {
          query = query.ilike('location', `%${filterCountry}%`); 
      }

      if (currentSort === 'a-z') query = query.order('name', { ascending: true });
      else if (currentSort === 'z-a') query = query.order('name', { ascending: false });
      else if (currentSort === 'newest') query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query.range(from, to);
      if (error) console.error(error);
      if (data) finalCompanies = data;
      if (!data || data.length < LIMIT) hasMoreFlag = false;
    }

    // --- 📊 SALARY AND ACTIVE JOBS CALCULATION ---
    if (finalCompanies.length > 0) {
      const companyNames = finalCompanies.map(c => c.name);
      const { data: jobsData } = await supabase.from('jobs').select('source, salary_range').in('source', companyNames).eq('active', true).eq('approved', true);

      finalCompanies = finalCompanies.map(company => {
        const companyJobs = (jobsData || []).filter(j => j.source === company.name);
        const activeJobsCount = companyJobs.length;

        let totalSalary = 0;
        let validSalaries = 0;
        companyJobs.forEach(job => {
          if (job.salary_range && !job.salary_range.toLowerCase().includes('not disclosed')) {
            const nums = job.salary_range.match(/\d+(?:,\d+)*/g);
            if (nums) {
              const parsedNums = nums.map((n: string) => parseInt(n.replace(/,/g, ''), 10)).filter((n: number) => n > 1000); 
              if (parsedNums.length > 0) {
                const avg = parsedNums.reduce((a: number, b: number) => a + b, 0) / parsedNums.length;
                totalSalary += avg;
                validSalaries++;
              }
            }
          }
        });

        let avgSalaryStr = 'Not Disclosed';
        if (validSalaries > 0) {
          const finalAvg = Math.round(totalSalary / validSalaries);
          avgSalaryStr = `$${(finalAvg / 1000).toFixed(0)}k/yr`; 
        }

        return { ...company, activeJobsCount, avgSalaryStr }; 
      });
    }

    // List ko replace kar dena on new page
    setCompanies(finalCompanies);
    setHasMore(hasMoreFlag);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies(currentPage, sortOption);
    // Jab url se page badlega ya filter change hoga toh API dobara hit hogi
  }, [currentPage, sortOption, filterCountry]); 

  const handleSortChange = (key: string) => {
    setSortOption(key);
    setIsDropdownOpen(false);
    // Sort change ho to page 1 par reset kar dein
    router.push(`${pathname}?page=1`);
  };

  const handleCountryChange = (name: string) => {
    setFilterCountry(name);
    setShowCountryDropdown(false);
    // Filter change ho to page 1 par reset kar dein
    router.push(`${pathname}?page=1`);
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
          
          <div className="flex justify-end mb-6">
            
            <div className="relative inline-block text-left z-20">
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                
                {/* 🌍 Location Filter */}
                <div className="relative inline-block text-left z-30">
                  <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location:</label>
                      <button 
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center gap-2 pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#131b2b] text-gray-900 dark:text-white shadow-sm cursor-pointer min-w-56 relative"
                      >
                          🌍 {filterCountry === 'All' ? 'Any Country' : filterCountry}
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </button>
                  </div>

                  {showCountryDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#131b2b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                              <input 
                                  type="text"
                                  placeholder="Search country..."
                                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#0b0f19] border-none rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)} 
                              />
                          </div>

                          <ul className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                              <li onClick={() => handleCountryChange('All')} className="p-3 text-sm hover:bg-gray-100 dark:hover:bg-[#1a2333] cursor-pointer rounded-lg text-gray-800 dark:text-gray-200">
                                Any Country
                              </li>
                              
                              {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((c) => (
                                  <li 
                                      key={c.name}
                                      onClick={() => handleCountryChange(c.name)}
                                      className="flex items-center gap-2 p-3 text-sm hover:bg-gray-100 dark:hover:bg-[#1a2333] cursor-pointer rounded-lg text-gray-800 dark:text-gray-200"
                                  >
                                      <span>{c.flag}</span> {c.name}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
                </div>

                {/* 🔽 Sort Options */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-filter" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Sort by:
                  </label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl bg-white dark:bg-[#131b2b] text-gray-900 dark:text-white shadow-sm cursor-pointer min-w-56"
                    >
                      {sortOptionsData[sortOption].icon}
                      {sortOptionsData[sortOption].text}
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </button>

                    <ul 
                      className={`absolute right-0 top-full mt-2 w-full p-2 bg-white dark:bg-[#131b2b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg transform transition-all duration-300 ease-out z-20 ${
                        isDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      {Object.entries(sortOptionsData).map(([key, data]) => (
                        <li key={key}>
                          <button 
                            onClick={() => handleSortChange(key)}
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

              </div>
            </div>
            
            {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>}
            {showCountryDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowCountryDropdown(false)}></div>}
          </div>

          <div className="flex flex-col gap-6 max-w-5xl mx-auto min-h-[500px]">
            {loading ? (
              <div className="flex justify-center items-center h-full pt-20">
                 <div className="flex items-center gap-2 text-indigo-500 font-medium">
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading Companies...
                </div>
              </div>
            ) : (
              companies.map((company, index) => (
                <div 
                  key={`${company.slug}-${index}`} 
                  className="group flex flex-col sm:flex-row bg-white dark:bg-[#131b2b] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 relative gap-6 items-start"
                >
                  {/* Left: Smart Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 dark:bg-[#0b0f19] border border-gray-100 dark:border-gray-800 p-2.5 flex-shrink-0 overflow-hidden flex items-center justify-center mt-1">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt={`${company.name} logo`} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">{company.name.charAt(0)}</span>
                    )}
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 flex flex-col w-full">
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

                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        📍 {company.location || "Remote / Global"}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed line-clamp-2">
                      {company.description || `Join ${company.name} and work on exciting new projects with a dynamic global team.`}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                        <BriefcaseBusiness className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[13px] font-bold text-indigo-900 dark:text-indigo-200">
                          {company.activeJobsCount} <span className="font-medium text-indigo-600 dark:text-indigo-400">Open {company.activeJobsCount === 1 ? 'Role' : 'Roles'}</span>
                        </span>
                      </div>

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

                  {/* Right: Action Button */}
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
              ))
            )}
          </div>

          {/* 🔗 SEO Friendly Pagination Links */}
          {!loading && (
            <div className="mt-12 flex justify-center items-center gap-4">
              {currentPage > 1 ? (
                <Link 
                  href={`?page=${currentPage - 1}`}
                  className="px-6 py-2.5 bg-white dark:bg-[#131b2b] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a2333] transition-colors font-medium shadow-sm"
                >
                  &larr; Previous
                </Link>
              ) : (
                <button disabled className="px-6 py-2.5 bg-gray-100 dark:bg-[#0b0f19] border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 rounded-xl font-medium cursor-not-allowed">
                  &larr; Previous
                </button>
              )}

              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                Page {currentPage} of {totalPages > 0 ? totalPages : '...'}
              </span>

              {hasMore ? (
                <Link 
                  href={`?page=${currentPage + 1}`}
                  className="px-6 py-2.5 bg-white dark:bg-[#131b2b] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a2333] transition-colors font-medium shadow-sm"
                >
                  Next &rarr;
                </Link>
              ) : (
                <button disabled className="px-6 py-2.5 bg-gray-100 dark:bg-[#0b0f19] border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 rounded-xl font-medium cursor-not-allowed">
                  Next &rarr;
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// Next.js ke liye useSearchParams ko Suspense me wrap karna zaroori hai
export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Data...</div>}>
      <CompaniesContent />
    </Suspense>
  );
}
