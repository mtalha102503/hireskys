import type { Metadata } from "next";
import { notFound } from "next/navigation"; 

// 🛑 Yeh rahi tumhari SAARI Skills ki list (Flattened & Lowercase)
const VALID_SKILLS = [
  // Development
  "react", "next.js", "node.js", "python", "shopify", "wordpress", "web3", "frontend", "backend",
  // Mobile App
  "react native", "flutter", "ios", "swift", "android", "kotlin",
  // Video & Motion
  "video editor", "premiere pro", "after effects", "3d artist", "thumbnail artist", "short form",
  // Design & UI
  "ui/ux", "figma", "web design", "logo design", "graphic design",
  // Marketing
  "seo", "facebook ads", "google ads", "email marketing", "copywriter", "growth",
  // Writing
  "ghostwriter", "technical writer", "scriptwriter", "content writer",
  // New Era (AI)
  "ai engineer", "automation", "llm", "python script"
];
// ✅ Update: Params ab Promise hai (Next.js 15/16 fix)
type Props = {
  params: Promise<{ skill: string }>;
};

// ---------------------------------------------------------
// 1️⃣ METADATA GENERATOR (The Heavy Lifter)
// ---------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 🛑 Step 1: Params ko Await karo
  const resolvedParams = await params;
  
  // Step 2: Skill cleaning
  const rawSkill = resolvedParams.skill;
  
  // Default Metadata (Safety Net)
  if (!rawSkill || rawSkill === "undefined") {
      return {
          title: "Skill Assessment | HireSkys",
          description: "Verify your coding skills with HireSkys assessments.",
          robots: { index: false, follow: false } // Agar skill nahi pata, to index mat karo
      };
  }

  const skillName = decodeURIComponent(rawSkill);
  const capitalizedSkill = skillName.charAt(0).toUpperCase() + skillName.slice(1);
  const pageUrl = `https://hireskys.com/test/${rawSkill}`; // Apna domain lagana

  return {
    // 🔥 1. Title & Description (Click-Through Rate Optimized)
    title: `${capitalizedSkill} Skill Test & Certification - Get Hired | HireSkys`,
    description: `Take the free ${capitalizedSkill} skill assessment on HireSkys. Prove your expertise, earn a verified certificate, and get fast-tracked to top remote jobs. Start now!`,
    
    // 🔥 2. Keywords (Semantic SEO)
    keywords: [
      `${capitalizedSkill} test`, 
      `${capitalizedSkill} certification`,
      `${capitalizedSkill} quiz`, 
      `${capitalizedSkill} interview questions`, 
      "skill assessment", 
      "developer certification",
      "hire developers",
      "remote job test",
      "programming quiz"
    ],

    // 🔥 3. Canonical URL (Duplicate Content Protection)
    alternates: {
      canonical: pageUrl,
    },

    // 🔥 4. Authors & Geo
    authors: [{ name: "HireSkys Team" }],
    category: "Education",
    applicationName: "HireSkys",

    // 🔥 5. OpenGraph (Facebook, LinkedIn, Discord)
    openGraph: {
      title: `Pass the ${capitalizedSkill} Test & Get Hired`,
      description: `I am taking the ${capitalizedSkill} assessment on HireSkys to verify my skills. Can you beat my score?`,
      url: pageUrl,
      siteName: 'HireSkys - Elite Job Radar',
      locale: 'en_US',
      type: "website",
      images: [
        {
          url: 'https://hireskys.com/og-test-card.png', // Ek general "Test" wali image bana kar public folder me daal dena
          width: 1200,
          height: 630,
          alt: `${capitalizedSkill} Assessment Badge`,
        },
      ],
    },

    // 🔥 6. Twitter Card (X.com)
    twitter: {
      card: 'summary_large_image',
      title: `${capitalizedSkill} Assessment - Verify Your Skills`,
      description: `Earn a verified ${capitalizedSkill} badge and unlock high-paying jobs on HireSkys.`,
      images: ['https://hireskys.com/og-test-card.png'],
    },

    // 🔥 7. Advanced Robots Control
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ---------------------------------------------------------
// 2️⃣ SCHEMA INJECTOR (Google Rich Results Logic)
// ---------------------------------------------------------
export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ skill: string }> }) {
  const resolvedParams = await params;
  
  // 1. URL se skill nikali (e.g., "React%20Native")
  // 2. Decode kiya ("React Native")
  // 3. Lowercase kiya ("react native") taake list se match kare
  const skillName = decodeURIComponent(resolvedParams.skill || "").toLowerCase();

  // 🛑 SECURITY CHECK: Agar skill tumhari list me nahi hai -> 404 Page
  if (!VALID_SKILLS.includes(skillName)) {
    notFound(); 
  }
  const capitalizedSkill = skillName.charAt(0).toUpperCase() + skillName.slice(1);

  // 🧠 Schema 1: Breadcrumb (Rasta dikhane ke liye)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://hireskys.com"
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "Assessments",
      "item": "https://hireskys.com/tests"
    }, {
      "@type": "ListItem",
      "position": 3,
      "name": `${capitalizedSkill} Test`
    }]
  };

  // 🧠 Schema 2: Course/Assessment (Education Signal)
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${capitalizedSkill} Professional Assessment`,
    "description": `A comprehensive skill test to verify proficiency in ${capitalizedSkill} for remote job applications.`,
    "provider": {
      "@type": "Organization",
      "name": "HireSkys",
      "sameAs": "https://hireskys.com"
    },
    "educationalCredentialAwarded": "Verified Skill Certificate",
    "isAccessibleForFree": true
  };

  return (
    <>
      {/* Schema Injection in Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      
      {/* Page Content */}
      {children}
    </>
  );
}