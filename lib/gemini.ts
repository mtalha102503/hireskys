// Gemini via plain REST fetch — @google/generative-ai SDK ki jagah (bundle slim).
// Same models, same prompts; sirf transport badla hai.
export async function geminiGenerate(opts: {
  apiKey: string;
  model: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const generationConfig: Record<string, number> = {};
  if (opts.temperature !== undefined) generationConfig.temperature = opts.temperature;
  if (opts.maxOutputTokens !== undefined) generationConfig.maxOutputTokens = opts.maxOutputTokens;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${encodeURIComponent(opts.apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: opts.prompt }] }],
        ...(Object.keys(generationConfig).length ? { generationConfig } : {}),
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  return parts.map((part: any) => part.text || '').join('');
}
