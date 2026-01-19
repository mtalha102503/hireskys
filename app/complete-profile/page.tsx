"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, CheckCircle, ArrowRight, Loader2, 
  LayoutGrid, Calendar, X 
} from 'lucide-react'; // 'X' icon add kiya skills remove karne ke liye
import Link from 'next/link';
import Navbar from '@/components/Navbar';

// 👇 TUMHARA COUNTRIES DATA (As it is)
const COUNTRIES = [
  // 🌟 Top Priority
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  
  // 🌍 Middle East
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },

  // 🌏 Asia Pacific
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },

  // 🇪🇺 Europe
  { code: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+385", flag: "🇭🇷", name: "Croatia" },
  { code: "+420", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+30", flag: "🇬🇷", name: "Greece" },
  { code: "+36", flag: "🇭🇺", name: "Hungary" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+48", flag: "🇵🇱", name: "Poland" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+40", flag: "🇷🇴", name: "Romania" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },

  // 🌎 Americas
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+51", flag: "🇵🇪", name: "Peru" },

  // 🌍 Africa
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },

  // ➕ Added: Rest of the World (Alphabetical)
  { code: "+93", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+355", flag: "🇦🇱", name: "Albania" },
  { code: "+213", flag: "🇩🇿", name: "Algeria" },
  { code: "+376", flag: "🇦🇩", name: "Andorra" },
  { code: "+244", flag: "🇦🇴", name: "Angola" },
  { code: "+374", flag: "🇦🇲", name: "Armenia" },
  { code: "+297", flag: "🇦🇼", name: "Aruba" },
  { code: "+994", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+1", flag: "🇧🇸", name: "Bahamas" },
  { code: "+1", flag: "🇧🇧", name: "Barbados" },
  { code: "+375", flag: "🇧🇾", name: "Belarus" },
  { code: "+501", flag: "🇧🇿", name: "Belize" },
  { code: "+229", flag: "🇧🇯", name: "Benin" },
  { code: "+1", flag: "🇧🇲", name: "Bermuda" },
  { code: "+975", flag: "🇧🇹", name: "Bhutan" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+387", flag: "🇧🇦", name: "Bosnia & Herzegovina" },
  { code: "+267", flag: "🇧🇼", name: "Botswana" },
  { code: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "+237", flag: "🇨🇲", name: "Cameroon" },
  { code: "+238", flag: "🇨🇻", name: "Cape Verde" },
  { code: "+1", flag: "🇰🇾", name: "Cayman Islands" },
  { code: "+236", flag: "🇨🇫", name: "Central African Republic" },
  { code: "+242", flag: "🇨🇬", name: "Congo - Brazzaville" },
  { code: "+243", flag: "🇨🇩", name: "Congo - Kinshasa" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+53", flag: "🇨🇺", name: "Cuba" },
  { code: "+357", flag: "🇨🇾", name: "Cyprus" },
  { code: "+253", flag: "🇩🇯", name: "Djibouti" },
  { code: "+1", flag: "🇩🇲", name: "Dominica" },
  { code: "+1", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador" },
  { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "+291", flag: "🇪🇷", name: "Eritrea" },
  { code: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+298", flag: "🇫🇴", name: "Faroe Islands" },
  { code: "+679", flag: "🇫🇯", name: "Fiji" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+220", flag: "🇬🇲", name: "Gambia" },
  { code: "+995", flag: "🇬🇪", name: "Georgia" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+350", flag: "🇬🇮", name: "Gibraltar" },
  { code: "+299", flag: "🇬🇱", name: "Greenland" },
  { code: "+1", flag: "🇬🇩", name: "Grenada" },
  { code: "+590", flag: "🇬🇵", name: "Guadeloupe" },
  { code: "+1", flag: "🇬🇺", name: "Guam" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+224", flag: "🇬🇳", name: "Guinea" },
  { code: "+245", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "+592", flag: "🇬🇾", name: "Guyana" },
  { code: "+509", flag: "🇭🇹", name: "Haiti" },
  { code: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+354", flag: "🇮🇸", name: "Iceland" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+225", flag: "🇨🇮", name: "Ivory Coast" },
  { code: "+1", flag: "🇯🇲", name: "Jamaica" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+7", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+371", flag: "🇱🇻", name: "Latvia" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+266", flag: "🇱🇸", name: "Lesotho" },
  { code: "+231", flag: "🇱🇷", name: "Liberia" },
  { code: "+218", flag: "🇱🇾", name: "Libya" },
  { code: "+423", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", flag: "🇱🇹", name: "Lithuania" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+853", flag: "🇲🇴", name: "Macau" },
  { code: "+389", flag: "🇲🇰", name: "North Macedonia" },
  { code: "+261", flag: "🇲🇬", name: "Madagascar" },
  { code: "+265", flag: "🇲🇼", name: "Malawi" },
  { code: "+960", flag: "🇲🇻", name: "Maldives" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+356", flag: "🇲🇹", name: "Malta" },
  { code: "+222", flag: "🇲🇷", name: "Mauritania" },
  { code: "+230", flag: "🇲🇺", name: "Mauritius" },
  { code: "+373", flag: "🇲🇩", name: "Moldova" },
  { code: "+377", flag: "🇲🇨", name: "Monaco" },
  { code: "+976", flag: "🇲🇳", name: "Mongolia" },
  { code: "+382", flag: "🇲🇪", name: "Montenegro" },
  { code: "+1", flag: "🇲🇸", name: "Montserrat" },
  { code: "+258", flag: "🇲🇿", name: "Mozambique" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar (Burma)" },
  { code: "+264", flag: "🇳🇦", name: "Namibia" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "+507", flag: "🇵🇦", name: "Panama" },
  { code: "+675", flag: "🇵🇬", name: "Papua New Guinea" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+1", flag: "🇵🇷", name: "Puerto Rico" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "+685", flag: "🇼🇸", name: "Samoa" },
  { code: "+378", flag: "🇸🇲", name: "San Marino" },
  { code: "+221", flag: "🇸🇳", name: "Senegal" },
  { code: "+381", flag: "🇷🇸", name: "Serbia" },
  { code: "+248", flag: "🇸🇨", name: "Seychelles" },
  { code: "+232", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "+421", flag: "🇸🇰", name: "Slovakia" },
  { code: "+386", flag: "🇸🇮", name: "Slovenia" },
  { code: "+252", flag: "🇸🇴", name: "Somalia" },
  { code: "+211", flag: "🇸🇸", name: "South Sudan" },
  { code: "+249", flag: "🇸🇩", name: "Sudan" },
  { code: "+597", flag: "🇸🇷", name: "Suriname" },
  { code: "+268", flag: "🇸🇿", name: "Eswatini (Swaziland)" },
  { code: "+963", flag: "🇸🇾", name: "Syria" },
  { code: "+886", flag: "🇹🇼", name: "Taiwan" },
  { code: "+992", flag: "🇹🇯", name: "Tajikistan" },
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+670", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+1", flag: "🇹🇹", name: "Trinidad & Tobago" },
  { code: "+216", flag: "🇹🇳", name: "Tunisia" },
  { code: "+993", flag: "🇹🇲", name: "Turkmenistan" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+998", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+967", flag: "🇾🇪", name: "Yemen" },
  { code: "+260", flag: "🇿🇲", name: "Zambia" },
  { code: "+263", flag: "🇿🇼", name: "Zimbabwe" },
];

const CATEGORIES = {
  "Development": ["React", "Next.js", "Node.js", "Python", "Shopify", "WordPress", "Web3", "Frontend", "Backend"],
  "Mobile App": ["React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin"],
  "Video & Motion": ["Video Editor", "Premiere Pro", "After Effects", "3D Artist", "Thumbnail Artist", "Short Form"],
  "Design & UI": ["UI/UX", "Figma", "Web Design", "Logo Design", "Graphic Design"],
  "Marketing": ["SEO", "Facebook Ads", "Google Ads", "Email Marketing", "Copywriter", "Growth"],
  "Writing": ["Ghostwriter", "Technical Writer", "Scriptwriter", "Content Writer"],
  "New Era (AI)": ["AI Engineer", "Automation", "LLM", "Python Script"]
};

export default function CompleteProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // New State for Country Code (Default Pakistan)
  const [selectedCountryCode, setSelectedCountryCode] = useState("+92");
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    whatsapp: '', // Stores only number part
    birth_date: '',
    primary_role: '' 
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
         // 👇 PHONE NUMBER PARSING LOGIC (Fixing the double code issue)
         let initialCode = "+92";
         let initialNumber = "";
         
         if (profile.whatsapp) {
            // Find if existing whatsapp starts with any country code
            const matchedCountry = COUNTRIES.find(c => profile.whatsapp.startsWith(c.code));
            if (matchedCountry) {
                initialCode = matchedCountry.code;
                initialNumber = profile.whatsapp.replace(matchedCountry.code, '');
            } else {
                initialNumber = profile.whatsapp;
            }
         }

         setFormData({
            full_name: profile.full_name || user.user_metadata.full_name || '',
            username: profile.username || user.user_metadata.full_name?.toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_]/g, '') || '',
            whatsapp: initialNumber, // Only the number part
            birth_date: profile.birth_date || '',
            primary_role: profile.primary_role || '' 
         });
         
         setSelectedCountryCode(initialCode);

         // Agar profile mein saved skills hain to load karein (Assuming 'skills' column exists, otherwise ignore)
         if (profile.skills && Array.isArray(profile.skills)) {
            setMySkills(profile.skills);
         }
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  // Skill add karne ka function (UNTOUCHED LOGIC)
  const addSkill = (e: any) => {
      const selected = e.target.value;
      if (selected && !mySkills.includes(selected)) {
          if (mySkills.length >= 5) {
              alert("Bas bhai! 5 Skills kaafi hain."); 
              return;
          }
          setMySkills([...mySkills, selected]);
      }
      e.target.value = ""; // Dropdown wapis reset karo
  };

  // Skill hatane ka function (UNTOUCHED LOGIC)
  const removeSkill = (skillToRemove: string) => {
      setMySkills(mySkills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    if (!formData.username || !formData.whatsapp || !formData.primary_role || !formData.birth_date) {
        alert("Please fill all fields.");
        return;
    }
    setSaving(true);
    
    // 🔗 Merge Country Code + Number
    const fullWhatsApp = `${selectedCountryCode}${formData.whatsapp}`;

    const { error } = await supabase.from('profiles').update({
        username: formData.username,
        whatsapp: fullWhatsApp, // Saved format: +923001234567
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        primary_role: formData.primary_role, 
        skills: mySkills, // Uncomment if you have a skills column
        updated_at: new Date().toISOString()
    }).eq('id', user.id);

    setSaving(false);
    if (!error) setShowSuccess(true);
    else alert("Error: " + error.message);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]"><Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40}/></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="fixed top-0 w-full z-50"><Navbar /></div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-[#151B2B] p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You're All Set! 🚀</h2>
                <p className="text-gray-500 dark:text-slate-400 mb-8 text-sm">Job alerts active for <b className="text-black dark:text-white">{selectedCountryCode} {formData.whatsapp}</b></p>
                <Link href="/" replace className="block w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all">Go to Jobs Feed <ArrowRight className="inline" size={20} /></Link>
            </div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4 relative">
        <div className="max-w-xl w-full relative z-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Finish Setup</h1>
                <p className="text-gray-500 dark:text-slate-400">Join the elite network.</p>
            </div>
            <div className="bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-xl space-y-5">
                
                <div><label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2">Full Name</label>
                <div className="relative"><User className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={18} /><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"/></div></div>

                <div><label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2">Username</label>
                <div className="relative"><span className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500 font-bold">@</span><input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '_')})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-10 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"/></div></div>

                {/* MAIN SKILL */}
                <div><label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2">Main Skill</label>
                <div className="relative"><LayoutGrid className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={18} /><select value={formData.primary_role} onChange={(e) => setFormData({...formData, primary_role: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"><option value="" disabled>Select Skill...</option>{Object.entries(CATEGORIES).map(([cat, skills]) => (<optgroup key={cat} label={cat} className="text-black bg-slate-200">{skills.map(s => <option key={s} value={s} className="bg-white">{s}</option>)}</optgroup>))}</select></div></div>

                {/* 🆕 ADDED MISSING SECTION: TOP 5 SKILLS UI */}
                <div>
                   <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2">Top 5 Secondary Skills</label>
                   <div className="relative">
                      <LayoutGrid className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={18} />
                      <select onChange={addSkill} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                         <option value="">+ Add a skill...</option>
                         {Object.entries(CATEGORIES).map(([cat, skills]) => (
                            <optgroup key={cat} label={cat} className="text-black bg-slate-200">
                               {skills.map(s => <option key={s} value={s} className="bg-white">{s}</option>)}
                            </optgroup>
                         ))}
                      </select>
                   </div>
                   {/* Selected Skills Chips */}
                   <div className="flex flex-wrap gap-2 mt-3">
                      {mySkills.map((skill, index) => (
                         <div key={index} className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                               <X size={14} />
                            </button>
                         </div>
                      ))}
                   </div>
                </div>

                {/* 🌍 COUNTRY CODE INPUT */}
                <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2">WhatsApp Number</label>
                    <div className="flex gap-2">
                        {/* Country Select */}
                        <div className="relative w-32 flex-none">
                            <select 
                                value={selectedCountryCode}
                                onChange={(e) => setSelectedCountryCode(e.target.value)}
                                className="w-full h-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-2 pr-1 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-sm"
                            >
                                {COUNTRIES.map((country, index) => (
                                    <option key={index} value={country.code} className="text-black">
                                        {country.flag} {country.code}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-gray-400">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>

                        {/* Number Input */}
                        <div className="relative flex-grow">
                            <Phone className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={18} />
                            <input 
                                type="tel" 
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/[^0-9]/g, '')})}
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="300 1234567"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <div><label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2">Birth Date</label><div className="relative"><Calendar className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={18} /><input type="date" value={formData.birth_date} onChange={(e) => setFormData({...formData, birth_date: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-11 p-3 rounded-xl outline-none [color-scheme:light] dark:[color-scheme:dark]"/></div></div>
                </div>

                <button onClick={handleSave} disabled={saving} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 font-bold text-lg rounded-xl mt-6 flex justify-center gap-2">{saving ? <Loader2 className="animate-spin"/> : "Complete Setup"}</button>
            </div>
        </div>
      </div>
    </div>
  );
}
