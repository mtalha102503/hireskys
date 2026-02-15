import type { Metadata } from "next";

// 👇 1. CONFIGURATION (Apna URL yahan update kar lena jab deploy karo)
const SITE_URL = "https://www.hireskys.com"; 
const BLOG_NAME = "HireSkys Insider";
const BLOG_DESCRIPTION = "Expert insights on remote work, freelancing, and AI-powered career growth. The official blog of HireSkys.";

export const metadata: Metadata = {
  // ✅ Base Metadata
  metadataBase: new URL(SITE_URL),
  title: {
    default: BLOG_NAME,
    template: `%s | ${BLOG_NAME}`, // Har page ka title auto-format hoga
  },
  description: BLOG_DESCRIPTION,
  keywords: ["Remote Jobs", "Freelancing Tips", "Hyrizon AI", "Career Advice", "Tech Jobs", "Work from Home"],
  
  // ✅ Social Media (Open Graph) - Facebook, LinkedIn, WhatsApp
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
        url: "/logo2.png", // 👈 Is naam ki image public folder me daal dena
        width: 1200,
        height: 630,
        alt: "HireSkys Blog - Remote Work Intelligence",
      },
    ],
  },

  // ✅ Twitter Card
  twitter: {
    card: "summary_large_image",
    title: {
      default: BLOG_NAME,
      template: `%s | ${BLOG_NAME}`,
    },
    description: BLOG_DESCRIPTION,
    images: ["/logo2.png"], // Same image use hogi
    creator: "@hireskys", // Apna Twitter handle likh dena
  },

  // ✅ Robots (Google Bot ko allow karo)
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
  // 👇 2. JSON-LD (Google ki zubaan)
  // Ye code Google ko batata hai ke ye "Blog" hai aur iska malik "HireSkys" hai.
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
        "url": `${SITE_URL}/logo1.png` // Apne logo ka path confirm kar lena
      }
    }
  };

  return (
    <>
      {/* Structured Data Injector */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Page Content */}
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19]">
        {children}
      </main>
    </>
  );
}