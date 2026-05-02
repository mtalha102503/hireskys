"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Send, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Real-time Chat States
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupChat();
  }, []);

  // Naya message aane par scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  async function setupChat() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Agar user login nahi hai toh aage kuch mat karo
      if (!session?.user) {
        setLoading(false);
        return; 
      }
      
      const currentUserId = session.user.id;
      setUserId(currentUserId);

      // 🟢 VIP CHECK REMOVED! Ab har logged-in user ko access milega 🟢

      // 1. SUPPORT ROOM Dhoondo ya Banao (job_id IS NULL ka matlab support chat hai)
      let currentRoomId = null;
      const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('employer_id', currentUserId)
        .is('job_id', null) // Support room ki pehchan
        .single();

      if (existingRoom) {
        currentRoomId = existingRoom.id;
      } else {
        const { data: newRoom, error } = await supabase
          .from('chat_rooms')
          .insert({ employer_id: currentUserId }) // candidate_id & job_id null rahenge
          .select('id')
          .single();
        
        if (!error && newRoom) currentRoomId = newRoom.id;
      }

      if (currentRoomId) {
        setRoomId(currentRoomId);
        
        // 2. Purane Messages Fetch Karo
        const { data: pastMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', currentRoomId)
          .order('created_at', { ascending: true });
        
        if (pastMessages) setMessages(pastMessages);

        // 3. SUPABASE REALTIME CONNECTION ON KARO! 🚀
        supabase
          .channel(`support_room_${currentRoomId}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${currentRoomId}` },
            (payload) => {
              setMessages((prev) => [...prev, payload.new]);
            }
          )
          .subscribe();
      }

    } catch (error) {
      console.error("Chat Setup Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || !userId) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: userId,
          content: newMessage.trim(),
        });

      if (!error) setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Agar loading ho rahi hai, ya user login NAHI hai, toh chat box hide kar do
  if (loading || !userId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 💬 THE REAL-TIME CHAT POPUP */}
      {isOpen && (
        <div className="mb-4 w-[340px] h-[480px] flex flex-col bg-white dark:bg-[#111625] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* 🟢 MT ki jagah ab Logo2.png aa gaya */}
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold backdrop-blur-sm overflow-hidden p-1">
                  <img 
                    src="/logo2.png" 
                    alt="HireSkys Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full"></span>
              </div>
              <div>
                {/* 🟢 Naam Change Kar Diya */}
                <h4 className="font-bold text-sm leading-tight">HireSkys Support</h4>
                <p className="text-[10px] text-indigo-200 font-medium">Premium Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1">
              <X size={20} />
            </button>
          </div>

          {/* Chat Body (Messages Area) */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-[#0B0F19]/50 space-y-4 custom-scrollbar">
            
            {/* Initial Welcome Message */}
            <div className="flex flex-col items-start">
              <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm">
                Hi there! 👋 Welcome to HireSkys Premium Support. How can I help you today?
              </div>
            </div>

            {/* Real-time Messages Loop */}
            {messages.map((msg, index) => {
              const isMe = msg.sender_id === userId;
              return (
                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCircle2 size={12} className="text-slate-400" />}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-[#111625] border-t border-slate-100 dark:border-slate-800 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
              <input 
                type="text"
                placeholder="Type your message..." 
                className="flex-1 text-sm p-3 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
              />
              <button 
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="w-11 h-11 shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} className="-ml-0.5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 THE FLOATING BUTTON (Toggles the chat) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:scale-110 hover:shadow-[0_10px_40px_rgba(79,70,229,0.6)] transition-all duration-300 group ${isOpen ? 'rotate-90 scale-90 opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageCircle size={26} />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>

    </div>
  );
}