"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Editor from '@monaco-editor/react';
import { 
  Cloud, CheckCircle, Lock, Loader2, ArrowRight, X, 
  Code, Terminal, FileText, Zap, ChevronRight, ShieldAlert, 
  AlertTriangle, Siren 
} from 'lucide-react';
import Certificate from '@/components/Certificate';
import Navbar from '@/components/Navbar';

export default function SkillTest() {
  const { skill } = useParams();
  const router = useRouter();
  const cleanSkill = decodeURIComponent(String(skill));

  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<'intro' | 'easy' | 'medium' | 'hard' | 'result' | 'cheat'>('intro');
  const [currentScore, setCurrentScore] = useState(0); 
  const [userName, setUserName] = useState("User"); 

  const [testData, setTestData] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]); 
  const [practicalResponse, setPracticalResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  // 🛡️ SECURITY STATE (Sirf Tab Switching ke liye)
  const [violation, setViolation] = useState<string | null>(null);

  // --- 1. INITIALIZE ---
  useEffect(() => {
    // 🌟 SEO: Browser Tab Name Update
    document.title = `${cleanSkill} Assessment | HireSkys`; // 👈 YE LINE ADD KARO

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (profile) setUserName(profile.full_name);

      const { data: skillData } = await supabase.from('user_skills')
        .select('proficiency_score')
        .match({ user_id: user.id, skill_name: cleanSkill }) 
        .single();

      if (skillData) setCurrentScore(skillData.proficiency_score);
      setLoading(false);
    }
    init();
  }, []);

  // --- 2. ANTI-CHEAT: TAB SWITCHING MONITOR 🕵️‍♂️ ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Agar user tab change kare aur test chal raha ho
      if (document.hidden && (stage === 'easy' || stage === 'medium' || stage === 'hard')) {
        if (!violation) {
            setViolation("Tab Switching / Window Minimized");
        }
      }
    };
    
    // Listeners add karo
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleVisibilityChange); // Extra safety check

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleVisibilityChange);
    };
  }, [stage, violation]);

  // 3. TERMINATE TEST ACTION
  const confirmTermination = () => {
    setViolation(null);
    setStage('cheat'); // User ko Lock Screen par bhej do
  };

  // --- ACTIONS (Start & Submit) ---
  async function startLevel(targetStage: 'easy' | 'medium' | 'hard') {
    setIsSubmitting(true);
    setAnswers([]); 
    setPracticalResponse("");
    setViolation(null);

    try {
        const res = await fetch('/api/generate-test', {
            method: 'POST',
            body: JSON.stringify({ skill: cleanSkill, stage: targetStage })
        });
        const data = await res.json();
        
        if (!data || (!data.questions && !data.practical)) {
            alert("System Busy. Try again.");
            return;
        }

        setTestData(data);
        setStage(targetStage);
    } catch (e) {
        alert("Connection Error.");
    } finally {
        setIsSubmitting(false);
    }
  }

  async function submitLevel() {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    try {
        const res = await fetch('/api/evaluate-test', {
            method: 'POST',
            body: JSON.stringify({ 
                stage, 
                testData, 
                userAnswers: answers, 
                userResponse: practicalResponse,
                skill,
                userId: user?.id 
            })
        });
        
        const result = await res.json();
        
        if (result.passed) {
            setCurrentScore(result.newScore);
            setFeedback(result.feedback);
            if (stage === 'hard') setStage('result'); 
            else setStage('intro'); 
        } else {
            alert(`Level Failed. ${result.feedback}`);
            setStage('intro'); 
        }

    } catch (e) {
        alert("Submission failed.");
    } finally {
        setIsSubmitting(false);
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      
      {/* ⚡ DEV CHEAT BUTTON */}
      <button 
        onClick={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return alert("Login first.");
            const { error } = await supabase.from('user_skills').upsert({ user_id: user.id, skill_name: cleanSkill, proficiency_score: 10 }, { onConflict: 'user_id, skill_name' });
            if (!error) { setCurrentScore(10); setFeedback("Dev Pass Used 🚀"); setStage('result'); }
        }}
        className="fixed top-20 right-4 z-50 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg border-2 border-white animate-bounce text-xs cursor-pointer"
      >
        ⚡ DEV PASS
      </button>

      {/* 🚨 TAB SWITCH PUNISHMENT MODAL */}
      {violation && (
        <div className="fixed inset-0 z-[150] bg-red-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-900/50 border-2 border-red-500 p-10 rounded-3xl max-w-lg w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-red-600 p-6 rounded-full">
                        <Siren size={64} className="text-white"/>
                    </div>
                </div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">VIOLATION DETECTED</h2>
                <p className="text-red-200 text-lg font-mono mb-8 border-b border-red-500/30 pb-4">
                    Action: <span className="font-bold text-white">{violation}</span>
                </p>
                <p className="text-red-100/80 mb-8 text-sm">
                    Leaving the test window is strictly prohibited.<br/>
                    Your session must be terminated.
                </p>
                <button 
                    onClick={confirmTermination}
                    className="w-full bg-white text-red-900 font-black text-xl py-4 rounded-xl hover:scale-105 transition-transform shadow-xl"
                >
                    ACKNOWLEDGE & TERMINATE
                </button>
            </div>
        </div>
      )}

      {/* 🛑 FINAL CHEAT SCREEN (Lock) */}
      {stage === 'cheat' && !violation && (
        <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-[#0B0F19]/90 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 backdrop-blur-sm">
            <div className="bg-red-50 dark:bg-red-500/10 p-8 rounded-3xl border border-red-200 dark:border-red-500/50 max-w-md w-full shadow-2xl">
                <ShieldAlert size={80} className="mx-auto text-red-600 dark:text-red-500 mb-6" />
                <h2 className="text-3xl font-bold text-red-600 dark:text-red-500 mb-2">Test Terminated</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                   Security violation detected (Tab Switching). <br/>
                   This attempt has been invalidated.
                </p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
      )}
      
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-12 min-h-screen flex flex-col items-center justify-center">

        {/* --- STAGE: INTRO --- */}
        {stage === 'intro' && (
             <div className="max-w-5xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black capitalize text-slate-900 dark:text-white">
                            {cleanSkill} <span className="text-indigo-600 dark:text-[#6366f1]">Test</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Official Skill Verification</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl shadow-sm">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Your Rating:</span>
                        <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 font-bold text-xl">
                            <Zap size={20} fill="currentColor" /> {currentScore}/10
                        </div>
                    </div>
                </div>

                {/* ⚠️ Warning Box (Sirf Tab Switching ka batayega) */}
                <div className="mb-12 bg-white dark:bg-[#111625] border-l-4 border-red-500 p-6 rounded-r-xl shadow-lg border-y border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="text-red-500 shrink-0 mt-1" size={28} />
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Important Rule</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                                This test is monitored for <b>Window/Tab Switching</b>.
                            </p>
                            <ul className="grid md:grid-cols-1 gap-y-2 text-sm text-red-600/80 dark:text-red-300 font-medium list-disc pl-4">
                                <li>Do not switch tabs or minimize the browser during the test.</li>
                                <li>Doing so will result in <b>immediate termination</b>.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <LevelCard title="Fundamentals" desc="3 Basic MCQs" scoreReq={0} targetScore={4} currentScore={currentScore} onClick={() => startLevel('easy')} color="indigo" icon={<Cloud size={24}/>}/>
                    <LevelCard title="Intermediate" desc="5 Logic MCQs" scoreReq={4} targetScore={6} currentScore={currentScore} onClick={() => startLevel('medium')} color="blue" icon={<Code size={24}/>}/>
                    <LevelCard title="Expert" desc="Practical Task" scoreReq={6} targetScore={10} currentScore={currentScore} onClick={() => startLevel('hard')} color="red" icon={<Terminal size={24}/>}/>
                </div>
            </div>
        )}

        {/* --- STAGE: MCQ (Easy/Medium) --- */}
        {(stage === 'easy' || stage === 'medium') && testData && (
             <div className="max-w-3xl w-full flex-1 flex flex-col justify-center animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                        {stage === 'easy' ? <Cloud size={18}/> : <Code size={18}/>}
                        {stage} Level
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                        Q{answers.length + 1} / {testData.questions?.length || 0}
                    </span>
                </div>
                
                {testData.questions && testData.questions.length > 0 ? (
                    <>
                         <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-10 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out" 
                                style={{ width: `${((answers.length) / (testData.questions.length || 1)) * 100}%` }}
                            />
                        </div>

                        {answers.length < testData.questions.length ? (
                             <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700/60 p-8 md:p-10 rounded-2xl shadow-xl relative">
                                <h2 className="text-2xl font-bold mb-10 leading-snug relative z-10 text-slate-900 dark:text-white">
                                    {testData.questions[answers.length]?.question}
                                </h2>
                                <div className="grid gap-4 relative z-10">
                                    {testData.questions[answers.length]?.options?.map((opt: string, idx: number) => (
                                        <button key={idx} onClick={() => setAnswers([...answers, idx])} className="group flex items-center justify-between text-left p-6 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500/60 rounded-xl transition-all duration-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 dark:group-hover:border-indigo-400 flex items-center justify-center text-xs text-slate-500 dark:text-slate-500 font-mono">{String.fromCharCode(65 + idx)}</div>
                                                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-white text-lg">{opt}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                             </div>
                        ) : (
                             <div className="text-center py-12">
                                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-8 rounded-full inline-block mb-8 animate-pulse">
                                    <CheckCircle size={80} className="text-indigo-600 dark:text-indigo-500" />
                                </div>
                                <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Answers Recorded</h2>
                                <button onClick={submitLevel} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                                    {isSubmitting ? "Processing..." : "Submit & Continue"}
                                </button>
                             </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-10 text-center">
                        <AlertTriangle size={50} className="text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">System Error</h2>
                        <p className="text-slate-500 mb-6">Failed to load questions. Please reload.</p>
                        <button onClick={() => window.location.reload()} className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700">Reload Test</button>
                    </div>
                )}
             </div>
        )}

        {/* --- STAGE: PRACTICAL (Hard) --- */}
        {stage === 'hard' && testData && testData.practical && (
            <div className="w-full max-w-[90rem] h-[80vh] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
                <div className="w-full md:w-1/3 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-700/60 rounded-2xl flex flex-col overflow-hidden shadow-lg">
                    <div className="bg-slate-50 dark:bg-slate-900/80 p-5 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                        <ShieldAlert className="text-red-500" size={20} />
                        <span className="font-bold text-slate-700 dark:text-slate-200">EXPERT CHALLENGE</span>
                    </div>
                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{testData.practical.title}</h2>
                        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                            <p className="whitespace-pre-wrap">{testData.practical.description}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-2/3 bg-[#1e1e1e] rounded-2xl border border-slate-700/60 flex flex-col overflow-hidden shadow-2xl">
                    <div className="bg-[#252526] px-4 py-3 flex items-center justify-between border-b border-black/40">
                        <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#1e1e1e] px-4 py-1.5 rounded-t-md border-t-2 border-indigo-500">
                            {testData.practical.test_type === 'code' ? <Code size={14}/> : <FileText size={14}/>}
                            <span>Solution</span>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        {testData.practical.test_type === 'code' ? (
                            <Editor 
                                height="100%" 
                                defaultLanguage="javascript" 
                                theme="vs-dark" 
                                defaultValue={testData.practical.starter_content}
                                onChange={(val) => setPracticalResponse(val || "")}
                                options={{ minimap: { enabled: false }, fontSize: 15, padding: { top: 24 } }}
                            />
                        ) : (
                            <textarea 
                                className="w-full h-full bg-[#1e1e1e] text-slate-300 p-8 resize-none focus:outline-none font-mono text-lg"
                                placeholder="Type your strategy here..."
                                onChange={(e) => setPracticalResponse(e.target.value)}
                            ></textarea>
                        )}
                    </div>
                    <div className="bg-[#252526] p-4 border-t border-black/40 flex justify-end gap-4">
                        <button onClick={submitLevel} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2">
                            {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18} fill="currentColor"/>}
                            Submit Final Project
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- STAGE: RESULT --- */}
        {stage === 'result' && (
            <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-700 dark:from-green-400 dark:to-emerald-600 mb-6">Certified!</h1>
                    <p>You have officially mastered <span className="font-bold">{cleanSkill}</span>.</p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-2xl scale-[0.6] md:scale-90 origin-top mb-[-100px] md:mb-0 border border-slate-100">
                     <Certificate userName={userName} skill={cleanSkill} date={new Date().toLocaleDateString()} />
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={() => router.push('/profile')} className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all">
                        <ArrowRight size={20}/> Go to Dashboard
                    </button>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

// Level Card Component
function LevelCard({ title, desc, scoreReq, targetScore, currentScore, onClick, color, icon }: any) {
    const isLocked = currentScore < scoreReq;
    const isCompleted = currentScore >= targetScore;
    const styles: any = {
        indigo: { border: 'border-indigo-500/50', bg: 'bg-indigo-500', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]' },
        blue: { border: 'border-blue-500/50', bg: 'bg-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
        red: { border: 'border-red-500/50', bg: 'bg-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' }
    };
    const theme = styles[color];
    const borderClass = isLocked ? 'border-slate-200 dark:border-slate-800' : isCompleted ? 'border-green-500/50' : theme.border;
    const bgClass = isLocked ? 'bg-slate-50 dark:bg-[#111625]/50' : isCompleted ? 'bg-green-50 dark:bg-green-500/10' : `bg-white dark:bg-[#111625]`;

    return (
        <button onClick={onClick} disabled={isLocked || isCompleted} className={`relative p-8 rounded-3xl border-2 ${borderClass} ${bgClass} ${!isLocked && !isCompleted ? theme.glow : ''} text-left transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed group h-full flex flex-col shadow-sm`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${isLocked ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600' : isCompleted ? 'bg-green-500 text-white' : `${theme.bg} text-white`}`}>
                    {isCompleted ? <CheckCircle size={28}/> : icon}
                </div>
                {isLocked && <Lock className="text-slate-400 dark:text-slate-600" size={24} />}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isLocked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>{title}</h3>
            <p className="text-base text-slate-500 dark:text-slate-500 mb-8 flex-1 leading-relaxed">{desc}</p>
            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between w-full">
                <span className={`text-xs font-black uppercase tracking-widest ${isCompleted ? 'text-green-600 dark:text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    {isCompleted ? 'COMPLETED' : isLocked ? 'LOCKED' : 'AVAILABLE'}
                </span>
                {!isLocked && !isCompleted && <ArrowRight size={20} className={`${theme.text} group-hover:translate-x-2 transition-transform`} />}
            </div>
        </button>
    );
}