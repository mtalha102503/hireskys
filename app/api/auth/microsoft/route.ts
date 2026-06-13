import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId'); // Employer ID

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI;

  // 🟢 NAYA JADOO: Microsoft ke Scopes (Email bhejne aur Calendar ke liye)
  const scopes = [
    'offline_access',      // Refresh token (Master key) lene ke liye zaroori hai
    'User.Read',           // User ka email address parhne ke liye
    'Calendars.ReadWrite', // Interview events add karne ke liye
    'https://outlook.office.com/SMTP.Send'            // Candidate ko email shoot karne ke liye
  ].join(' ');

  // Microsoft OAuth2 URL generate kar rahe hain
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri!)}&response_mode=query&scope=${encodeURIComponent(scopes)}&state=${userId}`;

  return NextResponse.redirect(authUrl);
}