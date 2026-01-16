import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateJobDescription(jobTitle: string, company: string, category: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write a professional, engaging, and structured job description for a "${jobTitle}" role at "${company}".
      Category: ${category}.
      
      Structure needed:
      1. Role Overview (2 lines)
      2. Key Responsibilities (4-5 bullet points)
      3. Requirements (4-5 bullet points)
      4. Why Join Us? (1 line)

      Keep the tone professional yet exciting. Do not include placeholders like "[Insert Date]". Just generate the text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Click 'Apply Now' to view the full description on the official site.";
  }
}