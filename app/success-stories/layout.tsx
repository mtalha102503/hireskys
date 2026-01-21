import type { Metadata } from "next";

// 🌟 ULTIMATE ADVANCED SEO METADATA
export const metadata: Metadata = {
  // 1. Precise Title & Description
  title: "Success Stories: Remote Developers & Freelancers Hired via HireSkys",
  description: "Read real stories of developers, designers, and marketers who skipped the bidding wars and got hired at top US startups & YC companies using HireSkys.",
  
  // 2. Semantic Keywords (LSI)
  keywords: [
    "HireSkys Reviews",
    "Remote Job Success Stories",
    "Freelancer Testimonials",
    "Tech Job Placement Results",
    "Is HireSkys Legit",
    "Remote Work Case Studies",
    "Developer Salary Hikes",
    "Upwork Alternatives Success"
  ],

  // 3. Authorship & Category
  authors: [{ name: "HireSkys Team", url: "https://www.hireskys.com" }],
  category: "Testimonials",
  
  // 4. Canonical URL (Duplicate Content Killer)
  alternates: {
    canonical: "https://www.hireskys.com/success-stories",
  },

  // 5. Open Graph (Facebook/LinkedIn - Optimized Display)
  openGraph: {
    title: "Real People. Real Jobs. Real Salary Hikes.",
    description: "See how Sarah, Omar, and David skipped the queue and landed their dream remote roles in record time.",
    url: "https://www.hireskys.com/success-stories",
    siteName: "HireSkys",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.hireskys.com/og-success.png", // Make sure this image exists!
        width: 1200,
        height: 630,
        alt: "HireSkys User Success Stories Collage",
      },
    ],
  },

  // 6. Twitter Card (X - Large Image)
  twitter: {
    card: "summary_large_image",
    title: "From 'Applied' to 'Hired' - HireSkys Stories",
    description: "Read verified success stories from the HireSkys community.",
    creator: "@HireSkys",
    images: ["https://www.hireskys.com/og-success.png"],
  },

  // 7. Advanced Robot Directives (Snippet Control)
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
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // 🧠 SCHEMA 1: BREADCRUMBS (Hierarchy)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Success Stories",
        "item": "https://www.hireskys.com/success-stories"
      }
    ]
  };

  // 🧠 SCHEMA 2: COLLECTION PAGE (List of Items)
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "HireSkys Success Stories",
    "description": "A collection of success stories from remote workers hired through HireSkys.",
    "url": "https://www.hireskys.com/success-stories",
    "mainEntity": {
      "@type": "ItemList",
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Sarah Jenkins - React Developer" },
        { "@type": "ListItem", "position": 2, "name": "Omar Farooq - Video Editor" },
        { "@type": "ListItem", "position": 3, "name": "David Chen - UX Designer" }
      ]
    }
  };

  // 🧠 SCHEMA 3: AGGREGATE RATING (Review Stars in Google Search) 🌟
  // Ye sabse important hai! Google search results me 5 Stars dikhayega.
  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "HireSkys Job Radar",
    "image": "https://www.hireskys.com/logo1.png",
    "description": "Platform for finding verified remote jobs.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <>
      {/* 💉 Inject All Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
      />
      
      {/* Page Content */}
      {children}
    </>
  );

}
