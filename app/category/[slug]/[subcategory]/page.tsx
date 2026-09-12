import Link from 'next/link';
import { createSlug } from '@/lib/utils';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { CATEGORIES, findCategoryKeyBySlug } from '@/lib/categories';
import { typesenseSearchClient } from '@/lib/typesenseClient';
import { 
  ArrowLeft, Code, Smartphone, Video, Layout, Globe, Edit3, Cpu, 
  Briefcase, Search, MapPin, DollarSign, Calendar, Sparkles, Speaker, Headphones, Users, ShieldCheck, BookOpen, BarChart, PenTool, HelpCircle
} from 'lucide-react';

// 📝 Lamba single-paragraph intro text ko 2-3 chhote paragraphs mein todta hai, readability ke liye
const splitIntoParagraphs = (text: string): string[] => {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunkSize = Math.ceil(sentences.length / 3); // roughly 3 paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += chunkSize) {
    paragraphs.push(sentences.slice(i, i + chunkSize).join(' ').trim());
  }
  return paragraphs;
};
type Props = {
  params: Promise<{ slug: string; subcategory: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 🌟 HELPER
const findRealTag = (categorySlug: string, subSlug: string) => {
  const mainKey = findCategoryKeyBySlug(categorySlug);
  if (!mainKey) return null;
  return CATEGORIES[mainKey].sub.find(sub => 
    sub.toLowerCase().replace(/[^a-z0-9]+/g, '-') === subSlug
  );
};

const findMainCategoryName = (categorySlug: string) => findCategoryKeyBySlug(categorySlug);


export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const realTag = findRealTag(resolvedParams.slug, resolvedParams.subcategory);
  const displayTitle = realTag || decodeURIComponent(resolvedParams.subcategory).replace(/-/g, ' ');

  return {
    title: currentPage > 1 ? `Page ${currentPage} - Remote ${displayTitle} Jobs | HireSkys` : `Remote ${displayTitle} Jobs | HireSkys`,
    description: `Apply to verified ${displayTitle} jobs.`,
    alternates: {
      canonical: `https://www.hireskys.com/category/${resolvedParams.slug}/${resolvedParams.subcategory}`,
    },
    robots: {
      index: currentPage === 1,
      follow: true,
    },
  };
}
// 🌍 LOCATION & FLAG HELPER
const formatLocation = (locationText: string) => {
  if (!locationText) return { name: "Worldwide", flag: "🌍" };

  let countryName = "Worldwide";
  let flag = "🌍";

  // Regex to extract text inside brackets: e.g., "Remote (United States)" -> "United States"
  const match = locationText.match(/\(([^)]+)\)/);
  
  if (match && match[1]) {
    // Agar multiple countries hain (e.g. "Ethiopia, United States"), to pehli utha lo
    countryName = match[1].split(',')[0].trim();
  } else if (locationText.toLowerCase() !== "remote" && locationText.toLowerCase() !== "remote (global)") {
    countryName = locationText.replace(/remote/i, "").trim();
  }

  // Map to shorter names and flags
  const countryMap: Record<string, { name: string; flag: string }> = {
    "United States": { name: "USA", flag: "🇺🇸" },
    "United Kingdom": { name: "UK", flag: "🇬🇧" },
    "Germany": { name: "Germany", flag: "🇩🇪" },
    "Canada": { name: "Canada", flag: "🇨🇦" },
    "Australia": { name: "Australia", flag: "🇦🇺" },
    "India": { name: "India", flag: "🇮🇳" },
    "Global": { name: "Worldwide", flag: "🌍" },
    "Europe": { name: "Europe", flag: "🇪🇺" },
    "Latin America": { name: "LATAM", flag: "🌎" },
  };

  return countryMap[countryName] || { name: countryName || "Worldwide", flag: "📍" };
};
export default async function SubCategoryJobsPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // 3️⃣ Pagination Variables
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const JOBS_PER_PAGE = 24; // Ek page par kitni jobs dikhani hain
  
  const exactTag = findRealTag(resolvedParams.slug, resolvedParams.subcategory);
  const searchTag = exactTag || decodeURIComponent(resolvedParams.subcategory).replace(/-/g, ' ');
  const displaySubCategory = exactTag || searchTag.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // 🚀 Query Logic — Typesense
  let jobs: any[] = [];
  let totalJobs = 0;
  let totalPages = 1;

  try {
    const filters: string[] = ['active:=true'];
    if (exactTag) {
      filters.push(`tags:=${exactTag}`);
    }

    const results: any = await typesenseSearchClient.collections('jobs').documents().search({
      q: exactTag ? '*' : searchTag,
      query_by: exactTag ? 'title' : 'tags',
      filter_by: filters.join(' && '),
      sort_by: 'date_posted_ts:desc',
      per_page: JOBS_PER_PAGE,  // Puraani 250 ki limit hata di
      page: currentPage,        // Current page Typesense ko pass kiya
    });

    totalJobs = results.found || 0;
    totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

    jobs = (results.hits?.map((h: any) => h.document) || []).map((doc: any) => ({
      ...doc,
      id: Number(doc.id),
    }));
  } catch (err) {
    console.error("Typesense subcategory jobs fetch error:", err);
  }

  // 🧠 SEO Content — ab Typesense se direct fetch (seed script + sync route se pehle hi populate ho chuka hai)
  const mainCategoryName = findMainCategoryName(resolvedParams.slug);
  const contentSlug = `${resolvedParams.slug}/${resolvedParams.subcategory}`;

  let introText = '';
  let faqs: { q: string; a: string }[] = [];

  if (mainCategoryName && totalJobs > 0 && currentPage === 1) {
    try {
      const contentResults: any = await typesenseSearchClient
        .collections('category_content')
        .documents()
        .search({
          q: '*',
          query_by: 'slug',
          filter_by: `slug:=${contentSlug}`,
          per_page: 1,
        });

      const contentDoc = contentResults.hits?.[0]?.document;
      if (contentDoc) {
        introText = contentDoc.intro_text || '';
        faqs = contentDoc.faqs ? JSON.parse(contentDoc.faqs) : [];
      }
    } catch (err) {
      console.error("Category content fetch error (Typesense):", err);
    }
  }

  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  // 🔴 NO JOBS STATE
  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19]">
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
                No {displaySubCategory} Jobs Found
            </h1>
            <p className="text-slate-500 mb-8 max-w-md text-lg">
                We couldn't find any active listings for this specific skill on page {currentPage}.
            </p>
            <Link 
                href={`/category/${resolvedParams.slug}`} 
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 font-medium"
            >
                <ArrowLeft size={20} /> Browse {resolvedParams.slug.replace(/-/g, ' ')}
            </Link>
        </div>
      </div>
    );
  }

  // 🟢 MAIN CONTENT
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19]">
      <Navbar />

      {/* 🧩 FAQ Schema for Google */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        <div className="mb-8">
            <Link 
                href={`/category/${resolvedParams.slug}`} 
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mr-2 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
                Back to {resolvedParams.slug.replace(/-/g, ' ')}
            </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Remote <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{displaySubCategory}</span> Jobs
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Found {totalJobs} verified opportunities
                </p>
            </div>
        </div>

        {introText && (
  <div className="mb-12 p-6 md:p-8 bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
    {splitIntoParagraphs(introText).map((para, i) => (
      <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] md:text-base">
        {para}
      </p>
    ))}
  </div>
)}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {jobs.map((job) => {
    // Har job ki location ko format karo loop ke andar
    const locData = formatLocation(job.location);

    return (
      <Link 
        key={job.id} 
        href={`/jobs/${createSlug(job.title, job.id)}`}
        className="group flex flex-col justify-between p-6 bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            
            {/* 🏢 COMPANY LOGO OR FALLBACK */}
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              {job.company_logo_url ? (
                <img 
                  src={job.company_logo_url} 
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-1.5"
                  loading="lazy"
                />
              ) : (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                  {job.company ? job.company.charAt(0).toUpperCase() : "H"}
                </span>
              )}
            </div>
            
            {/* 🌍 DYNAMIC LOCATION & FLAG BADGE */}
            <span className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800 flex items-center gap-1.5 shadow-sm">
              <span className="text-sm leading-none">{locData.flag}</span> 
              Remote ({locData.name})
            </span>
            
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
            {job.title}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
            {job.company || "Confidential Client"}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags?.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">
                {tag}
              </span>
            ))}
            {job.tags && job.tags.length > 3 && (
               <span className="text-[11px] font-medium text-slate-500 bg-slate-50 dark:bg-[#0B0F19] px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                 +{job.tags.length - 3}
               </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <DollarSign className="w-4 h-4 text-emerald-500" /> 
            {job.salary_range && job.salary_range !== "Not Disclosed" ? job.salary_range.replace('Yearly', '') : "Competitive"}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(job.date_posted).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </Link>
    );
  })}
</div>

        {/* 4️⃣ PAGINATION COMPONENT (UI) */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-4">
            {currentPage > 1 ? (
              <Link 
                href={`/category/${resolvedParams.slug}/${resolvedParams.subcategory}?page=${currentPage - 1}`}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-semibold shadow-sm"
              >
                Previous
              </Link>
            ) : (
              <button disabled className="px-5 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-slate-400 dark:text-slate-600 font-semibold cursor-not-allowed">
                Previous
              </button>
            )}

            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 px-4">
              Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of {totalPages}
            </div>

            {currentPage < totalPages ? (
              <Link 
                href={`/category/${resolvedParams.slug}/${resolvedParams.subcategory}?page=${currentPage + 1}`}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-semibold shadow-sm"
              >
                Next
              </Link>
            ) : (
              <button disabled className="px-5 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-slate-400 dark:text-slate-600 font-semibold cursor-not-allowed">
                Next
              </button>
            )}
          </div>
        )}

        {faqs.length > 0 && (
  <div className="mt-20">
    <div className="flex items-center gap-2 mb-8">
      <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Frequently Asked Questions
      </h2>
    </div>
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <details 
          key={i} 
          className="group bg-slate-50 dark:bg-[#151b2b] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 open:border-indigo-300 dark:open:border-indigo-800 open:shadow-md open:shadow-indigo-500/5 transition-all"
        >
          <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer flex items-center justify-between list-none">
            <span>{f.q}</span>
            <span className="ml-4 shrink-0 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-open:bg-indigo-600 group-open:text-white group-open:rotate-45 group-open:border-indigo-600 transition-all duration-300">
              +
            </span>
          </summary>
          <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm border-t border-slate-200 dark:border-slate-800 pt-4">
            {f.a}
          </p>
        </details>
      ))}
    </div>
  </div>
)}

        <div className="mt-20 text-center border-t border-slate-200 dark:border-slate-800 pt-10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Keep exploring
            </h3>
            <p className="text-slate-500 mb-6">
                Check out other specialized roles in {resolvedParams.slug.replace(/-/g, ' ')}.
            </p>
            <Link 
                href={`/category/${resolvedParams.slug}`} 
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
                <Briefcase className="w-4 h-4" />
                View all categories
            </Link>
        </div>

      </div>
    </div>
  );
}