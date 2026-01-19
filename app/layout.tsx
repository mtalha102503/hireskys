import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import { Jost } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";

// 🌟 FONT OPTIMIZATION (Variable setup for Tailwind)
const jost = Jost({ subsets: ["latin"] });

// 🎨 VIEWPORT SETTINGS (Theme Colors & Mobile Scaling)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" }, // Slate-50
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" }, // Dark Bg
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 🚀 GLOBAL SEO SETTINGS (Remote & Freelance Optimized)
export const metadata: Metadata = {
  metadataBase: new URL('https://www.hireskys.com'),

alternates: {
    canonical: './',
  },
  
  title: {
    default: "HireSkys | The #1 Remote Jobs & Freelance Marketplace",
    template: "%s | HireSkys Remote",
  },

  description: "Find high-paying remote jobs and freelance contracts. HireSkys is exclusively for 100% remote work in Development, Design, AI, and Marketing. No office politics, just work.",
manifest: "/manifest.json",
  keywords: [
    "Remote Jobs",
    "Freelance Work",
    "Work from Home",
    "Remote Developer Jobs",
    "HireSkys",
    "Contract Jobs",
    "Digital Nomad Jobs",
    "Verified Remote Jobs"
  ],

  authors: [{ name: "HireSkys Team", url: "https://hireskys.com" }],
  creator: "HireSkys",
  publisher: "HireSkys Inc.",

  // Social Sharing (Open Graph)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hireskys.com",
    siteName: "HireSkys",
    title: "HireSkys - Elite Remote & Freelance Jobs",
    description: "Stop scrolling, start working. Find verified 100% remote jobs and freelance gigs.",
    images: [
      {
        url: "/og-main.png", // Make sure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "HireSkys Remote Job Platform",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "HireSkys - Remote Jobs Only",
    description: "The elite job radar for remote talent. Verified gigs only.",
    images: ["/og-main.png"],
    creator: "@HireSkys",
  },

  // Google Bot Settings
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Search Console Verification (Optional - Future ke liye)
  verification: {
    google: "yahan-google-verification-code-daal-dena",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 🏢 JSON-LD SCHEMA (Google ko batane ke liye ke hum kaun hain)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HireSkys",
    "url": "https://hireskys.com",
    "logo": "https://hireskys.com/logo.png",
    "sameAs": [
      "https://twitter.com/hireskys",
      "https://linkedin.com/company/hireskys"
    ],
    "description": "A dedicated marketplace for 100% remote jobs and freelance contracts.",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@hireskys.com",
      "contactType": "customer support"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Schema Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      
      <body className={`${jost.className} min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Main Content Wrapper to ensure Footer stays at bottom */}
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
