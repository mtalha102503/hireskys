"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, Search, Clock, Globe, FileText, 
  Mail, Loader2, ChevronDown, ChevronRight, X, Link as LinkIcon, Save // 👈 Save add kiya
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

  // Jab candidate Modal open ho, uske purane notes load karlo
  useEffect(() => {
    if (selectedCandidate) {
      setNoteText(selectedCandidate.employer_notes || "");
    }
  }, [selectedCandidate]);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!candidate_id ( full_name, avatar_url, country ),
          jobs ( title )
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(applicationId: string, newStatus: string) {
    try {
      setCandidates(candidates.map(c => 
        c.id === applicationId ? { ...c, status: newStatus } : c
      ));

      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) {
        alert("Status update fail ho gaya: " + error.message);
        fetchApplications();
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  }
// 🟢 VIP JADOO: Save Private Note Function
  async function saveNote() {
    if (!selectedCandidate) return;
    setSavingNote(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ employer_notes: noteText })
        .eq('id', selectedCandidate.id);

      if (error) throw error;
      
      // Local state update taake modal band karke kholne par wapas aa jaye
      setCandidates(candidates.map(c => 
        c.id === selectedCandidate.id ? { ...c, employer_notes: noteText } : c
      ));
      setSelectedCandidate({ ...selectedCandidate, employer_notes: noteText });
      
    } catch (error: any) {
      alert("Note save fail ho gaya: " + error.message);
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
                    const candidateName = candidate.profiles?.full_name || 'Candidate Name';
                    const avatar = candidate.profiles?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';

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
                        {/* 🟢 NAYA JADOO: Hover Email Button */}
                        <a href={`mailto:dummy@email.com`} onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 transition-all">
                          <Mail size={14} />
                        </a>
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px]">
                        {candidate.jobs?.title || 'Applied Job'}
                      </p>
                    </div>
                  </div>
                          
                          <div className="flex flex-col items-end">
                             <span className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">Match</span>
                             <span className={`text-xs font-black px-1.5 py-0.5 rounded flex items-center gap-1 ${
                               candidate.ai_match_score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                               candidate.ai_match_score >= 70 ? 'bg-blue-100 text-blue-700' :
                               'bg-orange-100 text-orange-700'
                             }`}>
                               {candidate.ai_match_score || 0}%
                             </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-medium text-slate-500">
                          <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                            <Globe size={12} className="text-indigo-400" /> {candidate.profiles?.country || 'Remote'}
                          </span>
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
                  src={selectedCandidate.profiles?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'} 
                  alt="avatar" 
                  className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedCandidate.profiles?.full_name}
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
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Match Score</div>
                  <div className="text-lg font-black text-emerald-600">{selectedCandidate.ai_match_score || 0}%</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedCandidate.profiles?.country || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Timezone</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedCandidate.candidate_timezone || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(selectedCandidate.applied_at).toLocaleDateString()}</div>
                </div>
              </div>
               <div className="p-4 md:px-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a 
                href={`mailto:candidate@email.com`} 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors w-full sm:w-auto justify-center"
              >
                <Mail size={16} /> Contact Candidate
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
              {/* Cover Letter */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-indigo-500" /> Cover Letter
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedCandidate.cover_letter || 'No cover letter provided.'}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <LinkIcon size={18} className="text-indigo-500" /> Attachments & Links
                </h3>
                {selectedCandidate.resume_url && (
                  <a href={selectedCandidate.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">View Resume / CV</span>
                    <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
                {selectedCandidate.portfolio_link && (
                  <a href={selectedCandidate.portfolio_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Portfolio / GitHub</span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
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

    </div>
  );
}