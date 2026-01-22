import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { createSlug } from '@/lib/utils'; // 👈 YAHAN HAI MAGIC: Same logic import kiya

// 🛠️ CONFIGURATION
const SUPABASE_URL = "https://pxtifojzsouujkfxpohq.supabase.co";
const SUPABASE_KEY = "sb_publishable_8Pwl1r9B_H8rlTUODhMbdw_9uYLkhMJ"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'https://www.hireskys.com'; 
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // ==========================================
  // 1️⃣ STATIC PAGES
  // ==========================================
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/jobs`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/post-job`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/share-story`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/success-stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/career-advice`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/salary-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/support`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/faqs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // ==========================================
  // 2️⃣ CAREER ADVICE ARTICLES
  // ==========================================
  const articleSlugs = [
    "resume-role", "zoom-interview", "salary-negotiation", 
    "ghost-jobs", "portfolio-guide", "tools-trade"
  ];

  const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${BASE_URL}/career-advice/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // ==========================================
  // 3️⃣ DYNAMIC JOBS (Ab 100% Same URL Banega)
  // ==========================================
  
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, date_posted') // Title zaroori hai slug ke liye
    .order('date_posted', { ascending: false })
    .limit(5000);

  let jobRoutes: MetadataRoute.Sitemap = [];

  if (jobs) {
    jobRoutes = jobs.map((job) => ({
      // 👇 AB KOI TENSION NAHI: Wahi function use ho raha hai jo website par hai
      url: `${BASE_URL}/jobs/${createSlug(job.title, job.id)}`, 
      lastModified: new Date(job.date_posted),
      changeFrequency: 'weekly', 
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...articleRoutes, ...jobRoutes];
}
