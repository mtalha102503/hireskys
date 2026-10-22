import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 🔥 BAS YEH 1 LINE ADD KARNI HAI (Vercel limit fix)
    remotePatterns: [
      // 1. Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      // 2. Logo Wine
      {
        protocol: 'https',
        hostname: 'download.logo.wine',
      },
      // 3. Logo Dev
      {
        protocol: 'https',
        hostname: 'img.logo.dev',
      },
      // 4. Flag CDN
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      // 5. Universal Fix
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // www.hireskys.com/ats ab ATS ki purani copy hai — ATS ka asal ghar
  // ats.hireskys.com hai. Main domain ke /ats ko permanent (308)
  // subdomain par bhej do. Host condition ki wajah se ye redirect
  // sirf www/bare domain par lagega; ats host apna middleware
  // behaviour rakhega, aur baqi site bilkul untouched rahegi.
  async redirects() {
    return [
      {
        source: '/ats',
        has: [{ type: 'host', value: 'www.hireskys.com' }],
        destination: 'https://ats.hireskys.com',
        permanent: true,
      },
      {
        source: '/ats',
        has: [{ type: 'host', value: 'hireskys.com' }],
        destination: 'https://ats.hireskys.com',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
