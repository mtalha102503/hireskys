import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Next.js Route Config to disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Supabase Client Initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function: To format date to standard ISO format for aggregators
function formatStandardDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  return d.toISOString(); // Talent.com prefers standard ISO 8601 date format
}

// 🔥 NAYA HELPER: Location ko split karne ke liye (e.g., "Remote(USA)" -> City: "Remote", Country: "USA")
function parseLocation(locationString: string) {
  let country = '';
  let city = '';

  if (!locationString) return { country, city };

  // Regex to extract text before parenthesis as city, and inside parenthesis as country
  const match = locationString.match(/(.*?)\((.*?)\)/);
  if (match) {
    city = match[1].trim(); 
    country = match[2].trim(); 
  } else {
    // Agar parenthesis na ho toh poori string ko as a country/location treat karein
    country = locationString.trim();
  }
  
  return { country, city };
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
    // 1. Fetch data from Supabase. Added 'link' column for the Original ATS URL
    const { data: jobs, error } = await supabase
      .from('jobs') 
      .select('id, title, slug, source, company_logo_url, location, description, created_at, salary_range, job_type, link')
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

    // 2. Construct XML Feed specifically for Talent.com
    let xmlItems = '';

    for (const job of jobs) {
      const jobUrl = `https://hireskys.com/jobs/${job.slug}`;
      const expireDate = new Date(job.created_at);
      expireDate.setDate(expireDate.getDate() + 60);

      const hasSalary = job.salary_range && job.salary_range !== 'Not Disclosed';
      
      // Location Parser ko call kiya
      const loc = parseLocation(job.location);

      xmlItems += `
  <job>
    <referencenumber><![CDATA[${job.id}]]></referencenumber>
    <title><![CDATA[${job.title}]]></title>
    <url><![CDATA[${jobUrl}]]></url>
    <original_url><![CDATA[${job.link}]]></original_url> <company><![CDATA[${job.source}]]></company> <city><![CDATA[${loc.city}]]></city>
    <country><![CDATA[${loc.country}]]></country>
    
    <description><![CDATA[${job.description}]]></description> <date><![CDATA[${formatStandardDate(job.created_at)}]]></date>
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
