import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Next.js ko force karein ke is route ko hamesha dynamically render kare
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Supabase Client Initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function: Jooble ke mandatory DD.MM.YYYY date format ke liye
function formatJoobleDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

// Helper function: XML characters ko escape karne ke liye
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  try {
    // 2. Fetch data directly from your Supabase 'jobs' table
    const { data: jobs, error } = await supabase
      .from('jobs') 
      .select('id, title, slug, source, company_logo_url, location, description, created_at, salary_range, job_type')
      .eq('active', true)
      .eq('approved', true) 
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase Query Failed: ${error.message}`);
    }

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

    // 3. Construct XML Feed
    let xmlItems = '';

    for (const job of jobs) {
      // 🚨 FIX 1: Link structure badal kar '/jobs/' kar diya hai
      const jobUrl = `https://hireskys.com/jobs/${job.slug}`;

      // 🚨 FIX 2: Location checking logic - Remote (Global) ko United States map kar diya
      const xmlLocation = job.location === "Remote (Global)" ? "United States" : job.location;

      const expireDate = new Date(job.created_at);
      expireDate.setDate(expireDate.getDate() + 60);

      const hasSalary = job.salary_range && job.salary_range !== 'Not Disclosed';

      xmlItems += `
  <job id="${job.id}">
    <link><![CDATA[${jobUrl}]]></link>
    <name><![CDATA[${job.title}]]></name>
    <region><![CDATA[${xmlLocation}]]></region>
    <description><![CDATA[${job.description}]]></description>
    <pubdate>${formatJoobleDate(job.created_at)}</pubdate>
    <updated>${formatJoobleDate(job.created_at)}</updated>
    <company><![CDATA[${job.source}]]></company>
    <expire>${formatJoobleDate(expireDate)}</expire>
    <jobtype><![CDATA[${job.job_type}]]></jobtype>
    ${hasSalary ? `<salary><![CDATA[${job.salary_range}]]></salary>` : ''}
    ${job.company_logo_url ? `<logo><![CDATA[${job.company_logo_url}]]></logo>` : ''}
  </job>`;
    }

    const fullXml = `<?xml version="1.0" encoding="utf-8"?>\n<jobs>${xmlItems}\n</jobs>`;

    // 4. Return response with strictly NO-CACHE headers
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
