"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link'; // 👈 Yeh line add karni hai
import { Zap, CheckCircle, Copy, Sparkles, AlertCircle, Bot, Code, FastForward, HelpCircle, PlayCircle, ArrowRight } from 'lucide-react'; // 👈 ArrowRight add kiya

export default function McpPage() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const mcpUrl = apiKey ? `https://www.hireskys.com/api/mcp/${apiKey}` : '';

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleGetKey = async () => {
    if (!email.includes('@')) {
      showToast("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/get-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        showToast("Your free key is ready!", 'success');
      }
    } catch (err) {
      showToast("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mcpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpgradeClick = async (gumroadUrl: string) => {
    if (apiKey) {
      window.location.href = `${gumroadUrl}?apiKey=${apiKey}&wanted=true`;
      return;
    }

    if (email.includes('@')) {
      setLoading(true);
      try {
        const res = await fetch('/api/get-api-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.apiKey) {
          setApiKey(data.apiKey);
          window.location.href = `${gumroadUrl}?apiKey=${data.apiKey}&wanted=true`;
        }
      } catch (err) {
        showToast("Something went wrong, please try again");
      } finally {
        setLoading(false);
      }
      return;
    }

    showToast("Please enter your email above first — we'll create your key automatically");
    document.querySelector('input[type="email"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const plans = [
    { name: "Monthly", price: "$5", period: "/month", gumroadUrl: "https://hireskys.gumroad.com/l/mcp-monthly", popular: false },
    { name: "6-Month", price: "$27", period: "/6 months", badge: "Most Popular - 10% off", gumroadUrl: "https://hireskys.gumroad.com/l/mcp-6-month", popular: true },
    { name: "Yearly", price: "$36", period: "/year", badge: "Best Value - 40% off", gumroadUrl: "https://hireskys.gumroad.com/l/mcp-yearly", popular: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm ${
            toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
              : 'bg-white dark:bg-[#1a2035] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
            )}
            <p className="text-sm font-bold">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-16 max-w-5xl pt-28 relative z-10">

        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase mb-6 shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> Official MCP Integration
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Search HireSkys from <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-fuchsia-500">Claude or ChatGPT</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
            Connect our MCP server to your AI assistant and search thousands of remote jobs and verified companies directly in your chat — without switching tabs.
          </p>
        </div>

        {/* GET API KEY BOX (Main CTA) */}
        <div className="bg-white dark:bg-[#111625] p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500" size={24} /> Get Your Free Access Key
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Start with 10 free AI job searches every day. No credit card required.</p>

          {!apiKey ? (
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-5 text-lg rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border-2 border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleGetKey}
                disabled={loading}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Generating..." : "Generate Key"}
              </button>
            </div>
          ) : (
            <div className="relative z-10 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl">
                <p className="text-base text-emerald-700 dark:text-emerald-400 font-bold mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="fill-emerald-100 dark:fill-emerald-900" /> Your personal MCP Server URL is ready!
                </p>
                <div className="flex items-center gap-3 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-inner">
                  <code className="flex-1 text-sm md:text-base font-mono break-all text-slate-700 dark:text-slate-300">{mcpUrl}</code>
                  <button onClick={handleCopy} className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors flex items-center gap-2 font-bold text-sm">
                    <Copy size={18} /> {copied ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 font-medium">
                  Add this URL as a custom connector in Claude. 
                </p>
              </div>
            </div>
          )}

          {/* 🔗 NEW: Setup Guide Banner */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 hidden sm:flex items-center justify-center text-blue-500 shrink-0">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Need help connecting?</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Read our step-by-step setup guide for Claude & ChatGPT.</p>
              </div>
            </div>
            <Link 
              href="/blog/how-to-use-hireskys-mcp-claude-chatgpt" 
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0"
            >
              Read Full Guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 🚀 NEW: DEMO VIDEO SECTION */}
        <div className="mb-24 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-3 flex items-center justify-center gap-2">
              <PlayCircle className="text-indigo-500" size={28} /> See it in Action
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Watch how seamlessly HireSkys integrates into Claude.</p>
          </div>
          
          <div className="relative mx-auto max-w-4xl p-2 md:p-4 rounded-[2rem] bg-slate-200/50 dark:bg-[#111625]/80 border border-slate-300 dark:border-slate-800 shadow-2xl backdrop-blur-sm">
            {/* Ambient shadow behind video */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-20 -z-10"></div>
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-inner aspect-video">
              <video 
                src="/combined_video.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-6 bg-white dark:bg-[#111625] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <FastForward size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Zero Context Switching</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Ask your AI assistant to find jobs, summarize requirements, or draft a cover letter based on live listings without ever leaving the chat.</p>
          </div>
          <div className="p-6 bg-white dark:bg-[#111625] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 mb-4">
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Data</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">AI models have outdated training data. Our MCP feeds Claude and ChatGPT live, up-to-the-minute job postings directly from our database.</p>
          </div>
          <div className="p-6 bg-white dark:bg-[#111625] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Built for Developers</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Use the standard Model Context Protocol. Works perfectly with Claude Custom Connector, Claude Desktop, Cursor, and any other MCP-compatible AI client.</p>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Need unlimited AI searches?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Your free key includes 10 searches per day. Upgrade to remove limits.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`bg-white dark:bg-[#111625] p-8 rounded-3xl border shadow-sm relative flex flex-col ${
                  plan.popular 
                    ? 'border-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-500/10 shadow-xl shadow-indigo-500/10 scale-100 md:scale-105 z-10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`font-black text-xl mb-2 ${plan.popular ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                    <CheckCircle size={18} className="text-emerald-500" /> Unlimited AI Job Searches
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                    <CheckCircle size={18} className="text-emerald-500" /> Live Company Directory Access
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                    <CheckCircle size={18} className="text-emerald-500" /> Priority Server Support
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgradeClick(plan.gumroadUrl)}
                  disabled={loading}
                  className={`w-full py-4 text-lg font-black rounded-2xl transition-all disabled:opacity-60 ${
                    plan.popular 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-1' 
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  {loading ? "Please wait..." : "Upgrade to " + plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto text-center border-t border-slate-200 dark:border-slate-800 pt-16">
          <HelpCircle size={32} className="mx-auto text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="text-left space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">What is MCP?</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Model Context Protocol (MCP) is a standard way for AI assistants like Claude to securely connect to external tools and data sources. Our server allows AI to fetch real-time jobs from HireSkys.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">How do I add this to Claude Desktop?</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Open Claude Desktop settings, go to the Developer tab, edit your config file, and add the URL we generated for you under the <code>mcpServers</code> section using the SSE (Server-Sent Events) configuration.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
