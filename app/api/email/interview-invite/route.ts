import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Secure backend Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { candidateEmail, candidateName, companyName, jobTitle, employerId } = await request.json();

    if (!candidateEmail || !employerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

  // 1. Company ke booking links aur template fetch karo
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('name, calendly_url, cal_url, custom_booking_url, interview_template') // 👈 Yahan interview_template add kiya
      .eq('employer_id', employerId)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: "Company details not found" }, { status: 404 });
    }

    const bookingLink = company.custom_booking_url || company.cal_url || company.calendly_url;

    if (!bookingLink) {
      return NextResponse.json({ error: "NO_LINK_FOUND" }, { status: 400 });
    }

    // 2. 🟢 VIP JADOO: Check Any Connected Account (Google OR Microsoft)
    const { data: integrations, error: integrationError } = await supabaseAdmin
      .from('calendar_integrations')
      .select('provider, email, access_token, refresh_token')
      .eq('employer_id', employerId)
      .limit(1); // Jo bhi account connect hoga, wo utha lega

    const integration = integrations?.[0];

    if (!integration || !integration.refresh_token) {
      return NextResponse.json({ error: "Please connect your Google or Microsoft Email in Settings first." }, { status: 400 });
    }

    // 3. 🟢 THE REAL MAGIC: Transporter ko Provider ke hisab se set karna
    let transporter;

    if (integration.provider === 'google') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: integration.email?.trim(), 
          clientId: process.env.GOOGLE_CLIENT_ID?.trim(),
          clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim(),
          refreshToken: integration.refresh_token?.trim(),
        },
      });
    } else if (integration.provider === 'microsoft') {
      transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // Microsoft ka SMTP server
        port: 587,
        secure: false, // 587 ke liye false hota hai
        auth: {
          type: 'OAuth2',
          user: integration.email?.trim(),
          clientId: process.env.MICROSOFT_CLIENT_ID?.trim(),
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET?.trim(),
          refreshToken: integration.refresh_token?.trim(),
          accessUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
        },
      });
    }

    // 🔴 TypeScript ko khush rakhne ke liye check
    if (!transporter) {
      return NextResponse.json({ error: "Invalid email provider setup." }, { status: 400 });
    }

    // 4. 🟢 VIP JADOO: Custom Message Formatting
    // Agar employer ne apna template diya hai toh wo use karo, warna default use karo
    const defaultTemplate = `Hi {{candidate_name}},\n\nCongratulations! We would like to invite you for an interview for the {{job_title}} position at {{company_name}}.\n\nPlease select a date and time that works best for you using our scheduling link below:\n\nLooking forward to speaking with you!`;
    
    const rawMessage = company.interview_template || defaultTemplate;

    // Smart Variables ko asli data se replace karna aur Line Breaks ko HTML mein convert karna
    const formattedMessage = rawMessage
      .replace(/\{\{candidate_name\}\}/gi, candidateName)
      .replace(/\{\{job_title\}\}/gi, jobTitle)
      .replace(/\{\{company_name\}\}/gi, companyName || 'our company')
      .replace(/\n/g, '<br/>'); // Enters (line breaks) ko <br/> banata hai taake email design na toote

    // 5. Professional HTML Email Template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">Interview Invitation 📅</h2>
        
        <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          ${formattedMessage}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${bookingLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Schedule Your Interview
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          Powered by HireSkys ATS
        </p>
      </div>
    `;

    // 6. Send the Email DIRECTLY from Employer's connected account!
    const info = await transporter.sendMail({
        from: `"${companyName} (via HireSkys)" <${integration.email}>`,
        to: candidateEmail,
        subject: `Interview Invitation: ${jobTitle} at ${companyName}`,
        html: emailHtml,
    });
    console.log("Email sent perfectly via NATIVE GMAIL OAUTH! ID: ", info.messageId);

    return NextResponse.json({ success: true, message: "Interview email sent successfully!" });

  } catch (error: any) {
    console.error("Native Email Sending Error:", error);
    return NextResponse.json({ error: "Failed to send email via Google Account." }, { status: 500 });
  }
}