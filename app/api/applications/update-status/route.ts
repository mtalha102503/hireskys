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
    const { applicationId, newStatus, employerId } = await request.json();

    if (!applicationId || !newStatus || !employerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Database mein candidate ka status update karo aur uska purana data nikalo
    const { data: application, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)
      .select('email, full_name, job_id')
      .single();

    if (updateError || !application) {
      console.error("Status Update Error:", updateError);
      return NextResponse.json({ error: "Failed to update status in database" }, { status: 500 });
    }

    // 2. 🎯 ANTI-GHOSTING LOGIC: Agar naya status 'Rejected' hai, toh auto-email bhejo
    if (newStatus === 'Rejected') {
      
      // Job ka Title fetch karo
      const { data: job } = await supabaseAdmin
        .from('jobs')
        .select('title')
        .eq('id', application.job_id)
        .single();

      // Company ka custom rejection_template aur email fetch karo
      const { data: company } = await supabaseAdmin
        .from('companies')
        .select('name, email, rejection_template')
        .eq('employer_id', employerId)
        .single();

      if (company) {
        // Brevo SMTP setup
        const transporter = nodemailer.createTransport({
          host: 'smtp-relay.brevo.com',
          port: 587,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Agar settings mein template khali hai toh yeh default text chalega
        const defaultTemplate = `Hi {{full_name}},\n\nThank you for applying for the {{job_title}} position at {{company_name}}.\n\nWe appreciate the time you took to share your background with us. While your profile has a lot of merit, we have decided to move forward with other candidates whose experience closely matches our current needs.\n\nWe wish you the best of luck in your job search!`;

        const rawMessage = company.rejection_template || defaultTemplate;

        // Smart Variables parsing
        const formattedMessage = rawMessage
          .replace(/\{\{candidate_name\}\}/gi, application.full_name)
          .replace(/\{\{job_title\}\}/gi, job?.title || 'the open position')
          .replace(/\{\{company_name\}\}/gi, company.name || 'our company')
          .replace(/\n/g, '<br/>');

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #e11d48; margin-top: 0;">Application Update 📄</h2>
            
            <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              ${formattedMessage}
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              Powered by HireSkys ATS
            </p>
          </div>
        `;

        // Vercel strict promise wrapper taake mail freeze na ho live server par
        await new Promise((resolve, reject) => {
          transporter.sendMail({
            from: `"${company.name} (via HireSkys)" <contact@hireskys.com>`,
            replyTo: company.email, // Candidate reply karega toh seedha employer ke pass jayega
            to: application.email,
            subject: `Update regarding your application at ${company.name}`,
            html: emailHtml,
          }, (err, info) => {
            if (err) {
              console.error("Rejection Email Failed:", err);
              reject(err);
            } else {
              console.log("Rejection Email Sent perfectly via Brevo:", info.response);
              resolve(info);
            }
          });
        });
      }
    }

    return NextResponse.json({ success: true, message: "Status updated successfully!" });

  } catch (error: any) {
    console.error("Global API Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}