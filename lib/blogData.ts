// lib/blogData.ts

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  role: string;
  authorImage: string;
  category: string;
  image: string;
  content: string; // HTML Content
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'introducing-hyrizon-ai',
    title: 'Why We Built Hyrizon AI: The End of Fake Jobs',
    excerpt: 'Finding a remote job shouldn\'t feel like Russian Roulette. See how we use intelligence to protect freelancers.',
    date: 'Feb 15, 2026',
    author: 'Muhammad Talha',
    role: 'Founder, HireSkys',
    authorImage: '/founder.png', // Aapki image
    category: 'Launch Announcement',
    image: '/blog-og-image.jpg', // Public folder wali image
    content: `
      <p class="lead text-2xl font-medium text-slate-600 dark:text-slate-300 mb-8">
        Finding a remote job shouldn't feel like playing Russian Roulette. You apply, you wait, and half the time, you don't even know if the company is real.
      </p>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        At <strong>HireSkys</strong>, we got tired of the noise. We got tired of talented developers and designers wasting hours tailoring resumes for "ghost jobs" or getting scammed by fake clients on generic platforms.
      </p>
      
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-12">
        So, we built something better. We built <a href="/hyrizon" class="text-violet-600 font-bold hover:underline">Hyrizon AI</a>.
      </p>

      <hr class="my-12 border-slate-200 dark:border-slate-800" />

      <h2 class="flex items-center gap-3 text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Phase 1: The Iron-Clad Verification
      </h2>
      
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        Before you even see a job on HireSkys, it goes through our <strong>ShieldCheck™ Protocol</strong>. We don't just scrape jobs; we investigate them.
      </p>

      <ul class="list-none space-y-4 my-8 pl-0">
        <li class="flex gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="text-emerald-500 font-bold text-lg">01.</span>
            <span class="text-slate-700 dark:text-slate-300"><strong>Digital Footprint:</strong> Does the company exist? Do they have a valid LinkedIn presence and a verifiable domain?</span>
        </li>
        <li class="flex gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="text-emerald-500 font-bold text-lg">02.</span>
            <span class="text-slate-700 dark:text-slate-300"><strong>Payment History:</strong> For platforms like Upwork, we prioritize clients with 'Payment Verified' badges.</span>
        </li>
        <li class="flex gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="text-emerald-500 font-bold text-lg">03.</span>
            <span class="text-slate-700 dark:text-slate-300"><strong>Red Flag Scanning:</strong> Our system scans for keywords often used by scammers (e.g., asking for Telegram chats).</span>
        </li>
      </ul>

      <h2 class="flex items-center gap-3 text-3xl font-bold mt-16 mb-6 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
        Phase 2: The Magic Button
      </h2>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        Most job boards show you a list. We show you your <strong>future</strong>. With our new <a href="/hyrizon" class="text-violet-500 font-bold hover:underline">Hyrizon AI Engine</a>, you can click the <strong>'AI Summary & Match'</strong> button on any job.
      </p>

      <div class="bg-violet-50 dark:bg-violet-900/10 border-l-4 border-violet-500 p-6 my-8 rounded-r-xl">
        <p class="italic font-medium text-violet-800 dark:text-violet-300 m-0 text-lg">
            "It reads your profile. It reads the Job Description. It tells you exactly why you should (or shouldn't) apply."
        </p>
      </div>

      <h2 class="flex items-center gap-3 text-3xl font-bold mt-16 mb-6 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
        The HireSkys Promise
      </h2>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
        We are not just building a job board; we are building a career command center for the elite. Whether you are a React Developer in Pakistan or a Designer in Nigeria, talent is universal, and opportunity should be too.
      </p>

      <div class="mt-16 p-8 bg-slate-900 dark:bg-indigo-900/20 rounded-3xl text-center border border-slate-800">
          <h3 class="text-2xl font-bold text-white mb-4">Ready to experience the future?</h3>
          <p class="text-slate-400 mb-8">Create your profile and let Hyrizon find your perfect match.</p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full transition-all no-underline">
                  Explore Jobs 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              
              <a href="/hyrizon" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3 bg-violet-600 text-white hover:bg-violet-700 font-bold rounded-full transition-all shadow-lg shadow-violet-500/30 no-underline">
                  Ask Hyrizon AI 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 7h6"/></svg>
              </a>
          </div>
      </div>
    `
  }
];