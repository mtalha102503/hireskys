import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, MessageCircle, Building2, Flag, Clock, MapPin, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch with HireSkys',
  description: 'Contact the HireSkys team — support for job seekers and employers, partnership inquiries, feedback, or reporting a job listing. We reply within 1-2 business days.',
  alternates: {
    canonical: 'https://www.hireskys.com/contact',
  },
};

export const revalidate = 86400;

const contactCards = [
  {
    icon: MessageCircle,
    title: 'Job Seeker Support',
    desc: 'Questions about applying, your profile, saved jobs, or job alerts.',
    email: 'support@hireskys.com',
    href: 'mailto:support@hireskys.com',
  },
  {
    icon: Building2,
    title: 'Employers & Hiring',
    desc: 'Posting jobs, applicant tracking, pricing, or your company profile.',
    email: 'contact@hireskys.com',
    href: 'mailto:contact@hireskys.com',
  },
  {
    icon: Flag,
    title: 'Report a Job Listing',
    desc: 'Found a scam, expired, or misleading job post? Tell us — we act fast.',
    email: 'support@hireskys.com',
    href: 'mailto:support@hireskys.com?subject=Report%20a%20job%20listing',
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19]">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Questions, feedback, partnership ideas, or something wrong on the site?
              Reach out — a real human on the HireSkys team will get back to you
              within 1–2 business days.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Clock size={16} />
              <span>Typical response time: under 48 hours on business days</span>
            </div>
          </div>

          {/* Contact cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
              >
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <card.icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {card.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {card.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  <Mail size={14} />
                  {card.email}
                </span>
              </a>
            ))}
          </div>

          {/* Quick answers */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Before you write — quick answers
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  I applied to a job but heard nothing back. Can you help?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Hiring decisions are made by the employer, not HireSkys. But if a
                  listing looks abandoned or the application link is dead, report it
                  and we will review the employer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  How do I post a job?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Head to our <Link href="/post-job" className="text-indigo-600 dark:text-indigo-400 underline">post a job page</Link> —
                  it takes a few minutes and your listing goes live after a quick review.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Is HireSkys free for job seekers?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Yes — searching, applying, job alerts, and salary insights are
                  completely free for job seekers, forever.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  I want to partner or advertise with HireSkys.
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  We would love to hear from you — write to{' '}
                  <a href="mailto:contact@hireskys.com" className="text-indigo-600 dark:text-indigo-400 underline">
                    contact@hireskys.com
                  </a>{' '}
                  with your proposal.
                </p>
              </div>
            </div>
          </div>

          {/* Company info */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <div className="inline-flex items-center gap-2 mb-2">
              <MapPin size={14} />
              <span>HireSkys — a remote-first company</span>
            </div>
            <p>
              Prefer email? Write anytime at{' '}
              <a href="mailto:contact@hireskys.com" className="text-indigo-600 dark:text-indigo-400 underline">
                contact@hireskys.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
