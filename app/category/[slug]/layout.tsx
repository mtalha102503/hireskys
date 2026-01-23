import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// 1️⃣ DYNAMIC METADATA TEMPLATE
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const categoryName = decodeURIComponent(resolvedParams.slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  // ✅ NEW: Canonical URL banao
  const canonicalUrl = `https://www.hireskys.com/category/${resolvedParams.slug}`;

  return {
    title: {
      template: `%s | ${categoryName} Jobs`, 
      default: `${categoryName} Jobs & Careers`,
    },
    description: `Browse the best remote ${categoryName} jobs. Verified opportunities for freelancers and full-time professionals.`,
    
    metadataBase: new URL('https://www.hireskys.com'),

    // ✅ NEW: Explicit Canonical Tag add kiya
    alternates: {
      canonical: canonicalUrl,
    },
    
    openGraph: {
      type: 'website',
      siteName: 'HireSkys',
      title: `${categoryName} Remote Jobs`,
      description: `Find high-paying remote ${categoryName} jobs.`,
      url: canonicalUrl, // ✅ OG URL bhi set kar di
      images: [
        {
          url: '/og-category.png',
          width: 1200,
          height: 630,
          alt: `${categoryName} Jobs`,
        },
      ],
    },
  };
}

// 2️⃣ MAIN LAYOUT COMPONENT
export default async function CategoryLayout({ children, params }: Props) {
  const resolvedParams = await params;
  
  const categoryName = decodeURIComponent(resolvedParams.slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const currentUrl = `https://www.hireskys.com/category/${resolvedParams.slug}`;

  // 🍞 COMBINED SCHEMA (Breadcrumb + CollectionPage)
  const schemaData = [
    // 1. Breadcrumb (Rasta batane ke liye)
    {
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
          "name": categoryName,
          "item": currentUrl
        }
      ]
    },
    // 2. ✅ CollectionPage (Google ko batane ke liye ke ye List hai)
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${categoryName} Remote Jobs`,
      "description": `A collection of verified remote ${categoryName} jobs.`,
      "url": currentUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "HireSkys",
        "url": "https://www.hireskys.com"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0B0F19]">
      
      {/* SEO Schema Inject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>
      
    </div>
  );
}