"use client";
import Navbar from '@/components/Navbar';
import { FileSignature, Users, Ban, Scale, AlertTriangle, Gavel, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "May 17, 2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      {/* Navbar included */}
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16 space-y-3">
          <div className="inline-flex items-center justify-center p-3 md:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-2">
            <FileSignature className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400">
            Rules of the Radar. Please read carefully.
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
              Welcome to <strong>HireSkys</strong>. By accessing our website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </section>

          {/* 1. USE OF SERVICE */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 shrink-0">
                <Users size={20} className="md:w-6 md:h-6" />
              </div>
              1. Use of Service
            </h2>
            <div className="pl-0 md:pl-14 space-y-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>HireSkys operates as a job aggregation and posting service. We:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Curate Listings:</strong> We find and verify remote job opportunities from various public sources.</li>
                <li><strong>Employer Job Postings:</strong> We allow registered employers to purchase credits to post job openings directly on our platform.</li>
                <li><strong>Are Not an Employer:</strong> We are not involved in the hiring process and cannot guarantee employment or candidate quality.</li>
              </ul>
            </div>
          </section>

          {/* 2. PAYMENTS & SUBSCRIPTIONS (NEW SECTION) */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 shrink-0">
                <CreditCard size={20} className="md:w-6 md:h-6" />
              </div>
              2. Payments, Credits & Merchant of Record
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base space-y-3">
              <p>
                <strong>Merchant of Record:</strong> Our order process is conducted by our online reseller FastSpring. FastSpring is the Merchant of Record for all our orders. FastSpring handles all payment processing, secure transactions, and local tax collection. Your credit card details are securely processed by FastSpring and are never stored on HireSkys servers.
              </p>
              <p>
                <strong>Job Credits:</strong> Employers can purchase job posting credits (e.g., Startup, Scale, Urgent, or Bulk Packs). These credits are applied to your account upon successful payment verification.
              </p>
              <p>
                <strong>Refunds & Cancellations:</strong> All purchases of digital job credits are final. We do not offer refunds for credits that have been used to post a job. For unused credits purchased by mistake, you may request a refund within 7 days by contacting our support team. Subscriptions can be canceled at any time from your dashboard.
              </p>
            </div>
          </section>

          {/* 3. PROHIBITED ACTIVITIES */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 shrink-0">
                <Ban size={20} className="md:w-6 md:h-6" />
              </div>
              3. Prohibited Activities
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Posting fake, scam, or misleading job advertisements. (Violation will result in immediate account termination and forfeiture of purchased credits without refund).</li>
                <li>Using any automated system (robots, spiders, scrapers) to access the Service.</li>
                <li>Attempting to interfere with the servers or networks connected to HireSkys.</li>
                <li>Collecting or harvesting any personally identifiable information from the Service.</li>
              </ul>
            </div>
          </section>

          {/* 4. DISCLAIMER */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 shrink-0">
                <AlertTriangle size={20} className="md:w-6 md:h-6" />
              </div>
              4. Disclaimer of Warranties
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base space-y-3">
              <p>
                The materials on HireSkys' website are provided on an 'as is' basis. HireSkys makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </div>
          </section>

          {/* 5. LIMITATION OF LIABILITY */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 shrink-0">
                <Scale size={20} className="md:w-6 md:h-6" />
              </div>
              5. Limitation of Liability
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                In no event shall HireSkys or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on HireSkys' website, even if HireSkys or a HireSkys authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>
          </section>

          {/* ACCEPTANCE FOOTER */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-4">
             <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <ShieldCheck size={16} /> Secure checkout provided by FastSpring
            </div>
            <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full text-sm md:text-base">
              <CheckCircle size={18} />
              <span>By using HireSkys, you agree to these terms.</span>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
