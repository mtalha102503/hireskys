import { Metadata } from "next";
import { CATEGORIES, findCategoryKeyBySlug } from "@/lib/categories";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // ✅ Ab naive casing conversion nahi, asal CATEGORIES se sahi display name milega
  const categoryName = findCategoryKeyBySlug(slug) || decodeURIComponent(slug).replace(/-/g, ' ');
  const year = new Date().getFullYear();

  return {
    // 🔴 title (template + default) hata diya — pages apna khud complete title bhejte hain,
    // warna Next.js template wrap karke "HireSkys | HireSkys" jaisi duplication banata tha
    description: `Browse verified remote ${categoryName} jobs. Apply to high-paying freelance, part-time, and full-time ${categoryName} roles. Updated daily for ${year}!`,
    metadataBase: new URL('https://www.hireskys.com'),

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
      images: [
        {
          url: `/og-category.png`,
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
    // 🔴 canonical bhi yahan se hata diya — ye layout subcategory pages ko bhi wrap karta hai,
    // lekin isko subcategory param pata nahi chal sakta, isliye galat canonical bhej raha tha.
    // Ab har page apna sahi canonical khud set karega (neeche dekho).
  };
}

export default async function CategoryLayout({ children, params }: Props) {
  const { slug } = await params;
  const categoryName = findCategoryKeyBySlug(slug) || decodeURIComponent(slug).replace(/-/g, ' ');
  const currentUrl = `https://www.hireskys.com/category/${slug}`;

  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hireskys.com" },
        { "@type": "ListItem", "position": 2, "name": "Categories", "item": "https://www.hireskys.com/categories" },
        { "@type": "ListItem", "position": 3, "name": categoryName, "item": currentUrl }
      ]
    },
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
      }
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      {children}
    </>
  );
}