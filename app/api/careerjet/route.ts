// app/api/careerjet/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const API_KEY = process.env.CAREERJET_API_KEY; 
  if (!API_KEY) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const skills = searchParams.get('skills');
  const location = searchParams.get('location');

  const user_ip = request.headers.get('x-forwarded-for') || '127.0.0.1'; 
  const user_agent = request.headers.get('user-agent') || 'Mozilla/5.0';

  const url = new URL("http://54.225.29.27:5000/api/proxy/careerjet"); 
  
  // 🧠 THE SMART QUERY LOGIC
  let keywords = "remote";
  
  if (skills) {
      // Agar Logged-In user hai toh uski skills + remote
      keywords = `${skills} remote`;
  } else {
      // Agar Logged-Out user hai toh High Salary / Executive level ki jobs
      keywords = "(senior OR lead OR executive OR director) remote";
  }

  url.searchParams.append("keywords", keywords); 
  
  // Agar user ne profile mein location di hai, toh wo filter lagao (Global ke ilawa)
  if (location && location.toLowerCase() !== 'worldwide' && location.toLowerCase() !== 'global') {
      url.searchParams.append("location", location);
  }

  url.searchParams.append("locale_code", "en_US"); 
  url.searchParams.append("user_ip", user_ip); 
  url.searchParams.append("user_agent", user_agent); 
  url.searchParams.append("pagesize", "5"); // Feed ke liye 5 jobs kafi hain

  const basicAuth = Buffer.from(`${API_KEY}:`).toString('base64');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Basic ${basicAuth}`, 
        'Content-Type': 'application/json',
        'Referer': 'https://www.hireskys.com' 
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
