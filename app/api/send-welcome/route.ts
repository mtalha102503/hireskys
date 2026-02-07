import { NextResponse } from 'next/server';

// UltraMsg Config
const INSTANCE_ID = "instance157066";
const TOKEN = "kb3sifnes2k91g0b";

async function sendWhatsApp(to: string, username: string) {
    let cleanNumber = to.replace(/\D/g, ''); 
    const msg = `👋 *Welcome to HireSkys, ${username}!*

Thanks for joining. 🚀
Checking your profile for jobs...

⚠️ *IMPORTANT:*
Please *SAVE this number* in your contacts right now.
If you don't save it, you won't receive Job Alerts and Links.

Reply "Complete" once saved! ✅`;

    await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, to: cleanNumber, body: msg })
    });
}

// ✅ Ye Naya Hissa Hai (Browser Test ke liye)
export async function GET() {
    return NextResponse.json({ message: "System is Active & Running! 🚀" });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const secret = request.headers.get('x-secret-key');
        if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

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
