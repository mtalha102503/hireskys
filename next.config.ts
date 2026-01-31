import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. Supabase Storage (Tumhara main DB)
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // 2. Jo Error abhi aaya (Logo Wine)
      {
        protocol: 'https',
        hostname: 'download.logo.wine',
      },
      // 3. 👇 SABSE IMPORTANT: Universal Fix (Recommended for Job Boards)
      // Kyunki companies ke logo kahin se bhi aa sakte hain (Google, LinkedIn, etc.)
      // Baar-baar error fix karne se bachne ke liye ye line add kar lo:
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
