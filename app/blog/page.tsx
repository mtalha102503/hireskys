import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, User, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Blog - HireSkys Insider',
  description: 'Expert advice on remote work, freelancing trends, and AI tools.',
};

// 👇 JAB BHI NAYA ARTICLE LIKHO, BAS IS LIST MEIN ADD KAR DENA
const BLOG_POSTS = [
  {
    slug: 'introducing-hyrizon-ai',
    title: 'Why We Built Hyrizon AI: The End of Fake Jobs',
    excerpt: 'Finding a remote job shouldn\'t feel like Russian Roulette. See how we use AI to detect fake clients and match you with elite opportunities.',
    date: 'Feb 15, 2026',
    author: 'Muhammad Talha',
    category: 'Launch',
    image: '/blog-og-image.png' 
  },
  {
    slug: 'telegram-whatsapp-remote-job-alerts', 
    title: 'The Ultimate Edge: Instant Telegram & VIP WhatsApp Alerts 🚀',
    excerpt: 'Beat the competition with lightning-fast Telegram alerts, or upgrade to our VIP WhatsApp service for custom cover letters and interview strategies.',
    date: 'Mar 24, 2026',
    author: 'Muhammad Talha',
    category: 'Product Update',
    image: '/blog-telegram-update.jpg' 
  },
  {
    slug: 'why-remote-job-boards-are-broken',
    title: 'Quality > Quantity: Why 99% of Remote Job Boards are Failing You',
    excerpt: 'Most platforms boast about having 10,000+ jobs. We boast about having zero "Ghost Jobs". Here is how we fixed the broken remote hiring industry.',
    date: 'Mar 30, 2026',
    author: 'Muhammad Talha',
    category: 'Behind The Scenes',
    image: '/blog-quality-update.png' 
  },
  {
    slug: '7-untapped-remote-niches-seo-marketers-2026',
    title: '7 Untapped Remote Niches for Programmatic SEOs and Marketers in 2026',
    excerpt: 'The general SEO market is saturated, but these highly specific, remote marketing niches are desperately looking for talent. Here is where the big budgets are hiding.',
    date: 'Apr 16, 2026',
    author: 'Muhammad Talha',
    category: 'Career Advice',
    image: '/blog-untapped-seo.png'
  },
  {
    slug: 'top-premium-global-remote-jobs-weekly-roundup',
    title: 'Top Global Remote Jobs of the Week: AI, Web3, and Tech',
    excerpt: 'Companies are hiring everywhere right now. Here is a look at some of the best 100% remote jobs we found on HireSkys this week.',
    date: 'May 5, 2026',
    author: 'Muhammad Talha',
    category: 'Weekly Roundups',
    image: '/blog-weekly-roundup.jpg'
  },
  {
    slug: 'ultimate-guide-remote-job-safety-2026',
    title: 'The Dark Side of Remote Work: 3 Safety Rules Every Freelancer Must Know',
    excerpt: 'Scammers are getting smarter. Here is exactly how to spot fake jobs, protect your bank account, and verify clients before writing a single line of code.',
    date: 'May 31, 2026',
    author: 'Muhammad Talha',
    category: 'Career Advice',
    image: '/blog-safety-guide.jpg'
  }
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Header Section */}
      <div className="pt-32 pb-12 px-4 bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
            HireSkys <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Insider</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Updates, career hacks, and behind-the-scenes stories from the team building the future of remote work.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {BLOG_POSTS.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-violet-500/10 transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative bg-slate-200">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                </div>
                
                <h2 className="text-xl font-bold mb-3 group-hover:text-violet-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center text-violet-600 font-bold text-sm mt-auto">
                    Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>

      {/* Newsletter / CTA */}
      <div className="container mx-auto px-4 pb-20">
        <div className="bg-slate-900 dark:bg-indigo-900/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
             <div className="relative z-10">
                <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay ahead of the curve</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Join thousands of freelancers getting weekly tips on landing high-paying clients and using AI to work smarter.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/login" className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-all">
                        Join HireSkys Free
                    </Link>
                </div>
             </div>
        </div>
      </div>

    </div>
  );
}
