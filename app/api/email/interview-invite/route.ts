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

    // 1. Company ke details, employer ka email aur booking links fetch karo
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('name, email, calendly_url, cal_url, custom_booking_url, interview_template') 
      .eq('employer_id', employerId)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: "Company details not found" }, { status: 404 });
    }

    const bookingLink = company.custom_booking_url || company.cal_url || company.calendly_url;

    if (!bookingLink) {
      return NextResponse.json({ error: "Please add a booking link (Calendly, etc.) in your Integrations Settings first." }, { status: 400 });
    }

    // 2. 🟢 THE REAL MAGIC: Hireskys Official Brevo Transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Custom Message Formatting
    const defaultTemplate = `Hi {{candidate_name}},\n\nCongratulations! We would like to invite you for an interview for the {{job_title}} position at {{company_name}}.\n\nPlease select a date and time that works best for you using our scheduling link below:\n\nLooking forward to speaking with you!`;
    
    const rawMessage = company.interview_template || defaultTemplate;

    // Smart Variables ko replace karo
    const formattedMessage = rawMessage
      .replace(/\{\{candidate_name\}\}/gi, candidateName)
      .replace(/\{\{job_title\}\}/gi, jobTitle)
      .replace(/\{\{company_name\}\}/gi, companyName || 'our company')
      .replace(/\n/g, '<br/>'); 

    // 4. Professional HTML Email Template
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

   // 5. 🚀 Shoot the Email via Brevo (Strict Promise for Vercel)
    await new Promise((resolve, reject) => {
      transporter.sendMail({
        from: `"${companyName} (via HireSkys)" <contact@hireskys.com>`, // 👈 Direct hardcode kar diya
        replyTo: company.email, // 🟢 JADOO: Candidate reply karega toh seedha employer ko jayega!
        to: candidateEmail,
        subject: `Interview Invitation: ${jobTitle} at ${companyName}`,
        html: emailHtml,
      }, (err, info) => {
        if (err) {
          console.error("Brevo Send Error:", err);
          reject(err);
        } else {
          console.log("Brevo Send Success:", info.response);
          resolve(info);
        }
      });
    });

    return NextResponse.json({ success: true, message: "Interview email sent successfully!" });

  } catch (error: any) {
    console.error("Interview Email API Error:", error);
    return NextResponse.json({ error: "Failed to send interview email." }, { status: 500 });
  }
}
