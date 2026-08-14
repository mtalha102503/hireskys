import type { Metadata } from "next";

// 🚀 POST A JOB SEO METADATA
export const metadata: Metadata = {
  title: "Post a Remote Job for Free",
  description: "Hire top-tier remote developers, designers, and tech professionals. Post your 100% remote or freelance job for free on HireSkys and reach thousands of verified candidates.",
  
  alternates: {
    canonical: '/post-job', 
  },
  
  keywords: [
    "Post remote job", 
    "Hire remote developers", 
    "Free job posting", 
    "HireSkys employers", 
    "Remote job board", 
    "Hire freelancers",
    "Post software engineering jobs"
  ],

  // 🌐 Social Sharing (Open Graph) - Jab link WhatsApp/LinkedIn par share hoga
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.hireskys.com/post-job",
    siteName: "HireSkys",
    title: "Hire Elite Remote Talent for Free 🚀",
    description: "Stop paying $200+ for job listings. Post your remote job on HireSkys for absolutely FREE and get matched with top global talent.",
    images: [
      {
        // Tip: Agar is page ke liye alag banner banaya hai toh uska naam yahan do,
        // warna tumhara main og-main.png use ho jayega.
        url: "/og-main.png", 
        width: 1200,
        height: 630,
        alt: "HireSkys Post a Job",
      },
    ],
  },

  // 🐦 Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Post a Remote Job for Free | HireSkys",
    description: "Post your remote job on HireSkys for absolutely FREE and get matched with top global talent.",
    images: ["/og-main.png"],
    creator: "@HireSkys",
    site: "@HireSkys",
  },
};

export default function PostJobLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}