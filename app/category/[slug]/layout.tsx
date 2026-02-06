import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// 1️⃣ DYNAMIC METADATA GENERATOR
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const categoryName = decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const year = new Date().getFullYear(); 
  const canonicalUrl = `https://www.hireskys.com/category/${slug}`;

  return {
    title: {
      template: `%s | ${categoryName} Remote Jobs`, 
      default: `${year} Best Remote ${categoryName} Jobs (Hiring Now) | HireSkys`,
    },
    description: `Browse verified remote ${categoryName} jobs. Apply to high-paying freelance, part-time, and full-time ${categoryName} roles. Updated daily for ${year}!`,
    
    metadataBase: new URL('https://www.hireskys.com'),
    alternates: {
      canonical: canonicalUrl,
    },
    
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

    openGraph: {
      type: 'website',
      siteName: 'HireSkys',
      title: `Top Remote ${categoryName} Jobs in ${year} - HireSkys`,
      description: `Find your dream remote ${categoryName} career. Verified listings with salary transparency.`,
      url: canonicalUrl,
      images: [
        {
          url: `/og-category.png`, // Pro Tip: Try to make this dynamic later
          width: 1200,
          height: 630,
          alt: `Remote ${categoryName} Jobs on HireSkys`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Remote ${categoryName} Jobs (Apply Now)`,
      description: `New remote ${categoryName} opportunities are live on HireSkys.`,
      images: ['/og-category.png'],
    }
  };
}

// 2️⃣ MAIN LAYOUT COMPONENT
export default async function CategoryLayout({ children, params }: Props) {
  const { slug } = await params;
  
  const categoryName = decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const currentUrl = `https://www.hireskys.com/category/${slug}`;

  // 🍞 ADVANCED SCHEMA (Breadcrumb + Collection + ItemList)
  const schemaData = [
    // Breadcrumbs: Google Search mein path dikhane ke liye
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
          "name": "Categories",
          "item": "https://www.hireskys.com/categories" // Assuming you have a categories page
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": categoryName,
          "item": currentUrl
        }
      ]
    },
    // CollectionPage: Google ko batane ke liye ki ye jobs ki collection hai
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${currentUrl}#webpage`,
      "url": currentUrl,
      "name": `${categoryName} Remote Jobs - HireSkys`,
      "description": `A curated list of remote ${categoryName} jobs for professionals.`,
      "mainEntity": {
        "@type": "ItemList",
        "name": `Latest ${categoryName} Vacancies`,
        "description": `List of all available remote ${categoryName} jobs.`
        // Note: Ideally, you'd map your actual jobs here in "itemListElement"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0B0F19]">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Semantic HTML5 tagging for SEO */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Remote {categoryName} Jobs
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                Explore verified freelance and full-time {categoryName} opportunities.
            </p>
        </header>

        <section aria-label={`${categoryName} Job Listings`}>
            {children}
        </section>
      </main>
    </div>
  );
}
