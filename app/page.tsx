// app/page.tsx (Server Component)
import { Metadata } from 'next';
import HomePageClient from './HomePageClient'; 
import { Suspense } from 'react';
// Next.js 15 Strict Types
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 🚀 DYNAMIC SEO GENERATOR
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;

  const categoryRaw = typeof resolvedParams?.category === 'string' && resolvedParams.category !== 'All' ? resolvedParams.category : '';
  const locationRaw = typeof resolvedParams?.location === 'string' ? resolvedParams.location : '';
  const tagRaw = typeof resolvedParams?.tag === 'string' ? resolvedParams.tag : '';
  const qRaw = typeof resolvedParams?.q === 'string' ? resolvedParams.q : ''; // 🚀 FIX 1: Grab 'q' (Search Query)

  const category = categoryRaw.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); 
  const location = locationRaw.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const tag = tagRaw.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const query = qRaw.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  let dynamicTitle = 'HireSkys | #1 Remote Jobs & Freelance Marketplace';
  let dynamicDesc = 'Find verified high-paying remote jobs in Development, Design, AI, and Marketing. 100% Remote, No office politics.';
  
  const titleParts = ['Remote'];
  
  // 🏆 Smart Title Priority: Query > Tag > Category
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

  // Canonical URL Builder (Exclude 'q' for better SEO)
  const currentParams = new URLSearchParams();
  if (categoryRaw) currentParams.set('category', categoryRaw);
  if (locationRaw) currentParams.set('location', locationRaw);
  if (tagRaw) currentParams.set('tag', tagRaw);
  
  const queryString = currentParams.toString() ? `?${currentParams.toString()}` : '';
  const canonicalUrl = `https://www.hireskys.com${queryString}`;

  // 🚀 FIX 3: THE MILLION DOLLAR SEO TRICK
  // Do not let Google index raw keyword searches (e.g. ?q=asdfg) to save crawl budget
  const shouldIndex = !query; 

  return {
    title: dynamicTitle,
    description: dynamicDesc,
    alternates: {
        canonical: canonicalUrl,
    },
    robots: {
        index: shouldIndex, // True for clean URLs, False for manual search strings
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

// Main Page Component
export default function Page() {
  // 🚀 FIX 2: Move WebSite Schema to Server Component!
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
      {/* Search Engine Native Schema injected from Server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* 🚀 THE FIX: Suspense Boundary lag gayi (with a cool spinner) */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <HomePageClient />
      </Suspense>
    </>
  );
}
