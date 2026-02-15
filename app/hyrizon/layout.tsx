import type { Metadata } from "next";

// 👇 1. MAXED-OUT METADATA
export const metadata: Metadata = {
  // Base URL set karna safe hai, conflict nahi karega
  metadataBase: new URL('https://www.hireskys.com'),

  title: {
    absolute: "Hyrizon AI - Verify Companies & Analyze Remote Jobs",
  },
  description: "Use Hyrizon AI to verify company legitimacy, detect job scams, analyze salaries, and find hidden remote opportunities. Powered by real-time market intelligence.",
  applicationName: "Hyrizon AI", // 👈 Google ko batata hai ye APP hai
  category: "productivity", // 👈 App category
  authors: [{ name: "HireSkys Team", url: "https://www.hireskys.com" }],
  
  keywords: [
    "AI company verification", 
    "Job scam checker", 
    "Remote job analyzer", 
    "Hyrizon AI", 
    "HireSkys AI", 
    "Legit company check", 
    "Salary trends 2026",
    "Is this company safe",
    "Scam detector tool"
  ],
  
  alternates: {
    canonical: "https://www.hireskys.com/hyrizon",
  },

  // 👇 SOCIAL MEDIA (OpenGraph)
  openGraph: {
    title: "Hyrizon AI - Is this company safe?",
    description: "Scan any company for scams, fake reviews, and red flags instantly with Hyrizon AI.",
    url: "https://www.hireskys.com/hyrizon",
    siteName: "HireSkys",
    images: [
      {
        url: "https://www.hireskys.com/iconai.png", 
        width: 1200,
        height: 630,
        alt: "Hyrizon AI Analysis Tool",
      },
    ],
    locale: "en_US",
    type: "website", // 'website' safe hai, conflict nahi hoga
  },

  // 👇 TWITTER CARDS
  twitter: {
    card: "summary_large_image",
    title: "Hyrizon AI - Real-time Job Intelligence",
    description: "Don't get scammed. Verify companies and analyze jobs with AI before you apply.",
    images: ["https://www.hireskys.com/iconai.png"],
    creator: "@hireskys",
  },

  // 👇 ROBOTS (Super Strict for Quality)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function HyrizonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // 👇 2. ADVANCED SCHEMA (Breadcrumbs + SearchAction + SoftwareApp)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 🟢 1. WEB APPLICATION SCHEMA
      {
        "@type": "WebApplication",
        "name": "Hyrizon AI",
        "url": "https://www.hireskys.com/hyrizon",
        "description": "An AI-powered tool to verify company legitimacy and analyze remote job listings for safety.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Company Verification", 
          "Scam Detection", 
          "Salary Analysis", 
          "Remote Job Search"
        ],
        "provider": {
          "@type": "Organization",
          "name": "HireSkys",
          "url": "https://www.hireskys.com"
        },
        // 🔥 POWER MOVE: Batao ke ye tool SEARCH karta hai
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.hireskys.com/hyrizon?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      // 🟢 2. BREADCRUMBS SCHEMA (Google Navigation ke liye)
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.hireskys.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Hyrizon AI",
            "item": "https://www.hireskys.com/hyrizon"
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* Schema Inject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Page Content */}
      {children}
    </>
  );
}