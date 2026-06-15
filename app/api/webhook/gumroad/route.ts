import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    // Gumroad Ping standard form data bhejta hai
    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());

    // Gumroad se bhejey gaye data ko nikalna
    const employerId = payload.employerId as string; // Make sure your Gumroad button sends this!
    const buyerEmail = payload.email as string;
    const isRefunded = payload.refunded === 'true';
    
    // 🟢 VIP JADOO: Gumroad bhejta hai ke product ka naam kya tha
    const productName = (payload.product_name as string || '').toLowerCase(); 

    console.log(`Gumroad Webhook Received | User: ${employerId} | Product: ${productName} | Refunded: ${isRefunded}`);

    // Verification check
    if (!employerId) {
      return NextResponse.json({ error: "Missing Employer ID" }, { status: 400 });
    }

    // Pehle mojooda company ka data nikalo taake purane credits pata chal sakein
    const { data: company, error: fetchError } = await supabase
      .from('companies')
      .select('paid_credits, urgent_credits, plan_tier')
      .eq('employer_id', employerId)
      .single();

    if (fetchError || !company) throw new Error("Company not found in database");

    // 🔴 REFUND LOGIC (Ab paid_credits se minus hoga)
    if (isRefunded) {
      let updateData: any = {};
      
      // Agar urgent refund hua hai toh urgent se kato, warna paid se
      if (productName.includes('urgent')) {
        updateData = { urgent_credits: Math.max(0, (company.urgent_credits || 0) - 1) };
      } else {
        // Bulk packs refund hue hain toh zyada kato, warna 1
        let deduction = 1;
        if (productName.includes('bulk 5')) deduction = 5;
        if (productName.includes('bulk 10')) deduction = 10;
        
        updateData = { paid_credits: Math.max(0, (company.paid_credits || 0) - deduction) };
      }

      await supabase.from('companies').update(updateData).eq('employer_id', employerId);
      return NextResponse.json({ success: true, message: "Refund processed securely" });
    }

    // 🟢 SUCCESSFUL PAYMENT LOGIC
    let newPlanTier = null;
    let creditsToAdd = 0;
    let isUrgentToken = false;

    // Check karo product name mein kya likha hai
    if (productName.includes('startup')) {
      newPlanTier = 'Startup';
      creditsToAdd = 1;
    } else if (productName.includes('scale')) {
      newPlanTier = 'Scale';
      creditsToAdd = 1;
    } else if (productName.includes('urgent')) {
      creditsToAdd = 1;
      isUrgentToken = true;
      // Urgent pack par plan upgrade nahi karte, jo hai wahi rehta hai
    } else if (productName.includes('bulk 5')) {
      creditsToAdd = 5;
    } else if (productName.includes('bulk 10')) {
      creditsToAdd = 10;
    } else {
      creditsToAdd = 1; // Default
    }

    // 🛠️ Prepare the payload for Supabase
    let updatePayload: any = {};

    // Sahi balti mein credits daalo
    if (isUrgentToken) {
      updatePayload.urgent_credits = (company.urgent_credits || 0) + creditsToAdd;
    } else {
      updatePayload.paid_credits = (company.paid_credits || 0) + creditsToAdd;
    }

    // Agar plan badalna hai toh payload mein daal do
    if (newPlanTier) {
      updatePayload.plan_tier = newPlanTier;
    }

    // Database mein final update fire kardo!
    const { error: updateError } = await supabase
      .from('companies')
      .update(updatePayload)
      .eq('employer_id', employerId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: `Payment processed: ${productName} - Tier updated to ${newPlanTier || company.plan_tier}` });

  } catch (error: any) {
    console.error("Gumroad Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}