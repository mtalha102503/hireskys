import { 
  Code, Smartphone, Video, Layout, Globe, Edit3, Cpu, 
  Briefcase, BarChart, Users, DollarSign, Headphones, 
  BookOpen, ShieldCheck, PenTool, Database, Speaker
} from 'lucide-react';

export const CATEGORIES = {
  // 1. Tech & Development
  "Development": {
    icon: Code,
    sub: [
      "React", 
      "Next.js", 
      "Node.js", 
      "Python", 
      "MERN Stack", 
      "WordPress", 
      "Shopify", 
      "Web3", 
      "Frontend", 
      "Backend", 
      "DevOps", 
      "Cybersecurity", 
      "QA Engineer",       // For professionals like Mesbahul
      "Automation Engineer", // Specific for coding testers
      "Game Dev"
    ]
  },
  "Mobile App": {
    icon: Smartphone,
    sub: ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin", "Ionic", "App Design"]
  },
  "AI & Machine Learning": { 
    icon: Cpu,
    sub: ["AI Engineer", "Machine Learning", "NLP", "Computer Vision", "Prompt Engineering", "Chatbot Dev", "TensorFlow", "OpenAI API", "Python Scripting"]
  },

  // 2. Creative & Design
  "Design & Creative": {
    icon: Layout,
    sub: ["UI/UX Design", "Graphic Design", "Logo Design", "Figma", "Adobe Photoshop", "Illustrator", "Packaging Design", "Presentation Design", "NFT Art"]
  },
  "Video & Animation": {
    icon: Video,
    sub: ["Video Editor", "Premiere Pro", "After Effects", "Motion Graphics", "3D Animation", "Thumbnail Artist", "Short Form (Reels/TikTok)", "VFX"]
  },
  "Audio & Voice": {
    icon: Speaker,
    sub: ["Voice Over", "Audio Engineering", "Podcast Editor", "Music Production", "Sound Design", "Mixing & Mastering"]
  },
  "Writing & Translation": {
    icon: Edit3,
    sub: ["Content Writer", "Copywriter", "Technical Writer", "Ghostwriter", "Proofreading", "Translation", "Scriptwriting", "Blog Writing", "Resume Writing"]
  },

  // 3. Marketing & Sales
  "Marketing & Sales": { 
    icon: Globe,
    sub: ["SEO", "Social Media Manager", "Facebook Ads", "Google Ads", "Email Marketing", "Lead Generation", "Sales Representative", "Cold Calling", "Affiliate Marketing", "Influencer Marketing"]
  },

  // 4. Business & Admin
  "Admin & Support": { 
    icon: Users, 
    sub: ["Virtual Assistant", "Data Entry", "Executive Assistant", "Research", "Project Management", "Transcription", "Spreadsheets (Excel/Google Sheets)"] 
  },
  "Customer Service": {
    icon: Headphones,
    sub: ["Customer Support", "Technical Support", "Community Manager", "Chat Support", "Call Center", "Zendesk"]
  },

  // 5. Professional Services
  "Finance & Accounting": {
    icon: DollarSign,
    sub: ["Accountant", "Bookkeeping", "Financial Analyst", "Tax Preparation", "QuickBooks", "Xero", "CFO", "Crypto Trading"]
  },
  "Legal & HR": {
    icon: ShieldCheck,
    sub: ["Legal Consultant", "Contract Law", "Paralegal", "Recruiter", "HR Manager", "Talent Acquisition"]
  },
  "Education & Coaching": {
    icon: BookOpen,
    sub: ["Online Tutor", "Course Creator", "Language Teacher", "Math Tutor", "Coding Mentor", "Fitness Coach", "Life Coach"]
  },
  
  // 6. Data & Engineering
  "Data Science & Analytics": {
    icon: BarChart,
    sub: ["Data Scientist", "Data Analyst", "Business Intelligence", "Power BI", "Tableau", "SQL", "Big Data", "Data Scraping"]
  },
  "Engineering & Architecture": {
    icon: PenTool,
    sub: ["CAD Designer", "3D Modeling", "Interior Design", "Mechanical Engineering", "Electrical Engineering", "AutoCAD", "SolidWorks"]
  }
};

// --- HELPER FUNCTION ---
export function getCategoryBySkill(skill: string) {
  for (const [category, data] of Object.entries(CATEGORIES)) {
    if ((data as any).sub.includes(skill)) return category;
  }
  return "General"; 
}

// --- JOB TYPES ---
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Temporary"];
