import Link from 'next/link';
import { 
  Code, Smartphone, Video, Layout, Globe, Edit3, Cpu, ArrowRight, Speaker, Users, Headphones, DollarSign,
  ShieldCheck, BookOpen, BarChart, PenTool
} from 'lucide-react';

const CATEGORIES = [
  // 1. Tech & Development
  { name: "Development", icon: Code },
  { name: "Mobile App", icon: Smartphone },
  { name: "AI & Machine Learning", icon: Cpu },

  // 2. Creative & Design
  { name: "Design & Creative", icon: Layout },
  { name: "Video & Animation", icon: Video },
  { name: "Audio & Voice", icon: Speaker },
  { name: "Writing & Translation", icon: Edit3 },

  // 3. Marketing & Sales
  { name: "Marketing & Sales", icon: Globe },

  // 4. Business & Admin
  { name: "Admin & Support", icon: Users },
  { name: "Customer Service", icon: Headphones },

  // 5. Professional Services
  { name: "Finance & Accounting", icon: DollarSign },
  { name: "Legal & HR", icon: ShieldCheck },
  { name: "Education & Coaching", icon: BookOpen },

  // 6. Data & Engineering
  { name: "Data Science & Analytics", icon: BarChart },
  { name: "Engineering & Architecture", icon: PenTool },
];

export default function CategorySection() {
  return (
    // 👇 YAHAN CHANGE HAI: bg-slate-50 (Light Gray Background)
    <section className="py-20 bg-slate-50 dark:bg-transparent border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Explore by <span className="text-indigo-600">Category</span>
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
                Dive into our specialized directories to find the perfect remote fit.
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, index) => {
            const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const Icon = cat.icon;

            return (
              <Link
                key={index}
                href={`/category/${slug}`}
                // White cards on Gray background look clean (Shadow added)
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0B0F19] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm text-center">
                    {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
