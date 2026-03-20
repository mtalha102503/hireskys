import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Apna supabase path check kar lena

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Check karo ke Telegram ne koi message bheja hai?
        if (body.message && body.message.text) {
            const chatId = body.message.chat.id;
            const text = body.message.text;

            // 2. Check karo ke message "/start" se shuru ho raha hai? 
            // (Magic link format: /start user_12345)
            if (text.startsWith('/start ')) {
                // "user_12345" nikal lo
                const userId = text.replace('/start ', '').trim(); 

                // 3. Supabase mein is user ke aagay Chat ID save kar do
                const { error } = await supabase
                    .from('profiles')
                    .update({ telegram_chat_id: chatId.toString() })
                    .eq('id', userId); // Ensure karo ke tumhari table ka primary key 'id' hai

                if (!error) {
                    // 4. User ko pyara sa Welcome Message bhej do
                    const botToken = process.env.TELEGRAM_BOT_TOKEN;
                    const welcomeMsg = "✅ *Account Successfully Linked!*\n\nWelcome to HireSkys Alerts! 🚀 \n\nYou will now receive instant, personalized remote job notifications directly in this chat. Get ready to land your dream role. Stay tuned!";
                    
                    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            chat_id: chatId, 
                            text: welcomeMsg,
                            parse_mode: 'Markdown'
                        })
                    });
                } else {
                    console.error("❌ Supabase Update Error:", error);
                }
            }
        }

        // Telegram ko 200 OK bhejna zaroori hai taake usay tasalli ho jaye
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("🚨 Webhook Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
