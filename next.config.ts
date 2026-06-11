import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
  // 👇 YEH DONO NAYE ADD KARNE HAIN 👇
  {
    protocol: 'https',
    hostname: 'img.logo.dev',
  },
  {
    protocol: 'https',
    hostname: 'flagcdn.com',
  },
  // 3. Universal Fix (isko rehne de sakte ho fallback ke liye)
  {
    protocol: 'https',
    hostname: '**',
  },
],
  },
};

export default nextConfig;
