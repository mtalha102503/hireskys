"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { 
  Search, Mail, MessageCircle, FileText, Send, 
  ChevronDown, ChevronUp, MapPin, Phone, HelpCircle, CheckCircle, Loader2 
} from 'lucide-react';

// --- FAQ DATA ---
const FAQS = [
  {
    question: "How do I get the Verified Green Badge? 🛡️",
    answer: "To get verified, go to your profile and take a Skill Assessment. If you score 9/10 or higher, you automatically earn the Verified Expert badge and get priority in job alerts."
  },
  {
    question: "Is HireSkys free for freelancers?",
    answer: "Yes! Creating a profile, taking tests, and receiving job alerts via Email/WhatsApp is 100% free. We might introduce premium features later, but the core will always be free."
  },
  {
    question: "How do I get paid?",
    answer: "HireSkys connects you directly with clients. You negotiate your own rates and payment methods (Upwork, Wise, Bank Transfer). We do not take a commission from your earnings."
  },
  {
    question: "Why am I not receiving WhatsApp alerts?",
    answer: "Make sure you have added your phone number with the correct Country Code in your profile settings. Also, verify that our number is not blocked in your WhatsApp."
  },
  {
    question: "Can I post a job here?",
    answer: "Yes you can post a job then our team will manually check it if it approved then it will show instantly on platform"
  }
];

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0); // Default first open

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save to Supabase
    const { error } = await supabase
        .from('support_tickets')
        .insert([formData]);

    setLoading(false);

    if (error) {
        alert("Error sending message. Please try again.");
    } else {
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Auto hide success message after 5 seconds
        setTimeout(() => setSent(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* --- HERO HEADER --- */}
      <div className="bg-[#111625] text-white pt-32 pb-20 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-sm font-bold tracking-wide uppercase">
                  24/7 Support Center
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">How can we help you?</h1>
              <p className="text-lg text-slate-400">Search our knowledge base or get in touch with our expert support team.</p>
              
              {/* Search Bar (Visual Only) */}
              <div className="relative max-w-lg mx-auto mt-8">
                  <input 
                    type="text" 
                    placeholder="Search for answers (e.g. 'Payment', 'Verification')..." 
                    className="w-full h-14 pl-12 pr-4 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                  <Search className="absolute left-4 top-4 text-slate-400" size={24} />
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 pb-24 max-w-6xl relative z-20">
          
          {/* --- CONTACT CHANNELS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Email Card */}
              <div className="bg-white dark:bg-[#151b2d] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl hover:-translate-y-1 transition duration-300 text-center group">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <Mail size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Email Support</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Best for detailed inquiries and account issues.</p>
                  <a href="mailto:contact@hireskys.com" className="text-blue-600 font-bold hover:underline">contact@hireskys.com</a>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white dark:bg-[#151b2d] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl hover:-translate-y-1 transition duration-300 text-center group">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <MessageCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Chat with us on WhatsApp for quick help.</p>
                  <a href="https://wa.me/923001234567" target="_blank" className="text-green-600 font-bold hover:underline">+92 302 1668060</a>
              </div>

              {/* FAQ Card */}
              <div className="bg-white dark:bg-[#151b2d] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl hover:-translate-y-1 transition duration-300 text-center group">
                  <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <FileText size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Knowledge Base</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Read our guides on how to get hired faster.</p>
                  <a href="#faq" className="text-purple-600 font-bold hover:underline">Browse FAQs</a>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* --- LEFT: CONTACT FORM --- */}
              <div className="lg:col-span-7">
                  <div className="bg-white dark:bg-[#151b2d] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          <Send className="text-indigo-600" size={24}/> Send us a message
                      </h2>
                      
                      {sent ? (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center animate-fade-in">
                              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <CheckCircle size={32} />
                              </div>
                              <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Message Sent!</h3>
                              <p className="text-slate-600 dark:text-slate-300">We have received your ticket. Our team will get back to you within 24 hours.</p>
                              <button onClick={() => setSent(false)} className="mt-6 text-sm font-bold text-green-700 hover:underline">Send another message</button>
                          </div>
                      ) : (
                          <form onSubmit={handleSubmit} className="space-y-5">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div>
                                      <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Your Name</label>
                                      <input 
                                        type="text" 
                                        required 
                                        placeholder="John Doe" 
                                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
                                      <input 
                                        type="email" 
                                        required 
                                        placeholder="name@example.com" 
                                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                      />
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Subject</label>
                                  <select 
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    required
                                  >
                                      <option value="" disabled>Select a topic</option>
                                      <option value="Account Issue">Account Issue</option>
                                      <option value="Verification">Verification & Badges</option>
                                      <option value="Job Alerts">Job Alerts Issue</option>
                                      <option value="Partnership">Partnership / Hiring</option>
                                      <option value="Other">Other</option>
                                  </select>
                              </div>

                              <div>
                                  <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Message</label>
                                  <textarea 
                                    rows={5} 
                                    required 
                                    placeholder="Tell us more about your issue..." 
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                  />
                              </div>

                              <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2">
                                  {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Send size={18}/></>}
                              </button>
                          </form>
                      )}
                  </div>
              </div>

              {/* --- RIGHT: FAQ ACCORDION --- */}
              <div className="lg:col-span-5" id="faq">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <HelpCircle className="text-indigo-600" size={24}/> Frequently Asked
                  </h2>
                  <div className="space-y-4">
                      {FAQS.map((faq, index) => (
                          <div 
                            key={index} 
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                openFaq === index 
                                ? 'bg-white dark:bg-[#151b2d] border-indigo-500 dark:border-indigo-500 shadow-md' 
                                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                              <button 
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 dark:text-slate-200"
                              >
                                  {faq.question}
                                  {openFaq === index ? <ChevronUp size={20} className="text-indigo-500"/> : <ChevronDown size={20} className="text-slate-400"/>}
                              </button>
                              
                              <div 
                                className={`px-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${
                                    openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                              >
                                  {faq.answer}
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Office Info (Optional Trust Builder) */}
                  <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                      <div className="bg-white dark:bg-black p-3 rounded-full shrink-0">
                          <MapPin className="text-red-500" size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Our Headquarters</h4>
                          <p className="text-sm text-slate-500 mt-1">
                              HireSkys Inc.<br/>
                              10 Saman Zar Colony<br/>
                              Gojra, Punjab, Pakistan
                          </p>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );

}


