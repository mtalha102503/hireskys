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
  },
  // 🚀 NAYA ARTICLE YAHAN SE SHURU HAI
  {
    slug: 'telegram-whatsapp-remote-job-alerts',
    title: 'The Ultimate Edge: Instant Telegram & VIP WhatsApp Alerts 🚀',
    excerpt: 'Beat the competition with lightning-fast Telegram alerts, or upgrade to our VIP WhatsApp service for custom cover letters and interview strategies.',
    date: 'Mar 24, 2026',
    author: 'Muhammad Talha',
    role: 'Founder, HireSkys',
    authorImage: '/founder.png', 
    category: 'Product Update',
    image: '/blog-telegram-update.jpg', 
    content: `
      <p class="lead text-2xl font-medium text-slate-600 dark:text-slate-300 mb-8">
        Here is a harsh truth about the remote job market: By the time you see that "Perfect Job" on a standard job board, 500 other people have already applied.
      </p>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        Speed is everything. The early applicants are the ones who get the interviews. But you can't sit in front of your computer refreshing job boards 24/7. You have a portfolio to build and skills to master.
      </p>
      
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-12">
        That is why we are thrilled to announce our most powerful feature yet: <strong>The HireSkys Instant Notification Engine.</strong> And because every freelancer has a different strategy, we are launching it in two flavors: <strong>Telegram Basic</strong> and <strong>WhatsApp VIP</strong>.
      </p>

      <hr class="my-12 border-slate-200 dark:border-slate-800" />

      <h2 class="text-3xl font-bold mt-12 mb-8 text-center text-slate-900 dark:text-white">
        Choose Your Arsenal ⚔️
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        
        <div class="relative p-6 md:p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full">
            <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Telegram Basic</h3>
            <div class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full mb-6 w-max uppercase tracking-wider">
                Lifetime Free
            </div>

            <p class="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                Built for pure speed. The millisecond a verified job matches your skills, your phone buzzes. Perfect for freelancers who already have their pitch ready and just need the link fast.
            </p>

            <ul class="space-y-3 mb-8">
                <li class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <svg class="text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Zero-Latency Delivery
                </li>
                <li class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <svg class="text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Job Title & Direct Link
                </li>
                <li class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <svg class="text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    100% Skill-Matched
                </li>
            </ul>
        </div>

        <div class="relative p-6 md:p-8 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/10 dark:to-slate-800/50 rounded-3xl border-2 border-emerald-400 dark:border-emerald-500/50 shadow-xl shadow-emerald-500/10 flex flex-col h-full transform md:-translate-y-2">
            
            <div class="absolute top-0 right-6 -translate-y-1/2">
                <span class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md animate-pulse">
                    Beta Offer
                </span>
            </div>

            <div class="w-14 h-14 bg-emerald-500 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </div>
            
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">WhatsApp VIP</h3>
            <div class="flex items-baseline gap-1 mb-6">
                <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">$5</span>
                <span class="text-sm font-bold text-slate-500">/month</span>
                <span class="ml-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">First 2 Months FREE!</span>
            </div>

            <p class="text-slate-700 dark:text-slate-300 mb-6 font-medium flex-grow">
                It is not just an alert; it is an unfair advantage. Powered by Hyrizon AI, we deeply research the company and the role before sending it to your WhatsApp.
            </p>

            <ul class="space-y-3 mb-8">
                <li class="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-bold">
                    <svg class="text-emerald-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Custom Crafted Cover Letters
                </li>
                <li class="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-bold">
                    <svg class="text-emerald-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Secret Interview Cheat Sheets
                </li>
                <li class="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200 font-bold">
                    <svg class="text-emerald-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Deep Company Insights
                </li>
            </ul>
        </div>
      </div>

      <h2 class="flex items-center gap-3 text-3xl font-bold mt-16 mb-6 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        How to Connect Your Account?
      </h2>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        Setting it up takes exactly 10 seconds. We've built an exclusive "Deep Link" technology that securely pairs your HireSkys profile with your chosen app.
      </p>

      <div class="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8">
        <ol class="list-decimal space-y-4 ml-4 text-slate-700 dark:text-slate-300 text-lg marker:text-indigo-500 marker:font-bold">
            <li class="pl-2">Log in to your <strong>HireSkys Dashboard</strong>.</li>
            <li class="pl-2">Complete your profile to let our AI know your top skills.</li>
            <li class="pl-2">Look for the <strong>Action Required</strong> banner at the top of your dashboard.</li>
            <li class="pl-2">Choose between <strong>Telegram</strong> (Free) or <strong>WhatsApp</strong> (VIP). The app will open automatically to authenticate your account!</li>
        </ol>
      </div>

      <div class="mt-16 p-8 bg-slate-900 dark:bg-black rounded-3xl text-center border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div class="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full"></div>
              <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full"></div>
          </div>

          <div class="relative z-10">
            <h3 class="text-2xl md:text-3xl font-black text-white mb-4">Don't let another developer steal your job.</h3>
            <p class="text-slate-300 mb-8 text-lg font-medium">Connect your account today and start claiming the best remote roles.</p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/login" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-emerald-500 text-white hover:bg-emerald-600 font-black rounded-xl transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/30 no-underline">
                    Connect WhatsApp VIP
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                </a>
                <a href="/login" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-slate-800 text-white hover:bg-slate-700 font-bold rounded-xl transition-transform hover:-translate-y-1 shadow-lg no-underline border border-slate-700">
                    Use Free Telegram
                </a>
            </div>
          </div>
      </div>
    `
  },
  {
    slug: 'why-remote-job-boards-are-broken',
    title: 'Quality > Quantity: Why 99% of Remote Job Boards are Failing You',
    excerpt: 'Most platforms boast about having 10,000+ jobs. We boast about having zero "Ghost Jobs". Here is how we fixed the broken remote hiring industry.',
    date: 'Mar 30, 2026',
    author: 'Talha',
    role: 'Founder, HireSkys',
    authorImage: '/founder.png',
    category: 'Behind The Scenes',
    image: '/blog-quality-update.png', 
    content: `
      <p class="lead text-2xl font-medium text-slate-600 dark:text-slate-300 mb-8">
        Let’s talk about the vanity metrics game. You go to a massive remote job board, and they proudly announce: "10,000+ Active Remote Jobs!" But when you actually start applying, the nightmare begins.
      </p>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        Over 60% of those listings are what we call <strong>"Ghost Jobs."</strong> They are jobs that were filled a month ago, jobs with broken links, or jobs scraped by lazy bots that just paste three lines of French into an English job feed. Candidates are spending hours tailoring resumes and sending them straight into a black hole.
      </p>
      
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-12">
        At <strong>HireSkys</strong>, we realized the industry didn't need <em>more</em> jobs. It needed <em>real</em> jobs. So, we completely rebuilt the curation process from the ground up.
      </p>

      <hr class="my-12 border-slate-200 dark:border-slate-800" />

      <h2 class="flex items-center gap-3 text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        The Flaw in Traditional Scrapers
      </h2>
      
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        Most platforms run fully automated scrapers. These bots grab everything they see without checking formatting, language, or relevance. Worse, these platforms set a default <strong>"60-day expiry rule."</strong>
      </p>

      <div class="bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 p-6 my-8 rounded-r-xl">
        <p class="italic font-medium text-rose-800 dark:text-rose-300 m-0 text-lg">
            "If a company hires someone in 2 days, the automated job boards will still show the job as 'Active' for another 58 days. That is thousands of wasted applications."
        </p>
      </div>

      <h2 class="flex items-center gap-3 text-3xl font-bold mt-16 mb-6 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        The HireSkys Solution: 100% Verification
      </h2>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        We decided to do things the hard way because it’s the right way. We limit our platform to about 50-60 new, hyper-targeted remote jobs a day. Here is our three-step formula that guarantees zero ghost jobs:
      </p>

      <div class="grid grid-cols-1 gap-6 my-10">
        
        <div class="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 items-start">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-indigo-600 dark:text-indigo-400 font-black text-xl">1</span>
            </div>
            <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Assisted Curation (Human + Bot)</h3>
                <p class="text-slate-600 dark:text-slate-400">
                    We use a custom bot, but it doesn't run wild. I manually feed it verified URLs. Every single job description is checked to ensure the formatting is clean, the requirements make sense, and the role is genuinely remote.
                </p>
            </div>
        </div>

        <div class="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 items-start">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <span class="text-indigo-600 dark:text-indigo-400 font-black text-xl">2</span>
            </div>
            <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Maximum 72-Hour Freshness</h3>
                <p class="text-slate-600 dark:text-slate-400">
                    If a job has been sitting on the internet for weeks, you won't find it here. We exclusively post jobs that are 1 to 3 days old. When you apply on HireSkys, you are always at the top of the pile.
                </p>
            </div>
        </div>

        <div class="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm flex gap-4 items-start relative overflow-hidden">
            <div class="absolute -right-4 -top-4 text-emerald-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 relative z-10">
                <span class="text-emerald-600 dark:text-emerald-400 font-black text-xl">3</span>
            </div>
            <div class="relative z-10">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">The "Anti-Ghost" Script</h3>
                <p class="text-slate-700 dark:text-slate-300 font-medium">
                    This is our secret weapon. Every single morning, our custom script pings the original source URL of every active job in our database. <strong>If the company takes the job down, it instantly shows as "Expired" on HireSkys.</strong> Even if the job was only live for 2 days, we kill it immediately. 
                </p>
            </div>
        </div>

      </div>

      <h2 class="flex items-center gap-3 text-3xl font-bold mt-16 mb-6 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Your Career, Protected
      </h2>

      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
        HireSkys isn't just a job board; it's a shield for your time and energy. We believe that your skills deserve to be seen by real humans, not buried under thousands of applications on an expired listing. 
      </p>
      
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
        By filtering out the noise, the scams, and the ghosts, we give you the ultimate unfair advantage. When you see a job on our platform, you know it's fresh, it's real, and the company is actively waiting for a candidate exactly like you. Stop playing the numbers game and start applying with absolute confidence.
      </p>

      <div class="mt-12 p-8 bg-slate-100 dark:bg-slate-800/50 rounded-3xl text-center border border-slate-200 dark:border-slate-700">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Stop applying to jobs that closed a month ago.</h3>
          <p class="text-slate-600 dark:text-slate-400 mb-8">Experience a job board that respects your time.</p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/" class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-full transition-all shadow-lg shadow-indigo-500/30 no-underline">
                  Browse Verified Jobs 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
          </div>
      </div>
    `
  }
];
