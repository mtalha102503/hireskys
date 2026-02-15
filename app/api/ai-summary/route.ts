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

    // 1. Get User Session
    const { data: { user } } = await supabase.auth.getUser();

    let userProfile = null;
    let userStatus = "GUEST"; // GUEST | EMPTY | PARTIAL | FULL

    // 2. Fetch Detailed Profile if User Exists
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, bio, skills, projects, experience')
        .eq('id', user.id)
        .single();

      if (profile) {
        userProfile = profile;
        const hasBio = profile.bio && profile.bio.length > 10;
        const hasProjects = profile.projects && profile.projects.length > 0;
        const hasSkills = profile.skills && profile.skills.length > 0;

        if (!hasBio && !hasProjects && !hasSkills) {
          userStatus = "EMPTY";
        } else if (!hasProjects || !hasBio) {
          userStatus = "PARTIAL";
        } else {
          userStatus = "FULL";
        }
      }
    }

    // 3. THE SUPER TRAINED PROMPT 🧠🔥
    const systemPrompt = `
      You are 'HireSkys AI', an elite Technical Recruiter and Career Coach. 
      Your job is to analyze a Job Description (JD) and match it with a User's Profile.

      **YOUR GOAL:**
      Provide a highly structured, easy-to-read analysis. Do not just summarize; give actionable insights.

      **INPUT CONTEXT:**
      - **Job Title:** ${jobTitle}
      - **User Status:** ${userStatus}
      - **User Profile:** ${userProfile ? JSON.stringify(userProfile) : "N/A (User not logged in)"}

      **OUTPUT FORMATTING RULES (STRICT):**
      1. Use **Markdown** strictly.
      2. Use **Emojis** to make it engaging but professional.
      3. Use **Bold Headings** for sections.
      4. Keep paragraphs short (2-3 lines max).

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
      (One final golden nugget of advice. E.g., "Mention your experience with X in the first line of your resume" or "This company values Y, highlight that.")

      **TONE:** - Professional, Smart, yet "Bro-to-Bro" friendly. 
      - Concise and direct.
      
      **JOB DESCRIPTION TO ANALYZE:**
      ${jobDescription ? jobDescription.slice(0, 4000) : "No description provided."}
    `;

    // 4. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: systemPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5, // 0.5 rakha taake result focused ho, zyada creative na ho
    });

    return NextResponse.json({ analysis: completion.choices[0].message.content });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'AI Brain Freeze: ' + error.message }, { status: 500 });
  }
}