import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Secure backend Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Calendly jab koi naya event book hota hai toh 'invitee.created' bhejta hai
    if (body.event === 'invitee.created') {
      const inviteeEmail = body.payload.email; // Candidate ki email
      const startTime = body.payload.scheduled_event.start_time; // Book kiya hua time

      console.log(`🟢 Calendly Webhook Hit: Interview booked for ${inviteeEmail} at ${startTime}`);

      // Database mein candidate dhoondo aur uska interview_date update kar do
      const { error } = await supabaseAdmin
        .from('applications')
        .update({ interview_date: startTime })
        .eq('email', inviteeEmail)
        .eq('status', 'Interview'); // Sirf unko update karega jo Interview stage mein hain

      if (error) {
        console.error("Webhook DB Update Error:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      console.log("✅ Kanban Board updated successfully!");
    }

    return NextResponse.json({ success: true, message: "Webhook received" });

  } catch (error: any) {
    console.error("Calendly Webhook Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}