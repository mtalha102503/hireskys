"use client"; // FIX 1: Removed extra quote here
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { createSlug } from '@/lib/utils'; // 👈 Ye zaroori hai
import Navbar from '@/components/Navbar';
import ReportJob from '@/components/ReportJob';
import JobFeedback from '@/components/JobFeedback';
import VerifyMagicButton from '@/components/VerifyMagicButton';
import { CATEGORIES } from '@/lib/categories';
import SkillGapAnalyzer from '@/components/SkillGapAnalyzer';
import GuestSkillAnalyzer from '@/components/GuestSkillAnalyzer';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, MapPin, Clock, DollarSign, 
  Briefcase, ExternalLink, Share2, Heart, CheckCircle, Building, User, Mail, Globe, ShieldCheck, ScanSearch, AlertTriangle, X, Bell, Star // 👈 Star add kiya
} from 'lucide-react';

// 🌍 GLOBAL COUNTRY MAP (Flags aur Codes ke liye)
const COUNTRY_MAP: Record<string, { code: string; flag: string; name: string }> = {
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

// 🟢 1. STRING PARSER
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

// 🟢 2. UI FORMATTER
const getSmartLocationUI = (locationString: string) => {
    if (!locationString) return { matched: [{ name: "Global", flag: "🌍", code: null }], isRemote: true, hasMore: false, totalCount: 1 };

    const parsedData = parseComplexLocation(locationString);
    if (parsedData.length === 0) {
        return { matched: [{ name: locationString, flag: "🌍", code: null }], isRemote: true, hasMore: false, totalCount: 1 };
    }
    
    const uiElements: any[] = [];
    
    parsedData.forEach(item => {
        const cKey = item.country.toUpperCase();
        const countryData = COUNTRY_MAP[cKey] || { code: null, flag: "🌍", name: item.country };
        
        const displayName = item.cities.length > 0 ? item.cities[0] : countryData.name;
        
        uiElements.push({
            flag: countryData.flag,
            code: countryData.code,
            name: displayName === "Worldwide" ? "Global" : displayName,
            isImage: !!countryData.code
        });
    });

    return {
        matched: uiElements,
        isRemote: locationString.toLowerCase().includes('remote'),
        hasMore: uiElements.length > 1,
        totalCount: uiElements.length
    };
};
// 🚀 GUEST JOB ALERT COMPONENT (Multi-Select Skills ke sath)
const GuestJobAlert = () => {
    // 1. State mein 'skill' ki jagah 'skills' array bana diya
    const [formData, setFormData] = useState<{name: string, email: string, location: string, skills: string[]}>({ 
        name: '', email: '', location: '', skills: [] 
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // 2. Add Skill Logic (Max 5 skills)
    const addSkill = (e: any) => {
        const selected = e.target.value;
        if (selected && !formData.skills.includes(selected)) {
            if (formData.skills.length >= 5) {
                alert("You can select up to 5 skills for your alerts.");
                return;
            }
            setFormData({ ...formData, skills: [...formData.skills, selected] });
        }
        e.target.value = ""; // Dropdown ko wapas reset kar do
    };

    // 3. Remove Skill Logic
    const removeSkill = (skillToRemove: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation: Kam az kam 1 skill select honi chahiye
        if (formData.skills.length === 0) {
            alert("Please select at least one skill.");
            return;
        }
        
        setStatus('loading');

        // 4. Save Logic: Skills array ko string bana kar save kar rahe hain taake purana DB schema chalta rahe
        const { error } = await supabase.from('guest_leads').insert([{
            name: formData.name,
            email: formData.email,
            location: formData.location,
            skill: formData.skills.join(', ') // Result: "React, Node.js, Python"
        }]);

        if (error) {
            console.error("Lead Save Error:", error);
            setStatus('error');
        } else {
            setStatus('success');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 text-center animate-in zoom-in-95 duration-300 mb-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Alerts Set Successfully!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">We'll email you the best jobs for your selected skills.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Bell size={20} className="animate-[wiggle_1s_ease-in-out_infinite]" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Get Instant Alerts</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Don't miss out on remote opportunities.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                <input 
                    required type="text" placeholder="Your Name" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
                <input 
                    required type="email" placeholder="Your Email" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
                <input 
                    required type="text" placeholder="Location (e.g. Pakistan)" 
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
                
                {/* 🚀 UPDATED: Multi-Select Dropdown Logic */}
                <div>
                    <select 
                        onChange={addSkill}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white appearance-none cursor-pointer"
                    >
                        <option value="">+ Add a skill (Max 5)...</option>
                        {Object.entries(CATEGORIES).map(([catName, catData]: any) => (
                            <optgroup key={catName} label={catName}>
                                {catData.sub.map((skill: string) => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>

                    {/* 🏷️ Selected Skills Chips */}
                    {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-bold animate-in zoom-in">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors ml-1">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    disabled={status === 'loading'} type="submit" 
                    className="w-full mt-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {status === 'loading' ? 'Saving...' : 'Set Free Alert'}
                </button>
                {status === 'error' && <p className="text-xs text-red-500 text-center mt-1">Something went wrong. Try again.</p>}
            </form>
        </div>
    );
};
// 📱 MOBILE GUEST ALERT (Banner Button + Bottom Sheet Modal)
const MobileGuestAlert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<{name: string, email: string, location: string, skills: string[]}>({ 
        name: '', email: '', location: '', skills: [] 
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const addSkill = (e: any) => {
        const selected = e.target.value;
        if (selected && !formData.skills.includes(selected)) {
            if (formData.skills.length >= 5) {
                alert("You can select up to 5 skills.");
                return;
            }
            setFormData({ ...formData, skills: [...formData.skills, selected] });
        }
        e.target.value = ""; 
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.skills.length === 0) {
            alert("Please select at least one skill.");
            return;
        }
        setStatus('loading');
        
        const { error } = await supabase.from('guest_leads').insert([{
            name: formData.name,
            email: formData.email,
            location: formData.location,
            skill: formData.skills.join(', ')
        }]);

        if (error) {
            console.error("Mobile Lead Error:", error);
            setStatus('error');
        } else {
            setStatus('success');
            // Modal khud hi band ho jayega aur success message button ki jagah aayega
        }
    };

    return (
        <div className="md:hidden w-full">
            {/* 1. The Banner Button (Jo khali jagah par aayega) */}
            {!isOpen && status !== 'success' && (
                <button onClick={() => setIsOpen(true)} className="w-full h-[54px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl flex items-center justify-center gap-2.5 font-bold shadow-lg shadow-indigo-500/30 active:scale-95 transition-all">
                    <Bell size={18} className="animate-[wiggle_1s_ease-in-out_infinite]" /> 
                    Enable Instant Alerts
                </button>
            )}

            {/* Success State in Banner */}
            {status === 'success' && (
                <div className="w-full h-[54px] bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center gap-2 font-bold">
                    <CheckCircle size={18} /> Alerts Enabled!
                </div>
            )}

            {/* 2. The Bottom Sheet Modal */}
            {isOpen && status !== 'success' && (
                <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Modal Box */}
                    <div className="bg-white dark:bg-[#111625] w-full rounded-t-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto border-t border-slate-200 dark:border-slate-800">
                        
                        {/* Close Button */}
                        <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition-colors">
                            <X size={18} />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6 mt-2">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white">VIP Job Alerts</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Never miss a remote opportunity.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white" />
                            <input required type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white" />
                            <input required type="text" placeholder="Location (e.g. Pakistan)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white" />
                            
                            <div>
                                <select onChange={addSkill} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white appearance-none cursor-pointer">
                                    <option value="">+ Add a skill (Max 5)...</option>
                                    {Object.entries(CATEGORIES).map(([catName, catData]: any) => (
                                        <optgroup key={catName} label={catName}>
                                            {catData.sub.map((skill: string) => (
                                                <option key={skill} value={skill}>{skill}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>

                                {formData.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.skills.map((skill, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold animate-in zoom-in">
                                                {skill}
                                                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors ml-1"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button disabled={status === 'loading'} type="submit" className="w-full mt-6 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-base py-4 rounded-xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
                                {status === 'loading' ? 'Saving...' : 'Set Free Alert'}
                            </button>
                            {status === 'error' && <p className="text-xs text-red-500 text-center mt-2">Error saving. Try again.</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default function JobClient({ initialJob }: { initialJob: any }) {
  const params = useParams();
  const router = useRouter();
  
  // States
  const [job, setJob] = useState<any>(initialJob);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]); 
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
const [applyCount, setApplyCount] = useState(job.application_count || 0);

// 🌍 GEO-LOCATION STATES
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [showGeoWarning, setShowGeoWarning] = useState(false);

  // 👇 LOCATION DETECTION LOGIC (Auto Run)
  useEffect(() => {
    const detectLocation = async () => {
      // 1. Agar user Login hai to Profile se Country lo
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('country').eq('id', user.id).single();
        if (profile?.country) {
          setUserCountry(profile.country);
          return;
        }
      }
      // 2. Agar Guest hai to IP se Country lo
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_name) setUserCountry(data.country_name);
      } catch (e) { console.error("IP Error", e); setUserCountry("Unknown"); }
    };
    detectLocation();
  }, []);
  useEffect(() => {
    fetchJobDetails();
  }, []);
// 🟢 NAYA: Job page khulte hi isko 'Seen' mark kar do
  useEffect(() => {
    // Check karo ke job load ho chuki hai
    if (job && job.id) {
       const seen = JSON.parse(localStorage.getItem('seenJobs') || '[]');
       // Agar is job ki ID pehle se list mein nahi hai, to add kar do
       if (!seen.includes(job.id)) {
           localStorage.setItem('seenJobs', JSON.stringify([...seen, job.id]));
       }
    }
  }, [job]);
  // 👇 Helper functions ko yahan define kiya taake wo fetchJobDetails ke andar bhi milein
  // 👇 UPDATED: Super clean slug generator (Double dashes handle karega)
const getCompanySlug = (name: string) => {
    if (!name) return '#';
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // Special chars ko dash banao
        .replace(/-+/g, '-')         // 🔥 NAYA: Agar 2 ya 3 dashes sath aa gaye hain, toh unhe 1 dash bana do
        .replace(/^-+|-+$/g, '');    // Start/End se dash hata do
};

  async function fetchJobDetails() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setAuthLoaded(true); // 👈 YEH LINE ADD KARO (Iska matlab hai Supabase ne bata diya hai ke user kon hai)
    
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, bio, skills, projects, experience')
            .eq('id', user.id)
            .maybeSingle();
            
        if (profile) setUserProfile(profile);
    }
    // 👇 URL se ID nikalo (slug ka last part)
    // Example: "senior-react-dev-692" -> "692"
    const slug = params.slug as string; 
    const jobId = slug ? slug.split('-').pop() : null; // Last wala hissa uthao

    if (jobId) {
        // 👇 Ab ID se search karo
        const { data } = await supabase.from('jobs').select('*').eq('id', jobId).single();
        
        // 🔒 SECURITY CHECK: Agar job Approved nahi hai, to load mat karo
        if (data && data.approved === false) {
            setJob(null); // Job ko null hi rakho
            setLoading(false);
            return; // Yahan se wapis chale jao, neeche ka code run nahi hoga
        }
        
        // 👇 Purana "if (data)" block replace karo is naye block se:
        if (data) {
            setJob(data);

            // 🌟 EXACT MATCH: Company Data Fetch Logic
const companyNameForSearch = data.company || 
    (!['reddit', 'hacker news', 'upwork'].some(s => data.source?.toLowerCase().includes(s)) ? data.source : null);

if (companyNameForSearch) {
    // Exact URL slug banayen using updated function
    const companySlug = getCompanySlug(companyNameForSearch);
    
    // 🔥 PUKKA HAL: Slug se bhi dhoondo, aur agar na mile toh direct Name se Case-Insensitive (ilike) search maro!
    const { data: companyInfo } = await supabase
        .from('companies')
        .select('*')
        .or(`slug.eq.${companySlug},name.ilike.%${companyNameForSearch}%`) // 👈 Yeh line badli hai!
        .maybeSingle(); 
        
    if (companyInfo) {
        setCompanyDetails(companyInfo);
    }
}
            // 🌟 UPGRADED: Related Jobs Fetch with Companies Table Logos
            const { data: related } = await supabase
                .from('jobs')
                .select('id, title, company, source, location, salary_range, date_posted, category, company_logo_url')
                .eq('category', data.category) 
                .neq('id', data.id)            
                .eq('approved', true)          
                .order('date_posted', { ascending: false })
                .limit(3);                     
            
            if (related && related.length > 0) {
                // 1. In jobs ke slugs nikalo taake companies table mein dhoond sakein
                const slugsToFind = related.map(rJob => getCompanySlug(rJob.company || rJob.source || '')).filter(Boolean);
                
                // 2. Companies table se inke logos mangwao
                const { data: companiesData } = await supabase
                    .from('companies')
                    .select('slug, logo_url')
                    .in('slug', slugsToFind);
                    
                // 3. Ek Map bana lo taake fast lookup ho
                const logoMap: Record<string, string> = {};
                if (companiesData) {
                    companiesData.forEach(c => { if (c.logo_url) logoMap[c.slug] = c.logo_url; });
                }
                
                // 4. Jobs ke andar unka final logo attach kardo
                const relatedWithLogos = related.map(rJob => ({
                    ...rJob,
                    final_logo: rJob.company_logo_url || logoMap[getCompanySlug(rJob.company || rJob.source || '')] || null
                }));
                
                setRelatedJobs(relatedWithLogos);
            }

            // Saved check (Waisa hi rahega)
            if (user) {
                const { data: savedJob } = await supabase.from('saved_jobs').select('*').match({ user_id: user.id, job_id: data.id }).single();
                if (savedJob) setSaved(true);
            }
            
        }
        if (data) {
        setJob(data);
        if (data.application_count) {
            setApplyCount(data.application_count);
        }
        }
    } // FIX: Closing brace for if (jobId)
  } // FIX: Closing brace for fetchJobDetails function

  function getRelativeTime(dateString: string) {
    const jobDate = new Date(dateString);
    const now = new Date();
    const diffHrs = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  }

  const toggleSave = async () => {
    if (!user) { router.push('/login'); return; }
    if (saved) {
        await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: job.id });
        setSaved(false);
    } else {
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: job.id });
        setSaved(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company || 'Remote'}`,
      url: window.location.href,
    };
    // Agar browser support karta hai (mostly mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    } else {
      // Desktop Fallback: Copy to clipboard with a better UI logic
      navigator.clipboard.writeText(window.location.href);
      // Yahan alert ki jagah tum koi Toast use kar sakte ho
      alert("✨ Link copied! Share it with your friends.");
    }
  };
  const ApplicantStatus = ({ count }: { count: number }) => {
  if (count === 0) {
    return (
      <div className="mt-2 flex items-center justify-center md:justify-end gap-2 text-xs font-medium text-slate-500 dark:text-slate-300 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
        Be the first applicant! 🚀
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center justify-center md:justify-end gap-3 animate-in fade-in slide-in-from-top-1">
      {/* Avatar Stack */}
      <div className="flex -space-x-2 overflow-hidden">
        {[...Array(Math.min(count, 3))].map((_, i) => (
          <img 
            key={i}
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#111625]"
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${count + i}`} 
            alt="applicant"
          />
        ))}
        {count > 3 && (
          <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#111625] bg-slate-100 dark:bg-slate-700 text-[9px] font-bold text-slate-500 dark:text-slate-300">
            +{count > 99 ? '99' : count - 3}
          </div>
        )}
      </div>

      {/* Text - Added dark:text-slate-300 for visibility */}
      <div className="text-xs text-slate-600 dark:text-slate-300">
        <span className="font-bold text-slate-900 dark:text-white">{count} people</span> applied
      </div>
    </div>
  );
};
const handleApply = async () => {
    // 🚀 SMART APPLY LOGIC
  
    // --- 1. USER CHECK (Logic: Agar login hai to duplicate roko) ---
    if (user) {
        // Database se pucho: "Kya is user ne is job id par pehle apply kiya?"
        const { data: existingApplication } = await supabase
            .from('application_history')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', job.id)
            .single();

        // Agar Entry mil gayi, to yahi se wapis bhag jao!
        // Na counter badhega, na history duplicate hogi.
        if (existingApplication) {
            console.log("Already applied! Skipping counter increment.");
            return; 
        }
    }

    // --- 2. COUNT INCREMENT (Ye ab sirf tab chalega agar User naya hai ya Guest hai) ---
    
    // UI Update (Foran number badha do)
    setApplyCount((prev: number) => prev + 1);

    // Database Counter Update
    const { error: countError } = await supabase
      .rpc('increment_job_applications', { job_id_input: job.id.toString() });

    if (countError) console.error("Counter Error:", countError);

    // --- 3. HISTORY SAVE (Sirf Logged-in Users ke liye) ---
    if (user) {
        await supabase.from('application_history').insert({
            user_id: user.id,
            job_id: job.id,
            job_title: job.title,
            // Source Logic wahi purani wali
            company_name: job.company || companyDetails?.name || job.source || 'Unknown Company'
        });
        console.log("User History Saved!");
    }
  };
  const handleCheckAndApply = (e: any) => {
    e.preventDefault(); 

    const jobDate = new Date(job.date_posted);
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
  // 🟢 NAYA: job.active ko false check kar rahe hain
  if (diffDays > 60 || job.active === false) return;

    // 🟢 NEW LOGIC: GUEST BYPASS
    // Agar User login nahi hai -> To Geo-Check mat karo, seedha jane do.
    if (!user) {
        proceedToApply();
        return; 
    }

    // --- 🌍 GEO LOGIC START (Sirf Logged-in Users ke liye) ---
    
    // Sab kuch lowercase mein convert karo
    const jobLoc = job.location ? job.location.toLowerCase().trim() : "";
    const userLoc = userCountry ? userCountry.toLowerCase().trim() : "";

    // CASE 1: Direct Country Match
    if (userLoc && jobLoc.includes(userLoc)) {
        proceedToApply();
        return;
    }

    // CASE 2: Truly Global Keywords
    const globalKeywords = ["worldwide", "global", "anywhere", "distributed", "everywhere"];
    const isTrulyGlobal = globalKeywords.some(w => jobLoc.includes(w));

    // CASE 3: Pure "Remote"
    const isPureRemote = jobLoc === "remote" || jobLoc === "remote only";

    // 🛑 DECISION TIME
    if (isTrulyGlobal || isPureRemote || !userCountry || userCountry === "Unknown") {
       proceedToApply();
    } else {
       // Match Fail hua -> Popup dikhao
       console.log("⚠️ Geo Mismatch detected for Logged-in User!");
       setShowGeoWarning(true); 
    }
  };
  // Asli Apply Function (Jo link kholega aur Count badhayega)
  const proceedToApply = () => {
     // 🟢 NAYA: Button dabte hi isko 'Applied' mark kar do
     const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
     if (!applied.includes(job.id)) {
         localStorage.setItem('appliedJobs', JSON.stringify([...applied, job.id]));
     }

     handleApply(); // Database count badhao
     // Link open karo
     const link = job.link.includes('@') && !job.link.startsWith('mailto:') ? `mailto:${job.link}` : job.link;
     window.open(link, job.link.includes('@') ? '_self' : '_blank');
     setShowGeoWarning(false); // Popup band
  };
  // --- 🔥 SMART RENDERERS ---

  const getSourceStyle = (source: string) => {
      const s = source?.toLowerCase() || "";
      if (s.includes('reddit')) return { name: 'Reddit', color: 'bg-orange-100 text-orange-700', icon: <User size={14}/> };
      if (s.includes('hacker') || s.includes('yc')) return { name: 'Y Combinator', color: 'bg-orange-500 text-white', icon: <Globe size={14}/> };
      if (s.includes('upwork')) return { name: 'Upwork', color: 'bg-green-100 text-green-700', icon: <ShieldCheck size={14}/> };
      return { name: source, color: 'bg-indigo-100 text-indigo-700', icon: <Briefcase size={14}/> };
  };

  const getCleanHTML = (html: string) => {
    if (!html) return "No description provided.";
    
    // Agar DB mein encoded hai to usay wapis normal HTML banao
    return html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ');
  };

  const renderAuthorSection = () => {
      const source = job.source?.toLowerCase() || "";

      // CASE A: REDDIT
      if (source.includes('reddit') && job.author_id) {
          return (
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-orange-500 tracking-wider">Reddit Poster</h3>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-orange-600">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Username</p>
                        <a href={`https://www.reddit.com/user/${job.author_id}`} target="_blank" className="font-bold text-slate-900 dark:text-white hover:underline">
                            u/{job.author_id}
                        </a>
                    </div>
                </div>
            </div>
          );
      }

      // CASE B: HACKER NEWS
      if (source.includes('hacker') || source.includes('yc')) {
          return (
            <div className="bg-orange-50 dark:bg-[#ff6600]/10 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-orange-600 tracking-wider">Startup Details</h3>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-orange-600">
                        <Building size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Company Type</p>
                        <p className="font-bold text-slate-900 dark:text-white">YC Backed Startup 🚀</p>
                    </div>
                </div>
                {(job.company || companyDetails) && (
                <Link 
                    href={`/companies/${getCompanySlug(job.company || companyDetails?.name)}`}
                    className="flex items-center gap-2 group/company transition-all"
                >
                    {/* Agar Asli Logo hai to wo dikhao, nahi to Icon */}
                    {companyDetails?.logo_url ? (
                        <img 
                            src={companyDetails.logo_url} 
                            alt={companyDetails.name} 
                            className="w-8 h-8 object-contain rounded-md bg-white border border-slate-200 p-0.5"
                        />
                    ) : (
                        <Building size={18} className="text-indigo-500 group-hover/company:text-indigo-600"/> 
                    )}
                    
                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover/company:text-indigo-600 group-hover/company:underline">
                        {job.company || companyDetails?.name}
                    </span>
                    <ExternalLink size={12} className="opacity-0 group-hover/company:opacity-100 transition-opacity text-indigo-500"/>
                </Link>
            )}
            </div>
          );
      }

      // CASE C: UPWORK
      if (source.includes('upwork')) {
        return (
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-green-600 tracking-wider">Client Info</h3>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-green-600">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Verification Status</p>
                        <p className="font-bold text-slate-900 dark:text-white">Payment Verified ✅</p>
                    </div>
                </div>
            </div>
        );
      }

      // CASE D: DEFAULT
      if (job.contact_info && job.contact_info !== "Reddit DM" && job.contact_info !== "See Link") {
        return (
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <h3 className="font-bold mb-4 text-sm uppercase text-indigo-500 tracking-wider">Direct Contact</h3>
                <div className="flex items-center gap-3">
                    <Mail size={20} className="text-indigo-600"/>
                    <p className="font-bold text-slate-900 dark:text-white break-all">{job.contact_info}</p>
                </div>
            </div>
        );
      }

      return null; 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-500">Loading details...</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-500">Job not found.</div>;

  const jobDate = new Date(job.date_posted);
  const today = new Date();
  const diffDays = Math.ceil(Math.abs(today.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 🟢 NAYA: isExpired ab dono cheezein dekhega (Date OR Database Status)
  const isExpired = diffDays > 60 || job.active === false; 
  
  const sourceStyle = getSourceStyle(job.source);

  // 🟢 NEW SMART LOCATION ENGINE
  const smartLoc = getSmartLocationUI(job.location);

  return (
    <div className="min-h-screen pb-24 md:pb-0 bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />

      <div className="bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800 pb-12 pt-24 px-4">
        <div className="container mx-auto max-w-5xl">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition"><ArrowLeft size={16}/> Back to Jobs</Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="w-full md:w-auto">
                    {/* 🔥 UPDATED: Top Company Logo / Source Badge */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        
                        {/* 🔥 UPDATED: Top Company Logo / Source Badge */}
                        {['reddit', 'upwork', 'hacker', 'yc'].some(s => job.source?.toLowerCase().includes(s)) ? (
                            <span className={`px-3 py-1 text-[11px] md:text-xs font-bold uppercase rounded-full flex items-center gap-1.5 md:gap-2 ${sourceStyle.color}`}>
                                {sourceStyle.icon} {sourceStyle.name}
                            </span>
                        ) : companyDetails?.logo_url ? (
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center p-1.5 flex-shrink-0 transition-transform hover:scale-105">
                                <img src={companyDetails.logo_url} alt={companyDetails.name || job.company} className="w-full h-full object-contain" />
                            </div>
                        ) : null}
                        {/* 👆 Agar logo nahi hai aur normal job hai, toh humne top text ko gayab kar diya hai taake repetition na ho */}
                        
                        {job.category && (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase rounded-full">
                                {job.category}
                            </span>
                        )}
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Clock size={14}/> {getRelativeTime(job.date_posted)}
                        </span>
                        {/* 🛑 GEO-WARNING POPUP */}
      {showGeoWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#151B2B] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-red-100 dark:border-red-900/30 animate-in zoom-in-95 relative">
              
              <button onClick={() => setShowGeoWarning(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2">
                 <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-500">
                    <AlertTriangle size={32} />
                 </div>

                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Location Mismatch 🌍
                 </h3>

                 <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    You are in <strong>{userCountry}</strong>, but this job is in <strong>{job.location}</strong>. 
                    <br/> Employers often reject applications from outside their target region.
                 </p>

                 <div className="flex flex-col w-full gap-3">
                    <button 
                       onClick={() => setShowGeoWarning(false)}
                       className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                       Cancel & Find Local Jobs
                    </button>

                    <button 
                       onClick={proceedToApply} // 👈 Zabardasti apply karne ke liye
                       className="w-full py-3 text-red-500 hover:text-red-600 dark:text-red-400 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                       I understand, Apply Anyway <ExternalLink size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
                    </div>
                    {isExpired && (
  <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
       <Briefcase size={18} className="text-red-600 dark:text-red-400" />
    </div>
    <div>
      <strong className="font-bold block">Applications Closed</strong>
      <span className="text-sm opacity-90">This job is no longer accepting applications.</span>
    </div>
  </div>
)}     
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight break-words">{job.title}</h1>
                    
                    {/* 👇 CLEANED UP METADATA SECTION */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
                        
                        {/* 1. Company Link (Button Style) */}
                        {(job.company || companyDetails) && (
                            <Link 
                                href={`/companies/${getCompanySlug(job.company || companyDetails?.name)}`}
                                className="group flex items-center gap-1.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md px-3 py-1.5 rounded-lg transition-all text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm mr-1"
                            >
                                <Building size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                {job.company || companyDetails?.name}
                            </Link>
                        )}

                        {/* 2. Location (Soft Badges with Multi-Country & Flags) */}
                        {job.location && smartLoc.matched.map((locItem: any, index: number) => (
                            <div key={index} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
                                {/* Sirf pehle tag ke sath MapPin aayega */}
                                {index === 0 && (
                                    <MapPin size={14} className={job.location.toLowerCase().includes('remote') ? "text-emerald-500 flex-shrink-0" : "text-indigo-500 flex-shrink-0"}/> 
                                )}
                                
                                {/* 🇵🇰 Flag Logic */}
                                {locItem.isImage ? (
                                    <img 
                                        src={`https://flagcdn.com/w40/${locItem.code.toLowerCase()}.png`}
                                        alt={locItem.name}
                                        className="w-3.5 h-2.5 object-cover rounded-sm shadow-sm flex-shrink-0"
                                    />
                                ) : (
                                    <span className="text-[10px] leading-none">🌍</span>
                                )}
                                
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[100px] md:max-w-none">
                                    {locItem.name}
                                </span>
                            </div>
                        ))}

                        {/* 3. Job Type (Soft Badge) */}
                        {job.job_type && (
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
                                <Briefcase size={14} className="text-blue-500"/> 
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{job.job_type}</span>
                            </div>
                        )}

                        {/* 4. Salary (Smart Logic - Soft Badge) */}
                        {(() => {
                            const isHidden = !job.salary_range || job.salary_range === "N/A" || job.salary_range.toLowerCase() === "not disclosed";
                            return (
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${isHidden ? 'bg-slate-100 dark:bg-slate-800/80' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                    <DollarSign size={14} className={isHidden ? 'text-slate-400' : 'text-emerald-500'}/> 
                                    <span className={`text-xs font-bold ${isHidden ? 'text-slate-500' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                        {isHidden ? "Not Disclosed" : job.salary_range}
                                    </span>
                                </div>
                            );
                        })()}

                        {/* 5. Experience (Soft Badge) */}
                        {job.experience_level && (
                            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md">
                                <Star size={14} className="text-amber-500" /> 
                                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                    {job.experience_level}
                                </span>
                            </div>
                        )}

                    </div>
                </div>

                {/* --- ACTION BUTTONS ROW START --- */}
                {/* 🚀 FIX: Logged-in user ke liye mobile par yeh poora block hide kar diya taake whitespace na aaye */}
                <div className={`w-full md:w-auto gap-4 items-center md:items-start justify-between md:justify-end md:mt-0 ${user ? 'hidden md:flex' : 'flex mt-8'}`}>
                  
                  {/* 1. Share & Save Group (Desktop & Guest Mobile) */}
                  <div className="h-[54px] w-full md:w-auto flex items-center">
                    
                    {/* 👇 Yahan 'hidden md:flex' laga diya taake mobile pe gayab ho jaye aur future feature ke liye jagah khali rahe */}
                    <div className="hidden md:flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm h-fit">
                      <button onClick={toggleSave} className={`p-2.5 rounded-lg transition-all ${saved ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                          <Heart size={22} className={saved ? 'fill-current' : ''} />
                      </button>
                      
                      <div className="w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 my-2"></div>
                      <button onClick={handleShare} className="p-2.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all flex items-center gap-2">
                          <Share2 size={22} />
                      </button>
                    </div>
                   {authLoaded && !user && <MobileGuestAlert />}
                  </div>

                  {/* 2. Apply Button & Counter (Right Side on Mobile) */}
                  <div className="flex flex-col items-end justify-center w-auto">
                      
                      {/* 👇 Desktop Apply Button (Mobile pe hidden hai) */}
                      <div className="hidden md:flex flex-col items-end gap-2.5">
                          <button 
                            onClick={handleCheckAndApply} 
                            disabled={isExpired}
                            className={`w-fit md:w-auto px-6 h-[54px] font-bold rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] flex items-center justify-center gap-2 transition-all whitespace-nowrap
                              ${isExpired 
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700 shadow-none" 
                                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] active:scale-[0.98]"
                              }`}
                          >
                            <span>{isExpired ? "Applications Closed" : (job.link.includes('@') ? "Apply via Email" : "Apply Now")}</span>
                            {!isExpired && (job.link.includes('@') ? <Mail size={18} /> : <ExternalLink size={18} />)} 
                          </button>

                          {/* 🚀 UPGRADED BOUNCE RATE KILLER (Desktop) */}
                          {isExpired && relatedJobs.length > 0 ? (
                              <button 
                                  onClick={(e) => {
                                      e.preventDefault();
                                      document.getElementById('similar-jobs')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="group flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-500/30 transition-all animate-in fade-in slide-in-from-top-1 cursor-pointer"
                              >
                                  View Active {job.category} Jobs 
                                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                              </button>
                          ) : (
                              /* 👇 Counter sirf tab dikhega agar job active hai */
                              <div className="mt-0 md:mt-1">
                                 <ApplicantStatus count={applyCount} />
                              </div>
                          )}
                      </div>
                  </div>

                </div>
                {/* --- ACTION BUTTONS ROW END --- */}
            </div>
        </div>
      </div> 
      <div className="container mx-auto max-w-5xl px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-[#111625] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            {/* 👇 Description Heading */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="text-indigo-500"/> Job Description
            </h2>

            {/* 🚀 AI SKILL-GAP ANALYZER (Smart Routing: Logged-in vs Guest) */}
            <div className="mb-8">
              {(() => {
                const rawJobSkills = job.skills || job.tags || []; 
                
                const filteredJobSkills = rawJobSkills.filter((tag: string) => {
                    const upperTag = tag.trim().toUpperCase();
                    if (upperTag === "IT") return true; 
                    const isCountry = !!COUNTRY_MAP[upperTag];
                    const isGenericWord = ["GLOBAL", "WORLDWIDE", "ANYWHERE", "REMOTE"].includes(upperTag);
                    return !isCountry && !isGenericWord; 
                });

                if (filteredJobSkills.length === 0) return null; // Agar koi skill hi nahi mili toh kuch mat dikhao

                // Agar User Profile hai (Logged In) toh exact Match Score dikhao
                if (userProfile) {
                  return (
                    <SkillGapAnalyzer 
                      jobSkills={filteredJobSkills} 
                      userSkills={userProfile.skills || []} 
                    />
                  );
                } 
                // Agar Guest hai (Logged Out) toh Upsell Banner dikhao
                else {
                  return (
                    <GuestSkillAnalyzer 
                      jobSkills={filteredJobSkills} 
                    />
                  );
                }
              })()}
            </div>

           {/* 👇 Original Description Text */}
            <div 
                className="job-content prose prose-slate dark:prose-invert max-w-none prose-a:text-indigo-600 prose-headings:text-slate-900 dark:prose-headings:text-white mt-8 prose-p:leading-loose prose-p:text-[15px] prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:mt-10 prose-headings:mb-4 prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-headings:font-black prose-li:my-1.5 prose-ul:list-disc prose-ul:pl-5"
                dangerouslySetInnerHTML={{ __html: getCleanHTML(job.description) }}
            />
        </div>
        <JobFeedback jobId={job.id} userId={user?.id} />
        <ReportJob jobId={job.id} />
                
                {/* 🌟 UPGRADED RELATED JOBS SECTION */}
                {relatedJobs.length > 0 && (
                  <div id="similar-jobs" className="mt-16 scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
                      <h3 className="text-xl md:text-2xl font-black mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                        <Briefcase size={24} className="text-indigo-500" /> Similar Opportunities
                      </h3>
                      
                      <div className="space-y-4">
                        {relatedJobs.map((rJob) => {
                           // 🟢 NAYA: Har related job ki location ko smart parser se guzaaro
                           const rSmartLoc = getSmartLocationUI(rJob.location || "");
                           
                           return (
                           <Link 
                              key={rJob.id} 
                              href={`/jobs/${createSlug(rJob.title, rJob.id)}`}
                              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                           >
                              {/* 🏢 Company Logo Wrapper */}
                              <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-2 flex-shrink-0 overflow-hidden shadow-sm">
                                  {rJob.final_logo ? (
                                      <img 
                                          src={rJob.final_logo} 
                                          alt={rJob.company || rJob.source} 
                                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                                      />
                                  ) : (
                                      <Building size={24} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                  )}
                              </div>

                              {/* 📝 Job Details */}
                              <div className="flex-1 min-w-0 w-full">
                                  <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                    {rJob.title}
                                  </h4>
                                  
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                      <span className="text-slate-700 dark:text-slate-200 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                          {rJob.company || rJob.source || "Company"}
                                      </span>
                                      
                                      {/* 🌍 🚀 NAYA: SMART LOCATION FLAGS IN CARD */}
                                      <div className="flex flex-wrap items-center gap-1.5">
                                          <MapPin size={14} className={(rJob.location || '').toLowerCase().includes('remote') ? "text-emerald-500" : "text-indigo-500"}/> 
                                          
                                          {rSmartLoc.matched.slice(0, 2).map((locItem: any, idx: number) => (
                                              <span key={idx} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
                                                  {locItem.isImage ? (
                                                      <img 
                                                          src={`https://flagcdn.com/w40/${locItem.code.toLowerCase()}.png`}
                                                          alt={locItem.name}
                                                          className="w-3.5 h-2.5 object-cover rounded-[2px] shadow-sm"
                                                      />
                                                  ) : (
                                                      <span className="text-[10px] leading-none">🌍</span>
                                                  )}
                                                  <span className="truncate max-w-[80px]">{locItem.name}</span>
                                              </span>
                                          ))}
                                          
                                          {/* Agar 2 se zyada countries hain to "+X More" dikhao */}
                                          {rSmartLoc.hasMore && rSmartLoc.totalCount > 2 && (
                                              <span className="text-[10px] font-bold text-indigo-500 ml-0.5">
                                                  +{rSmartLoc.totalCount - 2}
                                              </span>
                                          )}
                                      </div>
                                      
                                      <span className="flex items-center gap-1 text-xs ml-auto sm:ml-0">
                                          <Clock size={12} className="text-pink-500"/> 
                                          {getRelativeTime(rJob.date_posted)}
                                      </span>
                                  </div>
                              </div>

                              {/* ➡️ Action Arrow (Desktop Only) */}
                              <div className="hidden sm:flex p-3 bg-slate-50 dark:bg-slate-800/80 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                           </Link>
                           );
                        })}
                      </div>
                  </div>
                )}
            </div>

            {/* 🚀 THE FIX: lg:sticky aur lg:top-24 add kiya hai taake scroll karne par chipak jaye */}
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* SMART AUTHOR SECTION */}
            {renderAuthorSection()}
            
            {/* 🔥 DESKTOP GUEST ALERT BOX (Mobile par hide kiya) */}
            {authLoaded && !user && (
                <div className="hidden md:block">
                    <GuestJobAlert />
                </div>
            )}
            
            {/* 🏢 COMPANY PROFILE CARD (Updated) */}
                {(job.company || companyDetails) && (
                    <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 relative overflow-hidden">
                        
                        {/* Banner Background (Agar hai to) */}
                        {companyDetails?.banner_url && (
                            <div className="absolute top-0 left-0 w-full h-16 bg-slate-100">
                                <img src={companyDetails.banner_url} className="w-full h-full object-cover opacity-50" alt="banner" />
                            </div>
                        )}

                        <div className={`relative flex items-center gap-4 mb-4 ${companyDetails?.banner_url ? 'mt-8' : ''}`}>
                            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                {companyDetails?.logo_url ? (
                                    <img src={companyDetails.logo_url} alt="logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                    (job.company || "C").charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                                    {companyDetails?.name || job.company}
                                </h3>
                                <Link href={`/companies/${getCompanySlug(job.company || companyDetails?.name)}`} className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                    View Company Profile <ArrowRight size={12}/>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Description from DB or Generic */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                            {companyDetails?.description || `See all active remote openings and hiring details for ${job.company}.`}
                        </p>
                    </div>
                )}
                {/* 👇 VERIFY CARD (Ab Mobile aur Desktop dono par dikhega) */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-[#151b2d] dark:to-[#1e2433] border border-violet-100 dark:border-white/5 mb-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white dark:bg-white/5 rounded-lg shadow-sm text-violet-600 dark:text-violet-400 flex-shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                Is this company safe?
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                                Ask Hyrizon AI to scan {job.company || 'this company'} for potential red flags before you apply.
                            </p>
                            
                            {/* ✨ Hyrizon AI Verify Button */}
                            <VerifyMagicButton 
                                companyName={job.company || companyDetails?.name || job.source || "the company"} 
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold mb-4 text-sm uppercase text-slate-400 tracking-wider">Safety First</h3>
                    <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0"/> Never pay for a job application.</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0"/> Do not share sensitive bank info.</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0"/> Verify the client before starting work.</li>
                    </ul>
                </div>
            </div>
      </div>
      {/* 📱 STICKY MOBILE APPLY FOOTER (Sirf Mobile par dikhega) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
       <div className="flex items-center gap-3 max-w-md mx-auto">
          
          {/* 🔖 Save Button */}
          <button 
            onClick={toggleSave} 
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${saved ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-500' : 'bg-slate-100 dark:bg-[#1a2333] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            <Heart size={22} className={saved ? 'fill-current' : ''} />
          </button>

          {/* 📤 NEW: Share Button (Center mein) */}
          <button 
            onClick={handleShare} 
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#1a2333] text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all flex items-center justify-center active:scale-95"
          >
            <Share2 size={22} />
          </button>

          {/* 🚀 Main Apply Button & Bounce Killer (Mobile) */}
          <div className="flex-1 flex flex-col gap-2">
              <button 
                onClick={handleCheckAndApply} 
                disabled={isExpired}
                className={`w-full py-3.5 text-[15px] text-center font-extrabold rounded-xl transition-all flex justify-center items-center gap-2
                  ${isExpired 
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-none" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95"
                  }`}
              >
                {isExpired ? "Closed" : (job.link.includes('@') ? "Apply via Email" : "Apply Now")}
                {!isExpired && (job.link.includes('@') ? <Mail size={18} /> : <ExternalLink size={18} />)}
              </button>

              {/* 🚀 UPGRADED BOUNCE RATE KILLER (Mobile) */}
              {isExpired && relatedJobs.length > 0 && (
                  <button 
                      onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('similar-jobs')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 active:bg-indigo-100 dark:bg-indigo-500/10 dark:active:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-lg border border-indigo-100 dark:border-indigo-500/30 transition-all animate-in fade-in cursor-pointer"
                  >
                      View Similar Active Jobs <ArrowRight size={14} />
                  </button>
              )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
