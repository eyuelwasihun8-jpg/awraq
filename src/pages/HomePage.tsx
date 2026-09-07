import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Play,
  Star,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Monitor,
  Video,
  Users,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Package,
  Mail,
  User,
  Search,
} from 'lucide-react';
import { Page, PurchaseRecord } from '../types';
import { COURSES, FREE_COURSES } from '../data/courses';
import { BUNDLES } from '../data/bundles';
import { DIGITAL_PRODUCTS } from '../data/digitalProducts';
import { FAQ_ITEMS } from '../data/faq';
import {
  Design3DIcon,
  Marketing3DIcon,
  Copywriting3DIcon,
  SEO3DIcon,
  Social3DIcon,
  Strategy3DIcon,
  Analytics3DIcon,
  Email3DIcon,
} from '../components/ThreeDIcons';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onOpenConsultation: () => void;
  onOpenSignIn: () => void;
  onOpenItemDetail: (item: any, type: 'course' | 'digital' | 'bundle') => void;
  isLoggedIn: boolean;
  purchaseHistory: PurchaseRecord[];
  progressData: Record<string, { completedLessons: string[], lastLessonId?: string }>;
}

const TRUSTED_BRANDS = [
  { name: 'khilx', logo: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788646530/mlwkgdh7gpqamarc9w1m.png', glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]', border: 'group-hover:border-blue-400', gradient: 'from-blue-400 to-cyan-300' },
  { name: 'mikiGarden', logo: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788646531/ole3ntzchzgko5gijpqm.png', glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]', border: 'group-hover:border-indigo-400', gradient: 'from-indigo-400 to-purple-400' },
  { name: 'muyalogy', logo: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788646643/v1hfnbl4ho8i4iyqaner.png', glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]', border: 'group-hover:border-green-400', gradient: 'from-green-400 to-emerald-300' },
  { name: 'yonile', logo: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788646527/ow9kr05nbwexoquamurr.png', glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]', border: 'group-hover:border-orange-400', gradient: 'from-orange-400 to-pink-500' },
  { name: 'miawa', logo: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788646530/qfzrx4ia32dfiqjz3mql.png', glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]', border: 'group-hover:border-red-400', gradient: 'from-red-400 to-rose-400' },
  { name: 'yango', logo: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788646518/n6qvt7yvlakch3l4ynsq.png', glow: 'group-hover:shadow-[0_0_30px_rgba(255,56,92,0.3)]', border: 'group-hover:border-rose-400', gradient: 'from-rose-400 to-orange-400' }
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenConsultation,
  onOpenItemDetail,
  isLoggedIn,
  purchaseHistory,
  progressData
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter States
  const [activeCourseCategory, setActiveCourseCategory] = useState<string>('All');
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');
  
  const [activeResourceCategory, setActiveResourceCategory] = useState<string>('All');
  const [resourceSearchQuery, setResourceSearchQuery] = useState<string>('');

  const courseCategories = useMemo(() => {
    const cats = new Set(COURSES.map(c => c.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const resourceCategories = useMemo(() => {
    const cats = new Set(DIGITAL_PRODUCTS.map(r => r.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredCourses = useMemo(() => {
    let filtered = COURSES;
    if (activeCourseCategory !== 'All') {
      filtered = filtered.filter(c => c.category === activeCourseCategory);
    }
    if (courseSearchQuery.trim()) {
      const query = courseSearchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [activeCourseCategory, courseSearchQuery]);

  const filteredResources = useMemo(() => {
    let filtered = DIGITAL_PRODUCTS;
    if (activeResourceCategory !== 'All') {
      filtered = filtered.filter(r => r.category === activeResourceCategory);
    }
    if (resourceSearchQuery.trim()) {
      const query = resourceSearchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [activeResourceCategory, resourceSearchQuery]);

  const heroStats = [
    { value: '3+ Years', label: 'Experience' },
    { value: '300+', label: 'Students Taught' },
    { value: '35+', label: 'Projects Completed' },
    { value: '96%', label: 'Satisfaction Rate' },
  ];

  const learningWays = [
    {
      title: 'Digital Programs',
      desc: 'Learn at your own pace with easy-to-follow digital courses that cover important marketing skills.',
      action: 'View Courses',
      onClick: () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }),
      icon: <Monitor className="w-8 h-8 text-[#07CCFD]" />
    },
    {
      title: 'Live Sessions',
      desc: 'Join live video sessions, learn from real examples, and ask questions directly.',
      action: 'Watch Free Sessions',
      onClick: () => document.getElementById('free-learning')?.scrollIntoView({ behavior: 'smooth' }),
      icon: <Video className="w-8 h-8 text-[#F86BCF]" />
    },
    {
      title: '1-on-1 Consultations',
      desc: 'Get personal help with your marketing goals, business strategy, or brand.',
      action: 'Book a Consultation',
      onClick: onOpenConsultation,
      icon: <Users className="w-8 h-8 text-[#FFCD00]" />
    }
  ];

  const masterAreas = [
    { title: 'Digital Marketing Strategies', desc: 'Learn how to plan your marketing and choose the right approach for your goals.', icon: Strategy3DIcon },
    { title: 'Copywriting', desc: "Learn how to write clear messages that get people's attention and encourage action.", icon: Copywriting3DIcon },
    { title: 'Social Media Marketing', desc: 'Learn how to create useful content and grow your presence on social media.', icon: Social3DIcon },
    { title: 'Analytics & Optimization', desc: 'Learn how to understand your results and improve your marketing.', icon: Analytics3DIcon },
    { title: 'SEO', desc: 'Learn how to help your website appear higher in search results.', icon: SEO3DIcon },
    { title: 'Email Marketing', desc: 'Learn how to create useful emails and communicate with your audience.', icon: Email3DIcon },
    { title: 'Content Marketing', desc: 'Learn how to plan and create content that people actually find useful.', icon: Marketing3DIcon },
    { title: 'Design & UX', desc: 'Bring ideas to life with simple, beautiful, and user-friendly design.', icon: Design3DIcon }
  ];

  const whyPoints = [
    { title: 'Learn the Basics', desc: 'Understand the most important ideas before moving to advanced topics.', gradient: 'from-[#07CCFD] to-[#3080E0]' },
    { title: 'Practice What You Learn', desc: 'Use what you learn immediately instead of only reading or watching.', gradient: 'from-[#9230F0] to-[#7C11FB]' },
    { title: 'Learn From Real Examples', desc: 'See how digital marketing ideas are used in real business situations.', gradient: 'from-[#F86BCF] to-[#7C11FB]' },
    { title: 'Keep Improving', desc: 'Build your skills over time and learn how to read your own results.', gradient: 'from-[#FFCD00] to-[#F86BCF]' }
  ];

  const customFaq = FAQ_ITEMS && FAQ_ITEMS.length > 0 ? FAQ_ITEMS : [
    { question: 'Do I need experience to start?', answer: 'No. Our sessions and programs are designed to be simple and suitable for beginners.' },
    { question: 'Are the sessions free?', answer: 'Yes, our introductory video sessions are completely free. Full courses and tools are paid.' },
    { question: 'How do the live sessions work?', answer: 'Live sessions are held on Zoom at scheduled times. You will get an email with the link.' },
    { question: 'Can I book a private consultation?', answer: 'Yes. You can book a one-on-one video call for personal advice on your business.' },
    { question: 'How do I access the courses after buying?', answer: 'You will get an email with a secure link to access all your videos and materials immediately.' }
  ];

  return (
    <div id="home-page-root" className="min-h-screen bg-[#0E0024] font-sans selection:bg-[#07CCFD]/30 overflow-x-hidden pb-0 relative">
      
      {/* ────────────────────────────────────────────────────────────
          GLOBAL ATMOSPHERIC GRADIENTS (Fixed Behind Everything)
      ──────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,_#7C11FB_0%,_transparent_50%)] opacity-40 blur-[120px]"></div>
        <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,_#3080E0_0%,_transparent_50%)] opacity-30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,_#F86BCF_0%,_transparent_50%)] opacity-20 blur-[120px]"></div>
        <div className="absolute top-[70%] right-[30%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,_#07CCFD_0%,_transparent_50%)] opacity-10 blur-[100px]"></div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          1. HERO SECTION
      ──────────────────────────────────────────────────────────── */}
      <section id="home" className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden z-10 border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="hidden lg:block absolute top-1/2 right-[4%] -translate-y-1/2 w-[820px] h-[820px] rounded-full border border-white/10"></div>
          <div className="hidden lg:block absolute top-1/2 right-[4%] -translate-y-1/2 w-[960px] h-[960px] rounded-full border border-dashed border-white/5"></div>
          
          <div className="absolute top-[14%] left-[6%] w-8 h-8 rounded-full bg-[#FFCD00] opacity-80 blur-[2px]"></div>
          <div className="absolute top-[10%] left-[46%] w-6 h-6 rounded-full bg-[#07CCFD] opacity-90 blur-[1px]"></div>
          <div className="absolute top-[62%] left-[16%] w-7 h-7 rounded-full bg-[#F86BCF] opacity-80 blur-[1px]"></div>
          <div className="absolute bottom-[10%] left-[38%] w-5 h-5 rounded-full bg-[#9230F0] opacity-90 blur-[2px]"></div>
          <div className="hidden lg:block absolute top-[8%] right-[24%] w-8 h-8 rounded-full bg-[#FFCD00] opacity-70 blur-[1px]"></div>
          <div className="hidden lg:block absolute bottom-[14%] right-[30%] w-10 h-10 rounded-full bg-[#F86BCF] opacity-60 blur-[2px]"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
            <div className="lg:w-1/2 space-y-6 pt-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold shadow-lg">
                <Sparkles className="w-4 h-4 text-[#FFCD00]" />
                <span>AWRAQ</span>
              </div>

              <h1 className="text-[3rem] sm:text-6xl lg:text-[4.5rem] font-black text-white leading-[1.05] tracking-tight drop-shadow-sm">
                Master Digital <br /> Marketing
              </h1>
              
              <p className="text-white/80 font-medium text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed pt-2">
                Learn digital marketing step by step and build skills you can use in your work, business, or personal brand.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-6">
                <button 
                  onClick={() => { document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#07CCFD] hover:bg-[#06b8e4] text-[#0F172A] text-base font-black shadow-[0_10px_30px_rgba(7,204,253,0.3)] border-b-[5px] border-[#05a3ca] hover:border-b-[2px] hover:translate-y-[3px] transition-all cursor-pointer"
                >
                  Start Learning
                </button>

                <button 
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-base font-bold shadow-lg border border-white/20 transition-all cursor-pointer"
                >
                  Book a Consultation
                </button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-6 pt-8 mt-4 border-t border-white/10">
                {heroStats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-x-8">
                    {idx !== 0 && <span className="hidden sm:block w-px h-9 bg-white/20" aria-hidden="true"></span>}
                    <div className="text-center lg:text-left">
                      <div className="text-2xl font-black text-white leading-none">{stat.value}</div>
                      <div className="text-xs font-semibold text-white/70 mt-1.5">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative flex justify-center items-center lg:mt-0 w-full min-h-[450px] sm:min-h-[550px] lg:min-h-[600px]">
              <div className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[550px] lg:h-[550px] mx-auto">
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD00] to-[#F86BCF] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] z-0 shadow-[0_0_50px_rgba(248,107,207,0.3)] transform rotate-6"></div>
                
                <img 
                  src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788609799/nj2utx1mmwop4fvaeo42.png" 
                  alt="Student learning"
                  className="absolute z-10 object-contain drop-shadow-2xl"
                  style={{ 
                    width: '100%', left: '50%', top: '8%', transform: 'translate(-50%, 15%) scale(1.5)',
                    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' 
                  }}
                />

                <div className="absolute -top-3 -right-3 sm:-top-5 sm:-right-6 group z-20 animate-[bounce_4s_infinite]">
                  <div className="absolute inset-0 bg-white/5 rounded-[22px] blur-lg opacity-50 transition-opacity"></div>
                  <div className="relative w-24 sm:w-28 rounded-[22px] bg-white/10 backdrop-blur-xl p-3 sm:p-3.5 shadow-2xl border border-white/20 flex flex-col items-center gap-1.5 sm:gap-2">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" className="text-white/20" strokeWidth="3" fill="none" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" className="text-[#07CCFD]" strokeWidth="3" strokeDasharray="96, 100" strokeLinecap="round" fill="none" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[11px] sm:text-xs">96%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-[11px] sm:text-xs leading-tight">Satisfaction</div>
                      <div className="text-white/70 text-[9px] sm:text-[10px] font-semibold">Rate</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[44%] -left-3 sm:-left-10 group z-20 hover:-translate-y-1 transition-transform cursor-pointer w-36 sm:w-44" onClick={() => { document.getElementById('free-learning')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <div className="absolute inset-0 bg-[#07CCFD]/20 rounded-[18px] blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative rounded-[18px] bg-white/10 backdrop-blur-xl p-3 sm:p-4 shadow-2xl border border-white/20">
                    <div className="flex -space-x-1.5 mb-2 sm:mb-3">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                           <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                      ))}
                    </div>
                    <div className="text-[#07CCFD] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1">Free Session</div>
                    <div className="text-white font-black text-xs sm:text-sm leading-snug mb-1.5 sm:mb-2">SEO Mastery for Beginners</div>
                    <div className="text-white/70 text-[10px] sm:text-[11px] font-semibold mb-2.5 sm:mb-3">45 minutes</div>
                    <button className="inline-flex items-center gap-1.5 bg-[#07CCFD] hover:bg-[#06b8e4] text-[#0F172A] text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors">
                      <Play className="w-3 h-3 fill-current" /> Play
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LEARN DIGITAL MARKETING THE SIMPLE WAY */}
      <section className="py-20 relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Learn Digital Marketing the <span className="text-[#07CCFD]">Simple Way</span>
          </h2>

          <div className="group relative mx-auto max-w-3xl">
            <div className="absolute -inset-3 rounded-[32px] bg-white/5 blur-2xl opacity-70 -z-10"></div>
            <div className="hidden sm:flex absolute -top-5 -right-5 items-center gap-2 bg-[#9230F0] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl z-20 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" /> Beginner Friendly
            </div>

            <div className="relative rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-8 py-10 sm:px-12 transition-all duration-700 ease-out group-hover:-translate-y-1 group-hover:border-white/30">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              <p className="text-lg text-white/80 font-medium leading-relaxed">
                Awraq helps you learn digital marketing through{' '}
                <span className="text-[#07CCFD] font-bold">practical courses, live video sessions, and simple guides</span>.
                Build skills that work in the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07CCFD] to-[#F86BCF] font-bold">real world</span>,
                and apply what you learn immediately to your own business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHOOSE HOW YOU LEARN */}
      <section id="learning" className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16 relative">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Choose How You Learn</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {learningWays.map((way, idx) => (
              <div key={idx} className="relative group cursor-pointer" onClick={way.onClick}>
                <div className="absolute -inset-1 bg-white/10 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                <div className={`relative bg-white/5 backdrop-blur-xl rounded-[20px] p-8 shadow-2xl border border-white/10 border-b-[6px] border-b-white/20 hover:border-b-[#07CCFD] transition-all duration-300 flex flex-col h-full`}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white/10 shadow-inner border border-white/10">
                    {way.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white">{way.title}</h3>
                  <p className="text-base leading-relaxed mb-8 font-medium flex-1 text-white/70">{way.desc}</p>
                  <div className="flex items-center justify-between text-sm font-bold text-white/60 group-hover:text-[#07CCFD] transition-colors pt-4 border-t border-white/10">
                    <span>{way.action}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-[#07CCFD] group-hover:text-[#0F172A] transition-colors shadow-sm"><ArrowRight className="w-4 h-4" /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU CAN LEARN */}
      <section className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">What You Can Learn</h2>
            <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto">Learn the core skills needed to build and grow a successful digital presence.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {masterAreas.map((area, idx) => {
              const Icon3D = area.icon;
              return (
                <div key={idx} className="relative group cursor-pointer" onClick={() => { document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <div className="absolute -inset-1 bg-white/10 rounded-[24px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-[20px] p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 border-b-[6px] border-b-white/20 group-hover:border-b-[#07CCFD] group-hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center">
                    <div className="w-24 h-24 mb-6 flex items-center justify-center filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                      <Icon3D size={80} />
                    </div>
                    <h3 className="text-xl font-black text-white leading-snug mb-3 group-hover:text-[#07CCFD] transition-colors">{area.title}</h3>
                    <p className="text-sm text-white/60 font-medium leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. LEARN SKILLS YOU CAN ACTUALLY USE */}
      <section className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Learn Skills You Can Actually Use</h2>
              <div className="group relative">
                <div className="absolute -inset-4 rounded-[28px] bg-[#07CCFD]/20 blur-2xl opacity-70 -z-10"></div>
                <div className="relative rounded-[24px] border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl px-6 py-7 sm:px-8 transition-all duration-700 ease-out group-hover:-translate-y-1 group-hover:border-white/40">
                  <p className="text-white/80 font-medium text-lg leading-relaxed">
                    We focus on <span className="text-[#07CCFD] font-bold">practical skills</span> you can use right away.
                    Learn exactly what to do, see real examples, and apply it immediately to your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07CCFD] to-[#F86BCF] font-bold">own work</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyPoints.map((point, idx) => (
                <div key={idx} className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl border-b-[4px] border-b-white/20 hover:border-b-[#07CCFD] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${point.gradient} text-white flex items-center justify-center mb-4 shadow-lg border border-white/20`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                  <p className="text-sm text-white/60 font-medium leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. START LEARNING FOR FREE */}
      <section id="free-learning" className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Start Learning for Free</h2>
            <p className="text-white/70 font-medium max-w-2xl mx-auto">Take our free introductory courses to understand the basics before committing to the full programs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {FREE_COURSES.slice(0, 3).map((course, idx) => {
              const isOwned = isLoggedIn && purchaseHistory.some(p => p.itemId === course.id);
              const progress = progressData[course.id];
              const isCompleted = isOwned && progress?.completedLessons.length === course.lessonsCount;
              const hasStarted = isOwned && (progress?.completedLessons.length || 0) > 0;

              let ctaText = 'Start Learning';
              if (isOwned) {
                ctaText = isCompleted ? 'Review Course' : (hasStarted ? 'Continue Learning' : 'Start Learning');
              }

              return (
                <div key={idx} className="relative group cursor-pointer" onClick={() => onOpenItemDetail(course, 'course')}>
                  <div className="absolute -inset-1 bg-white/10 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-[20px] p-5 shadow-2xl border border-white/10 border-b-[6px] border-b-white/20 group-hover:border-b-[#07CCFD] transition-all duration-300 flex flex-col h-full hover:-translate-y-2">
                    
                    <div className="relative rounded-2xl overflow-hidden mb-5 bg-[#0E0024] h-48 flex items-center justify-center shadow-inner border border-white/10">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:bg-[#07CCFD] group-hover:text-[#0F172A] group-hover:border-[#07CCFD] transition-all duration-300">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-[#07CCFD] text-[#0F172A] text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                        FREE COURSE
                      </div>
                    </div>

                    <div className="px-2 flex flex-col flex-1">
                      <h3 className="text-xl font-black text-white mb-3 leading-snug group-hover:text-[#07CCFD] transition-colors">{course.title}</h3>
                      <p className="text-sm text-white/60 line-clamp-2 mb-6 font-medium flex-1">{course.description}</p>
                      
                      <div className="flex items-center justify-between text-xs font-bold text-white/50 uppercase tracking-wider mb-4 border-t border-white/10 pt-4">
                        <div className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5 text-[#07CCFD]" /> {course.lessonsCount} Lessons</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#07CCFD]" /> {course.duration}</div>
                      </div>

                      <button className="w-full py-3.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-sm group-hover:bg-[#07CCFD] group-hover:text-[#0F172A] group-hover:border-[#07CCFD] transition-all flex items-center justify-center gap-2 mt-auto shadow-md">
                        <Play className="w-4 h-4 fill-current" />
                        <span>{ctaText}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. COURSES (WITH DYNAMIC CATEGORY FILTERS & SEARCH) */}
      <section id="courses" className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="text-[#07CCFD] font-black text-sm tracking-widest uppercase">Premium Programs</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Courses</h2>
            <p className="text-white/70 mt-2 text-base font-medium max-w-2xl mx-auto">Enroll in our step-by-step courses to build real marketing skills.</p>
          </div>

          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input 
              type="text" 
              placeholder="Search premium courses..." 
              value={courseSearchQuery}
              onChange={(e) => setCourseSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-full py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all shadow-lg"
            />
          </div>

          <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-3 mb-10 overflow-x-auto hide-scrollbar pb-4 px-4 w-full">
            {courseCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCourseCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  activeCourseCategory === category
                    ? 'bg-[#07CCFD] text-[#0F172A] shadow-[0_4px_15px_rgba(7,204,253,0.4)] border border-[#07CCFD]'
                    : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 border border-white/20 rounded-[24px] border-dashed bg-white/5">
              <p className="text-white/70 font-medium mb-4">No courses found matching your search.</p>
              <button 
                onClick={() => { setActiveCourseCategory('All'); setCourseSearchQuery(''); }} 
                className="text-[#07CCFD] font-bold hover:underline cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {filteredCourses.map((course) => {
                const isOwned = isLoggedIn && purchaseHistory.some(p => p.itemId === course.id);
                const progress = progressData[course.id];
                const isCompleted = isOwned && progress?.completedLessons.length === course.lessonsCount;
                const hasStarted = isOwned && (progress?.completedLessons.length || 0) > 0;

                let ctaText = 'View Course';
                if (isOwned) {
                  ctaText = isCompleted ? 'Review Course' : (hasStarted ? 'Continue Learning' : 'Start Learning');
                } else if (isLoggedIn) {
                  ctaText = 'Enroll Now';
                }

                return (
                  <div key={course.id} className="relative group cursor-pointer" onClick={() => onOpenItemDetail(course, 'course')}>
                    <div className="absolute -inset-1 bg-white/10 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    
                    <div className="relative bg-white/5 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-2xl border border-white/10 border-b-[6px] border-b-white/20 group-hover:border-b-[#07CCFD] transition-all duration-300 flex flex-col h-full z-10 hover:-translate-y-2">
                      
                      <div className="relative h-48 w-full overflow-hidden bg-[#0E0024] border-b border-white/10">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-100" />
                        <div className="absolute inset-0 shadow-[inset_0_-20px_30px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                        
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/20 shadow-md">
                          <Clock className="w-3.5 h-3.5 text-[#07CCFD]" />
                          {course.duration}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col p-6">
                        <span className="text-[#07CCFD] font-black text-[10px] uppercase tracking-wider mb-3 block bg-[#07CCFD]/10 w-max px-2.5 py-1 rounded border border-[#07CCFD]/30">
                          {course.category}
                        </span>
                        
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-xl font-black text-white leading-snug line-clamp-2 group-hover:text-[#07CCFD] transition-colors">{course.title}</h3>
                          <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-[#07CCFD] transition-colors shrink-0" />
                        </div>

                        <p className="text-sm text-white/60 line-clamp-2 mb-4 font-medium flex-1">{course.description}</p>

                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <img src={course.instructor.avatar} alt={course.instructor.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-sm" />
                            <div>
                              <div className="text-sm font-bold text-white">{course.instructor.name}</div>
                              <div className="text-[11px] font-bold text-white/50">Instructor</div>
                            </div>
                          </div>
                          <div className="text-xl font-black text-[#07CCFD]">
                            {isOwned ? (isCompleted ? 'Completed' : 'Purchased') : `ETB ${course.price.toFixed(2)}`}
                          </div>
                        </div>

                        <button className="w-full py-4 rounded-xl bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-black text-sm shadow-[0_8px_20px_rgba(7,204,253,0.3)] border-b-[4px] border-[#05A3CA] group-hover:border-b-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 mt-auto">
                          <span>{ctaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 8. DIGITAL RESOURCES (WITH DYNAMIC CATEGORY FILTERS & SEARCH) */}
      <section id="resources" className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Digital Resources</h2>
            <p className="text-white/70 font-medium max-w-2xl mx-auto">Download helpful templates, guides, and tools to save time.</p>
          </div>

          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input 
              type="text" 
              placeholder="Search digital resources..." 
              value={resourceSearchQuery}
              onChange={(e) => setResourceSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-full py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all shadow-lg"
            />
          </div>

          <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-3 mb-10 overflow-x-auto hide-scrollbar pb-4 px-4 w-full">
            {resourceCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveResourceCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  activeResourceCategory === category
                    ? 'bg-[#07CCFD] text-[#0F172A] shadow-[0_4px_15px_rgba(7,204,253,0.4)] border border-[#07CCFD]'
                    : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-16 border border-white/20 rounded-[24px] border-dashed bg-white/5">
              <p className="text-white/70 font-medium mb-4">No resources found matching your search.</p>
              <button 
                onClick={() => { setActiveResourceCategory('All'); setResourceSearchQuery(''); }} 
                className="text-[#07CCFD] font-bold hover:underline cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredResources.map((resource) => {
                const isOwned = isLoggedIn && purchaseHistory.some(p => p.itemId === resource.id);
                let ctaText = isOwned ? 'Access Resource' : (isLoggedIn ? 'Buy Resource' : 'View Details');

                return (
                  <div key={resource.id} className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 hover:border-white/30 hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden group" onClick={() => onOpenItemDetail(resource, 'digital')}>
                    <div className="h-40 w-full overflow-hidden bg-[#0E0024] relative border-b border-white/10">
                      <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 group-hover:opacity-100" />
                      <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-[#07CCFD] text-[10px] font-black px-2.5 py-1 rounded shadow-sm border border-white/20 uppercase tracking-wide">
                        {resource.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-black text-white text-lg mb-2 leading-tight group-hover:text-[#07CCFD] transition-colors">{resource.title}</h3>
                      <p className="text-sm text-white/60 mb-4 flex-1 line-clamp-3">{resource.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                        <span className={`font-black ${isOwned ? 'text-sm text-[#07CCFD]' : 'text-lg text-[#F86BCF]'}`}>
                          {isOwned ? 'Purchased' : `ETB ${resource.price.toFixed(2)}`}
                        </span>
                        <button className="text-xs font-bold text-[#0F172A] bg-[#07CCFD] hover:bg-[#06B8E4] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-md">
                          {ctaText} <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 9. COMPLETE BUNDLE */}
      {BUNDLES.length > 0 && (
        <section className="py-20 lg:py-24 relative z-10 border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center gap-10">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#07CCFD]/20 border border-[#07CCFD]/30 text-[#07CCFD] text-sm font-bold shadow-sm">
                  <Package className="w-4 h-4" />
                  <span>ALL-IN-ONE BUNDLE</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{BUNDLES[0].title}</h2>
                <p className="text-white/80 font-medium text-lg">
                  {BUNDLES[0].shortDescription}
                </p>
                <ul className="space-y-3 pt-2">
                  {BUNDLES[0].features.slice(0, 3).map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#07CCFD] shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="lg:w-1/2 w-full">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#07CCFD] to-[#F86BCF]"></div>
                  <div className="text-white/60 font-semibold mb-2">Complete Value</div>
                  
                  {isLoggedIn && purchaseHistory.some(p => p.itemId === BUNDLES[0].id) ? (
                    <div className="py-8">
                      <div className="w-20 h-20 bg-[#07CCFD]/20 border border-[#07CCFD]/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <CheckCircle2 className="w-10 h-10 text-[#07CCFD]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-6">You own this bundle</h3>
                      <button 
                        onClick={() => onNavigate('dashboard')}
                        className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-5xl font-black text-white mb-2 tracking-tight">ETB {BUNDLES[0].price.toFixed(2)}</div>
                      <div className="text-sm text-white/50 line-through mb-8">Normally ETB {BUNDLES[0].originalValue.toFixed(2)}</div>
                      
                      <button 
                        onClick={() => onOpenItemDetail(BUNDLES[0], 'bundle')}
                        className="w-full py-4 rounded-xl bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-black text-lg shadow-[0_8px_20px_rgba(7,204,253,0.3)] border-b-[4px] border-[#05A3CA] hover:border-b-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Package className="w-5 h-5" />
                        <span>Get Bundle</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. ABOUT AWRAQ & LAMLAK */}
      <section id="about" className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
            <div className="w-full md:w-5/12">
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg" 
                  alt="Lamlak - Founder of Awraq" 
                  className="w-full h-[500px] object-cover opacity-90"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8">
                  <div className="text-white font-black text-3xl mb-1">Lamlak</div>
                  <div className="text-[#07CCFD] font-bold text-sm tracking-wider uppercase">Founder & Educator</div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-7/12 space-y-6">
              <span className="text-[#07CCFD] font-bold text-sm tracking-widest uppercase bg-[#07CCFD]/10 border border-[#07CCFD]/20 px-3 py-1 rounded-full">About Awraq</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Making Digital Marketing Easy to Understand.
              </h2>
              <p className="text-lg text-white/70 font-medium leading-relaxed">
                Awraq was created to help people learn digital marketing without confusing business words. We believe anyone can master these skills with the right guidance and practical examples.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-[#07CCFD] shadow-sm mb-4">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">3+ Years of Experience</h3>
                  <p className="text-sm text-white/60 font-medium">Teaching marketing and helping businesses grow their presence online.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-[#F86BCF] shadow-sm mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Areas of Expertise</h3>
                  <p className="text-sm text-white/60 font-medium">Copywriting, Social Media Growth, and step-by-step Marketing Strategy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TRUSTED BY */}
      <section className="py-16 relative z-10 border-b border-white/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12 relative">
          <h2 className="text-3xl font-black text-white tracking-tight">Trusted By</h2>
          
          <div className="relative w-full flex items-center overflow-hidden py-8">
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#0E0024] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#0E0024] to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max animate-marquee items-center gap-8 md:gap-12 hover:[animation-play-state:paused] px-4">
              {[...TRUSTED_BRANDS, ...TRUSTED_BRANDS, ...TRUSTED_BRANDS].map((brand, idx) => (
                <div key={idx} className="relative group shrink-0 w-64 h-32 md:w-72 md:h-36 cursor-pointer">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${brand.gradient} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:-translate-y-2`}></div>
                  <div className={`relative h-full w-full bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 flex items-center justify-center p-5 md:p-6 transition-all duration-500 group-hover:-translate-y-2 shadow-xl`}>
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain filter opacity-70 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. TESTIMONIALS */}
      <section className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">What Learners Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { quote: 'Awraq made digital marketing much easier for me to understand. I finally knew what I should focus on.', author: 'Client Name', role: 'Business Owner' },
              { quote: 'The lessons were simple, practical, and easy to follow. I used the templates right away.', author: 'Client Name', role: 'Freelancer' }
            ].map((review, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -inset-1 bg-white/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/10 border-b-[6px] border-b-white/20 group-hover:border-b-[#07CCFD] transition-all hover:-translate-y-2 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FFCD00] text-[#FFCD00]" />
                    ))}
                  </div>
                  <p className="text-white/80 font-medium text-lg italic mb-8 flex-1 leading-relaxed">
                    "{review.quote}"
                  </p>
                  <div className="pt-6 border-t border-white/10">
                    <div className="text-base font-bold text-white">{review.author}</div>
                    <div className="text-xs font-bold text-[#07CCFD] mt-1">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQ SECTION */}
      <section className="py-20 relative z-10 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {customFaq.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 border-b-[4px] border-b-white/20 overflow-hidden shadow-lg hover:border-b-[#07CCFD] hover:-translate-y-1 transition-all">
                  <button onClick={() => setOpenFaqIndex(isOpen ? null : index)} className="w-full px-6 py-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-lg font-black text-white">{item.question}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all border border-white/20 shadow-inner ${isOpen ? 'bg-[#07CCFD] text-[#0F172A] border-[#07CCFD] rotate-180' : 'bg-white/10 text-white/70'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-white/70 text-base font-medium leading-relaxed border-t border-white/10">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14. CONTACT SECTION */}
      <section id="contact" className="py-20 lg:py-28 relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Contact Us</h2>
            <p className="text-white/70 text-lg font-medium">Have a question or need help? Send us a message.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[28px] p-8 md:p-10">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80">Name</label>
                  <input type="text" placeholder="Your Name" className="w-full bg-[#0E0024]/50 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full bg-[#0E0024]/50 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/80">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full bg-[#0E0024]/50 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/80">Message</label>
                <textarea rows={4} placeholder="Write your message here..." className="w-full bg-[#0E0024]/50 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-black shadow-[0_8px_20px_rgba(7,204,253,0.3)] border-b-[4px] border-[#05A3CA] hover:border-b-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 15. FINAL CTA */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Ready to Start Learning?
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto font-medium">
            Choose a free session, explore our programs, or get personal help with your marketing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <button onClick={() => { document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#07CCFD] hover:bg-[#06b8e4] text-[#0F172A] text-lg font-black shadow-[0_10px_30px_rgba(7,204,253,0.3)] border-b-[5px] border-[#05a3ca] hover:border-b-[2px] hover:translate-y-[3px] transition-all cursor-pointer">
              Start Learning
            </button>
            <button onClick={onOpenConsultation} className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white/10 text-white border border-white/20 text-lg font-bold shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:bg-white/20 transition-all cursor-pointer">
              Book a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Global Embedded Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
    </div>
  );
};