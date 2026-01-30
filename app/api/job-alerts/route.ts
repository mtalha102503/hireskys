import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';
import { createSlug } from '@/lib/utils'; 

// --- CONFIGURATION ---
const INSTANCE_ID = "instance157066";
const TOKEN = "kb3sifnes2k91g0b";
const EMAIL_USER = "realonlinejobs56@gmail.com";
const EMAIL_PASS = "gntwovruriemixbh";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    tls: { rejectUnauthorized: false }
});

// --- HELPERS ---
function createJobLink(title: string, id: any) {
    if (!title || !id) return "https://www.hireskys.com";
    const slug = createSlug(title, id);
    return `https://www.hireskys.com/jobs/${slug}`;
}

function formatPhoneNumber(phone: string) {
    if (!phone) return null;
    let cleanNumber = phone.replace(/\D/g, ''); 
    if (cleanNumber.startsWith('00')) cleanNumber = cleanNumber.substring(2);
    if (cleanNumber.startsWith('03') && cleanNumber.length === 11) cleanNumber = '92' + cleanNumber.substring(1);
    return cleanNumber;
}

async function sendWhatsApp(to: string, job: any, username: string, jobLink: string, matchedTag: string) {
    const formattedNumber = formatPhoneNumber(to);
    if (!formattedNumber) return;

    // 👇 CHANGE 2: Use 'matchedTag' in Header instead of job.tags[0]
    const alertHeader = matchedTag ? matchedTag.toUpperCase() : (job.tags?.[0]?.toUpperCase() || "NEW JOB");

    const msg = `🔥 *HIRESKYS ALERT: ${alertHeader}*

*${job.title}*
────────────────────
💰 *Pay:* ${job.salary_range || "Competitive / Not Disclosed"}
🌍 *Loc:* ${job.location || "Remote"}
⚡ *Source:* ${job.source || "Direct Client"}
────────────────────
👇 Copy This Proposal:
---------------------
Hi Hiring Team,
I came across your opening for the **${job.title}** position and wanted to express my interest.

I am a skilled professional registered on HireSkys 🚀. You can view my portfolio & skills here:
👉 https://hireskys.com/p/${username}

I am available to discuss how my skills align with your goals.
────────────────────

👇 *TAP TO APPLY:*
${jobLink}

💡 _Tip: Apply within 2 hours to increase chances._
_Reply STOP to unsubscribe_`;

    try {
        await fetch(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: TOKEN, to: formattedNumber, body: msg })
        });
        console.log("✅ WhatsApp Sent!");
    } catch (error: any) {
        console.error("❌ WhatsApp Error:", error.message);
    }
}
async function sendEmail(to: string, job: any, username: string, jobLink: string, matchedTag: string) {
    const proposalText = `Hi Hiring Team,
I came across your opening for the **${job.title}** position and wanted to express my interest.

I am a skilled professional registered on HireSkys 🚀. You can view my portfolio & skills here:
👉 https://hireskys.com/p/${username}

I am available to discuss how my skills align with your goals.

Best regards,
${username}`;
const headerText = matchedTag ? matchedTag.toUpperCase() : "VERIFIED JOB";
    try {
        const mailOptions = {
            from: `"HireSkys Job Radar" <${EMAIL_USER}>`,
            to: to,
            subject: `🔥 Job Alert: ${job.title} (${headerText})`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #111827; color: #ffffff; border-radius: 12px; overflow: hidden; }
                    .header { background-color: #4f46e5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: white; }
                    .content { padding: 30px; }
                    .job-title { font-size: 22px; font-weight: bold; margin-bottom: 10px; color: #ffffff; }
                    .details { color: #d1d5db; font-size: 14px; margin-bottom: 20px; }
                    .proposal-box { background-color: #1f2937; border: 2px dashed #6366f1; padding: 20px; border-radius: 8px; margin: 20px 0; color: #9ca3af; font-family: monospace; white-space: pre-wrap; font-size: 12px; }
                    .label { color: #fbbf24; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; display: block; }
                    .btn { display: block; width: 100%; background-color: #10b981; color: white; text-align: center; padding: 15px 0; text-decoration: none; font-weight: bold; border-radius: 8px; margin-top: 20px; }
                    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        🚀 Verified Job Alert
                    </div>

                    <div class="content">
                        <div class="job-title">${job.title}</div>
                        <div class="details">
                            <strong>Source:</strong> ${job.source || "Direct Client"} <br>
                            <strong>Pay:</strong> ${job.salary_range || "Competitive / Not Disclosed"}
                        </div>

                        <hr style="border-color: #374151;">

                        <span class="label">👇 Copy This Proposal:</span>
                        <div class="proposal-box">${proposalText}</div>

                        <a href="${jobLink}" class="btn">Apply Now</a>
                    </div>
                    
                    <div class="footer">
                        Sent by HireSkys Remote Radar • <a href="#" style="color: #6b7280;">Unsubscribe</a>
                    </div>
                </div>
            </body>
            </html>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Rich Email Sent!");
    } catch (error: any) {
        console.error("❌ Email Error:", error.message);
    }
}

// --- MAIN API HANDLER ---
export async function POST(request: Request) {
    try {
        const job = await request.json();
        const jobTitle = job.title;
        
        // 👇 1. Top 4 Tags Nikalo (Array banaya)
        const targetTags = job.tags && Array.isArray(job.tags) 
            ? job.tags.slice(0, 4).map((t: string) => t.toLowerCase()) 
            : [];

        console.log(`\n🔎 Processing Job: "${jobTitle}"`);
        console.log(`🎯 Target Skills (Top 4):`, targetTags);

        // Link Generate
        const internalLink = createJobLink(job.title, job.id);

        // Array empty check
        if (targetTags.length === 0) {
            console.log("⚠️ No tags found on job. Skipping alerts.");
            return NextResponse.json({ success: false, message: "No tags on job" });
        }

        // Fetch Candidates
        const { data: candidates, error } = await supabase
            .from('profiles')
            .select('*, user_skills(*)')
            .not('whatsapp', 'is', null);

        if (error || !candidates) return NextResponse.json({ error: error?.message }, { status: 500 });

        let alertsSent = 0;
        
        for (const user of candidates) {
            
            // 👇 2. SKILL MATCHING LOGIC (Fixed for Array)
            let isMatch = false;
            let matchedSkill = ""; 

            // A. Check in Simple Skills Array
            if (user.skills && Array.isArray(user.skills)) {
                // Hum check karenge ke user ka skill, targetTags ki list mein hai ya nahi
                for (const skill of user.skills) {
                    if (targetTags.includes(skill.toLowerCase())) {
                        isMatch = true;
                        matchedSkill = skill;
                        break; // Match mil gaya
                    }
                }
            }

            // B. Check in Rated Skills (agar upar match nahi mila)
            if (!isMatch && user.user_skills && Array.isArray(user.user_skills)) {
                for (const s of user.user_skills) {
                    if (s.skill_name && targetTags.includes(s.skill_name.toLowerCase())) {
                        isMatch = true;
                        matchedSkill = s.skill_name;
                        break;
                    }
                }
            }

            if (isMatch) {
                console.log(`✅ Alerting: ${user.username} (Matched: ${matchedSkill})`);
                alertsSent++;
                
                await sendWhatsApp(user.whatsapp, job, user.username, internalLink, matchedSkill);
                if (user.email) await sendEmail(user.email, job, user.username, internalLink, matchedSkill);
            }
        }
        
        return NextResponse.json({ success: true, alerts: alertsSent });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
