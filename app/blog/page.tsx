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
    date: 'May 30, 2026',
    author: 'Muhammad Talha',
    category: 'Career Advice',
    image: '/blog-safety-guide.jpg'
  },
    {
    slug: 'how-hireskys-ats-works',
    title: 'The Ultimate Guide to HireSkys ATS: Quality, Safety & Rules',
    excerpt: 'Learn how our Applicant Tracking System works, why we manually approve jobs, and how our strict anti-spam rules protect both employers and candidates.',
    date: 'June 10, 2026',
    author: 'Muhammad Talha',
    category: 'Guides & Tutorials',
    image: '/hireskys-ats-guide.webp'
  },
  {
    slug: 'zero-budget-hiring-guide',
    title: 'Zero Budget Hiring: Manage & Promote Your Remote Jobs for Free',
    excerpt: 'Discover how you can use the HireSkys ATS to manage candidates for free, and our ultimate hack to promote your open roles without spending a single penny.',
    date: 'June 10, 2026',
    author: 'Muhammad Talha',
    category: 'Growth Hacks & Hiring',
    image: '/blog-zero-budget.jpg'
  },
  {
  slug: 'top-6-true-borderless-remote-jobs-june-2026',
  title: 'Top 6 True Borderless Remote Jobs of third week of June',
  excerpt: 'Finding a remote job is easy but finding a true borderless remote job without any country restriction is really a very hard game.',
  date: 'Jun 21, 2026',
  author: 'Muhammad Talha',
  category: 'Growth Hacks & Hiring',
  image: '/blog-borderless-jobs.webp',
  },
  {
  slug: 'verified-safe-borderless-remote-jobs-july-2026',
  title: 'Tired of Fake Listings? Here Are Safe, True Borderless Jobs for July',
  excerpt: 'Job hunting is exhausting when you keep hitting fake listings and hidden location limits. Here is our manually verified list of safe, global remote jobs for this week.',
  date: 'Jul 5, 2026',
  author: 'Muhammad Talha',
  category: 'Weekly Roundups',
  image: '/june-four-week-jobs.webp',
  },
  {
  slug: 'transparent-job-posting-refund-policy',
  title: 'Total Transparency: How Job Posting, Premium Boosts, and Refunds Work on HireSkys',
  excerpt: 'We believe in 100% transparency. Here is exactly what happens when you submit a job, how our premium add-ons work, and our iron-clad refund policy.',
  date: 'Aug 14, 2026',
  author: 'Muhammad Talha',
  category: 'Trust & Safety',
  image: '/blog-transparency.webp',
  },
  {
  slug: 'how-to-use-hireskys-mcp-claude-chatgpt',
  title: 'The Ultimate Guide: How to Search HireSkys Directly Inside Claude using MCP',
  excerpt: 'Stop switching tabs. Learn how to connect our Model Context Protocol (MCP) server to your AI assistant to find remote jobs in real-time.',
  date: 'Aug 23, 2026',
  author: 'Muhammad Talha',
  category: 'Product Updates',
  image: '/blog-mcp-guide.webp',
  },
  {
  slug: 'remote-work-experience-gap-2026',
  title: 'The Remote Work Experience Gap: Are Companies Still Hiring Freshers in 2026?',
  excerpt: 'We analyzed 14,635 active remote jobs straight from the HireSkys database. The data reveals a shocking truth about the "Experience Gap" and the exact skills you need to bypass it.',
  date: 'Sep 20, 2026',
  author: 'Muhammad Talha',
  category: 'Original Research',
  image: '/blog-experience-gap.webp',
  },
  {
  slug: 'introducing-visatalentusa-h1b-sponsor-database',
  title: 'Introducing VisaTalentUSA: The H-1B Sponsor Database We Always Wished Existed',
  excerpt: 'We just launched VisaTalentUSA — a free database of the top 1,000 H-1B sponsors with real salary data, lottery odds calculator, and expert guides. Here is why we built it and how it helps you.',
  date: 'Oct 11, 2026',
  author: 'Muhammad Talha',
  category: 'Launch Announcement',
  image: '/blog/visatalentusa-launch.svg',
  },
  {
  slug: 'remote-jobs-no-experience-beginners-guide-2026',
  title: 'Remote Jobs With No Experience: The Complete Beginner\'s Guide (2026)',
  excerpt: 'Yes, you CAN get a remote job with zero experience. Here are the 12 best beginner-friendly remote roles, real entry-level listings hiring right now, and a step-by-step plan to land your first one.',
  date: 'Oct 16, 2026',
  author: 'Muhammad Talha',
  category: 'Career Advice',
  image: '/blog-remote-jobs-no-experience.jpg',
  },
  {
  slug: 'sap-abap-jobs-in-saudi-arabia',
  title: 'SAP ABAP Jobs in Saudi Arabia: Live Openings, Salary & How to Apply (2026)',
  excerpt: 'Real SAP ABAP jobs open to Saudi Arabia right now — including remote roles hiring today — plus verified SAR salary ranges, the exact skills and certification employers ask for, and how hiring works under Nitaqat.',
  date: 'Oct 22, 2026',
  author: 'Muhammad Talha',
  category: 'Career Advice',
  image: '/blog-sap-abap-saudi-arabia.svg',
  },
  {
    slug: 'forward-deployed-engineer-jobs',
    title: 'Forward Deployed Engineer (FDE) Jobs: What the Role Is, Salary & Live Openings (2026)',
    excerpt: 'Forward deployed engineer is the breakout job title of the AI era. What FDEs actually do, what they earn (from 47 live US listings), the skills employers screen for, and the FDE jobs hiring right now.',
    date: 'Oct 22, 2026',
    author: 'Muhammad Talha',
    category: 'Career Advice',
    image: '/blog-forward-deployed-engineer.svg',
  },
  {
    slug: 'india-tech-hiring-2026-data-engineering-remote-reality',
    title: 'India Tech Hiring 2026: 12 Senior Roles for Every 1 Entry Job, Data Engineering Doubles — What It Means for Remote Seekers',
    excerpt: 'A new report on 18,752 India tech postings shows a senior-heavy market, a data-engineering surge, and remote work at just 0.8%. Here is what remote job seekers should actually do about it, with live remote data-engineer roles on HireSkys.',
    date: 'Oct 28, 2026',
    author: 'Muhammad Talha',
    category: 'Career Advice',
    image: '/blog-india-tech-hiring-2026.svg',
  },
  {
    slug: 'remote-sales-marketing-jobs',
    title: 'Remote Sales & Marketing Jobs: Live Openings, Top Roles & Skills (2026)',
    excerpt: 'Remote sales jobs lead HireSkys\' biggest category — 3,313 live Marketing & Sales openings. Here is what the live data actually shows: the roles hiring now, the skills employers ask for, and the honest truth about experience and pay.',
    date: 'Oct 31, 2026',
    author: 'Muhammad Talha',
    category: 'Career Advice',
    image: '/blog-og-image.jpg',
  },
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