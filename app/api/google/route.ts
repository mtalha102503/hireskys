import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    // URL se employer_id nikalna (hum UI se bhejenge)
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
      'https://www.googleapis.com/auth/calendar.events', 
      'https://www.googleapis.com/auth/userinfo.email',
      'https://mail.google.com/'  
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', 
      prompt: 'consent',      
      scope: scopes,
      state: userId // 🟢 VIP JADOO: Employer ID yahan save kar di taake Google wapas kare
    });

    return NextResponse.redirect(authUrl);
    
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "Failed to generate Google Login URL" }, { status: 500 });
  }
}