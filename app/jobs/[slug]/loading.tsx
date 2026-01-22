import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] pt-24 pb-12 transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* 🔙 Top: Navigation Skeleton */}
        <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" /> 
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 👈 LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card (Logo + Title) */}
            <div className="bg-white dark:bg-[#151B2B] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex gap-6 items-start">
                    {/* Fake Logo */}
                    <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
                    
                    <div className="space-y-4 w-full">
                        {/* Fake Title */}
                        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        {/* Fake Subtitles */}
                        <div className="flex gap-3">
                            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        </div>
                        {/* Fake Tags */}
                        <div className="flex gap-2 pt-2">
                            <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Body */}
            <div className="bg-white dark:bg-[#151B2B] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                {/* Paragraph Lines */}
                <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                    <div className="h-4 w-11/12 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                </div>

                 {/* Requirements Section */}
                 <div className="space-y-4">
                    <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                <div className="h-4 w-10/12 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

          </div>

          {/* 👉 RIGHT COLUMN - Sidebar Actions */}
          <div className="lg:col-span-1 space-y-6">
             {/* Buttons Card */}
             <div className="bg-white dark:bg-[#151B2B] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="h-12 w-full bg-indigo-500/20 rounded-xl animate-pulse" /> {/* Apply Button */}
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /> {/* Save Button */}
             </div>

             {/* Job Overview Details */}
             <div className="bg-white dark:bg-[#151B2B] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                
                {/* Icons & Text placeholders */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                    </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}