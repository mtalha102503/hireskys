import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());

    const apiKey = payload.apiKey as string;
    const isRefunded = payload.refunded === 'true';
    const productName = (payload.product_name as string || '').toLowerCase();

    console.log(`MCP Gumroad Webhook | Key: ${apiKey} | Product: ${productName} | Refunded: ${isRefunded}`);

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 400 });
    }

    // 🔴 Refund hua -> free tier pe wapas kar do
    if (isRefunded) {
      await supabase
        .from('api_keys')
        .update({ plan: 'free', subscription_expires_at: null })
        .eq('key', apiKey);

      return NextResponse.json({ success: true, message: "Refund processed, downgraded to free" });
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

  } catch (error: any) {
    console.error("MCP Gumroad Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}