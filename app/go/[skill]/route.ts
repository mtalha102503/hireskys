// app/go/[skill]/route.ts
import { NextResponse } from 'next/server';
import { getCourseForSkill } from '@/lib/courseDirectory';

export async function GET(
  request: Request,
  // 🚨 FIX: Params ab ek Promise ban chuka hai
  { params }: { params: Promise<{ skill: string }> } 
) {
  try {
    // 🚨 FIX: Yahan 'await' lagana zaroori hai naye Next.js mein
    const resolvedParams = await params; 
    const skillName = resolvedParams.skill;
    
    // Safety check agar skill URL mein na ho
    if (!skillName) {
      return NextResponse.redirect(new URL('/#jobs', request.url));
    }

    const course = getCourseForSkill(skillName);

    if (course && course.affiliateUrl) {
      return NextResponse.redirect(course.affiliateUrl);
    }

    return NextResponse.redirect(new URL('/#jobs', request.url));
  } catch (error) {
    console.error("Redirect Error:", error);
    return NextResponse.redirect(new URL('/#jobs', request.url));
  }
}