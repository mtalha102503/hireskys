import type { Metadata } from "next";

// 🌟 ULTIMATE METADATA CONFIGURATION
export const metadata: Metadata = {
  // 1. Basic Identity
  title: "Remote Salary Guide 2025: Tech, Design & Marketing Benchmarks",
  description: "Stop guessing. See the 2025 Global Remote Salary Benchmark. Real salary ranges for React, Python, UI/UX, and Marketing roles in US vs Global markets.",
  applicationName: "HireSkys",
  
  // 2. Authors & Ownership (Google Authority)
  authors: [{ name: "HireSkys Data Team", url: "https://hireskys.com" }],
  creator: "HireSkys",
  publisher: "HireSkys",
  category: "career", // Batata hai ke ye page kis category ka hai

  // 3. Keywords (LSI Rich - Semantic Search ke liye)
  keywords: [
    "Remote Salary Guide 2025",
    "React Developer Salary",
    "Python Engineer Pay",
    "UI/UX Remote Rates",
    "US vs Global Remote Salary",
    "HireSkys Benchmark",
    "Tech Salary Trends",
    "Remote Work Compensation",
    "Software Engineer Salary",
    "Freelance Hourly Rates 2025",
    "Marketing Salary Remote"
  ],

  // 4. Canonical (Duplicate Content Protection)
  alternates: {
    canonical: "https://hireskys.com/salary-guide",
  },

  // 5. Robots (Crawler Instructions - "Indexing On")
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 6. Open Graph (Facebook/LinkedIn/WhatsApp Preview)
  openGraph: {
    title: "Remote Salary Guide 2025 | HireSkys",
    description: "Discover exactly what top remote companies are paying. Don't leave money on the table. Compare US vs Global rates.",
    url: "https://hireskys.com/salary-guide",
    siteName: "HireSkys",
    locale: "en_US",
    type: "website",
    images: [{
      url: "https://hireskys.com/og-salary.png", // ⚠️ Ye image zaroor banana public folder me
      width: 1200,
      height: 630,
      alt: "2025 Salary Benchmark Chart - HireSkys",
    }],
  },

  // 7. Twitter Card (X Optimization)
  twitter: {
    card: "summary_large_image",
    title: "Remote Salary Benchmark 2025",
    description: "See the latest salary trends for Developers, Designers, and Marketers.",
    creator: "@HireSkys", // Apna handle lagana
    site: "@HireSkys",
    images: ["https://hireskys.com/og-salary.png"],
  },
};

export default function SalaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // 🧠 SCHEMA: BREADCRUMBS (Search Hierarchy ke liye)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hireskys.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Salary Guide",
        "item": "https://hireskys.com/salary-guide"
      }
    ]
  };

  return (
    <>
      {/* 💉 Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}