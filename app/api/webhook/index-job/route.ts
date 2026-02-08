import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createSlug } from '@/lib/utils'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🔒 Security Check
    const secret = request.headers.get('x-secret-key');
    if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, record, old_record } = body;

    // 🕵️ Logic: Sirf tab chalo jab Job Approve hui ho
    const isJustApproved = type === 'UPDATE' && record.approved === true && old_record.approved === false;

    if (!isJustApproved) {
      return NextResponse.json({ message: "Job update ignored (Not an approval event)" });
    }

    // 🔑 Google Auth Setup (Fixed for New Version)
    const serviceAccount = JSON.parse(process.env.GOOGLE_INDEXING_KEY || '{}');

    // 👇 YEH CHANGE KIYA HAI (JWT ki jagah GoogleAuth)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // 🔗 URL Banao
    const slug = createSlug(record.title, record.id);
    const jobUrl = `https://www.hireskys.com/jobs/${slug}`;

    console.log(`🚀 Indexing Job: ${jobUrl}`);

    // 📡 Google Indexing API Call
    const indexing = google.indexing({ version: 'v3', auth });
    
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
