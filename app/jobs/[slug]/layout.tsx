import type { Metadata } from "next";
import { createClient } from '@supabase/supabase-js';
import { createSlug } from '@/lib/utils'; // 👈 Ye line add karo
import { permanentRedirect } from 'next/navigation';
// 🛠️ CONFIGURATION
const SUPABASE_URL = "https://pxtifojzsouujkfxpohq.supabase.co";
const SUPABASE_KEY = "sb_publishable_8Pwl1r9B_H8rlTUODhMbdw_9uYLkhMJ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const revalidate = 86400;

// ✅ Fix for Next.js 15/16 (Params as Promise)
type Props = {
  params: Promise<{ slug: string }>; // id -> slug
};

// ---------------------------------------------------------
// 1️⃣ METADATA GENERATOR (Browser Tab, Google Snippet, Social Cards)
// ---------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  // 👇 SLUG SE ID NIKALNE KA LOGIC
  const slugParts = resolvedParams.slug.split('-'); 
  const jobId = slugParts[slugParts.length - 1]; // Last part ID hai

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (!job) {
    return {
      title: "Job Not Found | HireSkys",
      description: "This job post is no longer available.",
      robots: { index: false, follow: false }
    };
  }

  // 🔥 SEO UPDATE: Social Media aur Browser Tab ke liye exact company name fetch karna
  // 👇 FIX: Yahan 'job.source' add kiya hai kyunke DB mein company ka naam 'source' column mein hai
  const companyIdentifier = job.source || job.company_name || job.company;
  let exactCompanyName = companyIdentifier || "Confidential";

  // Agar galti se DB mein "HireSkys" aa raha ho toh usko hide karne ka filter
  if (exactCompanyName.toLowerCase() === "hireskys") {
      exactCompanyName = "Confidential";
  }

  if (companyIdentifier) {
    const companySlug = companyIdentifier.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    // Yahan sirf name chahiye meta tags ke liye
    const { data: companyData } = await supabase
      .from('companies')
      .select('name') 
      .eq('slug', companySlug)
      .maybeSingle();

    if (companyData) {
      exactCompanyName = companyData.name;
    }
  }

  const correctSlug = createSlug(job.title, job.id); 
  const seoUrl = `https://www.hireskys.com/jobs/${correctSlug}`;
  
  // ✨ FIX: Ab page title aur description mein exact name use hoga
  const pageTitle = `${job.title} ${exactCompanyName !== "Confidential" ? `at ${exactCompanyName}` : ''} | HireSkys`;
  const summary = `Hiring: ${job.title} at ${exactCompanyName}. Category: ${job.category}. ${job.location === 'Remote' ? '🌍 Remote Work' : `📍 ${job.location}`}. Salary: ${job.salary_range || 'Competitive'}. Apply securely via HireSkys.`;
  const jobImage = "https://www.hireskys.com/og-job-card.png"; // Future dynamic image

  return {
    title: { absolute: pageTitle }, // 👈 'absolute' Next.js ko order dega ke kisi aur layout ka text add na kare
    description: summary,
    keywords: [
      job.category, 
      "Remote Job", 
      "Hiring", 
      job.title, 
      "HireSkys", 
      "Freelance", 
      "Full Time", 
      job.tags?.join(", ") || "Tech Job"
    ],
    // ✨ FIX: Author mein exact name!
    authors: [{ name: "HireSkys Bot" }, { name: exactCompanyName }],
    category: "Employment",
    
    // Canonical URL
    alternates: {
      canonical: seoUrl, 
    },

    // OpenGraph (Facebook, LinkedIn, Discord)
    openGraph: {
      title: pageTitle,
      description: summary,
      url: seoUrl,
      siteName: 'HireSkys - Elite Job Radar',
      locale: 'en_US',
      type: 'website', 
      images: [
        {
          url: jobImage,
          width: 1200,
          height: 630,
          alt: `${job.title} Job Post`,
        },
      ],
    },

    // Twitter Card (X.com)
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: summary,
      creator: '@HireSkys', 
      images: [jobImage],
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ---------------------------------------------------------
// 2️⃣ LAYOUT COMPONENT (Injects Schema & Wraps Page)
// ---------------------------------------------------------

// 🌍 GLOBAL COUNTRY MAP (Schema ke liye 2-letter ISO codes zaroori hain)
const COUNTRY_MAP: Record<string, string> = {
    // A
    "AFGHANISTAN": "AF", "AF": "AF",
    "ALBANIA": "AL", "AL": "AL",
    "ALGERIA": "DZ", "DZ": "DZ",
    "ANDORRA": "AD", "AD": "AD",
    "ANGOLA": "AO", "AO": "AO",
    "ANTIGUA AND BARBUDA": "AG", "AG": "AG",
    "ARGENTINA": "AR", "AR": "AR",
    "ARMENIA": "AM", "AM": "AM",
    "AUSTRALIA": "AU", "AU": "AU",
    "AUSTRIA": "AT", "AT": "AT",
    "AZERBAIJAN": "AZ", "AZ": "AZ",

    // B
    "BAHAMAS": "BS", "BS": "BS",
    "BAHRAIN": "BH", "BH": "BH",
    "BANGLADESH": "BD", "BD": "BD",
    "BARBADOS": "BB", "BB": "BB",
    "BELARUS": "BY", "BY": "BY",
    "BELGIUM": "BE", "BE": "BE",
    "BELIZE": "BZ", "BZ": "BZ",
    "BENIN": "BJ", "BJ": "BJ",
    "BHUTAN": "BT", "BT": "BT",
    "BOLIVIA": "BO", "BO": "BO",
    "BOSNIA AND HERZEGOVINA": "BA", "BOSNIA": "BA", "BA": "BA",
    "BOTSWANA": "BW", "BW": "BW",
    "BRAZIL": "BR", "BR": "BR",
    "BRUNEI": "BN", "BN": "BN",
    "BULGARIA": "BG", "BG": "BG",
    "BURKINA FASO": "BF", "BF": "BF",
    "BURUNDI": "BI", "BI": "BI",

    // C
    "CABO VERDE": "CV", "CAPE VERDE": "CV", "CV": "CV",
    "CAMBODIA": "KH", "KH": "KH",
    "CAMEROON": "CM", "CM": "CM",
    "CANADA": "CA", "CA": "CA",
    "CENTRAL AFRICAN REPUBLIC": "CF", "CAR": "CF", "CF": "CF",
    "CHAD": "TD", "TD": "TD",
    "CHILE": "CL", "CL": "CL",
    "CHINA": "CN", "CN": "CN",
    "COLOMBIA": "CO", "CO": "CO",
    "COMOROS": "KM", "KM": "KM",
    "CONGO": "CG", "CG": "CG",
    "DEMOCRATIC REPUBLIC OF THE CONGO": "CD", "DRC": "CD", "CD": "CD",
    "COSTA RICA": "CR", "CR": "CR",
    "CROATIA": "HR", "HR": "HR",
    "CUBA": "CU", "CU": "CU",
    "CYPRUS": "CY", "CY": "CY",
    "CZECH REPUBLIC": "CZ", "CZECHIA": "CZ", "CZ": "CZ",

    // D
    "DENMARK": "DK", "DK": "DK",
    "DJIBOUTI": "DJ", "DJ": "DJ",
    "DOMINICA": "DM", "DM": "DM",
    "DOMINICAN REPUBLIC": "DO", "DO": "DO",

    // E
    "ECUADOR": "EC", "EC": "EC",
    "EGYPT": "EG", "EG": "EG",
    "EL SALVADOR": "SV", "SV": "SV",
    "EQUATORIAL GUINEA": "GQ", "GQ": "GQ",
    "ERITREA": "ER", "ER": "ER",
    "ESTONIA": "EE", "EE": "EE",
    "ESWATINI": "SZ", "SWAZILAND": "SZ", "SZ": "SZ",
    "ETHIOPIA": "ET", "ET": "ET",

    // F
    "FIJI": "FJ", "FJ": "FJ",
    "FINLAND": "FI", "FI": "FI",
    "FRANCE": "FR", "FR": "FR",

    // G
    "GABON": "GA", "GA": "GA",
    "GAMBIA": "GM", "GM": "GM",
    "GEORGIA": "GE", "GE": "GE",
    "GERMANY": "DE", "DEUTSCHLAND": "DE", "DE": "DE",
    "GHANA": "GH", "GH": "GH",
    "GREECE": "GR", "GR": "GR",
    "GRENADA": "GD", "GD": "GD",
    "GUATEMALA": "GT", "GT": "GT",
    "GUINEA": "GN", "GN": "GN",
    "GUINEA-BISSAU": "GW", "GW": "GW",
    "GUYANA": "GY", "GY": "GY",

    // H
    "HAITI": "HT", "HT": "HT",
    "HONDURAS": "HN", "HN": "HN",
    "HUNGARY": "HU", "HU": "HU",

    // I
    "ICELAND": "IS", "IS": "IS",
    "INDIA": "IN", "IN": "IN",
    "INDONESIA": "ID", "ID": "ID",
    "IRAN": "IR", "IR": "IR",
    "IRAQ": "IQ", "IQ": "IQ",
    "IRELAND": "IE", "IE": "IE",
    "ISRAEL": "IL", "IL": "IL",
    "ITALY": "IT", "IT": "IT",
    "IVORY COAST": "CI", "COTE D'IVOIRE": "CI", "CI": "CI",

    // J
    "JAMAICA": "JM", "JM": "JM",
    "JAPAN": "JP", "JP": "JP",
    "JORDAN": "JO", "JO": "JO",

    // K
    "KAZAKHSTAN": "KZ", "KZ": "KZ",
    "KENYA": "KE", "KE": "KE",
    "KIRIBATI": "KI", "KI": "KI",
    "KOSOVO": "XK", "XK": "XK",
    "KUWAIT": "KW", "KW": "KW",
    "KYRGYZSTAN": "KG", "KG": "KG",

    // L
    "LAOS": "LA", "LA": "LA",
    "LATVIA": "LV", "LV": "LV",
    "LEBANON": "LB", "LB": "LB",
    "LESOTHO": "LS", "LS": "LS",
    "LIBERIA": "LR", "LR": "LR",
    "LIBYA": "LY", "LY": "LY",
    "LIECHTENSTEIN": "LI", "LI": "LI",
    "LITHUANIA": "LT", "LT": "LT",
    "LUXEMBOURG": "LU", "LU": "LU",

    // M
    "MADAGASCAR": "MG", "MG": "MG",
    "MALAWI": "MW", "MW": "MW",
    "MALAYSIA": "MY", "MY": "MY",
    "MALDIVES": "MV", "MV": "MV",
    "MALI": "ML", "ML": "ML",
    "MALTA": "MT", "MT": "MT",
    "MARSHALL ISLANDS": "MH", "MH": "MH",
    "MAURITANIA": "MR", "MR": "MR",
    "MAURITIUS": "MU", "MU": "MU",
    "MEXICO": "MX", "MX": "MX",
    "MICRONESIA": "FM", "FM": "FM",
    "MOLDOVA": "MD", "MD": "MD",
    "MONACO": "MC", "MC": "MC",
    "MONGOLIA": "MN", "MN": "MN",
    "MONTENEGRO": "ME", "ME": "ME",
    "MOROCCO": "MA", "MA": "MA",
    "MOZAMBIQUE": "MZ", "MZ": "MZ",
    "MYANMAR": "MM", "BURMA": "MM", "MM": "MM",

    // N
    "NAMIBIA": "NA", "NA": "NA",
    "NAURU": "NR", "NR": "NR",
    "NEPAL": "NP", "NP": "NP",
    "NETHERLANDS": "NL", "HOLLAND": "NL", "NL": "NL",
    "NEW ZEALAND": "NZ", "NZ": "NZ",
    "NICARAGUA": "NI", "NI": "NI",
    "NIGER": "NE", "NE": "NE",
    "NIGERIA": "NG", "NG": "NG",
    "NORTH KOREA": "KP", "KP": "KP",
    "NORTH MACEDONIA": "MK", "MACEDONIA": "MK", "MK": "MK",
    "NORWAY": "NO", "NO": "NO",

    // O
    "OMAN": "OM", "OM": "OM",

    // P
    "PAKISTAN": "PK", "PK": "PK",
    "PALAU": "PW", "PW": "PW",
    "PALESTINE": "PS", "PS": "PS",
    "PANAMA": "PA", "PA": "PA",
    "PAPUA NEW GUINEA": "PG", "PNG": "PG", "PG": "PG",
    "PARAGUAY": "PY", "PY": "PY",
    "PERU": "PE", "PE": "PE",
    "PHILIPPINES": "PH", "PH": "PH",
    "POLAND": "PL", "PL": "PL",
    "PORTUGAL": "PT", "PT": "PT",

    // Q
    "QATAR": "QA", "QA": "QA",

    // R
    "ROMANIA": "RO", "RO": "RO",
    "RUSSIA": "RU", "RU": "RU",
    "RWANDA": "RW", "RW": "RW",

    // S
    "SAINT KITTS AND NEVIS": "KN", "KN": "KN",
    "SAINT LUCIA": "LC", "LC": "LC",
    "SAINT VINCENT AND THE GRENADINES": "VC", "VC": "VC",
    "SAMOA": "WS", "WS": "WS",
    "SAN MARINO": "SM", "SM": "SM",
    "SAO TOME AND PRINCIPE": "ST", "ST": "ST",
    "SAUDI ARABIA": "SA", "KSA": "SA", "SA": "SA",
    "SENEGAL": "SN", "SN": "SN",
    "SERBIA": "RS", "RS": "RS",
    "SEYCHELLES": "SC", "SC": "SC",
    "SIERRA LEONE": "SL", "SL": "SL",
    "SINGAPORE": "SG", "SG": "SG",
    "SLOVAKIA": "SK", "SK": "SK",
    "SLOVENIA": "SI", "SI": "SI",
    "SOLOMON ISLANDS": "SB", "SB": "SB",
    "SOMALIA": "SO", "SO": "SO",
    "SOUTH AFRICA": "ZA", "ZA": "ZA",
    "SOUTH KOREA": "KR", "KR": "KR",
    "SOUTH SUDAN": "SS", "SS": "SS",
    "SPAIN": "ES", "ES": "ES",
    "SRI LANKA": "LK", "LK": "LK",
    "SUDAN": "SD", "SD": "SD",
    "SURINAME": "SR", "SR": "SR",
    "SWEDEN": "SE", "SE": "SE",
    "SWITZERLAND": "CH", "CH": "CH",
    "SYRIA": "SY", "SY": "SY",

    // T
    "TAIWAN": "TW", "TW": "TW",
    "TAJIKISTAN": "TJ", "TJ": "TJ",
    "TANZANIA": "TZ", "TZ": "TZ",
    "THAILAND": "TH", "TH": "TH",
    "TIMOR-LESTE": "TL", "EAST TIMOR": "TL", "TL": "TL",
    "TOGO": "TG", "TG": "TG",
    "TONGA": "TO", "TO": "TO",
    "TRINIDAD AND TOBAGO": "TT", "TT": "TT",
    "TUNISIA": "TN", "TN": "TN",
    "TURKEY": "TR", "TURKIYE": "TR", "TR": "TR",
    "TURKMENISTAN": "TM", "TM": "TM",
    "TUVALU": "TV", "TV": "TV",

    // U
    "UGANDA": "UG", "UG": "UG",
    "UKRAINE": "UA", "UA": "UA",
    "UAE": "AE", "UNITED ARAB EMIRATES": "AE", "DUBAI": "AE", "AE": "AE",
    "UK": "GB", "UNITED KINGDOM": "GB", "GB": "GB", "LONDON": "GB",
    "USA": "US", "UNITED STATES": "US", "US": "US",
    "URUGUAY": "UY", "UY": "UY",
    "UZBEKISTAN": "UZ", "UZ": "UZ",

    // V
    "VANUATU": "VU", "VU": "VU",
    "VATICAN CITY": "VA", "VATICAN": "VA", "VA": "VA",
    "VENEZUELA": "VE", "VE": "VE",
    "VIETNAM": "VN", "VN": "VN",

    // W, Y, Z
    "YEMEN": "YE", "YE": "YE",
    "ZAMBIA": "ZM", "ZM": "ZM",
    "ZIMBABWE": "ZW", "ZW": "ZW",

    // Famous Territories / Commonly searched
    "HONG KONG": "HK", "HK": "HK",
    "MACAU": "MO", "MO": "MO",
    "PUERTO RICO": "PR", "PR": "PR",
    "GREENLAND": "GL", "GL": "GL",

    // GLOBAL / WORLDWIDE
    "GLOBAL": "GLOBAL", "WORLDWIDE": "GLOBAL", "ANYWHERE": "GLOBAL"
};

// 🟢 STRING PARSER FOR GOOGLE SCHEMA
const parseLocationForSchema = (locationString: string) => {
    if (!locationString) return [];
    
    let cleanStr = locationString.replace(/Remote\s*/i, '').trim();
    if (cleanStr.startsWith('(') && cleanStr.endsWith(')')) {
        cleanStr = cleanStr.slice(1, -1).trim();
    }

    const parsedLocations: { city: string | null, countryCode: string }[] = [];
    const regex = /([a-zA-Z\s]+)(?:\(([^)]+)\))?/g;
    let match;

    while ((match = regex.exec(cleanStr)) !== null) {
        const countryName = match[1].trim().replace(/^,|,$/g, '').trim(); 
        if (!countryName || countryName.toLowerCase() === 'and') continue;

        const isoCode = COUNTRY_MAP[countryName.toUpperCase()] || null;
        const cities = match[2] ? match[2].split(',').map(c => c.trim()) : [];
        
        if (cities.length > 0) {
            cities.forEach(city => {
                parsedLocations.push({ city: city, countryCode: isoCode || countryName });
            });
        } else {
            parsedLocations.push({ city: null, countryCode: isoCode || countryName });
        }
    }
    return parsedLocations;
};

// Params type mein 'slug' kar diya
export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  // 👇 YAHAN BHI ID NIKALO
  const slugParts = resolvedParams.slug.split('-');
  const jobId = slugParts[slugParts.length - 1];

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId) // ✅ Correct ID Query
    .single();

  if (!job) return <>{children}</>;
// 🔥 SEO UPDATE: Fetch exact company logo & website
  let exactLogo = null;
  let exactWebsite = null;

  // 👇 FIX: Yahan bhi 'job.source' add karna zaroori hai
  const companyIdentifier = job.source || job.company_name || job.company; 
  let exactCompanyName = companyIdentifier || "Confidential";

  if (companyIdentifier) {
    const companySlug = companyIdentifier.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    // ✨ FIX 1: Humne 'name' column ko bhi select mein add kar diya
    const { data: companyData } = await supabase
      .from('companies')
      .select('name, logo_url, website') 
      .eq('slug', companySlug)
      .maybeSingle();

    if (companyData) {
      // ✨ FIX 2: Ab hum exact real name (e.g., '1Password') Companies table se uthayenge
      exactCompanyName = companyData.name; 
      exactLogo = companyData.logo_url;
      exactWebsite = companyData.website;
    } else {
      // Agar companies table mein match nahi mila toh purana naam use kar lo
      exactCompanyName = companyIdentifier;
    }
  }
  // 🚀 SEO PHASE 2 & 3 LOGIC START
  const jobDate = new Date(job.date_posted);
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const isExpired = diffDays > 60 || job.active === false;

  let googleEmploymentType = "FULL_TIME"; // Default
  if (job.employment_type) { // Maan lo DB column ka naam employment_type hai
      const type = job.employment_type.toLowerCase();
      if (type.includes('part')) googleEmploymentType = "PART-TIME";
      else if (type.includes('contract') || type.includes('freelance')) googleEmploymentType = "CONTRACTOR";
      else if (type.includes('temp')) googleEmploymentType = "TEMPORARY";
      else if (type.includes('intern')) googleEmploymentType = "INTERNSHIP";
      // Agar 'Full Time' hai to default FULL_TIME hi rahega
  }

  
const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Jobs',
        'item': 'https://www.hireskys.com/jobs'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': job.category,
        'item': `https://www.hireskys.com/jobs?category=${encodeURIComponent(job.category)}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': job.title,
        'item': `https://www.hireskys.com/jobs/${createSlug(job.title, job.id)}`
      }
    ]
  };

  const salaryNumbers = job.salary_range?.match(/\d+/g)?.map(Number);
  const minSalary = salaryNumbers ? salaryNumbers[0] : null;
  const maxSalary = salaryNumbers && salaryNumbers[1] ? salaryNumbers[1] : null;

// 🌟 SMART LOCATION EXTRACTION FOR SCHEMA
  const parsedSchemaLocations = parseLocationForSchema(job.location);
  const isRemote = job.location?.toLowerCase().includes('remote');

  const googleJobLocations = parsedSchemaLocations.length > 0 ? parsedSchemaLocations.map(loc => {
      const locObj: any = { '@type': 'Place', 'address': { '@type': 'PostalAddress' } };
      if (loc.countryCode === 'GLOBAL') return null;
      if (loc.city) locObj.address.addressLocality = loc.city;
      if (loc.countryCode) locObj.address.addressCountry = loc.countryCode;
      if (!loc.city && !loc.countryCode) locObj.address.addressCountry = "US"; // Fallback
      return locObj;
  }).filter(Boolean) : [{ '@type': 'Place', 'address': { '@type': 'PostalAddress', 'addressCountry': 'US' } }];

  let applicantReqs = parsedSchemaLocations
      .filter(loc => loc.countryCode && loc.countryCode !== 'GLOBAL')
      .map(loc => ({ '@type': 'Country', 'name': loc.countryCode }));

  // 🔥 THE MASTER PLAN: Global Multi-Market Domination
  // Agar job Globally available hai (ya location specify nahi hai), toh hum usko Duniya ki Top 6 Tech Markets mein rank karwayenge.
  const isGlobal = job.location?.toLowerCase().includes('global') || 
                   job.location?.toLowerCase().includes('worldwide') || 
                   job.location?.toLowerCase().includes('anywhere') || 
                   (isRemote && applicantReqs.length === 0);

  if (isGlobal) {
      applicantReqs = [
          { '@type': 'Country', 'name': 'US' }, // United States (Top Tier Traffic)
          { '@type': 'Country', 'name': 'GB' }, // United Kingdom
          { '@type': 'Country', 'name': 'CA' }, // Canada
          { '@type': 'Country', 'name': 'AU' }, // Australia
          { '@type': 'Country', 'name': 'IN' }, // India (Massive Developer Base)
          { '@type': 'Country', 'name': 'DE' }  // Germany (Top EU Market)
      ];
  }

  // 🌟 GOOGLE JOBS SCHEMA (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description, 
    datePosted: job.date_posted,
    validThrough: isExpired 
        ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString() 
        : new Date(new Date(job.date_posted).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: googleEmploymentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: exactCompanyName,
      ...(exactLogo && { logo: exactLogo }),
      ...(exactWebsite && { sameAs: exactWebsite })
    },
    jobLocation: googleJobLocations.length > 0 ? googleJobLocations : undefined,
    ...(minSalary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: minSalary,      
          minValue: minSalary,   
          maxValue: maxSalary || minSalary, 
          unitText: 'YEAR'
        }
      }
    }),
    ...(applicantReqs.length > 0 && { applicantLocationRequirements: applicantReqs }),
    ...(isRemote && { jobLocationType: 'TELECOMMUTE' })
  };

  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Page Content */}
      {children}
    </>
  );
}
