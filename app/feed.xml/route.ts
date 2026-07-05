import { supabase } from '@/lib/supabaseClient';
import { createSlug } from '@/lib/utils';

export const revalidate = 3600; // Cache the feed for 1 hour taake Supabase par load na aaye

export async function GET() {
  const SITE_URL = 'https://www.hireskys.com';

  // Sirf latest 20 active aur approved jobs uthao
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, company, source, date_posted')
    .eq('approved', true)
    .eq('active', true)
    .order('date_posted', { ascending: false })
    .limit(20);

  // XML ki basic structure aur Pinterest image ke liye Yahoo media namespace
  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>HireSkys - Verified Borderless Remote Jobs</title>
      <link>${SITE_URL}</link>
      <description>Discover the best remote jobs from top companies around the world. No borders, no limits.</description>
      <language>en-us</language>
      <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  `;

  if (jobs) {
    jobs.forEach((job) => {
      // 1. URL aur details nikalo
      const jobUrl = `${SITE_URL}/jobs/${createSlug(job.title, job.id)}`;
      const companyName = job.company || job.source || 'HireSkys';
      
      // 2. Pinterest ke liye OG Image ka exact link banao
      // ✅ Nayi Line (XML friendly)
 const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(job.title)}&amp;company=${encodeURIComponent(companyName)}`;
      
      // 3. XML Item Generate Karo (CDATA lagaya hai taake special characters error na dein)
      xml += `
      <item>
        <title><![CDATA[${job.title} at ${companyName}]]></title>
        <link>${jobUrl}</link>
        <guid isPermaLink="true">${jobUrl}</guid>
        <pubDate>${new Date(job.date_posted).toUTCString()}</pubDate>
        <description><![CDATA[Apply for ${job.title} at ${companyName} on HireSkys. Manually Verfied remote job.]]></description>
        <media:content url="${ogImageUrl}" type="image/png" medium="image" width="1200" height="630" />
      </item>
      `;
    });
  }

  xml += `
    </channel>
  </rss>`;

  // As a proper XML file return karo
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}