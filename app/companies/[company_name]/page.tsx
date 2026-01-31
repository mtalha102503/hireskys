import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSlug } from '@/lib/utils';
import Navbar from '@/components/Navbar'; 
import Image from 'next/image'; // ✅ SEO: Performance ke liye zaroori
import type { Metadata } from 'next';
import { 
  Globe, MapPin, Users, Calendar, 
  CheckCircle, Briefcase, Building2, ArrowUpRight,
  ExternalLink
} from 'lucide-react';

// 👇 FIX: Faster Page Load (Server Response Time improve karega)
export const revalidate = 3600; 

type Props = {
  params: Promise<{ company_name: string }>
}

// --- 1. SEO METADATA (🔥 UPGRADED 8x) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const urlSlug = decodeURIComponent(resolvedParams.company_name);

  const { data: manualCompany } = await supabase
    .from('companies')
    .select('name, description, logo_url')
    .eq('slug', urlSlug)
    .single();

  if (!manualCompany) {
    return { 
      title: 'Company Not Found | HireSkys',
      robots: { index: false, follow: false } // 404 pages ko index mat karne do
    };
  }

  const title = `${manualCompany.name} Remote Jobs & Careers | HireSkys`;
  const desc = manualCompany.description?.slice(0, 160) || `Apply for remote jobs at ${manualCompany.name}. Verified career opportunities and hiring details.`;

  return {
    title: title,
    description: desc,
    keywords: [`${manualCompany.name} jobs`, `${manualCompany.name} remote careers`, "remote work", "tech jobs", "HireSkys"],
    authors: [{ name: "HireSkys Team" }],
    robots: { index: true, follow: true },
    openGraph: {
      title: title,
      description: desc,
      url: `https://www.hireskys.com/companies/${urlSlug}`,
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
    alternates: {
      canonical: `https://www.hireskys.com/companies/${resolvedParams.company_name}`,
    }
  };
}

// --- 2. MAIN PAGE ---
export default async function CompanyPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.company_name); 

  // 🛑 STEP 1: Fetch Company Data (LOGIC UNTOUCHED)
  const { data: manualData } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!manualData) {
    return notFound();
  }

  // ✅ STEP 2: Fetch Related Jobs (LOGIC UNTOUCHED)
  const jobSearchName = slug.replace(/-/g, ' '); 

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .ilike('source', `%${jobSearchName}%`)
    .eq('approved', true)
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans">
      
      {/* 👇 Combined SEO Injection (Clean & Fast) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, faqSchema, breadcrumbSchema]) }}
      />
      
      <Navbar />

      {/* --- HERO BANNER (Optimized with Next/Image) --- */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden bg-slate-900 group">
        {hasCustomBanner ? (
           <Image 
             src={manualData.banner_url} 
             alt={`${companyName} remote careers banner`}
             fill
             priority // ⚡ LCP improvement
             className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
             sizes="100vw"
           />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-[#0B0F19] to-black relative">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent"></div>
           </div>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-24 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- SIDEBAR --- */}
          <aside className="w-full lg:w-[350px] flex-shrink-0 lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-white dark:bg-[#151b2e] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm">
              <div className="relative -mt-16 mb-5 inline-block h-28 w-28">
                {/* ⚡ Optimized Logo Rendering */}
                <Image 
                  src={companyLogo} 
                  alt={`${companyName} Logo`} 
                  fill
                  className="rounded-2xl bg-white object-contain border-[5px] border-white dark:border-[#151b2e] shadow-lg"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                {isVerified && (
                  <div className="absolute bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full z-10 border-[4px] border-white dark:border-[#151b2e] shadow-sm">
                    <CheckCircle size={14} fill="currentColor" className="text-white"/>
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                {companyName}
              </h1>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
    <Building2 size={12}/> {industry}
  </span>
                {jobList.length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide">
                    Hiring Now
                    </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {website !== "#" && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
                    Visit Website <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
                <div className="flex items-center justify-between text-sm group cursor-default">
                  <span className="text-slate-500 flex items-center gap-2 group-hover:text-indigo-500 transition-colors"><MapPin size={16}/> Headquarters</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-right">{location}</span>
                </div>
                <div className="flex items-center justify-between text-sm group cursor-default">
                  <span className="text-slate-500 flex items-center gap-2 group-hover:text-indigo-500 transition-colors"><Briefcase size={16}/> Active Jobs</span>
                  <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{jobList.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151b2e] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">About Company</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-justify whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>
          </aside>

          {/* --- JOBS LIST --- */}
          <main className="flex-1 w-full pt-4 lg:pt-0">
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-[#151b2e] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Open Positions at {companyName}
              </h2>
              <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                {jobList.length} Available
              </span>
            </div>

            <div className="space-y-4">
              {jobList.map((job) => (
                <Link key={job.id} href={`/jobs/${createSlug(job.title, job.id)}`} className="block group">
                  <div className="relative bg-white dark:bg-[#151b2e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 group-hover:bg-slate-50/50 dark:group-hover:bg-[#1a2035]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-3 text-xs md:text-sm font-medium">
                          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg">
                            <MapPin size={13} className="text-slate-400"/> {job.location || 'Remote'}
                          </span>
                          <span className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 px-2.5 py-1.5 rounded-lg">
                            💰 {job.salary_range ? `${job.salary_range}` : 'Competitive Pay'}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <span className="inline-flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg shadow-indigo-500/30">
                          Apply Now <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        {/* 👇 FIX: Hydration Mismatch Avoidance (ISO String safe hota hai) */}
                        <Calendar size={12}/> Posted {new Date(job.date_posted).toISOString().split('T')[0]}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                        {job.job_type || 'Full Time'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              
              {jobList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#151b2e] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Briefcase size={24} className="text-slate-400"/>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active jobs found</h3>
                  <p className="text-slate-500 text-sm mt-1">This company has no open positions listed on HireSkys right now.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}