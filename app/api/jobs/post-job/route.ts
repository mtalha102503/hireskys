import { NextResponse } from 'next/server';
// ❌ Purane client ko hata do ya use mat karo
// import { supabase } from '@/lib/supabaseClient'; 
import { createClient } from '@supabase/supabase-js';
import { getAuthedUser } from '@/lib/apiAuth';

export async function POST(req: Request) {
  try {
    const { employerId, companyName, contactEmail, jobData, isUrgent } = await req.json();

    if (!employerId) {
      return NextResponse.json({ error: "User authentication missing!" }, { status: 400 });
    }

    // 🔐 SECURITY: session verify karo aur employerId caller ka apna hona
    //    chahiye — job posting + credit deduction sirf owner kar sakta hai.
    const authedUser = await getAuthedUser(req);
    if (!authedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authedUser.id !== employerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🟢 VIP Fix: Admin Client banao jo RLS ko bypass kare
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Ye key .env.local me honi chahiye
    );

    const { data: company, error: fetchError } = await supabaseAdmin
      .from('companies')
      .select('slug, free_credits, paid_credits, urgent_credits, plan_tier')
      .eq('employer_id', employerId)
      .single();
   if (fetchError) {
        console.error("Supabase Admin Fetch Error:", fetchError);
        return NextResponse.json({ error: `Database Error: ${fetchError.message}` }, { status: 500 });
    }
    if (fetchError || !company) {
      throw new Error("Company profile nahi mili.");
    }

    let updateFields = {};

    // 2. 🚨 CREDIT DEDUCTION LOGIC
    if (isUrgent) {
      if (company.urgent_credits > 0) {
        updateFields = { urgent_credits: company.urgent_credits - 1 };
      } else {
        return NextResponse.json({ error: "Aapke paas Urgent Job credits nahi hain." }, { status: 402 });
      }
    } else {
      if (company.free_credits > 0) {
        updateFields = { free_credits: company.free_credits - 1 }; // Free se minus
      } else if (company.paid_credits > 0) {
        updateFields = { paid_credits: company.paid_credits - 1 }; // Paid se minus
      } else {
        return NextResponse.json({ error: "Aapke credits khatam ho chuke hain. Please recharge!" }, { status: 402 });
      }
    }

    // 3. Credits database mein update karo
    const { error: updateError } = await supabaseAdmin
      .from('companies')
      .update(updateFields)
      .eq('employer_id', employerId);

    if (updateError) throw updateError;

    // 4. Job ko database mein Insert karo (Saare Naye Fields Ke Sath)
    const { data: insertedJob, error: jobError } = await supabaseAdmin.from('jobs').insert([
      {
        employer_id: employerId,
        title: jobData.title,
        source: companyName,
        slug: jobData.slug,
        link: `https://hireskys.com/jobs/${jobData.slug}/apply`, // Temporary Link
        category: jobData.category,
        tags: jobData.tags,
        description: jobData.description,
        screening_questions: jobData.screeningQuestions,
        location: jobData.location,
        salary_range: jobData.salary,
        job_type: jobData.jobType,
        experience_level: jobData.experience,
        contact_email: contactEmail,
        date_posted: new Date().toISOString(),
        approved: false,
        ats_approved: company.plan_tier === 'Scale' ? true : false,
        is_verified: true,
        form_config: jobData.formConfig
      }
    ]).select().single();

    if (jobError) throw jobError;

    // 5. Database ne jo final slug banaya hai us se Link update karo!
    const finalLink = `https://hireskys.com/jobs/${insertedJob.slug}/apply`;
    await supabaseAdmin.from('jobs').update({ link: finalLink }).eq('id', insertedJob.id);

    // 6. Phase 1: Nayi job ki default pipeline stages seed karo.
    //    Fail ho jaye to job posting NAHI rukti — board default stages par chalti hai.
    try {
      const { error: stageError } = await supabaseAdmin.from('job_stages').insert([
        { job_id: insertedJob.id, name: 'New', kind: 'applied', position: 0, color: 'blue' },
        { job_id: insertedJob.id, name: 'Shortlisted', kind: 'screening', position: 1, color: 'emerald' },
        { job_id: insertedJob.id, name: 'Interview', kind: 'interview', position: 2, color: 'purple' },
        { job_id: insertedJob.id, name: 'Offer', kind: 'offer', position: 3, color: 'amber' },
        { job_id: insertedJob.id, name: 'Hired', kind: 'hired', position: 4, color: 'green' },
        { job_id: insertedJob.id, name: 'Rejected', kind: 'rejected', position: 5, color: 'slate' }
      ]);
      if (stageError) console.error('Stage seeding failed (non-fatal):', stageError.message);
    } catch (stageErr) {
      console.error('Stage seeding failed (non-fatal):', stageErr);
    }

    return NextResponse.json({ success: true, message: "Job successfully posted!", job: insertedJob });

  } catch (error: any) {
    console.error("Job Posting API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}