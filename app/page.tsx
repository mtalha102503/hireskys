"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation'; 
import { createSlug } from '@/lib/utils';
import CategorySection from "@/components/CategorySection";
import { CATEGORIES } from '@/lib/categories'; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Globe, Briefcase, ShieldCheck, 
  Video, Code, PenTool, Layout, Layers, ArrowRight, Clock,
  User as UserIcon, Smartphone, Cpu, Edit3, X, Zap, Facebook, Linkedin,
  Heart, ChevronDown, Filter, Users, Award, Bell, Bookmark, Rocket, CheckCircle, IdCard, Loader2, Sparkles, TrendingUp, ChevronUp, Check, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';


const JOBS_PER_PAGE = 80;

// --- PLATFORM ICONS ---
const getPlatformIcon = (platform: string) => {
  const p = platform || 'Web'; 
  switch(p) {
    case 'X': return <X size={14} className="text-sky-500" />;
    case 'Facebook': return <Facebook size={14} className="text-blue-600" />;
    case 'LinkedIn': return <Linkedin size={14} className="text-blue-700" />;
    default: return <Globe size={14} className="text-slate-400" />;
  }
};

type Job = {
  id: number;
  title: string;
  source: string;
  link: string;
  category: string;
  date_posted: string;
  is_verified: boolean;
  approved: boolean;
  active: boolean;
  tags?: string[];
  platform?: string;
  job_type?: string;
  country?: string; 
  location?: string;
};

const extractCountry = (locationString: string) => {
  // 1. Safety check
  if (!locationString) return { 
  name: locationString, 
  flag: "🌍", 
  code: null, // ✨ Ye null add kar dena fallback ke liye
  isRemote: false,
  displayName: "Global" 
};

  const loc = locationString.trim().toUpperCase(); // Trim spaces
  const isRemote = loc.includes("REMOTE");

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
    "AF": { code: "AF", flag: "🇦🇫", name: "Afghanistan" },
    "ALBANIA": { code: "AL", flag: "🇦🇱", name: "Albania" },
    "AL": { code: "AL", flag: "🇦🇱", name: "Albania" },
    "ALGERIA": { code: "DZ", flag: "🇩🇿", name: "Algeria" },
    "DZ": { code: "DZ", flag: "🇩🇿", name: "Algeria" },
    "ANDORRA": { code: "AD", flag: "🇦🇩", name: "Andorra" },
    "AD": { code: "AD", flag: "🇦🇩", name: "Andorra" },
    "ANGOLA": { code: "AO", flag: "🇦🇴", name: "Angola" },
    "AO": { code: "AO", flag: "🇦🇴", name: "Angola" },
    "ANTIGUA": { code: "AG", flag: "🇦🇬", name: "Antigua and Barbuda" },
    "AG": { code: "AG", flag: "🇦🇬", name: "Antigua and Barbuda" },
    "ARMENIA": { code: "AM", flag: "🇦🇲", name: "Armenia" },
    "AM": { code: "AM", flag: "🇦🇲", name: "Armenia" },
    "AUSTRIA": { code: "AT", flag: "🇦🇹", name: "Austria" },
    "AT": { code: "AT", flag: "🇦🇹", name: "Austria" },
    "AZERBAIJAN": { code: "AZ", flag: "🇦🇿", name: "Azerbaijan" },
    "AZ": { code: "AZ", flag: "🇦🇿", name: "Azerbaijan" },
    "BAHAMAS": { code: "BS", flag: "🇧🇸", name: "Bahamas" },
    "BS": { code: "BS", flag: "🇧🇸", name: "Bahamas" },
    "BAHRAIN": { code: "BH", flag: "🇧🇭", name: "Bahrain" },
    "BH": { code: "BH", flag: "🇧🇭", name: "Bahrain" },
    "BARBADOS": { code: "BB", flag: "🇧🇧", name: "Barbados" },
    "BB": { code: "BB", flag: "🇧🇧", name: "Barbados" },
    "BELARUS": { code: "BY", flag: "🇧🇾", name: "Belarus" },
    "BY": { code: "BY", flag: "🇧🇾", name: "Belarus" },
    "BELGIUM": { code: "BE", flag: "🇧🇪", name: "Belgium" },
    "BE": { code: "BE", flag: "🇧🇪", name: "Belgium" },
    "BELIZE": { code: "BZ", flag: "🇧🇿", name: "Belize" },
    "BZ": { code: "BZ", flag: "🇧🇿", name: "Belize" },
    "BENIN": { code: "BJ", flag: "🇧🇯", name: "Benin" },
    "BJ": { code: "BJ", flag: "🇧🇯", name: "Benin" },
    "BHUTAN": { code: "BT", flag: "🇧🇹", name: "Bhutan" },
    "BT": { code: "BT", flag: "🇧🇹", name: "Bhutan" },
    "BOLIVIA": { code: "BO", flag: "🇧🇴", name: "Bolivia" },
    "BO": { code: "BO", flag: "🇧🇴", name: "Bolivia" },
    "BOSNIA": { code: "BA", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
    "BA": { code: "BA", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
    "BOTSWANA": { code: "BW", flag: "🇧🇼", name: "Botswana" },
    "BW": { code: "BW", flag: "🇧🇼", name: "Botswana" },
    "BRUNEI": { code: "BN", flag: "🇧🇳", name: "Brunei" },
    "BN": { code: "BN", flag: "🇧🇳", name: "Brunei" },
    "BULGARIA": { code: "BG", flag: "🇧🇬", name: "Bulgaria" },
    "BG": { code: "BG", flag: "🇧🇬", name: "Bulgaria" },
    "BURKINA FASO": { code: "BF", flag: "🇧🇫", name: "Burkina Faso" },
    "BF": { code: "BF", flag: "🇧🇫", name: "Burkina Faso" },
    "BURUNDI": { code: "BI", flag: "🇧🇮", name: "Burundi" },
    "BI": { code: "BI", flag: "🇧🇮", name: "Burundi" },
    "CAMBODIA": { code: "KH", flag: "🇰🇭", name: "Cambodia" },
    "KH": { code: "KH", flag: "🇰🇭", name: "Cambodia" },
    "CAMEROON": { code: "CM", flag: "🇨🇲", name: "Cameroon" },
    "CM": { code: "CM", flag: "🇨🇲", name: "Cameroon" },
    "CAPE VERDE": { code: "CV", flag: "🇨🇻", name: "Cape Verde" },
    "CV": { code: "CV", flag: "🇨🇻", name: "Cape Verde" },
    "CHILE": { code: "CL", flag: "🇨🇱", name: "Chile" },
    "CL": { code: "CL", flag: "🇨🇱", name: "Chile" },
    "COLOMBIA": { code: "CO", flag: "🇨🇴", name: "Colombia" },
    "CO": { code: "CO", flag: "🇨🇴", name: "Colombia" },
    "COMOROS": { code: "KM", flag: "🇰🇲", name: "Comoros" },
    "KM": { code: "KM", flag: "🇰🇲", name: "Comoros" },
    "COSTA RICA": { code: "CR", flag: "🇨🇷", name: "Costa Rica" },
    "CR": { code: "CR", flag: "🇨🇷", name: "Costa Rica" },
    "CROATIA": { code: "HR", flag: "🇭🇷", name: "Croatia" },
    "HR": { code: "HR", flag: "🇭🇷", name: "Croatia" },
    "CUBA": { code: "CU", flag: "🇨🇺", name: "Cuba" },
    "CU": { code: "CU", flag: "🇨🇺", name: "Cuba" },
    "CYPRUS": { code: "CY", flag: "🇨🇾", name: "Cyprus" },
    "CY": { code: "CY", flag: "🇨🇾", name: "Cyprus" },
    "CZECH REPUBLIC": { code: "CZ", flag: "🇨🇿", name: "Czech Republic" },
    "CZ": { code: "CZ", flag: "🇨🇿", name: "Czech Republic" },
    "DENMARK": { code: "DK", flag: "🇩🇰", name: "Denmark" },
    "DK": { code: "DK", flag: "🇩🇰", name: "Denmark" },
    "DJIBOUTI": { code: "DJ", flag: "🇩🇯", name: "Djibouti" },
    "DJ": { code: "DJ", flag: "🇩🇯", name: "Djibouti" },
    "DOMINICA": { code: "DM", flag: "🇩🇲", name: "Dominica" },
    "DM": { code: "DM", flag: "🇩🇲", name: "Dominica" },
    "DOMINICAN REPUBLIC": { code: "DO", flag: "🇩🇴", name: "Dominican Republic" },
    "DO": { code: "DO", flag: "🇩🇴", name: "Dominican Republic" },
    "ECUADOR": { code: "EC", flag: "🇪🇨", name: "Ecuador" },
    "EC": { code: "EC", flag: "🇪🇨", name: "Ecuador" },
    "EL SALVADOR": { code: "SV", flag: "🇸🇻", name: "El Salvador" },
    "SV": { code: "SV", flag: "🇸🇻", name: "El Salvador" },
    "ESTONIA": { code: "EE", flag: "🇪🇪", name: "Estonia" },
    "EE": { code: "EE", flag: "🇪🇪", name: "Estonia" },
    "ETHIOPIA": { code: "ET", flag: "🇪🇹", name: "Ethiopia" },
    "ET": { code: "ET", flag: "🇪🇹", name: "Ethiopia" },
    "FIJI": { code: "FJ", flag: "🇫🇯", name: "Fiji" },
    "FJ": { code: "FJ", flag: "🇫🇯", name: "Fiji" },
    "FINLAND": { code: "FI", flag: "🇫🇮", name: "Finland" },
    "FI": { code: "FI", flag: "🇫🇮", name: "Finland" },
    "GABON": { code: "GA", flag: "🇬🇦", name: "Gabon" },
    "GA": { code: "GA", flag: "🇬🇦", name: "Gabon" },
    "GAMBIA": { code: "GM", flag: "🇬🇲", name: "Gambia" },
    "GM": { code: "GM", flag: "🇬🇲", name: "Gambia" },
    "GEORGIA": { code: "GE", flag: "🇬🇪", name: "Georgia" },
    "GE": { code: "GE", flag: "🇬🇪", name: "Georgia" },
    "GHANA": { code: "GH", flag: "🇬🇭", name: "Ghana" },
    "GH": { code: "GH", flag: "🇬🇭", name: "Ghana" },
    "GREECE": { code: "GR", flag: "🇬🇷", name: "Greece" },
    "GR": { code: "GR", flag: "🇬🇷", name: "Greece" },
    "GRENADA": { code: "GD", flag: "🇬🇩", name: "Grenada" },
    "GD": { code: "GD", flag: "🇬🇩", name: "Grenada" },
    "GUATEMALA": { code: "GT", flag: "🇬🇹", name: "Guatemala" },
    "GT": { code: "GT", flag: "🇬🇹", name: "Guatemala" },
    "GUINEA": { code: "GN", flag: "🇬🇳", name: "Guinea" },
    "GN": { code: "GN", flag: "🇬🇳", name: "Guinea" },
    "GUYANA": { code: "GY", flag: "🇬🇾", name: "Guyana" },
    "GY": { code: "GY", flag: "🇬🇾", name: "Guyana" },
    "HAITI": { code: "HT", flag: "🇭🇹", name: "Haiti" },
    "HT": { code: "HT", flag: "🇭🇹", name: "Haiti" },
    "HONDURAS": { code: "HN", flag: "🇭🇳", name: "Honduras" },
    "HN": { code: "HN", flag: "🇭🇳", name: "Honduras" },
    "HUNGARY": { code: "HU", flag: "🇭🇺", name: "Hungary" },
    "HU": { code: "HU", flag: "🇭🇺", name: "Hungary" },
    "ICELAND": { code: "IS", flag: "🇮🇸", name: "Iceland" },
    "IS": { code: "IS", flag: "🇮🇸", name: "Iceland" },
    "IRAN": { code: "IR", flag: "🇮🇷", name: "Iran" },
    "IR": { code: "IR", flag: "🇮🇷", name: "Iran" },
    "IRAQ": { code: "IQ", flag: "🇮🇶", name: "Iraq" },
    "IQ": { code: "IQ", flag: "🇮🇶", name: "Iraq" },
    "IRELAND": { code: "IE", flag: "🇮🇪", name: "Ireland" },
    "IE": { code: "IE", flag: "🇮🇪", name: "Ireland" },
    "ISRAEL": { code: "IL", flag: "🇮🇱", name: "Israel" },
    "IL": { code: "IL", flag: "🇮🇱", name: "Israel" },
    "ITALY": { code: "IT", flag: "🇮🇹", name: "Italy" },
    "IT": { code: "IT", flag: "🇮🇹", name: "Italy" },
    "JAMAICA": { code: "JM", flag: "🇯🇲", name: "Jamaica" },
    "JM": { code: "JM", flag: "🇯🇲", name: "Jamaica" },
    "JORDAN": { code: "JO", flag: "🇯🇴", name: "Jordan" },
    "JO": { code: "JO", flag: "🇯🇴", name: "Jordan" },
    "KAZAKHSTAN": { code: "KZ", flag: "🇰🇿", name: "Kazakhstan" },
    "KZ": { code: "KZ", flag: "🇰🇿", name: "Kazakhstan" },
    "KENYA": { code: "KE", flag: "🇰🇪", name: "Kenya" },
    "KE": { code: "KE", flag: "🇰🇪", name: "Kenya" },
    "KUWAIT": { code: "KW", flag: "🇰🇼", name: "Kuwait" },
    "KW": { code: "KW", flag: "🇰🇼", name: "Kuwait" },
    "KYRGYZSTAN": { code: "KG", flag: "🇰🇬", name: "Kyrgyzstan" },
    "KG": { code: "KG", flag: "🇰🇬", name: "Kyrgyzstan" },
    "LAOS": { code: "LA", flag: "🇱🇦", name: "Laos" },
    "LA": { code: "LA", flag: "🇱🇦", name: "Laos" },
    "LATVIA": { code: "LV", flag: "🇱🇻", name: "Latvia" },
    "LV": { code: "LV", flag: "🇱🇻", name: "Latvia" },
    "LEBANON": { code: "LB", flag: "🇱🇧", name: "Lebanon" },
    "LB": { code: "LB", flag: "🇱🇧", name: "Lebanon" },
    "LIBYA": { code: "LY", flag: "🇱🇾", name: "Libya" },
    "LY": { code: "LY", flag: "🇱🇾", name: "Libya" },
    "LITHUANIA": { code: "LT", flag: "🇱🇹", name: "Lithuania" },
    "LT": { code: "LT", flag: "🇱🇹", name: "Lithuania" },
    "LUXEMBOURG": { code: "LU", flag: "🇱🇺", name: "Luxembourg" },
    "LU": { code: "LU", flag: "🇱🇺", name: "Luxembourg" },
    "MADAGASCAR": { code: "MG", flag: "🇲🇬", name: "Madagascar" },
    "MG": { code: "MG", flag: "🇲🇬", name: "Madagascar" },
    "MALAYSIA": { code: "MY", flag: "🇲🇾", name: "Malaysia" },
    "MY": { code: "MY", flag: "🇲🇾", name: "Malaysia" },
    "MALDIVES": { code: "MV", flag: "🇲🇻", name: "Maldives" },
    "MV": { code: "MV", flag: "🇲🇻", name: "Maldives" },
    "MALI": { code: "ML", flag: "🇲🇱", name: "Mali" },
    "ML": { code: "ML", flag: "🇲🇱", name: "Mali" },
    "MALTA": { code: "MT", flag: "🇲🇹", name: "Malta" },
    "MT": { code: "MT", flag: "🇲🇹", name: "Malta" },
    "MEXICO": { code: "MX", flag: "🇲🇽", name: "Mexico" },
    "MX": { code: "MX", flag: "🇲🇽", name: "Mexico" },
    "MOLDOVA": { code: "MD", flag: "🇲🇩", name: "Moldova" },
    "MD": { code: "MD", flag: "🇲🇩", name: "Moldova" },
    "MONACO": { code: "MC", flag: "🇲🇨", name: "Monaco" },
    "MC": { code: "MC", flag: "🇲🇨", name: "Monaco" },
    "MONGOLIA": { code: "MN", flag: "🇲🇳", name: "Mongolia" },
    "MN": { code: "MN", flag: "🇲🇳", name: "Mongolia" },
    "MONTENEGRO": { code: "ME", flag: "🇲🇪", name: "Montenegro" },
    "ME": { code: "ME", flag: "🇲🇪", name: "Montenegro" },
    "MOROCCO": { code: "MA", flag: "🇲🇦", name: "Morocco" },
    "MA": { code: "MA", flag: "🇲🇦", name: "Morocco" },
    "MYANMAR": { code: "MM", flag: "🇲🇲", name: "Myanmar" },
    "MM": { code: "MM", flag: "🇲🇲", name: "Myanmar" },
    "NAMIBIA": { code: "NA", flag: "🇳🇦", name: "Namibia" },
    "NA": { code: "NA", flag: "🇳🇦", name: "Namibia" },
    "NEPAL": { code: "NP", flag: "🇳🇵", name: "Nepal" },
    "NP": { code: "NP", flag: "🇳🇵", name: "Nepal" },
    "NETHERLANDS": { code: "NL", flag: "🇳🇱", name: "Netherlands" },
    "NL": { code: "NL", flag: "🇳🇱", name: "Netherlands" },
    "NICARAGUA": { code: "NI", flag: "🇳🇮", name: "Nicaragua" },
    "NI": { code: "NI", flag: "🇳🇮", name: "Nicaragua" },
    "NIGER": { code: "NE", flag: "🇳🇪", name: "Niger" },
    "NE": { code: "NE", flag: "🇳🇪", name: "Niger" },
    "NORTH KOREA": { code: "KP", flag: "🇰🇵", name: "North Korea" },
    "KP": { code: "KP", flag: "🇰🇵", name: "North Korea" },
    "OMAN": { code: "OM", flag: "🇴🇲", name: "Oman" },
    "OM": { code: "OM", flag: "🇴🇲", name: "Oman" },
    "PANAMA": { code: "PA", flag: "🇵🇦", name: "Panama" },
    "PA": { code: "PA", flag: "🇵🇦", name: "Panama" },
    "PARAGUAY": { code: "PY", flag: "🇵🇾", name: "Paraguay" },
    "PY": { code: "PY", flag: "🇵🇾", name: "Paraguay" },
    "PERU": { code: "PE", flag: "🇵🇪", name: "Peru" },
    "PE": { code: "PE", flag: "🇵🇪", name: "Peru" },
    "POLAND": { code: "PL", flag: "🇵🇱", name: "Poland" },
    "PL": { code: "PL", flag: "🇵🇱", name: "Poland" },
    "PORTUGAL": { code: "PT", flag: "🇵🇹", name: "Portugal" },
    "PT": { code: "PT", flag: "🇵🇹", name: "Portugal" },
    "QATAR": { code: "QA", flag: "🇶🇦", name: "Qatar" },
    "QA": { code: "QA", flag: "🇶🇦", name: "Qatar" },
    "ROMANIA": { code: "RO", flag: "🇷🇴", name: "Romania" },
    "RO": { code: "RO", flag: "🇷🇴", name: "Romania" },
    "RUSSIA": { code: "RU", flag: "🇷🇺", name: "Russia" },
    "RU": { code: "RU", flag: "🇷🇺", name: "Russia" },
    "RWANDA": { code: "RW", flag: "🇷🇼", name: "Rwanda" },
    "RW": { code: "RW", flag: "🇷🇼", name: "Rwanda" },
    "SENEGAL": { code: "SN", flag: "🇸🇳", name: "Senegal" },
    "SN": { code: "SN", flag: "🇸🇳", name: "Senegal" },
    "SERBIA": { code: "RS", flag: "🇷🇸", name: "Serbia" },
    "RS": { code: "RS", flag: "🇷🇸", name: "Serbia" },
    "SLOVAKIA": { code: "SK", flag: "🇸🇰", name: "Slovakia" },
    "SK": { code: "SK", flag: "🇸🇰", name: "Slovakia" },
    "SLOVENIA": { code: "SI", flag: "🇸🇮", name: "Slovenia" },
    "SI": { code: "SI", flag: "🇸🇮", name: "Slovenia" },
    "SOMALIA": { code: "SO", flag: "🇸🇴", name: "Somalia" },
    "SO": { code: "SO", flag: "🇸🇴", name: "Somalia" },
    "SOUTH KOREA": { code: "KR", flag: "🇰🇷", name: "South Korea" },
    "KR": { code: "KR", flag: "🇰🇷", name: "South Korea" },
    "SPAIN": { code: "ES", flag: "🇪🇸", name: "Spain" },
    "ES": { code: "ES", flag: "🇪🇸", name: "Spain" },
    "SRI LANKA": { code: "LK", flag: "🇱🇰", name: "Sri Lanka" },
    "LK": { code: "LK", flag: "🇱🇰", name: "Sri Lanka" },
    "SUDAN": { code: "SD", flag: "🇸🇩", name: "Sudan" },
    "SD": { code: "SD", flag: "🇸🇩", name: "Sudan" },
    "SWEDEN": { code: "SE", flag: "🇸🇪", name: "Sweden" },
    "SE": { code: "SE", flag: "🇸🇪", name: "Sweden" },
    "SWITZERLAND": { code: "CH", flag: "🇨🇭", name: "Switzerland" },
    "CH": { code: "CH", flag: "🇨🇭", name: "Switzerland" },
    "SYRIA": { code: "SY", flag: "🇸🇾", name: "Syria" },
    "SY": { code: "SY", flag: "🇸🇾", name: "Syria" },
    "TAIWAN": { code: "TW", flag: "🇹🇼", name: "Taiwan" },
    "TW": { code: "TW", flag: "🇹🇼", name: "Taiwan" },
    "TAJIKISTAN": { code: "TJ", flag: "🇹🇯", name: "Tajikistan" },
    "TJ": { code: "TJ", flag: "🇹🇯", name: "Tajikistan" },
    "TANZANIA": { code: "TZ", flag: "🇹🇿", name: "Tanzania" },
    "TZ": { code: "TZ", flag: "🇹🇿", name: "Tanzania" },
    "THAILAND": { code: "TH", flag: "🇹🇭", name: "Thailand" },
    "TH": { code: "TH", flag: "🇹🇭", name: "Thailand" },
    "TUNISIA": { code: "TN", flag: "🇹🇳", name: "Tunisia" },
    "TN": { code: "TN", flag: "🇹🇳", name: "Tunisia" },
    "TURKEY": { code: "TR", flag: "🇹🇷", name: "Turkey" },
    "TR": { code: "TR", flag: "🇹🇷", name: "Turkey" },
    "UGANDA": { code: "UG", flag: "🇺🇬", name: "Uganda" },
    "UG": { code: "UG", flag: "🇺🇬", name: "Uganda" },
    "UKRAINE": { code: "UA", flag: "🇺🇦", name: "Ukraine" },
    "UA": { code: "UA", flag: "🇺🇦", name: "Ukraine" },
    "URUGUAY": { code: "UY", flag: "🇺🇾", name: "Uruguay" },
    "UY": { code: "UY", flag: "🇺🇾", name: "Uruguay" },
    "UZBEKISTAN": { code: "UZ", flag: "🇺🇿", name: "Uzbekistan" },
    "UZ": { code: "UZ", flag: "🇺🇿", name: "Uzbekistan" },
    "VENEZUELA": { code: "VE", flag: "🇻🇪", name: "Venezuela" },
    "VE": { code: "VE", flag: "🇻🇪", name: "Venezuela" },
    "YEMEN": { code: "YE", flag: "🇾🇪", name: "Yemen" },
    "YE": { code: "YE", flag: "🇾🇪", name: "Yemen" },
    "ZAMBIA": { code: "ZM", flag: "🇿🇲", name: "Zambia" },
    "ZM": { code: "ZM", flag: "🇿🇲", name: "Zambia" },
    "ZIMBABWE": { code: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
    "ZW": { code: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
};

 // 2. Loop chalao (Ye logic fix ki hai)
  for (const [key, data] of Object.entries(countryMap)) {
      // Logic: Agar location text mein exact Key (e.g. "US") mile as a whole word
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      
      if (regex.test(loc)) {
          // Match mil gaya! Ab hum 'US' nahi balkay 'United States' return karenge
          return { ...data, isRemote, displayName: data.name };
      }
  }

  // 3. Agar kuch match na ho to wahi wapis bhej do (Short code hi dikhega)
  return { name: locationString, flag: "🌍", isRemote, displayName: locationString };
};
export default function Home() {
  const router = useRouter();

  // SEO Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HireSkys",
    "alternateName": ["Hire Skys", "HireSkys Job Radar", "HireSkys Remote Jobs"], 
    "url": "https://www.hireskys.com",
    "description": "HireSkys elite job radar for developers and creatives. Find verified remote jobs and prove your skills.",
    "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://www.hireskys.com/logo1.png" 
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.hireskys.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
        "https://twitter.com/hireskys",
        "https://www.linkedin.com/company/hireskys",
        "https://www.facebook.com/hireskys"
    ],
    "publisher": {
        "@type": "Organization",
        "name": "HireSkys",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.hireskys.com/logo1.png"
        }
    },
    "inLanguage": "en-US"
  };

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
]
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0); 
  const [countrySearch, setCountrySearch] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'jobs' | 'talent'>('jobs');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubTag, setActiveSubTag] = useState('');
  const jobsSectionRef = useRef<HTMLDivElement>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [filterJobType, setFilterJobType] = useState(''); 
  const [filterDate, setFilterDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const categoryEntries = Object.entries(CATEGORIES);
  const visibleCategories = showAll ? categoryEntries : categoryEntries.slice(0, 5); 
  const subTagsRef = useRef<HTMLDivElement>(null);
  const [filterCountry, setFilterCountry] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
   const hyrizonUrl = searchQuery.trim() 
    ? `/hyrizon?q=${encodeURIComponent(searchQuery)}` 
    : '/hyrizon';
  // 🏢 COMPANY LOGOS STATE
  const [companyLogos, setCompanyLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCompanies = async () => {
        const { data } = await supabase
            .from('companies') 
            .select('name, logo_url');
        
        if (data) {
            const logoMap: Record<string, string> = {};
            data.forEach((company: any) => {
                if (company.name) {
                    logoMap[company.name] = company.logo_url;
                }
            });
            setCompanyLogos(logoMap);
        }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setShowJobTypeDropdown(false);
        setShowDateDropdown(false);
        setShowCountryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);
  useEffect(() => {
    // 🧠 Profile Fetcher: Agar data na mile to 3 baar try karega
    const fetchProfile = async (userId: string, retryCount = 0) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (data) {
                setUserProfile(data);
            } else if (retryCount < 3) {
                // ⏳ Agar DB slow hai, to 1 sec baad dobara try karo (Magic Fix)
                console.log(`Profile syncing... Attempt ${retryCount + 1}`);
                setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
            }
        } catch (error) {
            console.error("Profile error:", error);
        }
    };

    // 🚀 Session Setup & Listener
    const setupAuth = async () => {
        // A. Page Load Check
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setCurrentUser(session.user);
            fetchProfile(session.user.id);
        } else {
            // Popup logic for new users
            setTimeout(() => {
                if (!sessionStorage.getItem('popup_seen')) {
                    setShowPopup(true);
                    sessionStorage.setItem('popup_seen', 'true');
                }
            }, 5000);
        }

        // B. Real-time Listener (Login/Logout detect karega)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setCurrentUser(session.user);
                // 🔥 Login hote hi profile dhoondo
                fetchProfile(session.user.id); 
            } else {
                // Logout hote hi sab safaya
                setCurrentUser(null);
                setUserProfile(null);
                setSavedJobIds([]); 
            }
            router.refresh(); // UI ko taaza karo
        });

        return subscription;
    };

    let authSub: any;
    setupAuth().then(sub => authSub = sub);

    return () => {
        if (authSub) authSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-jobs-count')
      
      // 1. Agar nayi job aayi (INSERT) -> Count +1
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'jobs' },
        (payload) => {
          const newJob = payload.new;
          const oldJob = payload.old; // Ab purana data bhi milega

          // ✅ PERFECT LOGIC:
          // Sirf tab count kam karo jab job PEHLE Active thi aur AB Inactive hui hai.
          if (oldJob.active === true && newJob.active === false) {
            setTotalCount((prevCount) => Math.max(0, prevCount - 1)); 
            
            // Job list se bhi hata do (Smooth animation ke liye)
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== newJob.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
    
  useEffect(() => {
    if (currentUser) {
        fetchSavedJobs();
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeSubTag && jobsSectionRef.current) {
        setTimeout(() => {
            jobsSectionRef.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
  }, [activeSubTag]);

  useEffect(() => {
    if (activeCategory !== 'All' && subTagsRef.current) {
      setTimeout(() => {
          subTagsRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
          });
      }, 300);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (searchType === 'jobs') {
        const timer = setTimeout(() => {
          setPage(0);         
          fetchJobs(0, true); 
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [searchQuery, activeCategory, activeSubTag, searchType, filterJobType, filterDate, filterCountry]);

  useEffect(() => {
    const ensureProfileComplete = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('skills')
          .eq('id', user.id)
          .single();

        if (!profile?.skills || profile.skills.length === 0) {
          router.push('/complete-profile');
        }
      }
    };
    ensureProfileComplete();
  }, []);

  const handleManualSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchType === 'talent') {
          router.push(`/talent?search=${encodeURIComponent(searchQuery)}`);
      } else {
          fetchJobs();
      }
  }
// 👇 Ye naya function add karo
  const handleAISearch = () => {
    // Agar user ne kuch likha hai, to wo query saath le jao
    if (searchQuery.trim()) {
        router.push(`/hyrizon?q=${encodeURIComponent(searchQuery)}`);
    } else {
        router.push('/hyrizon'); // Khali page kholo
    }
  };
  async function fetchSavedJobs() {
      if (!currentUser) return;
      const { data } = await supabase.from('saved_jobs').select('job_id').eq('user_id', currentUser.id);
      if (data) setSavedJobIds(data.map(item => item.job_id));
  }

  async function toggleSave(jobId: number) {
      if (!currentUser) {
          setShowPopup(true);
          return;
      }
      const isAlreadySaved = savedJobIds.includes(jobId);
      if (isAlreadySaved) {
          setSavedJobIds(prev => prev.filter(id => id !== jobId));
          await supabase.from('saved_jobs').delete().match({ user_id: currentUser.id, job_id: jobId });
      } else {
          setSavedJobIds(prev => [...prev, jobId]);
          await supabase.from('saved_jobs').insert({ user_id: currentUser.id, job_id: jobId });
      }
  }

  async function fetchJobs(pageNumber = 0, reset = false) {
    if (reset) {
        setLoading(true);
        setHasMore(true);
    } else {
        setLoadingMore(true);
    }

    const from = pageNumber * JOBS_PER_PAGE;
    const to = from + JOBS_PER_PAGE - 1;
    let query;

    if (searchQuery && searchQuery.length > 2) {
       query = supabase
         .rpc('search_jobs_fuzzy', { search_text: searchQuery });
    } else {
       query = supabase
         .from('jobs')
         .select('*', { count: 'exact' })
         .order('date_posted', { ascending: false }); 
    }
    
    if (filterJobType) {
        query = query.eq('job_type', filterJobType);
    }

    if (filterDate) {
        const now = new Date();
        if (filterDate === '24h') {
            now.setDate(now.getDate() - 1);
        } else if (filterDate === '7d') {
            now.setDate(now.getDate() - 7);
        } else if (filterDate === '30d') {
            now.setDate(now.getDate() - 30);
        }
        query = query.gte('date_posted', now.toISOString());
    }

    if (filterCountry) {
        // ✅ Correctly querying 'location' field
        query = query.ilike('location', `%${filterCountry}%`); 
    }

    query = query.eq('approved', true).eq('active', true).range(from, to);

    if (activeCategory !== 'All') {
      query = query.ilike('category', `%${activeCategory}%`);
    }

    if (activeSubTag) {
        query = query.or(`tags.cs.{${activeSubTag}},title.ilike.%${activeSubTag}%`);
    }

    let { data, error, count } = await query;
    if (error) {
      console.error("Error fetching jobs:", JSON.stringify(error, null, 2));
      setLoading(false);
      setLoadingMore(false);
      return;
    }
    if (count !== null && reset) {
        setTotalCount(count); 
    } else if (searchQuery && count === null && reset) {
         setTotalCount(data ? data.length : 0);
    }

    if ((!data || data.length === 0) && searchQuery && reset) {
        setIsFallback(true); 
        const { data: fallbackData } = await supabase
            .from('jobs')
            .select('*')
            .eq('approved', true)
            .order('date_posted', { ascending: false })
            .range(0, JOBS_PER_PAGE - 1);
            
        data = fallbackData || []; 
    } else {
        if (reset) setIsFallback(false);
    }
    if (data) {
        if (reset) {
            setJobs(data);
        } else {
            setJobs(prev => {
                const existingIds = new Set(prev.map(job => job.id));
                const uniqueNewJobs = data.filter((job: any) => !existingIds.has(job.id));
                return [...prev, ...uniqueNewJobs];
            });
        }
        if (data.length < JOBS_PER_PAGE) {
            setHasMore(false);
        }
    }
    setLoading(false);
    setLoadingMore(false);
  }

  const handleLoadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJobs(nextPage, false);
  };

  return (
    
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0B0F19] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
      <Navbar />

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white dark:bg-[#151b2d] rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={() => setShowPopup(false)} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                    <X size={20} className="text-slate-500" />
                </button>

                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-2">
                        <Rocket size={40} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                            Join the Elite.
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Create your free profile to unlock exclusive features.
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl text-left space-y-3 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                            <span className="font-medium">Get Verified <span className="text-green-500">Green Badge</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                            <span className="font-medium">Save Jobs & Apply Later</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                            <span className="font-medium">Get Instant Job Alert Related to your skill on Whatsapp and Email</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link href="/login?view=signup" className="block w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-1">
                            Create Free Account
                        </Link>
                        <button onClick={() => setShowPopup(false)} className="block w-full py-3 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold transition">
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {currentUser ? (
        // LOGGED IN DASHBOARD HEADER
        <header className="relative pt-24 pb-12 px-4 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 overflow-visible">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div className="space-y-2 w-full md:w-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={14} /> User Dashboard
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{userProfile?.full_name || 'Creator'}!</span> 👋
                        </h1>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto justify-start md:justify-end">
                        <Link href="/profile?tab=saved" className="group relative p-3 bg-white dark:bg-[#151b2d] rounded-xl border border-slate-200 dark:border-slate-800 min-w-[90px] text-center cursor-pointer transition-all hover:bg-indigo-600 hover:border-indigo-600 active:scale-95">
                            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 group-hover:text-white leading-none mb-1">
                                {savedJobIds.length}
                            </div>
                            <div className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-indigo-100 tracking-wide">
                                Saved
                            </div>
                        </Link>

                        <Link href="/profile?tab=details" className="group relative p-3 bg-white dark:bg-[#151b2d] rounded-xl border border-slate-200 dark:border-slate-800 min-w-[90px] text-center cursor-pointer transition-all hover:bg-emerald-600 hover:border-emerald-600 active:scale-95">
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 group-hover:text-white leading-none mb-1">
                                {userProfile?.skills?.length || 0}
                            </div>
                            <div className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-emerald-100 tracking-wide">
                                Skills
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto w-full mt-10 space-y-8 relative z-40">
                    {/* --- SEARCH BAR WITH HYRIZON AI --- */}
              <form onSubmit={handleManualSearch} className="relative group flex items-center bg-white dark:bg-[#151b2d] p-1.5 md:p-2 rounded-full shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 transition-all transform md:hover:scale-[1.01]">
                  
                  {/* Left Icon (Briefcase/Users) */}
                  <div className="pl-3 pr-2 border-r border-slate-200 dark:border-slate-700 text-slate-400 flex items-center gap-2">
                      {searchType === 'jobs' ? <Briefcase size={18} /> : <Users size={18} />}
                      <span className="text-sm font-medium hidden sm:block capitalize">{searchType}</span>
                  </div>

                  {/* Input Field */}
                  <input 
                      type="text" 
                      placeholder={searchType === 'jobs' ? "Search roles (e.g. React Developer)..." : "Search talent..."} 
                      className="flex-1 h-10 md:h-12 pl-3 pr-2 bg-transparent outline-none text-base md:text-lg text-slate-800 dark:text-white placeholder:text-slate-400 min-w-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {/* --- 🔥 NEW: HYRIZON AI BUTTON (Google Style) --- */}
                  {/* --- ✨ HYRIZON AI BUTTON (With Blue Loading Bar Fix) ✨ --- */}
<div className="hidden sm:flex items-center pl-2 pr-2 relative z-20">
    <Link
        href={hyrizonUrl} // 👈 Ab ye router.push ki jagah Link use kar raha hai
        className="group relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
        title="Ask Hyrizon AI"
    >
        {/* 🔥 SPINNING ANIMATION (Same as before) */}
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7c3aed_0%,#d946ef_50%,#06b6d4_100%)]" />

        {/* 🌑 INNER CONTENT */}
        <div className="relative flex items-center gap-2 px-3 py-2 rounded-[10px] z-10 bg-white dark:bg-[#151b2d] transition-colors group-hover:bg-violet-50 dark:group-hover:bg-[#1e2538]">
            
            <div className="relative">
                <Sparkles 
                    size={16} 
                    className="text-violet-600 dark:text-violet-300 relative z-10" 
                />
                 <div className="absolute inset-0 bg-violet-400/30 dark:bg-violet-400/20 rounded-full blur-md animate-pulse z-0"></div>
            </div>
            
            <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400 mb-0.5">
                    HYRIZON
                </span>
                <span className="text-xs font-black tracking-wide text-slate-800 dark:text-white">
                    Ask AI
                </span>
            </div>
        </div>
    </Link>
</div>
                  {/* Mobile Only AI Button (Small Icon) */}
                  <button 
                    type="button"
                    onClick={handleAISearch}
                    className="sm:hidden mr-2 p-2 text-violet-500 bg-violet-50 dark:bg-violet-900/20 rounded-full"
                  >
                    <Sparkles size={18} />
                  </button>

                  {/* Main Search Button */}
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 md:px-8 md:py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 flex-shrink-0">
                      <Search size={18} className="md:w-5 md:h-5" />
                      <span className="hidden md:inline">Search</span>
                  </button>
              </form>

                    <div ref={dropdownRef} className="mt-6 md:mt-8 relative z-50">
                        <div className="grid grid-cols-2 md:flex md:justify-center md:items-center gap-3">
                            <div className="relative w-full md:w-auto md:min-w-[200px]">
                                <button 
                                    onClick={() => { setShowJobTypeDropdown(!showJobTypeDropdown); setShowDateDropdown(false); setShowCountryDropdown(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold shadow-sm transition-all ${
                                        showJobTypeDropdown 
                                        ? 'bg-white dark:bg-[#151b2d] border-indigo-500 ring-2 ring-indigo-500/20' 
                                        : 'bg-white dark:bg-[#151b2d] border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <Briefcase size={16} className="text-indigo-500 flex-shrink-0" />
                                        <span className="truncate">{filterJobType || "Job Type"}</span>
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${showJobTypeDropdown ? 'rotate-180 text-indigo-500' : ''}`} strokeWidth={3} />
                                </button>

                                <AnimatePresence>
                                    {showJobTypeDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1 min-w-[200px]"
                                        >
                                            {["Full-time", "Contract", "Part-time", "Internship", "Freelance"].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => { setFilterJobType(type); setShowJobTypeDropdown(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors flex items-center justify-between"
                                                >
                                                    {type}
                                                    {filterJobType === type && <Check size={14} className="text-indigo-500" />}
                                                </button>
                                            ))}
                                            {filterJobType && (
                                                 <button
                                                 onClick={() => { setFilterJobType(""); setShowJobTypeDropdown(false); }}
                                                 className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-700 mt-1"
                                             >
                                                 Clear Filter
                                             </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                           <div className="relative w-full md:w-auto md:min-w-[200px]">
                                <button 
                                    onClick={() => { setShowDateDropdown(!showDateDropdown); setShowJobTypeDropdown(false); setShowCountryDropdown(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold shadow-sm transition-all ${
                                        showDateDropdown 
                                        ? 'bg-white dark:bg-[#151b2d] border-pink-500 ring-2 ring-pink-500/20' 
                                        : 'bg-white dark:bg-[#151b2d] border-slate-200 dark:border-slate-700 hover:border-pink-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <Clock size={16} className="text-pink-500 flex-shrink-0" />
                                        <span className="truncate">{filterDate === "24h" ? "Last 24 Hours" : filterDate === "7d" ? "Last 7 Days" : filterDate === "30d" ? "Last Month" : "Date Posted"}</span>
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${showDateDropdown ? 'rotate-180 text-pink-500' : ''}`} strokeWidth={3} />
                                </button>

                                <AnimatePresence>
                                    {showDateDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1 min-w-[200px]"
                                        >
                                            {[
                                                { val: "24h", label: "Last 24 Hours" },
                                                { val: "7d", label: "Last 7 Days" },
                                                { val: "30d", label: "Last Month" }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.val}
                                                    onClick={() => { setFilterDate(opt.val); fetchJobs(); setShowDateDropdown(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors flex items-center justify-between"
                                                >
                                                    {opt.label}
                                                    {filterDate === opt.val && <Check size={14} className="text-pink-500" />}
                                                </button>
                                            ))}
                                             {filterDate && (
                                                 <button
                                                 onClick={() => { setFilterDate(""); fetchJobs(); setShowDateDropdown(false); }}
                                                 className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-700 mt-1"
                                             >
                                                 Clear Filter
                                             </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative w-full col-span-2 md:col-auto md:w-auto md:min-w-[220px]">
                                <button 
                                    onClick={() => { setShowCountryDropdown(!showCountryDropdown); setShowJobTypeDropdown(false); setShowDateDropdown(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold shadow-sm transition-all ${
                                        showCountryDropdown 
                                        ? 'bg-white dark:bg-[#151b2d] border-emerald-500 ring-2 ring-emerald-500/20' 
                                        : 'bg-white dark:bg-[#151b2d] border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 max-w-[85%]">
                                        <MapPin size={16} className="text-emerald-500 flex-shrink-0" />
                                        <span className="truncate block">
                                            {filterCountry ? filterCountry : "Location / Country"}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${showCountryDropdown ? 'rotate-180 text-emerald-500' : ''}`} strokeWidth={3} />
                                </button>

                                <AnimatePresence>
                                    {showCountryDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden min-w-[220px]"
                                        >
                                            <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
                                                <div className="relative">
                                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search country..." 
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()} 
                                                        autoFocus
                                                        className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#151b2d] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                                                    />
                                                </div>
                                            </div>

                                            <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1">
                                                {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).length > 0 ? (
                                                    COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
                                                        <button
                                                            key={country.name}
                                                            onClick={() => { setFilterCountry(country.name); setShowCountryDropdown(false); setCountrySearch(""); }}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors flex items-center gap-2"
                                                        >
                                                            <span className="text-lg flex-shrink-0">{country.flag}</span>
                                                            <span className="truncate">{country.name}</span>
                                                            {filterCountry === country.name && <Check size={14} className="text-emerald-500 ml-auto" />}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-xs text-slate-400">
                                                        No country found
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {filterCountry && (
                                                 <button
                                                 onClick={() => { setFilterCountry(""); setShowCountryDropdown(false); setCountrySearch(""); }}
                                                 className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-700 mt-1"
                                             >
                                                 Clear Location
                                             </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col items-center pt-2 relative z-10">
                        <div className="flex flex-wrap justify-center gap-3">
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                onClick={() => { setActiveCategory('All'); setActiveSubTag(''); }} 
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition-colors border shadow-sm ${activeCategory === 'All' ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/25' : 'bg-white dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                            >
                                <Filter size={18} /> All
                            </motion.button>
                            {visibleCategories.map(([name, data], index) => {
                                const Icon = data.icon;
                                const isActive = activeCategory === name;
                                return (
                                    <motion.button 
                                        key={name} 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: index * 0.05 }} 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }} 
                                        onClick={() => { setActiveCategory(name); setActiveSubTag(''); }} 
                                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-base font-medium transition-colors border whitespace-nowrap shadow-sm ${isActive ? 'bg-indigo-600 text-white border-transparent shadow-indigo-500/30' : 'bg-white dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600'}`}
                                    >
                                        <Icon size={18} /> {name}
                                    </motion.button>
                                )
                            })}
                        </div>
                         
                         {categoryEntries.length > 5 && (
                            <button onClick={() => setShowAll(!showAll)} className="mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline transition-all">
                                {showAll ? (<>Show Less <ChevronUp size={16}/></>) : (<>View All Categories <ChevronDown size={16}/></>)}
                            </button>
                        )}
                         
                         {activeCategory !== 'All' && (
                            <motion.div ref={subTagsRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-2 mt-6 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 w-full relative z-10">
                                {(CATEGORIES as any)[activeCategory].sub.map((tag: any) => (
                                    <motion.button key={tag} whileHover={{ scale: 1.05 }} onClick={() => setActiveSubTag(activeSubTag === tag ? '' : tag)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeSubTag === tag ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                                        {tag}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
      ) : (
        // LOGGED OUT HERO HEADER
        <header className="relative pt-24 pb-8 md:pt-28 md:pb-12 px-4 text-center bg-white dark:bg-[#0B0F19] overflow-visible"> 
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[1000px] h-[300px] md:h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 relative z-10">
            {/* --- NEW HERO SECTION --- */}
            <div className="space-y-8 mb-14 relative z-10">
                
                {/* 1. BADGES ROW */}
                <div className="flex flex-wrap justify-center gap-3">
                  <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30"
                  >
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-400"></span>
                      </span>
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
                          100% Remote & Freelance Only
                      </span>
                  </motion.div>

                  <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30"
                  >
                      <Zap size={14} className="text-amber-600 dark:text-amber-400 fill-current" />
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                          1,240+ Fresh Gigs Added
                      </span>
                  </motion.div>
                </div>

                {/* 2. MAIN HEADING */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]"
                >
                    Find High-Paying <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                        Remote & Freelance Work
                    </span>
                </motion.h1>

                {/* 3. DESCRIPTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-4xl mx-auto flex flex-col gap-5"
                >
                    <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">HireSkys</span> is the elite job radar for <span className="text-slate-900 dark:text-white font-black decoration-indigo-500/30 underline decoration-4 underline-offset-4">Developers, Designers, & Marketers</span>.
                  </p>
                    
                    <div className="text-lg md:text-xl text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-2">
                        <span>Skip the office politics. Get verified</span>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold text-base shadow-sm transform hover:scale-105 transition-transform cursor-default">
                            Work from Home
                        </span>
                        <span>jobs instantly.</span>
                    </div>
                </motion.div>

            </div>

            {/* --- SEARCH BAR SECTION --- */}
            <div className="max-w-5xl mx-auto w-full px-4 relative z-30">
              
              {/* Toggles */}
              <div className="flex justify-center mb-6 gap-2">
                  <button 
                      onClick={() => setSearchType('jobs')}
                      className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                          searchType === 'jobs' 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105' 
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                      Find Jobs
                  </button>
                  <button 
                      onClick={() => setSearchType('talent')}
                      className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                          searchType === 'talent' 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105' 
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                      Find Talent
                  </button>
              </div>

              {/* Input */}
              {/* --- SEARCH BAR WITH HYRIZON AI --- */}
              <form onSubmit={handleManualSearch} className="relative group flex items-center bg-white dark:bg-[#151b2d] p-1.5 md:p-2 rounded-full shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 transition-all transform md:hover:scale-[1.01]">
                  
                  {/* Left Icon (Briefcase/Users) */}
                  <div className="pl-3 pr-2 border-r border-slate-200 dark:border-slate-700 text-slate-400 flex items-center gap-2">
                      {searchType === 'jobs' ? <Briefcase size={18} /> : <Users size={18} />}
                      <span className="text-sm font-medium hidden sm:block capitalize">{searchType}</span>
                  </div>

                  {/* Input Field */}
                  <input 
                      type="text" 
                      placeholder={searchType === 'jobs' ? "Search roles (e.g. React Developer)..." : "Search talent..."} 
                      className="flex-1 h-10 md:h-12 pl-3 pr-2 bg-transparent outline-none text-base md:text-lg text-slate-800 dark:text-white placeholder:text-slate-400 min-w-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {/* --- 🔥 HYRIZON: HYRIZON AI BUTTON (Google Style) --- */}
                  <div className="hidden sm:flex items-center pl-2 pr-2 relative z-20">
    <button
        type="button"
        onClick={handleAISearch}
        // Button Outer Container (Responsible for the glowing border shape)
        className="group relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
        title="Ask Hyrizon AI"
    >
        {/* 🔥 THE SPINNING GRADIENT ANIMATION (The Magic) 🔥 */}
        {/* Ye element button ke peeche bohot tez ghoom rha hai */}
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7c3aed_0%,#d946ef_50%,#06b6d4_100%)]" />

        {/* 🌑 THE SOLID INNER BUTTON (Covers the center of the spin) */}
        <div className="relative flex items-center gap-2 px-3 py-2 rounded-[10px] z-10 bg-white dark:bg-[#151b2d] transition-colors group-hover:bg-violet-50 dark:group-hover:bg-[#1e2538]">
            
            {/* Icon Container with subtle pulse */}
            <div className="relative">
                <Sparkles 
                    size={16} 
                    className="text-violet-600 dark:text-violet-300 relative z-10" 
                />
                 <div className="absolute inset-0 bg-violet-400/30 dark:bg-violet-400/20 rounded-full blur-md animate-pulse z-0"></div>
            </div>
            
            <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400 mb-0.5">
                    HYRIZON
                </span>
                <span className="text-xs font-black tracking-wide text-slate-800 dark:text-white">
                    Ask AI
                </span>
            </div>
        </div>
    </button>
</div>

                  {/* Mobile Only AI Button (Small Icon) */}
                  <button 
                    type="button"
                    onClick={handleAISearch}
                    className="sm:hidden mr-2 p-2 text-violet-500 bg-violet-50 dark:bg-violet-900/20 rounded-full"
                  >
                    <Sparkles size={18} />
                  </button>

                  {/* Main Search Button */}
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 md:px-8 md:py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 flex-shrink-0">
                      <Search size={18} className="md:w-5 md:h-5" />
                      <span className="hidden md:inline">Search</span>
                  </button>
              </form>

              {/* --- SUPER SMOOTH CUSTOM FILTERS --- */}
              <motion.div 
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 md:mt-8 max-w-4xl mx-auto relative z-50"
              >
                  <div className="grid grid-cols-2 md:flex md:justify-center md:items-center gap-3">
                      
                      {/* CUSTOM FILTER 1: Job Type */}
                      <div className="relative w-full md:w-auto md:min-w-[200px]">
                          {/* Trigger Button */}
                          <button 
                              onClick={() => { setShowJobTypeDropdown(!showJobTypeDropdown); setShowDateDropdown(false); setShowCountryDropdown(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold shadow-sm transition-all ${
                                  showJobTypeDropdown 
                                  ? 'bg-white dark:bg-[#151b2d] border-indigo-500 ring-2 ring-indigo-500/20' 
                                  : 'bg-white dark:bg-[#151b2d] border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                              }`}
                          >
                              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <Briefcase size={16} className="text-indigo-500 flex-shrink-0" />
                                  <span className="truncate">{filterJobType || "Job Type"}</span>
                              </div>
                              <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${showJobTypeDropdown ? 'rotate-180 text-indigo-500' : ''}`} strokeWidth={3} />
                          </button>

                          {/* Animated Dropdown Menu */}
                          <AnimatePresence>
                              {showJobTypeDropdown && (
                                  <motion.div
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1"
                                  >
                                      {["Full-time", "Contract", "Part-time", "Internship", "Freelance"].map((type) => (
                                          <button
                                              key={type}
                                              onClick={() => { setFilterJobType(type); setShowJobTypeDropdown(false); }}
                                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors flex items-center justify-between group"
                                          >
                                              {type}
                                              {filterJobType === type && <Check size={14} className="text-indigo-500" />}
                                          </button>
                                      ))}
                                      {filterJobType && (
                                           <button
                                           onClick={() => { setFilterJobType(""); setShowJobTypeDropdown(false); }}
                                           className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-700 mt-1"
                                       >
                                           Clear Filter
                                       </button>
                                      )}
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>

                     {/* CUSTOM FILTER 2: Date Posted */}
                     <div className="relative w-full md:w-auto md:min-w-[200px]">
                          {/* Trigger Button */}
                          <button 
                              onClick={() => { setShowDateDropdown(!showDateDropdown); setShowJobTypeDropdown(false); setShowCountryDropdown(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold shadow-sm transition-all ${
                                  showDateDropdown 
                                  ? 'bg-white dark:bg-[#151b2d] border-pink-500 ring-2 ring-pink-500/20' 
                                  : 'bg-white dark:bg-[#151b2d] border-slate-200 dark:border-slate-700 hover:border-pink-300'
                              }`}
                          >
                              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <Clock size={16} className="text-pink-500 flex-shrink-0" />
                                  <span className="truncate">{filterDate === "24h" ? "Last 24 Hours" : filterDate === "7d" ? "Last 7 Days" : filterDate === "30d" ? "Last Month" : "Date Posted"}</span>
                              </div>
                              <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${showDateDropdown ? 'rotate-180 text-pink-500' : ''}`} strokeWidth={3} />
                          </button>

                          {/* Animated Dropdown Menu */}
                          <AnimatePresence>
                              {showDateDropdown && (
                                  <motion.div
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1"
                                  >
                                      {[
                                          { val: "24h", label: "Last 24 Hours" },
                                          { val: "7d", label: "Last 7 Days" },
                                          { val: "30d", label: "Last Month" }
                                      ].map((opt) => (
                                          <button
                                              key={opt.val}
                                              onClick={() => { setFilterDate(opt.val); fetchJobs(); setShowDateDropdown(false); }}
                                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors flex items-center justify-between"
                                          >
                                              {opt.label}
                                              {filterDate === opt.val && <Check size={14} className="text-pink-500" />}
                                          </button>
                                      ))}
                                       {filterDate && (
                                           <button
                                           onClick={() => { setFilterDate(""); fetchJobs(); setShowDateDropdown(false); }}
                                           className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-700 mt-1"
                                       >
                                           Clear Filter
                                       </button>
                                      )}
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>

                      {/* CUSTOM FILTER 3: Location / Country (MOVED HERE & UPDATED WITH SEARCH) */}
                      <div className="relative w-full col-span-2 md:col-auto md:w-auto md:min-w-[220px]">
                          {/* Trigger Button */}
                          <button 
                              onClick={() => { setShowCountryDropdown(!showCountryDropdown); setShowJobTypeDropdown(false); setShowDateDropdown(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold shadow-sm transition-all ${
                                  showCountryDropdown 
                                  ? 'bg-white dark:bg-[#151b2d] border-emerald-500 ring-2 ring-emerald-500/20' 
                                  : 'bg-white dark:bg-[#151b2d] border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                              }`}
                          >
                              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 max-w-[85%]">
                                  <MapPin size={16} className="text-emerald-500 flex-shrink-0" />
                                  <span className="truncate block">
                                      {filterCountry ? filterCountry : "Location / Country"}
                                  </span>
                              </div>
                              <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${showCountryDropdown ? 'rotate-180 text-emerald-500' : ''}`} strokeWidth={3} />
                          </button>

                          <AnimatePresence>
                              {showCountryDropdown && (
                                  <motion.div
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden min-w-[220px]"
                                  >
                                      {/* 🔍 SEARCH INPUT ADDED HERE */}
                                      <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
                                          <div className="relative">
                                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                              <input 
                                                  type="text" 
                                                  placeholder="Search country..." 
                                                  value={countrySearch}
                                                  onChange={(e) => setCountrySearch(e.target.value)}
                                                  onClick={(e) => e.stopPropagation()} 
                                                  autoFocus
                                                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#151b2d] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                                              />
                                          </div>
                                      </div>

                                      {/* Scrollable Area */}
                                      <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1">
                                          {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).length > 0 ? (
                                              COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
                                                  <button
                                                      key={country.name}
                                                      onClick={() => { setFilterCountry(country.name); setShowCountryDropdown(false); setCountrySearch(""); }}
                                                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors flex items-center gap-2"
                                                  >
                                                      <span className="text-lg flex-shrink-0">{country.flag}</span>
                                                      <span className="truncate">{country.name}</span>
                                                      {filterCountry === country.name && <Check size={14} className="text-emerald-500 ml-auto" />}
                                                  </button>
                                              ))
                                          ) : (
                                              <div className="p-4 text-center text-xs text-slate-400">
                                                  No country found
                                              </div>
                                          )}
                                      </div>
                                      
                                      {filterCountry && (
                                           <button
                                           onClick={() => { setFilterCountry(""); setShowCountryDropdown(false); setCountrySearch(""); }}
                                           className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-700 mt-1"
                                       >
                                           Clear Location
                                       </button>
                                      )}
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>

                  </div>
              </motion.div>
            </div>

            {/* CATEGORIES - LOGGED OUT SECTION */}
  <div className="flex flex-col items-center pt-8 px-2 max-w-5xl mx-auto relative z-10">
      <div className="flex flex-wrap justify-center gap-3">
      
          {/* "All" Button */}
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveCategory('All'); setActiveSubTag(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-colors border shadow-sm ${
                  activeCategory === 'All'
                  ? 'bg-white dark:bg-[#151b2d] text-indigo-600 border-indigo-200 dark:border-indigo-900 ring-2 ring-indigo-500/20'
                  : 'bg-white/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'
              }`}
          >
              <Filter size={18} /> All
          </motion.button>
          
          {/* Categories Map */}
          {visibleCategories.map(([name, data], index) => {
              const Icon = data.icon;
              const isActive = activeCategory === name;
              return (
                  <motion.button
                      key={name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setActiveCategory(name); setActiveSubTag(''); }}
                      className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm md:text-base font-medium transition-colors border whitespace-nowrap shadow-sm ${
                      isActive
                          ? 'bg-indigo-600 text-white border-transparent shadow-indigo-500/30 shadow-lg'
                          : 'bg-white/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-md'
                      }`}
                  >
                      <Icon size={18} /> {name}
                  </motion.button>
              )
          })}
      </div>

      {/* Show More / Show Less Button */}
      {categoryEntries.length > 5 && (
          <button 
              onClick={() => setShowAll(!showAll)}
              className="mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline transition-all"
          >
              {showAll ? (
                  <>Show Less <ChevronUp size={16}/></>
              ) : (
                  <>View All Categories  <ChevronDown size={16}/></>
              )}
          </button>
      )}
  </div>

            {/* Subtags */}
                      {activeCategory !== 'All' && (
                          <motion.div 
                          ref={subTagsRef}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-wrap justify-center gap-2 mt-6 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 relative z-10"
                          >
                              {(CATEGORIES as any)[activeCategory].sub.map((tag: any) => (
                                  <motion.button 
                                      key={tag} 
                                      whileHover={{ scale: 1.05 }}
                                      onClick={() => setActiveSubTag(activeSubTag === tag ? '' : tag)} 
                                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeSubTag === tag ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                                  >
                                      {tag}
                                  </motion.button>
                              ))}
                          </motion.div>
                      )}
          </div>
        </header>

      )}
      
      {/* WHY JOIN SECTION (Animated & Interactive) */}
      {!currentUser && (
        <div className="bg-white dark:bg-[#111625] border-y border-slate-200 dark:border-slate-800 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Why create an account?
                    </h2>
                    <p className="text-slate-500 mt-3 text-lg">Join elite freelancers getting hired faster.</p>
                </div>

                {/* Animated Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* Card 1: Verified Badge */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Award size={28} className="fill-current" />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Get Verified Badge</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Pass skill tests to earn the coveted <span className="text-green-600 font-bold">Green Badge</span>.
                        </p>
                    </motion.div>

                    {/* Card 2: Public Profile */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <IdCard size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Public Profile</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Create a professional portfolio page to share directly with clients.
                        </p>
                    </motion.div>

                    {/* Card 3: Instant Alerts */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Bell size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Instant Alerts</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Get notified via Email/WhatsApp the second a job drops.
                        </p>
                    </motion.div>

                    {/* Card 4: Save Jobs */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Bookmark size={28} className="fill-current" />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Save Jobs</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Bookmark interesting roles and apply when you are ready.
                        </p>
                    </motion.div>

                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <Link href="/login?view=signup" className="inline-flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-full shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-1">
                        Create Free Account <ArrowRight size={20}/>
                    </Link>
                </div>
            </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main ref={jobsSectionRef} className="container mx-auto px-4 pt-12 md:pt-16 pb-8 max-w-5xl">
        {isFallback && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                    <Zap size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-amber-900">No exact matches found</h3>
                    <p className="text-amber-800 text-sm">
                        We couldn't find verified jobs for <strong>"{searchQuery}"</strong>. 
                        Showing you the latest opportunities instead.
                    </p>
                </div>
            </div>
        )}

        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
          <h2 className="flex-1 min-w-0 text-base md:text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
            <Briefcase size={20} className="text-indigo-500 flex-shrink-0" />
            <span className="truncate">
               {activeCategory === 'All' && !searchQuery ? (
                  <>
                    <span className="sm:hidden">Latest Opportunities</span>
                    <span className="hidden sm:inline">Latest Remote Opportunities</span>
                  </>
               ) : 'Search Results'}
            </span>
          </h2>

          <div className="flex-shrink-0 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 bg-white dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800 rounded-full shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-none">
                        {totalCount > 0 ? totalCount.toLocaleString() : jobs.length}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Active Jobs
                    </span>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />)
          ) : jobs.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-[#111625] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Search className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs found</h3>
              <p className="text-slate-500">Try adjusting your search filters.</p>
            </div>
          ) : (
            jobs.map((job) => {
                const detectedLocation = extractCountry(job.location || job.country || "");
  
  // Ye line add karo check karne ke liye:
  console.log("Input:", job.location, "Detected:", detectedLocation); 
  const jobDate = new Date(job.date_posted);
  const now = new Date();
  const diffHrs = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 96);
  const isJustNow = diffHrs <= 4;
  const isSaved = savedJobIds.includes(job.id);
  const companyLogoUrl = companyLogos[job.source] || null; 

  // 2️⃣ RETURN CARD
  return (
    <div key={job.id} className="group relative flex flex-col bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      
      {/* 🟢 TOP ROW: Location & Time */}
      {/* Mobile: Tight padding | Desktop: Spacious */}
      <div className="flex justify-between items-center mb-3 md:mb-5">
        
        <div className="flex items-center gap-2 md:gap-4">
           {/* 🏳️ LOCATION PILL */}
<div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200">
    
    {/* 👇 LOGIC CHANGE: Agar country code hai to Image, warna Globe Emoji */}
    {detectedLocation.code ? (
        <img 
            src={`https://flagcdn.com/w40/${detectedLocation.code.toLowerCase()}.png`}
            alt={detectedLocation.name}
            className="w-5 h-auto object-cover rounded-sm"
        />
    ) : (
        <span className="text-base md:text-lg leading-none">🌍</span>
    )}
    
    {/* Country Name */}
    <span className="tracking-wide max-w-[140px] md:max-w-none truncate">
        {detectedLocation.displayName === "Worldwide" || detectedLocation.displayName.includes("Global") 
            ? "Global" 
            : detectedLocation.displayName}
    </span>
</div>

            {/* ⏰ TIME (Desktop Only) - Mobile par hide kar diya taake bheed na ho */}
            <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
                <Clock size={16} />
                <span>
                    {diffHrs < 1 ? 'Posted Just now' : diffHrs < 24 ? `Posted ${diffHrs}h ago` : `Posted ${diffDays}d ago`}
                </span>
            </div>
        </div>

        {/* New Badge */}
        {isJustNow && (
            <span className="animate-pulse px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black uppercase bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md tracking-wider">
                New Arrival
            </span> 
        )}
      </div>

      {/* 🟠 MIDDLE ROW: Logo & Title */}
      <div className="flex items-start gap-3 md:gap-5 mb-4 md:mb-6">
        
        {/* 🏢 LOGO: Mobile (Small) vs Desktop (Big) */}
        <div className="flex-shrink-0">
            {companyLogoUrl ? (
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white p-1 md:p-1.5 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center">
                    <img 
                        src={companyLogoUrl} 
                        alt={job.source} 
                        className="h-full w-full object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
            ) : (
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center border border-indigo-100 dark:border-slate-700">
                    {(() => {
                        const categoryData = CATEGORIES[job.category as keyof typeof CATEGORIES];
                        const IconComponent = categoryData ? categoryData.icon : Briefcase;
                        return <IconComponent size={24} className="text-indigo-600 dark:text-indigo-400 md:w-8 md:h-8" />;
                    })()}
                </div>
            )}
        </div>

        {/* 📝 TITLE SECTION */}
        <div className="flex-1 min-w-0">
            {/* Title: Mobile (text-lg) vs Desktop (text-2xl) */}
            <h3 className="text-base md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-1 md:mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {job.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="text-slate-800 dark:text-slate-200 font-bold">{job.source}</span>
                
                {job.is_verified && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] md:text-xs font-bold border border-blue-100 dark:border-blue-800">
                        <ShieldCheck size={10} className="fill-blue-500/10" /> Verified
                    </span>
                )}
                
                {/* ⏰ TIME (Mobile Only) - Yahan wapis add kar diya taake mobile user dekh sake */}
                <span className="md:hidden flex items-center gap-1 text-slate-400">
                     • {diffHrs < 1 ? 'Just now' : `${diffHrs}h ago`}
                </span>
            </div>
        </div>
      </div>

      {/* 🔵 BOTTOM ROW: Tags & Actions */}
      <div className="mt-auto pt-3 md:pt-5 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-5">
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
            <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {job.category}
            </div>
            
            {job.job_type && (
                <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                    {job.job_type}
                </div>
            )}

            {job.tags && job.tags.length > 0 && (
                <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30">
                    {job.tags[0]}
                </div>
            )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    toggleSave(job.id);
                }}
                className={`p-2 md:p-3 rounded-xl border transition-all ${
                    isSaved 
                    ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900' 
                    : 'bg-transparent border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 dark:border-slate-700 dark:hover:border-red-800'
                }`}
            >
                <Heart size={18} className={isSaved ? "fill-current" : ""} />
            </button>

                        <Link href={`/jobs/${createSlug(job.title, job.id)}`} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-slate-200 transition-all shadow-lg shadow-indigo-500/10 text-center">
                            View Details
                        </Link>
                    </div>
                  </div>

                </div>
              );
            })
          )}
          
          {hasMore && !loading && jobs.length > 0 && (
            <div className="pt-8 pb-0 flex justify-center">
                <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loadingMore ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <span>Load More Jobs</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
          )}
          
          <CategorySection />
        </div>
      </main>
    </div>
  );
}
