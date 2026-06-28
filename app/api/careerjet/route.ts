import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const API_KEY = process.env.CAREERJET_API_KEY; 
  if (!API_KEY) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  
  // Naye parameters capture karo
  const query = searchParams.get('query');
  const skills = searchParams.get('skills');
  const location = searchParams.get('location');
  const jobType = searchParams.get('jobType');

  const user_ip = request.headers.get('x-forwarded-for') || '127.0.0.1'; 
  const user_agent = request.headers.get('user-agent') || 'Mozilla/5.0';

  const url = new URL("http://54.225.29.27:5000/api/proxy/careerjet"); 
  
  // 🧠 THE SUPER SMART QUERY LOGIC
  let keywordsArray = ["remote"]; // Base keyword hamesha remote rahega

  // 1. Priority: User ne kuch search/filter kiya hai toh wo use karo
  if (query) {
      keywordsArray.push(query);
  } 
  // 2. Fallback 1: Agar search nahi kiya lekin user logged in hai, toh skills use karo
  else if (skills) {
      keywordsArray.push(skills);
  } 
  // 3. Fallback 2: Logged out / no search user ke liye high ticket jobs
  else {
      // ✨ Yahan ek array bana lo queries ka
      const rotationQueries = [
          "(senior OR lead OR executive OR director)",
          "(software OR developer OR engineer)",
          "(marketing OR sales OR growth)",
          "(design OR ui OR ux OR product)",
          "(finance OR accountant OR analyst)",
          "(support OR 'customer success')"
      ];
      
      // Randomly ek query uthao
      const randomQuery = rotationQueries[Math.floor(Math.random() * rotationQueries.length)];
      keywordsArray.push(randomQuery);
  }

  // 4. Job Type (e.g. Freelance, Full-time) add karo
  if (jobType) {
      keywordsArray.push(jobType);
  }

  // Array ko string mein convert kar ke keywords mein daal do
  url.searchParams.append("keywords", keywordsArray.join(" ")); 
  
  // Location Filter
  if (location && location.toLowerCase() !== 'worldwide' && location.toLowerCase() !== 'global') {
      url.searchParams.append("location", location);
  }

  url.searchParams.append("locale_code", "en_US"); 
  url.searchParams.append("user_ip", user_ip); 
  url.searchParams.append("user_agent", user_agent); 
  url.searchParams.append("pagesize", "5"); // Feed ke liye 5 jobs

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
    return NextResponse.json({ error: "Failed to fetch sponsored jobs" }, { status: 500 });
  }
}
