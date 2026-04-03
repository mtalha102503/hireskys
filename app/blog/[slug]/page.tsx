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
  const { slug } = await params; 
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
  const { slug } = await params; 
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

        {/* 🚀 UPGRADED HERO SECTION WITH BACKGROUND IMAGE */}
        <div className="relative pt-40 pb-24 px-4 overflow-hidden border-b border-slate-200 dark:border-slate-800">
          
          {/* Background Image Cover */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${post.image})` }}
          ></div>

          {/* Dark Overlay (Taake text clear nazar aaye) */}
          <div className="absolute inset-0 z-10 bg-slate-900/85 dark:bg-[#0B0F19]/90 backdrop-blur-[4px]"></div>

          <div className="relative z-20 container mx-auto max-w-4xl text-center">
            {/* Category Badge */}
            <span className="inline-block py-1 px-4 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-bold tracking-wider uppercase mb-6 shadow-lg">
              {post.category}
            </span>
            
            {/* Main Title (Forced to White for contrast) */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-white drop-shadow-md">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full border-2 border-indigo-500/50 shadow-lg overflow-hidden relative bg-slate-800">
                   <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-white">{post.author}</p>
                  <p className="text-sm font-medium text-slate-300">{post.role}</p>
                </div>
              </div>
              <span className="text-slate-500 font-light text-2xl mx-2">|</span>
              <span className="text-sm font-medium text-slate-300 flex items-center mt-1">{post.date}</span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="container mx-auto max-w-3xl px-4 py-16">
          <div 
            className="prose prose-lg dark:prose-invert prose-indigo mx-auto prose-headings:font-bold prose-a:text-indigo-500"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    </>
  );
}
