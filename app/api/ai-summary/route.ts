import { createClient } from '@/utils/supabase/server';
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

// Check API Key
if (!process.env.GROQ_API_KEY) {
  console.error("🚨 ERROR: GROQ_API_KEY is missing");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { jobDescription, jobTitle } = await req.json();

    // 1. User Session Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 🕵️‍♂️ DEBUG: User ID print karo terminal me
    console.log("🔍 API User Check:", user ? `Found (${user.id})` : "No User");

    let userProfile: any = null;
    let userStatus = "GUEST"; // Default

    // 2. Fetch Profile
    if (user) {
      userStatus = "EMPTY"; // Login hai, assume empty first

      // 👇 IMPORTANT: 'maybeSingle' use karo taake error na phate agar row na mile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, bio, skills, projects, experience') 
        .eq('id', user.id)
        .maybeSingle(); 
      
      if (profileError) {
          console.error("⚠️ Database Error:", profileError.message);
      }

      if (profile) {
        userProfile = profile;
        console.log("✅ Profile Loaded:", profile.full_name);

        // Data Validation Logic
        const hasBio = profile.bio && profile.bio.length > 5;
        // Screenshot me projects/skills text array ya jsonb ho skte hain. Array check safe hai.
        const hasProjects = profile.projects && (Array.isArray(profile.projects) ? profile.projects.length > 0 : Object.keys(profile.projects || {}).length > 0);
        const hasSkills = profile.skills && (Array.isArray(profile.skills) ? profile.skills.length > 0 : JSON.stringify(profile.skills).length > 2);

        if (hasBio && hasProjects && hasSkills) {
          userStatus = "FULL";
        } else if (hasProjects || hasSkills || hasBio) {
          userStatus = "PARTIAL";
        }
      } else {
         console.warn("⚠️ User logged in but NO PROFILE ROW found in DB");
      }
    }

    console.log("📊 Final AI Context Status:", userStatus);

    // 3. THE SUPER TRAINED PROMPT 🧠🔥
    const systemPrompt = `
      You are 'HireSkys AI', an elite Technical Recruiter and Career Coach. 
      Your job is to analyze a Job Description (JD) and match it with a User's Profile.

      **INPUT CONTEXT:**
      - **Job Title:** ${jobTitle}
      - **User Status:** ${userStatus}
      - **User Profile:** ${userProfile ? JSON.stringify(userProfile) : "N/A"}

      **RESPONSE STRUCTURE:**

      ### 🎯 Role Snapshot
      (2 sentences explaining what this job REALLY is about. Cut the corporate jargon.)

      ### 🔑 Key Requirements
      (Extract top 3-4 absolute must-have skills/technologies from the description. Use bullet points.)

      ### 🚀 Your Fit Analysis
      (This is the most important part. Customize based on USER STATUS:)

      * **IF STATUS = GUEST:** "I can't see your profile yet! 🙈 To get a personalized match score and see if your skills fit this role, please **[Log In](/login)**. Trust me, it's worth it."

      * **IF STATUS = EMPTY:**
        "I see you're logged in, but your profile is a ghost town! 🕸️ I can't match you without data. Please **[Update Your Profile](https://www.hireskys.com/profile)** with skills and projects so I can help you land this."

      * **IF STATUS = PARTIAL:**
        "You have some skills listed, but your profile is incomplete (missing Projects/Bio). Employers love proof of work. Add your projects to increase your chances!"

      * **IF STATUS = FULL:**
        - **Match Score:** (Give a score like 8/10 or "High Match" based on skills match).
        - **Why it fits:** "Your experience with [Skill X] and your project [Project Name] makes you a strong candidate."
        - **Gap Analysis:** "However, this job asks for [Missing Skill Y], which I didn't see in your profile. You might want to address this in your cover letter."

      ### 💡 HireSkys Pro Tip
      (One final golden nugget of advice.)

      **TONE:** Professional, Smart, yet "Bro-to-Bro" friendly. Use Markdown.
      
      **JOB DESCRIPTION:**
      ${jobDescription ? jobDescription.slice(0, 4000) : "No description provided."}
    `;

    // 4. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: systemPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    return NextResponse.json({ analysis: completion.choices[0].message.content });

  } catch (error: any) {
    console.error("❌ Critical AI Error:", error);
    return NextResponse.json({ error: 'AI Brain Freeze: ' + error.message }, { status: 500 });
  }
}
