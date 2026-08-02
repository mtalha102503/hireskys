import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from 'next/script';
import ConditionalChat from '@/components/ConditionalChat';
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import NextTopLoader from 'nextjs-toploader';
import { Jost } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";
import MoneytizerStickyFooter from "@/components/MoneytizerStickyFooter";
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
    default: "HireSkys | #1 Remote Jobs Marketplace",
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
    "logo": "https://www.hireskys.com/logo1.png",
    "sameAs": [
      "https://twitter.com/hireskys",
      "https://www.linkedin.com/in/muhammad-talha-9a35a53a8",
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
<head>
  <Script id="inmobi-choice-cmp" strategy="beforeInteractive">
    {`
      (function() {
        var host = "www.themoneytizer.com";
        var element = document.createElement('script');
        var firstScript = document.getElementsByTagName('script')[0];
        var url = 'https://cmp.inmobi.com'
          .concat('/choice/', '6Fv0cGNfc_bw8', '/', host, '/choice.js?tag_version=V3');
        var uspTries = 0;
        var uspTriesLimit = 3;
        element.async = true;
        element.type = 'text/javascript';
        element.src = url;

        // Next.js Fallback: Taake script hamesha safely inject ho
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(element, firstScript);
        } else {
          document.head.appendChild(element);
        }

        function makeStub() {
          var TCF_LOCATOR_NAME = '__tcfapiLocator';
          var queue = [];
          var win = window;
          var cmpFrame;

          function addFrame() {
            var doc = win.document;
            var otherCMP = !!(win.frames[TCF_LOCATOR_NAME]);

            if (!otherCMP) {
              if (doc.body) {
                var iframe = doc.createElement('iframe');

                iframe.style.cssText = 'display:none';
                iframe.name = TCF_LOCATOR_NAME;
                doc.body.appendChild(iframe);
              } else {
                setTimeout(addFrame, 5);
              }
            }
            return !otherCMP;
          }

          function tcfAPIHandler() {
            var gdprApplies;
            var args = arguments;

            if (!args.length) {
              return queue;
            } else if (args[0] === 'setGdprApplies') {
              if (
                args.length > 3 &&
                args[2] === 2 &&
                typeof args[3] === 'boolean'
              ) {
                gdprApplies = args[3];
                if (typeof args[2] === 'function') {
                  args[2]('set', true);
                }
              }
            } else if (args[0] === 'ping') {
              var retr = {
                gdprApplies: gdprApplies,
                cmpLoaded: false,
                cmpStatus: 'stub'
              };

              if (typeof args[2] === 'function') {
                args[2](retr);
              }
            } else {
              if(args[0] === 'init' && typeof args[3] === 'object') {
                args[3] = Object.assign(args[3], { tag_version: 'V3' });
              }
              queue.push(args);
            }
          }

          function postMessageEventHandler(event) {
            var msgIsString = typeof event.data === 'string';
            var json = {};

            try {
              if (msgIsString) {
                json = JSON.parse(event.data);
              } else {
                json = event.data;
              }
            } catch (ignore) {}

            var payload = json.__tcfapiCall;

            if (payload) {
              window.__tcfapi(
                payload.command,
                payload.version,
                function(retValue, success) {
                  var returnMsg = {
                    __tcfapiReturn: {
                      returnValue: retValue,
                      success: success,
                      callId: payload.callId
                    }
                  };
                  if (msgIsString) {
                    returnMsg = JSON.stringify(returnMsg);
                  }
                  if (event && event.source && event.source.postMessage) {
                    event.source.postMessage(returnMsg, '*');
                  }
                },
                payload.parameter
              );
            }
          }

          while (win) {
            try {
              if (win.frames[TCF_LOCATOR_NAME]) {
                cmpFrame = win;
                break;
              }
            } catch (ignore) {}

            if (win === window.top) {
              break;
            }
            win = win.parent;
          }
          if (!cmpFrame) {
            addFrame();
            win.__tcfapi = tcfAPIHandler;
            win.addEventListener('message', postMessageEventHandler, false);
          }
        };

        makeStub();

        var uspStubFunction = function() {
          var arg = arguments;
          if (typeof window.__uspapi !== uspStubFunction) {
            setTimeout(function() {
              if (typeof window.__uspapi !== 'undefined') {
                window.__uspapi.apply(window.__uspapi, arg);
              }
            }, 500);
          }
        };

        var checkIfUspIsReady = function() {
          uspTries++;
          if (window.__uspapi === uspStubFunction && uspTries < uspTriesLimit) {
            console.warn('USP is not accessible');
          } else {
            clearInterval(uspInterval);
          }
        };

        if (typeof window.__uspapi === 'undefined') {
          window.__uspapi = uspStubFunction;
          var uspInterval = setInterval(checkIfUspIsReady, 6000);
        }
      })();
    `}
  </Script>
</head>
      <body className={`${jost.className} min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <div className="flex flex-col min-h-screen pb-[60px] md:pb-[100px] relative">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <ConsentBanner />
          <ConditionalChat />
          <MoneytizerStickyFooter/>
        </ThemeProvider>
        <GoogleOneTap />
        <GoogleAnalytics gaId="G-PZ6099S6LJ" />
      </body>
    </html>
  );
}
