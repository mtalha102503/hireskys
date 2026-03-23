import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { createSlug } from '@/lib/utils'; 
import { CATEGORIES } from '@/lib/categories'; 
import { BLOG_POSTS } from '@/lib/blogData';

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
    { url: `${BASE_URL}/hyrizon`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
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
  // 3️⃣ CATEGORIES & SUBCATEGORIES (Tumhara purana logic 100% same hai)
  // ==========================================
  let categoryRoutes: MetadataRoute.Sitemap = [];

  Object.entries(CATEGORIES).forEach(([mainCat, data]) => {
    const mainSlug = mainCat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    categoryRoutes.push({
      url: `${BASE_URL}/category/${mainSlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily', 
      priority: 0.9, 
    });

    const subCategories = (data as any).sub || [];

    subCategories.forEach((sub: string) => {
      const subSlug = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      categoryRoutes.push({
        url: `${BASE_URL}/category/${mainSlug}/${subSlug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });
  });

  // ==========================================
  // 4️⃣ DYNAMIC JOBS
  // ==========================================
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, date_posted')
    .eq('approved', true)
    .order('date_posted', { ascending: false })
    .limit(5000);

  let jobRoutes: MetadataRoute.Sitemap = [];

  if (jobs) {
    jobRoutes = jobs.map((job) => ({
      url: `${BASE_URL}/jobs/${createSlug(job.title, job.id)}`, 
      lastModified: new Date(job.date_posted),
      changeFrequency: 'weekly', 
      priority: 0.8,
    }));
  }

  // ==========================================
  // 5️⃣ DYNAMIC COMPANIES
  // ==========================================
  const { data: companies } = await supabase
    .from('companies')
    .select('slug, created_at'); 

  let companyRoutes: MetadataRoute.Sitemap = [];

  if (companies) {
    companyRoutes = companies.map((company) => ({
      url: `${BASE_URL}/companies/${company.slug}`, 
      lastModified: new Date(company.created_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  }

  // ==========================================
  // 6️⃣ DYNAMIC BLOG POSTS
  // ==========================================
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly', 
    priority: 0.8, 
  }));

  // ==========================================
  // 7️⃣ PROGRAMMATIC SEO PAGES (🚀 NAYA SECTION ADD KIYA HAI!)
  // ==========================================
  const { data: seoPages } = await supabase
    .from('seo_pages')
    .select('url_path, last_updated')
    .eq('is_indexed', true); // Sirf indexable pages uthayega

  let pseoRoutes: MetadataRoute.Sitemap = [];

  if (seoPages) {
    pseoRoutes = seoPages.map((page) => ({
      // page.url_path mein already / lagga hoga (e.g. "/remote-jobs/uk/react")
      url: `${BASE_URL}${page.url_path}`, 
      lastModified: new Date(page.last_updated || new Date()),
      changeFrequency: 'daily', 
      priority: 0.9, 
    }));
  }

  // 🔥 MERGE EVERYTHING
  return [
    ...staticRoutes, 
    ...articleRoutes, 
    ...categoryRoutes, 
    ...jobRoutes, 
    ...companyRoutes,
    ...blogRoutes,
    ...pseoRoutes // 👈 Naya section aakhir mein merge kar diya
  ];
}
