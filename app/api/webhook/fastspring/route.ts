import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Apna actual supabase client path yahan lagayen
import { createClient } from '@supabase/supabase-js';

// 🚨 Webhooks backend par chalte hain isliye inhein Admin level access chahiye hota hai
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // FastSpring events array ki form mein data bhejta hai
    const events = body.events || [body]; 

    for (const event of events) {
      // Check karein ke kya order complete ho gaya hai?
      if (event.type === 'order.completed') {
        const orderData = event.data;
        
        // Frontend se jo 'tags' humne bheje the (employerId), wo yahan receive honge
        const tags = orderData.tags;
        const employerId = tags?.employerId;

        if (!employerId) {
          console.error("❌ No employerId found in order tags. Cannot assign credits.");
          continue;
        }

        // Dekhein ke user ne kya kharida hai aur kitne credits dene hain
        let creditsToAdd = 0;
        const items = orderData.items;
        
        for (const item of items) {
          const productPath = item.product;
          
          // 🟢 YAHAN APNE FASTSPRING WALE EXACT PRODUCT PATHS MATCH KAREIN
          if (productPath === 'startup-plan') creditsToAdd += 1;
          else if (productPath === 'scale-plan') creditsToAdd += 1;
          else if (productPath === 'urgent-plan') creditsToAdd += 1;
          else if (productPath === 'bulk-5-pack') creditsToAdd += 5;
          else if (productPath === 'bulk-10-pack') creditsToAdd += 10;
        }

        if (creditsToAdd > 0) {
          console.log(`Processing ${creditsToAdd} credits for Employer: ${employerId}`);

          // 1. Supabase se user ke purane credits check karein
          const { data: company, error: fetchError } = await supabaseAdmin
            .from('companies')
            .select('job_credits')
            .eq('employer_id', employerId)
            .single();

          if (fetchError) throw fetchError;

          const currentCredits = company?.job_credits || 0;
          const newCredits = currentCredits + creditsToAdd;

          // 2. Naye credits Supabase mein update kar dein
          const { error: updateError } = await supabaseAdmin
            .from('companies')
            .update({ 
              job_credits: newCredits,
              // Agar aap chahein toh plan_tier bhi update kar sakte hain
            })
            .eq('employer_id', employerId);

          if (updateError) {
             console.error("❌ Supabase Update Error:", updateError);
          } else {
             console.log(`✅ Success! Added ${creditsToAdd} credits. Total is now ${newCredits}.`);
          }
        }
      }
    }

    // FastSpring ko 200 OK bhej dein taake usay pata chal jaye humne receive kar liya hai
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("🚨 Webhook Error:", error.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}