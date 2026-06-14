import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer'; // 👈 Nodemailer import kiya

// Secure Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, role, employerId } = await request.json();

    if (!email || !role || !employerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. 🟢 VIP ADDITION: Company ka naam nikalna taake email branded lage
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('name')
      .eq('employer_id', employerId)
      .single();

    const companyName = company?.name || "their workspace";

    // 2. Check karo agar pehle se invite bheja hua hai
    const { data: existingUser } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('employer_id', employerId)
      .eq('email', cleanEmail)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "This user is already invited or in your team." }, { status: 400 });
    }

    // 3. Database mein naya invite save karo
    const { data: newInvite, error: insertError } = await supabaseAdmin
      .from('team_members')
      .insert({
        employer_id: employerId,
        email: cleanEmail,
        role: role,
        status: 'pending'
      })
      .select('id')
      .single();

    if (insertError || !newInvite) {
      console.error("Insert Error:", insertError);
      throw new Error("Database error while inviting member.");
    }

    // 4. Magic Invite Link Generate karo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hireskys.com';
    const inviteLink = `${baseUrl}/accept-invite?token=${newInvite.id}`;

    // 5. 🟢 Nodemailer SMTP Transporter Setup
   const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // 👈 Direct hardcode kar diya
      port: 587,                    // 👈 Direct hardcode kar diya
      auth: {
        user: process.env.EMAIL_USER, // 👈 Yeh .env se aayega
        pass: process.env.EMAIL_PASS, // 👈 Yeh .env se aayega
      },
    });

    // 6. ✨ Premium Team Invitation HTML Template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.03em;">HireSkys</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px; font-weight: 500;">Enterprise Applicant Tracking System</p>
        </div>
        
        <h3 style="color: #1e293b; margin-top: 0; font-size: 18px; font-weight: 800;">You've been invited! 👋</h3>
        
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Hello,
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          You have been invited to join the <strong>${companyName}</strong> workspace on HireSkys as an <span style="text-transform: capitalize; font-weight: bold; color: #4f46e5;">${role}</span>.
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Once you accept, you'll be able to collaborate on hiring pipelines, manage job postings, and review candidates together in real-time.
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${inviteLink}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
          If the button above doesn't work, copy and paste this URL into your browser:<br/>
          <a href="${inviteLink}" style="color: #4f46e5; word-break: break-all;">${inviteLink}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
          This invitation was sent to ${cleanEmail}. If you weren't expecting this invite, you can safely ignore this email.
        </p>
      </div>
    `;

    // 7. 🚀 Shoot the Email!
    await transporter.sendMail({
      from: `"HireSkys Team" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: `Join ${companyName} on HireSkys ATS 👥`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: "Invite sent successfully!" });

  } catch (error: any) {
    console.error("Invite API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to send invite" }, { status: 500 });
  }
}
