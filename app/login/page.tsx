"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowLeft, User, Phone, AtSign, Globe, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Turnstile } from '@marsidev/react-turnstile';

// --- COUNTRY CODES DATA (Full List) ---
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

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

export default function Login() {
  const router = useRouter();
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState('+92');

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login'); 
  const [msg, setMsg] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // --- AUTH HANDLER (UPDATED WITH CAPTCHA) ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');

    // 1. Check agar Captcha solve nahi hua
    if (!captchaToken) {
        setMsg('⚠️ Please verify you are human (Complete Captcha).');
        setLoading(false);
        return;
    }

    try {
      if (view === 'signup') {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: { 
                // 👇 Yahan Token bhejna zaroori hai
                captchaToken: captchaToken,
                data: {
                    full_name: fullName,
                    username: username.toLowerCase().replace(/\s+/g, ''),
                    whatsapp: `${countryCode}${whatsapp.replace(/^0+/, '').replace(/\D/g, '')}`
                }
            }
        });

        if (error) throw error;
        setMsg('🎉 Account created! Please check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
            email, 
            password,
            options: { captchaToken } // 👇 Login mein bhi token bhejo
        });
        if (error) throw error;
        router.push('/profile'); 
      }
    } catch (error: any) {
      setMsg(error.message);
      // Token reset kar dena chahiye error ke baad (optional but good)
      setCaptchaToken(null); 
    } finally {
      setLoading(false);
    }
  };

  // --- RESET PASSWORD ---
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`, 
        });
        if (error) throw error;
        setMsg('✅ Reset link sent! Check your email.');
    } catch (error: any) {
        setMsg(error.message);
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback?next=/profile` }
        });
        if (error) throw error;
    } catch (error: any) { alert(error.message); }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0B0F19]">
      
      {/* LEFT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative animate-fade-in pt-20 md:pt-12">
        
        {/* Adjusted Back Button Position */}
        <Link href="/" className="absolute top-6 left-6 text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition font-medium text-xs md:text-sm z-10">
             <ArrowLeft size={16}/> Back to Home
        </Link>

        <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo - Added margin top to prevent overlap with back button */}
            <div className="lg:hidden mb-8 mt-4">
                <Image src="/logo2.png" alt="HireSkys Logo" width={50} height={50} className="mb-2" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">HireSkys</h2>
            </div>

            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                    {view === 'signup' ? 'Join the Network' : view === 'forgot' ? 'Reset Password' : 'Welcome Back'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    {view === 'signup' ? 'Create profile to get verified job alerts.' : view === 'forgot' ? 'Enter email to receive reset link.' : 'Enter your credentials to access dashboard.'}
                </p>
            </div>

            {view !== 'forgot' && (
                <>
                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition mb-6 font-bold text-slate-700 dark:text-white bg-white dark:bg-[#111625]">
                    <GoogleIcon /><span>Continue with Google</span>
                </button>
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-[#0B0F19] text-slate-500">Or continue with email</span></div>
                </div>
                </>
            )}

            {/* FORM AREA */}
            {view === 'forgot' ? (
              <form onSubmit={handleReset} className="space-y-4">
                  <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                      <div className="relative mt-1"><Mail className="absolute left-4 top-3.5 text-slate-400" size={18} /><input type="email" placeholder="name@example.com" required className="w-full pl-11 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition font-medium" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  </div>
                  {msg && <div className={`p-3 rounded-lg text-sm font-medium text-center ${msg.includes('sent') ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg}</div>}
                  <button disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                  </button>
                  <button type="button" onClick={() => setView('login')} className="w-full py-2 text-slate-500 hover:text-slate-700 font-bold text-sm">Cancel & Back to Login</button>
              </form>
            ) : (
              <form onSubmit={handleAuth} className="space-y-4">
                  
                  {/* SIGN UP EXTRA FIELDS */}
                  {view === 'signup' && (
                      <div className="space-y-4 animate-fade-in-up">
                          {/* Full Name */}
                          <div>
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                              <div className="relative mt-1">
                                  <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                  <input type="text" placeholder="John Doe" required className="w-full pl-11 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition font-medium" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                              </div>
                          </div>

                          {/* 🛑 MOBILE FIX: 'grid-cols-1 md:grid-cols-2' */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Username */}
                             <div>
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
                                <div className="relative mt-1">
                                    <AtSign className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input type="text" placeholder="johndoe" required className="w-full pl-11 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition font-medium lowercase" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                             </div>
                             
                             {/* WhatsApp (Split Input) */}
                             <div>
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">WhatsApp</label>
                                <div className="relative mt-1 flex rounded-xl shadow-sm">
                                    {/* Country Dropdown */}
                                    <div className="relative">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="h-full w-20 md:w-auto rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 pl-2 pr-6 md:pl-3 md:pr-8 focus:ring-2 focus:ring-indigo-600 outline-none appearance-none font-medium cursor-pointer text-sm"
                                        >
                                            {COUNTRIES.map((c) => (
                                                <option key={c.name} value={c.code}>
                                                    {c.flag} {c.code}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2 text-slate-500">
                                            <svg className="h-3 w-3 md:h-4 md:w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>
                                    {/* Number Input */}
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input 
                                            type="tel"
                                            placeholder="300 1234567" 
                                            required 
                                            className="w-full pl-10 p-3 rounded-r-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition font-medium" 
                                            value={whatsapp} 
                                            onChange={(e) => setWhatsapp(e.target.value)} 
                                        />
                                    </div>
                                </div>
                             </div>
                          </div>
                      </div>
                  )}

                  {/* Email */}
                  <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                      <div className="relative mt-1">
                          <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input type="email" placeholder="name@example.com" required className="w-full pl-11 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                  </div>

                  {/* Password */}
                  <div>
                      <div className="flex justify-between">
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                           {view === 'login' && <button type="button" onClick={() => setView('forgot')} className="text-sm text-indigo-600 hover:underline">Forgot password?</button>}
                      </div>
                      <div className="relative mt-1">
                          <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input type="password" placeholder="••••••••" required minLength={6} className="w-full pl-11 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition font-medium" value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                  </div>

                  {msg && <div className={`p-3 rounded-lg text-sm font-medium text-center ${msg.includes('created') ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg}</div>}

                  {/* Cloudflare Widget */}
<div className="flex justify-center my-4">
    <Turnstile 
        siteKey="0x4AAAAAACNCb7I9-ROyHTqU" // 👈 Step 1 wali Site Key
        onSuccess={(token) => setCaptchaToken(token)}
    />
</div>
                  <button disabled={loading} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin" /> : (view === 'signup' ? 'Create Account' : 'Sign In')}
                  </button>
              </form>
            )}

            <div className="mt-6 text-center">
                {view !== 'forgot' && (
                    <p className="text-slate-500">
                        {view === 'signup' ? 'Already have an account?' : "New to HireSkys?"}
                        <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="ml-2 text-indigo-600 font-bold hover:underline transition">
                            {view === 'signup' ? 'Sign in' : 'Create account'}
                        </button>
                    </p>
                )}
            </div>
        </div>
      </div>

      {/* RIGHT SIDE: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#0B0F19] relative overflow-hidden items-center justify-center p-12">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
           
           <div className="relative z-10 max-w-lg text-white space-y-8">
               <div className="flex items-center gap-4 mb-6">
                   <Image src="/logo2.png" alt="HireSkys Logo" width={80} height={80} className="rounded-2xl shadow-2xl shadow-indigo-500/50" />
                   <span className="text-4xl font-extrabold text-White-900 tracking-tight">HireSkys</span>
               </div>
               <h2 className="text-5xl font-extrabold leading-tight">Find the unseen.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Build the future.</span></h2>
               <p className="text-lg text-slate-400 leading-relaxed">Join thousands of elite freelancers and developers accessing verified remote jobs before they go viral.</p>
               <div className="flex gap-4 pt-4">
                   <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-medium"><Globe className="text-indigo-400" size={16}/> Global Remote</div>
                   <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm font-medium"><ShieldCheck className="text-green-400" size={16}/> Verified Roles</div>
               </div>
           </div>
      </div>
    </div>
  );
}

