import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Secure backend Supabase client (Service role key use karni hai)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const employerId = searchParams.get('state'); // State mein humne userId bheja tha

  // Agar Microsoft se code ya state na mile toh error redirect
  if (!code || !employerId) {
    return NextResponse.redirect(new URL('/employer/settings?error=Missing_code_or_state', request.url));
  }

  try {
    // 1. 🟢 Microsoft se Tokens Exchange Karo (Code to Token)
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        code: code,
        redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Microsoft Token Exchange Failed:", tokenData);
      throw new Error(tokenData.error_description || "Failed to exchange Microsoft token");
    }

    // 2. 🟢 Microsoft Graph API se Profile Details aur Email Fetch Karo
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();
    
    // Microsoft mein primary email 'mail' ya 'userPrincipalName' mein hoti hai
    const userEmail = userData.mail || userData.userPrincipalName;

    if (!userEmail) {
      throw new Error("Could not retrieve email from Microsoft account.");
    }

    // 3. 🟢 Supabase Database mein Tokens Upsert Karo
    const { error: dbError } = await supabaseAdmin
      .from('calendar_integrations')
      .upsert({
        employer_id: employerId,
        provider: 'microsoft',
        email: userEmail,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token, // Yeh master key hamesha ke liye hoti hai
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      }, { onConflict: 'employer_id,provider' }); // Agar pehle se record ho toh update ho jaye

    if (dbError) {
      console.error("Supabase Microsoft Integration Save Error:", dbError);
      throw dbError;
    }

    // 4. 🎉 Success! Redirect back to Settings page with success parameter
    return NextResponse.redirect(new URL('/employer/settings?calendar=connected', request.url));

  } catch (error: any) {
    console.error("Microsoft Auth Callback Global Error:", error);
    return NextResponse.redirect(new URL(`/employer/settings?error=${encodeURIComponent(error.message || 'auth_failed')}`, request.url));
  }
}