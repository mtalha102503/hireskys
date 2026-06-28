// app/api/careerjet/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 👇 Yahan process.env se key fetch kar li
  const API_KEY = process.env.CAREERJET_API_KEY; 
  
  if (!API_KEY) {
    return NextResponse.json({ error: "API key is missing in environment variables" }, { status: 500 });
  }

  // 1. Get User Details for Tracking (Bohot Zaroori for Commission)
  const user_ip = request.headers.get('x-forwarded-for') || '127.0.0.1'; 
  const user_agent = request.headers.get('user-agent') || 'Mozilla/5.0';

  // 2. Build the Endpoint URL
  const url = new URL("https://search.api.careerjet.net/v4/query"); 
  url.searchParams.append("keywords", "remote"); 
  url.searchParams.append("locale_code", "en_US"); 
  url.searchParams.append("user_ip", user_ip); 
  url.searchParams.append("user_agent", user_agent); 

  // 3. Create Basic Auth Token
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