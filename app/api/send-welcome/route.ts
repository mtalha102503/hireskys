import { NextResponse } from 'next/server';

// UltraMsg Config
const INSTANCE_ID = "instance157066";
const TOKEN = "kb3sifnes2k91g0b";

async function sendWhatsApp(to: string, username: string) {
    // Number format clean karo (space ya dash hatao)
    let cleanNumber = to.replace(/\D/g, ''); 
    
    // Message Content
    const msg = `👋 *Welcome to HireSkys, ${username}!*

Thanks for joining. 🚀
Checking your profile for jobs...

⚠️ *IMPORTANT:*
Please *SAVE this number* in your contacts right now.
If you don't save it, you won't receive Job Alerts and Links.

Reply "YES" once saved! ✅`;

    await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, to: cleanNumber, body: msg })
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 🔒 Security Check (Koi aur ye link na use kare)
        const secret = request.headers.get('x-secret-key');
        if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Supabase Naya Data 'record' field me bhejta hai
        const newUser = body.record; 

        if (newUser && newUser.whatsapp) {
            console.log(`🚀 New User Detected: ${newUser.username}`);
            await sendWhatsApp(newUser.whatsapp, newUser.username || "User");
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Welcome Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}