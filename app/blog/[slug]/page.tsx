import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blogData"; 
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
const hasTOC = post.toc && post.toc.length > 0;
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
            <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
              <Link 
                href="/blog" 
                className="group inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-all bg-slate-900/50 hover:bg-indigo-600/80 px-5 py-2 rounded-full border border-slate-700/50 backdrop-blur-md shadow-lg"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
              </Link>
            </div>
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

        {/* Article Body & Sticky Sidebar */}
        <div className={`container mx-auto px-4 py-16 relative ${hasTOC ? 'max-w-6xl' : 'max-w-3xl'}`}>
          <div className={hasTOC ? "grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" : "block"}>
            
            {/* Main Article Content */}
            <article className={hasTOC ? "lg:col-span-8" : "w-full"}>
              <div 
                className={`prose prose-lg dark:prose-invert prose-indigo w-full prose-headings:font-bold prose-a:text-indigo-500 prose-headings:scroll-mt-32 ${hasTOC ? 'max-w-none' : 'mx-auto'}`}
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </article>

            {/* Right Column: Sticky Table of Contents (Sirf tab dikhega agar TOC ho) */}
            {hasTOC && (
              <aside className="hidden lg:block lg:col-span-4 sticky top-32">
                <div className="p-8 bg-white dark:bg-[#111625] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-indigo-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    Quick Navigation
                  </h3>
                  
                  <ul className="space-y-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2 pl-4">
                    {post.toc?.map((item: any) => (
                      <li key={item.id} className="relative">
                        <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-indigo-500 opacity-0 transition-opacity hover:opacity-100"></div>
                        <Link 
                          href={`#${item.id}`} 
                          className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all text-sm block leading-relaxed hover:translate-x-1"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">Need help posting a job?</p>
                    <Link href="/employer/jobs/create" className="flex justify-center items-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl font-bold transition-colors text-sm w-full">
                      Go to Employer Dashboard
                    </Link>
                  </div>
                </div>
              </aside>
            )}

          </div>
        </div>
      </div>
    </>
  );
}