import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCategoryBySkill } from '@/lib/categories';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { skill, stage } = await req.json();
    const category = getCategoryBySkill(skill);

    // ✅ FIX 1: Use 1.5-Flash (Best for speed/stability)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    // ✅ FIX 2: Strict JSON Prompt (Schema hata diya taake errors kam hon)
    const jsonStructure = `
    You are a backend API. Return ONLY raw JSON. Do not use Markdown formatting.
    {
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer_index": 0
        }
      ],
      "practical": {
        "title": "Title",
        "description": "Desc",
        "starter_content": "Code or empty",
        "test_type": "code"
      }
    }
    `;

    let prompt = "";
    if (stage === 'easy') {
        prompt = `Generate 3 Easy MCQ questions for ${skill}. ${jsonStructure}`;
    } else if (stage === 'medium') {
        prompt = `Generate 5 Medium MCQ questions for ${skill}. ${jsonStructure}`;
    } else if (stage === 'hard') {
        let instruction = "practical scenario";
        let isCoding = ["Development", "Mobile App", "New Era (AI)"].includes(category);
        if (isCoding) instruction = "Coding Challenge with starter code";
        else instruction = "Strategy Scenario";
        prompt = `Generate 1 Hard Practical Challenge for ${skill}. ${instruction}. ${jsonStructure}`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // ✅ FIX 3: THE CLEANER (Ye hai wo jaadu)
    // Agar AI ne ```json laga diya to ye usay hata dega
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let data;
    try {
        data = JSON.parse(cleanedText);
    } catch (e) {
        console.error("JSON Clean Failed:", text);
        // Agar ab bhi fail hua to empty array bhej do (Crash nahi hoga)
        return NextResponse.json({ questions: [] }); 
    }

    // Safety Defaults
    if (!data.questions) data.questions = [];
    if (stage === 'hard' && !data.practical) {
        data.practical = { title: "Error", description: "Retry", starter_content: "", test_type: "text" };
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: "Server Error", questions: [] }, { status: 500 });
  }
}