import type { Metadata } from "next";

// 🌟 ULTIMATE SEO METADATA
export const metadata: Metadata = {
  // 1. Title & Description (Direct & Helpful)
  title: "Frequently Asked Questions (FAQs) | HireSkys Support",
  description: "Have questions about HireSkys? Find answers about verified badges, remote job alerts, payments, and account security. We are here to help.",
  
  // 2. Keywords (Troubleshooting focus)
  keywords: [
    "HireSkys Help",
    "How to get verified on HireSkys",
    "HireSkys WhatsApp Alerts",
    "Is HireSkys Free",
    "Remote Job Scam Protection",
    "HireSkys Support",
    "Freelancer FAQ"
  ],

  // 3. Authorship
  authors: [{ name: "HireSkys Support Team", url: "https://www.hireskys.com/support" }],
  category: "Support",

  // 4. Canonical
  alternates: {
    canonical: "https://www.hireskys.com/faq",
  },

  // 5. Open Graph (Social Sharing)
  openGraph: {
    title: "HireSkys Help Center & FAQs",
    description: "Everything you need to know about finding remote jobs, skill verification, and instant alerts.",
    url: "https://www.hireskys.com/faq",
    siteName: "HireSkys",
    locale: "en_US",
    type: "website",
    images: [{
      url: "https://www.hireskys.com/og-faq.png", // Ek simple '?' mark ya support graphic bana lena
      width: 1200,
      height: 630,
      alt: "HireSkys FAQ & Help Center",
    }],
  },

  // 6. Robots (Snippet Optimization)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1, // Google ko bolo poora answer dikhaye
    },
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 🧠 SCHEMA 1: FAQPage (The Magic Schema) ✨
  // Ye wahi data hai jo tumhare page.tsx mein hai, lekin structured format mein Google ke liye.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What exactly is HireSkys?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "HireSkys is an elite job radar system that scans the internet for verified remote roles and sends them to your WhatsApp/Email instantly, unlike Upwork where you wait for clients."
        }
      },
      {
        "@type": "Question",
        "name": "Is HireSkys free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Creating a profile, taking skill assessments, and receiving standard job alerts via Email is 100% free."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get the Green Verified Badge?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To earn the badge, select a skill on your Profile and pass the assessment with a score of at least 9/10. This boosts visibility and enables Priority Alerts."
        }
      },
      {
        "@type": "Question",
        "name": "Why am I not receiving WhatsApp alerts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check if you entered your number with the correct Country Code, have verified skills matching open jobs, and ensure our number isn't blocked."
        }
      },
      {
        "@type": "Question",
        "name": "Does HireSkys take a commission?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We take 0% commission. You apply directly to the client and negotiate your own terms."
        }
      }
    ]
  };

  // 🧠 SCHEMA 2: BREADCRUMBS
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.hireskys.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": "https://www.hireskys.com/faq"
      }
    ]
  };

  return (
    <>
      {/* 💉 Inject Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Page Content */}
      {children}
    </>
  );

}
