import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Terminal, MessageSquare, Video, FileText, DollarSign, ShieldAlert, Code, Quote, Lightbulb, Search, Cpu, Globe, Lock, Clock, TrendingUp } from 'lucide-react';

// --- SHARED STYLING COMPONENTS ---
export const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6 border-l-4 border-indigo-500 pl-4">
    {children}
  </h3>
);

export const H4 = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4 flex items-center gap-2">
    {children}
  </h4>
);

export const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 ${className}`}>
    {children}
  </p>
);

export const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="space-y-4 mb-8 pl-2">
    {children}
  </ul>
);

export const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-lg">
    <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
    <span>{children}</span>
  </li>
);

export const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-slate-900 text-slate-200 p-6 rounded-xl font-mono text-sm md:text-base overflow-x-auto mb-8 border border-slate-700 shadow-lg relative group">
    <div className="absolute top-2 right-2 text-xs text-slate-500 uppercase tracking-widest">Snippet</div>
    <pre>{children}</pre>
  </div>
);

export const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 mb-8 flex gap-4 items-start text-amber-900 dark:text-amber-100">
    <AlertTriangle className="w-6 h-6 shrink-0 mt-1 text-amber-600 dark:text-amber-400" />
    <div>{children}</div>
  </div>
);

export const SuccessBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-8 flex gap-4 items-start text-green-900 dark:text-green-100">
    <Lightbulb className="w-6 h-6 shrink-0 mt-1 text-green-600 dark:text-green-400" />
    <div>{children}</div>
  </div>
);

// --- MAIN DATA OBJECT ---
export const articles: Record<string, any> = {
  "resume-rule": {
    title: "The '6-Second' Resume Rule: The Ultimate ATS Survival Guide",
    date: "Dec 21, 2025",
    readTime: "25 min read",
    category: "Resume Guide",
    description: "Recruiters scan your resume for 6 seconds. Learn the psychological triggers, ATS hacking techniques, and the exact formatting that gets you hired.",
    content: (
      <>
        <P className="text-xl font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-8">
          The harsh reality of the modern job market is brutal: You are not being rejected by a human. You are being rejected by a database query first. Before a hiring manager ever sees your face or hears your voice, your resume must survive two lethal gatekeepers: the <strong>ATS (Applicant Tracking System)</strong> and the <strong>6-Second Human Skim</strong>. If you fail either, you don't exist. This guide breaks down exactly how to beat both.
        </P>
        
        <H3>1. The "F-Pattern" Psychology</H3>
        <P>Eye-tracking studies by the Nielsen Norman Group have revolutionized how we understand recruiter behavior. They show that recruiters scan resumes in a distinct "F" shape. They do not read word-for-word; they skim for specific data hooks to justify a "Yes" or "No". You must design your resume to fit this pattern.</P>
        <UL>
            <LI><strong>Zone 1 (Top Left - The Anchor):</strong> This is the most valuable real estate on the page. Do not waste it on a generic "Objective" statement or "References available upon request". Put your <strong>Target Job Title</strong> here (e.g., "Senior Full Stack Engineer"). This immediately frames how they should read the rest of the document. If you are applying for a Frontend role, the first word they see should be "Frontend Engineer".</LI>
            <LI><strong>Zone 2 (Top Right - The Contact):</strong> Keep it minimal. Email, Phone, GitHub URL, Portfolio URL, and LinkedIn. Remove your full physical address; it's a security risk and takes up space. A simple "New York, NY" suffices. Absolutely no photos, as they can lead to bias lawsuits and automatic rejection in the US/UK markets.</LI>
            <LI><strong>Zone 3 (The Left Margin):</strong> Your section headers act as signposts. They must be standard: "Experience", "Skills", "Projects", "Education". Don't get creative with "My Professional Journey" or "Where I've Been". The parser might not recognize these, and the recruiter won't have the patience to decipher them.</LI>
        </UL>

        <H3>2. ATS Hacking: The Invisible Filter</H3>
        <P>The ATS is a software (like Greenhouse, Lever, or Workday) that scores your resume based on keyword density relative to the specific job description. If you score below a hidden threshold (often 80%), you are archived without a human ever seeing your name.</P>
        
        <H4><Terminal size={20} className="text-indigo-500 inline"/> The Keyword Mirror Strategy</H4>
        <P>You must tailor your resume for <em>every single application</em>. Open the job description and highlight every hard skill (e.g., React, AWS, Docker, Kubernetes, CI/CD). Now look at your resume. Are those exact words present?</P>
        <WarningBox>
            <strong>Critical Warning:</strong> Do not use synonyms. If the Job Description asks for "React.js" and you write "Modern Frontend Frameworks", the bot might miss it. Use the <em>exact</em> spelling used in the job post. If they say "Go", you write "Go (Golang)". If they say "Amazon Web Services", don't just write "Cloud". Context matters to the machine.
        </WarningBox>
        <P>You should place a "Technical Skills" section right below your summary or contact info. This acts as a "keyword bucket" for the ATS to catch immediately.</P>

        <H3>3. The Google "X-Y-Z" Formula</H3>
        <P>Laszlo Bock (former VP of People at Google) revealed the formula for a perfect resume bullet point. Most people write job descriptions (what they were responsible for). You must write <em>achievements</em> (what you actually impacted). The formula is: <strong>"Accomplished [X] as measured by [Y], by doing [Z]"</strong>.</P>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border-l-4 border-red-500">
                <strong className="text-red-700 dark:text-red-300 block mb-2">❌ Average Candidate:</strong>
                <p className="text-slate-600 dark:text-slate-400">"Responsible for updating the company website and fixing bugs in the backend system to help customers."</p>
                <p className="text-xs mt-2 text-red-500 font-mono">Why it fails: It describes duties, not results. Anyone can be "responsible" for something and still do a bad job.</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border-l-4 border-green-500">
                <strong className="text-green-700 dark:text-green-300 block mb-2">✅ Top 1% Candidate:</strong>
                <p className="text-slate-600 dark:text-slate-400">"Reduced AWS infrastructure costs by <strong>25% ($12k/yr)</strong> [Y] by migrating legacy EC2 instances to <strong>Serverless Lambda functions</strong> [Z], improving load times by 2s [X]."</p>
                <p className="text-xs mt-2 text-green-600 font-mono">Why it wins: Specific metrics ($12k, 25%), specific tech (Lambda), and clear impact.</p>
            </div>
        </div>
        <P>Notice how the second example paints a picture of a problem solver, not just a code monkey. Numbers are the universal language of business. Even if you don't have exact numbers, estimate them conservatively.</P>

        <H3>4. Formatting Rules That Kill Chances</H3>
        <P>Designers love two-column resumes because they look pretty. Robots hate them. Here is the technical reason why you should stick to a single-column layout:</P>
        <UL>
            <LI><strong>Parsing Logic:</strong> Old ATS parsers read left-to-right across the whole page line by line. Two columns often scramble your text into gibberish (e.g., your "Skills" column gets merged into your "Experience" column, creating sentences like "Javascript Manager 2020").</LI>
            <LI><strong>No Progress Bars:</strong> Never use graphical bars to show skill level (e.g., "React: 80%"). What does that mean? 80% of Dan Abramov? 80% of a junior dev? It is subjective and meaningless. Just list the skill.</LI>
            <LI><strong>Font Choice:</strong> Stick to standard, sans-serif fonts like Arial, Helvetica, Roboto, or Open Sans. Times New Roman is dated. Custom downloaded fonts might not render on the recruiter's machine, turning your resume into squares.</LI>
            <LI><strong>Hyperlink Handling:</strong> Don't just write "Click Here". Write the full URL or anchor text clearly. Some ATS strip links entirely, leaving the recruiter with no way to find your portfolio. Write: "Portfolio: github.com/username".</LI>
        </UL>

        <SuccessBox>
            <strong>Pro Tip:</strong> Always save your resume as `Firstname_Lastname_Role.pdf`. Never send a Word doc unless explicitly asked. PDF preserves your formatting on every device. Also, ensure your PDF is "selectable" text, not an image export from Photoshop. If you can't highlight the text with your mouse, the robot can't read it.
        </SuccessBox>
      </>
    )
  },
  
  "zoom-interview": {
    title: "Mastering the Remote Interview: The Invisible Advantage",
    date: "Dec 20, 2025",
    readTime: "22 min read",
    category: "Interview Tips",
    description: "Your technical skills get you the interview. Your 'Remote Presence' gets you the job. Master lighting, audio, and the cheat-sheet strategy.",
    content: (
      <>
        <P className="text-xl font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-8">
            In a remote interview, you are not just a candidate; you are a TV producer. You control the lighting, the audio, the set design, and the script. Most candidates ignore this power and treat it like a phone call. By treating your interview like a production, you signal "professionalism" and "preparedness" before you even speak a word. Here is how to weaponize your environment.
        </P>

        <H3>1. The Setup: Don't Look Like a Hostage</H3>
        <P>If your video is grainy, pixelated, and you are backlit (dark face, bright background), you subconsciously signal "low quality" to the interviewer. You don't need a $2000 DSLR setup, you just need to understand basic physics and composition.</P>
        <UL>
            <LI><strong>Lighting Mastery:</strong> Never sit with a window behind you; you will look like a shadow witness. Face the window. If it's night or you have no window, put a lamp <em>behind</em> your laptop screen, bouncing off the wall behind the laptop. This creates a soft, diffused light on your face that hides imperfections.</LI>
            <LI><strong>Camera Angle Authority:</strong> Elevate your laptop on a stack of books or a shoebox. The camera lens should be at eye level or slightly above (hairline height). If the camera is looking up at you, it looks unflattering and you appear to be "looking down" on the interviewer. Eye-level builds trust and equality.</LI>
            <LI><strong>Background Psychology:</strong> A messy bed or open closet says "I am disorganized". A blank white wall says "I am boring". Ideally, have a bookshelf, a plant, or a clean depth of field behind you. This adds personality without distraction. Blur filters are okay, but a real clean background is better.</LI>
            <LI><strong>Audio Quality:</strong> Audio is more important than video. If they can't hear you clearly, they can't understand you. Use a headset or earphones with a dedicated mic. Do not use the laptop's built-in microphone as it picks up fan noise and typing sounds.</LI>
        </UL>

        <H3>2. The "Cheat Sheet" Superpower</H3>
        <P>This is the single biggest advantage of remote interviews over in-person ones. You can have notes that they cannot see. Treat it like an open-book exam where the other person thinks you've memorized everything.</P>
        
        <H4><FileText size={20} className="text-indigo-500 inline"/> The Tactical Setup:</H4>
        <UL>
            <LI><strong>Split Screen:</strong> Open your text editor (Notion/Obsidian) and resize it to take up 30% of your screen. Keep the Zoom window on the other 70%. Place the notes as close to the camera lens as possible so your eyes don't dart away.</LI>
            <LI><strong>The "Tell Me About Yourself" Script:</strong> Do not freestyle this. Have bullet points: Present (Current role & major win), Past (Relevant experience & skills), Future (Why this job fits your goals). Keep it under 2 minutes.</LI>
            <LI><strong>The "Hard Question" Bank:</strong> Write down answers for "What is your biggest weakness?" (Use a real weakness that you are actively fixing, e.g., "I sometimes focus too much on details, so now I use time-boxing") and "Tell me about a conflict". Don't read them verbatim, just glance for keywords to jog your memory.</LI>
            <LI><strong>Company Data:</strong> Have their "About Us" page values and recent news listed. Dropping a fact like "I saw you recently acquired X company" shows you did deep research.</LI>
        </UL>

        <H3>3. Psychological Hacks & Body Language</H3>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800 mb-8">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2"><Video size={20}/> The Eye Contact Illusion</h4>
            <p className="text-slate-700 dark:text-slate-300">
                This is counter-intuitive. When you speak, <strong>look at the camera lens</strong>, not the screen. To the interviewer, this looks like intense, confident eye contact. When they speak, look at the screen to read their facial expressions. <br/><br/>
                <strong>Tip:</strong> Put a sticky note with a smiley face or an arrow right next to your webcam lens. It reminds you where to look and reminds you to smile, which changes the tone of your voice to be more friendly.
            </p>
        </div>
        <P><strong>Posture:</strong> Lean in slightly. Leaning back signals disinterest or arrogance. Keep your hands visible occasionally; showing palms is a primal signal of honesty.</P>

        <H3>4. The "Technical Disaster" Plan</H3>
        <P>Murthy's Law applies to interviews: Internet <em>will</em> fail. Zoom <em>will</em> crash. Your mic <em>will</em> stop working. How you handle this panic moment determines if you are seen as "resilient" or "panicked".</P>
        <UL>
            <LI><strong>Hotspot Ready:</strong> Have your phone hotspot turned on and ready to connect instantly before the call starts. Know your password.</LI>
            <LI><strong>Audio Backup:</strong> Have wired headphones nearby. Bluetooth often fails or disconnects mid-sentence due to battery or pairing issues.</LI>
            <LI><strong>The Recovery Line:</strong> If you freeze and come back, say: <em>"Apologies, minor network blip. I was talking about [last point]. Shall I continue?"</em> Do not apologize profusely for 5 minutes. Be professional, acknowledge it, and move on immediately. They are hiring you to solve problems, show them how you solve this one.</LI>
        </UL>
      </>
    )
  },

  "salary-negotiation": {
    title: "Salary Negotiation: The $15k Email Template",
    date: "Dec 19, 2025",
    readTime: "30 min read",
    category: "Money Matters",
    description: "Negotiation isn't confrontation; it's collaboration. Use these exact scripts to increase your offer without being annoying.",
    content: (
      <>
        <P className="text-xl font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-8">
            Most developers lose $100,000+ over their career simply because they didn't ask for $5k more in their first job. Base salary compounds. Your next raise is a percentage of your current salary. Your next job offer is often based on your previous salary. Negotiation is mandatory, and recruiters expect it. In fact, they often have a pre-approved buffer of $5k-$15k specifically for this purpose, hoping you won't ask for it.
        </P>

        <H3>Phase 1: The Pre-Emptive Strike (The Screen)</H3>
        <P>Early in the interview process, usually the first call, recruiters will ask: <em>"What are your salary expectations?"</em> This is a trap designed to categorize you.</P>
        <WarningBox>
            <strong>Trap Alert:</strong> If you give a number now, you lose leverage. If you say too low, they cap you there immediately. If you say too high, they screen you out before you've had a chance to show your value.
        </WarningBox>
        <P><strong>The Winning Script:</strong></P>
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-indigo-500 italic text-lg text-slate-700 dark:text-slate-300 mb-8">
            "Right now, I'm focused on finding the best technical fit where I can add long-term value. I've done some market research, but I'd love to know what budget range you've allocated for this role so we can ensure we're aligned? I am flexible for the right opportunity."
        </div>
        <P>This forces them to reveal their hand first. If they insist, give a broad range (e.g., "$100k - $140k") based on market data, but qualify it with "depending on the full package".</P>

        <H3>Phase 2: The Offer Received</H3>
        <P>They call you. <em>"We'd like to offer you $100k!"</em>. Your heart races. You are relieved. You want to say yes immediately.</P>
        <P><strong>STOP.</strong> Do not say yes. Do not say no. Do not negotiate on the phone. Negotiation requires emotional detachment, which is hard to maintain on a call. You need time to calculate.</P>
        <P><strong>Say exactly this:</strong></P>
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-indigo-500 italic text-lg text-slate-700 dark:text-slate-300 mb-8">
            "Thank you so much! I'm really excited about the team and the project. Could you send over the full details including benefits, 401k, and equity in writing? I'll review everything with my family/mentors and get back to you within 48 hours."
        </div>
        <P>This buys you time, leverage, and allows you to craft a perfect email response. Silence is your friend here.</P>

        <H3>Phase 3: The Counter-Offer Email</H3>
        <P>Here is the exact email template that has generated thousands in raises. It works because it is polite, data-backed, and reaffirms your excitement. It frames the negotiation as "us vs the problem" not "me vs you".</P>
        <CodeBlock>
{`Subject: Re: Offer for [Role Name] - [Your Name]

Hi [Recruiter Name],

Thank you again for the offer. I've spent the last day reviewing the details, and I remain incredibly excited about the opportunity to join [Company] and tackle [Specific Problem discussed in interview].

I've reviewed the package details. Based on my research and the current market rate for Senior React roles with my experience in [Specialized Skill, e.g., Next.js Performance], I was expecting a base salary in the range of $120k - $130k.

If we can move the base to $125k, I would be ready to sign immediately and withdraw my other applications.

I'm keen to make this work as [Company] is my top choice.

Best,
[Your Name]`}
        </CodeBlock>
        <P>Why this works: "Ready to sign immediately" is a powerful trigger for recruiters. They want to close the role. You are giving them a guaranteed close in exchange for money.</P>

        <H3>Phase 4: What if they say "No"?</H3>
        <P>If they say "We have no budget flexibility" (which is often true for large corps with strict bands), pivot to non-monetary levers. "Total Compensation" (TC) is more than just base salary.</P>
        <UL>
            <LI><strong>Sign-on Bonus:</strong> "I understand the constraints on the base. Can we bridge the gap with a one-time $5k signing bonus?" (Easier for them as it comes from a different budget bucket that doesn't recur).</LI>
            <LI><strong>Equity/Stock (RSUs):</strong> "I'm bullish on the company's future. Can we increase the stock grant by 10%?"</LI>
            <LI><strong>Review Cycle:</strong> "Can we write into the contract that we will review salary in 6 months instead of 12, contingent on performance goals?"</LI>
            <LI><strong>Education/Hardware Stipend:</strong> "Can the company cover my AWS certification costs and a home office setup?"</LI>
            <LI><strong>Vacation Days:</strong> "Can we add an extra week of PTO?"</LI>
        </UL>
        <P>Always end the conversation on a positive note. Even if you accept the original offer, the fact that you negotiated professionally raises your status in their eyes.</P>
      </>
    )
  },

  "ghost-jobs": {
    title: "The Ghost Job Epidemic: How to Spot Fake Listings",
    date: "Dec 18, 2025",
    readTime: "18 min read",
    category: "Safety",
    description: "Why companies post jobs they never intend to fill, and the forensic clues you can use to avoid wasting your time.",
    content: (
      <>
        <P className="text-xl font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-8">
            You applied to 50 jobs this week. You heard nothing back. You start to think, "Am I unhireable?" The answer is likely no. The reality is that in 2025, an estimated 30-40% of online listings are "Ghost Jobs"—positions that don't actually exist or have already been filled but remain active.
        </P>

        <H3>1. Why do companies post fake jobs?</H3>
        <P>It seems counter-intuitive to waste money on ads for no reason, but there are dark incentives:</P>
        <UL>
            <LI><strong>The "Growth Illusion":</strong> Investors and competitors look at "Open Roles" as a metric of company health. Startups post jobs to look like they are growing rapidly to raise their next VC round, even if they have a hiring freeze.</LI>
            <LI><strong>Resume Harvesting:</strong> Third-party agencies collect resumes to build a massive database. They have no job today, but they want your data so they can spam you in 6 months when they do find a client.</LI>
            <LI><strong>Internal Pacification:</strong> To show overworked current employees that "Help is coming!" (even if it isn't). It keeps the current team from quitting out of burnout.</LI>
            <LI><strong>"Always Hiring" Mentality:</strong> They are looking for a "Unicorn". They aren't actively hiring, but if the perfect ex-Google engineer applies for cheap, they might make room. For everyone else, it's a black hole.</LI>
        </UL>

        <H3>2. Forensic Analysis: Is it Real?</H3>
        <P>Before you spend 30 minutes tailoring your resume and writing a cover letter, run this 1-minute audit:</P>
        
        <H4><ShieldAlert size={20} className="text-red-500 inline"/> The 48-Hour & Applicant Count Rule</H4>
        <P>Check the "Date Posted". If it says <strong>"Posted 30+ days ago"</strong>, be very skeptical. If it has <strong>"Over 1000 applicants"</strong>, the chances of your resume even being read are statistically zero. Real, urgent roles are filled or reposted within 2-3 weeks.</P>

        <H4><ShieldAlert size={20} className="text-red-500 inline"/> The Career Page Cross-Check</H4>
        <P>If you see a job on LinkedIn or Indeed, immediately go to the company's actual website career page. Is the job listed there? If it's on LinkedIn but NOT on their own site, it is likely an old auto-reposted listing that they forgot to delete. Do not apply.</P>
        <P><strong>Recruiter Activity:</strong> Look at the person who posted the job. Click their profile. Have they posted anything in the last month? If they haven't been active in 90 days, nobody is manning the ship.</P>

        <H3>3. The Dangerous Scams (Identity Theft)</H3>
        <P>Some "Ghost Jobs" are not just lazy; they are malicious phishing attacks designed to steal your identity.</P>
        <WarningBox>
            <strong>Major Red Flag:</strong> If they ask for your <strong>Social Security Number (SSN)</strong>, <strong>Driver's License scan</strong>, or <strong>Bank Account Info</strong> <em>before</em> you have signed an official offer letter, run. No legitimate company needs this for an application. They only need it for payroll <em>after</em> you are hired.
        </WarningBox>
        <P>Also, beware of interviews conducted entirely over "Text Chat" (Telegram, WhatsApp, Signal). No legitimate company hires without a video or voice call.</P>

        <H3>4. The "Check Equipment" Scam</H3>
        <P>This is the most common scam targeting remote workers.</P>
        <P><strong>The Pitch:</strong> "Welcome aboard! We need to set up your home office. We will send you a check for $3000. Deposit it, keep $200 for yourself, and use the rest to buy a MacBook and software from our 'Authorized Vendor'."</P>
        <P><strong>The Mechanic:</strong> The check is fake. Banks make funds available immediately by law (good faith), but the check actually takes weeks to clear. When it eventually bounces, the bank takes the money back from <em>your</em> account. You have already sent real money to the scammer (who is the 'Vendor'). You lose $3000, and the job never existed. Never accept a check to buy equipment. A real company will ship you the laptop.</P>
      </>
    )
  },

  "portfolio-guide": {
    title: "Building a 'Proof of Work' Portfolio (No Experience Required)",
    date: "Dec 15, 2025",
    readTime: "28 min read",
    category: "Portfolio",
    description: "A GitHub link isn't enough. Learn how to structure a 'Case Study' portfolio that proves to CTOs you can solve business problems.",
    content: (
      <>
        <P className="text-xl font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-8">
            The experience paradox is the bane of every junior developer: You need a job to get experience, but you need experience to get a job. The loophole? <strong>Permissionless Projects.</strong> You don't need a boss to tell you to build something complex. You just need to build it. But not all projects are created equal.
        </P>

        <H3>1. The "Tutorial Hell" Trap</H3>
        <P>Do not put a "To-Do List App", "Tic-Tac-Toe", or "Weather App" in your portfolio. Everyone coming out of a bootcamp has these. They scream "I followed a YouTube tutorial". They show you can type, not that you can think. Recruiters ignore these.</P>
        <P><strong>Build "Business Logic" Apps instead:</strong></P>
        <UL>
            <LI><strong>E-Commerce Dashboard:</strong> Don't just build the store front. Build the <em>admin dashboard</em>. Include charts for sales, inventory management tables, and Stripe integration. This shows you can handle data, state, and payments.</LI>
            <LI><strong>SaaS Clone (Slack/Trello):</strong> Shows you understand complex topics like WebSockets (real-time chat), Optimistic UI updates, and Role-Based Access Control (RBAC) (e.g., Admin vs User permissions).</LI>
            <LI><strong>Booking System (Airbnb/Calendly):</strong> Dealing with timezones, date availability, and overlapping bookings is hard. Solving this proves you have logic skills.</LI>
        </UL>

        <H3>2. The Secret Weapon: A Good README</H3>
        <P>Recruiters will <em>not</em> download your code and run `npm install`. They will judge you entirely on your README file. It must be a sales page for your code. It needs to tell a story.</P>
        
        <H4><Code size={20} className="text-indigo-500 inline"/> The Perfect Structure:</H4>
        <CodeBlock>
{`# Project Name (e.g., TaskMaster)

## 🚀 Live Demo
[Link to Vercel/Netlify Deployment] (MANDATORY - If not clickable, they leave)

## 🧐 The Problem
I needed a way to manage tasks specifically for remote teams with time-zone support, which Trello lacks.

## 🛠️ Tech Stack & Decisions
- **Next.js 14:** For Server Side Rendering and SEO.
- **Supabase (PostgreSQL):** Relational data model for complex user relationships.
- **Clerk:** For secure authentication and session management.
- **Zustand:** For global state management (chose over Redux for simplicity).

## 💡 Key Challenges Solved
1. **Optimistic UI:** Implemented immediate UI updates before server confirmation to reduce perceived latency.
2. **Real-time Sync:** Used WebSockets so two users editing a task see changes instantly.
3. **Performance:** Achieved 98/100 Lighthouse score via Image Optimization and Lazy Loading.
4. **Database Design:** Normalized schema to prevent data redundancy.`}
        </CodeBlock>

        <H3>3. Video Walkthroughs (Loom)</H3>
        <P>Embed a 60-second Loom video in your README walking through the features. "Here is how a user logs in, here is how we handle payments...".</P>
        <P>This proves <strong>communication skills</strong> + <strong>technical skills</strong> in one go. It shows you can explain technical concepts to humans. It is the highest ROI thing you can do for your portfolio. Most devs hide behind code; standing in front of a camera sets you apart.</P>

        <H3>4. Deployment is Non-Negotiable</H3>
        <P>If it's not live, it doesn't exist. Deploy frontend to Vercel or Netlify. Deploy backend to Railway, Render, or Fly.io. If a recruiter clicks your link and it's a 404 or takes 30 seconds to load, you are rejected immediately. Ensure your database is active and your API keys are secure (use Environment Variables).</P>
        <P><strong>Polish Matters:</strong> Use a favicon. specific title tags. Handle 404 pages. These small details show you care about the user experience.</P>
      </>
    )
  },

  "tools-trade": {
    title: "The Remote Worker's Toolkit: Tools You Must Know",
    date: "Dec 10, 2025",
    readTime: "20 min read",
    category: "Productivity",
    description: "Don't be the person who sends 'Hi' and waits. Master async communication tools like Loom, Linear, and Notion.",
    content: (
      <>
        <P className="text-xl font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-8">
            Remote work is not just "working from home". It is a different operating system. If you treat Slack like WhatsApp, you will fail. If you expect instant replies, you will be frustrated. You need to master the art of Asynchronous Work to survive in distributed teams.
        </P>

        <H3>1. Async Communication (The Golden Rule)</H3>
        <P>In an office, you tap someone on the shoulder. In remote work, that is harassment. You must communicate assuming the other person is asleep, in a different timezone, or in deep work. You must provide <strong>all context upfront</strong>.</P>
        
        <H4><MessageSquare size={20} className="text-indigo-500 inline"/> Slack Etiquette: No Naked Pings</H4>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-4 border border-red-200 dark:border-red-800">
            <strong>❌ Bad:</strong> "Hey John..." (waiting 20 mins) "Are you there?" (waiting) "Can you check this bug?" <br/>
            <em>This creates anxiety and wastes time. It forces a synchronous interrupt.</em>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-6 border border-green-200 dark:border-green-800">
            <strong>✅ Good:</strong> "Hey John, I'm stuck on the payment API issue. I tried X and Y, but got error Z. Here is a screenshot. No rush, let me know when you have a sec." <br/>
            <em>This gives them all the context they need to answer you whenever they come online. It respects their time.</em>
        </div>

        <H3>2. Loom: The Meeting Killer</H3>
        <P>Typing a complex bug report takes 20 minutes and is often misunderstood. Recording a video sharing your screen takes 2 minutes. Companies love Loom because it kills unnecessary Zoom meetings.</P>
        <SuccessBox>
            <strong>Pro Tip:</strong> Install the Loom Chrome extension. Use it for code reviews ("Hey, I saw this PR, just wanted to explain why I suggested this change...") and bug reports. It shows you value other people's time and have high empathy.
        </SuccessBox>

        <H3>3. Linear / Jira (Project Management)</H3>
        <P>You will not be told what to do every day. You pick tickets from the board. Familiarize yourself with <strong>Agile workflows</strong> (Sprints, Backlogs, Kanban).</P>
        <P>If you mention in an interview: <em>"I'm used to managing my own tasks in Linear, keeping ticket status updated, and linking PRs to issues"</em>, you sound like a senior engineer, not a junior who needs babysitting. Understand terms like "Blockers", "Velocity", and "Scope Creep".</P>

        <H3>4. Notion / Obsidian (Second Brain)</H3>
        <P>Remote companies run on written documentation. If it's not written down, it didn't happen.</P>
        <UL>
            <LI><strong>Meeting Notes:</strong> Always take notes during calls. Share them afterwards in the relevant channel. "Here is a summary of what we discussed and the action items."</LI>
            <LI><strong>Standard Operating Procedures (SOPs):</strong> If you do a task twice, write a guide for it. "How to setup the local environment", "How to deploy to staging". This creates leverage and makes you irreplaceable as a documentation culture builder.</LI>
        </UL>
        
        <H3>5. Security Basics</H3>
        <P>Remote work means you are your own IT department.</P>
        <UL>
            <LI><strong>Password Managers:</strong> Use 1Password or LastPass. Never reuse passwords.</LI>
            <LI><strong>2FA:</strong> Enable Two-Factor Authentication on everything, especially GitHub and AWS.</LI>
            <LI><strong>VPN:</strong> Use a VPN if you are working from a coffee shop to protect your traffic.</LI>
        </UL>
      </>
    )
  }
};