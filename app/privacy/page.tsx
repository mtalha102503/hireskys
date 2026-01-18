"use client";
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, Eye, Mail, Server, Cookie, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "December 21, 2025";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Main Container: Mobile par padding kam (py-6), Desktop par zyada (py-12) */}
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16 space-y-3">
          <div className="inline-flex items-center justify-center p-3 md:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-2">
            {/* Mobile par Icon thoda chota */}
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400">
            Transparent tracking. Secure scouting.
          </p>
          <div className="text-xs md:text-sm font-mono text-slate-400 bg-white dark:bg-slate-800 py-1 px-3 rounded-md inline-block border border-slate-200 dark:border-slate-700">
            Last Updated: {lastUpdated}
          </div>
        </div>

        {/* CONTENT BOX */}
        {/* Mobile: p-5 (Space milegi), Desktop: p-12 */}
        <div className="bg-white dark:bg-[#111625] p-5 md:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-8 md:space-y-12">
          
          {/* INTRO */}
          <section>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg">
              Welcome to <strong>HireSkys</strong> ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we look after your personal data when you visit our website.
            </p>
          </section>

          {/* 1. INFO COLLECTION */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 shrink-0">
                <Eye size={20} className="md:w-6 md:h-6" />
              </div>
              1. Information We Collect
            </h2>
            {/* Mobile: pl-0 (No indent), Desktop: pl-14 */}
            <div className="pl-0 md:pl-14 space-y-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>We collect different kinds of personal data which we have grouped together as follows:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Identity Data:</strong> Username or identifier (if you create an account).</li>
                <li><strong>Contact Data:</strong> Email address (for job alerts).</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and time zone setting.</li>
                <li><strong>Usage Data:</strong> Which job categories you view most often.</li>
              </ul>
            </div>
          </section>

          {/* 2. USE OF DATA */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 shrink-0">
                <FileText size={20} className="md:w-6 md:h-6" />
              </div>
              2. How We Use Your Data
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p className="mb-3">We use your data in the following circumstances:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Service Delivery</h3>
                  <p className="text-xs md:text-sm">To provide and maintain our Service, including monitoring usage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Notifications</h3>
                  <p className="text-xs md:text-sm">To contact you by email regarding new verified job postings.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. COOKIES */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 shrink-0">
                <Cookie size={20} className="md:w-6 md:h-6" />
              </div>
              3. Cookies and Tracking
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 space-y-3 text-sm md:text-base">
              <p>
                We use Cookies to track the activity on our Service. You can instruct your browser to refuse all Cookies, but some parts (like Dark Mode) may not function properly.
              </p>
            </div>
          </section>

          {/* 4. SECURITY */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 shrink-0">
                <Lock size={20} className="md:w-6 md:h-6" />
              </div>
              4. Data Security
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                We use commercially acceptable means (including SSL encryption and secure database providers like Supabase) to protect your Personal Data.
              </p>
            </div>
          </section>

          {/* 5. THIRD PARTY */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 shrink-0">
                <Server size={20} className="md:w-6 md:h-6" />
              </div>
              5. Third-Party Services
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Vercel:</strong> Hosting and deployment.</li>
                <li><strong>Supabase:</strong> Database and authentication.</li>
              </ul>
            </div>
          </section>

          {/* CONTACT */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail size={20} /> Contact Us
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 block md:inline-block md:pr-12 w-full md:w-auto">
              <p className="font-bold text-slate-900 dark:text-white text-sm">By Email:</p>
              <a href="mailto:contact@hireskys.com" className="text-indigo-600 hover:text-indigo-500 font-medium text-sm md:text-base break-all">contact@hireskys.com</a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );

}
