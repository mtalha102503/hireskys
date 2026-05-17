import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events || [body]; 

    for (const event of events) {
      if (event.type === 'order.completed') {
        const orderData = event.data;
        const tags = orderData.tags;
        const employerId = tags?.employerId;

        if (!employerId) {
          console.error("❌ No employerId found in order tags.");
          continue;
        }

        let creditsToAdd = 0;
        let planTier = 'Free';
        const items = orderData.items;
        
        for (const item of items) {
          const productPath = item.product;
          
          if (productPath === 'startup-plan') {
            creditsToAdd += 1;
            planTier = 'startup';
          } else if (productPath === 'scale-plan') {
            creditsToAdd += 1;
            planTier = 'scale';
          } else if (productPath === 'urgent-plan') {
            creditsToAdd += 1;
            planTier = 'urgent';
          }
          // Bulk plans logic if you have them
        }

        if (creditsToAdd > 0) {
          console.log(`Processing ${creditsToAdd} credits for Employer: ${employerId}`);
          
          // 1. Pehle credits fetch karein (.single() ki jagah .maybeSingle() use kiya hai)
          const { data: company, error: fetchError } = await supabaseAdmin
            .from('companies')
            .select('job_credits')
            .eq('employer_id', employerId)
            .maybeSingle(); // 🚨 YE FIX HAI: Ab zero rows par crash nahi hoga

          if (fetchError) {
            console.error("Fetch Error:", fetchError);
          }

          const currentCredits = company?.job_credits || 0;
          const newCredits = currentCredits + creditsToAdd;

          // 2. Smart Update ya Insert (Upsert Logic)
          if (!company) {
            // Agar row nahi mili (naya banda hai), toh INSERT karo
            const { error: insertError } = await supabaseAdmin
              .from('companies')
              .insert({ 
                employer_id: employerId,
                job_credits: newCredits,
                plan_tier: planTier
              });
              
            if (insertError) console.error("❌ Supabase Insert Error:", insertError);
            else console.log(`✅ Success! Created new profile & added credits: ${newCredits}`);
          } else {
            // Agar row mil gayi, toh normally UPDATE karo
            const { error: updateError } = await supabaseAdmin
              .from('companies')
              .update({ 
                job_credits: newCredits,
                plan_tier: planTier
              })
              .eq('employer_id', employerId);

            if (updateError) console.error("❌ Supabase Update Error:", updateError);
            else console.log(`✅ Success! Updated existing credits to: ${newCredits}`);
          }
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("🚨 Webhook Error:", error.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
