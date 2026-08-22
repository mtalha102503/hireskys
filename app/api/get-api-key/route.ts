import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Check karo agar is email ki pehle se key hai
    const { data: existing } = await supabase
      .from('api_keys')
      .select('key, plan')
      .eq('user_email', email)
      .single();

    if (existing) {
      return NextResponse.json({ apiKey: existing.key, plan: existing.plan });
    }

    // Nayi unique key banao
    const newKey = `hsk_${crypto.randomBytes(24).toString('hex')}`;

    const { error } = await supabase
      .from('api_keys')
      .insert([{ key: newKey, user_email: email }]);

    if (error) throw error;

    return NextResponse.json({ apiKey: newKey, plan: 'free' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}