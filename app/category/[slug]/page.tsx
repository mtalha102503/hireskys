import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  Code, Smartphone, Video, Layout, Globe, Edit3, Cpu, 
  ArrowLeft, ArrowRight, Hash, Sparkles, Briefcase, Search, Speaker, Users, Headphones, DollarSign, ShieldCheck, BookOpen , BarChart,PenTool
} from 'lucide-react';

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
  params: Promise<{ slug: string }>;
};

const findCategoryKey = (slug: string) => {
  return Object.keys(CATEGORIES).find(key => 
    key.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryKey = findCategoryKey(resolvedParams.slug);

  if (!categoryKey) return { title: "Category Not Found" };

  return {
    title: `${categoryKey} Jobs | HireSkys`,
    description: `Find top remote ${categoryKey} jobs.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryKey = findCategoryKey(resolvedParams.slug);

  if (!categoryKey) {
    return notFound();
  }

  const data = CATEGORIES[categoryKey];
  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19]">
      {/* 1️⃣ NAVBAR */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* 🔙 BACK BUTTON */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mr-2 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
                Back to Home
            </Link>
        </div>

        {/* 🎨 HERO HEADER */}
        <div className="relative mb-16 p-8 md:p-12 rounded-3xl overflow-hidden bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                    <Icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                        Remote <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{categoryKey}</span> Jobs
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                        Explore specialized roles in {categoryKey}. We curate the best remote opportunities for <span className="text-indigo-600 dark:text-indigo-400 font-medium">{data.sub.length}+ skills</span>.
                    </p>
                </div>
            </div>
        </div>

        {/* 💎 INTERACTIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.sub.map((sub, index) => {
            const subSlug = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            return (
              <Link
                key={index}
                href={`/category/${resolvedParams.slug}/${subSlug}`}
                // 👇 YAHAN CHANGE KIYA HAI: active:scale-95 active:bg-indigo-50 add kiya hai
                className="group relative overflow-hidden bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/30 active:scale-95 active:border-indigo-500 active:bg-indigo-50 dark:active:bg-indigo-900/20"
              >
                {/* Gradient Line Effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <Hash className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {sub}
                </h3>
                
                <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    View Jobs
                </p>
              </Link>
            );
          })}
        </div>
        
        {/* 🔥 NEW ATTRACTIVE FOOTER (BUTTON STYLE) */}
        <div className="mt-24 mb-10">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-slate-800 px-6 py-12 md:px-12 md:py-16 text-center shadow-2xl">
                
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-40"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-xl mb-6 border border-white/10">
                        <Briefcase className="w-6 h-6 text-indigo-300" />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Not what you're looking for?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Don't worry! We have thousands of other remote opportunities waiting for you on our main board.
                    </p>
                    
                    <Link 
                        href="/" 
                        // 👇 YAHAN BHI active:scale-95 add kar diya
                        className="inline-flex items-center gap-3 bg-white text-slate-900 hover:bg-indigo-50 active:scale-95 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg shadow-white/10"
                    >
                        <Search className="w-5 h-5 text-indigo-600" />
                        Explore All Categories
                    </Link>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
