import Image from "next/image";
import Link from "next/link";

export default function MoneytizerHalfPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-6 p-4 bg-slate-50 dark:bg-[#111625] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all sticky top-24">
      <span className="text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 mb-2 tracking-[0.2em]">
        Sponsored
      </span>
      
      {/* GearUP Affiliate Banner Link */}
      <Link 
        href="https://www.kqzyfj.com/click-101825636-17255582" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-[300px] h-[600px] flex items-center justify-center rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-lg dark:shadow-none"
      >
        <Image 
          src="/Gear-up-ad.webp" 
          alt="Optimize Network with GearUP Booster - Get 70% Off"
          width={300}
          height={600}
          quality={100} // High quality for the premium banner look
          className="object-cover w-full h-full"
        />
      </Link>
    </div>
  );
}
