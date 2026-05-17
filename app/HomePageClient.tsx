"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { createSlug } from '@/lib/utils';
import CategorySection from "@/components/CategorySection";
import { typesenseSearchClient } from '@/lib/typesenseClient';
import { CATEGORIES } from '@/lib/categories'; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Globe, Briefcase, ShieldCheck, 
  Video, Code, PenTool, Layout, Layers, ArrowRight, Clock,
  User as UserIcon, Smartphone, Cpu, Edit3, X, Zap, Facebook, Linkedin,
  Heart, ChevronDown, Filter, Users, Award, Bell, Bookmark, Rocket, CheckCircle, IdCard, Loader2, Sparkles, TrendingUp, ChevronUp, Check, MapPin, Eye, MessageCircle, Send, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

  
  // Baqi states wese hi rahengi...
const JOBS_PER_PAGE = 50;

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
  company_logo_url?: string;
};


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
// 🟢 1. STRING PARSER (Remote( UK(london), Spain(Madrid) ) ko torey ga)
const parseComplexLocation = (locationString: string) => {
    if (!locationString) return [];
    
    let cleanStr = locationString.replace(/Remote\s*/i, '').trim();
    if (cleanStr.startsWith('(') && cleanStr.endsWith(')')) {
        cleanStr = cleanStr.slice(1, -1).trim();
    }

    const parsedLocations: any[] = [];
    const regex = /([a-zA-Z\s]+)(?:\(([^)]+)\))?/g;
    let match;

    while ((match = regex.exec(cleanStr)) !== null) {
        const countryName = match[1].trim().replace(/^,|,$/g, '').trim(); 
        if (!countryName || countryName.toLowerCase() === 'and') continue;

        const cities = match[2] ? match[2].split(',').map(c => c.trim()) : [];
        parsedLocations.push({ country: countryName, cities: cities });
    }

    return parsedLocations;
};

// 🟢 2. UI FORMATTER (Cards aur Title ke liye data ready karega)
const getSmartLocationUI = (locationString: string) => {
    if (!locationString) return { matched: [{ name: "Global", flag: "🌍", code: null }], isRemote: true, hasMore: false, totalCount: 1 };

    const parsedData = parseComplexLocation(locationString);
    if (parsedData.length === 0) {
        return { matched: [{ name: locationString, flag: "🌍", code: null }], isRemote: true, hasMore: false, totalCount: 1 };
    }
    
    const uiElements: any[] = [];
    
    parsedData.forEach(item => {
        const cKey = item.country.toUpperCase();
        const countryData = countryMap[cKey] || { code: null, flag: "🌍", name: item.country };
        
        // City hai toh city, warna country name
        const displayName = item.cities.length > 0 ? item.cities[0] : countryData.name;
        
        uiElements.push({
            flag: countryData.flag,
            code: countryData.code,
            name: displayName === "Worldwide" ? "Global" : displayName,
            isImage: !!countryData.code // Agar code hai toh image banegi
        });
    });

    return {
        matched: uiElements,
        isRemote: locationString.toLowerCase().includes('remote'),
        hasMore: uiElements.length > 1,
        totalCount: uiElements.length
    };
};
 
export default function Home({
    seoCategory,
    seoLocation
}: {
    seoCategory?: string;
    seoLocation?: string;
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const pathname = usePathname();        
  
const COUNTRIES = [
  { code: "", flag: "🌍", name: "Worldwide" },
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
  const [forceExact, setForceExact] = useState(false);
  const [suggestedTerm, setSuggestedTerm] = useState('');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<Job[] & { matchScore?: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0); 
  const [countrySearch, setCountrySearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState<'jobs' | 'talent'>('jobs');
  const [activeCategory, setActiveCategory] = useState(seoCategory || searchParams.get('category') || 'All');
  const [activeSubTag, setActiveSubTag] = useState(searchParams.get('tag') || '');
  const jobsSectionRef = useRef<HTMLDivElement>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [filterJobType, setFilterJobType] = useState(searchParams.get('type') || ''); 
  const [filterDate, setFilterDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const categoryEntries = Object.entries(CATEGORIES);
  const subTagsRef = useRef<HTMLDivElement>(null);
  const [filterCountry, setFilterCountry] = useState(seoLocation || searchParams.get('location') || '');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
   const hyrizonUrl = searchQuery.trim() 
    ? `/hyrizon?q=${encodeURIComponent(searchQuery)}` 
    : '/hyrizon';
  // 🏢 COMPANY LOGOS STATE
  const [companyLogos, setCompanyLogos] = useState<Record<string, string>>({});
// 🟢 NAYA: Seen aur Applied Jobs ke states
  const [seenJobs, setSeenJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
// 🧠 SMART UX: Categories ka state yaad rakhne ke liye
  const [showAll, setShowAll] = useState(() => {
      if (typeof window !== 'undefined') {
          return sessionStorage.getItem('categories_expanded') === 'true';
      }
      return false;
  });
const visibleCategories = showAll ? categoryEntries : categoryEntries.slice(0, 5); 
  useEffect(() => {
      if (typeof window !== 'undefined') {
          sessionStorage.setItem('categories_expanded', showAll.toString());
      }
  }, [showAll]);

  useEffect(() => {
      // 🛡️ Ensure CATEGORIES is loaded and activeCategory is safe to read
      if (activeCategory && activeCategory !== 'All') {
          const top5Categories = Object.keys(CATEGORIES).slice(0, 5);
          if (!top5Categories.includes(activeCategory)) {
              setShowAll(true);
          }
      }
  }, [activeCategory]);
useEffect(() => {
      let newCategory = 'All';
      let newTag = searchParams.get('tag') || '';

      if (seoCategory) {
          const decodedCat = decodeURIComponent(seoCategory || ""); 

          if (decodedCat?.toLowerCase() === 'all' || decodedCat?.toLowerCase() === 'worldwide') { 
              newCategory = 'All';
          } else {
              let found = false;
              const urlSlug = decodedCat?.toLowerCase().replace(/[^a-z0-9]/g, '') || ""; 

              for (const [catName, data] of Object.entries(CATEGORIES)) {
                  const cleanCatName = String(catName).toLowerCase().replace(/[^a-z0-9]/g, '');
                  
                  if (cleanCatName === urlSlug) {
                      newCategory = catName;
                      found = true;
                      break;
                  }
                  
                  const matchedTag = (data as any).sub?.find((t: string) => String(t).toLowerCase().replace(/[^a-z0-9]/g, '') === urlSlug);
                  if (matchedTag) {
                      newCategory = catName; 
                      newTag = matchedTag;   
                      found = true;
                      break;
                  }
              }
              
              // 🚀 SEO MAGIC (Phantom Category Hack)
              if (!found) {
                  newCategory = 'All'; 
                  const extractedWord = decodedCat.replace(/-/g, ' '); 
                  setSearchQuery(extractedWord); 
              }
          } // 🔥 YEH WALI BRACKET MISSING THI TUMHARE CODE MEIN!
      } else {
          newCategory = searchParams.get('category') || 'All';
      }

      // Country ke naam ko URL param se theek text mein badlo
      let finalCountry = '';
      
      if (seoLocation) {
          const decodedLoc = decodeURIComponent(seoLocation).toLowerCase();
          
          if (decodedLoc === 'all') {
              finalCountry = ''; 
          } else if (decodedLoc === 'worldwide') {
              finalCountry = 'Worldwide'; 
          } else {
              finalCountry = decodeURIComponent(seoLocation).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          }
      } else {
          finalCountry = searchParams.get('location') || '';
      }

      setActiveCategory(newCategory);
      setActiveSubTag(newTag);
      setFilterJobType(searchParams.get('type') || '');
      setFilterCountry(finalCountry); 
  }, [searchParams, seoCategory, seoLocation]);

  useEffect(() => {
    const storedSeen = JSON.parse(localStorage.getItem('seenJobs') || '[]');
    const storedApplied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setSeenJobs(storedSeen);
    setAppliedJobs(storedApplied);
  }, []);
  useEffect(() => {
    const fetchCompanies = async () => {
    const { data } = await supabase
        .from('companies') 
        .select('name, logo_url')
        .not('logo_url', 'is', null) // Jinka logo hai sirf wahi lao
        .limit(200); // 👈 MAXIMUM LIMIT LAGA DI
        
        if (data) {
            const logoMap: Record<string, string> = {};
            data.forEach((company: any) => {
                if (company.name && company.logo_url) {
                    // String ko lower case aur clean karo (For Backup Fallback)
                    const cleanName = company.name.trim().toLowerCase();
                    logoMap[cleanName] = company.logo_url;
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
    // 🧠 Profile Fetcher: Smart Redirect ke sath
    const fetchProfile = async (userId: string, retryCount = 0) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (data) {
                setUserProfile(data);
                fetchFeaturedMatches(data);
                // 🚀 THE MASTER FIX: Check if profile is TRULY complete
                // Agar username, primary_role, ya skills nahi hain, toh redirect maaro!
                if (!data.username || !data.primary_role || !data.skills || data.skills.length === 0) {
                    router.push('/complete-profile');
                    return; // Code yahin rok do
                }
                
            } else if (retryCount < 3) {
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
            }, 20000);
        }
       setIsAuthChecking(false);
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

 // 🚀 VIP SCROLL STEP 1: Main Category par click kare toh Sub-Categories par phenko!
  useEffect(() => {
      // Check: Agar Main Category select hui hai (aur 'All' nahi hai) aur koi SubTag nahi hai
      if (activeCategory && activeCategory !== 'All' && !activeSubTag && subTagsRef.current) {
          const timer = setTimeout(() => {
              // block: 'center' lagaya hai taake sub-categories screen ke bilkul center mein aa jayen
              subTagsRef.current?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
              });
          }, 300); // 300ms delay taake animation complete ho jaye

          return () => clearTimeout(timer);
      }
  }, [activeCategory]); 

  // 🚀 VIP SCROLL STEP 2: Sub-Category (Tag) par click kare toh Jobs par phenko!
  useEffect(() => {
      if (activeSubTag && jobsSectionRef.current) {
          const timer = setTimeout(() => {
              jobsSectionRef.current?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
              });
          }, 500); // 500ms delay taake jobs load ho jayen

          return () => clearTimeout(timer);
      }
  }, [activeSubTag]);

  // 1. ORIGINAL FETCH JOBS (Sirf API call karega, URL ko nahi chairay ga)
  useEffect(() => {
    if (searchType === 'jobs') {
        const timer = setTimeout(() => {
          setPage(0);         
          fetchJobs(0, true); 
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [searchQuery, activeCategory, activeSubTag, searchType, filterJobType, filterDate, filterCountry]);


  // 2. 🚀 THE SMART TYPING SYNC (Yeh sirf tab chalega jab tum text likhoge)
  useEffect(() => {
      const timer = setTimeout(() => {
          if (searchType === 'jobs') {
              // Window se fresh URL lo taake koi current filter delete na ho!
              const params = new URLSearchParams(window.location.search);
              const currentQ = params.get('q') || '';
              const newQ = searchQuery.trim();
              
              // 🚀 CLEAN URL HACK: Agar clean URL mein pehle se hi hamara word mojood hai, toh URL kharab mat karo
const pathWord = pathname.split('/').pop()?.replace(/-/g, ' ').toLowerCase();

if (currentQ !== newQ && pathWord !== newQ.toLowerCase()) {
                  if (newQ) {
                      params.set('q', newQ);
                  } else {
                      params.delete('q');
                  }
                  router.push(`${pathname}?${params.toString()}`, { scroll: false });
              }
          }
      }, 500);
      return () => clearTimeout(timer);
  }, [searchQuery]); // 👈 Notice: Yeh sirf searchQuery par trigger hoga

  // 🚀 THE VERCEL BUILD FIX: Safe URL Generators
  const getCategoryUrl = (catName: string) => {
      const safeCat = catName || 'all';
      const safeLoc = filterCountry || 'all';

      const formattedCat = safeCat === 'All' ? 'all' : String(safeCat).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const formattedLoc = safeLoc === 'all' ? 'all' : String(safeLoc).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('category');
      params.delete('location');
      params.delete('tag'); 

      const queryString = params.toString() ? `?${params.toString()}` : '';
      if (formattedLoc === 'all' && formattedCat === 'all') return `/${queryString}`;
      return `/remote-jobs/${formattedLoc}/${formattedCat}${queryString}`;
  };

  const getLocationUrl = (locName: string) => {
      const safeCat = activeCategory || 'all';
      const safeLoc = locName || 'all';

      const formattedCat = safeCat === 'All' ? 'all' : String(safeCat).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const formattedLoc = safeLoc === 'all' ? 'all' : String(safeLoc).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('category');
      params.delete('location');
      params.delete('tag'); 

      const queryString = params.toString() ? `?${params.toString()}` : '';
      if (formattedLoc === 'all' && formattedCat === 'all') return `/${queryString}`;
      return `/remote-jobs/${formattedLoc}/${formattedCat}${queryString}`;
  };

  const getTagUrl = (tagName: string) => {
      const safeLoc = filterCountry || 'all';
      const safeCat = activeCategory || 'all';
      const safeTag = tagName || '';
      
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('category');
      params.delete('location');
      params.delete('tag');
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const formattedLoc = safeLoc === 'all' ? 'all' : String(safeLoc).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      if (activeSubTag === safeTag) {
          const formattedCat = safeCat === 'All' ? 'all' : String(safeCat).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          return `/remote-jobs/${formattedLoc}/${formattedCat}${queryString}`;
      } else {
          const formattedTag = String(safeTag).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          return `/remote-jobs/${formattedLoc}/${formattedTag}${queryString}`;
      }
  };
// 🚀 THE URL MAGIC FUNCTION
  const updateURLParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'All') {
      params.set(key, value); // Agar value hai to URL mein daalo
    } else {
      params.delete(key); // Agar khali hai ya 'All' hai to URL se hata do
    }
    
    // Bina page refresh kiye URL change karo
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
 const handleManualSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchType === 'talent') {
          router.push(`/talent?search=${encodeURIComponent(searchQuery)}`);
      } else {
          // 🚀 THE FIX: Search button/Enter dabane par URL update ho
          updateURLParams('q', searchQuery.trim()); 
          fetchJobs(0, true);

          // 👇 YEH 3 NAYI LINES ADD KI HAIN (Auto-Scroll ke liye)
          if (jobsSectionRef.current) {
              setTimeout(() => {
                  jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100); // 100ms ka delay taake UI pehle thora saans le le
          }
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
// 🚀 THE HYPER-PERSONALIZATION ENGINE (DEEP PROFILE + STRICT GEO-MATCH)
  const fetchFeaturedMatches = async (profileData: any) => {
      // Agar skills nahi hain toh return ho jao
      if (!profileData || !profileData.skills || profileData.skills.length === 0) return;

      const userSkills = profileData.skills.map((s: string) => s.toLowerCase());
      const userRole = profileData.primary_role ? profileData.primary_role.toLowerCase() : "";
      const userCountry = profileData.country ? profileData.country.toLowerCase().trim() : "";

      // 🧠 NEW: User ki poori history (Bio, Exp, Projects) ka ek text bana lo
      const userDeepProfileText = `
          ${profileData.bio || ''} 
          ${JSON.stringify(profileData.experience || [])} 
          ${JSON.stringify(profileData.projects || [])}
      `.toLowerCase();

      // ⏱️ STRICT 48 HOURS
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

      // 📥 FETCH JOBS (Isme description bhi mangwa li taake skills usme dhoond sakein)
      const { data: recentJobs } = await supabase
          .from('jobs')
          .select('id, title, source, link, category, date_posted, is_verified, approved, active, job_type, location, tags, company_logo_url, description')
          .gte('date_posted', twoDaysAgo.toISOString())
          .eq('active', true)
          .eq('approved', true);

      if (!recentJobs || recentJobs.length === 0) {
          setFeaturedJobs([]);
          return;
      }

      // 🧮 SCORING & FILTERING LOGIC
      const scoredJobs = recentJobs.map(job => {
          let score = 0;
          
          // Job ka poora data (Description bhi shamil kar li)
          const jobContent = `${job.title} ${job.category} ${(job.tags || []).join(' ')} ${job.description || ''}`.toLowerCase();
          const jobLoc = (job.location || "").toLowerCase();

          // 🌍 STEP 1: STRICT GEO-CHECK
          let isLocMatch = false;
          if (userCountry && jobLoc.includes(userCountry)) {
              score += 100; // Perfect Country Match
              isLocMatch = true;
          } else if (jobLoc.includes('worldwide') || jobLoc.includes('global') || jobLoc.includes('anywhere') || jobLoc === 'remote') {
              score += 50; // Global Match
              isLocMatch = true;
          }

          // 🛑 Reject if location fails
          if (!isLocMatch) {
              return { ...job, matchScore: 0 };
          }

          // 🎯 STEP 2: PRIMARY ROLE & SKILL CHECK
          if (userRole && job.title.toLowerCase().includes(userRole)) {
              score += 50; 
          }

          let skillMatches = 0;
          userSkills.forEach((skill: string) => {
              // Check if user skill is mentioned ANYWHERE in the job post (Title, Tags, or Description)
              if (jobContent.includes(skill)) {
                  skillMatches += 1;
                  score += 15;
              }
          });

          // 🚀 STEP 3: DEEP PROFILE MATCHING (The Magic)
          // Kya job ke tags (e.g., 'React', 'Node') user ke past experience ya projects mein use hue hain?
          (job.tags || []).forEach((tag: string) => {
              if (userDeepProfileText.includes(tag.toLowerCase())) {
                  score += 10; // Extra points for proven experience!
              }
          });

          // Kya job ki category (e.g., 'Design') user ke bio mein hai?
          if (job.category && userDeepProfileText.includes(job.category.toLowerCase())) {
              score += 5;
          }

          // 🛑 Agar Location theek hai lekin Skills/Role/Experience kuch bhi match nai karta toh reject
          if (skillMatches === 0 && (!userRole || !job.title.toLowerCase().includes(userRole))) {
              score = 0;
          }

          return { ...job, matchScore: score };
      });

      // Filter (Score > 0), Sort (Highest First), Limit (Top 3)
      const topMatches = scoredJobs
          .filter(job => job.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 3);

      setFeaturedJobs(topMatches);
  };
  async function fetchJobs(pageNumber = 0, reset = false, isExact = false) {
    if (reset) {
        setLoading(true);
        setHasMore(true);
    } else {
        setLoadingMore(true);
    }

    const from = pageNumber * JOBS_PER_PAGE;
    const to = from + JOBS_PER_PAGE - 1;
   // 🟢 1. Pehle Base Query bana lo (Aur yahi par 'let' laga do)
    let query = supabase
  .from('jobs')
  // 👇 Is line mein aakhir mein ', company_logo_url' wapas add kar do
  .select('id, title, source, link, category, date_posted, is_verified, approved, active, job_type, location, tags, company_logo_url', { count: 'exact' }) 
  .order('date_posted', { ascending: false });

    // 🟢 2. POWERFUL SEARCH LOGIC (NOW POWERED BY TYPESENSE ⚡)
    if (searchQuery && searchQuery.trim().length > 1) {
        try {
           const searchResults = await typesenseSearchClient.collections('jobs').documents().search({
                q: searchQuery.trim(),
                query_by: 'title,category,tags,source',
                per_page: 250, // 🚀 FIX 1: Thora zyada data uthao taake Supabase ke paas latest sort karne ka margin ho
                num_typos: (forceExact || isExact) ? 0 : 2,
                sort_by: 'date_posted:desc' // 🚀 FIX 2: Typesense ko force karo ke naye jobs pehle de!
            });

            // 2. Jo jobs match huin, unki IDs nikal lo
            const matchedIds = searchResults.hits?.map((hit: any) => parseInt(hit.document.id)) || [];

            if (matchedIds.length === 0) {
                 // Agar kuch nahi mila toh empty UI dikhao
                 if (reset) {
                     setJobs([]);
                     setTotalCount(0);
                 }
                 setHasMore(false);
                 setLoading(false);
                 setLoadingMore(false);
                 return; // Query yahin rok do
            }

            // 3. Supabase ko kaho ke sirf yeh wali IDs le kar aaye!
            query = query.in('id', matchedIds);

        } catch (tsError) {
            console.error("Typesense Search Error:", tsError);
            // Fallback (Agar Typesense mein koi masla aye toh purana Supabase search chalao)
            const searchWords = searchQuery.trim().split(/\s+/);
            searchWords.forEach(word => {
                query = query.or(`title.ilike.%${word}%,source.ilike.%${word}%,category.ilike.%${word}%`);
            });
        }
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
        if (filterCountry === 'Worldwide') {
            // Worldwide ke multiple variations check karega
            query = query.or('location.ilike.%Global%,location.ilike.%Worldwide%,location.ilike.%Anywhere%');
        } else {
            // Dropdown se aane wale name se 2-letter Code nikal lo (e.g., United States -> US)
            const upperLoc = filterCountry.toUpperCase();
            const cData = countryMap[upperLoc]; 
            
            if (cData && cData.code === 'US') {
                // 🔥 US ke liye Super Smart Query (US, USA, United States sab dhoondega)
                query = query.or(`location.ilike.%United States%,location.ilike.%USA%,location.ilike.%(US)%,location.ilike.%US(%,location.ilike.%US %`);
            } else if (cData && cData.code === 'GB') {
                // UK ke liye Super Smart Query
                query = query.or(`location.ilike.%United Kingdom%,location.ilike.%UK%,location.ilike.%(GB)%`);
            } else if (cData && cData.code) {
                // Baqi sab countries ke liye (Full name OR 2-letter Code in brackets)
                query = query.or(`location.ilike.%${filterCountry}%,location.ilike.%(${cData.code})%,location.ilike.%${cData.code}(%`);
            } else {
                // Default fallback
                query = query.ilike('location', `%${filterCountry}%`);
            }
        }
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
    // 👇 Yahan bhi aakhir mein ', company_logo_url' wapas add kar do
    .select('id, title, source, link, category, date_posted, is_verified, approved, active, job_type, location, tags, company_logo_url') 
    .eq('approved', true)
            
        data = fallbackData || []; 
    } else {
        if (reset) setIsFallback(false);
    }
    if (data) {
        if (reset) {
            setJobs(data);
            
            // 🚀 THE GOOGLE TYPO MAGIC
            if (searchQuery && data.length > 0) {
                const topJob = data[0];
                const sq = searchQuery?.toLowerCase() || ""; // <-- FIX: Safe string
// Check karo ke user ne jo likha hai wo exactly title, category ya tags mein hai?
const isExactMatch = topJob.title?.toLowerCase().includes(sq) || 
                     topJob.category?.toLowerCase().includes(sq) ||
                     (topJob.tags && topJob.tags.some((t: string) => t?.toLowerCase().includes(sq))); // <-- FIX: Optional chaining on title, category, and tags
                
                if (!isExactMatch) {
                    // Agar exact match nahi hua (Yani Typo tha), toh us job ka sahi tag ya category suggest karo!
                    setSuggestedTerm(topJob.tags && topJob.tags.length > 0 ? topJob.tags[0] : topJob.category);
                } else {
                    setSuggestedTerm(''); // Sab theek hai toh kuch na dikhao
                }
            } else {
                setSuggestedTerm('');
            }
            
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
// --- 📊 ONBOARDING PROGRESS LOGIC ---
const calculateProgress = () => {
    if (!userProfile) return 1; // Default 1 (Signup done)
    
    const steps = [
        userProfile.experience_level,       // Step 2 part
        userProfile.resume_url,             // Step 3 part
        userProfile.bio,                    // Step 2 part
        userProfile.projects?.length > 0,   // Step 3 part
        userProfile.experience?.length > 0, // Step 4 part
        userProfile.education?.length > 0   // Step 4 part
    ];
    
    // Jitne fields null nahi hain unhe count karo + 1 (for basic signup)
    const completed = steps.filter(Boolean).length + 1;
    return completed > 4 ? 4 : completed;
};

const completedSteps = calculateProgress();
const totalSteps = 4;
const progressPercentage = (completedSteps / totalSteps) * 100;
  
 // --- 🧠 START: MASTER TITLE ENGINE ---
  const hasCategory = activeCategory && activeCategory !== 'All';
  const hasTag = !!activeSubTag;
  const hasLocation = !!filterCountry;
  const hasSearch = searchQuery && searchQuery.trim().length > 0;
  const hasFilters = hasCategory || hasTag || hasLocation || hasSearch; // Search ko filters mein add kar diya

  const highlight = "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600";

  const DynamicTitle = () => {
      const locData = getSmartLocationUI(filterCountry);
      // 🚀 FIX: Array mein se pehla match nikal lo
      const topMatch = locData.matched && locData.matched.length > 0 ? locData.matched[0] : null;
      
      // 🏆 PRIORITY LOGIC: Pehle Search Query dikhao, warna SubTag, warna Category
      const keyword = searchQuery.trim() || activeSubTag || (hasCategory ? activeCategory : null);

      return (
          <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-slate-900 dark:text-white">Remote</span>
              
              {keyword && (
                  <span className={highlight}>
                      {/* Agar search query hai toh usko Capitalize karke dikhao */}
                      {keyword.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
              )}
              
              <span className="text-slate-900 dark:text-white">Jobs</span>
              
              {hasLocation && (
                  <>
                      {/* 🚀 UX MAGIC: Agar Worldwide hai toh 'in' mat lagao */}
                      {filterCountry !== 'Worldwide' && (
                          <span className="text-slate-900 dark:text-white">in</span>
                      )}
                      
                      <span className={highlight}>{filterCountry}</span>
                      
                      {/* 🚀 FIX: Ab yahan locData.code ki jagah topMatch.code aayega */}
                      {filterCountry === 'Worldwide' ? (
                          <span className="text-4xl md:text-5xl ml-1 md:ml-2">🌍</span>
                      ) : topMatch && topMatch.code && (
                          <img 
                              src={`https://flagcdn.com/w80/${topMatch.code.toLowerCase()}.png`} 
                              alt={topMatch.name} 
                              className="w-10 md:w-14 h-auto rounded-md shadow-sm ml-1 md:ml-2 object-cover border border-slate-200 dark:border-slate-700"
                          />
                      )}
                  </>
              )}
          </span>
      );
  };
  // 1. FOR LOGGED-OUT USER
  const loggedOutTitle = hasFilters ? <DynamicTitle /> : (
      <>
          Find High-Paying <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Remote & Freelance Work
          </span>
      </>
  );

  // 2. FOR LOGGED-IN USER
  const loggedInTitle = hasFilters ? <DynamicTitle /> : (
      <>
          Welcome back, <span className={highlight}>{userProfile?.full_name?.split(' ')[0] || 'Creator'}!</span> 👋
      </>
  );
  // --- END: MASTER TITLE ENGINE ---

  // --- 🧠 START: UI DESCRIPTION ENGINE ---
  let uiDescription = (
      <>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">HireSkys</span> is the elite job radar for <span className="text-slate-900 dark:text-white font-black decoration-indigo-500/30 underline decoration-4 underline-offset-4">Developers, Designers, & Marketers</span>.
      </>
  );

  if (hasFilters) {
      const roleText = activeSubTag || (activeCategory !== 'All' ? activeCategory : 'Remote');
      const locText = filterCountry ? `in ${filterCountry}` : 'worldwide';
      
      uiDescription = (
          <>
              Browse the best verified <span className="text-slate-900 dark:text-white font-black">{roleText}</span> opportunities hiring <span className="text-slate-900 dark:text-white font-black">{locText}</span>.
          </>
      );
  }

  //HomePageClient.tsx (~Line 638) -> REPLACE Turn 7's block with this

  // --- 🧠 MASTER DESCRIPTION ENGINE ---
  const roleText = activeSubTag || (activeCategory !== 'All' ? activeCategory : 'Remote');
  const locText = filterCountry ? `in ${filterCountry}` : 'worldwide';

  // 1. FOR LOGGED-OUT USER (Default marketing text)
  const loggedOutDescription = hasFilters ? (
       <>Browse the best verified <span className="text-slate-900 dark:text-white font-black">{roleText}</span> opportunities hiring <span className="text-slate-900 dark:text-white font-black">{locText}</span>.</>
  ) : (
      <>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">HireSkys</span> is the elite job radar for <span className="text-slate-900 dark:text-white font-black decoration-indigo-500/30 underline decoration-4 underline-offset-4">Developers, Designers, & Marketers</span>.
      </>
  );

  // 2. FOR LOGGED-IN USER (VVIP Contextual logic based on user profile)
  // Check if user has skills added to profile
  const userHasSkills = userProfile?.skills?.length > 0;
  const topSkill = userHasSkills ? userProfile.skills[0] : 'Remote';

  const loggedInDescription = hasFilters ? (
      <>Browse verified <span className="text-slate-900 dark:text-white font-black">{roleText}</span> opportunities hiring <span className="text-slate-900 dark:text-white font-black">{locText}</span>.</>
  ) : (
      <>
          Showing latest job opportunities related to your top skill <span className="text-slate-900 dark:text-white font-black">{topSkill}</span>.
      </>
  );
  // --- END: MASTER DESCRIPTION ENGINE ---
  if (isAuthChecking) {
      return (
          <div className="min-h-screen font-sans bg-slate-50 dark:bg-[#0B0F19] flex flex-col items-center justify-center">
              <Navbar /> {/* Taa ke upar navbar dikhta rahe */}
              <div className="flex flex-col items-center gap-4 animate-pulse mt-20">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <Briefcase size={32} />
                  </div>
                  <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded-full mt-2"></div>
              </div>
          </div>
      );
  }
return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0B0F19] overflow-x-hidden">
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
    <span className="font-medium">Instant skill-matched alerts on <span className="font-bold text-indigo-600 dark:text-indigo-400">Telegram</span></span>
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
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white capitalize">
    {loggedInTitle}
</h1>
{/* 🆕 VVIP Contextual Description (UX Magic) */}
<p className="mt-2 text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium">
    {loggedInDescription}
</p> 
                    </div>
 
                    {/* --- RIGHT SIDE: STATS & ALERTS ROW --- */}
{/* 🚀 FIXED FOR MOBILE: Grid on Mobile, Flex on Desktop */}
<div className="grid grid-cols-2 md:flex md:flex-nowrap items-stretch gap-3 w-full md:w-auto justify-start md:justify-end mt-4 md:mt-0">
    
    {/* 🚨 1. FOMO BANNER (DANGER / RED THEME) */}
{(!userProfile?.telegram_chat_id) && (
        <div className="col-span-2 md:w-auto w-full relative group p-3.5 bg-gradient-to-br from-red-600 via-red-500 to-rose-600 rounded-2xl border border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] flex flex-col justify-center min-w-[230px] transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-white">
                    <AlertTriangle size={16} className="text-yellow-300 animate-pulse drop-shadow-md" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-md">Action Required</span>
                </div>
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-sm"></span>
                </span>
            </div>
            <div className="text-[9px] font-bold text-red-100 mb-2.5 leading-tight opacity-90">
                You're missing VIP job alerts! Connect now.
            </div>
            <div className="flex gap-2">
                <a 
                    href={`https://t.me/hireskys_bot?start=${currentUser?.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-slate-50 text-red-600 text-[10px] font-black py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 shadow-lg transition-all transform active:scale-95"
                >
                    <Send size={12} className="fill-red-100"/> Telegram
                </a>
            </div>
        </div>
    )}

    {/* 🔵 3. TELEGRAM ACTIVE */}
{(userProfile?.telegram_chat_id) && (
        <div className="col-span-2 md:w-auto w-full relative p-3.5 bg-white dark:bg-[#151b2d] rounded-2xl border border-blue-500/30 dark:border-blue-500/20 min-w-[200px] flex flex-col justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2.5">
                <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </div>
                <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
                    <Send size={14} className="fill-blue-500/20" /> Telegram Active
                </span>
            </div>
            <div className="flex items-center justify-center w-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800">
    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
        <CheckCircle size={12} /> Receiving VIP Alerts
    </span>
</div>
        </div>
    )}

    {/* 📌 ORIGINAL SAVED CARD */}
    <Link href="/profile?tab=saved" className="col-span-1 md:w-auto w-full group relative p-3 bg-white dark:bg-[#151b2d] rounded-2xl border border-slate-200 dark:border-slate-800 min-w-[90px] flex flex-col justify-center items-center cursor-pointer transition-all hover:bg-indigo-600 hover:border-indigo-600 hover:-translate-y-1 active:scale-95 shadow-sm">
        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 group-hover:text-white leading-none mb-1">
            {savedJobIds.length}
        </div>
        <div className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-indigo-100 tracking-wide">
            Saved
        </div>
    </Link>

    {/* 📌 ORIGINAL SKILLS CARD */}
    <Link href="/profile?tab=details" className="col-span-1 md:w-auto w-full group relative p-3 bg-white dark:bg-[#151b2d] rounded-2xl border border-slate-200 dark:border-slate-800 min-w-[90px] flex flex-col justify-center items-center cursor-pointer transition-all hover:bg-emerald-600 hover:border-emerald-600 hover:-translate-y-1 active:scale-95 shadow-sm">
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
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1 min-w-[200px]"
                                        >
                                            {["Full-time", "Contract","Internship","Freelance", "Part-time"].map((type) => (
    <button
        key={type}
        onClick={() => { setFilterJobType(type); setShowJobTypeDropdown(false); updateURLParams('type', type); }} // 🚀 ADDED
        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors flex items-center justify-between group"
    >
        {type}
        {filterJobType === type && <Check size={14} className="text-indigo-500" />}
    </button>
))}
{filterJobType && (
     <button
     onClick={() => { setFilterJobType(""); setShowJobTypeDropdown(false); updateURLParams('type', ''); }} // 🚀 ADDED
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
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1 min-w-[200px]"
                                        >
                                            {[
                                                { val: "24h", label: "Last 24 Hours" },
                                                { val: "7d", label: "Last 7 Days" },
                                                { val: "30d", label: "Last Month" }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.val}
                                                    onClick={() => { setFilterDate(opt.val); fetchJobs(); setShowDateDropdown(false); updateURLParams('date', opt.val); }} // 🚀 ADDED updateURLParams
                                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors flex items-center justify-between"
                                                >
                                                    {opt.label}
                                                    {filterDate === opt.val && <Check size={14} className="text-pink-500" />}
                                                </button>
                                            ))}
                                             {filterDate && (
                                                 <button
                                                 onClick={() => { setFilterDate(""); fetchJobs(); setShowDateDropdown(false); updateURLParams('date', ''); }} // 🚀 ADDED updateURLParams
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
        {COUNTRIES.filter(c => (c.name || "").toLowerCase().includes((countrySearch || "").toLowerCase())).length > 0 ? (
            COUNTRIES.filter(c => (c.name || "").toLowerCase().includes((countrySearch || "").toLowerCase())).map((country) => (
                <Link
                    key={country.name}
                    href={getLocationUrl(country.name)}
                    scroll={false}
                    onClick={() => { 
                        setFilterCountry(country.name); 
                        setShowCountryDropdown(false); 
                        setCountrySearch(""); 
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors flex items-center gap-2"
                >
                    <span className="text-lg flex-shrink-0">{country.flag}</span>
                    <span className="truncate">{country.name}</span>
                    {filterCountry === country.name && <Check size={14} className="text-emerald-500 ml-auto" />}
                </Link>
            ))
        ) : (
            <div className="p-4 text-center text-xs text-slate-400">
                No country found
            </div>
        )}
    </div>
    
    {filterCountry && (
        <button
            onClick={() => { 
                setFilterCountry(""); 
                setShowCountryDropdown(false); 
                setCountrySearch(""); 
                router.push(getLocationUrl(''), { scroll: false });
            }}
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
                            <Link 
        href={getCategoryUrl('All')}
        scroll={false}
        onClick={() => { 
            setActiveCategory('All'); 
            setActiveSubTag(''); 
        }}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transform hover:scale-105 active:scale-95 transition-all border shadow-sm ${activeCategory === 'All' ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/25' : 'bg-white dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
    >
        <Filter size={18} /> All
    </Link>
                            {visibleCategories.map(([name, data], index) => {
        const Icon = data.icon;
        const isActive = activeCategory === name;
        return (
            <Link 
                key={name} 
                href={getCategoryUrl(name)}
                scroll={false}
                onClick={() => { 
                    setActiveCategory(name); 
                    setActiveSubTag(''); 
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm md:text-base font-medium transform hover:scale-105 active:scale-95 transition-all border whitespace-nowrap shadow-sm ${isActive ? 'bg-indigo-600 text-white border-transparent shadow-indigo-500/30 shadow-lg' : 'bg-white/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-md'}`}
            >
                <Icon size={18} /> {name}
            </Link>
        )
    })}
                        </div>
                         
                         {categoryEntries.length > 5 && (
                            <button onClick={() => setShowAll(!showAll)} className="mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline transition-all">
                                {showAll ? (<>Show Less <ChevronUp size={16}/></>) : (<>View All Categories <ChevronDown size={16}/></>)}
                            </button>
                        )}
                         
                         {activeCategory !== 'All' && CATEGORIES.hasOwnProperty(activeCategory) && (
    <motion.div ref={subTagsRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-2 mt-6 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 relative z-10 w-full">
        {/* 🚀 FIX: Yahan humne ?.sub?.map lagaya hai aur ( || [] ) ka fallback diya hai taake kabhi crash na ho! */}
        {((CATEGORIES as any)[activeCategory]?.sub || []).map((tag: any) => (
            <Link 
                key={tag} 
                href={getTagUrl(tag)}
                scroll={false}
                onClick={() => {
                    const newTag = activeSubTag === tag ? '' : tag;
                    setActiveSubTag(newTag);
                }} 
                className={`px-4 py-2 rounded-full text-sm font-medium transform hover:scale-105 active:scale-95 transition-all border ${activeSubTag === tag ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
            >
                {tag}
            </Link>
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
                    {loggedOutTitle}
                </motion.h1>

                {/* 3. DESCRIPTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-4xl mx-auto flex flex-col gap-5"
                >
                    <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
      {uiDescription}
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

              {/* --- SEARCH BAR WITH HYRIZON AI --- */}
              <form onSubmit={handleManualSearch} className="relative group flex items-center bg-white dark:bg-[#151b2d] p-1.5 md:p-2 rounded-full shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 transition-all transform md:hover:scale-[1.01]">
                  
                  {/* Left Icon (Briefcase Fixed) */}
                  <div className="pl-3 pr-2 border-r border-slate-200 dark:border-slate-700 text-slate-400 flex items-center gap-2">
                      <Briefcase size={18} />
                      <span className="text-sm font-medium hidden sm:block capitalize">Jobs</span>
                  </div>

                  {/* Input Field (Placeholder Fixed) */}
                  <input 
                      type="text" 
                      placeholder="Search roles (e.g. React Developer)..." 
                      className="flex-1 h-10 md:h-12 pl-3 pr-2 bg-transparent outline-none text-base md:text-lg text-slate-800 dark:text-white placeholder:text-slate-400 min-w-0"
                      value={searchQuery}
                      onChange={(e) => { 
                          setSearchQuery(e.target.value); 
                          setForceExact(false); 
                      }}
                  />

                  {/* --- 🔥 HYRIZON: HYRIZON AI BUTTON --- */}
                  <div className="hidden sm:flex items-center pl-2 pr-2 relative z-20">
                    <button
                        type="button"
                        onClick={handleAISearch}
                        className="group relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                        title="Ask Hyrizon AI"
                    >
                        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7c3aed_0%,#d946ef_50%,#06b6d4_100%)]" />
                        <div className="relative flex items-center gap-2 px-3 py-2 rounded-[10px] z-10 bg-white dark:bg-[#151b2d] transition-colors group-hover:bg-violet-50 dark:group-hover:bg-[#1e2538]">
                            <div className="relative">
                                <Sparkles size={16} className="text-violet-600 dark:text-violet-300 relative z-10" />
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

             {/* --- SUPER SMOOTH CUSTOM FILTERS (LOGGED OUT FIX) --- */}
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
                                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1"
                                  >
                                      {["Full-time", "Contract","Internship","Freelance", "Part-time"].map((type) => (
                                          <button
                                              key={type}
                                              onClick={() => { 
                                                  setFilterJobType(type); 
                                                  setShowJobTypeDropdown(false); 
                                                  updateURLParams('type', type); // 🚀 FIX: Add Type to URL
                                              }}
                                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors flex items-center justify-between group"
                                          >
                                              {type}
                                              {filterJobType === type && <Check size={14} className="text-indigo-500" />}
                                          </button>
                                      ))}
                                      {filterJobType && (
                                           <button
                                           onClick={() => { 
                                               setFilterJobType(""); 
                                               setShowJobTypeDropdown(false); 
                                               updateURLParams('type', ''); // 🚀 FIX: Clear Type from URL
                                           }}
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
                                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e2538] border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-1"
                                  >
                                      {[
                                          { val: "24h", label: "Last 24 Hours" },
                                          { val: "7d", label: "Last 7 Days" },
                                          { val: "30d", label: "Last Month" }
                                      ].map((opt) => (
                                          <button
                                              key={opt.val}
                                              onClick={() => { 
                                                  setFilterDate(opt.val); 
                                                  fetchJobs(); 
                                                  setShowDateDropdown(false); 
                                                  updateURLParams('date', opt.val); // 🚀 FIX: Add Date to URL
                                              }}
                                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors flex items-center justify-between"
                                          >
                                              {opt.label}
                                              {filterDate === opt.val && <Check size={14} className="text-pink-500" />}
                                          </button>
                                      ))}
                                       {filterDate && (
                                           <button
                                           onClick={() => { 
                                               setFilterDate(""); 
                                               fetchJobs(); 
                                               setShowDateDropdown(false); 
                                               updateURLParams('date', ''); // 🚀 FIX: Clear Date from URL
                                           }}
                                           className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border-t border-slate-100 dark:border-slate-700 mt-1"
                                       >
                                           Clear Filter
                                       </button>
                                      )}
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>

                      {/* CUSTOM FILTER 3: Location / Country */}
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

                                      {/* Scrollable Area */}
    <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1">
        {COUNTRIES.filter(c => (c.name || "").toLowerCase().includes((countrySearch || "").toLowerCase())).length > 0 ? (
            COUNTRIES.filter(c => (c.name || "").toLowerCase().includes((countrySearch || "").toLowerCase())).map((country) => (
                <Link
                    key={country.name}
                    href={getLocationUrl(country.name)}
                    scroll={false}
                    onClick={() => { 
                        setFilterCountry(country.name); 
                        setShowCountryDropdown(false); 
                        setCountrySearch(""); 
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors flex items-center gap-2"
                >
                    <span className="text-lg flex-shrink-0">{country.flag}</span>
                    <span className="truncate">{country.name}</span>
                    {filterCountry === country.name && <Check size={14} className="text-emerald-500 ml-auto" />}
                </Link>
            ))
        ) : (
            <div className="p-4 text-center text-xs text-slate-400">
                No country found
            </div>
        )}
    </div>
    
    {filterCountry && (
        <button
            onClick={() => { 
                setFilterCountry(""); 
                setShowCountryDropdown(false); 
                setCountrySearch(""); 
                router.push(getLocationUrl(''), { scroll: false });
            }}
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
                    <Link 
        href={getCategoryUrl('All')}
        scroll={false}
        onClick={() => { 
            setActiveCategory('All'); 
            setActiveSubTag(''); 
        }}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold transform hover:scale-105 active:scale-95 transition-all border shadow-sm ${activeCategory === 'All' ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/25' : 'bg-white dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
    >
        <Filter size={18} /> All
    </Link>
                    
                    {/* Categories Map */}
                    {visibleCategories.map(([name, data], index) => {
        const Icon = data.icon;
        const isActive = activeCategory === name;
        return (
            <Link 
                key={name} 
                href={getCategoryUrl(name)}
                scroll={false}
                onClick={() => { 
                    setActiveCategory(name); 
                    setActiveSubTag(''); 
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm md:text-base font-medium transform hover:scale-105 active:scale-95 transition-all border whitespace-nowrap shadow-sm ${isActive ? 'bg-indigo-600 text-white border-transparent shadow-indigo-500/30 shadow-lg' : 'bg-white/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-md'}`}
            >
                <Icon size={18} /> {name}
            </Link>
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
                      {activeCategory !== 'All' && CATEGORIES.hasOwnProperty(activeCategory) && (
    <motion.div ref={subTagsRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-2 mt-6 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 relative z-10 w-full">
        {/* 🚀 FIX: Yahan humne ?.sub?.map lagaya hai aur ( || [] ) ka fallback diya hai taake kabhi crash na ho! */}
        {((CATEGORIES as any)[activeCategory]?.sub || []).map((tag: any) => (
            <Link 
                key={tag} 
                href={getTagUrl(tag)}
                scroll={false}
                onClick={() => {
                    const newTag = activeSubTag === tag ? '' : tag;
                    setActiveSubTag(newTag);
                }} 
                className={`px-4 py-2 rounded-full text-sm font-medium transform hover:scale-105 active:scale-95 transition-all border ${activeSubTag === tag ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
            >
                {tag}
            </Link>
        ))}
    </motion.div>
)}
          </div>
        </header>

      )}
      {/* --- 🚀 ONBOARDING PROGRESS CARD --- */}
{currentUser && (!userProfile?.is_onboarded || completedSteps < totalSteps) && (
  <div className="container mx-auto px-4 mt-8 max-w-5xl">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white dark:bg-[#111625] border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-500/5"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        
        {/* Left: Progress Circle */}
        <div className="relative flex-shrink-0 w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-indigo-600 stroke-current transition-all duration-1000 ease-out" strokeWidth="3" strokeDasharray={`${progressPercentage}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{completedSteps}/{totalSteps}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Steps</span>
          </div>
        </div>

        {/* Middle: Content */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">
             {completedSteps === 1 ? "Start your professional journey! 🚀" : "Almost there, " + (userProfile?.full_name?.split(' ')[0] || 'User') + "! 🔥"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
  Complete your profile to <strong>boost your visibility by 5x</strong> and get matched with top remote jobs.
</p>
          
          {/* Mobile Progress Bar (Optional) */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden md:hidden">
             <div className="bg-indigo-600 h-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* Right: Action Button */}
        <Link 
          href="/onboarding"
          className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          {completedSteps === 1 ? "Setup Profile" : "Continue Setup"}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  </div>
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

                    {/* Card 3: Instant Alerts (UPDATED) */}
                    <motion.div 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 hover:bg-white dark:hover:bg-[#151b2d] hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 group cursor-default"
                    >
                        <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Bell size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Instant Alerts</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Get notified via <strong className="text-slate-700 dark:text-slate-300">Telegram & WhatsApp</strong> the millisecond a new job drops.
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
      <main id="jobs" ref={jobsSectionRef} className="container mx-auto px-4 pt-12 md:pt-16 pb-8 max-w-5xl scroll-mt-24">
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
{/* 🚀 GOOGLE STYLE "DID YOU MEAN" MESSAGE */}
        {suggestedTerm && searchQuery && !loading && jobs.length > 0 && (
            <div className="mb-6 flex flex-col items-start gap-1">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm md:text-base border border-indigo-100 dark:border-indigo-800/30 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <Sparkles size={18} className="text-indigo-500" />
                    <span>
                        Showing results for <span className="font-black italic text-indigo-800 dark:text-indigo-200">{suggestedTerm}</span>
                    </span>
                </div>
                <div className="px-4 text-sm text-slate-500 dark:text-slate-400">
                    Search instead for <button 
                        type="button"
                        onClick={() => { setForceExact(true); fetchJobs(0, true, true); }} 
                        className="underline decoration-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer underline-offset-4 font-medium transition-colors"
                    >
                        {searchQuery}
                    </button>
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
            {/* 🌟 VVIP FEATURED MATCHES (Only on default dashboard, Logged In) */}
        {currentUser && !searchQuery && activeCategory === 'All' && featuredJobs.length > 0 && (
            <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={20} className="text-amber-500 animate-pulse" />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Top Matches For You
                    </h3>
                </div>
                
                {featuredJobs.map((job) => {
                    const smartLoc = getSmartLocationUI(job.location || "");
                    const isApplied = appliedJobs.includes(job.id);
                    const isSaved = savedJobIds.includes(job.id);
                    const cleanSourceName = job.source ? job.source.trim().toLowerCase() : "";
                    const companyLogoUrl = job.company_logo_url || companyLogos[cleanSourceName] || null; 

                    // 🕒 Time Logic (Same as normal cards)
                    const jobDate = new Date(job.date_posted);
                    const now = new Date();
                    const diffHrs = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffHrs / 24);

                    return (
                        <div key={`featured-${job.id}`} className="relative p-[2px] rounded-2xl md:rounded-3xl bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 shadow-xl shadow-amber-500/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-amber-500/20">
                            {/* Glowing Background Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur opacity-20"></div>
                            
                            <div className="relative bg-white dark:bg-[#111625] rounded-[20px] md:rounded-[28px] p-4 md:p-6 flex flex-col hover:bg-amber-50/50 dark:hover:bg-[#151b2d] transition-colors">
                                
                                {/* 📍 Top Row: Location & Actual Time (EXACTLY like normal cards) */}
                                <div className="flex justify-between items-center mb-3 md:mb-5">
                                    <div className="flex items-center gap-2 md:gap-4">
                                        <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 overflow-hidden">
                                            <div className="flex items-center gap-1.5">
                                                {smartLoc.matched.slice(0, 2).map((locItem: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-1">
                                                        {index > 0 && <span className="text-slate-300 dark:text-slate-600 mr-1">,</span>}
                                                        {locItem.isImage ? (
                                                            <img src={`https://flagcdn.com/w40/${locItem.code.toLowerCase()}.png`} alt={locItem.name} className="w-4 md:w-5 h-auto object-cover rounded-[2px] shadow-sm flex-shrink-0" />
                                                        ) : (
                                                            <span className="text-base leading-none">🌍</span>
                                                        )}
                                                        <span className="tracking-wide max-w-[80px] md:max-w-[120px] truncate">{locItem.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {smartLoc.hasMore && smartLoc.totalCount > 2 && (
                                                <span className="text-[9px] md:text-[10px] text-indigo-600 dark:text-indigo-400 font-black ml-0.5 bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded-md whitespace-nowrap">+{smartLoc.totalCount - 2} More</span>
                                            )}
                                        </div>
                                        <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-amber-600/80 dark:text-amber-500/80">
                                            <Clock size={16} />
                                            <span>{diffHrs < 1 ? 'Just now' : diffHrs < 24 ? `${diffHrs}h ago` : `${diffDays}d ago`}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Top Match Badge */}
                                    <div className="flex gap-2 items-center">
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md tracking-wider flex items-center gap-1">
                                            <Award size={12} /> Top Match
                                        </span> 
                                    </div>
                                </div>

                                {/* 💼 Main Details */}
                                <div className="flex items-start gap-3 md:gap-5 mb-4">
                                    <div className="flex-shrink-0">
                                        {companyLogoUrl ? (
                                            <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white p-1 md:p-1.5 border border-amber-100 dark:border-slate-700 shadow-sm flex items-center justify-center">
                                                <img src={companyLogoUrl} alt={job.source} className="h-full w-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center border border-amber-100 dark:border-slate-700">
                                                <Briefcase size={24} className="text-amber-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-1 md:mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
                                            <span className="text-slate-800 dark:text-slate-200 font-bold">{job.source}</span>
                                            {job.is_verified && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] md:text-xs font-bold"><ShieldCheck size={10} /> Verified</span>}
                                            <span className="md:hidden flex items-center gap-1 text-amber-500/80"> • {diffHrs < 1 ? 'Just now' : `${diffHrs}h ago`}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ⚡ Action Row */}
                                <div className="mt-auto pt-3 md:pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-5">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-[10px] md:text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">{job.category}</div>
                                        {job.job_type && <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-[10px] md:text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">{job.job_type}</div>}
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                                        <button onClick={(e) => { e.preventDefault(); toggleSave(job.id); }} className={`p-2 md:p-3 rounded-xl border transition-all ${isSaved ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20' : 'bg-transparent border-slate-200 text-slate-400 hover:text-red-500'}`}><Heart size={18} className={isSaved ? "fill-current" : ""} /></button>
                                        <Link href={`/jobs/${createSlug(job.title, job.id)}`} className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all text-center">
                                            {isApplied ? 'Applied ✓' : 'View Details'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />)
          ) : jobs.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-[#111625] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Search className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs found</h3>
              <p className="text-slate-500">Try adjusting your search filters.</p>
            </div>
            
          ) : (
            
            // 🚀 STEP 1: index add kiya taake hum count kar saken
            jobs.map((job, index) => {
              // 🟢 1. Tumhara Sara Original Logic (No changes here)
              const smartLoc = getSmartLocationUI(job.location || "");
              const jobDate = new Date(job.date_posted);
              const now = new Date();
              const diffHrs = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
              const diffDays = Math.floor(diffHrs / 24);
              const isJustNow = diffHrs <= 4;
              const isSaved = savedJobIds.includes(job.id);
              const isSeen = seenJobs.includes(job.id);
              const isApplied = appliedJobs.includes(job.id);
              const cleanSourceName = job.source ? job.source.trim().toLowerCase() : "";
              const companyLogoUrl = job.company_logo_url || companyLogos[cleanSourceName] || null; 

              // 🟢 2. RETURN: Har Job Card ko wrap kiya hai ek container mein
              return (
                <div key={job.id} className="flex flex-col gap-4">
                  
                  {/* 💼 YOUR ORIGINAL JOB CARD (Fully Intact) */}
                  <div className="group relative flex flex-col bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                    
                    <div className="flex justify-between items-center mb-3 md:mb-5">
                      <div className="flex items-center gap-2 md:gap-4">
                         <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 overflow-hidden">
                             <div className="flex items-center gap-1.5">
                                 {smartLoc.matched.slice(0, 2).map((locItem: any, index: number) => (
                                     <div key={index} className="flex items-center gap-1">
                                         {index > 0 && <span className="text-slate-300 dark:text-slate-600 mr-1">,</span>}
                                         {locItem.isImage ? (
                                             <img src={`https://flagcdn.com/w40/${locItem.code.toLowerCase()}.png`} alt={locItem.name} className="w-4 md:w-5 h-auto object-cover rounded-[2px] shadow-sm flex-shrink-0" />
                                         ) : (
                                             <span className="text-base leading-none">🌍</span>
                                         )}
                                         <span className="tracking-wide max-w-[80px] md:max-w-[120px] truncate">{locItem.name}</span>
                                     </div>
                                 ))}
                             </div>
                             {smartLoc.hasMore && smartLoc.totalCount > 2 && (
                                 <span className="text-[9px] md:text-[10px] text-indigo-600 dark:text-indigo-400 font-black ml-0.5 bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded-md whitespace-nowrap">+{smartLoc.totalCount - 2} More</span>
                             )}
                         </div>
                         <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
                             <Clock size={16} />
                             <span>{diffHrs < 1 ? 'Just now' : diffHrs < 24 ? `${diffHrs}h ago` : `${diffDays}d ago`}</span>
                         </div>
                      </div>
                      <div className="flex gap-2 items-center">
                          {isApplied ? (
                              <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black uppercase bg-green-100 text-green-700 border border-green-200 tracking-wider flex items-center gap-1"><CheckCircle size={12} /> Applied</span>
                          ) : isSeen ? (
                              <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase bg-slate-200 text-slate-500 border border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 tracking-wider flex items-center gap-1"><Eye size={12} /> Seen</span>
                          ) : isJustNow ? (
                              <span className="animate-pulse px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black uppercase bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md tracking-wider">New Arrival</span> 
                          ) : null}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-5 mb-4 md:mb-6">
                      <div className="flex-shrink-0">
                          {companyLogoUrl ? (
                              <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white p-1 md:p-1.5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center">
                                  <img src={companyLogoUrl} alt={job.source} className="h-full w-full object-contain" />
                              </div>
                          ) : (
                              <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center border border-indigo-100 dark:border-slate-700">
                                  {(() => {
                                      const categoryData = CATEGORIES[job.category as keyof typeof CATEGORIES];
                                      const IconComponent = categoryData ? (categoryData as any).icon : Briefcase;
                                      return <IconComponent size={24} className="text-indigo-600 dark:text-indigo-400 md:w-8 md:h-8" />;
                                  })()}
                              </div>
                          )}
                      </div>
                      <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-1 md:mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
                              <span className="text-slate-800 dark:text-slate-200 font-bold">{job.source}</span>
                              {job.is_verified && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] md:text-xs font-bold border border-blue-100"><ShieldCheck size={10} /> Verified</span>}
                              <span className="md:hidden flex items-center gap-1 text-slate-400"> • {diffHrs < 1 ? 'Just now' : `${diffHrs}h ago`}</span>
                          </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 md:pt-5 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-5">
                      <div className="flex flex-wrap gap-2">
                          <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200">{job.category}</div>
                          {job.job_type && <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-300 border border-blue-100">{job.job_type}</div>}
                          {job.tags && job.tags.length > 0 && <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-300 border border-emerald-100">{job.tags[0]}</div>}
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                          <button onClick={(e) => { e.preventDefault(); toggleSave(job.id); }} className={`p-2 md:p-3 rounded-xl border transition-all ${isSaved ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20' : 'bg-transparent border-slate-200 text-slate-400 hover:text-red-500'}`}><Heart size={18} className={isSaved ? "fill-current" : ""} /></button>
                          <Link href={`/jobs/${createSlug(job.title, job.id)}`} onClick={() => { if (!isSeen) { const newSeen = [...seenJobs, job.id]; setSeenJobs(newSeen); localStorage.setItem('seenJobs', JSON.stringify(newSeen)); } }} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-slate-200 transition-all shadow-lg text-center">View Details</Link>
                      </div>
                    </div>
                  </div>

                  {/* 🔥 THE MAGIC: TEESRA CARD (TRENDING SEARCHES) */}
                  {/* index === 1 matlab 2 jobs ke baad, aur !searchQuery matlab sirf home default list par dikhega */}
                  {index === 2 && !searchQuery && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 rounded-2xl md:rounded-3xl p-6 md:p-10 my-2 shadow-2xl shadow-indigo-500/20 group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>

                      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center lg:text-left">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4">
                            <TrendingUp size={14} /> Global Market Trend
                          </div>
                          <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3">
                            Trending Remote <span className="text-indigo-200">Opportunities</span>
                          </h3>
                          <p className="text-indigo-100 text-sm md:text-lg font-medium opacity-90">
                            Don't miss out! Top companies are hiring heavily for these specific roles right now.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-[45%]">
  {[
    // 🚀 SEO FIX 1: query mein space ya '+' ki jagah '-' (hyphen) use karo taake clean URL banay
    { name: "Finance Jobs", slug: "finance", icon: "📈" },
    { name: "Global AI Jobs", slug: "global-work-ai", icon: "🌎" },
    { name: "Data Entry Jobs", slug: "data-entry", icon: "👨🏻‍💻" },
    { name: "HR Jobs", slug: "hr", icon: "👔" },
    { name: "Support", slug: "customer-support", icon: "🎧" },
    { name: "Software Engineer", slug: "software-engineer", icon: "</>" },
    { name: "Netflix", slug: "netflix", icon: "🎬" }
  ].map((trend) => (
    <Link 
      key={trend.name}
      // 🚀 SEO FIX 2: ?q= hata diya! Ab ye direct clean URL banayega (e.g. /remote-jobs/all/software-engineer)
      href={getCategoryUrl(trend.slug)} 
      scroll={false}
      className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-indigo-50 text-indigo-900 rounded-xl text-sm font-black transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-95 shadow-lg"
    >
      <span>{trend.icon}</span> {trend.name}
    </Link>
  ))}
</div>
                      </div>
                    </div>
                  )}
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
