import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { stage, testData, userAnswers, userResponse, skill, userId } = await req.json();
    let passed = false;
    let newScore = 0;
    let feedback = "";

    // --- LEVEL 1: EASY (3 Questions) ---
    if (stage === 'easy') {
        let correct = 0;
        testData.questions.forEach((q: any, i: number) => {
            if (userAnswers[i] === q.correct_answer_index) correct++;
        });
        
        // Pass if 2 out of 3 are correct
        if (correct >= 2) {
            passed = true;
            newScore = 4; // User reaches Level 2
            feedback = "Easy level cleared! Promoting to Medium.";
        } else {
            feedback = "Failed Easy Level. Try again.";
        }
    }

    // --- LEVEL 2: MEDIUM (5 Questions) ---
    else if (stage === 'medium') {
        let correct = 0;
        testData.questions.forEach((q: any, i: number) => {
            if (userAnswers[i] === q.correct_answer_index) correct++;
        });

        // Pass if 3 out of 5 are correct
        if (correct >= 3) {
            passed = true;
            newScore = 6; // User reaches Level 3
            feedback = "Medium level cleared! Promoting to Hard.";
        } else {
            // Fail hua to score update nahi hoga (purana 4 hi rahega)
            feedback = "Failed Medium Level. You need to restart this level.";
        }
    }

    // --- LEVEL 3: HARD (Practical) ---
    else if (stage === 'hard') {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Task: ${testData.practical.description}
            User Response: ${userResponse}
            Rate this on a scale of 0 to 4 based on accuracy and quality. 
            Return ONLY the number.
        `;
        const result = await model.generateContent(prompt);
        const addedPoints = parseInt(result.response.text().replace(/[^0-9]/g, '')) || 0;
        
        // Base score 6 + points earned (0-4) = Final Score (6-10)
        newScore = 6 + addedPoints;
        
        if (newScore >= 9) {
            passed = true;
            feedback = "Certified Expert!";
        } else {
            feedback = `Score: ${newScore}/10. You need 9+ to get the badge.`;
        }
    }

    // --- DB UPDATE (Only if Passed) ---
    if (userId && passed) {
        await supabase.from('user_skills').upsert({
            user_id: userId,
            skill_name: skill,
            proficiency_score: newScore, // 4, 6, or 9/10
            last_tested_at: new Date().toISOString()
        }, { onConflict: 'user_id, skill_name' });
    }

    return NextResponse.json({ passed, newScore, feedback });

  } catch (error) {
    return NextResponse.json({ error: "Eval Error" }, { status: 500 });
  }
}