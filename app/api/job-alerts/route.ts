import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';
import { createSlug } from '@/lib/utils'; 

// --- CONFIGURATION ---
const INSTANCE_ID = process.env.INSTANCE_ID;
const TOKEN = process.env.TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const VALID_COUNTRIES = [
    // Priority / Original List
    "pakistan", "india", "bangladesh", "usa", "united states", 
    "uk", "united kingdom", "canada", "germany", "australia", 
    "uae", "united arab emirates", "dubai", "saudi arabia",

    // A
    "afghanistan", "albania", "algeria", "andorra", "angola", "antigua and barbuda", 
    "argentina", "armenia", "austria", "azerbaijan",

    // B
    "bahamas", "bahrain", "barbados", "belarus", "belgium", "belize", "benin", 
    "bhutan", "bolivia", "bosnia and herzegovina", "botswana", "brazil", "brunei", 
    "bulgaria", "burkina faso", "burundi",

    // C
    "cabo verde", "cambodia", "cameroon", "central african republic", "chad", "chile", 
    "china", "colombia", "comoros", "congo", "democratic republic of the congo", 
    "costa rica", "croatia", "cuba", "cyprus", "czech republic", "czechia",

    // D
    "denmark", "djibouti", "dominica", "dominican republic",

    // E
    "east timor", "ecuador", "egypt", "el salvador", "equatorial guinea", "eritrea", 
    "estonia", "eswatini", "ethiopia",

    // F
    "fiji", "finland", "france",

    // G
    "gabon", "gambia", "georgia", "ghana", "greece", "grenada", "guatemala", 
    "guinea", "guinea-bissau", "guyana",

    // H
    "haiti", "honduras", "hungary",

    // I
    "iceland", "indonesia", "iran", "iraq", "ireland", "israel", "italy", "ivory coast",

    // J
    "jamaica", "japan", "jordan",

    // K
    "kazakhstan", "kenya", "kiribati", "kosovo", "kuwait", "kyrgyzstan",

    // L
    "laos", "latvia", "lebanon", "lesotho", "liberia", "libya", "liechtenstein", 
    "lithuania", "luxembourg",

    // M
    "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "marshall islands", 
    "mauritania", "mauritius", "mexico", "micronesia", "moldova", "monaco", 
    "mongolia", "montenegro", "morocco", "mozambique", "myanmar",

    // N
    "namibia", "nauru", "nepal", "netherlands", "new zealand", "nicaragua", "niger", 
    "nigeria", "north korea", "north macedonia", "norway",

    // O
    "oman",

    // P
    "palau", "palestine", "panama", "papua new guinea", "paraguay", "peru", 
    "philippines", "poland", "portugal",

    // Q
    "qatar",

    // R
    "romania", "russia", "rwanda",

    // S
    "saint kitts and nevis", "saint lucia", "saint vincent and the grenadines", 
    "samoa", "san marino", "sao tome and principe", "senegal", "serbia", "seychelles", 
    "sierra leone", "singapore", "slovakia", "slovenia", "solomon islands", 
    "somalia", "south africa", "south korea", "south sudan", "spain", "sri lanka", 
    "sudan", "suriname", "sweden", "switzerland", "syria",

    // T
    "taiwan", "tajikistan", "tanzania", "thailand", "timor-leste", "togo", "tonga", 
    "trinidad and tobago", "tunisia", "turkey", "turkmenistan", "tuvalu",

    // U
    "uganda", "ukraine", "uruguay", "uzbekistan",

    // V
    "vanuatu", "vatican city", "venezuela", "vietnam",

    // Y
    "yemen",

    // Z
    "zambia", "zimbabwe"
];
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, 
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
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

// 🚀 TELEGRAM SENDER ENGINE
async function sendTelegramAlert(chatId: string | number, jobTitle: string, companyName: string, jobLink: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // 💎 Premium VVIP Message Formatting
  const message = `
🚀 <b>New Job Match Found!</b>

💼 <b>Role:</b> ${jobTitle}
🏢 <b>Company:</b> ${companyName}

⚡ Hurry up! Be the first to apply:
👉 <a href="${jobLink}">Click Here to View & Apply</a>
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Is se text bold aur links pyare lagte hain
        disable_web_page_preview: true // Barray ajeeb se link previews rokne ke liye
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🚨 Telegram sending failed:", error);
  }
}

async function sendWhatsApp(to: string, job: any, username: string, jobLink: string, matchedTag: string) {
    const formattedNumber = formatPhoneNumber(to);
    
    // Agar number hi galat hai, to False return karo
    if (!formattedNumber) return false; 

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
        const response = await fetch(`http://localhost:3001/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: formattedNumber, body: msg })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ WhatsApp Delivered to ${formattedNumber}!`);
            return true; // ✅ Success
        } else {
            console.log(`⚠️ WhatsApp Failed -> ${formattedNumber}. Reason: ${data.error}`);
            return false; // ❌ Failed (Number not saved / Blocked)
        }
    } catch (error: any) {
        console.error("❌ Next.js to API Error:", error.message);
        return false; // ❌ Error
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
            from: '"HireSkys Job Alerts" <jobalerts@hireskys.com>',
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
                    <div class="header">🚀 ${headerText} ALERT</div>
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
                    <div class="footer">Sent by HireSkys Remote Radar • <a href="#" style="color: #6b7280;">Unsubscribe</a></div>
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
        
        // Tags Logic
        const rawTags = job.tags && Array.isArray(job.tags) 
            ? job.tags.map((t: string) => t.toLowerCase()) 
            : [];

        if (rawTags.length === 0) {
            return NextResponse.json({ success: false, message: "No tags on job" });
        }

        // 🌍 1. COUNTRY DETECTION (Extract ALL valid countries from tags)
        const targetCountries = rawTags.filter((tag: string) => VALID_COUNTRIES.includes(tag));

        // 🎯 2. SKILLS EXTRACTION (Remove all found countries to get just the skills)
        const skillTags = rawTags
            .filter((tag: string) => !VALID_COUNTRIES.includes(tag))
            .slice(0, 5);

        // Logging
        if (targetCountries.length > 0) {
            console.log(`🌍 Country Filter Active: Must match any of: [${targetCountries.join(", ")}]`);
        } else {
            console.log(`🌐 Global Mode: No specific country tag found.`);
        }
        console.log(`🔎 Processing Job: "${jobTitle}"`);
        console.log(`🎯 Target Skills:`, skillTags);

        const internalLink = createJobLink(job.title, job.id);

        // Fetch Candidates
        const { data: candidates, error } = await supabase
            .from('profiles')
            .select('*, user_skills(*)')
            .eq('alerts_enabled', true);

        if (error || !candidates) return NextResponse.json({ error: error?.message }, { status: 500 });

        let alertsSent = 0;
        
        // --- SINGLE MERGED LOOP START ---
        for (const user of candidates) {
            
            // 🛑 STEP 1: CHECK QUOTA & DATE
            const userLimit = user.alert_limit || 3; 
            let currentCount = user.daily_alert_count || 0;
            const lastDate = user.last_alert_date;
            const todayDate = new Date().toISOString().split('T')[0];

            if (lastDate !== todayDate) {
                currentCount = 0;
            }

            if (currentCount >= userLimit) {
                continue; 
            }

            // 🌍 STEP 2: CHECK COUNTRY (Multiple Countries Check)
            if (targetCountries.length > 0) {
                const userCountry = user.country ? user.country.toLowerCase() : "";
                
                // Agar user ka country targetCountries list mein NAHI hai, toh skip karo
                if (!targetCountries.includes(userCountry)) {
                    continue; 
                }
            }

            // 🎯 STEP 3: CHECK SKILLS
            let isMatch = false;
            let matchedSkill = ""; 

            // A. Check in Simple Skills Array
            if (user.skills && Array.isArray(user.skills)) {
                for (const skill of user.skills) {
                    if (skillTags.includes(skill.toLowerCase())) {
                        isMatch = true;
                        matchedSkill = skill;
                        break;
                    }
                }
            }

            // B. Check in Rated Skills
            if (!isMatch && user.user_skills && Array.isArray(user.user_skills)) {
                for (const s of user.user_skills) {
                    if (s.skill_name && skillTags.includes(s.skill_name.toLowerCase())) {
                        isMatch = true;
                        matchedSkill = s.skill_name;
                        break;
                    }
                }
            }

            // ✅ STEP 4: SEND ALERT & UPDATE DB
            if (isMatch) {
                console.log(`✅ Alerting: ${user.username} (Matched: ${matchedSkill}, Country: ${user.country})`);
                alertsSent++;
                
                // --- 🚀 NEW WHATSAPP LOGIC ---
                if (user.whatsapp && user.whatsapp_active !== false) {
                    const waSuccess = await sendWhatsApp(user.whatsapp, job, user.username, internalLink, matchedSkill);
                    if (!waSuccess) {
                        console.log(`❌ WhatsApp failed for ${user.username}. Disabling WhatsApp only.`);
                        await supabase
                            .from('profiles')
                            .update({ whatsapp_active: false })
                            .eq('id', user.id);
                    }
                }

                // --- 📧 EMAIL LOGIC ---
                if (user.email) {
                    await sendEmail(user.email, job, user.username, internalLink, matchedSkill);
                }
                
                // --- ✈️ TELEGRAM LOGIC ---
                if (user.telegram_chat_id) {
                    const companyName = job.source || "HireSkys Verified";
                    await sendTelegramAlert(user.telegram_chat_id, job.title, companyName, internalLink);
                    console.log(`✈️ Telegram Alert Sent to ${user.username}`);
                }
                
                // Update Database (Count + 1)
                await supabase.from('profiles').update({
                    last_alert_date: todayDate,
                    daily_alert_count: currentCount + 1
                }).eq('id', user.id);
            }
        }
        // --- LOOP END ---
        
        return NextResponse.json({ success: true, alerts: alertsSent });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
