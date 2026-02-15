import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blogData"; 
import Navbar from "@/components/Navbar";

// 👇 FIX 1: Next.js ko batana parta hai ke kon se pages exist karte hain
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

// 👇 FIX 2: Type define kiya (Next.js 15 mein params Promise hota hai)
type Props = {
  params: Promise<{ slug: string }>;
};

// ---------------------------------------------------------
// 1. AUTOMATIC SEO GENERATOR (Metadata)
// ---------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // 👈 YAHAN "await" LAGAYA HAI
  const post = BLOG_POSTS.find((p: any) => p.slug === slug);
  
  if (!post) return { title: "Article Not Found" };

  const siteUrl = "https://www.hireskys.com";
  const ogImage = post.image.startsWith("/") ? `${siteUrl}${post.image}` : post.image;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      authors: [post.author],
    },
  };
}

// ---------------------------------------------------------
// 2. PAGE COMPONENT (Design)
// ---------------------------------------------------------
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // 👈 YAHAN BHI "await" ZAROORI HAI
  const post = BLOG_POSTS.find((p: any) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // JSON-LD for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [`https://www.hireskys.com${post.image}`],
    "author": { "@type": "Person", "name": post.author },
    "datePublished": post.date
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
        <Navbar />

        {/* Hero Section */}
        <div className="relative pt-32 pb-12 px-4 bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto max-w-4xl text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-6">
              {post.category}
            </span>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-slate-900 dark:text-white">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                   {/* Agar Next/Image error de to isay simple <img> tag bana dena */}
                   <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author}</p>
                  <p className="text-xs text-slate-500">{post.role}</p>
                </div>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-500">{post.date}</span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="container mx-auto max-w-3xl px-4 py-16">
          <div 
            className="prose prose-lg dark:prose-invert prose-indigo mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    </>
  );
}