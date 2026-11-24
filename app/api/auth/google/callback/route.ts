import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Backend ke liye secure Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const employerId = url.searchParams.get('state'); // Google ne employer_id wapas bhej diya!

    // Agar user ne cancel kar diya ya error aagya
    if (!code || !employerId) {
      return NextResponse.redirect(new URL('/employer/settings?error=AuthFailed', request.url));
    }

    // 1. Secret Code ko de kar Tokens nikalna (plain fetch — googleapis nahi)
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) throw new Error(`Token exchange failed: ${tokenRes.status}`);
    const tokens = await tokenRes.json();

    // 2. User ka email nikalna (Taake Settings page par dikha sakein)
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!userRes.ok) throw new Error(`Userinfo fetch failed: ${userRes.status}`);
    const userInfo = await userRes.json();
    const userEmail = userInfo.email;

    // 3. Purana connection delete kar ke naya save karna (To avoid duplicates)
    await supabaseAdmin
      .from('calendar_integrations')
      .delete()
      .match({ employer_id: employerId, provider: 'google' });

    const { error: dbError } = await supabaseAdmin
      .from('calendar_integrations')
      .insert({
        employer_id: employerId,
        provider: 'google',
        email: userEmail,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null, // Refresh token sirf 1st time milta hai
        expires_at: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
      });

    if (dbError) throw dbError;

    // 4. Sab theek ho gaya! Wapas Settings page par bhej do Success message ke sath
    return NextResponse.redirect(new URL('/employer/settings?calendar=connected', request.url));

  } catch (error: any) {
    console.error("Google Callback Error:", error);
    return NextResponse.redirect(new URL('/employer/settings?error=CallbackFailed', request.url));
  }
}
