import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Feed size ko control me rakhne ke liye limit + description truncation
const MAX_JOBS = 8000;
const DESC_MAX_LENGTH = 700;

function formatJoobleDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

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

// 🆕 HTML tags hatao aur ek reasonable length tak trim karo,
// taake feed ka size manageable rahe aur ISR/response-size limit cross na ho
function cleanAndTruncateDescription(html: string): string {
  if (!html) return '';
  // HTML tags hatao
  const plainText = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= DESC_MAX_LENGTH) return plainText;
  return plainText.slice(0, DESC_MAX_LENGTH).trim() + '...';
}

export async function GET() {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs') 
      .select('id, title, slug, source, company_logo_url, location, description, created_at, salary_range, job_type')
      .eq('active', true)
      .eq('approved', true) 
      .order('created_at', { ascending: false })
      .limit(MAX_JOBS); // 🆕 safety cap taake feed hamesha size-limit ke andar rahe

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

    let xmlItems = '';

    for (const job of jobs) {
      const jobUrl = `https://hireskys.com/jobs/${job.slug}`;
      const xmlLocation = job.location === "Remote (Global)" ? "United States" : job.location;
      const cleanDescription = cleanAndTruncateDescription(job.description); // 🆕

      const expireDate = new Date(job.created_at);
      expireDate.setDate(expireDate.getDate() + 60);

      const hasSalary = job.salary_range && job.salary_range !== 'Not Disclosed';

      xmlItems += `
  <job id="${job.id}">
    <link><![CDATA[${jobUrl}]]></link>
    <name><![CDATA[${job.title}]]></name>
    <region><![CDATA[${xmlLocation}]]></region>
    <description><![CDATA[${cleanDescription}]]></description>
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
