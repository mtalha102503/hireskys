import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';
import ToolsGrid from './ToolsGridClient';

const SITE_URL = 'https://www.hireskys.com';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Page ko cache karne ke liye (Next.js ISR)
export const revalidate = 3600;

// ---------------------------------------------------------------------
// FIX: dynamic metadata based on ?category= — each category now gets its
// own indexable title/description/canonical instead of one static block.
// ---------------------------------------------------------------------
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;

  const title = category
    ? `Best ${category} Tools for Remote Workers`
    : 'Best Perks & Tools for 100% Remote Workers';

  const description = category
    ? `Explore the best ${category.toLowerCase()} tools curated specifically for fully remote developers, designers, and marketers.`
    : 'Explore our curated directory of the best AI tools, software, and productivity apps. Built strictly for fully remote developers, designers, and marketers—no hybrid compromises.';

  const canonical = category
    ? `${SITE_URL}/tools?category=${encodeURIComponent(category)}`
    : `${SITE_URL}/tools`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'HireSkys',
      type: 'website',
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
  };
}

export default async function ToolsDirectory({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const { data: tools, error } = await supabase
    .from('tools_directory')
    .select('name, slug, category, description, pricing_model, logo_url')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Unique categories always computed from the FULL list (not the filtered
  // one), so the pill bar doesn't collapse down to one option once a
  // category is selected.
  const uniqueCategories = tools
    ? Array.from(new Set(tools.map((t) => t.category))).sort()
    : [];

  const filteredTools =
    !category || category === 'All'
      ? tools || []
      : (tools || []).filter((t) => t.category === category);

  // FIX: JSON-LD — CollectionPage + ItemList + Breadcrumb so the directory
  // itself is eligible for rich results / sitelinks context.
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category ? `Best ${category} Tools for Remote Workers` : 'Perks & Tools for Remote Workers',
    url: category ? `${SITE_URL}/tools?category=${encodeURIComponent(category)}` : `${SITE_URL}/tools`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredTools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/tools/${tool.slug}`,
        name: tool.name,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      ...(category
        ? [{ '@type': 'ListItem', position: 3, name: category, item: `${SITE_URL}/tools?category=${encodeURIComponent(category)}` }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4F46E5] dark:text-[#6366f1] mb-4">
            {category ? `Best ${category} Tools for Remote Workers` : 'Perks & Tools for Remote Workers'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            The best software, AI tools, and productivity apps curated
            specifically for remote developers, designers, and marketers.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-lg font-semibold text-red-500">
              Something went wrong while loading tools.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please refresh the page or try again shortly.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && (!tools || tools.length === 0) && (
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No tools available right now.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back soon — we're adding new tools regularly.
            </p>
          </div>
        )}

        {/* Tools Grid (now a plain server component — see ToolsGridClient.tsx) */}
        {!error && tools && tools.length > 0 && (
          <ToolsGrid
            tools={filteredTools}
            categories={uniqueCategories}
            activeCategory={category || 'All'}
          />
        )}
      </div>
    </>
  );
}