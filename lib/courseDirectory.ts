// lib/courseDirectory.ts

export type CourseDetail = {
    title: string;
    affiliateUrl: string; // Udemy Affiliate Link
    duration: string;
    badge?: string;
};

// 🚀 NAYA: Yeh function har special character (/, &, spaces, brackets) ko safe URL slug (-) mein badal dega
export function getSafeSlug(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // Special characters ko dash banao
        .replace(/^-+|-+$/g, '');    // Shuru aur aakhir se extra dash hatao
}

// 🚀 THE ULTIMATE 99% COVERAGE DIRECTORY (Keys ab 100% URL Safe Slugs hain)
export const courseDirectory: Record<string, CourseDetail> = {
    
    // ==========================================
    // 💻 1. DEVELOPMENT & IT (Highest Volume)
    // ==========================================
    "react": {title: "React: The Big Picture",affiliateUrl: "https://www.anrdoezrs.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Freact-18-big-picture",duration: "57m"},
    "next-js": { title: "Next.js 14: Foundations", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fnextjs-13-fundamentals", duration: "1h 32m"},
    "node-js": { title: "Build a REST API with Node and Express", affiliateUrl: "https://www.kqzyfj.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fbuild-a-rest-api-with-node-and-express", duration: "40m"},
    "python": { title: "Python Foundations", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fpython-foundations", duration: "2h 41m"},
    "mern-stack": { title: "React, NodeJS, Express & MongoDB - The MERN Fullstack Guide", affiliateUrl: "https://trk.udemy.com/L0ZjWa", duration: "18 Hours", badge: "Career Booster 🚀" },
    "wordpress": { title: "WordPress Administration", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fwordpress-administration", duration: "2h 2m"},
    "shopify": { title: "How To Become A Shopify Expert (From Zero To Hero !)", affiliateUrl: "https://trk.udemy.com/vDZ5mN", duration: "5 Hours", badge: "Bestseller 🔥" },
    "devops": { title: "DevOps Troubleshooting: Planning and Implementing a DevOps Strategy", affiliateUrl: "https://www.tkqlhce.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fdevops-foundations-planning-implementing-devops-strategy", duration: "1h 38m"},
    "frontend": { title: "Creating Micro-frontends with React", affiliateUrl: "https://www.tkqlhce.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fcreating-micro-frontends-react", duration: "1h 2m"},
    "backend": { title: "Certified Kubernetes Administrator: Kubernetes Foundations", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fcka-kubernetes-foundations-cert", duration: "42m"},
    "qa-engineer": { title: "Applying GenAI to Testing, QA, and Code Review", affiliateUrl: "https://www.kqzyfj.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fapplying-genai-testing-qa-code-review", duration: "1h 50m"},

    // ==========================================
    // 📱 2. MOBILE APP DEVELOPMENT
    // ==========================================
    "react-native": { title: "React Native: The Big Picture", affiliateUrl: "https://www.dpbolvw.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fbig-picture-react-native", duration: "1h 1m"},
    "flutter": { title: "Flutter Fundamentals", affiliateUrl: "https://www.dpbolvw.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fflutter-fundamentals", duration: "3h 43m"},
    "ios": { title: "iOS 14 Getting Started", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fios-14-fundamentals", duration: "4h 49m"},
    "android": { title: "Android with Kotlin: Fundamentals", affiliateUrl: "https://www.dpbolvw.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fandroid-kotlin-fundamentals", duration: "5h 44m"},

    // ==========================================
    // 🤖 3. AI & MACHINE LEARNING
    // ==========================================
    "machine-learning": { title: "Foundations of Machine Learning Engineering", affiliateUrl: "https://www.tkqlhce.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fmachine-learning-engineering-foundations", duration: "41m"},
    "prompt-engineering": { title: "Prompt Engineering for Claude", affiliateUrl: "https://www.kqzyfj.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fclaude-prompt-engineering", duration: "17m"},
    "computer-vision": { title: "Microsoft Azure AI Fundamentals (AI-900): Computer Vision Workloads on Azure", affiliateUrl: "https://www.anrdoezrs.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fmicrosoft-azure-ai-fundamentals-ai-900-computer-vision-workloads-on-azure", duration: "3h 51m"},

    // ==========================================
    // 🎨 4. DESIGN & CREATIVE
    // ==========================================
    "ui-ux-design": { title: "llustrator CC for UX Design", affiliateUrl: "https://www.anrdoezrs.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fillustrator-cc-ux-design", duration: "3h 56m"},
    "figma": { title: "Figma: Getting Started", affiliateUrl: "https://www.dpbolvw.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Ffigma-getting-started", duration: "1h 58m"},
    "graphic-design": { title: "Graphic Design Masterclass - Learn GREAT Design", affiliateUrl: "https://trk.udemy.com/NG65yq", duration: "31 Hours", badge: "Bestseller 🔥" },
    "adobe-photoshop": { title: "The Ultimate Adobe Photoshop CC Advanced Course - 2025 + AI", affiliateUrl: "https://trk.udemy.com/qW2Q6b", duration: "18 Hours", badge: "Top Rated ⭐" },

    // ==========================================
    // 🎬 5. VIDEO & ANIMATION
    // ==========================================
    "video-editor": { title: "Cinematic Video Generation with Seedance", affiliateUrl: "https://www.anrdoezrs.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fcinematic-video-generation-seedance", duration: "46m"},
    "premiere-pro": { title: "Adobe Premiere Pro Masterclass: Video Editing in Premiere", affiliateUrl: "https://trk.udemy.com/E0ZLvW", duration: "26 Hours", badge: "Bestseller 🔥" },
    "after-effects": { title: "After Effects CC - Animated Infographics & Data Visualization", affiliateUrl: "https://trk.udemy.com/MKNP3M", duration: "6 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },

    // ==========================================
    // ✍️ 6. WRITING & TRANSLATION
    // ==========================================
    "copywriter": { title: "The Complete Copywriting Course : Write to Sell Like a Pro", affiliateUrl: "https://trk.udemy.com/9VJma4", duration: "3 Hours", badge: "Bestseller 🔥" },
    "content writer": { title: "Level Up Your Fiction: 7 Game-Changing Writing Skills", affiliateUrl: "https://trk.udemy.com/qW2Qqg", duration: "5 Hours", badge: "Top Rated ⭐" },
    "seo": { title: "SEO Fundamentals", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Ffundamentals-seo", duration: "3h 50m"},

    // ==========================================
    // 📈 7. MARKETING & SALES
    // ==========================================
    "social-media-manager": { title: "Social Media Marketing Agency: Digital Marketing + Business", affiliateUrl: "https://trk.udemy.com/4aWzY3", duration: "56 Hours", badge: "Bestseller 🔥" },
    "facebook-ads": { title: "Facebook Ads & Facebook Marketing For Beginners 2026", affiliateUrl: "https://trk.udemy.com/jRON3Z", duration: "11 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },
    "google-ads": { title: "Ultimate Google Ads Training - Profit with Pay Per Click", affiliateUrl: "https://trk.udemy.com/ZVyo1z", duration: "35 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },
    "email-marketing": { title: "Writing Emails People Want to Read", affiliateUrl: "https://www.kqzyfj.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fwriting-emails-people-want-to-read", duration: "58m"},

    // ==========================================
    // 📊 8. DATA, ADMIN & BUSINESS
    // ==========================================
    "data-analyst": { title: "Up and Running with MongoDB for Data Analysts", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fmongodb-up-running-data-analysts", duration: "2h 18m" },
    "sql": { title: "Introduction to SQL", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fsql-introduction", duration: "15 min"},
    "power-bi": { title: "DAX Basics in Power BI", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fpower-bi-dax-basics", duration: "15 min" },
    "virtual-assistant": { title: "Building Successful Virtual Teams", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fbuilding-successful-virtual-teams", duration: "1h 48m"},
    "project-management": { title: "Beginner’s Guide to Project Management", affiliateUrl: "https://www.anrdoezrs.net/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fbeginners-guide-project-management", duration: "3h 35m"},
    "spreadsheets-excel-google-sheets": { title: "Excel Fundamentals", affiliateUrl: "https://www.kqzyfj.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fexcel-fundamentals", duration: "1h 8m"},
    "bookkeeping": { title: "Accounting & Bookkeeping Masterclass - Beginner to Advanced", affiliateUrl: "https://trk.udemy.com/R06ArR", duration: "20 Hours", badge: "Bestseller 🔥" },
    "quickbooks": { title: "QuickBooks Online Certification Course: Master Every Feature", affiliateUrl: "https://trk.udemy.com/L0ZjLo", duration: "39 Hours", badge: "Top Rated ⭐" },
    "customer-support": { title: "Customer Support Strategy", affiliateUrl: "https://www.tkqlhce.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fcustomer-support-strategy", duration: "35 min"},
    "technical-support": { title: "Technical Communication for Non-Technical Audiences", affiliateUrl: "https://www.jdoqocy.com/click-101825636-17152975?url=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Fprofdev-series-technical-communication-non-technical", duration: "54 min"},


};

export function getCourseForSkill(skillName: string): CourseDetail | null {
    if (!skillName) return null; 
    // 🚀 NAYA: Skill search hone se pehle khud hi safe slug mein badal jayegi
    const safeSlug = getSafeSlug(skillName);
    return courseDirectory[safeSlug] || null;
}