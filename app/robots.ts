import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/', // Sab kuch allow karo, siwaye niche walon ke
      disallow: [
        '/api/',              // ❌ Backend APIs (Google ke kaam ki nahi)
        '/auth/',             // ❌ Login/Auth logic pages
        '/complete-profile/', // ❌ Ye user ka private setup step hai
        '/update-password/',  // ❌ Password reset page
        '/test/',             // ❌ Tumhare testing pages
        '/test-alert/',       // ❌ Testing pages
        '/*?tab=*',           // 🔥 YEH ADD KIYA HAI: Kisi bhi URL me ?tab= ho toh usay block kardo
      ],
    },
    sitemap: 'https://www.hireskys.com/sitemap.xml', // ✅ Map ka rasta dikhana zaroori hai
  };
}
