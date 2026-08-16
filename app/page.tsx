// app/page.tsx (Server Component)
import { Metadata } from 'next';
import HomePageClient from './HomePageClient'; 
import { Suspense } from 'react';
import { typesenseSearchClient } from '@/lib/typesenseClient'; 

export const revalidate = 86400;

// Next.js 15 Strict Types
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 🚀 DYNAMIC SEO GENERATOR
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams || {}; 

  const categoryRaw = typeof resolvedParams?.category === 'string' && resolvedParams.category !== 'All' ? resolvedParams.category : '';
  const locationRaw = typeof resolvedParams?.location === 'string' ? resolvedParams.location : '';
  const tagRaw = typeof resolvedParams?.tag === 'string' ? resolvedParams.tag : '';
  const qRaw = typeof resolvedParams?.q === 'string' ? resolvedParams.q : ''; 
  
  // 👇 YEH NAYA ADD KARO
  const pageRaw = typeof resolvedParams?.page === 'string' ? parseInt(resolvedParams.page, 10) : 0;

  const category = String(categoryRaw || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); 
  const location = String(locationRaw || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const tag = String(tagRaw || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const query = String(qRaw || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  let dynamicTitle = 'HireSkys | #1 Remote Jobs Marketplace';
  let dynamicDesc = 'Find verified high-paying remote jobs in Development, Design, AI, and Marketing. 100% Remote, No office politics.';
  
  const titleParts = ['Remote'];
  
  if (query) {
      titleParts.push(query);
  } else if (tag) {
      titleParts.push(tag);
  } else if (category) {
      titleParts.push(category);
  }
  
  titleParts.push('Jobs');

  if (location) {
      titleParts.push(`in ${location}`);
  }

  if (category || location || tag || query) {
      dynamicTitle = `${titleParts.join(' ')} | HireSkys`;
      dynamicDesc = `Looking for ${titleParts.join(' ').toLowerCase()}? Browse the best verified 100% remote opportunities on HireSkys. Apply today!`;
  }

  // 👇 PAGE NUMBER KO TITLE MEIN ADD KARO (agar page > 0)
if (pageRaw > 0) {
    const baseTitle = (category || location || tag || query) 
        ? `${titleParts.join(' ')}` 
        : 'HireSkys Remote Jobs';   // 👈 clean fallback for homepage pagination
    dynamicTitle = `${baseTitle} - Page ${pageRaw + 1} | HireSkys`;
}

  // Canonical URL Builder
  const currentParams = new URLSearchParams();
  if (categoryRaw) currentParams.set('category', categoryRaw);
  if (locationRaw) currentParams.set('location', locationRaw);
  if (tagRaw) currentParams.set('tag', tagRaw);
  
  // 👇 PAGE KO CANONICAL MEIN BHI ADD KARO (sirf jab 0 se zyada ho)
  if (pageRaw > 0) currentParams.set('page', String(pageRaw));
  
  const queryString = currentParams.toString() ? `?${currentParams.toString()}` : '';
  const canonicalUrl = `https://www.hireskys.com${queryString}`;

  // 🚀 ROBOTS LOGIC — YEH ASLI FIX HAI
  const isCleanHomepage = !categoryRaw && !locationRaw && !tagRaw && !query;
  const shouldIndex = isCleanHomepage && pageRaw === 0;  // 👈 pageRaw === 0 condition add ki

  return {
    title: dynamicTitle,
    description: dynamicDesc,
    alternates: {
        canonical: canonicalUrl,
    },
    robots: {
        index: shouldIndex, 
        follow: true,
    },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDesc,
      url: canonicalUrl,
    },
    twitter: {
      title: dynamicTitle,
      description: dynamicDesc,
    }
  };
}

// 🚀 ASYNC MAIN PAGE COMPONENT (SERVER-SIDE FETCHING)
export default async function Page({ searchParams }: Props) {
  const resolvedParams = await searchParams || {};
  
  // 1. URL se page nikal lo (Default 0 rakho)
  const pageParam = typeof resolvedParams?.page === 'string' ? parseInt(resolvedParams.page, 10) : 0;
  const LIMIT = 20;
  const from = pageParam * LIMIT;
  const to = from + LIMIT - 1;

  // 2. 🚀 SERVER SIDE QUERY: Googlebot ko seedha render ho kar data milega
const categoryRaw = typeof resolvedParams?.category === 'string' && resolvedParams.category !== 'All' ? resolvedParams.category : '';

  const filters: string[] = ['approved:=true', 'active:=true'];
  if (categoryRaw) filters.push(`category:=${categoryRaw}`);

  let initialJobs: any[] = [];
  let count = 0;

  try {
      const results: any = await typesenseSearchClient.collections('jobs').documents().search({
          q: '*',
          query_by: 'title,category,tags,source',
          filter_by: filters.join(' && '),
          sort_by: 'featured_until:desc,date_posted_ts:desc',
          per_page: LIMIT,
          page: pageParam + 1, // Typesense 1-indexed
      });

      initialJobs = results.hits?.map((h: any) => h.document) || [];
      count = results.found || 0;
  } catch (err) {
      console.error("Typesense SSR fetch error:", err);
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HireSkys",
    "alternateName": ["Hire Skys", "HireSkys Job Radar", "HireSkys Remote Jobs"], 
    "url": "https://www.hireskys.com",
    "description": "HireSkys elite job radar for developers and creatives. Find verified remote jobs and prove your skills.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.hireskys.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        {/* 3. 🚀 PASS DATA TO CLIENT COMPONENT */}
        <HomePageClient 
            serverJobs={initialJobs || []} 
            serverCount={count || 0} 
            serverPage={pageParam} 
        />
      </Suspense>
    </>
  );
}