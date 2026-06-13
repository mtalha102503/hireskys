"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { 
  Users, Search, Clock, Globe,Lock, FileText, 
  Mail, Loader2, ChevronDown,CheckCircle, AlertCircle, ChevronRight, X, Link as LinkIcon, Save,Phone, Linkedin, HelpCircle // 👈 Save add kiya
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
  
  // 🟢 NAYA JADOO: Selected Candidate for Modal
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  
  // 🟢 VIP JADOO: Private Notes State
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
// 🟢 Custom Notification State
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

      // Optimistic UI update
      setCandidates(candidates.map(c => 
        c.id === applicationId ? { ...c, status: newStatus } : c
      ));

      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) {
        showNotification(`Failed to update status: ${error.message}`, "error");
        fetchApplications(); // Revert UI if database fails
        return;
      }

      // 🚀 Trigger the email only if the new status is 'Interview' and it wasn't already in 'Interview'
      if (newStatus === 'Interview' && targetCandidate && targetCandidate.status !== 'Interview') {
        await sendInterviewInvite(targetCandidate);
      }

    } catch (error) {
      console.error("Update error:", error);
      showNotification("An unexpected error occurred.", "error");
    }
  }

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

      {/* 📌 Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full items-start">
          
          {COLUMNS.map((column) => (
            <div 
              key={column.id} 
              className="w-80 flex flex-col gap-4"
              onDragOver={(e) => e.preventDefault()} // 👈 Drop karne ki ijazat deta hai
              onDrop={(e) => {
                e.preventDefault();
                const draggedCandidateId = e.dataTransfer.getData("candidateId");
                if (draggedCandidateId) {
                  updateStatus(draggedCandidateId, column.id); // 👈 Asal Status Update!
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
                
                {/* 🟢 1. EMPTY STATE PEHLE AAYEGA */}
                {candidates.filter(c => c.status === column.id).length === 0 && (
                  <div className="flex flex-col items-center justify-center p-6 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl bg-slate-50/50 dark:bg-[#111625]/50">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Empty</p>
                  </div>
                )}

                {candidates
                  .filter(c => c.status === column.id)
                  .filter(c => selectedJob === "All" || c.jobs?.title === selectedJob) 
                  .filter(c => {
                    const name = c.profiles?.full_name || 'Unknown';
                    return name.toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .map((candidate) => {
                    const candidateName = candidate.full_name || candidate.profiles?.full_name || 'Anonymous Candidate';
                    
                    // Agar profile picture nahi hai, toh Name ke initials se pyari si picture ban jayegi
                    const avatar = candidate.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=random&color=fff`;

                    return (
                      <div 
                        key={candidate.id} 
                        draggable // 👈 Yeh tag card ko uthane ke qabil banata hai
                        onDragStart={(e) => {
                          e.dataTransfer.setData("candidateId", candidate.id); // 👈 Card apni ID sath le kar urey ga
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
                          
                         {/* 🟢 VIP JADOO: Locked Kanban Match Score */}
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
  <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
  <Globe size={12} className="text-indigo-400" /> {candidate.profiles?.country || 'Remote'}
</span>

  {/* 🟢 VIP JADOO: Webhook se aane wali Interview Date yahan show hogi */}
  {candidate.interview_date && candidate.status === 'Interview' && (
  <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded border border-purple-100 dark:border-purple-900/30 text-purple-700 dark:text-purple-400 font-black animate-pulse shadow-sm">
    <Clock size={12} className="text-purple-500" />
    {new Date(candidate.interview_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
  </span>
)}
</div>

                        {/* Status Dropdown - Click Event Propagation rokne ke liye onClick me stopPropagation lagaya */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
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
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>
          ))}

        </div>
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
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
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
                
                {/* Resume */}
                {selectedCandidate.resume_url && (
                  <a href={selectedCandidate.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group shadow-sm">
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2"><FileText size={16}/> View Resume / CV</span>
                    <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </a>
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