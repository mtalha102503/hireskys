import { NextResponse } from 'next/server';
import { typesenseAdminClient } from '@/lib/typesenseClient';
import { createSlug } from '@/lib/utils';

// 1. Next.js ko force karein ke is route ko hamesha dynamically render kare
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper function: Jooble ke mandatory DD.MM.YYYY date format ke liye
function formatJoobleDate(dateInput: string | number | Date): string {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export async function GET() {
  try {
    // 2. 🔥 Typesense export() se saari active+approved jobs ek baar me (koi 250 wali pagination limit nahi)
    const exportResult = await typesenseAdminClient
      .collections('jobs')
      .documents()
      .export({ filter_by: 'active:=true && approved:=true' });

    const jobs = exportResult
      .split('\n')
      .filter(Boolean)
      .map((line: string) => JSON.parse(line));

    if (!jobs || jobs.length === 0) {
      return new NextResponse(`<?xml version="1.0" encoding="utf-8"?><jobs></jobs>`, { 
        headers: { 
          'Content-Type': 'application/xml',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } 
      });
    }

    // 3. Newest jobs pehle (export() order guarantee nahi karta, isliye manually sort)
    jobs.sort((a: any, b: any) => (b.date_posted_ts || 0) - (a.date_posted_ts || 0));

    // 4. Construct XML Feed
    let xmlItems = '';

    for (const job of jobs) {
      // Slug ab Supabase column se nahi, createSlug() se generate hoga (jaisa baaki site pe hota hai)
      const jobSlug = createSlug(job.title, job.id);
      const jobUrl = `https://hireskys.com/jobs/${jobSlug}`;

      // Location checking logic - Remote (Global) ko United States map kar diya
      const xmlLocation = job.location === "Remote (Global)" ? "United States" : job.location;

      // 👇 date_posted_ts (ms epoch) se date banao, fallback me date_posted string
      const postedDate = job.date_posted_ts ? new Date(job.date_posted_ts) : new Date(job.date_posted || Date.now());
      const expireDate = new Date(postedDate);
      expireDate.setDate(expireDate.getDate() + 60);

      const hasSalary = job.salary_range && job.salary_range !== 'Not Disclosed';

      xmlItems += `
  <job id="${job.id}">
    <link><![CDATA[${jobUrl}]]></link>
    <name><![CDATA[${job.title}]]></name>
    <region><![CDATA[${xmlLocation}]]></region>
    <description><![CDATA[${job.description}]]></description>
    <pubdate>${formatJoobleDate(postedDate)}</pubdate>
    <updated>${formatJoobleDate(postedDate)}</updated>
    <company><![CDATA[${job.company || job.source}]]></company>
    <expire>${formatJoobleDate(expireDate)}</expire>
    <jobtype><![CDATA[${job.job_type}]]></jobtype>
    ${hasSalary ? `<salary><![CDATA[${job.salary_range}]]></salary>` : ''}
    ${job.company_logo_url ? `<logo><![CDATA[${job.company_logo_url}]]></logo>` : ''}
  </job>`;
    }

    const fullXml = `<?xml version="1.0" encoding="utf-8"?>\n<jobs>${xmlItems}\n</jobs>`;

    // 5. Return response with strictly NO-CACHE headers
    return new NextResponse(fullXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error("Jooble XML Feed Error:", error);
    // Silent fail fallback for bots
    return new NextResponse(
      `<?xml version="1.0" encoding="utf-8"?><jobs></jobs>`, 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/xml',
          'Cache-Control': 'no-store'
        } 
      }
    );
  }
}