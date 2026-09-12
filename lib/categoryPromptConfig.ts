// lib/categoryPromptConfig.ts
// Category-aware prompt builder for Mistral. Trained on HireSkys's full
// 15-category taxonomy so generated content sounds specific to each
// vertical instead of generic "remote job" filler.

export const CATEGORY_METADATA: Record<
  string,
  { sub: string[]; toneHint: string }
> = {
  "Development": {
    sub: ["React", "Next.js", "Node.js", "Python", "MERN Stack", "WordPress", "Shopify", "Web3", "Frontend", "Backend", "DevOps", "Cybersecurity", "QA Tester", "Game Dev"],
    toneHint: "Technical and precise. Mention specific stacks/frameworks, async collaboration across time zones, code review workflows, and how remote dev roles are usually evaluated (portfolio/GitHub, take-home tasks).",
  },
  "Mobile App": {
    sub: ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin", "Ionic", "App Design"],
    toneHint: "Technical, platform-aware. Mention cross-platform vs native trade-offs, App Store/Play Store release cycles, and portfolio apps as proof of skill.",
  },
  "AI & Machine Learning": {
    sub: ["AI Engineer", "Machine Learning", "NLP", "Computer Vision", "Prompt Engineering", "Chatbot Dev", "TensorFlow", "OpenAI API", "Python Scripting"],
    toneHint: "Forward-looking, technical but accessible. Mention the fast growth of AI hiring, importance of practical project experience over just theory, and common tools/frameworks.",
  },
  "Design & Creative": {
    sub: ["UI/UX Design", "Graphic Design", "Logo Design", "Figma", "Adobe Photoshop", "Illustrator", "Packaging Design", "Presentation Design", "NFT Art"],
    toneHint: "Visual, portfolio-first tone. Emphasize that a strong portfolio (Behance/Dribbble) matters more than formal credentials, and mention client communication skills for freelance-style remote design work.",
  },
  "Video & Animation": {
    sub: ["Video Editor", "Premiere Pro", "After Effects", "Motion Graphics", "3D Animation", "Thumbnail Artist", "Short Form (Reels/TikTok)", "VFX"],
    toneHint: "Energetic, creative tone. Mention short-form content demand (Reels/TikTok/YouTube Shorts), turnaround-time expectations, and showreel/portfolio importance.",
  },
  "Audio & Voice": {
    sub: ["Voice Over", "Audio Engineering", "Podcast Editor", "Music Production", "Sound Design", "Mixing & Mastering"],
    toneHint: "Craft-focused tone. Mention home studio setup basics, demo reels, and the growing podcast/audio content market.",
  },
  "Writing & Translation": {
    sub: ["Content Writer", "Copywriter", "Technical Writer", "Ghostwriter", "Proofreading", "Translation", "Scriptwriting", "Blog Writing", "Resume Writing"],
    toneHint: "Clear, well-written tone (this content itself should model good writing). Mention writing samples/portfolio, niche specialization, and SEO writing as a subskill.",
  },
  "Marketing & Sales": {
    sub: ["SEO", "Social Media Manager", "Facebook Ads", "Google Ads", "Email Marketing", "Lead Generation", "Sales Representative", "Cold Calling", "Affiliate Marketing", "Influencer Marketing"],
    toneHint: "Results/metrics-driven tone. Mention KPIs (traffic, conversion rate, CAC, commission structures for sales roles), and that many roles are performance/commission based.",
  },
  "Admin & Support": {
    sub: ["Virtual Assistant", "Data Entry", "Executive Assistant", "Research", "Project Management", "Transcription", "Spreadsheets (Excel/Google Sheets)"],
    toneHint: "Reliable, organized tone. Mention entry-friendliness for remote beginners, tool proficiency (Google Workspace, Notion, Trello/Asana), and trust/reliability as key hiring factors.",
  },
  "Customer Service": {
    sub: ["Customer Support", "Technical Support", "Community Manager", "Chat Support", "Call Center", "Zendesk"],
    toneHint: "Warm, service-oriented tone. Mention shift flexibility (often covers different time zones), communication skills, and common tools (Zendesk, Intercom).",
  },
  "Finance & Accounting": {
    sub: ["Accountant", "Bookkeeping", "Financial Analyst", "Tax Preparation", "QuickBooks", "Xero", "CFO", "Crypto Trading"],
    toneHint: "Precise, trust-driven tone. Mention certifications (CPA/ACCA where relevant), software proficiency (QuickBooks/Xero), and confidentiality/trust as key hiring factors.",
  },
  "Legal & HR": {
    sub: ["Legal Consultant", "Contract Law", "Paralegal", "Recruiter", "HR Manager", "Talent Acquisition"],
    toneHint: "Professional, compliance-aware tone. Mention jurisdiction-specific nuances for legal roles, and the growing demand for remote recruiters/HR as companies hire globally.",
  },
  "Education & Coaching": {
    sub: ["Online Tutor", "Course Creator", "Language Teacher", "Math Tutor", "Coding Mentor", "Fitness Coach", "Life Coach"],
    toneHint: "Encouraging, mentor-like tone. Mention platforms (Zoom, course platforms), subject-matter credibility, and flexible scheduling as a key benefit for this category.",
  },
  "Data Science & Analytics": {
    sub: ["Data Scientist", "Data Analyst", "Business Intelligence", "Power BI", "Tableau", "SQL", "Big Data", "Data Scraping"],
    toneHint: "Technical, analytical tone. Mention tool proficiency (SQL, Power BI/Tableau), the importance of a portfolio with real dashboards/case studies, and high demand across industries.",
  },
  "Engineering & Architecture": {
    sub: ["CAD Designer", "3D Modeling", "Interior Design", "Mechanical Engineering", "Electrical Engineering", "AutoCAD", "SolidWorks"],
    toneHint: "Precise, technical tone. Mention CAD/3D software proficiency, portfolio of technical drawings/models, and the niche nature of fully-remote engineering roles.",
  },
};

interface PromptParams {
  categoryName: string;      // must match a key in CATEGORY_METADATA
  subcategoryName?: string;  // e.g. "SEO" — omit for main category page
  jobCount: number;
}

export function buildCategoryContentPrompt({
  categoryName,
  subcategoryName,
  jobCount,
}: PromptParams): string {
  const meta = CATEGORY_METADATA[categoryName];
  if (!meta) {
    throw new Error(`Unknown category: ${categoryName}`);
  }

  const isSubcategory = Boolean(subcategoryName);
  const pageSubject = isSubcategory
    ? `${subcategoryName} (a specialization within ${categoryName})`
    : categoryName;
  const wordRange = isSubcategory ? "150-190" : "200-250";
  const relatedContext = isSubcategory
    ? `This is a subcategory page. Related skills within the broader "${categoryName}" category (for context only, do not list them verbatim): ${meta.sub.join(", ")}.`
    : `This category includes these specific roles/skills (mention 3-4 of them naturally in the intro, don't just list all of them): ${meta.sub.join(", ")}.`;

  return `You are an expert SEO content writer for HireSkys, a verified remote-only job board. You are writing original, human-quality content for a job category landing page — this content directly replaces "thin content" that previously got the site's AdSense application rejected, so it must read as genuinely useful, not templated filler.

PAGE SUBJECT: Remote ${pageSubject} Jobs
LIVE LISTING COUNT: ${jobCount}
TONE FOR THIS CATEGORY: ${meta.toneHint}
${relatedContext}

Write for a global audience of remote job seekers (with meaningful readership from Pakistan, India, Nigeria, and the Philippines) — professional but conversational, never robotic or keyword-stuffed.

Return ONLY valid JSON, no markdown fences, no preamble, in exactly this shape:
{
  "intro_text": "A ${wordRange} word original paragraph. Explain what remote ${pageSubject} jobs typically involve, what skills/tools are in demand, realistic salary expectations (general range, not fabricated precise figures), and why remote work suits this field. Weave in 3-4 relevant skills/tools naturally — do not just list them. Must not sound like it was copy-pasted from a template; write it as if a knowledgeable career expert wrote it specifically for this page.",
  "faqs": [
    { "q": "...", "a": "2-4 sentence answer" },
    { "q": "...", "a": "2-4 sentence answer" },
    { "q": "...", "a": "2-4 sentence answer" },
    { "q": "...", "a": "2-4 sentence answer" }
  ]
}

FAQ guidance:
- Question 1: always about typical salary/pay range for this role.
- Question 2: always about the top skills/qualifications needed.
- Question 3: always about how someone breaks into this role remotely (portfolio, certification, platform — pick what fits the category's toneHint).
- Question 4: one question that is genuinely specific to "${pageSubject}" and would NOT make sense for an unrelated category (this is the anti-duplicate-content check — it must be category-specific).

Do not mention "HireSkys has ${jobCount} jobs" inside the FAQ answers — that number is shown elsewhere on the page. Do not fabricate specific company names or exact salary figures — use realistic ranges/qualifiers instead (e.g. "typically ranges from X to Y depending on experience and region").`;
}
