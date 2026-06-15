"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { 
  Users, Search, Clock, Globe,Lock, FileText, 
  Mail, Loader2, ChevronDown,CheckCircle, Bookmark,Star,LayoutGrid, List, CheckSquare,AlertCircle,Calendar, ChevronRight, X, Link as LinkIcon, Save,Phone, Linkedin, HelpCircle // 👈 Save add kiya
} from 'lucide-react';

const COLUMNS = [
  { id: 'New', title: 'New Applied', color: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 'Shortlisted', title: 'Shortlisted', color: 'border-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { id: 'Interview', title: 'Interviewing', color: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { id: 'Rejected', title: 'Rejected', color: 'border-slate-400', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
];

export default function CandidatesBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState("All");
  const [loading, setLoading] = useState(true);
  // 🟢 VIP JADOO: Enterprise Features States
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban'); // Toggle ke liye
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // Bulk actions ke liye
  const [visibleCount, setVisibleCount] = useState(30); // 👈 Load More (Pagination) ke liye taake browser hang na ho
  // 🟢 NAYA JADOO: Selected Candidate for Modal
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  // 🟢 NAYA JADOO: Manual Interview Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [savingDate, setSavingDate] = useState(false);
  // 👇 YAHAN YE NAYI STATE ADD KARO 👇
  const [showResume, setShowResume] = useState(false);
  // 🟢 VIP JADOO: Private Notes State
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
// 🟢 Custom Notification State
const [overallRating, setOverallRating] = useState(0);
  const [techRating, setTechRating] = useState(0);
  const [commRating, setCommRating] = useState(0);
  const [savingScorecard, setSavingScorecard] = useState(false);
// 🟢 VIP JADOO: Master Filter Dropdown State
  // 🟢 VIP JADOO: Master Filter Dropdown State (Pooled add kiya)
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'rated' | 'scheduled' | 'unrated' | 'pooled'>('all');
  // Modal khulte hi purani ratings load karne ke liye useEffect ko update karo:
  useEffect(() => {
    if (selectedCandidate) {
      setNoteText(selectedCandidate.employer_notes || "");
      setOverallRating(selectedCandidate.overall_rating || 0);
      setTechRating(selectedCandidate.technical_rating || 0);
      setCommRating(selectedCandidate.communication_rating || 0);
    }
  }, [selectedCandidate]);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null);

  // Helper function to show notifications that auto-hide after 4 seconds
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };
  // Jab candidate Modal open ho, uske purane notes load karlo
  useEffect(() => {
    if (selectedCandidate) {
      setNoteText(selectedCandidate.employer_notes || "");
    }
  }, [selectedCandidate]);

  useEffect(() => {
    fetchApplications();
  }, []);

  // 🟢 NAYA STATE: Company Plan check karne ke liye
  const [company, setCompany] = useState<any>(null);

  async function fetchApplications() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // 🟢 NAYA VIP LOGIC: Workspace ID nikalo (Owner aur Team Member dono ke liye)
        const { workspaceId } = await getActiveWorkspaceId(session.user.id);

        const { data: compData } = await supabase
          .from('companies')
          .select('name, plan_tier')
          .eq('employer_id', workspaceId) // 👈 Yahan workspaceId lagaya
          .single();
        setCompany(compData);

        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            profiles!candidate_id ( full_name, avatar_url, country ),
            jobs!inner ( title, employer_id ) 
          `)
          .eq('jobs.employer_id', workspaceId) // 👈 Aur yahan bhi workspaceId lagaya!
          .order('applied_at', { ascending: false });

        if (error) throw error;
        setCandidates(data || []);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  }
// 🟢 VIP JADOO: Smart Country Flag Generator
// 🟢 VIP JADOO: Get Country Code for Universal Image Flags
const getCountryCode = (countryName: string) => {
  if (!countryName) return null; 
  const name = countryName.toLowerCase().trim();
  const codes: Record<string, string> = {
  // Your original list and variations
  'usa': 'us', 'united states': 'us', 'america': 'us', 'united states of america': 'us', 'us': 'us',
  'pakistan': 'pk', 'pk': 'pk',
  'india': 'in', 'in': 'in',
  'uk': 'gb', 'united kingdom': 'gb', 'england': 'gb', 'great britain': 'gb', 'gb': 'gb',
  'canada': 'ca', 'ca': 'ca',
  'australia': 'au', 'au': 'au',
  'uae': 'ae', 'united arab emirates': 'ae', 'dubai': 'ae', 'ae': 'ae',
  'germany': 'de', 'de': 'de', 'deutschland': 'de',
  'saudi arabia': 'sa', 'sa': 'sa', 'ksa': 'sa',
  'bangladesh': 'bd', 'bd': 'bd',

  // Complete World List (Alphabetical)
  'afghanistan': 'af', 'af': 'af',
  'albania': 'al', 'al': 'al',
  'algeria': 'dz', 'dz': 'dz',
  'andorra': 'ad', 'ad': 'ad',
  'angola': 'ao', 'ao': 'ao',
  'antigua and barbuda': 'ag', 'ag': 'ag',
  'argentina': 'ar', 'ar': 'ar',
  'armenia': 'am', 'am': 'am',
  'austria': 'at', 'at': 'at',
  'azerbaijan': 'az', 'az': 'az',
  'bahamas': 'bs', 'bs': 'bs',
  'bahrain': 'bh', 'bh': 'bh',
  'barbados': 'bb', 'bb': 'bb',
  'belarus': 'by', 'by': 'by',
  'belgium': 'be', 'be': 'be',
  'belize': 'bz', 'bz': 'bz',
  'benin': 'bj', 'bj': 'bj',
  'bhutan': 'bt', 'bt': 'bt',
  'bolivia': 'bo', 'bo': 'bo',
  'bosnia and herzegovina': 'ba', 'bosnia': 'ba', 'ba': 'ba',
  'botswana': 'bw', 'bw': 'bw',
  'brazil': 'br', 'br': 'br',
  'brunei': 'bn', 'bn': 'bn',
  'bulgaria': 'bg', 'bg': 'bg',
  'burkina faso': 'bf', 'bf': 'bf',
  'burundi': 'bi', 'bi': 'bi',
  'cabo verde': 'cv', 'cape verde': 'cv', 'cv': 'cv',
  'cambodia': 'kh', 'kh': 'kh',
  'cameroon': 'cm', 'cm': 'cm',
  'central african republic': 'cf', 'car': 'cf', 'cf': 'cf',
  'chad': 'td', 'td': 'td',
  'chile': 'cl', 'cl': 'cl',
  'china': 'cn', 'prc': 'cn', 'cn': 'cn',
  'colombia': 'co', 'co': 'co',
  'comoros': 'km', 'km': 'km',
  'congo': 'cg', 'cg': 'cg',
  'democratic republic of the congo': 'cd', 'drc': 'cd', 'cd': 'cd',
  'costa rica': 'cr', 'cr': 'cr',
  'croatia': 'hr', 'hr': 'hr',
  'cuba': 'cu', 'cu': 'cu',
  'cyprus': 'cy', 'cy': 'cy',
  'czechia': 'cz', 'czech republic': 'cz', 'cz': 'cz',
  'denmark': 'dk', 'dk': 'dk',
  'djibouti': 'dj', 'dj': 'dj',
  'dominica': 'dm', 'dm': 'dm',
  'dominican republic': 'do', 'do': 'do',
  'ecuador': 'ec', 'ec': 'ec',
  'egypt': 'eg', 'eg': 'eg',
  'el salvador': 'sv', 'sv': 'sv',
  'equatorial guinea': 'gq', 'gq': 'gq',
  'eritrea': 'er', 'er': 'er',
  'estonia': 'ee', 'ee': 'ee',
  'eswatini': 'sz', 'swaziland': 'sz', 'sz': 'sz',
  'ethiopia': 'et', 'et': 'et',
  'fiji': 'fj', 'fj': 'fj',
  'finland': 'fi', 'fi': 'fi',
  'france': 'fr', 'fr': 'fr',
  'gabon': 'ga', 'ga': 'ga',
  'gambia': 'gm', 'gm': 'gm',
  'georgia': 'ge', 'ge': 'ge',
  'ghana': 'gh', 'gh': 'gh',
  'greece': 'gr', 'gr': 'gr',
  'grenada': 'gd', 'gd': 'gd',
  'guatemala': 'gt', 'gt': 'gt',
  'guinea': 'gn', 'gn': 'gn',
  'guinea-bissau': 'gw', 'gw': 'gw',
  'guyana': 'gy', 'gy': 'gy',
  'haiti': 'ht', 'ht': 'ht',
  'honduras': 'hn', 'hn': 'hn',
  'hungary': 'hu', 'hu': 'hu',
  'iceland': 'is', 'is': 'is',
  'indonesia': 'id', 'id': 'id',
  'iran': 'ir', 'ir': 'ir',
  'iraq': 'iq', 'iq': 'iq',
  'ireland': 'ie', 'ie': 'ie',
  'israel': 'il', 'il': 'il',
  'italy': 'it', 'it': 'it',
  'jamaica': 'jm', 'jm': 'jm',
  'japan': 'jp', 'jp': 'jp',
  'jordan': 'jo', 'jo': 'jo',
  'kazakhstan': 'kz', 'kz': 'kz',
  'kenya': 'ke', 'ke': 'ke',
  'kiribati': 'ki', 'ki': 'ki',
  'north korea': 'kp', 'korea, north': 'kp', 'kp': 'kp',
  'south korea': 'kr', 'korea, south': 'kr', 'kr': 'kr',
  'kuwait': 'kw', 'kw': 'kw',
  'kyrgyzstan': 'kg', 'kg': 'kg',
  'laos': 'la', 'la': 'la',
  'latvia': 'lv', 'lv': 'lv',
  'lebanon': 'lb', 'lb': 'lb',
  'lesotho': 'ls', 'ls': 'ls',
  'liberia': 'lr', 'lr': 'lr',
  'libya': 'ly', 'ly': 'ly',
  'liechtenstein': 'li', 'li': 'li',
  'lithuania': 'lt', 'lt': 'lt',
  'luxembourg': 'lu', 'lu': 'lu',
  'madagascar': 'mg', 'mg': 'mg',
  'malawi': 'mw', 'mw': 'mw',
  'malaysia': 'my', 'my': 'my',
  'maldives': 'mv', 'mv': 'mv',
  'mali': 'ml', 'ml': 'ml',
  'malta': 'mt', 'mt': 'mt',
  'marshall islands': 'mh', 'mh': 'mh',
  'mauritania': 'mr', 'mr': 'mr',
  'mauritius': 'mu', 'mu': 'mu',
  'mexico': 'mx', 'mx': 'mx',
  'micronesia': 'fm', 'fm': 'fm',
  'moldova': 'md', 'md': 'md',
  'monaco': 'mc', 'mc': 'mc',
  'mongolia': 'mn', 'mn': 'mn',
  'montenegro': 'me', 'me': 'me',
  'morocco': 'ma', 'ma': 'ma',
  'mozambique': 'mz', 'mz': 'mz',
  'myanmar': 'mm', 'burma': 'mm', 'mm': 'mm',
  'namibia': 'na', 'na': 'na',
  'nauru': 'nr', 'nr': 'nr',
  'nepal': 'np', 'np': 'np',
  'netherlands': 'nl', 'holland': 'nl', 'nl': 'nl',
  'new zealand': 'nz', 'nz': 'nz',
  'nicaragua': 'ni', 'ni': 'ni',
  'niger': 'ne', 'ne': 'ne',
  'nigeria': 'ng', 'ng': 'ng',
  'north macedonia': 'mk', 'macedonia': 'mk', 'mk': 'mk',
  'norway': 'no', 'no': 'no',
  'oman': 'om', 'om': 'om',
  'palau': 'pw', 'pw': 'pw',
  'palestine': 'ps', 'palestinian territory': 'ps', 'ps': 'ps',
  'panama': 'pa', 'pa': 'pa',
  'papua new guinea': 'pg', 'pg': 'pg',
  'paraguay': 'py', 'py': 'py',
  'peru': 'pe', 'pe': 'pe',
  'philippines': 'ph', 'ph': 'ph',
  'poland': 'pl', 'pl': 'pl',
  'portugal': 'pt', 'pt': 'pt',
  'qatar': 'qa', 'qa': 'qa',
  'romania': 'ro', 'ro': 'ro',
  'russia': 'ru', 'russian federation': 'ru', 'ru': 'ru',
  'rwanda': 'rw', 'rw': 'rw',
  'saint kitts and nevis': 'kn', 'kn': 'kn',
  'saint lucia': 'lc', 'lc': 'lc',
  'saint vincent and the grenadines': 'vc', 'vc': 'vc',
  'samoa': 'ws', 'ws': 'ws',
  'san marino': 'sm', 'sm': 'sm',
  'sao tome and principe': 'st', 'st': 'st',
  'senegal': 'sn', 'sn': 'sn',
  'serbia': 'rs', 'rs': 'rs',
  'seychelles': 'sc', 'sc': 'sc',
  'sierra leone': 'sl', 'sl': 'sl',
  'singapore': 'sg', 'sg': 'sg',
  'slovakia': 'sk', 'sk': 'sk',
  'slovenia': 'si', 'si': 'si',
  'solomon islands': 'sb', 'sb': 'sb',
  'somalia': 'so', 'so': 'so',
  'south africa': 'za', 'za': 'za',
  'south sudan': 'ss', 'ss': 'ss',
  'spain': 'es', 'es': 'es',
  'sri lanka': 'lk', 'lk': 'lk',
  'sudan': 'sd', 'sd': 'sd',
  'suriname': 'sr', 'sr': 'sr',
  'sweden': 'se', 'se': 'se',
  'switzerland': 'ch', 'ch': 'ch',
  'syria': 'sy', 'sy': 'sy',
  'taiwan': 'tw', 'tw': 'tw',
  'tajikistan': 'tj', 'tj': 'tj',
  'tanzania': 'tz', 'tz': 'tz',
  'thailand': 'th', 'th': 'th',
  'timor-leste': 'tl', 'east timor': 'tl', 'tl': 'tl',
  'togo': 'tg', 'tg': 'tg',
  'tonga': 'to', 'to': 'to',
  'trinidad and tobago': 'tt', 'tt': 'tt',
  'tunisia': 'tn', 'tn': 'tn',
  'turkey': 'tr', 'turkiye': 'tr', 'tr': 'tr',
  'turkmenistan': 'tm', 'tm': 'tm',
  'tuvalu': 'tv', 'tv': 'tv',
  'uganda': 'ug', 'ug': 'ug',
  'ukraine': 'ua', 'ua': 'ua',
  'uruguay': 'uy', 'uy': 'uy',
  'uzbekistan': 'uz', 'uz': 'uz',
  'vanuatu': 'vu', 'vu': 'vu',
  'vatican city': 'va', 'holy see': 'va', 'va': 'va',
  'venezuela': 've', 've': 've',
  'vietnam': 'vn', 'vn': 'vn',
  'yemen': 'ye', 'ye': 'ye',
  'zambia': 'zm', 'zm': 'zm',
  'zimbabwe': 'zw', 'zw': 'zw'
};
  
  for (const key in codes) {
    if (name.includes(key)) return codes[key];
  }
  return null; 
};
  // 🟢 VIP LOGIC: Check karo ke kya user ke paas Scale ya us se bara plan hai?
  const hasScalePlan = ['Scale', 'Urgent', 'Bulk 5 Pack', 'Bulk 10 Pack'].includes(company?.plan_tier);

// Trigger the Email API
  async function sendInterviewInvite(candidateData: any) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // 🟢 Yahan bhi Workspace ID nikal lo
      const { workspaceId } = await getActiveWorkspaceId(session.user.id);

      const candidateName = candidateData.profiles?.full_name || candidateData.full_name || 'Candidate';
      const companyName = company?.name || 'Our Company'; 
      const jobTitle = candidateData.jobs?.title || 'the applied role';

      const response = await fetch('/api/email/interview-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateEmail: candidateData.email,
          candidateName: candidateName,
          companyName: companyName,
          jobTitle: jobTitle,
          employerId: workspaceId // 👈 Ab yahan workspaceId jayega
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === "NO_LINK_FOUND") {
           showNotification("Candidate moved to Interview, but no scheduling link was sent. Set up your link in Integrations.", "warning");
        } else {
           showNotification(data.error || "Failed to send interview email.", "error");
        }
      } else {
        showNotification(`Interview invitation successfully sent to ${candidateName}.`, "success");
      }
      
    } catch (error) {
      console.error("Email API trigger failed:", error);
      showNotification("An unexpected error occurred while sending the email.", "error");
    }
  }
  // Update Status in Database and Trigger Email if applicable
  async function updateStatus(applicationId: string, newStatus: string) {
    try {
      const targetCandidate = candidates.find(c => c.id === applicationId);

      // 1. Optimistic UI update (Screen par foran card move ho jayega)
      setCandidates(candidates.map(c => 
        c.id === applicationId ? { ...c, status: newStatus } : c
      ));

      // 2. 🟢 YAHAN NAYA LOGIC: Session aur Workspace ID nikalo
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { workspaceId } = await getActiveWorkspaceId(session.user.id);

      // 3. 🎯 NAYA JADOO: Client-side DB update ki jagah apni API call karo
      const res = await fetch('/api/applications/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: applicationId,
          newStatus: newStatus,
          employerId: workspaceId
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // 4. 🚀 Trigger the emails based on status
      if (newStatus === 'Interview' && targetCandidate && targetCandidate.status !== 'Interview') {
        await sendInterviewInvite(targetCandidate); // Interview wali mail yahan se jayegi
      } else if (newStatus === 'Rejected') {
        // Rejection wali mail hamari backend API ne automatically bhej di hai!
        showNotification(`Candidate moved to Rejected. Auto-email sent!`, "success");
      }

    } catch (error: any) {
      console.error("Update error:", error);
      showNotification(`Failed to update status: ${error.message}`, "error");
      fetchApplications(); // Revert UI if API fails
    }
  }
// 🟢 VIP JADOO: Bulk Status Update
  async function handleBulkUpdate(newStatus: string) {
    if (selectedIds.length === 0) return;
    
    try {
      // 1. Optimistic UI Update (Foran screen par change karo)
      setCandidates(candidates.map(c => 
        selectedIds.includes(c.id) ? { ...c, status: newStatus } : c
      ));

      // 2. Database mein bulk update karo (.in query use karke)
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .in('id', selectedIds);

      if (error) throw error;

      showNotification(`Successfully moved ${selectedIds.length} candidates to ${newStatus}`, "success");
      setSelectedIds([]); // Selection clear kardo

    } catch (error: any) {
      showNotification(`Bulk update failed: ${error.message}`, "error");
      fetchApplications(); // Revert UI
    }
  }
// 🟢 VIP JADOO: Add/Remove from Talent Pool
  async function toggleTalentPool(candidateId: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    
    // Optimistic UI update (Foran screen par change)
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, is_pooled: newStatus } : c
    ));
    
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, is_pooled: newStatus });
    }

    try {
      const { error } = await supabase
        .from('applications')
        .update({ is_pooled: newStatus })
        .eq('id', candidateId);

      if (error) throw error;
      showNotification(newStatus ? "Added to Talent Pool 📥" : "Removed from Talent Pool", "success");
    } catch (error: any) {
      showNotification(`Failed to update Talent Pool: ${error.message}`, "error");
      fetchApplications(); // Revert UI on failure
    }
  }
  // Checkbox select/deselect toggle
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  // Save Private Notes
  async function saveNote() {
    if (!selectedCandidate) return;
    setSavingNote(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ employer_notes: noteText })
        .eq('id', selectedCandidate.id);

      if (error) throw error;
      
      setCandidates(candidates.map(c => 
        c.id === selectedCandidate.id ? { ...c, employer_notes: noteText } : c
      ));
      setSelectedCandidate({ ...selectedCandidate, employer_notes: noteText });
      
      showNotification("Private notes saved successfully.", "success");
      
    } catch (error: any) {
      showNotification(`Failed to save notes: ${error.message}`, "error");
    } finally {
      setSavingNote(false);
    }
  }
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading Candidates Pipeline...</p>
      </div>
    );
  }
  // 🟢 VIP JADOO: Save Scorecard
  async function saveScorecardRatings() {
    if (!selectedCandidate) return;
    setSavingScorecard(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          overall_rating: overallRating,
          technical_rating: techRating,
          communication_rating: commRating
        })
        .eq('id', selectedCandidate.id);

      if (error) throw error;
      
      // Optimistic Update
      setCandidates(candidates.map(c => 
        c.id === selectedCandidate.id ? { 
          ...c, 
          overall_rating: overallRating, 
          technical_rating: techRating, 
          communication_rating: commRating 
        } : c
      ));
      setSelectedCandidate({ 
        ...selectedCandidate, 
        overall_rating: overallRating, 
        technical_rating: techRating, 
        communication_rating: commRating 
      });
      
      showNotification("Interview Scorecard saved!", "success");
    } catch (error: any) {
      showNotification(`Failed to save scorecard: ${error.message}`, "error");
    } finally {
      setSavingScorecard(false);
    }
  }

  // 🟢 Helper Component for Star Rating (UI ke liye)
  const StarRating = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0B0F19] rounded-xl border border-slate-100 dark:border-slate-800">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            onClick={() => onChange(star)}
            className={`p-1 transition-all hover:scale-110 focus:outline-none ${value >= star ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
          >
            <Star size={18} fill={value >= star ? 'currentColor' : 'none'} strokeWidth={value >= star ? 0 : 2} />
          </button>
        ))}
      </div>
    </div>
  );
// 🟢 VIP JADOO: Save Manual Interview Date
  async function saveInterviewDate() {
    if (!selectedCandidate || !selectedDate) return;
    setSavingDate(true);
    
    try {
      // 1. Supabase mein date update karo
      const { error } = await supabase
        .from('applications')
        .update({ interview_date: new Date(selectedDate).toISOString() })
        .eq('id', selectedCandidate.id);

      if (error) throw error;
      
      // 2. Optimistic UI update taake card par foran show ho jaye
      setCandidates(candidates.map(c => 
        c.id === selectedCandidate.id ? { ...c, interview_date: new Date(selectedDate).toISOString() } : c
      ));
      setSelectedCandidate({ ...selectedCandidate, interview_date: new Date(selectedDate).toISOString() });
      
      showNotification("Interview date saved successfully!", "success");
      setShowDatePicker(false);
      
    } catch (error: any) {
      showNotification(`Failed to save date: ${error.message}`, "error");
    } finally {
      setSavingDate(false);
    }
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col relative">
      
      {/* 📌 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="text-indigo-500" size={28} />
            Candidates Pipeline
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          
          {/* 🟢 VIP JADOO: View Mode Toggle */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-[#0B0F19] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold ${viewMode === 'kanban' ? 'bg-white dark:bg-[#111625] text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold ${viewMode === 'list' ? 'bg-white dark:bg-[#111625] text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <List size={16} /> List
            </button>
          </div>

          <div className="relative hidden md:block">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="appearance-none bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-[200px] truncate shadow-sm transition-all"
            >
              <option value="All">All Jobs</option>
              {/* Yeh line automatically unique jobs nikalegi */}
              {Array.from(new Set(candidates.map(c => c.jobs?.title).filter(Boolean))).map(title => (
                <option key={title as string} value={title as string}>{title as string}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative hidden md:block">
            <select
              value={candidateFilter}
              onChange={(e) => setCandidateFilter(e.target.value as any)}
              className="appearance-none bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all min-w-[180px]"
            >
              <option value="all">👥 All Candidates</option>
              <option value="rated">🌟 Rated Only</option>
              <option value="scheduled">📅 Interview Scheduled</option>
              <option value="pooled">📥 Talent Pool (Saved)</option>
              <option value="unrated">☆ Unrated Only</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {/* Purana Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    {/* 🟢 VIP JADOO: BULK ACTION BAR (Sirf tab dikhegi jab koi select hoga) */}
      {selectedIds.length > 0 && (
        <div className="mb-4 bg-indigo-600 text-white p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-4 shadow-lg relative z-20">
          <div className="flex items-center gap-3 font-bold text-sm">
            <CheckSquare size={18} /> {selectedIds.length} Candidates Selected
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium opacity-80 mr-2 hidden sm:block">Move to:</span>
            
            {/* Status change karne wale buttons */}
            {COLUMNS.map(col => (
              <button 
                key={col.id} 
                onClick={() => handleBulkUpdate(col.id)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
              >
                {col.title}
              </button>
            ))}
            
            {/* Clear selection button */}
            <button 
              onClick={() => setSelectedIds([])} 
              className="ml-2 p-1.5 opacity-60 hover:opacity-100 bg-black/10 hover:bg-black/20 rounded-lg transition-all"
              title="Clear Selection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {/* 📌 Kanban Board Container */}
      {/* 📌 MAIN VIEWS (Board ya List) */}
      <div className="flex-1 overflow-x-auto pb-4">
        {viewMode === 'kanban' ? (
          /* ================================== */
          /* 🟢 KANBAN BOARD VIEW               */
          /* ================================== */
          <div className="flex gap-6 min-w-max h-full items-start">
            {COLUMNS.map((column) => (
              <div 
                key={column.id} 
                className="w-80 flex flex-col gap-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedCandidateId = e.dataTransfer.getData("candidateId");
                  if (draggedCandidateId) {
                    updateStatus(draggedCandidateId, column.id);
                  }
                }}
              >
                <div className={`flex items-center justify-between p-3 rounded-xl border-t-2 ${column.color} bg-white dark:bg-[#111625] shadow-sm`}>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{column.title}</h3>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${column.bg}`}>
                    {candidates.filter(c => c.status === column.id).length}
                    
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[200px]">
                  {/* 🟢 EMPTY STATE */}
                  {candidates.filter(c => c.status === column.id).length === 0 && (
                    <div className="flex flex-col items-center justify-center p-6 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl bg-slate-50/50 dark:bg-[#111625]/50">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Empty</p>
                    </div>
                    
                  )}

                  {/* 🟢 CANDIDATE CARDS */}
                  {candidates
                    .filter(c => c.status === column.id)
                    .filter(c => selectedJob === "All" || c.jobs?.title === selectedJob) 
                    .filter(c => {
                      const name = c.profiles?.full_name || 'Unknown';
                      return name.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    // 🟢 VIP JADOO: Master Dropdown Filtering Logic (Kanban)
                    .filter(c => {
                      if (candidateFilter === 'pooled') return c.is_pooled === true;
                      if (candidateFilter === 'rated') return (c.overall_rating || 0) > 0;
                      if (candidateFilter === 'scheduled') return !!c.interview_date; // Jinki date set hai
                      if (candidateFilter === 'unrated') return !(c.overall_rating && c.overall_rating > 0);
                      return true; // 'all' ke liye sab dikhenge
                    })
                    // VIP JADOO: Sort by AI Match Score (Highest first)
                    .sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0))
                    .map((candidate) => {
                      const candidateName = candidate.full_name || candidate.profiles?.full_name || 'Anonymous Candidate';
                      const avatar = candidate.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=random&color=fff`;

                      return (
                        <div 
                          key={candidate.id} 
                          draggable 
                          onDragStart={(e) => {
                            e.dataTransfer.setData("candidateId", candidate.id); 
                          }}
                          onClick={() => setSelectedCandidate(candidate)}
                          className="bg-white dark:bg-[#111625] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all group cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between mb-3 relative">
                            <div className="flex items-center gap-3">
                              <img src={avatar} alt={candidateName} className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover bg-slate-100" />
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                  {candidateName}
                                  <a href={`mailto:${candidate.email || 'no-email@example.com'}`} onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 transition-all">
                                    <Mail size={14} />
                                  </a>
                                </h4>
                                <p className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px]">
                                  {candidate.jobs?.title || 'Applied Job'}
                                </p>
                              </div>
                            </div>
                            
                            {/* Locked Kanban Match Score */}
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">AI Match</span>
                              {hasScalePlan ? (
                                <span className={`text-xs font-black px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                  candidate.ai_match_score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                                  candidate.ai_match_score >= 70 ? 'bg-blue-100 text-blue-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {candidate.ai_match_score || 0}%
                                </span>
                              ) : (
                                <Link 
                                  href="/employer/billing" 
                                  title="Upgrade to Scale to unlock AI Match"
                                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center gap-1 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 transition-colors border border-slate-200 dark:border-slate-700"
                                >
                                  <Lock size={10} /> Hidden
                                </Link>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-medium text-slate-500">
                            
                            {/* 📍 🟢 VIP JADOO: Location with Universal Image Flag */}
                            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                              {getCountryCode(candidate.country || candidate.profiles?.country || '') ? (
                                <img 
                                  src={`https://flagcdn.com/w20/${getCountryCode(candidate.country || candidate.profiles?.country || '')}.png`} 
                                  alt="flag" 
                                  className="w-4 h-auto rounded-[2px] shadow-sm object-cover"
                                />
                              ) : (
                                <Globe size={12} className="text-indigo-400" />
                              )}
                              <span className="truncate max-w-[80px]">
                                {candidate.country || candidate.profiles?.country || 'Remote'}
                              </span>
                            </span>

                            {/* ⭐ VIP JADOO: Prominent Star Rating Badge */}
                            {candidate.overall_rating > 0 && (
                              <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded border border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 font-black shadow-sm group-hover:scale-105 transition-transform cursor-help" title={`Tech: ${candidate.technical_rating || 0}/5 | Comm: ${candidate.communication_rating || 0}/5`}>
                                <Star size={12} fill="currentColor" /> {candidate.overall_rating}/5
                              </span>
                            )}

                            {/* 📅 Smart Interview Date Badge / Button */}
                            {candidate.status === 'Interview' && (
                              candidate.interview_date ? (
                                <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded border border-purple-100 dark:border-purple-900/30 text-purple-700 dark:text-purple-400 font-black shadow-sm">
                                  <Clock size={12} className="text-purple-500" />
                                  {new Date(candidate.interview_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    setSelectedCandidate(candidate); 
                                    setShowDatePicker(true); 
                                  }}
                                  className="flex items-center gap-1 bg-white dark:bg-[#111625] px-2 py-1 rounded border border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all shadow-sm hover:border-purple-500 hover:-translate-y-0.5"
                                >
                                  <Calendar size={12} className="text-purple-500" />
                                  Set Interview Date
                                </button>
                              )
                            )}
                          </div>

                          {/* 📥 Status Dropdown & Pooled Tag (New Layout) */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                              <select 
                                value={candidate.status}
                                onChange={(e) => updateStatus(candidate.id, e.target.value)}
                                className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 py-1.5 pl-2 pr-6 rounded focus:outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                {COLUMNS.map(col => (
                                  <option key={col.id} value={col.id}>{col.title}</option>
                                ))}
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* 🟢 VIP JADOO: Pooled Badge exactly on the right side */}
                            {candidate.is_pooled && (
                              <span className="flex items-center gap-1 bg-fuchsia-50 dark:bg-fuchsia-500/10 px-2.5 py-1.5 rounded border border-fuchsia-200 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black shadow-sm uppercase tracking-wider" title="Saved in Talent Pool">
                                <Bookmark size={12} fill="currentColor" /> Pooled
                              </span>
                            )}
                          </div>

                         
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

        ) : (
          /* ================================== */
          /* 🟢 LIST VIEW (ENTERPRISE TABLE)    */
          /* ================================== */
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-w-[800px] animate-in fade-in duration-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-black text-slate-500 tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="cursor-pointer appearance-none w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                      onChange={(e) => {
                        const filtered = candidates.filter(c => selectedJob === "All" || c.jobs?.title === selectedJob);
                        if (e.target.checked) setSelectedIds(filtered.slice(0, visibleCount).map(c => c.id));
                        else setSelectedIds([]);
                      }}
                      checked={selectedIds.length > 0}
                    />
                  </th>
                  <th className="p-4">Candidate Info</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Match Score</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {candidates
                  .filter(c => selectedJob === "All" || c.jobs?.title === selectedJob)
                  .filter(c => {
                    const name = c.profiles?.full_name || 'Unknown';
                    return name.toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .filter(c => {
                    if (candidateFilter === 'pooled') return c.is_pooled === true;
                    if (candidateFilter === 'rated') return (c.overall_rating || 0) > 0;
                    if (candidateFilter === 'scheduled') return !!c.interview_date;
                    if (candidateFilter === 'unrated') return !(c.overall_rating && c.overall_rating > 0);
                    return true;
                  })
                  .sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0))
                  .slice(0, visibleCount)
                  .map(candidate => {
                    const candidateName = candidate.full_name || candidate.profiles?.full_name || 'Anonymous Candidate';
                    const avatar = candidate.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=random&color=fff`;

                    return (
                      <tr 
                        key={candidate.id} 
                        onClick={() => setSelectedCandidate(candidate)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      >
                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(candidate.id)}
                            onChange={() => toggleSelection(candidate.id)}
                            className="cursor-pointer appearance-none w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                          />
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <img src={avatar} alt={candidateName} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">
                                {candidateName}
                              </p>
                              {/* 📥 VIP JADOO: Pooled Indicator in Table */}
                              {candidate.is_pooled && (
                                <span title="Saved in Talent Pool" className="inline-flex">
  <Bookmark size={12} className="text-fuchsia-500" fill="currentColor" />
</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                              <span className="truncate max-w-[120px]">{candidate.jobs?.title || 'Applied Job'}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                              {/* 📍 VIP JADOO: Flag in Table */}
                              <span className="flex items-center gap-1">
                                {getCountryCode(candidate.country || candidate.profiles?.country || '') ? (
                                  <img 
                                    src={`https://flagcdn.com/w20/${getCountryCode(candidate.country || candidate.profiles?.country || '')}.png`} 
                                    alt="flag" 
                                    className="w-3.5 h-auto rounded-[1px] shadow-sm object-cover"
                                  />
                                ) : (
                                  <Globe size={10} className="text-indigo-400" />
                                )}
                                {candidate.country || candidate.profiles?.country || 'Remote'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {new Date(candidate.applied_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4">
                          {hasScalePlan ? (
                            <span className={`text-[11px] font-black px-2 py-1 rounded-md ${candidate.ai_match_score >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'}`}>
                              {candidate.ai_match_score || 0}%
                            </span>
                          ) : (
                            <Link href="/employer/billing" title="Upgrade to unlock" className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center gap-1 w-max">
                              <Lock size={10} /> Hidden
                            </Link>
                          )}
                        </td>
                        <td className="p-4">
                          {candidate.overall_rating > 0 ? (
                            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                              <Star size={14} fill="currentColor" /> {candidate.overall_rating}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium italic">Unrated</span>
                          )}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={candidate.status}
                            onChange={(e) => updateStatus(candidate.id, e.target.value)}
                            className="appearance-none bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 py-1.5 px-3 rounded-lg cursor-pointer outline-none hover:border-indigo-400 transition-colors shadow-sm"
                          >
                            {COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* 🟢 VIP JADOO: Load More Button (Optimized Performance) */}
        {viewMode === 'list' && visibleCount < candidates.length && (
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => setVisibleCount(prev => prev + 30)}
              className="px-6 py-2.5 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              Load More Candidates
            </button>
          </div>
        )}
      </div>
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0B0F19] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <img 
                  // 🟢 VIP JADOO: Avatar Update
                  src={selectedCandidate.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.full_name || 'C')}&background=random&color=fff`} 
                  alt="avatar" 
                  className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {/* 🟢 VIP JADOO: Modal Name Update */}
                    {selectedCandidate.full_name || selectedCandidate.profiles?.full_name}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Applied for: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedCandidate.jobs?.title}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
              <button 
                    onClick={() => toggleTalentPool(selectedCandidate.id, selectedCandidate.is_pooled)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all border ${
                      selectedCandidate.is_pooled 
                      ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/50 hover:bg-fuchsia-100' 
                      : 'bg-white dark:bg-[#0B0F19] text-slate-500 hover:text-fuchsia-600 border-slate-200 dark:border-slate-700 hover:border-fuchsia-200'
                    }`}
                  >
                    <Bookmark size={16} fill={selectedCandidate.is_pooled ? 'currentColor' : 'none'} />
                    {selectedCandidate.is_pooled ? 'Saved in Pool' : 'Save for Later'}
                  </button>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* 🟢 VIP JADOO: Expanded Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Match Score */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Match Score</div>
                  {hasScalePlan ? (
                    <div className="text-lg font-black text-emerald-600">{selectedCandidate.ai_match_score || 0}%</div>
                  ) : (
                    <>
                      <div className="text-lg font-black text-slate-300 dark:text-slate-600 blur-[4px] select-none">95%</div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#0B0F19]/60 backdrop-blur-[2px]">
                        <Link href="/employer/billing" className="flex items-center gap-1.5 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-105">
                          <Lock size={12} /> Unlock
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Applied Date */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Applied Date</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(selectedCandidate.applied_at).toLocaleDateString()}</div>
                </div>

                {/* Phone Number */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone size={10}/> Phone / WhatsApp</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedCandidate.phone || 'N/A'}</div>
                </div>

                {/* Location (City & Country) */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Globe size={10}/> Location</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                    {selectedCandidate.city ? `${selectedCandidate.city}, ` : ''}{selectedCandidate.country || selectedCandidate.profiles?.country || 'N/A'}
                  </div>
                </div>

                {/* Legal Work Auth */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Work Auth</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {selectedCandidate.legal_authorization || 'N/A'}
                    {selectedCandidate.authorized_country && <span className="text-[10px] font-medium text-slate-500 block leading-tight">({selectedCandidate.authorized_country})</span>}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 md:px-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* 🟢 VIP JADOO: Real Email Display with Copy-friendly UI */}
                <a 
                  href={`mailto:${selectedCandidate.email}`} 
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#0B0F19] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all w-full sm:w-auto justify-center border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm"
                  title="Click to send email"
                >
                  <Mail size={16} className="text-indigo-500" /> 
                  {selectedCandidate.email || 'No Email Provided'}
                </a>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => { updateStatus(selectedCandidate.id, 'Rejected'); setSelectedCandidate(null); }}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-sm rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => { updateStatus(selectedCandidate.id, 'Interview'); setSelectedCandidate(null); }}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    Move to Interview
                  </button>
                </div>
              </div>
              {/* 🟢 VIP JADOO: Manual Interview Date Setter */}
              {selectedCandidate.status === 'Interview' && (
                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar size={18} className="text-purple-500" /> Interview Schedule
                      </h3>
                      {selectedCandidate.interview_date ? (
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                          Scheduled for: <strong className="text-purple-600 dark:text-purple-400">{new Date(selectedCandidate.interview_date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</strong>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 mt-1">No date set yet. When candidate books via Calendly, select the date here.</p>
                      )}
                    </div>
                    
                    {!showDatePicker && (
                      <button 
                        onClick={() => setShowDatePicker(true)}
                        className="px-4 py-2 bg-white dark:bg-[#111625] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors shadow-sm"
                      >
                        {selectedCandidate.interview_date ? 'Change Date' : 'Set Date'}
                      </button>
                    )}
                  </div>

                  {showDatePicker && (
                    <div className="mt-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                      <input 
                        type="datetime-local" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-500 text-slate-700 dark:text-slate-200"
                      />
                      <button 
                        onClick={saveInterviewDate}
                        disabled={savingDate || !selectedDate}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-md"
                      >
                        {savingDate ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save
                      </button>
                      <button 
                        onClick={() => setShowDatePicker(false)}
                        className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* 🟢 VIP JADOO: Screening Answers (Agar candidate ne diye hon) */}
              {selectedCandidate.screening_answers && Object.keys(selectedCandidate.screening_answers).length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <HelpCircle size={18} className="text-fuchsia-500" /> Screening Answers
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedCandidate.screening_answers).map(([question, answer], idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{question}</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{String(answer) || 'No answer provided.'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter (Agar mojood ho) */}
              {selectedCandidate.cover_letter && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-500" /> Cover Letter
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedCandidate.cover_letter}
                  </div>
                </div>
              )}

              {/* Links & Attachments */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <LinkIcon size={18} className="text-teal-500" /> Attachments & Links
                </h3>
                
                {/* Resume Button */}
  {selectedCandidate.resume_url && (
    <button 
      onClick={() => setShowResume(true)} 
      className="w-full flex items-center justify-between p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group shadow-sm"
    >
      <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2"><FileText size={16}/> View Resume / CV</span>
      <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
    </button>
  )}
                
                {/* LinkedIn */}
                {selectedCandidate.linkedin_url && (
                  <a href={selectedCandidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Linkedin size={16} className="text-blue-600"/> LinkedIn Profile</span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {/* Portfolio */}
                {selectedCandidate.portfolio_link && (
                  <a href={selectedCandidate.portfolio_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><LinkIcon size={16}/> Portfolio / Website</span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
{/* 🟢 VIP JADOO: Interview Scorecard Premium UI */}
              <div className="mt-8 bg-amber-50/50 dark:bg-[#111625] border border-amber-100 dark:border-slate-800 rounded-[1.5rem] p-5 md:p-6 shadow-sm">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-amber-100 dark:border-slate-800/60 pb-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Star size={20} className="text-amber-500" fill="currentColor" /> Interview Scorecard
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                      Rate the candidate's performance
                    </p>
                  </div>
                  
                  <button 
                    onClick={saveScorecardRatings}
                    disabled={savingScorecard}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white disabled:opacity-70 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {savingScorecard ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Scores
                  </button>
                </div>
                
                {/* 🚀 Changed to a sleek Vertical List for breathing room */}
                <div className="flex flex-col gap-3">
                  <div className="w-full p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors shadow-sm">
                    <StarRating label="Overall Rating" value={overallRating} onChange={setOverallRating} />
                  </div>
                  
                  <div className="w-full p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors shadow-sm">
                    <StarRating label="Technical Skills" value={techRating} onChange={setTechRating} />
                  </div>
                  
                  <div className="w-full p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors shadow-sm">
                    <StarRating label="Communication" value={commRating} onChange={setCommRating} />
                  </div>
                </div>
                
              </div>
              {/* Private Notes (This stays EXACTLY as it was) */}
              <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-rose-500" /> Private Notes 
                  <span className="text-[9px] font-bold bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-wider ml-2">Only visible to you</span>
                </h3>
                <div className="relative">
                  <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type your secret interview notes, salary expectations, etc. here..." 
                    className="w-full p-4 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-sm text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/50 min-h-[120px] custom-scrollbar"
                  ></textarea>
                  <div className="flex justify-end mt-3">
                    <button 
                      onClick={saveNote}
                      disabled={savingNote || noteText === selectedCandidate.employer_notes}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                      {savingNote ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {savingNote ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showResume && selectedCandidate?.resume_url && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0B0F19] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <FileText size={20} className="text-indigo-500" /> Resume: {selectedCandidate.full_name || selectedCandidate.profiles?.full_name}
              </h3>
              <div className="flex items-center gap-2">
                <a 
                  href={selectedCandidate.resume_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/50 hidden sm:block"
                >
                  Open in New Tab
                </a>
                <button 
                  onClick={() => setShowResume(false)} 
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Iframe Viewer */}
            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-800 relative">
              <iframe 
                src={`${selectedCandidate.resume_url}#view=FitH`} 
                className="w-full h-full border-none absolute inset-0"
                title="Resume Viewer"
              />
            </div>

          </div>
        </div>
      )}
{/* 🟢 Custom Notification Popup (Toast) */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border ${
            notification.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300' :
            notification.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300' :
            'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle size={20} className="text-emerald-500" />
            ) : notification.type === 'warning' ? (
              <AlertCircle size={20} className="text-amber-500" />
            ) : (
              <AlertCircle size={20} className="text-rose-500" />
            )}
            <p className="text-sm font-bold">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}