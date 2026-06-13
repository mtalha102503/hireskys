import { NextResponse } from 'next/server';
import { google } from 'googleapis';
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

    // Google Client Setup
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // 1. Secret Code ko de kar Tokens nikalna
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. User ka email nikalna (Taake Settings page par dikha sakein)
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();
    const userEmail = userInfo.data.email;

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
        expires_at: new Date(tokens.expiry_date!).toISOString(),
      });

    if (dbError) throw dbError;

    // 4. Sab theek ho gaya! Wapas Settings page par bhej do Success message ke sath
    return NextResponse.redirect(new URL('/employer/settings?calendar=connected', request.url));

  } catch (error: any) {
    console.error("Google Callback Error:", error);
    return NextResponse.redirect(new URL('/employer/settings?error=CallbackFailed', request.url));
  }
}