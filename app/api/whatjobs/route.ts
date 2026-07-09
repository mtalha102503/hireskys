import { NextResponse } from 'next/server';

// 🌍 TUMHARI SARI COUNTRIES KI PUBLISHER IDs
const PUBLISHER_MAP: Record<string, string> = {
  'pakistan': '6975', 'pk': '6975',
  'india': '6976', 'in': '6976',
  'philippines': '6977', 'ph': '6977',
  'united kingdom': '6978', 'uk': '6978', 'gb': '6978',
  'united states': '6979', 'usa': '6979', 'us': '6979',
  'singapore': '6980', 'sg': '6980',
  'default': '6979' // Agar in mein se koi nahi, toh default US
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Frontend se aane wale params
  const query = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';

  // 🕵️ IP & User Agent
  const user_ip = request.headers.get('x-forwarded-for') || '127.0.0.1'; 
  const user_agent = request.headers.get('user-agent') || 'Mozilla/5.0';

  // 🚀 THE MAGIC HEADER (Vercel automatically adds this based on user's real IP)
  const vercelCountryCode = request.headers.get('x-vercel-ip-country') || '';

  let publisherId = PUBLISHER_MAP['default'];
  let targetLocation = '';

  // 🧠 SMART PRIORITY LOGIC (The Geo-Targeting Brain)
  if (location && location.toLowerCase() !== 'worldwide' && location.toLowerCase() !== 'global') {
      // Priority 1: Agar user ne khud filter dropdown se koi location select ki hai
      const locKey = location.toLowerCase();
      if (PUBLISHER_MAP[locKey]) publisherId = PUBLISHER_MAP[locKey];
      targetLocation = location;
  } else if (vercelCountryCode) {
      // Priority 2: Agar filter khali hai, toh automatically IP se country code (e.g., 'PK', 'IN') uthao
      const codeKey = vercelCountryCode.toLowerCase();
      if (PUBLISHER_MAP[codeKey]) publisherId = PUBLISHER_MAP[codeKey];
      
      // Whatjobs ki API ko bhi bata do ke is country ki jobs chahiye
      targetLocation = vercelCountryCode; 
  }

  // 🔗 WHATJOBS API URL BUILDER
  const apiUrl = new URL("https://api.whatjobs.com/api/v1/jobs.json");
  apiUrl.searchParams.append("publisher", publisherId);
  apiUrl.searchParams.append("user_ip", user_ip);
  apiUrl.searchParams.append("user_agent", user_agent);
  apiUrl.searchParams.append("limit", "3");

  // 🎯 KEYWORDS SETTING
  if (query) {
      apiUrl.searchParams.append("keyword", query);
  } else {
      const rotationQueries = [
          "software engineer", "react developer", "marketing", "remote", "data entry", "customer support"
      ];
      apiUrl.searchParams.append("keyword", rotationQueries[Math.floor(Math.random() * rotationQueries.length)]);
  }

  // 📍 FINAL LOCATION FILTER
  if (targetLocation) {
      apiUrl.searchParams.append("location", targetLocation);
  }

  try {
    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    if (data && data.data) {
        // Return karte waqt humein pata chal jayega ke konsa country detect hua tha
        return NextResponse.json({ 
            jobs: data.data, 
            publisher_used: publisherId,
            auto_detected_country: vercelCountryCode || 'Localhost (No IP)'
        });
    } else {
        return NextResponse.json({ jobs: [] });
    }
  } catch (error) {
    console.error("Whatjobs API Error:", error);
    return NextResponse.json({ error: "Failed to fetch sponsored jobs" }, { status: 500 });
  }
}