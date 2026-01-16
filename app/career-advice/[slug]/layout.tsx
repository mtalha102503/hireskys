import type { Metadata } from "next";
import { articles } from "../articles"; // Tumhara data file

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// 🌟 1. ADVANCED METADATA GENERATOR
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = articles[slug];

  // 404 Case: Agar article nahi mila
  if (!article) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false } // Google ko bolo isay ignore kare
    };
  }

  // URLs construction
  const siteUrl = "https://hireskys.com";
  const pageUrl = `${siteUrl}/career-advice/${slug}`;
  const ogImage = "https://hireskys.com/og-career.png"; // Default image

  return {
    // 🔥 Basic SEO
    title: article.title, // Root layout ka template "%s | HireSkys" isay khud sambhal lega
    description: article.description,
    
    // 🔥 Keywords & Authors
    keywords: [article.category, "Career Advice", "Remote Work", "Interview Tips", "HireSkys Guide"],
    authors: [{ name: "HireSkys Editorial Team", url: siteUrl }],
    category: article.category,

    // 🔥 Canonical URL (Most Important for Google)
    alternates: {
      canonical: pageUrl,
    },

    // 🔥 OpenGraph (Facebook/LinkedIn/WhatsApp)
    openGraph: {
      title: article.title,
      description: article.description,
      url: pageUrl,
      siteName: "HireSkys",
      locale: "en_US",
      type: "article", // 👈 Type 'article' zaroori hai blog ke liye
      publishedTime: new Date(article.date).toISOString(),
      modifiedTime: new Date(article.date).toISOString(), // Agar update date ho to wo lagana
      authors: ["HireSkys Team"],
      section: article.category,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },

    // 🔥 Twitter Card (X)
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogImage],
      creator: "@HireSkys", // Apna handle lagao
    },

    // 🔥 Robots (Fine-tuning)
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
}

// 🌟 2. SCHEMA INJECTOR & LAYOUT WRAPPER
export default async function ArticleLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const article = articles[resolvedParams.slug];

  if (!article) return <>{children}</>;

  const siteUrl = "https://hireskys.com";
  const pageUrl = `${siteUrl}/career-advice/${resolvedParams.slug}`;

  // 🧠 Schema 1: BlogPosting (Google Rich Results ke liye)
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": article.title,
    "description": article.description,
    "image": "https://hireskys.com/og-career.png",
    "author": {
      "@type": "Organization",
      "name": "HireSkys Editorial Team",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "HireSkys",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo1.png`
      }
    },
    "datePublished": new Date(article.date).toISOString(),
    "dateModified": new Date(article.date).toISOString(),
    "articleSection": article.category
  };

  // 🧠 Schema 2: BreadcrumbList (Hierarchy dikhane ke liye)
  // Google Search me dikhega: Home > Career Advice > Article Title
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Career Advice",
        "item": `${siteUrl}/career-advice`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": pageUrl
      }
    ]
  };

  return (
    <>
      {/* Schemas Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Page Content */}
      {children}
    </>
  );
}