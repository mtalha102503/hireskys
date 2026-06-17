"use client";
import Navbar from '@/components/Navbar';
import { 
  RefreshCcw, 
  XOctagon, 
  CreditCard, 
  ShieldCheck, 
  Layers, 
  Mail, 
  CheckCircle 
} from 'lucide-react';

export default function RefundPolicy() {
  const lastUpdated = "June 17, 2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100">
      
      {/* Navbar included */}
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16 space-y-3">
          <div className="inline-flex items-center justify-center p-3 md:p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-2">
            <RefreshCcw className="w-8 h-8 md:w-10 md:h-10 text-rose-600 dark:text-rose-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Refund & Cancellation
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400">
            Clear rules for purchases, credits, and refunds.
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
              At <strong>HireSkys</strong>, we want to ensure a transparent billing experience for all employers. Please read our policy regarding digital credits, subscriptions, and refunds carefully before making a purchase.
            </p>
          </section>

          {/* 1. CANCELLATIONS */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 shrink-0">
                <XOctagon size={20} className="md:w-6 md:h-6" />
              </div>
              1. Subscription Cancellations
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base space-y-3">
              <p>
                You can cancel your HireSkys subscription at any time directly from your employer dashboard. Once canceled, your subscription will not renew automatically at the end of your billing cycle. 
              </p>
              <p>
                However, you will continue to have access to your plan's features and any remaining job credits until the end of your current paid billing cycle.
              </p>
            </div>
          </section>

          {/* 2. REFUND POLICY */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg text-rose-600 shrink-0">
                <CreditCard size={20} className="md:w-6 md:h-6" />
              </div>
              2. Refund Policy for Digital Credits
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base space-y-4">
              <p>Since HireSkys provides immediate access to digital services (job posting credits and resume access), all purchases are generally considered final.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Used Credits:</strong> We strictly do not offer refunds for job credits that have already been utilized to post a job on our platform.</li>
                <li><strong>Unused Credits (Accidental Purchase):</strong> If you made a purchase by mistake and have <strong>not used</strong> any credits or premium platform features, you may request a refund within <strong>7 days</strong> of the original transaction by contacting our support team.</li>
              </ul>
            </div>
          </section>

          {/* 3. MERCHANT OF RECORD */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 shrink-0">
                <ShieldCheck size={20} className="md:w-6 md:h-6" />
              </div>
              3. Payment Processing & Merchant of Record
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base space-y-3">
              <p>
                Our order process is conducted by our online reseller <strong>Gumroad</strong>. Gumroad is the designated Merchant of Record for all our orders. 
              </p>
              <p>
                Gumroad handles all payment processing, secure transactions, global compliance, and local tax collection. All refund requests are ultimately processed through Gumroad's secure gateway in accordance with this policy.
              </p>
            </div>
          </section>

          {/* 4. BULK PACKS */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 shrink-0">
                <Layers size={20} className="md:w-6 md:h-6" />
              </div>
              4. Bulk Packs and Scale Passes
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                Credits purchased via Bulk Packs or Scale Passes do not expire and remain in your account indefinitely. However, these bulk purchases are completely non-refundable once any partial credit from the pack has been utilized.
              </p>
            </div>
          </section>

          {/* 5. CONTACT US */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 shrink-0">
                <Mail size={20} className="md:w-6 md:h-6" />
              </div>
              5. Contact Us
            </h2>
            <div className="pl-0 md:pl-14 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <p>
                If you have any questions regarding your billing, cancellation, or wish to request a refund under the eligible conditions, please contact our billing support team at <strong>contact@hireskys.com</strong>.
              </p>
            </div>
          </section>

          {/* ACCEPTANCE FOOTER */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <ShieldCheck size={16} className="text-emerald-500" /> Secure billing provided by Gumroad
            </div>
            <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full text-sm md:text-base">
              <CheckCircle size={18} />
              <span>We believe in fair and transparent billing.</span>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
