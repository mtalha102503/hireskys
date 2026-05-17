"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// 👇 1. CUSTOM TOOLTIP COMPONENT (Is se color/visibility 100% fix ho jayegi)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      // Humne yahan Hardcode "bg-slate-800" aur "text-white" kiya hai
      // Taake Light Mode ho ya Dark, Tooltip hamesha Dark aur Saaf dikhe.
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl min-w-[80px]">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-white">
            {payload[0].value}
          </span>
          <span className="text-xs font-medium text-indigo-400">
            Jobs
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function HiringChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#94a3b8' }} 
          interval={0} 
        />
        
        {/* 👇 2. DEFAULT TOOLTIP HATA KAR CUSTOM TOOLTIP LAGA DIYA */}
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: 'transparent' }} // Hover par bar ke peeche gray box na aye
        />

        <Bar dataKey="jobs" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
                key={`cell-${index}`} 
                // Agar data hai to Blue, nahi to Gray
                fill={entry.jobs > 0 ? '#6366f1' : '#e2e8f0'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}