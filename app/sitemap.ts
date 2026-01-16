import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// 🛠️ CONFIGURATION
// Behtar hai ke environment variables use karo, par yahan direct bhi chalega
const SUPABASE_URL = "https://pxtifojzsouujkfxpohq.supabase.co";
const SUPABASE_KEY = "sb_publishable_8Pwl1r9B_H8rlTUODhMbdw_9uYLkhMJ"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'https://hireskys.com'; // Apni domain confirm kar lena

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // ==========================================
  // 1️⃣ STATIC PAGES (Footer & Main Nav)
  // ==========================================
  const staticRoutes: MetadataRoute.Sitemap = [
    // --- MAIN PAGES ---
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Home Page is King 👑
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // --- PLATFORM COLUMN (From Footer) ---
    {
      url: `${BASE_URL}/jobs`, // Browse Jobs
      lastModified: new Date(),
      changeFrequency: 'hourly', // Kyunki jobs har waqt update hoti hain
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/how-it-works`, // How It Works
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/post-job`, // Post a Job
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // Business lane ke liye important hai
    },
    {
      url: `${BASE_URL}/share-story`, // Share Your Success
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // --- RESOURCES COLUMN (From Footer) ---
    {
      url: `${BASE_URL}/success-stories`, // Success Stories
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/career-advice`, // Career Advice
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/salary-guide`, // Salary Guide
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/support`, // Help & Support
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/faqs`, // Faqs
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // --- LEGAL COLUMN (From Footer) ---
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`, // Terms of Service
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/about`, // About Us
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // ==========================================
  // 🆕 2️⃣ CAREER ADVICE ARTICLES (Manual 6 Examples)
  // ==========================================
  const articleSlugs = [
    "resume-role",
    "zoom-interview",
    "salary-negotiation",
    "ghost-jobs",
    "portfolio-guide",
    "tools-trade"
  ];

  const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${BASE_URL}/career-advice/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // ==========================================
  // 3️⃣ DYNAMIC PAGES (Individual Jobs)
  // ==========================================
  
  // Hum latest 5000 jobs uthayenge taake Sitemap fast load ho
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, date_posted')
    .order('date_posted', { ascending: false })
    .limit(5000);

  let jobRoutes: MetadataRoute.Sitemap = [];

  if (jobs) {
    jobRoutes = jobs.map((job) => ({
      url: `${BASE_URL}/jobs/${job.id}`,
      lastModified: new Date(job.date_posted), // Job ki asli date
      changeFrequency: 'weekly', // Jobs roz update nahi hoti (description same rehti hai)
      priority: 0.8, // High priority for SEO
    }));
  }

  // ✅ Final Merge: Static + Articles + Jobs
  return [...staticRoutes, ...articleRoutes, ...jobRoutes];
}