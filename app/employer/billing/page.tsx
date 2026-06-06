"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, Zap, CheckCircle2, Layers, Loader2, 
  PlusCircle, Star, Bot, X, TrendingUp, ArrowRight
} from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
declare global {
  interface Window {
    fastspring: any;
  }
}

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  // 🟢 NAYA STATE: Custom Popup ke liye
  const [popup, setPopup] = useState({ show: false, type: 'success', message: '' });
  // 🟢 NAYA STATE: Trial claim ki loading ke liye
  const [claimingTrial, setClaimingTrial] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    fetchCredits();
  }, []);

  async function fetchCredits() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('job_credits')
        .eq('employer_id', session.user.id)
        .single();

      if (error) throw error;
      if (data) setCredits(data.job_credits || 0);
      setUserId(session.user.id);
    } catch (error: any) {
      console.error("Error fetching credits:", error.message);
    } finally {
      setLoading(false);
    }
  }

 // 🟢 NAYA FUNCTION: Free Trial Claim Karne Ke Liye
  const handleFreeTrial = async () => {
    setClaimingTrial(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Please log in first");

      const { data: company, error: fetchError } = await supabase
        .from('companies')
        .select('job_credits, has_used_trial')
        .eq('employer_id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      if (company?.has_used_trial) {
        // 🔴 Pehla Alert Replaced
        setPopup({ show: true, type: 'error', message: "You have already claimed your free trial! Please purchase a plan to continue." });
        setClaimingTrial(false);
        return;
      }

      const newCredits = (company?.job_credits || 0) + 5;
      
      const { error: updateError } = await supabase
        .from('companies')
        .update({ 
          job_credits: newCredits,
          plan_tier: 'Free Trial',
          has_used_trial: true 
        })
        .eq('employer_id', session.user.id);

      if (updateError) throw updateError;

      // 🟢 Dusra Alert Replaced
      setPopup({ show: true, type: 'success', message: "🎉 5 Free Credits added to your account successfully!" });
      setCredits(newCredits); 

    } catch (error: any) {
      // 🔴 Teesra Alert Replaced
      setPopup({ show: true, type: 'error', message: "Error claiming trial: " + error.message });
    } finally {
      setClaimingTrial(false);
    }
  };

  const handleCheckout = async (productPath: string) => {
  setProcessingPlan(productPath);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("Please log in first");

    // Check agar FastSpring script abhi load nahi hui
    if (!window.fastspring) {
      alert("Payment system is loading. Please wait a second and try again.");
      setProcessingPlan(null);
      return;
    }

    // FastSpring ko batana hai ke konsa product cart mein dalna hai
    const payload = {
      'reset': true, // Pura cart pehle clear karega
      'products': [{ 'path': productPath, 'quantity': 1 }],
      'tags': {
        // Ye IDs webhook mein wapis aayengi credits update karne ke liye
        'employerId': session.user.id, 
        'employerEmail': session.user.email
      }
    };

    // Cart mein push karo aur popup open kar do
    window.fastspring.builder.push(payload);
    window.fastspring.builder.checkout();

  } catch (error: any) {
    alert("Error initiating checkout: " + error.message);
  } finally {
    // Loader hatane ke liye 1 second ka delay
    setTimeout(() => setProcessingPlan(null), 1000);
  }
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading billing details...</p>
      </div>
    );
  }

  return (
  <>
    {/* GUMROAD SCRIPT */}
    {/* Purani line ko is line se replace kar do */}
<Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />
    <div className="max-w-[1250px] mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
      
      {/* 📌 HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <CreditCard className="text-indigo-500" size={28} />
          Billing & Credits
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
          Manage your job posting credits and upgrade your hiring velocity.
        </p>
      </div>

      {/* 🟢 CURRENT BALANCE CARD */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-[#0B0F19] dark:to-indigo-950/30 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <Zap className="text-indigo-400 w-10 h-10" />
          </div>
          <div>
            <p className="text-indigo-200 font-bold text-sm uppercase tracking-wider mb-1">Available Credits</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-black text-white">{credits}</h2>
              <span className="text-indigo-300 font-medium">Job Posts</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          {credits > 0 ? (
            <Link href="/employer/jobs/create" className="w-full md:w-auto px-8 py-4 bg-white text-indigo-900 font-black rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2">
              <PlusCircle size={20} /> Post a Job Now
            </Link>
          ) : (
            <div className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium flex items-center gap-3 text-sm">
              <AlertOctagon size={18} /> You are out of credits. Please top up below.
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

      {/* 🟢 PRICING CARDS (Landing Page Style) */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
          Top Up Your Credits
        </h2>

        {/* 🟢 4 Columns layout kar diya (md:grid-cols-2 xl:grid-cols-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 items-start">
          
          {/* TIER 0: FREE TRIAL (NEW) */}
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden hover:-translate-y-2 group">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10 transition-colors duration-500">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Free Trial</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">
                Test our platform risk-free. Get 5 credits to start hiring immediately.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">$0</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" /> 
                  <span>5 Free Job Posts</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" /> 
                  <span>Basic Kanban Pipeline</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400 dark:text-slate-600 text-sm font-medium">
                  <X size={20} className="shrink-0 mt-0.5" /> 
                  <span>No Premium Features</span>
                </li>
              </ul>
              <button 
                onClick={handleFreeTrial}
                disabled={claimingTrial}
                className="block w-full py-4 text-center rounded-xl font-bold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 transition-all duration-300 disabled:opacity-70 flex justify-center items-center"
              >
                {claimingTrial ? <Loader2 className="animate-spin" size={20} /> : 'Claim 5 Credits'}
              </button>
            </div>
          </div>

          {/* TIER 1: STARTUP ($49) */}
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-2 group h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151b2e]/50 transition-colors duration-500">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Startup</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">
                The essentials for lean teams to manage candidates effectively.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">$49</span>
                <span className="text-slate-500 font-medium mb-1">/post</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Unlimited Kanban Pipeline</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Smart App Forms (Location Check)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Shareable Link for Socials</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400 dark:text-slate-600 text-sm font-medium">
                  <X size={20} className="shrink-0 mt-0.5" /> 
                  <span>No AI Automation Features</span>
                </li>
              </ul>
              <a 
                href={`https://hireskys.gumroad.com/l/startup-plan?url_params[employerId]=${userId}`} 
                data-gumroad-overlay-checkout="true"
                className="block w-full py-4 text-center rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all duration-300 flex justify-center items-center mt-auto cursor-pointer"
              >
                Buy Startup Credit
              </a>
            </div>
          </div>

          {/* TIER 2: SCALE ($79) - HIGHLIGHTED */}
          <div className="bg-indigo-600 dark:bg-[#1A1F36] rounded-[2rem] border-2 border-indigo-400 shadow-2xl flex flex-col hover:shadow-indigo-500/30 transition-all duration-500 overflow-hidden relative transform xl:-translate-y-4 xl:scale-105 z-10 h-full">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            
            <div className="p-8 border-b border-indigo-500/30 bg-indigo-700/30 dark:bg-indigo-900/40 relative">
              <div className="absolute top-6 right-6 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star size={12} fill="currentColor" /> Most Popular
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2">Scale</h3>
              <p className="text-sm text-indigo-100 dark:text-indigo-200 min-h-[40px] pr-20">
                Automate your hiring with AI filtering and custom screening.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-white">$79</span>
                <span className="text-indigo-200 font-medium mb-1">/post</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-white text-sm font-medium">
                  <CheckCircle2 size={20} className="text-pink-400 shrink-0 mt-0.5" /> 
                  <span><strong className="text-white">Everything in Startup</strong>, plus:</span>
                </li>
                <li className="flex items-center gap-3 text-white text-sm font-bold bg-indigo-500/30 dark:bg-indigo-800/50 p-2.5 -ml-2.5 rounded-xl border border-indigo-400/30 shadow-inner transition-transform hover:scale-105">
                  <Bot size={20} className="text-pink-400 shrink-0" /> 
                  <span>AI Match Scoring Engine</span>
                </li>
                <li className="flex items-start gap-3 text-indigo-50 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-300 shrink-0 mt-0.5" /> 
                  <span>Embed Jobs on Career Page</span>
                </li>
                <li className="flex items-start gap-3 text-indigo-50 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-300 shrink-0 mt-0.5" /> 
                  <span>AI Job Description Generator</span>
                </li>
              </ul>
              <button 
                onClick={() => handleCheckout('scale')}
                disabled={processingPlan !== null}
                className="block w-full py-4 text-center rounded-xl font-black bg-white text-indigo-600 hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.03] disabled:opacity-70 flex justify-center items-center mt-auto"
              >
                {processingPlan === 'Scale' ? <Loader2 className="animate-spin" size={20} /> : 'Buy Scale Credit'}
              </button>
            </div>
          </div>

          {/* TIER 3: URGENT ($99) */}
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-2 group h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151b2e]/50 transition-colors duration-500">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Urgent</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">
                Maximum priority, cross-posting, and dedicated support.
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">$99</span>
                <span className="text-slate-500 font-medium mb-1">/post</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span><strong className="text-slate-900 dark:text-white">Everything in Scale</strong>, plus:</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 dark:text-white text-sm font-bold bg-amber-50 dark:bg-amber-900/20 p-2.5 -ml-2.5 rounded-xl border border-amber-200 dark:border-amber-800/40 transition-transform hover:scale-105">
                  <TrendingUp size={20} className="text-amber-500 shrink-0" /> 
                  <span>Promoted through our job board</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Dedicated Account Manager</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                  <span>Priority 24/7 VIP Support</span>
                </li>
              </ul>
              <button 
                onClick={() => handleCheckout('urgent-plan')}
                disabled={processingPlan !== null}
                className="block w-full py-4 text-center rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all duration-300 disabled:opacity-70 flex justify-center items-center mt-auto"
              >
                {processingPlan === 'Urgent' ? <Loader2 className="animate-spin" size={20} /> : 'Buy Urgent Credit'}
              </button>
            </div>
          </div>

        </div>

        {/* 📦 NAYA JADOO: PREMIUM BULK PRICING BANNER */}
        <div className="max-w-[1250px] mx-auto mt-12 bg-slate-900 dark:bg-[#0B0F19] rounded-[2.5rem] border border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 relative overflow-hidden group">
          
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="flex-1 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider mb-4 backdrop-blur-sm">
              <Layers size={14} className="text-indigo-400" /> Enterprise Option
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">
              Hiring at Scale? Buy in Bulk.
            </h3>
            <p className="text-slate-400 font-medium text-lg max-w-lg mx-auto lg:mx-0">
             Everything in Urgent plan plus; Lock in volume discounts with our <strong className="text-white">Scale Pass</strong>. Post whenever you want—your credits never expire.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto shrink-0 justify-center relative z-10">
            
            <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto shrink-0 justify-center relative z-10">
            
            {/* 🟢 FIX: 5 Jobs Pack */}
            <div className="bg-slate-800/40 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-slate-700 text-center flex flex-col justify-between transition-colors min-w-[200px]">
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">5 Job Pack</div>
                <div className="text-4xl font-black text-white mb-1">$445</div>
                <div className="text-sm font-medium text-slate-500 mb-6">($89 / post)</div>
              </div>
              <button 
                onClick={() => handleCheckout('bulk-5-pack')}
                disabled={processingPlan !== null}
                className="w-full py-4 bg-slate-700/80 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm shadow-sm"
              >
                {processingPlan === 'Bulk 5 Pack' ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Buy 5 Credits'}
              </button>
            </div>
            
            {/* 🟢 FIX: 10 Jobs Pack - Premium Highlight */}
            <div className="bg-gradient-to-b from-indigo-900/80 to-slate-900 p-6 sm:p-8 rounded-[2rem] border border-indigo-500/50 text-center relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.2)] transform hover:scale-105 transition-transform duration-300 min-w-[220px]">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500"></div>
              <div className="absolute top-5 -right-10 bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-10 py-1 transform rotate-45 shadow-lg">
                Save 20%
              </div>
              
              <div>
                <div className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider mt-1">10 Job Pack</div>
                <div className="text-4xl font-black text-white mb-1">$790</div>
                <div className="text-sm font-medium text-indigo-300/70 mb-6">($79 / post)</div>
              </div>
              <button 
                onClick={() => handleCheckout('bulk-10-pack')}
                disabled={processingPlan !== null}
                className="w-full py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {processingPlan === 'Bulk 10 Pack' ? <Loader2 className="animate-spin mx-auto" size={18} /> : <>Buy 10 Credits <ArrowRight size={16} /></>}
              </button>
            </div>
            
          </div>
          </div>
        </div>
      </div>
    </div>
    {/* 🟢 CUSTOM VIP POPUP (MODAL) */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111625] rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
            
            {/* Icon based on Success or Error */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner ${popup.type === 'success' ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20' : 'bg-red-100 text-red-500 dark:bg-red-500/20'}`}>
              {popup.type === 'success' ? <CheckCircle2 size={32} /> : <X size={32} />}
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {popup.type === 'success' ? 'Awesome!' : 'Oops!'}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
              {popup.message}
            </p>
            
            <button 
              onClick={() => setPopup({ ...popup, show: false })}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg ${popup.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Custom missing icon
function AlertOctagon({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}
