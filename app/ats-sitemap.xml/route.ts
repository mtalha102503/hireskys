// ats.hireskys.com ki apni sitemap — sirf product ke public pages.
// middleware subdomain ki /sitemap.xml request ko yahan rewrite karta hai.
export function GET() {
  const urls: Array<{ loc: string; priority: string }> = [
    { loc: 'https://ats.hireskys.com/', priority: '1.0' },
    { loc: 'https://ats.hireskys.com/post-job', priority: '0.7' },
  ];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join('\n') +
    '\n</urlset>';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
