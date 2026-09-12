// lib/generateCategoryContent.ts
// Generates SEO intro text + FAQs for a category page using Mistral,
// caches result in Supabase so we don't call the API on every request.

import { createClient } from "@supabase/supabase-js";
import { buildCategoryContentPrompt, CATEGORY_METADATA } from "./categoryPromptConfig";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only, never expose client-side
);

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY!;
const STALE_AFTER_DAYS = 30;
const MODEL_NAME = "mistral-small-latest";

interface CategoryContent {
  intro_text: string;
  faqs: { q: string; a: string }[];
}

interface CachedRow extends CategoryContent {
  generated_at: string;
  generated_by: string;
}

export async function getCategoryContent(
  categoryName: string,       // must match a CATEGORY_METADATA key, e.g. "Marketing & Sales"
  subcategoryName: string | null, // e.g. "SEO", or null for a main category page
  slug: string,                // e.g. "marketing-sales" or "marketing-sales/seo"
  jobCount: number
): Promise<CategoryContent> {
  // 1. Try cache first
  const { data: cached } = await supabase
    .from("category_content")
    .select("intro_text, faqs, generated_at, generated_by")
    .eq("slug", slug)
    .single<CachedRow>();

  if (cached) {
    const ageDays =
      (Date.now() - new Date(cached.generated_at).getTime()) / 86_400_000;
    const sameModel = cached.generated_by === MODEL_NAME;
    if (ageDays < STALE_AFTER_DAYS && sameModel) {
      return { intro_text: cached.intro_text, faqs: cached.faqs };
    }
  }

  // 2. Generate fresh content via Mistral using the trained prompt builder
  const content = await generateWithMistral(categoryName, subcategoryName, jobCount);

  // 3. Upsert into cache
  const relatedSkills = CATEGORY_METADATA[categoryName]?.sub ?? [];
  await supabase.from("category_content").upsert({
    slug,
    category_name: categoryName,
    subcategory_name: subcategoryName,
    intro_text: content.intro_text,
    faqs: content.faqs,
    related_skills: relatedSkills,
    generated_by: MODEL_NAME,
    generated_at: new Date().toISOString(),
  });

  return content;
}

async function generateWithMistral(
  categoryName: string,
  subcategoryName: string | null,
  jobCount: number
): Promise<CategoryContent> {
  const prompt = buildCategoryContentPrompt({
    categoryName,
    subcategoryName: subcategoryName ?? undefined,
    jobCount,
  });

  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`Mistral API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const raw = data.choices[0].message.content;
  const pageSubject = subcategoryName ?? categoryName;

  try {
    return JSON.parse(raw) as CategoryContent;
  } catch {
    // Fallback so page never breaks if Mistral returns malformed JSON
    return {
      intro_text: `Explore the latest remote ${pageSubject} jobs on HireSkys — ${jobCount}+ verified listings updated daily from companies hiring remote talent worldwide.`,
      faqs: [],
    };
  }
}
