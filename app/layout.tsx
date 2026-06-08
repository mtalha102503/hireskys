import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from 'next/script';
import SupportChat from '@/components/SupportChat';
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import NextTopLoader from 'nextjs-toploader';
import { Jost } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";
import GoogleOneTap from "@/components/GoogleOneTap";
import { GoogleAnalytics } from '@next/third-parties/google';

// 🌟 FONT OPTIMIZATION
const jost = Jost({ subsets: ["latin"] });

// 🎨 VIEWPORT SETTINGS
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Thora margin de do taake zoom ho sake
  userScalable: true, // ✅ ISAY TRUE KAR DO
};

// 🚀 GLOBAL SEO SETTINGS
export const metadata: Metadata = {
  // 👇 Ye Base URL zaroori hai relative links ke liye
  metadataBase: new URL('https://www.hireskys.com'),

  alternates: {
    // 👇 FIX: Isay './' kar do. Ye automatic current page ka URL utha lega.
    canonical: './', 
    languages: {
      'en-US': '/en-US',
    },
  },
  
  title: {
    default: "HireSkys | #1 Remote Jobs & Freelance Marketplace",
    template: "%s | HireSkys", 
  },

  description: "Find verified high-paying remote jobs in Development, Design, AI, and Marketing. 100% Remote, No office politics.",
  
  category: "Employment",
  manifest: "/manifest.json",
  
  keywords: [
    "Remote Jobs", "Freelance Work", "Work from Home", 
    "Developer Jobs", "HireSkys", "Contract Jobs", 
    "Digital Nomad", "Worldwide Remote"
  ],

  authors: [{ name: "HireSkys Team", url: "https://www.hireskys.com" }],
  creator: "HireSkys Inc.",
  publisher: "HireSkys Inc.",
other: {
    "google-adsense-account": "ca-pub-7375069227835841"
  },
  // Social Sharing (Open Graph)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.hireskys.com",
    siteName: "HireSkys - Elite Remote Jobs",
    title: "HireSkys | The #1 Remote Jobs Marketplace",
    description: "Stop scrolling, start working. Find verified 100% remote jobs.",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "HireSkys Platform Preview",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "HireSkys - Remote Jobs Only",
    description: "The elite job radar for remote talent.",
    images: ["/og-main.png"],
    creator: "@HireSkys",
    site: "@HireSkys",
  },

  // Google Bot Settings
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", 
  },
  
  appleWebApp: {
    capable: true,
    title: "HireSkys",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HireSkys",
    "url": "https://www.hireskys.com",
    "logo": "https://www.hireskys.com/logo.png",
    "sameAs": [
      "https://twitter.com/hireskys",
      "https://linkedin.com/company/hireskys",
      "https://instagram.com/hireskys"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@hireskys.com",
      "contactType": "customer support",
      "areaServed": "Worldwide"
    }
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.className} min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7375069227835841"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
        <NextTopLoader 
          color="#6366f1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          showSpinner={false}
          shadow="0 0 10px #6366f1,0 0 5px #6366f1"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          
          <ConsentBanner />
          <SupportChat />
        </ThemeProvider>
        <GoogleOneTap />
        <GoogleAnalytics gaId="G-PZ6099S6LJ" />
      </body>
    </html>
  );
}
