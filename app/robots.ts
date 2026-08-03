import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 👇 Googlebot: bilkul unrestricted, koi delay nahi
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/complete-profile/',
          '/update-password/',
          '/test/',
          '/test-alert/',
          '/*?category=',
          '/*?location=',
          '/*?tag=',
          '/*?q=',
        ],
      },
      {
        // 👇 Bingbot bhi legitimate search engine hai — allow, thoda halka delay
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 2,
        disallow: [
          '/api/',
          '/auth/',
          '/complete-profile/',
          '/update-password/',
          '/test/',
          '/test-alert/',
          '/*?category=',
          '/*?location=',
          '/*?tag=',
          '/*?q=',
        ],
      },
      {
        // 👇 NAYA: AI chat/search assistants — bilkul unrestricted, koi delay nahi
        // (ChatGPT, Claude, Gemini, Perplexity waghera taake ye tumhari site AI answers mein dikha sakein)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'Google-Extended',
          'PerplexityBot',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/complete-profile/',
          '/update-password/',
          '/test/',
          '/test-alert/',
        ],
      },
      {
        // 👇 SEO-tool crawlers — block nahi, lekin 24-ghante ka gap majboor karo
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot', 'SiteAuditBot'],
        allow: '/',
        crawlDelay: 86400, // 👈 24 ghante (86400 seconds)
        disallow: [
          '/api/',
          '/auth/',
          '/complete-profile/',
          '/update-password/',
          '/test/',
          '/test-alert/',
        ],
      },
      {
        // 👇 Baaki sab (unknown/generic bots) — allow, 5-second gap
        userAgent: '*',
        allow: '/',
        crawlDelay: 5,
        disallow: [
          '/api/',
          '/auth/',
          '/complete-profile/',
          '/update-password/',
          '/test/',
          '/test-alert/',
          '/*?category=',
          '/*?location=',
          '/*?tag=',
          '/*?q=',
        ],
      },
    ],
    sitemap: 'https://www.hireskys.com/sitemap.xml',
  };
}
