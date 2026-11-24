import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // URL se employer_id nikalna (hum UI se bhejenge)
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // googleapis hata diya — auth URL haath se banate hain (plain OAuth2 URL)
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://mail.google.com/',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: userId, // 🟢 VIP JADOO: Employer ID yahan save kar di taake Google wapas kare
    });

    return NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString().replace(/\+/g, '%20')}`
    );

  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "Failed to generate Google Login URL" }, { status: 500 });
  }
}
