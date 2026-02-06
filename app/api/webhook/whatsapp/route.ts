import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI } from "@google/generative-ai"; 

// ✅ Gemini Configuration (Optimized for Logic)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // 2.5 abhi unstable ho skta hai, 1.5-flash production ready hai
    generationConfig: {
        temperature: 0.3, // Low temp = More logical/strict, Less creative
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
        const userPhone = body.data.from.replace('@c.us', ''); 

        // 👇 Command Check
        if (incomingMsg.toUpperCase().startsWith('CHECK ')) {
            
            const jobId = incomingMsg.split(' ')[1];

            await sendReply(userPhone, "🔍 *HireSkys ATS* is analyzing your profile against industry standards... Please wait.");

            // 2️⃣ Fetch Data
            // Tip: Agr user table me 'bio' ya 'experience' ka column hai to wo bhi select kro for better results
            const { data: user } = await supabase
                .from('profiles')
                .select('username, skills, bio') // Added bio if available
                .eq('whatsapp', userPhone)
                .single();

            const { data: job } = await supabase
                .from('jobs')
                .select('title, description, requirements') 
                .eq('id', jobId)
                .single();

            if (!user || !job) {
                await sendReply(userPhone, "❌ Error: Job ID or User Profile not found.");
                return NextResponse.json({ success: true });
            }

            // Data Preparation
            const userProfile = `
            - Skills: ${user.skills ? user.skills.join(', ') : "None listed"}
            - Bio/Summary: ${user.bio || "Not provided"}
            `;
            
            // ⚠️ BIG CHANGE: Limit removed/increased significantly
            const jobContext = `
            - Role: ${job.title}
            - Full Description: ${job.description ? job.description.substring(0, 10000) : "N/A"}
            `;

            // 3️⃣ PROFFESIONAL ATS PROMPT 🧠
            const prompt = `
            You are "HireSkys ATS," an elite Technical Recruiter and Resume Scanner. 
            Your goal is to evaluate a candidate strictly based on the provided Job Description (JD).

            🏆 **SCORING RUBRIC (Mental Sandbox):**
            - **90-100%:** Perfect match (All Must-Haves + Good-to-Haves).
            - **70-89%:** Strong match (Missing only minor tools/soft skills).
            - **50-69%:** Average (Has core skills but lacks specific framework/experience).
            - **<50%:** Weak match (Fundamental mismatch in tech stack or role).

            ⬇️ **INPUT DATA:**
            ${jobContext}
            
            👤 **CANDIDATE PROFILE:**
            ${userProfile}

            -----------------------------
            
            **YOUR TASK:**
            1. Analyze the semantic relevance of the candidate's skills vs. the JD.
            2. Identify the most critical "Hard Skills" missing from the candidate.
            3. Generate a strict score based on the Rubric above.
            4. Provide one specific, high-impact tip to increase their score.

            **OUTPUT FORMAT (Strictly for WhatsApp):**
            Don't use markdown headers (###). Use Bold (*) and Emojis.
            
            Example Output:
            📊 *Match Score:* 78%
            
            🛑 *Critical Missing:* Docker, AWS, GraphQL
            
            💡 *Recruiter Tip:* Your profile lists "Web Dev" but the job specifically demands "Next.js 14". Update your skills to be specific.
            
            (Now generate the response for the actual data above)
            `;

            // 4️⃣ Ask Gemini
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const analysis = response.text();

            // 5️⃣ Send Result
            const finalMsg = `🤖 *HireSkys Professional Analysis*
            
${analysis}

────────────────────
📝 _Tip: Update your profile using *UPDATE SKILLS* command to improve score._`;

            await sendReply(userPhone, finalMsg);
            
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: "Command not found" });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}