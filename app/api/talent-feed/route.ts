import { NextResponse } from 'next/server';
import { typesenseAdminClient } from '@/lib/typesenseClient';
import { createSlug } from '@/lib/utils';

// 1. Next.js Route Config to disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper function: To format date to standard ISO format for aggregators
function formatStandardDate(dateInput: string | number | Date): string {
  const d = new Date(dateInput);
  return d.toISOString(); // Talent.com prefers standard ISO 8601 date format
}

// Location ko split karne ke liye (e.g., "Remote(USA)" -> City: "Remote", Country: "USA")
function parseLocation(locationString: string) {
  let country = '';
  let city = '';

  if (!locationString) return { country, city };

  const match = locationString.match(/(.*?)\((.*?)\)/);
  if (match) {
    city = match[1].trim(); 
    country = match[2].trim(); 
  } else {
    country = locationString.trim();
  }
  
  return { country, city };
}

export async function GET() {
  try {
    // 1. 🔥 Typesense export() se saari active+approved jobs ek baar me (250 pagination limit se bachne ke liye)
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

    // Newest jobs pehle (export() order guarantee nahi karta)
    jobs.sort((a: any, b: any) => (b.date_posted_ts || 0) - (a.date_posted_ts || 0));

    // 2. Construct XML Feed specifically for Talent.com
    let xmlItems = '';

    for (const job of jobs) {
      const jobSlug = createSlug(job.title, job.id);
      const jobUrl = `https://hireskys.com/jobs/${jobSlug}`;

      const postedDate = job.date_posted_ts ? new Date(job.date_posted_ts) : new Date(job.date_posted || Date.now());
      const expireDate = new Date(postedDate);
      expireDate.setDate(expireDate.getDate() + 60);

      const hasSalary = job.salary_range && job.salary_range !== 'Not Disclosed';
      
      const loc = parseLocation(job.location);

      xmlItems += `
  <job>
    <referencenumber><![CDATA[${job.id}]]></referencenumber>
    <title><![CDATA[${job.title}]]></title>
    <url><![CDATA[${jobUrl}]]></url>
    <original_url><![CDATA[${job.link}]]></original_url> <company><![CDATA[${job.company || job.source}]]></company> <city><![CDATA[${loc.city}]]></city>
    <country><![CDATA[${loc.country}]]></country>
    
    <description><![CDATA[${job.description}]]></description> <date><![CDATA[${formatStandardDate(postedDate)}]]></date>
    <expiration_date><![CDATA[${formatStandardDate(expireDate)}]]></expiration_date>
    <jobtype><![CDATA[${job.job_type}]]></jobtype> ${hasSalary ? `<salary><![CDATA[${job.salary_range}]]></salary>` : ''} ${job.company_logo_url ? `<logo><![CDATA[${job.company_logo_url}]]></logo>` : ''} </job>`;
    }

    const fullXml = `<?xml version="1.0" encoding="utf-8"?>\n<jobs>${xmlItems}\n</jobs>`;

    // 3. Return response with strictly NO-CACHE headers
    return new NextResponse(fullXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error("Talent.com XML Feed Error:", error);
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