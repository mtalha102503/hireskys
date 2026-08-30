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
};

export default nextConfig;
