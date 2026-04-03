import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// 🟢 XML mein &, <, > jese symbols error dete hain, isliye unhe "Escape" karna zaroori hai
function escapeXml(unsafeString: string) {
  if (!unsafeString) return '';
  return unsafeString.replace(/[<>&'"]/g, function (c) {
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
    // 1. Supabase se sirf wo companies fetch karo jinki video mojood hai
    const { data: companies, error } = await supabase
      .from('companies')
      .select('slug, name, description, promo_video_url, created_at')
      .not('promo_video_url', 'is', null)
      .neq('promo_video_url', 'Not Found');

    if (error) throw error;

    // 2. Standard Google Video Sitemap ka structure start karo
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

    // 3. Har company ke liye ek <url> block banao
    companies?.forEach((company) => {
      // Wahi smart YouTube ID Extractor
      const match = company.promo_video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
      const videoId = match ? match[1] : null;

      if (videoId) {
        const pageUrl = `https://www.hireskys.com/companies/${company.slug}`;
        const title = `${company.name} Remote Work Culture & Office Tour`;
        const desc = company.description 
            ? company.description.slice(0, 200) + '...' // 200 characters tak limit kiya
            : `Explore ${company.name}'s remote work environment and culture on HireSkys.`;
        
        xml += `  <url>\n`;
        xml += `    <loc>${escapeXml(pageUrl)}</loc>\n`;
        xml += `    <video:video>\n`;
        xml += `      <video:thumbnail_loc>https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg</video:thumbnail_loc>\n`;
        xml += `      <video:title>${escapeXml(title)}</video:title>\n`;
        xml += `      <video:description>${escapeXml(desc)}</video:description>\n`;
        xml += `      <video:player_loc>https://www.youtube.com/embed/${videoId}</video:player_loc>\n`;
        xml += `      <video:publication_date>${company.created_at || new Date().toISOString()}</video:publication_date>\n`;
        xml += `    </video:video>\n`;
        xml += `  </url>\n`;
      }
    });

    xml += `</urlset>`;

    // 4. Response ko as XML bhejo aur Cache kar lo taake Database par load na pare
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml',
        // 24 hours ki cache (86400 seconds)
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
      },
    });

  } catch (error) {
    console.error('Error generating video sitemap:', error);
    return new NextResponse('Error generating video sitemap', { status: 500 });
  }
}