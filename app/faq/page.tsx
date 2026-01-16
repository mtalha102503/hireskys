"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  Search, ChevronDown, ChevronUp, HelpCircle, 
  DollarSign, ShieldCheck, User, Zap, Briefcase, Settings 
} from 'lucide-react';

// --- FAQ DATA (The "Complete" List) ---
// --- FAQ DATA (Updated for Remote/Freelance Focus) ---
const FAQ_DATA = [
  // 🟢 GENERAL / BASICS
  {
    category: "General",
    question: "What exactly is HireSkys?",
    answer: "HireSkys is an elite job radar system specifically for remote and freelance work. Unlike Upwork or Fiverr where you wait for clients, our AI scans the entire internet (LinkedIn, Job Boards, Company Career Pages) to find verified 100% remote roles and contract gigs. We send these directly to you so you can apply instantly."
  },
  {
    category: "General",
    question: "Is HireSkys free to use?",
    answer: "Yes! Creating a profile, taking skill assessments, and receiving standard remote job alerts via Email is 100% free. We are committed to helping talent find location-independent work without upfront barriers."
  },
  {
    category: "General",
    question: "How is this different from Upwork?",
    answer: "Upwork is a marketplace where you compete with 50+ people and pay for 'Connects'. HireSkys is an aggregator for direct-hire remote jobs. We find the listing, give you a pre-written AI proposal, and let you apply directly to the client. No middleman fees on your salary."
  },

  // 🛡️ VERIFICATION & BADGES
  {
    category: "Verification",
    question: "How do I get the Green Verified Badge? 🛡️",
    answer: "To earn the badge, go to your Profile and select a skill (e.g., React, SEO). Click 'Take Assessment'. You must score at least 9/10 to get the Green Badge. This badge boosts your visibility to clients looking for proven remote talent."
  },
  {
    category: "Verification",
    question: "What happens if I fail the test?",
    answer: "Don't worry! You can retake the assessment after 24 hours. We encourage you to brush up on your skills and try again."
  },
  {
    category: "Verification",
    question: "Can I fake my verification?",
    answer: "No. Our testing environment tracks browser activity and time limits. Any attempt to cheat will result in a permanent ban from the platform."
  },

  // 🚀 JOB ALERTS & WHATSAPP
  {
    category: "Job Alerts",
    question: "Why am I not receiving WhatsApp alerts?",
    answer: "Please check three things: 1) Did you enter your number with the correct Country Code (e.g., +92)? 2) Do you have verified skills that match current remote job openings? 3) Is our number blocked on your WhatsApp? If issues persist, contact Support."
  },
  {
    category: "Job Alerts",
    question: "How fast are the alerts?",
    answer: "Our 'Zero Latency' engine processes jobs in real-time. Typically, you will receive a WhatsApp notification within 2-5 minutes of a remote job being posted on the source website."
  },
  {
    category: "Job Alerts",
    question: "Can I filter which jobs I get?",
    answer: "Yes. The system only sends you jobs that match the Skills listed on your profile. If you want different types of remote work, update your skills section."
  },

  // 💰 PAYMENTS & HIRING
  {
    category: "Payments",
    question: "How do I get paid?",
    answer: "Since you apply directly to the client (off-platform) as a freelancer or remote employee, you negotiate your own payment terms. Most users use Wise, Payoneer, or direct Bank Transfer. HireSkys does not touch your money."
  },
  {
    category: "Payments",
    question: "Does HireSkys take a commission?",
    answer: "No. We take 0% commission from your earnings. You keep 100% of what you make from your remote contracts."
  },

  // ⚙️ TECHNICAL / ACCOUNT
  {
    category: "Account",
    question: "How do I change my WhatsApp number?",
    answer: "Go to your Profile settings. You can update your number there. Make sure to verify the new number to keep receiving alerts."
  },
  {
    category: "Account",
    question: "I forgot my password. What do I do?",
    answer: "On the Login page, click 'Forgot Password'. Enter your email, and we will send you a secure link to reset it."
  },
  {
    category: "Account",
    question: "How do I delete my account?",
    answer: "We'd be sad to see you go. You can request account deletion via the 'Help & Support' page. Your data will be wiped from our servers within 48 hours."
  }
];

// --- CATEGORIES LIST ---
const CATEGORIES = ["All", "General", "Verification", "Job Alerts", "Payments", "Account"];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredData = FAQ_DATA.filter((item) => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* --- HERO HEADER --- */}
      <div className="bg-[#111625] text-white pt-32 pb-16 px-4 text-center relative overflow-hidden">
          {/* Background FX */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Frequently Asked Questions</h1>
              <p className="text-lg text-slate-400">Everything you need to know about the platform.</p>
              
              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto mt-8">
                  <input 
                    type="text" 
                    placeholder="Search e.g. 'Payment', 'WhatsApp'..." 
                    className="w-full h-14 pl-12 pr-4 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-4 top-4 text-slate-400" size={24} />
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
          
          {/* --- TABS (Categories) --- */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
              {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        activeTab === cat 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' 
                        : 'bg-white dark:bg-[#151b2d] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>

          {/* --- ACCORDION LIST --- */}
          <div className="space-y-4">
              {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                      <div 
                        key={index} 
                        className={`bg-white dark:bg-[#151b2d] rounded-2xl border transition-all duration-300 overflow-hidden ${
                            openIndex === index 
                            ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                          <button 
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex justify-between items-center p-6 text-left"
                          >
                              <div className="flex items-center gap-4">
                                  {/* Dynamic Icon based on Category */}
                                  <div className={`p-2 rounded-lg shrink-0 ${openIndex === index ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                      {item.category === 'Verification' ? <ShieldCheck size={20}/> :
                                       item.category === 'Job Alerts' ? <Zap size={20}/> :
                                       item.category === 'Payments' ? <DollarSign size={20}/> :
                                       item.category === 'Account' ? <Settings size={20}/> :
                                       <HelpCircle size={20}/>}
                                  </div>
                                  <span className="font-bold text-lg text-slate-900 dark:text-white">{item.question}</span>
                              </div>
                              {openIndex === index ? <ChevronUp className="text-indigo-500"/> : <ChevronDown className="text-slate-400"/>}
                          </button>
                          
                          <div 
                            className={`px-6 md:pl-[5.5rem] text-slate-600 dark:text-slate-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                                openIndex === index ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                              {item.answer}
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="text-center py-20">
                      <p className="text-slate-500 text-lg">No questions found matching your search.</p>
                      <button onClick={() => setSearchQuery("")} className="text-indigo-600 font-bold mt-2 hover:underline">Clear Search</button>
                  </div>
              )}
          </div>

          {/* --- STILL STUCK? --- */}
          <div className="mt-20 p-8 md:p-12 bg-indigo-600 rounded-3xl text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
                  <p className="text-indigo-100 mb-8 max-w-xl mx-auto">Can't find the answer you're looking for? Our support team is here to help you.</p>
                  <Link href="/support" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1">
                      Contact Support <User size={20}/>
                  </Link>
              </div>
          </div>

      </div>
    </div>
  );
}