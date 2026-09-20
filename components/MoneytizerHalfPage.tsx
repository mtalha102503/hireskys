"use client";

export default function RevbidBigSkyscraper() {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-6 p-4 bg-slate-50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all sticky top-24">
      <span className="text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Sponsored
      </span>

      {/* CLS fix: min-height 600 reserve karta hai taake ad load hone par layout na hile */}
      <div
        data-placement-id="revbid-big-skyscraper"
        id="revbid-big-skyscraper-5146"
        style={{ minWidth: 120, minHeight: 600, textAlign: "center" }}
        className="w-full flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/20 rounded-xl overflow-hidden"
      />
    </div>
  );
}
