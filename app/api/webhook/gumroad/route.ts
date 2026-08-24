import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    // Gumroad Ping standard form data bhejta hai
    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());

    // Gumroad se bhejey gaye data ko nikalna
    const employerId = payload.employerId as string; 
    const apiKey = payload.apiKey as string; // 👈 Naya MCP wala custom field
    const buyerEmail = payload.email as string;
    const isRefunded = payload.refunded === 'true';
    const productName = (payload.product_name as string || '').toLowerCase(); 

    console.log(`Gumroad Master Webhook | Product: ${productName} | Refunded: ${isRefunded} | Employer: ${employerId} | API Key: ${apiKey}`);

    // ==============================================================
    // 🚀 SCENARIO 1: MCP SUBSCRIPTION LOGIC
    // ==============================================================
    if (productName.includes('mcp')) {
      if (!apiKey) {
        return NextResponse.json({ error: "Missing API key for MCP purchase" }, { status: 400 });
      }

      // 🔴 Refund hua -> free tier pe wapas kar do
      if (isRefunded) {
        await supabase
          .from('api_keys')
          .update({ plan: 'free', subscription_expires_at: null })
          .eq('key', apiKey);

        return NextResponse.json({ success: true, message: "MCP Refund processed, downgraded to free" });
      }

      // 🟢 Payment successful -> expiry date calculate karo
      let daysToAdd = 30; // default monthly

      if (productName.includes('6-month')) {
        daysToAdd = 180;
      } else if (productName.includes('yearly')) {
        daysToAdd = 365;
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysToAdd);

      const { error } = await supabase
        .from('api_keys')
        .update({
          plan: 'paid',
          subscription_expires_at: expiryDate.toISOString(),
        })
        .eq('key', apiKey);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `MCP subscription activated: ${productName}` });
    }

    // ==============================================================
    // 💼 SCENARIO 2: JOB POSTS / COMPANY CREDITS LOGIC
    // ==============================================================
    
    // Verification check for Jobs
    if (!employerId) {
      return NextResponse.json({ error: "Missing Employer ID for Job Post" }, { status: 400 });
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
      
      if (productName.includes('urgent')) {
        updateData = { urgent_credits: Math.max(0, (company.urgent_credits || 0) - 1) };
      } else {
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
      newPlanTier = 'Urgent'; 
      creditsToAdd = 1;
      isUrgentToken = true;
    } else if (productName.includes('bulk 5')) {
      newPlanTier = 'Bulk 5 Pack'; 
      creditsToAdd = 5;
    } else if (productName.includes('bulk 10')) {
      newPlanTier = 'Bulk 10 Pack'; 
      creditsToAdd = 10;
    } else {
      creditsToAdd = 1; // Default
    }

    // 🛠️ Prepare the payload for Supabase
    let updatePayload: any = {};

    if (isUrgentToken) {
      updatePayload.urgent_credits = (company.urgent_credits || 0) + creditsToAdd;
    } else {
      updatePayload.paid_credits = (company.paid_credits || 0) + creditsToAdd;
    }

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
