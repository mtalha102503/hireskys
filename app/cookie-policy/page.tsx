"use client";
import Navbar from '@/components/Navbar';
import { Cookie, Info, Settings, Shield, Globe, MousePointer, CheckCircle } from 'lucide-react';

export default function CookiePolicy() {
  const lastUpdated = "December 21, 2025";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      {/* Navbar included */}
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16 space-y-3">
          <div className="inline-flex items-center justify-center p-3 md:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-2">
            <Cookie className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400">
            How we use cookies to improve your radar experience.
          </p>
          <div className="text-xs md:text-sm font-mono text-slate-400 bg-white dark:bg-slate-800 py-1 px-3 rounded-md inline-block border border-slate-200 dark:border-slate-700">
            Last Updated: {lastUpdated}
          </div>
        </div>

        {/* CONTENT BOX */}
        <div className="bg-white dark:bg-[#111625] p-5 md:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-8 md:space-y-12">
          
          {/* INTRO */}
          <section>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg">
              This Cookie Policy explains how <strong>HireSkys</strong> ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </section>

          {/* 1. WHAT ARE COOKIES */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 shrink-0">
                <Info size={20} className="md:w-6 md:h-6" />
              </div>
              1. What are Cookies?
            </h2>
            <div className="pl-0 md:pl-14 space-y-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
            </div>
          </section>

          {/* 2. WHY WE USE THEM */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 shrink-0">
                <Settings size={20} className="md:w-6 md:h-6" />
              </div>
              2. Why We Use Cookies
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p className="mb-4">We use cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Shield size={16} className="text-green-500" /> Essential Cookies
                  </h3>
                  <p className="text-xs md:text-sm">These are strictly necessary to provide you with services like **Login Authentication** (via Supabase) and secure access to your profile.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <MousePointer size={16} className="text-purple-500" /> Functionality Cookies
                  </h3>
                  <p className="text-xs md:text-sm">These are used to remember your preferences, such as your **Dark Mode / Light Mode** setting, so you don't have to reset it every time.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. THIRD PARTY */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 shrink-0">
                <Globe size={20} className="md:w-6 md:h-6" />
              </div>
              3. Third-Party Cookies
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base space-y-3">
              <p>
                In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Supabase:</strong> Handles user sessions and security tokens.</li>
                <li><strong>Vercel Analytics:</strong> Helps us understand how fast our pages load for you.</li>
              </ul>
            </div>
          </section>

          {/* 4. MANAGING COOKIES */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 shrink-0">
                <Settings size={20} className="md:w-6 md:h-6" />
              </div>
              4. How can I control cookies?
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. Alternatively, you can set or amend your web browser controls to accept or refuse cookies.
              </p>
              <p className="mt-2 text-xs md:text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <strong>Note:</strong> If you choose to reject cookies, you may still use our website though your access to some functionality (like staying logged in) may be restricted.
              </p>
            </div>
          </section>

          {/* FOOTER NOTE */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
             <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full text-sm md:text-base">
               <CheckCircle size={18} />
               <span>We respect your data and privacy.</span>
             </div>
          </section>

        </div>
      </main>
    </div>
  );
}