import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import NextTopLoader from 'nextjs-toploader';
import { Jost } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";
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
  maximumScale: 1,
  // 👇 Mobile friendly additions
  userScalable: false, 
};

// 🚀 GLOBAL SEO SETTINGS
export const metadata: Metadata = {
  metadataBase: new URL('https://www.hireskys.com'),

  alternates: {
    canonical: '/', // Child pages khud override kar lenge
    languages: {
      'en-US': '/en-US',
    },
  },
  
  title: {
    default: "HireSkys | #1 Remote Jobs & Freelance Marketplace",
    template: "%s | HireSkys", // "React Jobs | HireSkys"
  },

  description: "Find verified high-paying remote jobs in Development, Design, AI, and Marketing. 100% Remote, No office politics.",
  
  // 👇 Category add kiya (Google ko help karta hai)
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
    apple: "/apple-touch-icon.png", // iOS Icon
  },
  
  // 👇 Apple Web App capability
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

  // 🏢 JSON-LD SCHEMAS (Array bana diya taake multiple schemas daal sakein)
  const jsonLd = [
    // 1. Organization Schema
    {
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
    },
    // 2. WebSite Schema (Sitelinks Search Box ke liye)
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "HireSkys",
      "url": "https://www.hireskys.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.hireskys.com/jobs?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      
      <body className={`${jost.className} min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white`}>
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            {/* Footer Global hai, isliye Child Layouts se hata dena agar wahan duplicate ho raha ho */}
            <Footer />
          </div>
          
          <ConsentBanner />
        </ThemeProvider>
        
        <GoogleAnalytics gaId="G-PZ6099S6LJ" />
      </body>
    </html>
  );
}
