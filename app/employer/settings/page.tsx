"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Building2, Globe2, Save, Loader2, CheckCircle2, Link as LinkIcon, Users, Building, RefreshCw, Sparkles, X, Upload, ImagePlus, Twitter, Github, Banknote, Code2, HeartPulse, ExternalLink
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

  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false); 
  const [isUploadingCover, setIsUploadingCover] = useState(false); // 👈 Nayi State
  // 🟢 Nayi State Variables
  const [isDirty, setIsDirty] = useState(false); // Check karega ke unsaved changes hain ya nahi
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown kholne ke liye
  const isFirstLoad = useRef(true);

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
    company_retreats: 'No retreats currently'
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
  async function fetchCompanyData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      setUser(session.user);

      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('employer_id', session.user.id)
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
          company_retreats: company.company_retreats || 'No retreats currently' // 👈 Naya
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
        company_retreats: formData.company_retreats // 👈 Naya
      };

      let error;

      if (isExistingCompany) {
        // 🚀 UPDATE MODE: employer_id ke zariye update karo
        const { error: updateError } = await supabase
          .from('companies')
          .update(payload)
          .eq('employer_id', user.id); 
        error = updateError;
      } else {
        // 🚀 INSERT MODE: Nayi company banao
        const { error: insertError } = await supabase
          .from('companies')
          .insert({
            employer_id: user.id,
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
      alert("Save failed: " + error.message);
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl relative">
      
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
    </div>
  );
}