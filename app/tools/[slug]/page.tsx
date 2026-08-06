import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const YoutubeVideo = dynamic(() => import('@/components/YoutubeVideo'), {
  loading: () => (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
      <span className="text-gray-500 text-sm font-medium">Loading player...</span>
    </div>
  ),
});

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://www.hireskys.com';

// ---------------------------------------------------------------------
// 1. DYNAMIC METADATA (SEO)
// ---------------------------------------------------------------------
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const { data: tool } = await supabase
    .from('tools_directory')
    .select('*')
    .eq('slug', slug)
    .single();

  // FIX: tool not found -> tell crawlers not to index this metadata state.
  // The actual page will 404 via notFound() below, but metadata can still
  // get requested independently, so we guard it too.
  if (!tool) {
    return {
      title: 'Tool Not Found',
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = `${SITE_URL}/tools/${slug}`;
  const ogImage = tool.logo_url || `${SITE_URL}/og-default.png`;

  return {
    title: `${tool.name} - Best ${tool.category} Tool for Remote Work`,
    description: tool.description,
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title: `${tool.name} for Remote Teams`,
      description: tool.description,
      url: pageUrl,
      type: 'article',
      siteName: 'HireSkys',
      images: [
        {
          url: ogImage,
          width: 512,
          height: 512,
          alt: `${tool.name} logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - Best ${tool.category} Tool for Remote Work`,
      description: tool.description,
      images: [ogImage],
    },
  };
}

// ---------------------------------------------------------------------
// 2. STATIC SITE GENERATION (Zero Database Load in Production)
// ---------------------------------------------------------------------
export async function generateStaticParams() {
  const { data: tools } = await supabase
    .from('tools_directory')
    .select('slug')
    .eq('is_active', true);

  return tools?.map((tool) => ({ slug: tool.slug })) || [];
}

// Page Revalidation (ISR) - Har 1 ghante baad data refresh
export const revalidate = 3600;

// ---------------------------------------------------------------------
// 3. MAIN PAGE COMPONENT
// ---------------------------------------------------------------------
export default async function ToolDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: tool, error } = await supabase
    .from('tools_directory')
    .select('*')
    .eq('slug', slug)
    .single();

  // FIX: real 404 status code instead of a 200 "not found" page (soft-404).
  // Requires app/tools/[slug]/not-found.tsx (or a shared one) to render nicely.
  if (error || !tool) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/tools/${slug}`;

  // FIX: JSON-LD structured data — SoftwareApplication + Breadcrumb (+ Video if present)
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    url: pageUrl,
    image: tool.logo_url || undefined,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: tool.pricing_model,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Tools',
        item: `${SITE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.name,
        item: pageUrl,
      },
    ],
  };

  const videoSchema = tool.youtube_video_id
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: `See how ${tool.name} works for remote teams`,
        description: tool.description,
        thumbnailUrl: `https://i.ytimg.com/vi/${tool.youtube_video_id}/hqdefault.jpg`,
        uploadDate: tool.created_at || new Date().toISOString(),
        embedUrl: `https://www.youtube.com/embed/${tool.youtube_video_id}`,
      }
    : null;

  return (
    <>
      {/* JSON-LD injection — safe, no user input beyond DB fields we control */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}

      <Navbar />
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb / Back Button */}
          <Link
            href="/tools"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#4F46E5] dark:hover:text-[#6366f1] mb-8 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Directory
          </Link>

          {/* Main Card Container */}
          <div className="bg-white dark:bg-[#151b2b] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {/* Header Section */}
            <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex-1 flex items-start gap-6">
                {/* LOGO RENDERER — FIX: next/image for CLS/LCP */}
                {tool.logo_url && (
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 relative bg-white border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-2">
                    <Image
                      src={tool.logo_url}
                      alt={`${tool.name} logo`}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>
                )}

                {/* TITLE & BADGES */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 text-xs font-semibold text-[#4F46E5] bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
                      {tool.category}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-full">
                      {tool.pricing_model}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
                    {tool.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start md:self-center">
                {/* FIX: sponsored + nofollow on affiliate link (Google guideline for paid/affiliate links) */}
                <a
                  href={tool.affiliate_link}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4F46E5] rounded-full transition-all duration-300 shadow-md hover:shadow-indigo-500/40 hover:-translate-y-1 w-full md:w-auto"
                >
                  Get {tool.name} Now
                  <svg
                    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* 4. LIGHTWEIGHT YOUTUBE VIDEO (NO-INDEX & CACHED) */}
            {tool.youtube_video_id && (
              <div
                className="bg-gray-50/50 dark:bg-[#0f1420]/50 p-6 md:p-12 border-b border-gray-100 dark:border-gray-800"
                data-nosnippet
              >
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-center mb-6">
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full flex items-center tracking-wide uppercase">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      Demo Video
                    </span>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-black aspect-video relative">
                    <YoutubeVideo
                      id={tool.youtube_video_id}
                      title={`See how ${tool.name} works for remote teams`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. DYNAMIC HTML CONTENT RENDERER */}
            {/* NOTE: tool.content is rendered via dangerouslySetInnerHTML.
                Make sure this field is only ever written by trusted admins
                (or sanitized server-side with something like `sanitize-html`)
                before it hits Supabase — otherwise this is an XSS vector. */}
            {tool.content && (
              <div className="p-8 md:p-12">
                <div
                  className="text-gray-800 dark:text-gray-200 leading-relaxed max-w-none"
                  dangerouslySetInnerHTML={{ __html: tool.content }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}