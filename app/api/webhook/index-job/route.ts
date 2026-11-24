import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/utils';
import { createSign } from 'node:crypto';

// --- Google service-account JWT (googleapis ki jagah, plain fetch) ---
function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = base64url(signer.sign(privateKey));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🔒 Security Check
    const secret = request.headers.get('x-secret-key');
    if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, record, old_record } = body;

    // 🕵️ 🔥 FIXED LOGIC: Nayi AI Insert hui job YA Admin Panel se Update hui job
    const isDirectInsert = type === 'INSERT' && record.approved === true;
    const isStatusUpdate = type === 'UPDATE' && record.approved === true && (!old_record || old_record.approved === false);

    if (!isDirectInsert && !isStatusUpdate) {
      return NextResponse.json({ message: "Job ignored (Not a fresh insert or approval event)" });
    }

   // 🔑 Google Auth Setup (Bulletproof Method)
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.error("❌ Google keys missing in environment variables!");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // String wale \n ko actual newlines mein convert karo (OpenSSL ke liye)
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const accessToken = await getGoogleAccessToken(clientEmail, formattedPrivateKey);

    // 🔗 URL Banao
    const slug = createSlug(record.title, record.id);
    const jobUrl = `https://www.hireskys.com/jobs/${slug}`;

    console.log(`🚀 Indexing Job: ${jobUrl}`);

    // 📡 Google Indexing API Call (plain fetch)
    const indexRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ url: jobUrl, type: 'URL_UPDATED' }),
    });
    if (!indexRes.ok) {
      const text = await indexRes.text();
      throw new Error(`Indexing API ${indexRes.status}: ${text.slice(0, 200)}`);
    }

    console.log(`✅ Success: ${record.title} sent to Google!`);

    return NextResponse.json({ success: true, message: "Indexed Successfully" });

  } catch (error: any) {
    console.error("❌ Indexing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
