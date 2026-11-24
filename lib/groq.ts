// Groq via plain REST fetch (OpenAI-compatible endpoint) — groq-sdk ki jagah.
export async function groqChat(opts: {
  apiKey: string;
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
      ...(opts.max_tokens !== undefined ? { max_tokens: opts.max_tokens } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}
