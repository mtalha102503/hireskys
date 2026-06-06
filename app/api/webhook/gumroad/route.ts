import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    // Gumroad Ping standard form data bhejta hai
    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());

    // Gumroad se bhejey gaye data ko nikalna
    const employerId = payload['url_params[employerId]'] as string;
    const buyerEmail = payload.email as string;
    const saleId = payload.sale_id as string;
    const isRefunded = payload.refunded === 'true';

    console.log(`Gumroad Webhook Received for User: ${employerId}, Email: ${buyerEmail}`);

    // Verification check
    if (!employerId) {
      return NextResponse.json({ error: "Missing Employer ID" }, { status: 400 });
    }

    // Agar user ne refund le liya hai toh credit kam kar do (Optional but safe)
    if (isRefunded) {
      // Puraane credits read karein
      const { data: company } = await supabase
        .from('companies')
        .select('job_credits')
        .eq('employer_id', employerId)
        .single();

      const currentCredits = company?.job_credits || 0;
      const newCredits = Math.max(0, currentCredits - 1);

      await supabase
        .from('companies')
        .update({ job_credits: newCredits })
        .eq('employer_id', employerId);

      return NextResponse.json({ success: true, message: "Refund processed" });
    }

    // 🟢 SUCCESSFUL PAYMENT: Credits barhana
    // Pehle mojooda credits check karein
    const { data: company, error: fetchError } = await supabase
      .from('companies')
      .select('job_credits')
      .eq('employer_id', employerId)
      .single();

    if (fetchError) throw fetchError;

    const currentCredits = company?.job_credits || 0;
    const newCredits = currentCredits + 1; // Startup plan mein 1 credit milta hai

    // Database mein update karein
    const { error: updateError } = await supabase
      .from('companies')
      .update({ 
        job_credits: newCredits,
        plan_tier: 'Startup'
      })
      .eq('employer_id', employerId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: "Credits updated successfully!" });

  } catch (error: any) {
    console.error("Gumroad Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}