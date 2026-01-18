"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Flag, AlertTriangle, X, CheckCircle } from 'lucide-react';

export default function ReportJob({ jobId }: { jobId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState('Scam / Fake');
  const [details, setDetails] = useState('');

  const handleReport = async () => {
    setLoading(true);
    const { error } = await supabase.from('job_reports').insert({
      job_id: jobId,
      reason: reason,
      details: details
    });

    if (!error) {
      setSent(true);
      setTimeout(() => {
        setIsOpen(false);
        setSent(false); // Reset for future
      }, 2000);
    } else {
      alert('Error sending report. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <button 
  onClick={() => setIsOpen(true)}
  className="mt-6 w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all shadow-sm"
>
  <Flag size={18} /> 
  Report Issue with this Job
</button>

      {/* ⚫ POPUP MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111625] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>

            {sent ? (
              // ✅ SUCCESS STATE
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Report Received</h3>
                <p className="text-slate-500 mt-2">Thanks for keeping HireSkys safe. We will review this shortly.</p>
              </div>
            ) : (
              // 📝 FORM STATE
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full text-red-600">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Report Job</h3>
                    <p className="text-sm text-slate-500">Is something wrong with this listing?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Reason</label>
                    <select 
                      value={reason} 
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option>Scam / Fake Job</option>
                      <option>Asking for Money</option>
                      <option>Offensive Content</option>
                      <option>Wrong Category/Info</option>
                      <option>Expired Job</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Additional Details (Optional)</label>
                    <textarea 
                      rows={3} 
                      value={details} 
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Please tell us more..."
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <button 
                    onClick={handleReport} 
                    disabled={loading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : 'Submit Report'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}