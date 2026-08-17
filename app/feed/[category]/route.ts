import { typesenseSearchClient } from '@/lib/typesenseClient';
import { createSlug } from '@/lib/utils';

export const revalidate = 86400; 

// 🚀 REVERSE MAP: URL Slug -> Exact Database Category
const slugToCategory: Record<string, string> = {
  "development": "Development",
  "mobile-app": "Mobile App",
  "ai-machine-learning": "AI & Machine Learning",
  "design-creative": "Design & Creative",
  "video-animation": "Video & Animation",
  "audio-voice": "Audio & Voice",
  "writing-translation": "Writing & Translation",
  "marketing-sales": "Marketing & Sales",
  "admin-support": "Admin & Support",
  "customer-service": "Customer Service",
  "finance-accounting": "Finance & Accounting",
  "legal-hr": "Legal & HR",
  "education-coaching": "Education & Coaching",
  "data-science-analytics": "Data Science & Analytics",
  "engineering-architecture": "Engineering & Architecture"
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const SITE_URL = 'https://www.hireskys.com';

  try {
    const { category } = await params; 
    
    // FIX: Next.js yahan ".xml" sath dega, humein usay cut karna hai
    const cleanSlug = category.replace('.xml', '').toLowerCase();
    
    // 1. Clean slug se exact category name nikalo
    const exactCategoryName = slugToCategory[cleanSlug];

    // Agar map mein nahi hai, toh 404 error do
    if (!exactCategoryName) {
      return new Response('Category Feed Not Found', { status: 404 });
    }

    // 2. 🔥 Typesense se query (Supabase ki jagah)
    let jobs: any[] = [];
    try {
      const results: any = await typesenseSearchClient.collections('jobs').documents().search({
        q: '*',
        query_by: 'title',
        filter_by: `category:=${exactCategoryName} && approved:=true && active:=true`,
        sort_by: 'date_posted_ts:desc',
        per_page: 20,
      });
      jobs = results.hits?.map((h: any) => h.document) || [];
    } catch (err) {
      throw new Error("Typesense fetch failed");
    }

    // 3. XML Setup
   let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[HireSkys - Remote ${exactCategoryName} Jobs]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[Discover the best remote ${exactCategoryName} jobs from top companies around the world.]]></description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed/${category}" rel="self" type="application/rss+xml" />
`;

    if (jobs && jobs.length > 0) {
      jobs.forEach((job) => {
        const safeTitle = job.title || 'Remote Job';
        // Ab bhi 'company' pehle try karega, phir 'source' fallback
        const safeCompany = job.company || job.source || 'HireSkys';
        const safeDate = job.date_posted_ts ? new Date(job.date_posted_ts).toUTCString() : new Date().toUTCString();
        
        const jobUrl = `${SITE_URL}/jobs/${createSlug(safeTitle, job.id)}`;
        
        // Perfectly Encoded OG Image Link
        const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(safeTitle)}&amp;company=${encodeURIComponent(safeCompany)}`;
        
        xml += `
        <item>
          <title><![CDATA[${safeTitle} at ${safeCompany}]]></title>
          <link>${jobUrl}</link>
          <guid isPermaLink="true">${jobUrl}</guid>
          <pubDate>${safeDate}</pubDate>
          <description><![CDATA[Apply for ${safeTitle} at ${safeCompany} on HireSkys. Verified remote ${exactCategoryName} job.]]></description>
          <media:content url="${ogImageUrl}" type="image/png" medium="image" width="1200" height="630" />
        </item>
        `;
      });
    }

    xml += `
      </channel>
    </rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    return new Response('Error generating category feed', { status: 500 });
  }
}