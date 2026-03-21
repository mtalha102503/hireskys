"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, CheckCircle, ArrowRight, Loader2, 
  LayoutGrid, Calendar, X ,MapPin, Building2, Hash, ChevronDown, Briefcase,
  BellRing, Lock, Send // 👈 Ye 2 naye icons add kar lo
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CATEGORIES } from '@/lib/categories'; // 👈 1. IMPORT ADDED

// 👇 TUMHARA COUNTRIES DATA (As it is)
const COUNTRIES = [
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
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
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+51", flag: "🇵🇪", name: "Peru" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
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
].sort((a, b) => a.name.localeCompare(b.name));

// ❌ 2. PURANI HARDCODED CATEGORIES REMOVED
// const CATEGORIES = { ... } (Removed)

export default function CompleteProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
const [alertPreference, setAlertPreference] = useState<'whatsapp' | 'telegram'>('whatsapp'); // 🚀 YEH NAYI STATE HAI
  const [saving, setSaving] = useState(false);
const [telegramClicked, setTelegramClicked] = useState(false); // 🚀 YEH NAYI STATE ADD KARO
  const [showSuccess, setShowSuccess] = useState(false);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
const [countrySearch, setCountrySearch] = useState("");
const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  // New State for Country Code (Default Pakistan)
  const [selectedCountryCode, setSelectedCountryCode] = useState("+92");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    whatsapp: '', // Stores only number part
    birth_date: '',
    primary_role: '',
    country: 'Pakistan', 
    city: '',
    postal_code: '' 
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
         // 👇 PHONE NUMBER PARSING LOGIC
         let initialCode = "+92";
         let initialNumber = "";
         
         if (profile.whatsapp) {
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
            primary_role: profile.primary_role || '' ,
            country: profile.country || 'Pakistan',
    city: profile.city || '',
    postal_code: profile.postal_code || ''
         });
         
         setSelectedCountryCode(initialCode);

         if (profile.skills && Array.isArray(profile.skills)) {
            setMySkills(profile.skills);
         }
         if (profile.primary_role) {
             const foundCategory = Object.keys(CATEGORIES).find(cat => 
                 (CATEGORIES as any)[cat].sub.includes(profile.primary_role)
             );
             if (foundCategory) setSelectedCategory(foundCategory);
         }
      }
      setLoading(false);
    };
    getUser();
  }, [router]);
  const handleCategoryChange = (e: any) => {
      const newCategory = e.target.value;
      setSelectedCategory(newCategory);
      // Reset roles because old roles might not belong to new category
      setFormData({ ...formData, primary_role: '' });
      setMySkills([]);
  };

  // Skill add karne ka function
  const addSkill = (e: any) => {
      const selected = e.target.value;
      if (selected && !mySkills.includes(selected)) {
          if (mySkills.length >= 5) {
              alert("You can add only 5 Skills"); 
              return;
          }
          setMySkills([...mySkills, selected]);
      }
      e.target.value = ""; // Dropdown wapis reset karo
  };

  const removeSkill = (skillToRemove: string) => {
      setMySkills(mySkills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    // 🚀 FIX: Agar WhatsApp select kiya hai, tabhi number mango, warna chhor do
    if (!formData.username || !formData.primary_role || !formData.birth_date) {
        alert("Please fill all required fields.");
        return;
    }
    if (alertPreference === 'whatsapp' && !formData.whatsapp) {
        alert("Please enter your WhatsApp number.");
        return;
    }
    setSaving(true);
    
    // 🔗 Merge Country Code + Number
    const fullWhatsApp = alertPreference === 'whatsapp' ? `${selectedCountryCode}${formData.whatsapp}` : null;

    const { error } = await supabase.from('profiles').update({
        username: formData.username,
        whatsapp: fullWhatsApp,
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        primary_role: formData.primary_role, 
        skills: mySkills,
        country: formData.country,
    city: formData.city,
    postal_code: formData.postal_code,
        updated_at: new Date().toISOString()
    }).eq('id', user.id);

    setSaving(false);
    if (!error) setShowWhatsAppModal(true);
    else alert("Error: " + error.message);
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]"><Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40}/></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="fixed top-0 w-full z-50"><Navbar /></div>

{/* 🟢 FINAL SUCCESS MODAL (WITH MAGIC TIMER LOGIC) */}
{showWhatsAppModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white dark:bg-[#0f141f] w-full max-w-sm rounded-3xl p-8 shadow-2xl relative border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 text-center">
      
      {/* 🤖 SCENARIO 1: TELEGRAM CHUNA HAI AUR ABHI CLICK NAHI KIYA */}
      {alertPreference === 'telegram' && !telegramClicked ? (
        <>
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Send size={48} className="text-blue-600 dark:text-blue-400 ml-2" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Almost Done! 🤖</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
            Click below to activate your Telegram alerts. Once connected, come back to this tab!
          </p>
          <div className="flex flex-col gap-3">
            <a 
              href={`https://t.me/HireSkysAlertsBot?start=${user?.id}`} // ⚠️ APNE BOT KA NAAM LIKHNA
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // 🚀 THE MAGIC TIMER: 8 seconds baad automatically UI change ho jayega
                setTimeout(() => {
                  setTelegramClicked(true);
                }, 8000); 
              }}
              className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Send size={20} /> Connect Telegram Now
            </a>
          </div>
        </>
      ) : (
        /* ✅ SCENARIO 2: WHATSAPP CHUNA HAI -YA- TELEGRAM CLICK KARKE WAPIS AA GAYA HAI */
        <>
          <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">You're All Set! 🚀</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
            Your basic details are saved. Now, build your professional identity to get hired fast.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/onboarding')} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Briefcase size={20} /> Complete Full Profile
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-3.5 rounded-2xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
            >
              Skip to Dashboard
            </button>
          </div>
        </>
      )}

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

                {/* 🚀 STEP 1: SELECT INDUSTRY (CATEGORY) - Ye missing tha */}
<div className="group">
    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2 ml-1">
        Select Your Industry
    </label>
    <div className="relative">
        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <select 
            value={selectedCategory} 
            onChange={handleCategoryChange} 
            className="w-full h-14 bg-white dark:bg-[#0B0F19] border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white pl-12 pr-10 rounded-2xl outline-none appearance-none font-medium transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        >
            <option value="" disabled>Choose an industry...</option>
            {Object.keys(CATEGORIES).map((cat) => (
                <option key={cat} value={cat} className="text-gray-900 bg-white py-2">{cat}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
    </div>
</div>

{/* 🚀 STEP 2: MAIN SKILL (Ab ye Selected Category par depend karega) */}
<div className={`group mt-5 transition-all duration-500 ${!selectedCategory ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2 ml-1">
        Main Expertise
    </label>
    <div className="relative">
        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <select 
            value={formData.primary_role} 
            onChange={(e) => setFormData({...formData, primary_role: e.target.value})} 
            disabled={!selectedCategory}
            className="w-full h-14 bg-white dark:bg-[#0B0F19] border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white pl-12 pr-10 rounded-2xl outline-none appearance-none font-medium transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-100 dark:disabled:bg-white/5"
        >
            <option value="" disabled>Select specific role...</option>
            {/* 👇 SIRF SELECTED CATEGORY KI SKILLS SHOW HONGI */}
            {selectedCategory && (CATEGORIES as any)[selectedCategory]?.sub.map((skill: string) => (
                <option key={skill} value={skill} className="text-gray-900 bg-white py-2">{skill}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
    </div>
</div>

{/* 🚀 STEP 3: SECONDARY SKILLS (Ye bhi filter hongi) */}
<div className={`mt-5 transition-all duration-500 ${!selectedCategory ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2 ml-1">Top 5 Secondary Skills</label>
    <div className="relative">
        <LayoutGrid className="absolute left-4 top-3.5 text-gray-400 dark:text-slate-500" size={18} />
        <select 
        onChange={addSkill} 
        disabled={!selectedCategory}
        className="w-full h-14 bg-white dark:bg-[#0B0F19] border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white pl-12 pr-10 rounded-2xl outline-none appearance-none font-medium transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-gray-100 dark:disabled:bg-white/5"
        >
            <option value="">+ Add a skill...</option>
            {selectedCategory && (CATEGORIES as any)[selectedCategory]?.sub
            .filter((s: string) => s !== formData.primary_role)
            .map((skill: string) => (
                <option key={skill} value={skill} className="text-gray-900 bg-white py-2">{skill}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
    </div>

    {/* Selected Skills Chips */}
    <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
        {mySkills.map((skill, index) => (
            <div key={index} className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-medium animate-in zoom-in">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                <X size={14} />
            </button>
            </div>
        ))}
    </div>
</div>

                {/* 🚀 SMART ALERT PREFERENCE TOGGLE */}
<div>
    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-2 ml-1">
        How should we send you Job Alerts?
    </label>

    {/* The Toggle Buttons */}
    <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl mb-4 border border-gray-200 dark:border-gray-800">
        <button 
            type="button"
            onClick={() => setAlertPreference('whatsapp')} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${alertPreference === 'whatsapp' ? 'bg-white dark:bg-[#151b2d] text-green-600 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
            <Phone size={18}/> WhatsApp
        </button>
        <button 
            type="button"
            onClick={() => setAlertPreference('telegram')} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${alertPreference === 'telegram' ? 'bg-white dark:bg-[#151b2d] text-blue-500 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
            <Send size={18}/> Telegram
        </button>
    </div>

    {/* Conditionally Render Inputs based on Choice */}
    {alertPreference === 'whatsapp' ? (
        /* Unified Container for WhatsApp */
        <div className="flex items-center w-full h-14 bg-white dark:bg-[#0B0F19] border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200 hover:border-gray-300 animate-in fade-in slide-in-from-top-2">
            
            {/* Country Code Selection */}
            <div className="relative h-full bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-gray-700 min-w-[110px]">
                 <select 
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="w-full h-full bg-transparent text-gray-900 dark:text-white pl-3 pr-6 text-sm font-bold outline-none appearance-none cursor-pointer"
                >
                    {COUNTRIES.sort((a, b) => a.name === "Pakistan" ? -1 : a.name.localeCompare(b.name)).map((country, index) => (
                        <option key={index} value={country.code} className="text-black">
                            {country.flag} {country.code}
                        </option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={14} />
                </div>
            </div>

            {/* Number Input */}
            <div className="relative flex-grow h-full">
                <input 
                    type="tel" 
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/[^0-9]/g, '')})}
                    className="w-full h-full bg-transparent text-gray-900 dark:text-white px-4 font-medium text-lg outline-none placeholder:text-gray-300"
                    placeholder="300 1234567"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Phone size={18} />
                </div>
            </div>
        </div>
    ) : (
        /* Telegram Info Box */
        <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full text-blue-600 dark:text-blue-400">
                <Send size={20} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Smart Choice! 🚀</h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                    You will connect your Telegram account in the very next step after saving. Get ready for lightning-fast job alerts!
                </p>
            </div>
        </div>
    )}
</div>
{/* 📍 PROFESSIONAL LOCATION BLOCK (UPDATED) */}
<div className="bg-gray-50 dark:bg-white/5 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-5">
    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase flex items-center gap-2 px-1">
        <MapPin size={14} /> Location Details
    </label>

    {/* 👇 CUSTOM COUNTRY DROPDOWN (No more ugly native select) */}
    <div className="relative">
        {/* Trigger Button (Dikhta Input jesa hai) */}
        <button 
            type="button" // Zaroori hai taake form submit na ho
            onClick={() => setIsCountryOpen(!isCountryOpen)}
            className="w-full h-14 bg-white dark:bg-black/40 border-2 border-gray-100 dark:border-gray-800 text-left pl-12 pr-4 rounded-2xl flex items-center justify-between transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
        >
            <span className={`font-medium ${formData.country ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                {formData.country || "Select Country"}
            </span>
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Floating Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-lg">
            {COUNTRIES.find(c => c.name === formData.country)?.flag || "🌍"}
        </div>

        {/* 👇 THE DROPDOWN MENU (Ye 'Native' nahi hai, Fully Custom Hai) */}
        {isCountryOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#151B2B] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                
                {/* Search Bar Inside Dropdown */}
                <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#151B2B]">
                    <input 
                        type="text" 
                        placeholder="Search country..." 
                        autoFocus
                        className="w-full p-2 bg-gray-50 dark:bg-black/40 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setCountrySearch(e.target.value)}
                    />
                </div>

                {/* Country List */}
                <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                    {COUNTRIES
                        .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((c, i) => (
                            <div 
                                key={i} 
                                onClick={() => {
                                    setFormData({...formData, country: c.name});
                                    setIsCountryOpen(false);
                                    setCountrySearch(""); // Reset search
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                                    formData.country === c.name 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-bold' 
                                    : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'
                                }`}
                            >
                                <span className="text-xl">{c.flag}</span>
                                <span className="text-sm">{c.name}</span>
                                {formData.country === c.name && <CheckCircle size={14} className="ml-auto" />}
                            </div>
                    ))}
                    {/* No Result State */}
                    {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-sm">No country found</div>
                    )}
                </div>
            </div>
        )}
    </div>

    {/* City & Postal Code (Same as before) */}
    <div className="grid grid-cols-2 gap-4">
        <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="City"
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})} 
                className="w-full h-14 bg-white dark:bg-black/40 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white pl-12 pr-4 rounded-2xl outline-none transition-all hover:border-gray-300 dark:hover:border-gray-700 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
            />
        </div>

        <div className="relative group">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Post Code"
                value={formData.postal_code} 
                onChange={(e) => setFormData({...formData, postal_code: e.target.value})} 
                className="w-full h-14 bg-white dark:bg-black/40 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white pl-12 pr-4 rounded-2xl outline-none transition-all hover:border-gray-300 dark:hover:border-gray-700 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
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
