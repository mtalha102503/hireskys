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
    "react": {title: "Modern React From The Beginning",affiliateUrl: "https://trk.udemy.com/Jkm1A7",duration: "26 Hours",badge: "Highly Demanded"},
    "next-js": { title: "Next.js 14 & React - The Complete Guide", affiliateUrl: "https://trk.udemy.com/X4X634", duration: "40 Hours", badge: "High Demand 💼" },
    "node-js": { title: "Node.js, Express, MongoDB & More: The Complete Bootcamp", affiliateUrl: "https://trk.udemy.com/1GWXOg", duration: "42 Hours", badge: "Bestseller 🔥" },
    "python": { title: "100 Days of Code: The Complete Python Pro Bootcamp", affiliateUrl: "https://trk.udemy.com/KBZVdy", duration: "56 Hours", badge: "Bestseller 🔥" },
    "mern-stack": { title: "React, NodeJS, Express & MongoDB - The MERN Fullstack Guide", affiliateUrl: "https://trk.udemy.com/L0ZjWa", duration: "18 Hours", badge: "Career Booster 🚀" },
    "wordpress": { title: "WordPress 2026: The Complete WordPress Website Course", affiliateUrl: "https://trk.udemy.com/9VJmrQ", duration: "22 Hours", badge: "Bestseller 🔥" },
    "shopify": { title: "How To Become A Shopify Expert (From Zero To Hero !)", affiliateUrl: "https://trk.udemy.com/vDZ5mN", duration: "5 Hours", badge: "Bestseller 🔥" },
    "devops": { title: "DevOps Beginners to Advanced with Projects", affiliateUrl: "https://trk.udemy.com/VO6Jdk", duration: "63 Hours", badge: "Bestseller 🔥" },
    "frontend": { title: "The Complete Full-Stack Web Development Bootcamp", affiliateUrl: "https://trk.udemy.com/qW2QGq", duration: "61 Hours", badge: "Bestseller 🔥" },
    "backend": { title: "Backend Master Class [Golang + Postgres + Kubernetes]", affiliateUrl: "https://trk.udemy.com/oNyxge", duration: "18 Hours", badge: "Bestseller 🔥" },
    "qa-engineer": { title: "Software Manual Testing - Complete course beginner to expert", affiliateUrl: "https://trk.udemy.com/4aWzxL", duration: "10 Hours", badge: "Bestseller 🔥" },

    // ==========================================
    // 📱 2. MOBILE APP DEVELOPMENT
    // ==========================================
    "react-native": { title: "The Complete React Native + Hooks Course", affiliateUrl: "https://trk.udemy.com/QY6av9", duration: "38 Hours", badge: "Top Rated ⭐" },
    "flutter": { title: "Flutter & Dart - The Complete Guide", affiliateUrl: "https://trk.udemy.com/enA356", duration: "30 Hours", badge: "Bestseller 🔥" },
    "ios": { title: "iOS & Swift - The Complete iOS App Development Bootcamp", affiliateUrl: "https://trk.udemy.com/ZVyov0", duration: "60 Hours", badge: "Bestseller 🔥" },
    "android": { title: "The Complete Android 14 & Kotlin Development Masterclass", affiliateUrl: "https://trk.udemy.com/KBZrGv", duration: "66 Hours", badge: "Bestseller 🔥" },

    // ==========================================
    // 🤖 3. AI & MACHINE LEARNING
    // ==========================================
    "machine-learning": { title: "Machine Learning A-Z [2026]: AI, AWS, Python & R + LLM Prize", affiliateUrl: "https://trk.udemy.com/Pz6egM", duration: "42 Hours", badge: "Bestseller 🔥" },
    "prompt-engineering": { title: "The Complete Prompt Engineering for AI Bootcamp (2026)", affiliateUrl: "https://trk.udemy.com/enA3Z1", duration: "22 Hours", badge: "Bestseller 🔥" },
    "computer-vision": { title: "Mastering Computer Vision: From Pixel to Detection to Gen-CV", affiliateUrl: "https://trk.udemy.com/bkm61g", duration: "57 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },

    // ==========================================
    // 🎨 4. DESIGN & CREATIVE
    // ==========================================
    "ui-ux-design": { title: "Complete Web & Mobile Designer in 2026: UI/UX, Figma", affiliateUrl: "https://trk.udemy.com/KBZV3A", duration: "25 Hours", badge: "Bestseller 🔥" },
    "figma": { title: "Figma UI UX Design Essentials", affiliateUrl: "https://trk.udemy.com/2RWo00", duration: "9 Hours", badge: "Bestseller 🔥" },
    "graphic-design": { title: "Graphic Design Masterclass - Learn GREAT Design", affiliateUrl: "https://trk.udemy.com/NG65yq", duration: "31 Hours", badge: "Bestseller 🔥" },
    "adobe-photoshop": { title: "The Ultimate Adobe Photoshop CC Advanced Course - 2025 + AI", affiliateUrl: "https://trk.udemy.com/qW2Q6b", duration: "18 Hours", badge: "Top Rated ⭐" },

    // ==========================================
    // 🎬 5. VIDEO & ANIMATION
    // ==========================================
    "video-editor": { title: "Video Editing in CapCut | Beginner to Pro | Desktop + Mobile", affiliateUrl: "https://trk.udemy.com/1GWXQD", duration: "3 Hours", badge: "Bestseller 🔥" },
    "premiere-pro": { title: "Adobe Premiere Pro Masterclass: Video Editing in Premiere", affiliateUrl: "https://trk.udemy.com/E0ZLvW", duration: "26 Hours", badge: "Bestseller 🔥" },
    "after-effects": { title: "After Effects CC - Animated Infographics & Data Visualization", affiliateUrl: "https://trk.udemy.com/MKNP3M", duration: "6 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },

    // ==========================================
    // ✍️ 6. WRITING & TRANSLATION
    // ==========================================
    "copywriter": { title: "The Complete Copywriting Course : Write to Sell Like a Pro", affiliateUrl: "https://trk.udemy.com/9VJma4", duration: "3 Hours", badge: "Bestseller 🔥" },
    "content writer": { title: "Level Up Your Fiction: 7 Game-Changing Writing Skills", affiliateUrl: "https://trk.udemy.com/qW2Qqg", duration: "5 Hours", badge: "Top Rated ⭐" },
    "seo": { title: "SEO 2026: Complete SEO Training + SEO for WordPress", affiliateUrl: "https://trk.udemy.com/Pz6oNX", duration: "14 Hours", badge: "Must Have 🎯" },

    // ==========================================
    // 📈 7. MARKETING & SALES
    // ==========================================
    "social-media-manager": { title: "Social Media Marketing Agency: Digital Marketing + Business", affiliateUrl: "https://trk.udemy.com/4aWzY3", duration: "56 Hours", badge: "Bestseller 🔥" },
    "facebook-ads": { title: "Facebook Ads & Facebook Marketing For Beginners 2026", affiliateUrl: "https://trk.udemy.com/jRON3Z", duration: "11 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },
    "google-ads": { title: "Ultimate Google Ads Training - Profit with Pay Per Click", affiliateUrl: "https://trk.udemy.com/ZVyo1z", duration: "35 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },
    "email-marketing": { title: "Email Marketing Masterclass: Start & Growth your Email List", affiliateUrl: "https://trk.udemy.com/bkm6zM", duration: "4 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },

    // ==========================================
    // 📊 8. DATA, ADMIN & BUSINESS
    // ==========================================
    "data-analyst": { title: "Complete Data Analyst Bootcamp From Basics To Advanced", affiliateUrl: "https://trk.udemy.com/NG65D1", duration: "88 Hours", badge: "Bestseller 🔥" },
    "sql": { title: "The Complete SQL Bootcamp: Go from Zero to Hero", affiliateUrl: "https://trk.udemy.com/DWkYGb", duration: "9 Hours", badge: "Bestseller 🔥" },
    "power-bi": { title: "Microsoft Power BI Desktop for Business Intelligence", affiliateUrl: "https://trk.udemy.com/xJNeaR", duration: "17 Hours", badge: "Bestseller 🔥" },
    "virtual-assistant": { title: "Must-Have Skills (Training) for Virtual Assistants", affiliateUrl: "https://trk.udemy.com/k4oyE3", duration: "5 Hours", badge: "Bestseller 🔥,Top Rated ⭐" },
    "project-management": { title: "The Project Management Course: Beginner to PROject Manager", affiliateUrl: "https://trk.udemy.com/B52NaW", duration: "8 Hours", badge: "Bestseller 🔥" },
    "spreadsheets-excel-google-sheets": { title: "Microsoft Excel - Excel from Beginner to Advanced", affiliateUrl: "https://trk.udemy.com/E0ZL1Q", duration: "22 Hours", badge: "Bestseller 🔥" },
    "bookkeeping": { title: "Accounting & Bookkeeping Masterclass - Beginner to Advanced", affiliateUrl: "https://trk.udemy.com/R06ArR", duration: "20 Hours", badge: "Bestseller 🔥" },
    "quickbooks": { title: "QuickBooks Online Certification Course: Master Every Feature", affiliateUrl: "https://trk.udemy.com/L0ZjLo", duration: "39 Hours", badge: "Top Rated ⭐" },
    "customer-support": { title: "Customer Service, Customer Support, And Customer Experience", affiliateUrl: "https://trk.udemy.com/R06A9R", duration: "5 Hours", badge: "Bestseller 🔥" },
    "technical-support": { title: "IT Support Technical Skills Bootcamp", affiliateUrl: "https://trk.udemy.com/DWkYoj", duration: "42 Hours", badge: "Bestseller 🔥" },


};

export function getCourseForSkill(skillName: string): CourseDetail | null {
    if (!skillName) return null; 
    // 🚀 NAYA: Skill search hone se pehle khud hi safe slug mein badal jayegi
    const safeSlug = getSafeSlug(skillName);
    return courseDirectory[safeSlug] || null;
}