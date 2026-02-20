import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { createSlug } from '@/lib/utils';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar'; // 👈 Navbar Import
import { 
  ArrowLeft, Code, Smartphone, Video, Layout, Globe, Edit3, Cpu, 
  Briefcase, Search, MapPin, DollarSign, Calendar, Sparkles, Speaker, Headphones, Users,ShieldCheck, BookOpen, BarChart,PenTool 
} from 'lucide-react';

// 🛠️ CONFIGURATION
const SUPABASE_URL = "https://pxtifojzsouujkfxpohq.supabase.co";
const SUPABASE_KEY = "sb_publishable_8Pwl1r9B_H8rlTUODhMbdw_9uYLkhMJ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORIES: Record<string, { icon: any; sub: string[] }> = {
  // 1. Tech & Development
  "Development": {
    icon: Code,
    sub: ["React", "Next.js", "Node.js", "Python", "MERN Stack", "WordPress", "Shopify", "Web3", "Frontend", "Backend", "DevOps", "Cybersecurity", "QA Tester", "Game Dev"]
  },
  "Mobile App": {
    icon: Smartphone,
    sub: ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin", "Ionic", "App Design"]
  },
  "AI & Machine Learning": { 
    icon: Cpu,
    sub: ["AI Engineer", "Machine Learning", "NLP", "Computer Vision", "Prompt Engineering", "Chatbot Dev", "TensorFlow", "OpenAI API", "Python Scripting"]
  },

  // 2. Creative & Design
  "Design & Creative": {
    icon: Layout,
    sub: ["UI/UX Design", "Graphic Design", "Logo Design", "Figma", "Adobe Photoshop", "Illustrator", "Packaging Design", "Presentation Design", "NFT Art"]
  },
  "Video & Animation": {
    icon: Video,
    sub: ["Video Editor", "Premiere Pro", "After Effects", "Motion Graphics", "3D Animation", "Thumbnail Artist", "Short Form (Reels/TikTok)", "VFX"]
  },
  "Audio & Voice": {
    icon: Speaker,
    sub: ["Voice Over", "Audio Engineering", "Podcast Editor", "Music Production", "Sound Design", "Mixing & Mastering"]
  },
  "Writing & Translation": {
    icon: Edit3,
    sub: ["Content Writer", "Copywriter", "Technical Writer", "Ghostwriter", "Proofreading", "Translation", "Scriptwriting", "Blog Writing", "Resume Writing"]
  },

  // 3. Marketing & Sales
  "Marketing & Sales": { 
    icon: Globe,
    sub: ["SEO", "Social Media Manager", "Facebook Ads", "Google Ads", "Email Marketing", "Lead Generation", "Sales Representative", "Cold Calling", "Affiliate Marketing", "Influencer Marketing"]
  },

  // 4. Business & Admin
  "Admin & Support": { 
    icon: Users, 
    sub: ["Virtual Assistant", "Data Entry", "Executive Assistant", "Research", "Project Management", "Transcription", "Spreadsheets (Excel/Google Sheets)"] 
  },
  "Customer Service": {
    icon: Headphones,
    sub: ["Customer Support", "Technical Support", "Community Manager", "Chat Support", "Call Center", "Zendesk"]
  },

  // 5. Professional Services
  "Finance & Accounting": {
    icon: DollarSign,
    sub: ["Accountant", "Bookkeeping", "Financial Analyst", "Tax Preparation", "QuickBooks", "Xero", "CFO", "Crypto Trading"]
  },
  "Legal & HR": {
    icon: ShieldCheck,
    sub: ["Legal Consultant", "Contract Law", "Paralegal", "Recruiter", "HR Manager", "Talent Acquisition"]
  },
  "Education & Coaching": {
    icon: BookOpen,
    sub: ["Online Tutor", "Course Creator", "Language Teacher", "Math Tutor", "Coding Mentor", "Fitness Coach", "Life Coach"]
  },
  
  // 6. Data & Engineering
  "Data Science & Analytics": {
    icon: BarChart,
    sub: ["Data Scientist", "Data Analyst", "Business Intelligence", "Power BI", "Tableau", "SQL", "Big Data", "Data Scraping"]
  },
  "Engineering & Architecture": {
    icon: PenTool,
    sub: ["CAD Designer", "3D Modeling", "Interior Design", "Mechanical Engineering", "Electrical Engineering", "AutoCAD", "SolidWorks"]
  }
};
type Props = {
  params: Promise<{ slug: string; subcategory: string }>;
};

// 🌟 HELPER
const findRealTag = (categorySlug: string, subSlug: string) => {
  const mainKey = Object.keys(CATEGORIES).find(k => k.toLowerCase().replace(/[^a-z0-9]+/g, '-') === categorySlug);
  if (!mainKey) return null;
  const realTag = CATEGORIES[mainKey].sub.find(sub => 
    sub.toLowerCase().replace(/[^a-z0-9]+/g, '-') === subSlug
  );
  return realTag;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const realTag = findRealTag(resolvedParams.slug, resolvedParams.subcategory);
  const displayTitle = realTag || decodeURIComponent(resolvedParams.subcategory).replace(/-/g, ' ');

  return {
    title: `Remote ${displayTitle} Jobs | HireSkys`,
    description: `Apply to verified ${displayTitle} jobs.`,
  };
}

export default async function SubCategoryJobsPage({ params }: Props) {
  const resolvedParams = await params;
  const exactTag = findRealTag(resolvedParams.slug, resolvedParams.subcategory);
  const searchTag = exactTag || decodeURIComponent(resolvedParams.subcategory).replace(/-/g, ' ');

  // Query Logic
  let query = supabase.from('jobs').select('*').eq('active', true).order('date_posted', { ascending: false });

  if (exactTag) {
    query = query.contains('tags', [exactTag]);
  } else {
    query = query.ilike('tags::text', `%${searchTag}%`);
  }

  const { data: jobs } = await query;
  const displaySubCategory = exactTag || searchTag.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // 🔴 NO JOBS STATE (Beautiful Empty State)
  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19]">
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
                No {displaySubCategory} Jobs Found
            </h1>
            <p className="text-slate-500 mb-8 max-w-md text-lg">
                We couldn't find any active listings for this specific skill right now.
            </p>
            <Link 
                href={`/category/${resolvedParams.slug}`} 
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 font-medium"
            >
                <ArrowLeft size={20} /> Browse {resolvedParams.slug.replace(/-/g, ' ')}
            </Link>
        </div>
      </div>
    );
  }

  // 🟢 MAIN CONTENT
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* 🔙 BACK BUTTON */}
        <div className="mb-8">
            <Link 
                href={`/category/${resolvedParams.slug}`} 
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mr-2 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
                Back to {resolvedParams.slug.replace(/-/g, ' ')}
            </Link>
        </div>

        {/* 🎨 HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Remote <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{displaySubCategory}</span> Jobs
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Found {jobs.length} verified opportunities
                </p>
            </div>
        </div>

        {/* 💎 JOBS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link 
              key={job.id} 
              href={`/jobs/${createSlug(job.title, job.id)}`}
              className="group flex flex-col justify-between p-6 bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* Company Logo Placeholder or Initial */}
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                    {job.company ? job.company.charAt(0) : "H"}
                  </div>
                  
                  <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Remote
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                  {job.company || "Confidential Client"}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.tags?.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                  {job.tags && job.tags.length > 3 && (
                     <span className="text-[11px] text-slate-400 px-1 py-1">+{job.tags.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Bottom Info */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> 
                  {job.salary_range ? job.salary_range.replace('Yearly', '') : "Competitive"}
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(job.date_posted).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 👇 Footer CTA to Explore More */}
        <div className="mt-20 text-center border-t border-slate-200 dark:border-slate-800 pt-10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Keep exploring
            </h3>
            <p className="text-slate-500 mb-6">
                Check out other specialized roles in {resolvedParams.slug.replace(/-/g, ' ')}.
            </p>
            <Link 
                href={`/category/${resolvedParams.slug}`} 
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
                <Briefcase className="w-4 h-4" />
                View all categories
            </Link>
        </div>

      </div>
    </div>
  );
}

