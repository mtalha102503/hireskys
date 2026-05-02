"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Send, Loader2, User, CheckCircle2, MessageSquare, Search } from 'lucide-react';

export default function AdminSupportPanel() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Admin ki ID aur Support Rooms fetch karo
  useEffect(() => {
    fetchAdminAndRooms();
  }, []);

  // Naya message aane par auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. Fetch Active Chat Rooms (Jinka job_id null hai)
  async function fetchAdminAndRooms() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setAdminId(session.user.id);

      // Support rooms uthao
      const { data: chatRooms } = await supabase
        .from('chat_rooms')
        .select('id, employer_id')
        .is('job_id', null)
        .order('created_at', { ascending: false });

      if (chatRooms && chatRooms.length > 0) {
        // Employers ke naam fetch karne ke liye (Taa ke list mein naam aaye)
        const employerIds = chatRooms.map(r => r.employer_id);
        const { data: companies } = await supabase
          .from('companies')
          .select('employer_id, name')
          .in('employer_id', employerIds);

        // Room aur Company Name ko merge kar do
        const enrichedRooms = chatRooms.map(room => {
          const comp = companies?.find(c => c.employer_id === room.employer_id);
          return { ...room, company_name: comp?.name || 'Unknown Employer' };
        });

        setRooms(enrichedRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  }

  // 3. Jab kisi Employer par click ho toh uski chat kholo
  const handleSelectRoom = async (room: any) => {
    setSelectedRoom(room);
    setLoadingMessages(true);
    setMessages([]);

    try {
      const { data: pastMessages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', room.id)
        .order('created_at', { ascending: true });
      
      setMessages(pastMessages || []);

      // 🟢 SUPABASE REALTIME FOR THIS ROOM 🟢
      // Pehle wala koi channel hai toh remove karo
      supabase.removeAllChannels();

      supabase
        .channel(`admin_room_${room.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${room.id}` },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // 4. Admin Reply Bheje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !adminId) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: selectedRoom.id,
          sender_id: adminId,
          content: newMessage.trim(),
        });

      if (!error) setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-[#050814] flex flex-col font-sans overflow-hidden">
      
      {/* 📌 Navbar */}
      <header className="h-16 bg-white dark:bg-[#111625] border-b border-slate-200 dark:border-slate-800 flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <MessageSquare size={20} />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">HireSkys Support HQ</h1>
        </div>
      </header>

      {/* 📌 Main Layout (2 Columns) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 👈 LEFT SIDEBAR: Chat List */}
        <aside className="w-80 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search employers..." 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loadingRooms ? (
              <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
            ) : rooms.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500 font-medium">No active support chats.</div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {rooms.map(room => (
                  <button 
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${selectedRoom?.id === room.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50 border-l-4 border-transparent'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      <User size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{room.company_name}</h4>
                      <p className="text-xs text-slate-500 truncate">VIP Employer</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* 👉 RIGHT SIDE: Chat Interface */}
        <main className="flex-1 flex flex-col bg-slate-50/50 dark:bg-[#050814]/50 relative">
          
          {!selectedRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare size={60} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Chat Selected</h2>
              <p className="text-sm mt-1">Select an employer from the left to start replying.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111625] flex items-center px-6 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{selectedRoom.company_name}</h3>
                    <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-500" /></div>
                ) : (
                  messages.map((msg, index) => {
                    const isAdmin = msg.sender_id === adminId; // Agar tumne bheja hai

                    return (
                      <div key={index} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${
                          isAdmin 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {isAdmin ? 'You' : 'Employer'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAdmin && <CheckCircle2 size={12} className="text-indigo-400" />}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-[#111625] border-t border-slate-200 dark:border-slate-800 shrink-0">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-end">
                  <textarea 
                    placeholder="Type your reply to the employer..." 
                    className="flex-1 max-h-32 min-h-[50px] text-sm p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-colors resize-none text-slate-900 dark:text-white custom-scrollbar shadow-inner"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-12 h-12 shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-indigo-500/30"
                  >
                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} className="-ml-0.5" />}
                  </button>
                </form>
              </div>
            </>
          )}
        </main>

      </div>
    </div>
  );
}