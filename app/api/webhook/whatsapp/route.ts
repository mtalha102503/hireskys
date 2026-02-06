import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // 👈 Direct Import for Admin Access
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ 1. Supabase Admin Setup (RLS Bypass)
// Ye zaroori hai taake bina login ke data fetch ho sake
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Koshish karo SERVICE_ROLE_KEY use karne ki, warna ANON KEY chalegi
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// ✅ Gemini Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
    }
});

// UltraMsg Config
const INSTANCE_ID = "instance157066";
const TOKEN = "kb3sifnes2k91g0b";

async function sendReply(to: string, text: string) {
    await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, to: to, body: text })
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.data || !body.data.body || !body.data.from) {
            return NextResponse.json({ message: "Invalid Webhook" });
        }

        const incomingMsg = body.data.body.trim(); 
        const rawPhone = body.data.from.replace('@c.us', ''); 

        // 👇 Command Check
        if (incomingMsg.toUpperCase().startsWith('CHECK ')) {
            
            const jobId = incomingMsg.split(' ')[1];

            await sendReply(rawPhone, "🔍 *HireSkys ATS* is analyzing your profile... Please wait.");

            // ⚡ 2. SMART USER FETCH (Fix for +92 issue)
            let user = null;
            
            // Try 1: Direct Number (e.g., 92300...)
            let { data: userRaw } = await supabaseAdmin
                .from('profiles')
                .select('username, skills, bio')
                .eq('whatsapp', rawPhone)
                .single();
            
            if (userRaw) {
                user = userRaw;
            } else {
                // Try 2: With Plus (e.g., +92300...)
                let { data: userPlus } = await supabaseAdmin
                    .from('profiles')
                    .select('username, skills, bio')
                    .eq('whatsapp', '+' + rawPhone)
                    .single();
                user = userPlus;
            }

            // 🛑 Agar dono tareeqon se nahi mila
            if (!user) {
                await sendReply(rawPhone, `❌ Error: Profile not found for ${rawPhone}. Please check your number in DB.`);
                return NextResponse.json({ success: true });
            }

            // 3️⃣ Fetch Job
            const { data: job } = await supabaseAdmin
                .from('jobs')
                .select('title, description, requirements') 
                .eq('id', jobId)
                .single();

            if (!job) {
                await sendReply(rawPhone, "❌ Error: Job ID not found.");
                return NextResponse.json({ success: true });
            }

            // Data Preparation
            const userProfile = `
            - Skills: ${user.skills ? user.skills.join(', ') : "None listed"}
            - Bio: ${user.bio || "Not provided"}
            `;
            
            const jobContext = `
            - Role: ${job.title}
            - Description: ${job.description ? job.description.substring(0, 8000) : "N/A"}
            `;

            // 4️⃣ Gemini Prompt
            const prompt = `
            You are "HireSkys ATS," an elite Technical Recruiter. 
            Evaluate candidate vs Job Description (JD).

            ⬇️ **JOB:**
            ${jobContext}
            
            👤 **CANDIDATE:**
            ${userProfile}

            **TASK:**
            1. Match Score (0-100%).
            2. Critical Missing Skills (Max 3).
            3. One high-impact tip.

            **OUTPUT FORMAT (For WhatsApp):**
            Use *Bold* and Emojis. No Markdown headers.
            Example:
            📊 *Match Score:* 78%
            🛑 *Missing:* Docker, AWS
            💡 *Tip:* Learn Docker basics.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const analysis = response.text();

            const finalMsg = `🤖 *HireSkys Professional Analysis*
            
${analysis}

────────────────────
📝 _Tip: Update your profile to improve score._`;

            await sendReply(rawPhone, finalMsg);
            
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: "Command not found" });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

