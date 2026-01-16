"use client";
import { useState } from "react";

export default function TestPage() {
  const [status, setStatus] = useState("Waiting...");

  const runTest = async () => {
    setStatus("Running Test...");
    
    // Ye code humare API (Brain) ko signal bhejega
    const res = await fetch('/api/job-alerts', {
        method: 'POST',
        body: JSON.stringify({
            title: "CapCut Video Editor",  // Hum fake job bhej rahe hain
            category: "Video & Motion",
            source: "Upwork"
        })
    });

    const data = await res.json();
    console.log(data);
    setStatus("Test Done! Check VS Code Terminal.");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">🕵️ Job Alert System Tester</h1>
      
      <p className="text-gray-400">Is button ko dabane se system ko lagega ke ek nayi <b>"CapCut"</b> job aayi hai.</p>

      <button 
        onClick={runTest}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl transition transform active:scale-95 shadow-lg shadow-purple-500/50"
      >
        ⚡ Simulate New Job
      </button>

      <div className="p-4 bg-gray-900 rounded border border-gray-700">
        Status: <span className="text-green-400 font-mono">{status}</span>
      </div>
    </div>
  );
}