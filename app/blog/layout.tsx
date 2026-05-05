import type { Metadata } from "next";

// 👇 1. CONFIGURATION
const SITE_URL = "https://www.hireskys.com"; 
const BLOG_NAME = "HireSkys Insider";
const BLOG_DESCRIPTION = "Expert insights on remote work, freelancing, and AI-powered career growth. The official blog of HireSkys.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BLOG_NAME,
    template: `%s | ${BLOG_NAME}`,
  },
  description: BLOG_DESCRIPTION,
  keywords: ["Remote Jobs", "Freelancing Tips", "Hyrizon AI", "Career Advice", "Tech Jobs", "Work from Home"],
  
  // ✅ PRO TWEAK 1: Canonical URLs (Prevents Duplicate Content)
  alternates: {
    canonical: '/blog',
  },

  // ✅ PRO TWEAK 2: Author Authority
  authors: [{ name: "Muhammad Talha", url: SITE_URL }],

  openGraph: {
    title: {
      default: BLOG_NAME,
      template: `%s | ${BLOG_NAME}`,
    },
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    siteName: "HireSkys",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo2.png", 
        width: 1200,
        height: 630,
        alt: "HireSkys Blog - Remote Work Intelligence",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: {
      default: BLOG_NAME,
      template: `%s | ${BLOG_NAME}`,
    },
    description: BLOG_DESCRIPTION,
    images: ["/logo2.png"],
    creator: "@hireskys", 
  },

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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // 👇 2. JSON-LD (Advanced schema with Social Links)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": BLOG_NAME,
    "description": BLOG_DESCRIPTION,
    "url": `${SITE_URL}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "HireSkys",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo1.png` 
      },
      // ✅ PRO TWEAK 3: SameAs (Builds Entity Trust in Google)
      "sameAs": [
        "https://twitter.com/hireskys",
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19]">
        {children}
      </main>
    </>
  );
}
