'use client';

// 1. Suspense ko yahan import kiya hai
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Sparkles, User, ArrowLeft, Globe, Loader2, ExternalLink, ArrowRight } from 'lucide-react';

const markdownComponents = {
  a: (props: any) => (
    <a {...props} target="_blank" className="text-violet-500 underline break-all" />
  ),
  p: (props: any) => (
    <p {...props} className="break-words" />
  )
};

const SourceCard = ({ src }: { src: { title: string; url: string } }) => {
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return 'website';
    }
  };

  const domain = getDomain(src.url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  return (
    <a 
      href={src.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-violet-500/50 hover:bg-white dark:hover:bg-white/10 transition-all group min-w-[140px] max-w-[180px] h-full shadow-sm dark:shadow-none"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-1.5 bg-white dark:bg-white/10 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
            <img 
                src={faviconUrl} 
                alt="icon" 
                className="w-5 h-5 object-contain" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
        </div>
        <ExternalLink size={14} className="text-slate-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 truncate">
            {domain}
        </p>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 leading-relaxed group-hover:text-violet-600 dark:group-hover:text-violet-200 transition-colors">
            {src.title}
        </p>
      </div>
    </a>
  );
};

const Typewriter = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedContent((prev) => prev + content.charAt(index));
      index++;
      if (index === content.length) clearInterval(interval);
    }, 5); 
    
    return () => clearInterval(interval);
  }, [content]);

  return <ReactMarkdown components={markdownComponents}>{displayedContent}</ReactMarkdown>;
};

// 2. Main Logic ko ek alag component 'HyrizonContent' bana diya
function HyrizonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q');
  
  const [query, setQuery] = useState(initialQuery || '');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "💰 Python Developer Salary Trends 2026",
    "🌍 Find Remote React Jobs in USA",
    "🕵️ Is 'Crossover for Work' Legit?",
    "🚀 How to pass Upwork verification?"
  ];

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (messages.length > 0 || loading) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSearch = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/hyrizon', {
        method: 'POST',
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Server error occurred");
      }

      const aiMsg = { 
        role: 'ai', 
        content: data.answer, 
        sources: data.sources 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `🚨 **Error:** ${e.message || "Connection failed."} \nPlease check your connection.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans flex flex-col relative overflow-hidden selection:bg-violet-500/30">
      
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/10 dark:bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-2 px-4 sticky top-0 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
            <button 
                onClick={() => router.push('/')} 
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/70 dark:bg-[#151b2d]/70 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-violet-500/30 dark:hover:border-violet-500/50 transition-all duration-300"
            >
                <div className="p-1 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 transition-colors">
                    <ArrowLeft size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors group-hover:-translate-x-0.5 transform duration-300" /> 
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-white transition-colors">
                    Back to Jobs
                </span>
            </button>
            
            <div className="hidden sm:block"></div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative z-10 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
            
            {/* Welcome Screen */}
            {messages.length === 0 && !loading && (
                <div className="text-center mt-8 md:mt-16 space-y-8 animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative inline-block group cursor-default">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-24 h-24 bg-white dark:bg-[#151b2d] rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 ring-4 ring-slate-50 dark:ring-black/50 shadow-xl">
                            <img src="/iconai.png" alt="Logo"className="w-full h-full object-contain scale-[2.2] translate-y-1 translate-x-[2px]" />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-2xl">
                            Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">Hyrizon.</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-lg mx-auto leading-relaxed font-medium">
                            Real-time Job Market Intelligence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto pt-4 px-2">
                        {suggestions.map((suggestion, idx) => (
                            <button 
                                key={idx}
                                onClick={() => { setQuery(suggestion); handleSearch(suggestion); }}
                                className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 hover:border-violet-400 dark:hover:border-violet-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] transition-all text-left group flex items-center justify-between"
                            >
                                <span className="truncate">{suggestion}</span>
                                <ArrowRight className="text-violet-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" size={16}/>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Loop */}
            {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 md:gap-6 animate-in slide-in-from-bottom-4 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    {msg.role === 'ai' && (
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gradient-to-br dark:from-violet-600 dark:to-indigo-600 border border-slate-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-md dark:shadow-lg dark:shadow-violet-500/20">
                            <img src="/iconai.png" alt="AI" className="w-full h-full object-contain p-1.5" />
                        </div>
                    )}

                    <div className={`max-w-[90%] md:max-w-[80%] rounded-3xl p-5 md:p-6 text-sm md:text-base leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-indigo-500/20' 
                        : 'bg-white dark:bg-[#1e2433] border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-tl-none'
                    }`}>
                        {msg.role === 'ai' ? (
                            <>
                                <div className="prose prose-slate dark:prose-invert max-w-none break-words"> 
                                    {i === messages.length - 1 && !msg.sources ? (
                                        <Typewriter content={msg.content} />
                                    ) : (
                                        <ReactMarkdown components={markdownComponents}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                                
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 animate-in fade-in duration-700">
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                                            <Globe size={12} className="text-violet-500" /> Sources
                                        </p>
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {msg.sources.map((src: any, idx: number) => (
                                                <SourceCard key={idx} src={src} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="font-medium">{msg.content}</p>
                        )}
                    </div>

                    {msg.role === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#1e2433] border border-slate-300 dark:border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <User size={20} className="text-slate-600 dark:text-slate-400" />
                        </div>
                    )}
                </div>
            ))}

            {loading && (
                <div className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1e2433] border border-slate-200 dark:border-white/5 flex items-center justify-center flex-shrink-0">
                        <Loader2 size={20} className="text-violet-600 dark:text-violet-500 animate-spin" />
                    </div>
                    <div className="bg-white dark:bg-[#1e2433] border border-slate-100 dark:border-white/5 rounded-3xl rounded-tl-none px-6 py-4 flex items-center gap-3 shadow-sm">
                        <span className="flex gap-1">
                            <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                    </div>
                </div>
            )}
            <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      <div className="p-4 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 relative z-20">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-slate-50 dark:bg-[#151b2d] rounded-2xl border border-slate-200 dark:border-transparent focus-within:border-violet-500 transition-colors">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full h-16 pl-6 pr-16 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-lg font-medium"
                />
                <button 
                    type="submit" 
                    disabled={loading || !query.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} fill="currentColor" />}
                </button>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-3 font-medium select-none">
                Hyrizon can make mistakes. Please verify important information.
            </p>
        </form>
      </div>

    </div>
  );
}

// 3. Main Export ko Wrapper bana diya jo Suspense provide karega
export default function HyrizonPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0B0F19]">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
      </div>
    }>
      <HyrizonContent />
    </Suspense>
  );
}
