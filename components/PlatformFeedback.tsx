"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, HeartHandshake, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EMOJIS = [
    { icon: '🤩', label: 'Amazing', color: 'bg-green-100 dark:bg-green-900/30 border-green-200' },
    { icon: '😊', label: 'Good', color: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200' },
    { icon: '😐', label: 'Okay', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200' },
    { icon: '😞', label: 'Bad', color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200' },
    { icon: '😡', label: 'Terrible', color: 'bg-red-100 dark:bg-red-900/30 border-red-200' }
];

export default function PlatformFeedback() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkEligibility = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUser(user);

            // LocalStorage hack taake har page load par database query na ho agar user dismiss kar chuka hai
            if (localStorage.getItem(`review_done_${user.id}`)) return;

            // Profile se updated_at aur status nikalo
            const { data: profile } = await supabase
                .from('profiles')
                .select('updated_at, has_submitted_review')
                .eq('id', user.id)
                .single();

            if (profile && !profile.has_submitted_review) {
                // 10 Din ka hisaab lagao
                const updatedDate = new Date(profile.updated_at);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - updatedDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 10) {
                    // Thora delay de kar show karo taake user achanak darr na jaye
                    setTimeout(() => setIsOpen(true), 3000); 
                }
            }
        };

        checkEligibility();
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        // Temporary dismiss (1 hafte baad dobara dikhane ke liye localStorage set kar sakte ho)
        // Abhi ke liye hum local storage mein save kar rahay hain taake session mein tang na kare
        sessionStorage.setItem('review_dismissed', 'true'); 
    };

    const handleSubmit = async () => {
        if (!selectedEmoji) {
            toast.error("Please select an emoji first! 🙏");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Review Table mein dalo
            await supabase.from('platform_reviews').insert([{
                user_id: user.id,
                sentiment: selectedEmoji,
                feedback_text: feedbackText.trim() || null
            }]);

            // 2. Profile table mein flag update karo taake zindagi mein dobara na aye
            await supabase.from('profiles').update({
                has_submitted_review: true
            }).eq('id', user.id);

            // 3. LocalStorage mein bhi daal do for extreme performance
            localStorage.setItem(`review_done_${user.id}`, 'true');

            toast.success("Thank you for your genuine feedback! 💙");
            setIsOpen(false);
        } catch (error) {
            console.error("Review Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-[#151b2d] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HeartHandshake size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                How's your experience?
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                You've been with us for a while! We'd love a genuine review to help us improve HireSkys.
                            </p>
                        </div>

                        {/* EMOJI ROW */}
                        <div className="flex justify-between items-center gap-2 mb-6">
                            {EMOJIS.map((emoji) => (
                                <button
                                    key={emoji.label}
                                    onClick={() => setSelectedEmoji(emoji.icon)}
                                    className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                                        selectedEmoji === emoji.icon 
                                        ? `${emoji.color} scale-110 shadow-md` 
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 grayscale hover:grayscale-0'
                                    }`}
                                >
                                    <span className="text-3xl md:text-4xl leading-none filter drop-shadow-sm">
                                        {emoji.icon}
                                    </span>
                                    {selectedEmoji === emoji.icon && (
                                        <span className="absolute -bottom-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider animate-in fade-in">
                                            {emoji.label}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* OPTIONAL TEXT BOX */}
                        <div className="mt-8 mb-6">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Tell us more (Optional)
                            </label>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="What do you love? What's missing?"
                                rows={3}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-all"
                            />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedEmoji}
                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                !selectedEmoji 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
                            }`}
                        >
                            {isSubmitting ? (
                                <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                            ) : (
                                <><Send size={18} /> Submit Feedback</>
                            )}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}