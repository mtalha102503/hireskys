"use client";
import Navbar from '@/components/Navbar';
import { FileSignature, Users, Ban, Scale, AlertTriangle, Gavel, CheckCircle } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "December 21, 2025";

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
              <p>HireSkys operates as a job aggregation "radar" service. We:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Curate Listings:</strong> We find and verify remote job opportunities from various public sources (Twitter, LinkedIn, Company Boards).</li>
                <li><strong>Direct Traffic:</strong> We do not host the application process. We redirect you to the original source.</li>
                <li><strong>Are Not an Employer:</strong> We are not involved in the hiring process and cannot guarantee employment.</li>
              </ul>
            </div>
          </section>

          {/* 2. PROHIBITED ACTIVITIES */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 shrink-0">
                <Ban size={20} className="md:w-6 md:h-6" />
              </div>
              2. Prohibited Activities
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Using any automated system (robots, spiders, scrapers) to access the Service.</li>
                <li>Attempting to interfere with the servers or networks connected to HireSkys.</li>
                <li>Collecting or harvesting any personally identifiable information from the Service.</li>
                <li>Using the Service for any illegal purpose or solicitation of illegal activities.</li>
              </ul>
            </div>
          </section>

          {/* 3. DISCLAIMER */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 shrink-0">
                <AlertTriangle size={20} className="md:w-6 md:h-6" />
              </div>
              3. Disclaimer of Warranties
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base space-y-3">
              <p>
                The materials on HireSkys' website are provided on an 'as is' basis. HireSkys makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
              <p>
                Further, HireSkys does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </div>
          </section>

          {/* 4. LIMITATION OF LIABILITY */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 shrink-0">
                <Scale size={20} className="md:w-6 md:h-6" />
              </div>
              4. Limitation of Liability
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                In no event shall HireSkys or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on HireSkys' website, even if HireSkys or a HireSkys authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>
          </section>

          {/* 5. GOVERNING LAW */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 shrink-0">
                <Gavel size={20} className="md:w-6 md:h-6" />
              </div>
              5. Governing Law
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the Global Internet Standards and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </div>
          </section>

          {/* ACCEPTANCE FOOTER */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
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