export const CATEGORIES = {
  "Development": { sub: ["React", "Next.js", "Node.js", "Python", "Shopify", "WordPress", "Web3", "Frontend", "Backend"] },
  "Mobile App": { sub: ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin"] },
  "Video & Motion": { sub: ["Video Editor", "Premiere Pro", "After Effects", "3D Artist", "Thumbnail Artist", "Short Form"] },
  "Design & UI": { sub: ["UI/UX", "Figma", "Web Design", "Logo Design", "Graphic Design"] },
  "Marketing": { sub: ["SEO", "Facebook Ads", "Google Ads", "Email Marketing", "Copywriter", "Growth"] },
  "Writing": { sub: ["Ghostwriter", "Technical Writer", "Scriptwriter", "Content Writer"] },
  "New Era (AI)": { sub: ["AI Engineer", "Automation", "LLM", "Python Script"] }
};

export function getCategoryBySkill(skill: string) {
  for (const [category, data] of Object.entries(CATEGORIES)) {
    if (data.sub.includes(skill)) return category;
  }
  return "General"; // Fallback
}