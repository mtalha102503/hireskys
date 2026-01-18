import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';

// --- CONFIGURATION ---
const INSTANCE_ID = "instance157066";
const TOKEN = "kb3sifnes2k91g0b";

// --- EMAIL SETUP ---
const EMAIL_USER = "realonlinejobs56@gmail.com";
const EMAIL_PASS = "gntwovruriemixbh";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // 👈 Direct Host
    port: 465,              // 👈 Secure Port
    secure: true,           // 👈 SSL ON
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    tls: {
        // 👇 Ye zaroori hai localhost par "Socket Error" bachane ke liye
        rejectUnauthorized: false 
    }
});
// --- HELPER: SMART NUMBER FORMATTER ---
function formatPhoneNumber(phone: string) {
    if (!phone) return null;

    // 1. Remove all non-digits (Space, +, -, brackets sab hata do)
    // Example: "+1 (555) 123-4567"  => "15551234567" (Perfect for UltraMsg)
    let cleanNumber = phone.replace(/\D/g, ''); 

    // 2. Handle International Prefix "00" (e.g., 0092... -> 92...)
    if (cleanNumber.startsWith('00')) {
        cleanNumber = cleanNumber.substring(2);
    }

    // 3. Handle Pakistan Local Format (03xx -> 923xx)
    // Ye check zaroori hai kyunki Pakistani users aksar +92 nahi likhte
    if (cleanNumber.startsWith('03') && cleanNumber.length === 11) {
        cleanNumber = '92' + cleanNumber.substring(1);
    }

    // Note: Agar user kisi aur country ka local format bina code ke likhega (e.g. 050...), 
    // to hum kuch nahi kar sakte jab tak frontend pe country dropdown na ho.
    // Lekin agar wo +Code likhega, to Step 1 usay handle kar lega.

    return cleanNumber;
}

// --- 📱 WHATSAPP SENDER (With Full Proposal) ---
async function sendWhatsApp(to: string, job: any, username: string) {
    const formattedNumber = formatPhoneNumber(to);
    if (!formattedNumber) return;

    // 👇 Pura Professional Proposal Text Format Mein
    const proposalText = `Hi Hiring Team,

I came across your opening for the *${job.title}* position on ${job.source} and wanted to express my interest.

I am a skilled professional registered on HireSkys 🚀. You can view my portfolio & skills here:
👉 https://hireskys.com/p/${username}

I am available to discuss how my skills align with your goals.

Best regards,
[Your Name]`;

    // Final Message Construction
    const msg = `🚀 *HireSkys New Job Alert!*
    
💼 *Role:* ${job.title}
💰 *Pay:* ${job.salary_range || "Not specified"}
📍 *Location:* ${job.location || "Remote"}
source: ${job.source}

👇 *COPY & PASTE THIS PROPOSAL:*
---------------------------------
${proposalText}
---------------------------------

🔗 *APPLY HERE:* ${job.link}
    
_Reply STOP to unsubscribe_`;

    try {
        const url = `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: TOKEN, to: formattedNumber, body: msg })
        });
        console.log("✅ WhatsApp Sent!");
    } catch (error: any) {
        console.error("❌ WhatsApp Error:", error.message);
    }
}

// --- 📧 EMAIL SENDER (Updated Text) ---
async function sendEmail(to: string, job: any, username: string) {
    try {
        console.log(`📧 Sending Email to ${to}...`);
        
        // 👇 UPDATED PROPOSAL TEXT (Generic - Sabke liye safe)
        const proposalBody = `Hi Hiring Team,

I came across your opening for the **${job.title}** position on ${job.source} and wanted to express my interest.

I am a skilled professional registered on HireSkys 🚀. You can view my portfolio & skills here:
👉 https://hireskys.com/p/${username}

I am available to discuss how my skills align with your goals.

Best regards,
[Your Name]`;

        // ... (Baki ka mailOptions code same rahega) ...

        const mailOptions = {
            from: `"HireSkys Job Radar" <${EMAIL_USER}>`,
            to: to,
            subject: `🔥 Match Found: ${job.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: white;">
                        <h2 style="margin: 0;">🚀 Verified Job Alert</h2>
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="color: #1e293b;">${job.title}</h3>
                        <p><strong>Source:</strong> ${job.source} | <strong>Pay:</strong> ${job.salary_range || 'N/A'}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                        <p style="color: #4f46e5; font-weight: bold;">👇 COPY THIS PROPOSAL:</p>
                        <div style="background-color: #f8fafc; border: 1px dashed #4f46e5; padding: 15px; border-radius: 8px; color: #333; white-space: pre-wrap;">${proposalBody}</div>

                        <br>
                        <div style="text-align: center;">
                            <a href="${job.link}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Apply Now</a>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent Successfully!");

    } catch (error: any) {
        console.error("❌ Email Error:", error.message);
    }
}

// --- MAIN API HANDLER ---
export async function POST(request: Request) {
    try {
        const job = await request.json();
        const jobTitle = job.title;
        console.log(`\n🔎 Processing Job: "${jobTitle}"`);

        // Fetch Candidates with WhatsApp
        const { data: candidates, error } = await supabase
            .from('profiles')
            .select('*, user_skills(*)')
            .not('whatsapp', 'is', null); // Sirf unhein jinka WhatsApp hai

        if (error || !candidates) return NextResponse.json({ error: error?.message }, { status: 500 });

        let alertsSent = 0;
        
        // ... (Upar ka code same rahega)

        for (const user of candidates) {
            // 1. Skill Matching Logic (Ye Rehne do, zaroori hai)
            const hasTag = user.skills?.some((s: string) => jobTitle.toLowerCase().includes(s.toLowerCase()));
            const hasRatedSkill = user.user_skills?.some((s: any) => jobTitle.toLowerCase().includes(s.skill_name.toLowerCase()));

            // 👇 AB SIRF SKILL MATCH CHECK HOGA, SCORE/VERIFICATION NAHI
            if (hasTag || hasRatedSkill) {
                
                // Alert Count badhao
                alertsSent++;

                // 2. Send WhatsApp (Sabko bhejo)
                // Note: User verified ho ya na ho, usay alert milega
                await sendWhatsApp(user.whatsapp, job, user.username);

                // 3. Send Email (Optional Fallback)
                if (user.email) await sendEmail(user.email, job, user.username);
            }
        }
        
        // ... (Neeche ka code same rahega)

        return NextResponse.json({ success: true, alerts: alertsSent });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}
