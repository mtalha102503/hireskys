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

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Security Check
        const secret = request.headers.get('x-secret-key');
        if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { type, record, old_record } = body;
        
        // 🕵️ LOGIC: Message kab bhejna hai?
        let shouldSend = false;

        // Case 1: Agar Insert hua aur direct number ke sath aaya (Rare case)
        if (type === 'INSERT' && record.whatsapp) {
            shouldSend = true;
        }
        
        // Case 2: Agar Update hua (Matlab user ne profile complete ki)
        // Hum check karenge: Pehle number nahi tha (null/empty), aur AB hai.
        else if (type === 'UPDATE') {
            const oldPhone = old_record?.whatsapp;
            const newPhone = record?.whatsapp;

            // Agar pehle phone nahi tha, aur ab aa gaya hai -> WELCOME BHEJO!
            if (!oldPhone && newPhone) {
                shouldSend = true;
            }
        }

        if (shouldSend) {
            console.log(`🚀 Sending Welcome to: ${record.username}`);
            await sendWhatsApp(record.whatsapp, record.username || "User");
            return NextResponse.json({ success: true, message: "Welcome Sent" });
        } else {
            return NextResponse.json({ success: false, message: "No Condition Met (Maybe already had phone or no phone provided)" });
        }

    } catch (error: any) {
        console.error("Welcome Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
