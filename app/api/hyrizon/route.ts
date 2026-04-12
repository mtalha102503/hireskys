import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

// 1. Groq Setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 2. Helper: Random Key Picker (Round Robin)
const getRandomKey = () => {
  const keysString = process.env.SERPER_KEYS;
  if (!keysString) return null;
  
  // String ko tod kar array banao aur spaces saf karo
  const keys = keysString.split(',').map(k => k.trim()).filter(k => k.length > 0);
  
  if (keys.length === 0) return null;

  // Randomly ek key pick karo
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
};

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log(`🤖 Hyrizon received: "${query}"`);

    let context = "";
    let searchSources = [];

    // --- 🌍 STEP 1: GOOGLE SEARCH (Using Rotating Keys) ---
    try {
        const apiKey = getRandomKey();

        if (!apiKey) {
            console.warn("⚠️ No SERPER_KEYS found in .env.local");
            throw new Error("API Keys missing");
        }

        // Debugging: Terminal me dikhayega konsi key use hui (last 4 chars)
        console.log(`🔑 Using Serper Key: ...${apiKey.slice(-4)}`); 

        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", apiKey);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "q": query,
            "num": 6 // Top 6 results layenge achi accuracy ke liye
        });

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const res = await fetch("https://google.serper.dev/search", requestOptions);
        
        if (!res.ok) {
            throw new Error(`Serper API Error: ${res.status}`);
        }

        const data = await res.json();

        if (data.organic && data.organic.length > 0) {
            // Context banayenge AI ke liye
            context = data.organic.map((r: any) => 
                `- Title: ${r.title}\n  Link: ${r.link}\n  Snippet: ${r.snippet}`
            ).join('\n\n');
            
            // Frontend ko bhejne ke liye sources (Sirf Title aur Link)
            searchSources = data.organic.slice(0, 4).map((r: any) => ({
                title: r.title,
                url: r.link
            }));
            
            console.log("✅ Google Search Successful");
        }
    } catch (searchError) {
        console.warn("⚠️ Search Failed (Switching to Internal Knowledge):", searchError);
        context = "Live search is currently unavailable. Please answer based on your internal knowledge and training.";
    }

    // --- 🧠 STEP 2: AI PROCESSING (Groq) ---
    const systemPrompt = `
      You are 'Hyrizon', the official AI Career Assistant for HireSkys.
      
      **YOUR GOAL:**
      Help users find jobs, understand salaries, and verify companies using real-time data.

      **LIVE GOOGLE RESULTS:**
      ${context}
      
      **USER QUESTION:** ${query}
      
      **INSTRUCTIONS:**
      1. **Answer First:** Give a direct answer to the user's question.
      2. **Use Context:** If the Google results are relevant, use them to back up your answer.
      3. **Cite Sources:** If you use a fact from the context, mention "According to [Source Name]..." naturally.
      4. **Be Professional:** Use Markdown (Bold, Lists) to make it readable.
      5. **No Hallucinations:** If you don't know and search failed, admit it honestly.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: systemPrompt }],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.5,
      max_tokens: 1000,
    });

    return NextResponse.json({ 
      answer: completion.choices[0].message.content,
      sources: searchSources 
    });

  } catch (error: any) {
    console.error("🔥 SERVER ERROR:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
