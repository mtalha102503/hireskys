// ats.hireskys.com ki apni robots.txt —
// middleware subdomain ki /robots.txt request ko yahan rewrite karta hai.
// Asal site ki robots.txt bilkul alag aur mehfooz rehti hai.
export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /employer/',
    'Disallow: /admin/',
    'Disallow: /auth/',
    '',
    'Sitemap: https://ats.hireskys.com/sitemap.xml',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
