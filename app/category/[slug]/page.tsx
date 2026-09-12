import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { typesenseSearchClient } from '@/lib/typesenseClient';
import { 
  Code, Smartphone, Video, Layout, Globe, Edit3, Cpu, 
  ArrowLeft, ArrowRight, Hash, Sparkles, Briefcase, Search, Speaker, Users, Headphones, DollarSign, ShieldCheck, BookOpen , BarChart,PenTool, HelpCircle
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

  // 🧠 SEO Content — direct Typesense fetch, main-category-level document (id = category slug, no subcategory)
  let introText = '';
  let faqs: { q: string; a: string }[] = [];

  try {
    const contentDoc: any = await typesenseSearchClient
      .collections('category_content')
      .documents(resolvedParams.slug)
      .retrieve();

    introText = contentDoc.intro_text || '';
    faqs = contentDoc.faqs ? JSON.parse(contentDoc.faqs) : [];
  } catch (err) {
    // 404 = content not seeded yet for this category, safe to fall back to empty
    console.error("Category content fetch error (Typesense):", err);
  }

  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19]">
      {/* 1️⃣ NAVBAR */}
      <Navbar />

      {/* 🧩 FAQ Schema for Google */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

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
<div className="relative mb-8 p-8 md:p-10 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-indigo-500/5">
    {/* Background Decor */}
    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-violet-500/15 rounded-full blur-[80px] pointer-events-none" />
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-10 opacity-5" />

    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 ring-1 ring-black/5 dark:ring-white/5">
            <Icon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="mt-1 md:mt-0">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                Remote <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">{categoryKey}</span> Jobs
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Explore specialized roles in {categoryKey}. We curate the best remote opportunities across <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{data.sub.length}+ skills</span>.
            </p>
        </div>
    </div>
</div>

        {/* 🧠 SEO INTRO CONTENT — separate card below the hero, same rounded/glass language */}
        {introText && (
          <div className="relative mb-12 p-6 md:p-8 rounded-[1.5rem] bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-indigo-500/5">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] md:text-base">
              {introText}
            </p>
          </div>
        )}

        {/* 💎 INTERACTIVE GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
  {data.sub.map((sub, index) => {
    const subSlug = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    return (
      <Link
        key={index}
        href={`/category/${resolvedParams.slug}/${subSlug}`}
        className="group relative flex flex-col justify-between overflow-hidden bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/50 active:scale-[0.98]"
      >
        {/* Subtle top border highlight on hover */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {sub}
            </h3>
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-indigo-500 group-hover:rotate-45 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
            <span>View openings</span>
          </div>
        </div>
      </Link>
    );
  })}
</div>

        {/* 🙋 FAQ SECTION — glass-card style matching this page's hero language */}
        {faqs.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3 max-w-4xl">
              {faqs.map((f, i) => (
                <details 
                  key={i} 
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-5 open:shadow-lg open:shadow-indigo-500/5 open:border-indigo-200 dark:open:border-indigo-900/50 transition-colors"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer flex items-center justify-between list-none">
                    <span>{f.q}</span>
                    <span className="ml-4 shrink-0 w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 group-open:bg-indigo-500 group-open:text-white group-open:rotate-45 transition-all duration-300">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}
        
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