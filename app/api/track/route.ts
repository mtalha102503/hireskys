import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, job_id, event_type, metadata } = body;

    // Basic security check
    if (!user_id || !event_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Supabase mein data insert karo
    await supabase.from('user_activity_logs').insert([{
      user_id,
      job_id: job_id || null, // Homepage par job_id null hoga
      event_type,
      metadata: metadata || {}
    }]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}