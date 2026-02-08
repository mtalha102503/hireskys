import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createSlug } from '@/lib/utils'; // Apna slug function import krna

// 🔑 Google Auth Setup
// Best practice: Apni JSON key ka content .env me rakho
const serviceAccount = JSON.parse(process.env.GOOGLE_INDEXING_KEY || '{}');

const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🔒 Security Check (Optional but recommended)
    const secret = request.headers.get('x-secret-key');
    if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, table, record, old_record } = body;

    // 🕵️ Logic: Sirf tab chalo jab Job Approve hui ho
    // Condition 1: Update event ho
    // Condition 2: Abhi approve true ho
    // Condition 3: Pehle approve false tha
    const isJustApproved = type === 'UPDATE' && record.approved === true && old_record.approved === false;

    if (!isJustApproved) {
      return NextResponse.json({ message: "Job update ignored (Not an approval event)" });
    }

    // 🔗 URL Banao
    // Apni website ka link aur Slug logic yahan lagao
    const slug = createSlug(record.title, record.id);
    const jobUrl = `https://www.hireskys.com/jobs/${slug}`;

    console.log(`🚀 Indexing Job: ${jobUrl}`);

    // 📡 Google Indexing API Call
    await jwtClient.authorize();
    
    const indexing = google.indexing({ version: 'v3', auth: jwtClient });
    
    await indexing.urlNotifications.publish({
      requestBody: {
        url: jobUrl,
        type: 'URL_UPDATED'
      }
    });

    console.log(`✅ Success: ${record.title} sent to Google!`);

    return NextResponse.json({ success: true, message: "Indexed Successfully" });

  } catch (error: any) {
    console.error("❌ Indexing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}