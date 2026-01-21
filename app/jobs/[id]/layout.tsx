import type { Metadata } from "next";
import { createClient } from '@supabase/supabase-js';

// 🛠️ CONFIGURATION
const SUPABASE_URL = "https://pxtifojzsouujkfxpohq.supabase.co";
const SUPABASE_KEY = "sb_publishable_8Pwl1r9B_H8rlTUODhMbdw_9uYLkhMJ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Fix for Next.js 15/16 (Params as Promise)
type Props = {
  params: Promise<{ id: string }>;
};

// ---------------------------------------------------------
// 1️⃣ METADATA GENERATOR (Browser Tab, Google Snippet, Social Cards)
// ---------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!job) {
    return {
      title: "Job Not Found | HireSkys",
      description: "This job post is no longer available.",
      robots: { index: false, follow: false }
    };
  }

  // Smart Strings Construction
  const pageTitle = `${job.title} ${job.company ? `at ${job.company}` : ''} | HireSkys`;
  const summary = `Hiring: ${job.title}. Category: ${job.category}. ${job.location === 'Remote' ? '🌍 Remote Work' : `📍 ${job.location}`}. Salary: ${job.salary_range || 'Competitive'}. Apply securely via HireSkys.`;
  const jobImage = "https://www.hireskys.com/og-job-card.png"; // Future mein dynamic image laga sakte ho

  return {
    // Basic SEO
    title: pageTitle,
    description: summary,
    keywords: [
      job.category, 
      "Remote Job", 
      "Hiring", 
      job.title, 
      "HireSkys", 
      "Freelance", 
      "Full Time", 
      job.tags?.join(", ") || "Tech Job"
    ],
    authors: [{ name: "HireSkys Bot" }, { name: job.company || "Confidential Client" }],
    category: "Employment",
    
    // Canonical URL (Duplicate Content se bachne ke liye)
    alternates: {
      canonical: `https://www.hireskys.com/jobs/${job.id}`,
    },

    // OpenGraph (Facebook, LinkedIn, Discord)
    openGraph: {
      title: pageTitle,
      description: summary,
      url: `https://www.hireskys.com/jobs/${job.id}`,
      siteName: 'HireSkys - Elite Job Radar',
      locale: 'en_US',
      type: 'website', // JobPosting type OG mein nahi hota, website best hai
      images: [
        {
          url: jobImage,
          width: 1200,
          height: 630,
          alt: `${job.title} Job Post`,
        },
      ],
    },

    // Twitter Card (X.com)
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: summary,
      creator: '@HireSkys', // Apna handle lagao agar hai
      images: [jobImage],
    },

    // Robots (Google Permissions)
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ---------------------------------------------------------
// 2️⃣ LAYOUT COMPONENT (Injects Schema & Wraps Page)
// ---------------------------------------------------------
export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // Data dobara fetch kar rahe hain (Next.js cache use karega, don't worry about performance)
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!job) return <>{children}</>;

  // 🌟 GOOGLE JOBS SCHEMA (JSON-LD)
  // Yeh wo code hai jo Google Jobs Widget trigger karega
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description, // HTML description supported here
    datePosted: job.date_posted,
    validThrough: new Date(new Date(job.date_posted).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 Months expiry
    employmentType: "FULL_TIME", // Default, logic se change kar sakte ho
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company || "HireSkys Client",
      logo: "https://www.hireskys.com/logo.png",
      sameAs: "https://www.hireskys.com"
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location === 'Remote' ? 'Remote' : job.location,
        addressCountry: 'Worldwide' // Default for remote
      }
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        // Agar salary number nahi hai to 'value' mat bhejo, sirf 'unitText' bhejo
        // Ya fir 0 bhej do taake error na aaye
        value: parseInt(job.salary_range) || undefined, 
        unitText: 'YEAR'
      }
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Worldwide'
    },
    jobLocationType: job.location?.toLowerCase().includes('remote') ? 'TELECOMMUTE' : undefined
  };

  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Page Content */}
      {children}
    </>
  );

}
