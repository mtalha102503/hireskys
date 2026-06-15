"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getActiveWorkspaceId } from '@/lib/workspace';
import Link from 'next/link';
import { 
  Building2, Globe2, Save, Loader2, Lock,CalendarDays,ChevronRight,UserPlus, Mail, Shield, Trash2,CheckCircle2, AlertTriangle, Info, Link as LinkIcon, Users, Building, RefreshCw, Sparkles, X, Upload, ImagePlus, Twitter, Github, Banknote, Code2, HeartPulse, ExternalLink
} from 'lucide-react';

// 🟢 1. YAHAN COUNTRY MAP ADD KIYA HAI TAQKE COMPONENT ISEY USE KAR SAKE
const countryMap: Record<string, { code: string; flag: string; name: string }> = {
  // --- POPULAR / COMMON ---
  "PAKISTAN": { code: "PK", flag: "🇵🇰", name: "Pakistan" },
  "PK": { code: "PK", flag: "🇵🇰", name: "Pakistan" },
  "INDIA": { code: "IN", flag: "🇮🇳", name: "India" },
  "IN": { code: "IN", flag: "🇮🇳", name: "India" }, 
  "BANGLADESH": { code: "BD", flag: "🇧🇩", name: "Bangladesh" },
  "BD": { code: "BD", flag: "🇧🇩", name: "Bangladesh" },
  "USA": { code: "US", flag: "🇺🇸", name: "United States" },
  "UNITED STATES": { code: "US", flag: "🇺🇸", name: "United States" },
  "US": { code: "US", flag: "🇺🇸", name: "United States" },
  "CANADA": { code: "CA", flag: "🇨🇦", name: "Canada" },
  "CA": { code: "CA", flag: "🇨🇦", name: "Canada" },
  "UK": { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  "UNITED KINGDOM": { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  "GB": { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  "GERMANY": { code: "DE", flag: "🇩🇪", name: "Germany" },
  "DE": { code: "DE", flag: "🇩🇪", name: "Germany" },
  "FRANCE": { code: "FR", flag: "🇫🇷", name: "France" },
  "FR": { code: "FR", flag: "🇫🇷", name: "France" },
  "UAE": { code: "AE", flag: "🇦🇪", name: "UAE" },
  "UNITED ARAB EMIRATES": { code: "AE", flag: "🇦🇪", name: "UAE" },
  "DUBAI": { code: "AE", flag: "🇦🇪", name: "UAE" },
  "AE": { code: "AE", flag: "🇦🇪", name: "UAE" },
  "SAUDI ARABIA": { code: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  "SA": { code: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  "AUSTRALIA": { code: "AU", flag: "🇦🇺", name: "Australia" },
  "AU": { code: "AU", flag: "🇦🇺", name: "Australia" },
  "NEW ZEALAND": { code: "NZ", flag: "🇳🇿", name: "New Zealand" },
  "NZ": { code: "NZ", flag: "🇳🇿", name: "New Zealand" },
  "SINGAPORE": { code: "SG", flag: "🇸🇬", name: "Singapore" },
  "SG": { code: "SG", flag: "🇸🇬", name: "Singapore" },
  "JAPAN": { code: "JP", flag: "🇯🇵", name: "Japan" },
  "JP": { code: "JP", flag: "🇯🇵", name: "Japan" },
  "CHINA": { code: "CN", flag: "🇨🇳", name: "China" },
  "CN": { code: "CN", flag: "🇨🇳", name: "China" },
  "PHILIPPINES": { code: "PH", flag: "🇵🇭", name: "Philippines" },
  "PH": { code: "PH", flag: "🇵🇭", name: "Philippines" },
  "VIETNAM": { code: "VN", flag: "🇻🇳", name: "Vietnam" },
  "VN": { code: "VN", flag: "🇻🇳", name: "Vietnam" },
  "INDONESIA": { code: "ID", flag: "🇮🇩", name: "Indonesia" },
  "ID": { code: "ID", flag: "🇮🇩", name: "Indonesia" },
  "BRAZIL": { code: "BR", flag: "🇧🇷", name: "Brazil" },
  "BR": { code: "BR", flag: "🇧🇷", name: "Brazil" },
  "ARGENTINA": { code: "AR", flag: "🇦🇷", name: "Argentina" },
  "AR": { code: "AR", flag: "🇦🇷", name: "Argentina" },
  "NIGERIA": { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  "NG": { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  "EGYPT": { code: "EG", flag: "🇪🇬", name: "Egypt" },
  "EG": { code: "EG", flag: "🇪🇬", name: "Egypt" },
  "SOUTH AFRICA": { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  "ZA": { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  "NORWAY": { code: "NO", flag: "🇳🇴", name: "Norway" },
  "NO": { code: "NO", flag: "🇳🇴", name: "Norway" },
  // --- REST OF THE WORLD (A-Z) ---
  "AFGHANISTAN": { code: "AF", flag: "🇦🇫", name: "Afghanistan" },
  "ALBANIA": { code: "AL", flag: "🇦🇱", name: "Albania" },
  "ALGERIA": { code: "DZ", flag: "🇩🇿", name: "Algeria" },
  "ANDORRA": { code: "AD", flag: "🇦🇩", name: "Andorra" },
  "ANGOLA": { code: "AO", flag: "🇦🇴", name: "Angola" },
  "ANTIGUA": { code: "AG", flag: "🇦🇬", name: "Antigua and Barbuda" },
  "ARMENIA": { code: "AM", flag: "🇦🇲", name: "Armenia" },
  "AUSTRIA": { code: "AT", flag: "🇦🇹", name: "Austria" },
  "AZERBAIJAN": { code: "AZ", flag: "🇦🇿", name: "Azerbaijan" },
  "BAHAMAS": { code: "BS", flag: "🇧🇸", name: "Bahamas" },
  "BAHRAIN": { code: "BH", flag: "🇧🇭", name: "Bahrain" },
  "BARBADOS": { code: "BB", flag: "🇧🇧", name: "Barbados" },
  "BELARUS": { code: "BY", flag: "🇧🇾", name: "Belarus" },
  "BELGIUM": { code: "BE", flag: "🇧🇪", name: "Belgium" },
  "BELIZE": { code: "BZ", flag: "🇧🇿", name: "Belize" },
  "BENIN": { code: "BJ", flag: "🇧🇯", name: "Benin" },
  "BHUTAN": { code: "BT", flag: "🇧🇹", name: "Bhutan" },
  "BOLIVIA": { code: "BO", flag: "🇧🇴", name: "Bolivia" },
  "BOSNIA": { code: "BA", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
  "BOTSWANA": { code: "BW", flag: "🇧🇼", name: "Botswana" },
  "BRUNEI": { code: "BN", flag: "🇧🇳", name: "Brunei" },
  "BULGARIA": { code: "BG", flag: "🇧🇬", name: "Bulgaria" },
  "BURKINA FASO": { code: "BF", flag: "🇧🇫", name: "Burkina Faso" },
  "BURUNDI": { code: "BI", flag: "🇧🇮", name: "Burundi" },
  "CAMBODIA": { code: "KH", flag: "🇰🇭", name: "Cambodia" },
  "CAMEROON": { code: "CM", flag: "🇨🇲", name: "Cameroon" },
  "CAPE VERDE": { code: "CV", flag: "🇨🇻", name: "Cape Verde" },
  "CHILE": { code: "CL", flag: "🇨🇱", name: "Chile" },
  "COLOMBIA": { code: "CO", flag: "🇨🇴", name: "Colombia" },
  "COMOROS": { code: "KM", flag: "🇰🇲", name: "Comoros" },
  "COSTA RICA": { code: "CR", flag: "🇨🇷", name: "Costa Rica" },
  "CROATIA": { code: "HR", flag: "🇭🇷", name: "Croatia" },
  "CUBA": { code: "CU", flag: "🇨🇺", name: "Cuba" },
  "CYPRUS": { code: "CY", flag: "🇨🇾", name: "Cyprus" },
  "CZECH REPUBLIC": { code: "CZ", flag: "🇨🇿", name: "Czech Republic" },
  "DENMARK": { code: "DK", flag: "🇩🇰", name: "Denmark" },
  "DJIBOUTI": { code: "DJ", flag: "🇩🇯", name: "Djibouti" },
  "DOMINICA": { code: "DM", flag: "🇩🇲", name: "Dominica" },
  "DOMINICAN REPUBLIC": { code: "DO", flag: "🇩🇴", name: "Dominican Republic" },
  "ECUADOR": { code: "EC", flag: "🇪🇨", name: "Ecuador" },
  "EL SALVADOR": { code: "SV", flag: "🇸🇻", name: "El Salvador" },
  "ESTONIA": { code: "EE", flag: "🇪🇪", name: "Estonia" },
  "ETHIOPIA": { code: "ET", flag: "🇪🇹", name: "Ethiopia" },
  "FIJI": { code: "FJ", flag: "🇫🇯", name: "Fiji" },
  "FINLAND": { code: "FI", flag: "🇫🇮", name: "Finland" },
  "GABON": { code: "GA", flag: "🇬🇦", name: "Gabon" },
  "GAMBIA": { code: "GM", flag: "🇬🇲", name: "Gambia" },
  "GEORGIA": { code: "GE", flag: "🇬🇪", name: "Georgia" },
  "GHANA": { code: "GH", flag: "🇬🇭", name: "Ghana" },
  "GREECE": { code: "GR", flag: "🇬🇷", name: "Greece" },
  "GRENADA": { code: "GD", flag: "🇬🇩", name: "Grenada" },
  "GUATEMALA": { code: "GT", flag: "🇬🇹", name: "Guatemala" },
  "GUINEA": { code: "GN", flag: "🇬🇳", name: "Guinea" },
  "GUYANA": { code: "GY", flag: "🇬🇾", name: "Guyana" },
  "HAITI": { code: "HT", flag: "🇭🇹", name: "Haiti" },
  "HONDURAS": { code: "HN", flag: "🇭🇳", name: "Honduras" },
  "HUNGARY": { code: "HU", flag: "🇭🇺", name: "Hungary" },
  "ICELAND": { code: "IS", flag: "🇮🇸", name: "Iceland" },
  "IRAN": { code: "IR", flag: "🇮🇷", name: "Iran" },
  "IRAQ": { code: "IQ", flag: "🇮🇶", name: "Iraq" },
  "IRELAND": { code: "IE", flag: "🇮🇪", name: "Ireland" },
  "ISRAEL": { code: "IL", flag: "🇮🇱", name: "Israel" },
  "ITALY": { code: "IT", flag: "🇮🇹", name: "Italy" },
  "JAMAICA": { code: "JM", flag: "🇯🇲", name: "Jamaica" },
  "JORDAN": { code: "JO", flag: "🇯🇴", name: "Jordan" },
  "KAZAKHSTAN": { code: "KZ", flag: "🇰🇿", name: "Kazakhstan" },
  "KENYA": { code: "KE", flag: "🇰🇪", name: "Kenya" },
  "KUWAIT": { code: "KW", flag: "🇰🇼", name: "Kuwait" },
  "KYRGYZSTAN": { code: "KG", flag: "🇰🇬", name: "Kyrgyzstan" },
  "LAOS": { code: "LA", flag: "🇱🇦", name: "Laos" },
  "LATVIA": { code: "LV", flag: "🇱🇻", name: "Latvia" },
  "LEBANON": { code: "LB", flag: "🇱🇧", name: "Lebanon" },
  "LIBYA": { code: "LY", flag: "🇱🇾", name: "Libya" },
  "LITHUANIA": { code: "LT", flag: "🇱🇹", name: "Lithuania" },
  "LUXEMBOURG": { code: "LU", flag: "🇱🇺", name: "Luxembourg" },
  "MADAGASCAR": { code: "MG", flag: "🇲🇬", name: "Madagascar" },
  "MALAYSIA": { code: "MY", flag: "🇲🇾", name: "Malaysia" },
  "MALDIVES": { code: "MV", flag: "🇲🇻", name: "Maldives" },
  "MALI": { code: "ML", flag: "🇲🇱", name: "Mali" },
  "MALTA": { code: "MT", flag: "🇲🇹", name: "Malta" },
  "MEXICO": { code: "MX", flag: "🇲🇽", name: "Mexico" },
  "MOLDOVA": { code: "MD", flag: "🇲🇩", name: "Moldova" },
  "MONACO": { code: "MC", flag: "🇲🇨", name: "Monaco" },
  "MONGOLIA": { code: "MN", flag: "🇲🇳", name: "Mongolia" },
  "MONTENEGRO": { code: "ME", flag: "🇲🇪", name: "Montenegro" },
  "MOROCCO": { code: "MA", flag: "🇲🇦", name: "Morocco" },
  "MYANMAR": { code: "MM", flag: "🇲🇲", name: "Myanmar" },
  "NAMIBIA": { code: "NA", flag: "🇳🇦", name: "Namibia" },
  "NEPAL": { code: "NP", flag: "🇳🇵", name: "Nepal" },
  "NETHERLANDS": { code: "NL", flag: "🇳🇱", name: "Netherlands" },
  "NICARAGUA": { code: "NI", flag: "🇳🇮", name: "Nicaragua" },
  "NIGER": { code: "NE", flag: "🇳🇪", name: "Niger" },
  "NORTH KOREA": { code: "KP", flag: "🇰🇵", name: "North Korea" },
  "OMAN": { code: "OM", flag: "🇴🇲", name: "Oman" },
  "PANAMA": { code: "PA", flag: "🇵🇦", name: "Panama" },
  "PARAGUAY": { code: "PY", flag: "🇵🇾", name: "Paraguay" },
  "PERU": { code: "PE", flag: "🇵🇪", name: "Peru" },
  "POLAND": { code: "PL", flag: "🇵🇱", name: "Poland" },
  "PORTUGAL": { code: "PT", flag: "🇵🇹", name: "Portugal" },
  "QATAR": { code: "QA", flag: "🇶🇦", name: "Qatar" },
  "ROMANIA": { code: "RO", flag: "🇷🇴", name: "Romania" },
  "RUSSIA": { code: "RU", flag: "🇷🇺", name: "Russia" },
  "RWANDA": { code: "RW", flag: "🇷🇼", name: "Rwanda" },
  "SENEGAL": { code: "SN", flag: "🇸🇳", name: "Senegal" },
  "SERBIA": { code: "RS", flag: "🇷🇸", name: "Serbia" },
  "SLOVAKIA": { code: "SK", flag: "🇸🇰", name: "Slovakia" },
  "SLOVENIA": { code: "SI", flag: "🇸🇮", name: "Slovenia" },
  "SOMALIA": { code: "SO", flag: "🇸🇴", name: "Somalia" },
  "SOUTH KOREA": { code: "KR", flag: "🇰🇷", name: "South Korea" },
  "SPAIN": { code: "ES", flag: "🇪🇸", name: "Spain" },
  "SRI LANKA": { code: "LK", flag: "🇱🇰", name: "Sri Lanka" },
  "SUDAN": { code: "SD", flag: "🇸🇩", name: "Sudan" },
  "SWEDEN": { code: "SE", flag: "🇸🇪", name: "Sweden" },
  "SWITZERLAND": { code: "CH", flag: "🇨🇭", name: "Switzerland" },
  "SYRIA": { code: "SY", flag: "🇸🇾", name: "Syria" },
  "TAIWAN": { code: "TW", flag: "🇹🇼", name: "Taiwan" },
  "TAJIKISTAN": { code: "TJ", flag: "🇹🇯", name: "Tajikistan" },
  "TANZANIA": { code: "TZ", flag: "🇹🇿", name: "Tanzania" },
  "THAILAND": { code: "TH", flag: "🇹🇭", name: "Thailand" },
  "TUNISIA": { code: "TN", flag: "🇹🇳", name: "Tunisia" },
  "TURKEY": { code: "TR", flag: "🇹🇷", name: "Turkey" },
  "UGANDA": { code: "UG", flag: "🇺🇬", name: "Uganda" },
  "UKRAINE": { code: "UA", flag: "🇺🇦", name: "Ukraine" },
  "URUGUAY": { code: "UY", flag: "🇺🇾", name: "Uruguay" },
  "UZBEKISTAN": { code: "UZ", flag: "🇺🇿", name: "Uzbekistan" },
  "VENEZUELA": { code: "VE", flag: "🇻🇪", name: "Venezuela" },
  "YEMEN": { code: "YE", flag: "🇾🇪", name: "Yemen" },
  "ZAMBIA": { code: "ZM", flag: "🇿🇲", name: "Zambia" },
  "ZIMBABWE": { code: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
};

export default function EmployerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isExistingCompany, setIsExistingCompany] = useState(false);
 
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const coverInputRef = useRef<HTMLInputElement>(null); // 👈 Naya Ref
  // 🟢 CALENDAR INTEGRATION STATES
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [calendarEmail, setCalendarEmail] = useState('');
  const [checkingCalendar, setCheckingCalendar] = useState(true);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false); 
  const [isUploadingCover, setIsUploadingCover] = useState(false); // 👈 Nayi State
  // 🟢 Nayi State Variables
  // 🟢 OUTLOOK INTEGRATION STATES
  const [hasStartupAccess, setHasStartupAccess] = useState(false);
  const [hasScaleAccess, setHasScaleAccess] = useState(false);
  // 🟢 TEAM MANAGEMENT STATES
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('interviewer');
  const [isInviting, setIsInviting] = useState(false);
  const [fetchingTeam, setFetchingTeam] = useState(false);
  const [isOutlookConnected, setIsOutlookConnected] = useState(false);
  const [outlookEmail, setOutlookEmail] = useState('');
  const [checkingOutlook, setCheckingOutlook] = useState(true);
  const [userRole, setUserRole] = useState('owner');
  const [workspaceId, setWorkspaceId] = useState('');
  const [isDirty, setIsDirty] = useState(false); // Check karega ke unsaved changes hain ya nahi
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown kholne ke liye
  const isFirstLoad = useRef(true);
  const [tourStep, setTourStep] = useState(0);
   // 🟢 NAYA JADOO: Tour Steps Data
// 🟢 NAYA JADOO: Tour Steps Data (Ab Sirf 2 Steps Hain)
  const integrationTourSteps = [
    {
      title: "Step 1: Choose Booking Tool 🔗",
      desc: "Paste your Calendly, Cal.com, or any custom booking link here. We'll use this automatically when inviting candidates.",
      icon: <LinkIcon size={48} className="text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
    },
    {
      title: "Step 2: Auto-Email Triggers ✉️",
      desc: "Customize this message. Whenever you drag a candidate to the 'Interviewing' column, this email is sent instantly!",
      icon: <Mail size={48} className="text-fuchsia-500" />,
      color: "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200"
    }
  ];
// 🟢 VIP JADOO: Custom Popup State
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'alert' });

  // Helper functions for easy popup triggering
  const showAlert = (title: string, message: string) => {
    setPopup({ isOpen: true, title, message, type: 'alert' });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setPopup({ isOpen: true, title, message, type: 'confirm', onConfirm });
  };

  const closePopup = () => setPopup({ ...popup, isOpen: false });
  // 🟢 Form State updated with VIP fields
  const [formData, setFormData] = useState({
    name: '',email:'', website: '', description: '', timezone: 'US Pacific Time (PST)',
    logo_url: '', cover_image_url: '', // 👈 Cover added
    company_size: '11-50', industry: '', founded_year: '', funding_stage: 'Bootstrapped', // 👈 Status added
    linkedin_url: '', twitter_url: '', github_url: '', // 👈 Social added
    tech_stack: '', perks: '', // 👈 Culture added
    allowed_countries: [] as string[],
    work_style: 'Flexible / Asynchronous',
    equipment_allowance: 'Laptop Provided',
    company_retreats: 'No retreats currently',
    calendly_url: '',
    interview_template: '',
    rejection_template: '',
    cal_url: '',
    custom_booking_url: ''
  }); 
  
  useEffect(() => {
    fetchCompanyData();
  }, []);
useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setIsDirty(true);
  }, [formData]);

  // Yeh function jis element par lagayenge wo andhere mein chamkega!
  const getHighlightClass = (step: number) => {
    return tourStep === step 
      ? 'relative z-[110] ring-4 ring-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)] bg-white dark:bg-[#111625] scale-[1.02] rounded-3xl' 
      : 'relative';
  };

// Floating Tooltip Box
 // Floating Tooltip Box
  const renderTourTooltip = (step: number) => {
    if (tourStep !== step) return null;
    const stepData = integrationTourSteps[step - 1];
    
    // 🟢 Ab aakhri step '2' hai
    const isLastStep = step === 2;

    return (
      <div className={`absolute right-0 md:right-4 w-[320px] bg-white dark:bg-[#111625] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-2 border-indigo-500 p-5 z-[120] animate-in fade-in duration-300 ${
        isLastStep ? 'bottom-full mb-4 slide-in-from-bottom-4' : 'top-full mt-6 slide-in-from-top-4'
      }`}>
         
         {/* 🟢 Arrow pointer */}
         <div className={`absolute right-10 w-5 h-5 bg-white dark:bg-[#111625] border-indigo-500 rotate-45 ${
           isLastStep ? '-bottom-2.5 border-b-2 border-r-2' : '-top-2.5 border-t-2 border-l-2'
         }`}></div>
         
         <div className="flex items-center gap-3 mb-3 relative z-10">
           <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">{stepData.icon}</div>
           <h4 className="font-black text-slate-900 dark:text-white text-sm">{stepData.title}</h4>
         </div>
         <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-5 leading-relaxed relative z-10">
           {stepData.desc}
         </p>
         
         <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 relative z-10">
           <span className="text-[10px] font-black tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md uppercase">
             {step}/2
           </span>
           <div className="flex gap-2">
             <button type="button" onClick={closeTour} className="px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Skip</button>
             <button 
                type="button" 
                onClick={(e) => { 
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (step === 2) {
                    closeTour();
                  } else {
                    setTourStep(prev => prev + 1);
                    setTimeout(() => {
                      const element = document.querySelector('.ring-indigo-500');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 250);
                  }
                }} 
                className="px-4 py-1.5 bg-indigo-600 text-white text-[11px] font-black rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
             >
               {step === 2 ? 'Finish' : 'Next'}
             </button>
           </div>
         </div>
      </div>
    );
  };
   useEffect(() => {
    // Check karo ke tab Integrations hai aur plan Unlocked (hasStartupAccess) hai
    if (activeTab === 'integrations' && hasStartupAccess) {
      const hasSeenTour = localStorage.getItem('hasSeenIntegrationTour');
      if (!hasSeenTour) {
        setTourStep(1); // Tour start karo
      }
    } else {
      setTourStep(0); // Kisi aur tab ya locked screen par tour band rakho
    }
  }, [activeTab, hasStartupAccess]);
  async function fetchCompanyData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      setUser(session.user);

      // 🟢 NAYA VIP LOGIC: Workspace ID aur Role nikalo
      const { workspaceId: activeId, role } = await getActiveWorkspaceId(session.user.id);
      setWorkspaceId(activeId);
      setUserRole(role);

      fetchTeamMembers(activeId); // 👈 Yahan workspaceId lagaya

      // 🟢 1. Check if Google Calendar is connected
      const { data: calData } = await supabase
        .from('calendar_integrations')
        .select('email')
        .eq('employer_id', activeId) // 👈 Yahan workspaceId lagaya
        .eq('provider', 'google')
        .single();

      if (calData) {
        setIsCalendarConnected(true);
        setCalendarEmail(calData.email);
      }
      setCheckingCalendar(false);

      // 🟢 2. Check if Outlook Calendar is connected
      const { data: outData } = await supabase
        .from('calendar_integrations')
        .select('email')
        .eq('employer_id', activeId) // 👈 Yahan workspaceId lagaya
        .eq('provider', 'microsoft')
        .single();

      if (outData) {
        setIsOutlookConnected(true);
        setOutlookEmail(outData.email);
      }
      setCheckingOutlook(false);
      // 🟢 2. Check URL for Success/Error after Google Login
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('calendar') === 'connected') {
          setSuccessMsg('Google Calendar connected successfully! 📅');
          window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
      } else if (urlParams.get('error')) {
          alert('Calendar Connection Failed!');
          window.history.replaceState({}, document.title, window.location.pathname);
      }
     const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('employer_id', activeId) // 👈 Yahan workspaceId lagaya
        .single();

      if (company) {
        setIsExistingCompany(true); 
        setFormData({
          name: company.name || '',
          website: company.website || '',
          description: company.description || '',
          timezone: company.timezone || 'US Pacific Time (PST)',
          logo_url: company.logo_url || '',
          cover_image_url: company.cover_image_url || '', // 👈 Naya
          company_size: company.company_size || '11-50',
          industry: company.industry || '',
          founded_year: company.founded_year || '', // 👈 Naya
          funding_stage: company.funding_stage || 'Bootstrapped', // 👈 Naya
          linkedin_url: company.linkedin_url || '',
          email: company.email || '',
          twitter_url: company.twitter_url || '', // 👈 Naya
          github_url: company.github_url || '', // 👈 Naya
          tech_stack: company.tech_stack || '', // 👈 Naya
          perks: company.perks || '', // 👈 Naya
          allowed_countries: company.allowed_countries || [],
          work_style: company.work_style || 'Flexible / Asynchronous', // 👈 Naya
          equipment_allowance: company.equipment_allowance || 'Laptop Provided', // 👈 Naya
          company_retreats: company.company_retreats || 'No retreats currently',
          calendly_url: company.calendly_url || '',
          cal_url: company.cal_url || '',
          custom_booking_url: company.custom_booking_url || '',
        interview_template: company.interview_template || '',
        rejection_template: company.rejection_template || '', 
        });
      // Data load hone ke baad isDirty ko false kar do
        setTimeout(() => setIsDirty(false), 100);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  }
  

  useEffect(() => {
    const checkPlans = async () => {
      if (!workspaceId) return;
      const { data: comp } = await supabase
        .from('companies')
        .select('plan_tier')
        .eq('employer_id', workspaceId)
        .single();
        
      const plan = comp?.plan_tier || 'Free Trial';
      setHasStartupAccess(['Startup', 'Scale', 'Urgent', 'Bulk 5 Pack', 'Bulk 10 Pack'].includes(plan));
      setHasScaleAccess(['Scale', 'Urgent', 'Bulk 5 Pack', 'Bulk 10 Pack'].includes(plan));
    };
    checkPlans();
  }, [workspaceId]);
  const fetchLogoFromWebsite = async () => {
    if (!formData.website) return;
    
    setIsFetchingLogo(true);
    try {
      let domain = formData.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
      
      if (domain) {
        const autoLogoUrl = `https://img.logo.dev/${domain}?token=pk_aH9IPqwYQqW08DI-epK7yw&size=200&format=png`;
        setFormData(prev => ({ ...prev, logo_url: autoLogoUrl }));
      }
    } catch (error) {
      console.error("Failed to fetch logo", error);
    } finally {
      setIsFetchingLogo(false);
    }
  };
// 🚀 VIP MANUAL IMAGE UPLOAD (For Logo & Cover)
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (type === 'logo') setIsUploadingLogo(true);
    else setIsUploadingCover(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('company-logos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('company-logos').getPublicUrl(filePath);
      
      if (type === 'logo') setFormData(prev => ({ ...prev, logo_url: data.publicUrl }));
      else setFormData(prev => ({ ...prev, cover_image_url: data.publicUrl }));
      
      setSuccessMsg(`${type === 'logo' ? 'Logo' : 'Cover'} uploaded successfully! 🎉`);
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (error: any) {
      alert("Upload failed: " + error.message);
    } finally {
      if (type === 'logo') {
          setIsUploadingLogo(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
          setIsUploadingCover(false);
          if (coverInputRef.current) coverInputRef.current.value = '';
      }
    }
  };
  // 🟢 NAYA FUNCTION: Team Members ko database se laane ke liye
  const fetchTeamMembers = async (employerId: string) => {
    setFetchingTeam(true);
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false }); // Naye invites upar aayenge
      
    if (data) setTeamMembers(data);
    setFetchingTeam(false);
  };

  // 🟢 NAYA FUNCTION: Kisi member ya invite ko delete karne ke liye
  const handleRemoveMember = async (id: string) => {
    showConfirm(
      "Remove Team Member", 
      "Are you sure you want to remove this member or cancel their invite?",
      async () => {
        await supabase.from('team_members').delete().eq('id', id);
        setTeamMembers(teamMembers.filter(m => m.id !== id)); // Screen se foran hata do
        showAlert("Removed", "Member has been removed successfully.");
      }
    );
  };
  // 🟢 NAYA FUNCTION: Invite Bhejne ke liye
  const handleInviteTeamMember = async () => {
    if (!inviteEmail || !user) return;
    
    setIsInviting(true);
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          employerId: user.id
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      // Hamara VIP Custom Popup chalega
      showAlert("Invite Sent! 🎉", `An invitation has been sent to ${inviteEmail}.`);
      fetchTeamMembers(user.id);
      setInviteEmail(''); // Input wapas khali kar do
      
      // Note: Yahan hum list refresh karne wala function call karenge (wo hum next banayenge)
      
    } catch (error: any) {
      showAlert("Invite Failed", error.message);
    } finally {
      setIsInviting(false);
    }
  };
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMsg('');
    setIsDirty(false); // Save hone ke baad isDirty wapas false
    try {
      const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const payload = {
        name: formData.name,
        website: formData.website,
        description: formData.description,
        timezone: formData.timezone,
        slug: generatedSlug,
        email: formData.email,
        logo_url: formData.logo_url,
        cover_image_url: formData.cover_image_url, // 👈
        company_size: formData.company_size,
        industry: formData.industry,
        founded_year: formData.founded_year, // 👈
        funding_stage: formData.funding_stage, // 👈
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url, // 👈
        github_url: formData.github_url, // 👈
        tech_stack: formData.tech_stack, // 👈
        perks: formData.perks, // 👈
        allowed_countries: formData.allowed_countries,
        work_style: formData.work_style, // 👈 Naya
        equipment_allowance: formData.equipment_allowance, // 👈 Naya
        company_retreats: formData.company_retreats ,
        calendly_url: formData.calendly_url,
        cal_url: formData.cal_url,
        custom_booking_url: formData.custom_booking_url,
        interview_template: formData.interview_template,
        rejection_template: formData.rejection_template
      };

      let error;

      if (isExistingCompany) {
        // 🚀 UPDATE MODE: workspaceId ke zariye update karo
        const { error: updateError } = await supabase
          .from('companies')
          .update(payload)
          .eq('employer_id', workspaceId); // 👈 Yahan workspaceId lagaya
        error = updateError;
      } else {
        // 🚀 INSERT MODE: Nayi company banao
        const { error: insertError } = await supabase
          .from('companies')
          .insert({
            employer_id: workspaceId, // 👈 Yahan workspaceId lagaya
            ...payload
          });
          
        if (!insertError) {
            setIsExistingCompany(true); // Save hone ke baad isko Update mode mein daal do
        }
        error = insertError;
      }

      if (error) throw error;

      setSuccessMsg('Company details saved successfully! 🎉');
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (error: any) {
      console.error("Error saving company:", error);
      showAlert('Save Failed', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading Company Profile...</p>
      </div>
    );
  }
  

  const closeTour = () => {
    setTourStep(0);
    localStorage.setItem('hasSeenIntegrationTour', 'true'); // Save karlo
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl relative">
      {/* 🌑 TOUR BACKGROUND DIMMER */}
      {tourStep > 0 && (
        <div className="fixed inset-0 bg-slate-900/70 z-[100] backdrop-blur-[2px] transition-all duration-500"></div>
      )}
      {/* 📌 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Employer Branding</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">Build an elite profile to attract top remote talent.</p>
        </div>
        
        {/* 👀 VIP PREVIEW BUTTON (WITH SMART DROPDOWN) */}
        {formData.name && (
          <div className="relative">
            <button 
              onClick={() => {
                if (isDirty) {
                  setShowDropdown(!showDropdown); // Agar unsaved changes hain, toh dropdown kholo
                } else {
                  // Agar sab saved hai, toh seedha URL khol do
                  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  window.open(`/companies/${slug}`, '_blank');
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111625] text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-95"
            >
              <ExternalLink size={16} />
              Preview Profile
            </button>

            {/* 🔽 THE SMART DROPDOWN */}
            {showDropdown && isDirty && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span> Unsaved Changes
                </p>
                <button 
                  onClick={async () => {
                    setShowDropdown(false); // Dropdown band karo
                    await handleSave(); // 1. Pehle Data DB mein Save karo
                    // 2. Save hone ke baad Naya Tab khol do
                    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    window.open(`/companies/${slug}`, '_blank');
                  }}
                  disabled={saving}
                  className="w-full text-left px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                  {saving ? 'Saving...' : 'Save & Preview'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📌 Success Message */}
      {successMsg && (
        <div className="absolute top-0 right-0 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 shadow-sm z-10">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span className="text-sm font-bold">{successMsg}</span>
        </div>
      )}

      {/* 📌 Settings Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Navigation (Asli Tabs) */}
        <div className="w-full md:w-64 space-y-1 shrink-0">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 w-full px-4 py-2.5 font-bold rounded-xl transition-all duration-300 text-sm ${
              activeTab === 'profile' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
            }`}
          >
            <Building2 size={18} /> Company Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('remote')}
            className={`flex items-center gap-3 w-full px-4 py-2.5 font-bold rounded-xl transition-all duration-300 text-sm ${
              activeTab === 'remote' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
            }`}
          >
            <Globe2 size={18} /> Remote Preferences
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-3 w-full px-4 py-2.5 font-bold rounded-xl transition-all duration-300 text-sm ${
              activeTab === 'integrations' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
            }`}
          >
            <CalendarDays size={18} /> Integrations
          </button>
          {userRole === 'owner' && (
            <button 
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-3 w-full px-4 py-2.5 font-bold rounded-xl transition-all duration-300 text-sm ${
                activeTab === 'team' 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
              }`}
            >
              <Users size={18} /> Team Access
            </button>
          )}
        </div>

        {/* Right Side: Form Forms */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* 🟢 TAB 1: COMPANY PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              
              {/* --- 🎨 BRANDING SECTION (COVER & LOGO) --- */}
              <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-40 md:h-56 bg-slate-100 dark:bg-slate-800/50 group">
                    {isUploadingCover ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm"><Loader2 className="animate-spin text-indigo-500" size={30} /></div>
                    ) : formData.cover_image_url ? (
                        <img src={formData.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-50"><ImagePlus size={32} className="text-slate-400 mb-2"/><span className="text-xs font-bold text-slate-500">Add Cover Image</span></div>
                    )}
                    <div onClick={() => coverInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                        <Upload className="text-white" size={24} />
                    </div>
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                </div>

                {/* Overlapping Logo */}
                <div className="px-6 md:px-8 pb-8 flex flex-col">
                    
                    {/* 🚀 CSS FIX: -mt-12 isko upar kheench laye ga bina layout torey */}
                    <div className="-mt-10 md:-mt-12 mb-6 relative z-10 self-start">
                        <div className="h-20 w-20 md:h-24 md:w-24 bg-white dark:bg-[#0B0F19] rounded-2xl flex items-center justify-center border-4 border-white dark:border-[#111625] overflow-hidden shadow-lg group relative">
                            {isFetchingLogo || isUploadingLogo ? (
                                <Loader2 className="animate-spin text-indigo-400" size={24} />
                            ) : formData.logo_url ? (
                                <img src={formData.logo_url} alt="Logo" className="h-full w-full object-contain p-2" />
                            ) : (
                                <Building2 size={24} className="text-slate-300" />
                            )}
                            <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload size={20} className="text-white" />
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                        </div>
                    </div>

                    {/* Inputs Ab Bilkul Theek Jagah Aayenge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" placeholder="e.g. HireSkys Corp" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" placeholder="contact@company.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Website URL</label>
                        <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} onBlur={fetchLogoFromWebsite} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" placeholder="https://" />
                        <p className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1"><Sparkles size={10}/> Auto-fetches logo on blur</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Mission / Description</label>
                        <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm resize-none" placeholder="What are you building?"></textarea>
                      </div>
                    </div>
                    </div>
                </div>
              {/* --- 🚀 STATUS & STABILITY --- */}
              <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2"><Banknote className="text-emerald-500" size={16}/> Status & Stability</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Size</label>
                    <select value={formData.company_size} onChange={(e) => setFormData({...formData, company_size: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Funding Stage</label>
                    <select value={formData.funding_stage} onChange={(e) => setFormData({...formData, funding_stage: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
                      <option value="Bootstrapped">Bootstrapped</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B+">Series B+</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Year Founded</label>
                    <input type="number" value={formData.founded_year} onChange={(e) => setFormData({...formData, founded_year: e.target.value})} placeholder="e.g. 2021" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Industry</label>
                    <input type="text" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} placeholder="e.g. FinTech, Healthcare, AI..." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                </div>
              </div>

              {/* --- 💻 CULTURE & TECH --- */}
              <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2"><Code2 className="text-blue-500" size={16}/> Culture & Tech</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tech Stack / Tools <span className="text-slate-400 normal-case">(Optional)</span></label>
                    <input type="text" value={formData.tech_stack} onChange={(e) => setFormData({...formData, tech_stack: e.target.value})} placeholder="e.g. React, Node.js, AWS, Figma, Slack" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Top Perks & Benefits <span className="text-slate-400 normal-case">(Optional)</span></label>
                    <input type="text" value={formData.perks} onChange={(e) => setFormData({...formData, perks: e.target.value})} placeholder="e.g. 4-Day Work Week, Health Insurance, Setup Stipend" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                </div>
              </div>

              {/* --- 🌐 SOCIAL LINKS --- */}
              <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2"><Globe2 className="text-pink-500" size={16}/> Social Presence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><LinkIcon size={12}/> LinkedIn <span className="text-slate-400 normal-case ml-1">(Optional)</span></label>
                    <input type="url" value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/company/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Twitter size={12}/> Twitter / X <span className="text-slate-400 normal-case ml-1">(Optional)</span></label>
                    <input type="url" value={formData.twitter_url} onChange={(e) => setFormData({...formData, twitter_url: e.target.value})} placeholder="https://twitter.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Github size={12}/> GitHub <span className="text-slate-400 normal-case ml-1">(Optional)</span></label>
                    <input type="url" value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} placeholder="https://github.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 🟢 TAB 2: REMOTE PREFERENCES */}
          {activeTab === 'remote' && (
            <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Globe2 className="text-indigo-500" size={20} /> Remote Setup
              </h2>
              
              <div className="space-y-6">
                
                {/* 1. TIMEZONE (Pehle se tha) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">HQ / Primary Timezone</label>
                  <select 
                    value={formData.timezone}
                    onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="US Pacific Time (PST)">US Pacific Time (PST)</option>
                    <option value="US Eastern Time (EST)">US Eastern Time (EST)</option>
                    <option value="Greenwich Mean Time (GMT)">Greenwich Mean Time (GMT)</option>
                    <option value="Central European Time (CET)">Central European Time (CET)</option>
                    <option value="Pakistan Standard Time (PKT)">Pakistan Standard Time (PKT)</option>
                  </select>
                </div>

                {/* 2. 🌍 HIRING COUNTRIES (NAYA MULTI-SELECT) */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Eligible Hiring Countries</label>
                    <p className="text-sm text-slate-400">Select the countries where candidates must be located to apply. Select "Worldwide" if you hire anywhere.</p>
                  </div>

                  <div className="relative">
                    <select 
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        if (!selectedName || formData.allowed_countries.includes(selectedName)) return;
                        
                        // Worldwide select kiya toh sab delete
                        if (selectedName === "Worldwide") {
                            setFormData({...formData, allowed_countries: ["Worldwide"]});
                        } else {
                            // Koi aur country select ki toh Worldwide hata do
                            const updatedList = formData.allowed_countries.filter(c => c !== "Worldwide");
                            setFormData({...formData, allowed_countries: [...updatedList, selectedName]});
                        }
                        
                        e.target.value = ""; // Reset dropdown
                      }}
                      className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">+ Add a Country...</option>
                      <option value="Worldwide">🌍 Worldwide (Anywhere)</option>
                      <option disabled>──────────</option>
                      
                      {/* 🚀 Filter Unique Countries from your Map */}
                      {Array.from(new Set(Object.values(countryMap).map(c => c.name))).sort().map(countryName => (
                         <option key={countryName} value={countryName}>{countryName}</option>
                      ))}
                    </select>
                  </div>
{/* --- 🕒 WORK STYLE & BENEFITS (NEW) --- */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                     Work Style & Benefits
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Work Style Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Work Style <span className="text-slate-400 normal-case ml-1">(Optional)</span></label>
                      <select 
                        value={formData.work_style} 
                        onChange={(e) => setFormData({...formData, work_style: e.target.value})} 
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="Flexible / Asynchronous">Flexible / Asynchronous</option>
                        <option value="Required Overlap (4+ hours)">Required Overlap (4+ hours)</option>
                        <option value="Strict HQ Working Hours">Strict HQ Working Hours</option>
                      </select>
                    </div>

                    {/* Equipment Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Equipment <span className="text-slate-400 normal-case ml-1">(Optional)</span></label>
                      <select 
                        value={formData.equipment_allowance} 
                        onChange={(e) => setFormData({...formData, equipment_allowance: e.target.value})} 
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="Laptop Provided">Company Laptop Provided</option>
                        <option value="Home Office Stipend">Home Office Setup Stipend</option>
                        <option value="BYOD (Bring Your Own Device)">BYOD (Bring Your Own Device)</option>
                      </select>
                    </div>

                    {/* Retreats Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Retreats <span className="text-slate-400 normal-case ml-1">(Optional)</span></label>
                      <select 
                        value={formData.company_retreats} 
                        onChange={(e) => setFormData({...formData, company_retreats: e.target.value})} 
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="No retreats currently">No retreats currently</option>
                        <option value="Annual paid retreats">Yes, Annual paid retreats</option>
                        <option value="Quarterly meetups">Quarterly team meetups</option>
                      </select>
                    </div>

                  </div>
                </div>
                  {/* 🟢 SELECTED COUNTRIES PILLS */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.allowed_countries.length === 0 && (
                        <span className="text-sm text-slate-400 italic">No restrictions (Worldwide default)</span>
                    )}

                    {formData.allowed_countries.map(country => {
                        // Find Flag
                        const mapEntry = Object.values(countryMap).find(c => c.name === country);
                        const flag = country === "Worldwide" ? "🌍" : (mapEntry?.flag || "📍");

                        return (
                          <div key={country} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-sm font-bold shadow-sm animate-in fade-in zoom-in-95 duration-200">
                            <span>{flag}</span>
                            <span>{country}</span>
                            <button 
                                onClick={() => setFormData({...formData, allowed_countries: formData.allowed_countries.filter(c => c !== country)})}
                                className="ml-1 p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded transition-colors text-indigo-500"
                            >
                                <X size={14} />
                            </button>
                          </div>
                        )
                    })}
                  </div>

                </div>

              </div>
            </div>
          )}
         {/* 🟢 TAB 3: INTEGRATIONS (OAUTH FREE & PROFESSIONAL) */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 relative pb-64">
              
              {/* 🔒 THE VIP LOCK OVERLAY FOR INTEGRATIONS */}
              {!hasStartupAccess && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-[#0B0F19]/70 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Lock className="text-indigo-500" size={24} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Unlock Automations</h3>
                   <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm text-sm font-medium">
                     Upgrade to the <strong className="text-indigo-600 dark:text-indigo-400">Startup Plan</strong> to automate interview scheduling.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row items-center gap-3">
                     <Link href="/employer/billing" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2 hover:-translate-y-0.5">
                       <Sparkles size={16} /> Upgrade to Startup
                     </Link>
                     <Link href="/blog/how-hireskys-ats-works#integrations" target="_blank" className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 hover:-translate-y-0.5 shadow-sm">
                       <Info size={16} className="text-indigo-500" /> See How it Works
                     </Link>
                   </div>
                </div>
              )}

              {/* 🟢 ORIGINAL CONTENT */}
              <div className={`bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-300 ${!hasStartupAccess ? 'opacity-30 pointer-events-none select-none blur-[2px]' : ''}`}>
                
                {/* Header Section */}
                <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarDays className="text-indigo-500" size={24} /> Automated Scheduling
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
                    Add your booking link below. We'll generate a secure, personalized email and send it to candidates automatically whenever you move them to the "Interviewing" stage.
                  </p>
                </div>

                <div className="space-y-8">
                  
                  {/* 🚀 STEP 1: BOOKING LINKS (Teeno cards ko ek group mein daal diya) */}
                  <div className={`space-y-4 ${getHighlightClass(1)} p-4 -m-4 rounded-3xl`}>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <LinkIcon className="text-blue-500" size={16}/> 1. Choose Your Booking Tool
                    </h3>
                    
                    {/* CALENDLY CARD */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 bg-white dark:bg-[#151b2e] rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 shrink-0">
                           <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#006BFF"/>
                              <path d="M11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7V12.5L16.2929 15.7929C16.6834 16.1834 16.6834 16.8166 16.2929 17.2071C15.9024 17.5976 15.2692 17.5976 14.8787 17.2071L11.2929 13.6213C11.1054 13.4338 11 13.1795 11 12.9142V7Z" fill="white"/>
                           </svg>
                        </div>
                        <div className="flex-1 w-full">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                            Calendly <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] uppercase tracking-wider">Most Popular</span>
                          </h3>
                          <p className="text-sm font-medium text-slate-500 mt-1">Paste your booking link to automatically schedule interviews.</p>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 mt-3 md:mt-0 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="url" value={formData.calendly_url} onChange={(e) => setFormData({...formData, calendly_url: e.target.value})} placeholder="https://calendly.com/your-link" className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                      </div>
                    </div>

                    {/* CAL.COM CARD */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 bg-black dark:bg-[#151b2e] rounded-2xl flex items-center justify-center shadow-sm border border-slate-800 dark:border-slate-700/50 shrink-0">
                           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM6.5 12C6.5 8.96243 8.96243 6.5 12 6.5C13.6845 6.5 15.1915 7.25883 16.1953 8.44185L14.7811 9.85607C14.103 9.02293 13.1042 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5C13.1042 15.5 14.103 14.9771 14.7811 14.1439L16.1953 15.5582C15.1915 16.7412 13.6845 17.5 12 17.5C8.96243 17.5 6.5 15.0376 6.5 12Z" fill="white"/>
                           </svg>
                        </div>
                        <div className="flex-1 w-full">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                            Cal.com <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] uppercase tracking-wider font-bold">Open Source</span>
                          </h3>
                          <p className="text-sm font-medium text-slate-500 mt-1">The modern scheduling alternative. Drop your link here.</p>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 mt-3 md:mt-0 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="url" value={formData.cal_url} onChange={(e) => setFormData({...formData, cal_url: e.target.value})} placeholder="https://cal.com/your-link" className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors" />
                      </div>
                    </div>

                    {/* CUSTOM BOOKING LINK CARD */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] hover:border-purple-300 dark:hover:border-purple-700/50 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                           <LinkIcon className="text-white w-6 h-6" />
                        </div>
                        <div className="flex-1 w-full">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                            Custom Link <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] uppercase tracking-wider font-bold">Universal</span>
                          </h3>
                          <p className="text-sm font-medium text-slate-500 mt-1">Using HubSpot, TidyCal, or Zoho? Paste any scheduling link here.</p>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 mt-3 md:mt-0 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe2 className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="url" value={formData.custom_booking_url} onChange={(e) => setFormData({...formData, custom_booking_url: e.target.value})} placeholder="https://your-booking-tool.com/link" className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                      </div>
                    </div>
                    {renderTourTooltip(1)}
                  </div>

                  {/* 🚀 STEP 2: EMAIL TEMPLATE CUSTOMIZATION */}
                  <div className={`border-t border-slate-200 dark:border-slate-800 pt-8 p-4 -mx-4 rounded-3xl ${getHighlightClass(2)}`}>
                    <div className="mb-6">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Code2 className="text-fuchsia-500" size={20} /> 2. Custom Email Template
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Personalize the email that gets sent when you move a candidate to the "Interviewing" stage. 
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative">
                      <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
                        <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 mr-2">Smart Variables:</span>
                        <code className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-[#111625] text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800">{"{{candidate_name}}"}</code>
                        <code className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-[#111625] text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800">{"{{job_title}}"}</code>
                        <code className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-[#111625] text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800">{"{{company_name}}"}</code>
                      </div>
                      <textarea 
                        value={formData.interview_template}
                        onChange={(e) => setFormData({...formData, interview_template: e.target.value})}
                        placeholder="Hi {{candidate_name}},&#10;&#10;Congratulations! We would like to invite you for an interview for the {{job_title}} position at {{company_name}}.&#10;&#10;Please select a date and time that works best for you.&#10;&#10;Looking forward to speaking with you!"
                        className="w-full h-48 px-4 py-3 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors resize-none custom-scrollbar"
                      />
                      <p className="text-[10px] font-medium text-slate-400 mt-2 text-right flex items-center justify-end gap-1">
                        <Info size={12}/> The booking link button will be attached automatically at the bottom.
                      </p>
                    </div>
                    {renderTourTooltip(2)}
                  </div>
{/* 🚀 ANTI-GHOSTING: REJECTION EMAIL TEMPLATE */}
                    <div className="mt-10 border-t border-slate-100 dark:border-slate-800/50 pt-8">
                      <div className="mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Mail className="text-rose-500" size={20} /> Rejection Email Template <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] uppercase tracking-wider font-bold">Anti-Ghosting</span>
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Send a polite closure email automatically when you move a candidate to the "Rejected" stage. Keeps your employer brand strong!
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative">
                        {/* Helper Variables Box */}
                        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-xl">
                          <span className="text-xs font-bold text-rose-800 dark:text-rose-300 mr-2">Smart Variables:</span>
                          <code className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-[#111625] text-rose-600 dark:text-rose-400 rounded-lg shadow-sm border border-rose-100 dark:border-rose-800">{"{{candidate_name}}"}</code>
                          <code className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-[#111625] text-rose-600 dark:text-rose-400 rounded-lg shadow-sm border border-rose-100 dark:border-rose-800">{"{{job_title}}"}</code>
                          <code className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-[#111625] text-rose-600 dark:text-rose-400 rounded-lg shadow-sm border border-rose-100 dark:border-rose-800">{"{{company_name}}"}</code>
                        </div>

                        {/* Textarea */}
                        <textarea 
                          value={formData.rejection_template}
                          onChange={(e) => setFormData({...formData, rejection_template: e.target.value})}
                          placeholder="Hi {{candidate_name}},&#10;&#10;Thank you for taking the time to apply for the {{job_title}} position at {{company_name}}.&#10;&#10;While we were impressed by your background, we have decided to move forward with other candidates whose experience better aligns with our current needs.&#10;&#10;We wish you the best of luck in your job search!"
                          className="w-full h-48 px-4 py-3 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors resize-none custom-scrollbar"
                        />
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}
          {/* 🟢 TAB 4: TEAM ACCESS (MULTI-USER) */}
          {activeTab === 'team' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 relative">
              
              {/* 🔒 THE VIP LOCK OVERLAY FOR TEAM */}
              {!hasScaleAccess && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-[#0B0F19]/70 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Lock className="text-fuchsia-500" size={24} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Unlock Team Collaboration</h3>
                   <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm text-sm font-medium">
                     Upgrade to the <strong className="text-fuchsia-600 dark:text-fuchsia-400">Scale Plan</strong> to invite recruiters and hiring managers to your workspace.
                   </p>
                   
                   {/* 🟢 NAYA JADOO: 2 Buttons (Upgrade + Learn) */}
                   <div className="flex flex-col sm:flex-row items-center gap-3">
                     <Link href="/employer/billing" className="px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-500/30 hover:bg-fuchsia-700 transition-all flex items-center gap-2 hover:-translate-y-0.5">
                       <Sparkles size={16} /> Upgrade to Scale
                     </Link>
                     
                     <Link href="/blog/how-hireskys-ats-works#team-access" target="_blank" className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 hover:-translate-y-0.5 shadow-sm">
                       <Info size={16} className="text-fuchsia-500" /> See How it Works
                     </Link>
                   </div>

                </div>
              )}

              {/* 🟢 ORIGINAL CONTENT (Blur agar access nahi) */}
              <div className={`bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-300 ${!hasScaleAccess ? 'opacity-30 pointer-events-none select-none blur-[2px]' : ''}`}>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="text-indigo-500" size={24} /> Team Collaboration
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
                    Invite recruiters, hiring managers, or team leads to collaborate on your hiring pipeline.
                  </p>
                </div>

                {/* 🚀 Invite Form */}
                <div className="flex flex-col md:flex-row gap-4 p-5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl mb-8">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com" 
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-4 w-4 text-slate-400" />
                      </div>
                      <select 
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="interviewer">Interviewer</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-end">
                    <button 
  onClick={handleInviteTeamMember}
  disabled={!inviteEmail || isInviting}
  className="w-full h-[42px] px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
>
  {isInviting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
  Send Invite
</button>
                  </div>
                </div>

                {/* 🚀 Team List UI (Dummy for now) */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Active & Pending Members</h3>
                  
                  <div className="space-y-3">
                    {/* Owner Badge (Hamesha top par) */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.email}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">Workspace Owner</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                        Owner
                      </span>
                    </div>

                    {/* 🟢 Loader */}
                    {fetchingTeam && <div className="text-center py-4"><Loader2 className="animate-spin text-indigo-500 mx-auto" size={24}/></div>}

                    {/* 🟢 Real Team Members List */}
                    {!fetchingTeam && teamMembers.map((member) => (
                      <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200 dark:border-slate-700">
                            {member.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{member.email}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 capitalize">{member.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-black rounded-lg border ${
                            member.status === 'active' 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                          }`}>
                            {member.status}
                          </span>
                          
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            title="Remove Member"
                            className="p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-300 rounded-lg transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Empty State */}
                    {!fetchingTeam && teamMembers.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <Users className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={32} />
                        <p className="text-sm font-bold text-slate-500">No team members invited yet.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
          
          {/* 🟢 SAVE BUTTON (Always visible) */}
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </div>
      </div>
      {/* 🟢 CUSTOM POPUP MODAL (Alerts & Confirms) */}
      {popup.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111625] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center text-center">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                popup.type === 'confirm' 
                  ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
                {popup.type === 'confirm' ? <AlertTriangle size={32} /> : <Info size={32} />}
              </div>
              
              {/* Title & Message */}
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{popup.title}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{popup.message}</p>
            </div>

            {/* Modal Actions */}
            <div className="p-4 md:px-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button 
                onClick={closePopup}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111625] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
              >
                {popup.type === 'confirm' ? 'Cancel' : 'Okay'}
              </button>
              
              {popup.type === 'confirm' && (
                <button 
                  onClick={() => {
                    if (popup.onConfirm) popup.onConfirm();
                    closePopup();
                  }}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/20 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  Yes, do it
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}