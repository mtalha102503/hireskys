import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSlug } from '@/lib/utils';
import Navbar from '@/components/Navbar'; 
import VideoPlayerFacade from '@/components/VideoPlayerFacade';
import Image from 'next/image'; // ✅ SEO: Performance ke liye zaroori
import type { Metadata } from 'next';
import { 
  Globe, MapPin, Users, Calendar, 
  CheckCircle, Briefcase, Building2, ArrowUpRight,
  ExternalLink, DollarSign, Share2
} from 'lucide-react';

// 👇 FIX: Faster Page Load (Server Response Time improve karega)
export const revalidate = 3600; 

type Props = {
  params: Promise<{ company_name: string }>;
  searchParams: Promise<{ tab?: string }>;
}

// --- 1. SEO METADATA (🔥 UPGRADED 8x) ---
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams; // ✅ searchParams ko await karo
  const urlSlug = decodeURIComponent(resolvedParams.company_name);
  
  // ✅ Check karo ke kya URL mein koi parameter hai?
  const hasQueryParams = !!resolvedSearchParams?.tab;

  const { data: manualCompany } = await supabase
    .from('companies')
    .select('name, description, logo_url')
    .eq('slug', urlSlug)
    .single();

  if (!manualCompany) {
    return { 
      title: 'Company Not Found',
      robots: { index: false, follow: false }
    };
  }

  const title = `${manualCompany.name} Remote Jobs & Careers`;
  const desc = manualCompany.description?.slice(0, 160) || `Apply for remote jobs at ${manualCompany.name}. Verified career opportunities and hiring details.`;
  const cleanUrl = `https://www.hireskys.com/companies/${urlSlug}`;

  return {
    title: title,
    description: desc,
    keywords: [`${manualCompany.name} jobs`, `${manualCompany.name} remote careers`, "remote work", "tech jobs", "HireSkys"],
    authors: [{ name: "HireSkys Team" }],
    robots: { 
      index: !hasQueryParams, 
      follow: true, // follow hamesha true rakho taake Google jobs ke links tak ja sake
      googleBot: {
        index: !hasQueryParams,
        follow: true,
      }
    },
    alternates: {
      // 🔥 CANONICAL HAMESHA CLEAN URL RAHEGA, chahe koi bhi tab ho
      canonical: cleanUrl,
    },
    openGraph: {
      title: title,
      description: desc,
      url: cleanUrl,
      siteName: 'HireSkys',
      images: [{
        url: manualCompany.logo_url || '/og-main.png',
        width: 1200,
        height: 630,
        alt: `${manualCompany.name} hiring banner`,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: desc,
      images: [manualCompany.logo_url || '/og-main.png'],
    },
  };
}

// --- 2. MAIN PAGE ---
export default async function CompanyPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const slug = decodeURIComponent(resolvedParams.company_name); 
  const currentTab = resolvedSearchParams?.tab || 'overview'; // 🚨 Default tab "overview" hoga

  // 🛑 STEP 1: Fetch Company Data (LOGIC UNTOUCHED)
  const { data: manualData } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!manualData) return notFound();

// ✅ STEP 2: Fetch Related Jobs (🔥 SUPER SMART MATCHING)
  // Asli company name dhoondo aur har special character (dot, space, dash, &) ko '%' bana do
  const smartSourceName = manualData.name.replace(/[^a-zA-Z0-9]/g, '%'); 

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .ilike('source', `%${smartSourceName}%`) // 👈 Case-insensitive + Wildcard Magic
    .eq('approved', true)
    .eq('active', true)
    .order('date_posted', { ascending: false });

  const jobList = jobs || [];
// Data Clean-up
  const companyName = manualData.name;
  const companyLogo = manualData.logo_url || '/default-company-icon.png';
  const description = manualData.description || `We connect top-tier professionals with flexible opportunities.`;
  const website = manualData.website || "#";
  const location = manualData.location || "Remote";
  const isVerified = manualData.verified || false;
  const hasCustomBanner = !!manualData.banner_url;
  const industry = manualData.industry || manualData.category || "Technology";
  let itemListSchema = null;
  
  // Agar company ki jobs available hain, tabhi list schema banega
  if (jobList.length > 0) {
    itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Active Remote Jobs at ${companyName}`,
      "description": `List of current open remote positions at ${companyName}.`,
      // .map() use karke automatically jobs ki list generate kar rahe hain
      "itemListElement": jobList.map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1, // Position hamesha 1 se shuru hoti hai
        "name": job.title,
        "url": `https://www.hireskys.com/jobs/${createSlug(job.title, job.id)}`
      }))
    };
  }
// 🟢 SMART YOUTUBE ID EXTRACTOR
  let videoId = null;
  if (manualData.promo_video_url && manualData.promo_video_url !== 'Not Found') {
    // Yeh Regex kisi bhi qisam ke YouTube URL (youtu.be, watch?v=, embed/) se exact 11-character ID nikal leta hai
    const match = manualData.promo_video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }
  // 🧠 THE SMART BENEFITS EXTRACTOR ENGINE
  const combinedDescriptions = jobList.map(job => job.description || '').join(' ').toLowerCase();
  const potentialBenefits = [
    { id: 'health', icon: '🏥', title: 'Health & Medical', desc: 'Comprehensive medical, dental, and vision coverage for you and your dependents.', keywords: ['health insurance', 'medical', 'dental', 'vision', 'healthcare'] },
    { id: 'pto', icon: '✈️', title: 'Paid Time Off', desc: 'Generous paid time off, holidays, and sick days to help you rest and recharge.', keywords: ['pto', 'paid time off', 'unlimited vacation', 'paid holidays'] },
    { id: 'financial', icon: '📈', title: 'Equity & Retirement', desc: 'Competitive retirement matching and equity options to build your future wealth.', keywords: ['401k', 'equity', 'stock options', 'retirement matching', 'pension'] },
    { id: 'flexibility', icon: '🏡', title: 'Flexible Working', desc: 'Work from anywhere with flexible hours that fit your personal lifestyle.', keywords: ['flexible hours', 'work from anywhere', 'flexible schedule', 'remote first'] },
    { id: 'learning', icon: '📚', title: 'Learning & Development', desc: 'Dedicated budget for courses, conferences, and continuous skill building.', keywords: ['learning stipend', 'education budget', 'tuition reimbursement', 'conference budget'] },
    { id: 'equipment', icon: '💻', title: 'Home Office Setup', desc: 'Generous stipend to set up a comfortable and productive remote workspace.', keywords: ['home office stipend', 'equipment allowance', 'macbook', 'hardware'] },
    { id: 'wellness', icon: '🧘', title: 'Wellness Perks', desc: 'Allowances for gym memberships, mental health apps, and overall wellbeing.', keywords: ['gym membership', 'wellness stipend', 'mental health', 'therapy', 'wellness'] }
  ];
  const extractedBenefits = potentialBenefits.filter(benefit =>
    benefit.keywords.some(keyword => combinedDescriptions.includes(keyword))
  );
// 💰 THE SMART SALARY ENGINE (With Graph Data Processing)
  const rawJobsWithSalary = jobList.filter(job => 
    job.salary_range && 
    !job.salary_range.toLowerCase().includes('not disclosed') && 
    !job.salary_range.toLowerCase().includes('not mentioned')
  );

  // 1. Min aur Max numbers extract karo har job ke liye
  const jobsWithSalary = rawJobsWithSalary.map(job => {
    const nums = job.salary_range.match(/\d+(?:,\d+)*/g);
    let min = 0, max = 0;
    if (nums) {
      const parsedNums = nums.map((n: string) => parseInt(n.replace(/,/g, ''), 10)).map((n: number) => n < 1000 ? n * 1000 : n);
      min = Math.min(...parsedNums);
      max = Math.max(...parsedNums);
    }
    return { ...job, parsedMin: min, parsedMax: max };
  }).filter(job => job.parsedMax > 0);

  // 2. Graph ki scale banane ke liye Global Min/Max dhoondo
  let highestSalaryNum = 0;
  let globalMax = 0;

  jobsWithSalary.forEach(j => {
    if (j.parsedMax > highestSalaryNum) highestSalaryNum = j.parsedMax;
    if (j.parsedMax > globalMax) globalMax = j.parsedMax;
  });

  // Agar scale choti hai toh thori padding add kardo taake graph end tak na chipkay
  const chartMaxScale = globalMax * 1.1; 

  const highestSalaryFormatted = highestSalaryNum > 0 
    ? `$${(highestSalaryNum / 1000).toFixed(0)}k/yr` 
    : 'Competitive';
  // 🌟 NEW: COMPREHENSIVE SCHEMA (Google Knowledge Graph + Structure)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyName,
    "url": website !== "#" ? website : `https://www.hireskys.com/companies/${slug}`,
    "logo": companyLogo,
    "description": description,
    "sameAs": [website !== "#" ? website : null].filter(Boolean),
  };
// 🟢 VVIP: VIDEO SCHEMA FOR GOOGLE AUTHORITY (600+ Scale Optimization)
  const videoSchema = videoId ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${companyName} Remote Work Culture & Office Tour`,
    "description": `Explore ${companyName}'s remote work environment, employee benefits, and culture. See why professionals are joining ${companyName} on HireSkys.`,
    "thumbnailUrl": [
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    ],
    "uploadDate": manualData.created_at || new Date().toISOString(),
    "contentUrl": `https://www.youtube.com/watch?v=${videoId}`,
    "embedUrl": `https://www.youtube.com/embed/${videoId}`,
    "publisher": {
      "@type": "Organization",
      "name": "HireSkys",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.hireskys.com/logo2.png"
      }
    }
  } : null;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": `Is ${companyName} hiring remotely?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Yes, ${companyName} has ${jobList.length} active remote job openings on HireSkys.`
      }
    }]
  };

  // 🔥 ADDED: Breadcrumb Schema (Google ko rasta dikhane ke liye)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.hireskys.com"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Companies",
      "item": "https://www.hireskys.com/companies"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": companyName,
      "item": `https://www.hireskys.com/companies/${slug}`
    }]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans pb-20">
      
      {/* 🚀 THE CRITICAL SEO FIX: INJECTING SCHEMAS FOR GOOGLE */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {videoSchema && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
       )}

      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <Navbar />

      {/* 🌟 VVIP HEADER SECTION (Logo + Info + Tabs) */}
      <div className="bg-white dark:bg-[#131b2b] border-b border-gray-200 dark:border-gray-800">
        
        {/* Banner */}
        <div className="relative h-48 md:h-64 w-full overflow-hidden bg-slate-900 group">
          {hasCustomBanner ? (
             <Image src={manualData.banner_url} alt={`${companyName} banner`} fill priority className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" sizes="100vw"/>
          ) : (
             <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-purple-900 to-[#0B0F19]"></div>
          )}
        </div>

        {/* Company Info Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:mt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-start gap-5 pb-6">
            
            {/* Big Logo Overlap */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white dark:bg-[#0B0F19] border-4 border-white dark:border-[#131b2b] shadow-xl p-3 flex-shrink-0 relative overflow-hidden sm:-mt-20 z-10">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                <Image src={companyLogo} alt={`${companyName} Logo`} fill className="object-contain p-2" sizes="160px" />
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0B0F19] rounded-full p-1.5 z-10">
                  <CheckCircle size={24} className="text-indigo-500 fill-indigo-500/20" />
                </div>
              )}
            </div>

            {/* Title & Details */}
            <div className="flex-1 w-full pt-4 sm:pt-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
                {companyName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                  <Building2 size={16}/> {industry}
                </span>
                <span className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  <MapPin size={16}/> {location}
                </span>
              </div>
            </div>

            {/* Visit Website Button (Mobile pe hidden) */}
            <div className="hidden sm:block w-full sm:w-auto mt-2 sm:mt-6">
               {website !== "#" && (
                <a href={website} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
                  Visit Website <ArrowUpRight size={18} />
                </a>
              )}
            </div>

          </div>

          {/* 🎯 THE NAVIGATION TABS (Premium Pill Buttons) */}
          <div className="flex overflow-x-auto hide-scrollbar gap-3 border-t border-gray-100 dark:border-gray-800/60 pt-6 mt-4 pb-2">
            
            <Link href="?tab=overview" className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${currentTab === 'overview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-600' : 'bg-white dark:bg-[#1a2333] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Overview
            </Link>
            
            <Link href="?tab=jobs" className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${currentTab === 'jobs' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-600' : 'bg-white dark:bg-[#1a2333] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Jobs 
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentTab === 'jobs' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                {jobList.length}
              </span>
            </Link>
            
            {extractedBenefits.length > 0 && (
              <Link href="?tab=benefits" className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${currentTab === 'benefits' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-600' : 'bg-white dark:bg-[#1a2333] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                Benefits
              </Link>
            )}

            <Link href="?tab=salaries" className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${currentTab === 'salaries' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-600' : 'bg-white dark:bg-[#1a2333] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Salaries
            </Link>

          </div>
        </div>
      </div>

      {/* 🌟 DYNAMIC CONTENT AREA (SEO HACK APPLIED) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* TAB 1: OVERVIEW */}
        <div className={currentTab === 'overview' ? 'block animate-in fade-in duration-500' : 'hidden'}>
          <div className="bg-white dark:bg-[#131b2b] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About {companyName}</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line">
                {description}
              </p>
            </div>
            {videoId && (
              <div className="mt-10 mb-6">
                <div className="rounded-3xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-2xl relative aspect-video bg-gray-100 dark:bg-[#0B0F19] group cursor-pointer">
                  <VideoPlayerFacade videoId={videoId} companyName={companyName} />
                </div>
                {/* 🟢 SEO Power Move: Semantic Text below video */}
                <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></span>
                  <p className="text-[13px] font-medium italic">
                    Inside look: <strong className="text-indigo-600 dark:text-indigo-400 not-italic">Remote culture and values</strong> at {companyName}
                  </p>
                  <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></span>
                </div>
              </div>
            )}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Founded In</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {manualData.founded_year || "Not Disclosed"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Company Size</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {manualData.company_size ? `${manualData.company_size}` : "Growing Fast"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Industry</span>
                <span className="font-semibold text-gray-900 dark:text-white">{industry}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 2: JOBS */}
        <div className={currentTab === 'jobs' ? 'block animate-in fade-in duration-500' : 'hidden'}>
          <div className="max-w-4xl space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
              Open Positions
              <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                {jobList.length} Roles
              </span>
            </h2>

            {jobList.length > 0 ? jobList.map((job) => (
              <Link key={job.id} href={`/jobs/${createSlug(job.title, job.id)}`} className="block group">
                <div className="relative bg-white dark:bg-[#131b2b] p-6 sm:p-7 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(79,70,229,0.12)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-4">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                          <MapPin size={14} className="text-gray-500 dark:text-gray-400"/>
                          <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">{job.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                          <DollarSign size={14} className="text-emerald-600 dark:text-emerald-400"/>
                          <span className="text-[13px] font-bold text-emerald-900 dark:text-emerald-200">
                            {job.salary_range && !job.salary_range.toLowerCase().includes('not disclosed') ? job.salary_range : 'Salary Not Disclosed'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-end">
                      <span className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300">
                        View Role <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
               <div className="py-16 bg-white dark:bg-[#131b2b] rounded-2xl text-center border border-dashed border-gray-300 dark:border-gray-700">
                  <Briefcase size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">No active roles right now</h3>
               </div>
            )}
          </div>
        </div>

        {/* TAB 3: BENEFITS */}
        {extractedBenefits.length > 0 && (
          <div className={currentTab === 'benefits' ? 'block animate-in fade-in duration-500' : 'hidden'}>
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Benefits and perks at {companyName}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-[15px]">
                  Learn about the {extractedBenefits.length} benefits and perks {companyName} offers its remote employees.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 bg-white dark:bg-[#131b2b] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                {extractedBenefits.map(b => (
                  <div key={b.id} className="flex flex-col group">
                    <span className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{b.icon}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SALARIES */}
        <div className={currentTab === 'salaries' ? 'block animate-in fade-in duration-500' : 'hidden'}>
          <div className="max-w-4xl space-y-8">
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Salary ranges at {companyName}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-[15px]">
                Estimated compensation ranges based on {jobsWithSalary.length} active job postings.
              </p>
            </div>

            {jobsWithSalary.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-center">
                    <span className="block text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                      Highest Compensation
                    </span>
                    <h3 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-1 drop-shadow-sm">
                      {highestSalaryFormatted}
                    </h3>
                  </div>

                  <div className="bg-white dark:bg-[#131b2b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Data Availability
                    </span>
                    <h3 className="text-4xl sm:text-5xl font-black text-emerald-500 mb-1">
                      {Math.round((jobsWithSalary.length / jobList.length) * 100)}%
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      of open roles have disclosed salaries.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#131b2b] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden p-6 sm:p-8">
                  <div className="flex justify-between items-end mb-8 border-b border-gray-100 dark:border-gray-800/60 pb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Salary ranges by position
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-200 dark:bg-indigo-900"></span> Min</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Max</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {jobsWithSalary.map(job => {
                      const leftPercent = (job.parsedMin / chartMaxScale) * 100;
                      const widthPercent = Math.max(2, ((job.parsedMax - job.parsedMin) / chartMaxScale) * 100);

                      return (
                        <div key={job.id} className="group relative">
                          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <div className="w-full md:w-1/3 flex-shrink-0">
                              <Link href={`/jobs/${createSlug(job.title, job.id)}`} className="text-[15px] font-bold text-gray-900 dark:text-white hover:text-indigo-500 transition-colors line-clamp-1">
                                {job.title}
                              </Link>
                            </div>
                            
                            <div className="flex-1 h-6 bg-gray-50 dark:bg-gray-800/50 rounded-full relative w-full overflow-hidden border border-gray-100 dark:border-gray-800 hidden md:block">
                              <div 
                                className="absolute h-full bg-gradient-to-r from-indigo-300 to-indigo-500 dark:from-indigo-600 dark:to-indigo-400 rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                              ></div>
                            </div>

                            <div className="w-full md:w-1/4 flex-shrink-0 text-right">
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg text-sm">
                                {job.salary_range}
                              </span>
                            </div>
                          </div>
                          
                          <div className="w-full h-4 bg-gray-50 dark:bg-gray-800/50 rounded-full relative overflow-hidden border border-gray-100 dark:border-gray-800 block md:hidden mt-2">
                              <div 
                                className="absolute h-full bg-gradient-to-r from-indigo-300 to-indigo-500 dark:from-indigo-600 dark:to-indigo-400 rounded-full"
                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                              ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>$0</span>
                    <span>${(globalMax / 1000).toFixed(0)}k+</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 bg-white dark:bg-[#131b2b] rounded-3xl text-center border border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
                 <div className="text-5xl mb-4 opacity-40">💸</div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No salary data available</h3>
                 <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-[15px] leading-relaxed">
                   {companyName} hasn't disclosed salaries for their current open roles. We'll update this section automatically as soon as data becomes available.
                 </p>
              </div>
            )}
          </div>
        </div>

      </div>
      {/* 📱 STICKY MOBILE CTA (Company Page) - Cleaned Up */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 z-[9999] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-center max-w-md mx-auto">
          
          {/* 🚀 Main Action: Visit Website ya Jobs Tab (Sirf Akela Button) */}
          {website !== "#" ? (
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[15px] text-center font-extrabold rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              Visit Website <ArrowUpRight size={18} />
            </a>
          ) : (
            <Link 
              href="?tab=jobs"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[15px] text-center font-extrabold rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              View {jobList.length} Jobs
            </Link>
          )}
          
        </div>
      </div>
    </div>
  );
}
