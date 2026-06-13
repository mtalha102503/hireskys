import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🟢 Webhook bahar se aayega (bina login ke), is liye Service Role Key zaroori hai
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("🔔 WEBHOOK RECEIVED:", body);

    // Calendly / Cal.com ya Postman se aane wala data pakarna
    const candidateEmail = body.payload?.email || body.email || body.invitee?.email;
    const startTime = body.payload?.start_time || body.start_time || body.event?.start_time;

    if (!candidateEmail || !startTime) {
      console.error("Missing email or start time in webhook payload");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🟢 Database update: Us candidate ki interview_date save karo
    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ interview_date: startTime })
      .eq('email', candidateEmail)
      .eq('status', 'Interview') // Sirf unki update karo jo Interview stage mein hain
      .select();

    if (error) {
      console.error("Database Update Error:", error);
      throw error;
    }

    console.log(`✅ Success: Interview scheduled for ${candidateEmail} at ${startTime}`);
    return NextResponse.json({ success: true, message: "Webhook processed successfully" });

  } catch (error: any) {
    console.error("🔥 Webhook Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}