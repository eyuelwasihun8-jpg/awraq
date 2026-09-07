import type { Course } from '../types';
import { DEFAULT_INSTRUCTOR } from './instructors';

/**
 * Course catalogue.
 *
 * Every lesson carries a real `videoUrl`. Where content isn't produced yet the
 * value is `null` and the player renders an explicit "not published" state —
 * the previous build had no video field at all and shipped a decorative play
 * button that did nothing (AUDIT.md §C2).
 *
 * The sample sources below are Google's public test streams, standing in for
 * the real CDN. In production these become short-lived signed HLS manifests.
 */

const SAMPLE = {
  a: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  b: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  c: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  d: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
} as const;

export const COURSES: Course[] = [
  {
    kind: 'course',
    id: 'masterclass',
    slug: 'complete-digital-marketing-masterclass',
    title: 'Complete Digital Marketing Masterclass',
    title_am: 'ሙሉ የዲጂታል ግብይት ማስተርክላስ',
    category: 'Full Course',
    category_am: 'ሙሉ ኮርስ',
    summary:
      'Strategy, content, SEO, email and analytics — the whole system, in one course.',
    summary_am: 'ስትራቴጂ፣ ይዘት፣ SEO፣ ኢሜይል እና ትንተና — ሙሉው ሥርዓት በአንድ ኮርስ ውስጥ።',
    description:
      'This is the course to take if you want the complete picture. You will build a marketing plan for your own business as you go, module by module, and finish with a system you can run every month instead of a list of tactics you forget.',
    description_am:
      'ሙሉውን ምስል ማየት ከፈለጋችሁ የምትወስዱት ኮርስ ይህ ነው። እየተማራችሁ ለራሳችሁ ንግድ የግብይት ዕቅድ ትገነባላችሁ፤ ሞጁል በሞጁል፤ በመጨረሻም የምትረሱት የዘዴዎች ዝርዝር ሳይሆን በየወሩ የምታሠሩት ሥርዓት ይኖራችኋል።',
    price: 199,
    originalPrice: 289,
    duration: '14 hr 30 mins',
    level: 'All Levels',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=75',
    instructor: DEFAULT_INSTRUCTOR,
    isPopular: true,
    status: 'published',
    publishedAt: '2025-02-11',
    highlights: [
      'A step-by-step plan for your entire marketing system',
      'Audit sheets and a budget calculator you keep',
      'Real examples from Ethiopian businesses',
      'Lifetime access, including future updates',
    ],
    highlights_am: [
      'ለሙሉ የግብይት ሥርዓታችሁ ደረጃ በደረጃ ዕቅድ',
      'የምትይዟቸው የኦዲት ሉሆች እና የበጀት ማስያ',
      'ከኢትዮጵያ ንግዶች የተወሰዱ ተጨባጭ ምሳሌዎች',
      'የዕድሜ ልክ ተደራሽነት፤ የወደፊት ዝማኔዎችን ጨምሮ',
    ],
    outcomes: [
      'Write a one-page marketing plan for your business',
      'Choose the right channel for your budget instead of trying all of them',
      'Read your own numbers and know what to change next',
      'Build a content routine you can actually keep up with',
    ],
    outcomes_am: [
      'ለንግዳችሁ የአንድ ገጽ የግብይት ዕቅድ መጻፍ',
      'ሁሉንም ከመሞከር ይልቅ ለበጀታችሁ ትክክለኛውን መንገድ መምረጥ',
      'የራሳችሁን ቁጥሮች አንብቦ ቀጥሎ ምን መቀየር እንዳለበት ማወቅ',
      'በእውነት ልትቀጥሉበት የምትችሉት የይዘት ልማድ መገንባት',
    ],
    requirements: [
      'No marketing background needed',
      'A business, side project or personal brand to practise on',
    ],
    requirements_am: [
      'ምንም የግብይት ልምድ አያስፈልግም',
      'ልትለማመዱበት የምትችሉት ንግድ፣ ተጓዳኝ ፕሮጀክት ወይም የግል ብራንድ',
    ],
    modules: [
      {
        id: 'mc-m1',
        title: 'Strategy & Finding Your Audience',
        title_am: 'ስትራቴጂ እና ታዳሚዎችን ማግኘት',
        description: 'Work out who actually buys from you, and what makes your offer different.',
        description_am: 'በእውነት ከእናንተ የሚገዛው ማን እንደሆነ እና አቅርቦታችሁን የተለየ የሚያደርገው ምን እንደሆነ ይወስኑ።',
        lessons: [
          {
            id: 'mc-m1-l1',
            title: 'Understand Your Customer',
            title_am: 'ደንበኛችሁን ይረዱ',
            type: 'video',
            duration: '12:45',
            videoUrl: SAMPLE.a,
            isPreview: true,
            description:
              'Most marketing fails because it talks to everyone. In this lesson you narrow down to the one person worth talking to.',
            description_am:
              'አብዛኛው ግብይት የሚከሽፈው ለሁሉም ሰው ስለሚናገር ነው። በዚህ ትምህርት ማነጋገር ወደሚገባው አንድ ሰው ትጠባላችሁ።',
          },
          {
            id: 'mc-m1-l2',
            title: 'Creating Your Core Offer',
            title_am: 'ዋና አቅርቦታችሁን መፍጠር',
            type: 'video',
            duration: '18:20',
            videoUrl: SAMPLE.b,
          },
          {
            id: 'mc-m1-l3',
            title: 'Mapping How People Buy',
            title_am: 'ሰዎች እንዴት እንደሚገዙ መሳል',
            type: 'reading',
            duration: '08:00',
            videoUrl: null,
            body: 'Nobody buys on first contact. This reading walks through the five stages a customer moves through — unaware, aware, considering, deciding, buying — and what your job is at each one.\n\nWrite down, for your own business, one thing you could publish for each stage. That list is your content plan for the next month.',
            body_am:
              'ማንም በመጀመሪያ ንክኪ አይገዛም። ይህ ንባብ ደንበኛ የሚያልፍባቸውን አምስት ደረጃዎች — ያለማወቅ፣ ማወቅ፣ ማሰብ፣ መወሰን፣ መግዛት — እና በእያንዳንዱ ላይ ሥራችሁ ምን እንደሆነ ያብራራል።\n\nለራሳችሁ ንግድ ለእያንዳንዱ ደረጃ ልታሳትሙት የምትችሉትን አንድ ነገር ጻፉ። ያ ዝርዝር ለሚቀጥለው ወር የይዘት ዕቅዳችሁ ነው።',
          },
        ],
      },
      {
        id: 'mc-m2',
        title: 'Clear Copywriting & Content',
        title_am: 'ግልጽ ጽሑፍ እና ይዘት',
        description: 'Write simple messages that move people to act.',
        description_am: 'ሰዎችን ወደ ተግባር የሚያንቀሳቅሱ ቀላል መልእክቶችን ይጻፉ።',
        lessons: [
          {
            id: 'mc-m2-l1',
            title: 'How to Write Clear Sentences',
            title_am: 'ግልጽ ዓረፍተ ነገሮችን እንዴት መጻፍ እንደሚቻል',
            type: 'video',
            duration: '16:05',
            videoUrl: SAMPLE.c,
          },
          {
            id: 'mc-m2-l2',
            title: 'Hooking Attention on Social Media',
            title_am: 'በማኅበራዊ ሚዲያ ትኩረት መሳብ',
            type: 'video',
            duration: '11:30',
            videoUrl: SAMPLE.d,
          },
        ],
      },
      {
        id: 'mc-m3',
        title: 'Getting Traffic — SEO & Social',
        title_am: 'ጎብኚ ማምጣት — SEO እና ማኅበራዊ ሚዲያ',
        lessons: [
          {
            id: 'mc-m3-l1',
            title: 'Finding Keywords on Google',
            title_am: 'በGoogle ላይ ቁልፍ ቃላትን ማግኘት',
            type: 'video',
            duration: '22:15',
            videoUrl: SAMPLE.a,
          },
          {
            id: 'mc-m3-l2',
            title: 'Turning One Idea Into Five Posts',
            title_am: 'አንድ ሐሳብን ወደ አምስት ጽሑፎች መቀየር',
            type: 'video',
            duration: '19:00',
            videoUrl: SAMPLE.b,
          },
        ],
      },
      {
        id: 'mc-m4',
        title: 'Email Marketing & Follow-Up',
        title_am: 'የኢሜይል ግብይት እና ክትትል',
        lessons: [
          {
            id: 'mc-m4-l1',
            title: 'Your 5-Day Welcome Sequence',
            title_am: 'የ5 ቀን የእንኳን ደህና መጣችሁ ተከታታይ ኢሜይል',
            type: 'video',
            duration: '17:50',
            videoUrl: SAMPLE.c,
          },
          {
            id: 'mc-m4-l2',
            title: 'How to Group Your Email List',
            title_am: 'የኢሜይል ዝርዝራችሁን እንዴት መከፋፈል እንደሚቻል',
            type: 'video',
            duration: '13:25',
            videoUrl: SAMPLE.d,
          },
        ],
      },
      {
        id: 'mc-m5',
        title: 'Analytics & Improving Results',
        title_am: 'ትንተና እና ውጤትን ማሻሻል',
        lessons: [
          {
            id: 'mc-m5-l1',
            title: 'Reading Your Website Numbers',
            title_am: 'የድረ-ገጻችሁን ቁጥሮች ማንበብ',
            type: 'video',
            duration: '21:10',
            videoUrl: SAMPLE.a,
          },
          {
            id: 'mc-m5-l2',
            title: 'Testing Simple Changes',
            title_am: 'ቀላል ለውጦችን መሞከር',
            type: 'video',
            duration: '14:45',
            videoUrl: SAMPLE.b,
          },
        ],
      },
    ],
  },

  {
    kind: 'course',
    id: 'copywriting',
    slug: 'copywriting-that-sells',
    title: 'Copywriting That Sells',
    title_am: 'የሚሸጥ ጽሑፍ አጻጻፍ',
    category: 'Copywriting',
    category_am: 'ጽሑፍ አጻጻፍ',
    summary: 'Write product pages, ads and emails people actually respond to.',
    summary_am: 'ሰዎች በእውነት ምላሽ የሚሰጡባቸውን የምርት ገጾች፣ ማስታወቂያዎች እና ኢሜይሎች ይጻፉ።',
    description:
      'A short, practical course on writing that gets a response. You rewrite your own homepage, one ad and one email during the course, and leave with templates you can reuse.',
    description_am:
      'ምላሽ የሚያገኝ አጻጻፍ ላይ ያተኮረ አጭር እና ተግባራዊ ኮርስ። በኮርሱ ወቅት የራሳችሁን መነሻ ገጽ፣ አንድ ማስታወቂያ እና አንድ ኢሜይል ትጽፋላችሁ፤ እንደገና ልትጠቀሙባቸው የምትችሉ አብነቶችንም ይዛችሁ ትወጣላችሁ።',
    price: 149,
    originalPrice: 199,
    duration: '5 hr 10 mins',
    level: 'Beginner',
    thumbnail:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=75',
    instructor: DEFAULT_INSTRUCTOR,
    status: 'published',
    publishedAt: '2025-05-02',
    highlights: [
      'A headline formula you can apply in minutes',
      'Before/after rewrites of real Ethiopian business pages',
      '12 reusable templates for ads, emails and product pages',
    ],
    highlights_am: [
      'በደቂቃዎች ውስጥ ተግባራዊ የምታደርጉት የርዕስ ቀመር',
      'የእውነተኛ የኢትዮጵያ ንግድ ገጾች ከመስተካከል በፊት እና በኋላ',
      'ለማስታወቂያ፣ ኢሜይል እና የምርት ገጾች 12 እንደገና የሚያገለግሉ አብነቶች',
    ],
    outcomes: [
      'Write a headline that says what you do in one line',
      'Turn a feature list into reasons someone should care',
      'Edit your own writing down to half the words',
    ],
    outcomes_am: [
      'የምታደርጉትን በአንድ መስመር የሚገልጽ ርዕስ መጻፍ',
      'የባህሪያት ዝርዝርን ሰው ሊያስብበት ወደሚገባ ምክንያት መቀየር',
      'የራሳችሁን ጽሑፍ ወደ ግማሽ ቃላት ማሳጠር',
    ],
    modules: [
      {
        id: 'cw-m1',
        title: 'The Foundations',
        title_am: 'መሠረቶቹ',
        lessons: [
          {
            id: 'cw-m1-l1',
            title: 'What Copywriting Actually Is',
            title_am: 'ጽሑፍ አጻጻፍ በእውነት ምንድን ነው',
            type: 'video',
            duration: '09:30',
            videoUrl: SAMPLE.a,
            isPreview: true,
          },
          {
            id: 'cw-m1-l2',
            title: 'Features vs. Reasons to Care',
            title_am: 'ባህሪያት እና የሚያሳስቡ ምክንያቶች',
            type: 'video',
            duration: '14:20',
            videoUrl: SAMPLE.b,
          },
        ],
      },
      {
        id: 'cw-m2',
        title: 'Headlines & Hooks',
        title_am: 'ርዕሶች እና መሳቢያዎች',
        lessons: [
          {
            id: 'cw-m2-l1',
            title: 'Six Headline Patterns',
            title_am: 'ስድስት የርዕስ ዘይቤዎች',
            type: 'video',
            duration: '17:40',
            videoUrl: SAMPLE.c,
          },
          {
            id: 'cw-m2-l2',
            title: 'Rewriting a Real Homepage',
            title_am: 'እውነተኛ መነሻ ገጽን እንደገና መጻፍ',
            type: 'video',
            duration: '21:15',
            videoUrl: SAMPLE.d,
          },
        ],
      },
    ],
  },

  {
    kind: 'course',
    id: 'social-growth',
    slug: 'social-media-growth-system',
    title: 'Social Media Growth System',
    title_am: 'የማኅበራዊ ሚዲያ ዕድገት ሥርዓት',
    category: 'Social Media',
    category_am: 'ማኅበራዊ ሚዲያ',
    summary: 'A repeatable weekly routine for Instagram, TikTok and Telegram.',
    summary_am: 'ለInstagram፣ TikTok እና ቴሌግራም የሚደጋገም ሳምንታዊ ልማድ።',
    description:
      'Built for people who post inconsistently and burn out. You leave with a weekly routine that takes about three hours and a 30-day content calendar already filled in.',
    description_am:
      'በተቆራረጠ መንገድ ለሚለጥፉ እና ለሚደክሙ ሰዎች የተሠራ። ወደ ሦስት ሰዓት የሚወስድ ሳምንታዊ ልማድ እና አስቀድሞ የተሞላ የ30 ቀን የይዘት የቀን መቁጠሪያ ይዛችሁ ትወጣላችሁ።',
    price: 129,
    duration: '6 hr 45 mins',
    level: 'Beginner',
    thumbnail:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=75',
    instructor: DEFAULT_INSTRUCTOR,
    status: 'published',
    publishedAt: '2025-06-18',
    highlights: [
      'A three-hour weekly routine that covers all platforms',
      'A 30-day calendar filled in for you',
      'How to repurpose one video into a week of posts',
    ],
    highlights_am: [
      'ሁሉንም መድረኮች የሚሸፍን የሦስት ሰዓት ሳምንታዊ ልማድ',
      'ለእናንተ የተሞላ የ30 ቀን የቀን መቁጠሪያ',
      'አንድ ቪዲዮን ወደ አንድ ሳምንት ልጥፎች እንዴት መቀየር እንደሚቻል',
    ],
    outcomes: [
      'Publish consistently without spending every evening on it',
      'Know which numbers matter and which to ignore',
      'Build a content bank so you are never starting from zero',
    ],
    outcomes_am: [
      'እያንዳንዱን ምሽት ሳታጠፉ በተከታታይ ማሳተም',
      'የትኞቹ ቁጥሮች እንደሚያስፈልጉ እና የትኞቹን ችላ ማለት እንዳለባችሁ ማወቅ',
      'ከዜሮ እንዳትጀምሩ የይዘት ማከማቻ መገንባት',
    ],
    modules: [
      {
        id: 'sg-m1',
        title: 'The Weekly Routine',
        title_am: 'ሳምንታዊው ልማድ',
        lessons: [
          {
            id: 'sg-m1-l1',
            title: 'Batching: Record Once, Post All Week',
            title_am: 'በጥቅል መሥራት፡ አንዴ ቀርጹ፣ ሳምንቱን ሙሉ ለጥፉ',
            type: 'video',
            duration: '15:10',
            videoUrl: SAMPLE.a,
            isPreview: true,
          },
          {
            id: 'sg-m1-l2',
            title: 'Your 30-Day Calendar',
            title_am: 'የ30 ቀን የቀን መቁጠሪያችሁ',
            type: 'resource',
            duration: '05:00',
            videoUrl: null,
            attachments: [
              {
                id: 'sg-cal',
                name: '30-Day-Content-Calendar.xlsx',
                name_am: 'የ30-ቀን-የይዘት-የቀን-መቁጠሪያ.xlsx',
                size: '240 KB',
                type: 'Excel',
                url: null,
              },
            ],
          },
        ],
      },
      {
        id: 'sg-m2',
        title: 'Platform Tactics',
        title_am: 'የመድረክ ዘዴዎች',
        lessons: [
          {
            id: 'sg-m2-l1',
            title: 'Telegram for Ethiopian Audiences',
            title_am: 'ቴሌግራም ለኢትዮጵያ ታዳሚዎች',
            type: 'video',
            duration: '18:30',
            videoUrl: SAMPLE.b,
          },
          {
            id: 'sg-m2-l2',
            title: 'Short-Form Video That Holds Attention',
            title_am: 'ትኩረት የሚይዝ አጭር ቪዲዮ',
            type: 'video',
            duration: '20:05',
            videoUrl: SAMPLE.c,
          },
        ],
      },
    ],
  },

  {
    kind: 'course',
    id: 'analytics',
    slug: 'marketing-analytics-made-simple',
    title: 'Marketing Analytics Made Simple',
    title_am: 'የግብይት ትንተና በቀላሉ',
    category: 'Analytics',
    category_am: 'ትንተና',
    summary: 'Stop guessing. Learn the six numbers that tell you what to do next.',
    summary_am: 'መገመትን አቁሙ። ቀጥሎ ምን ማድረግ እንዳለባችሁ የሚነግሯችሁን ስድስት ቁጥሮች ተማሩ።',
    description:
      'Analytics without the dashboards nobody reads. You set up tracking once, then learn to answer three questions every month: what is working, what is wasting money, and what to try next.',
    description_am:
      'ማንም የማያነባቸው ዳሽቦርዶች የሌሉበት ትንተና። ክትትልን አንዴ ታዘጋጃላችሁ፤ ከዚያም በየወሩ ሦስት ጥያቄዎችን መመለስ ትማራላችሁ፡ ምን እየሠራ ነው፣ ምን ገንዘብ እያባከነ ነው፣ እና ቀጥሎ ምን መሞከር አለበት።',
    price: 169,
    originalPrice: 209,
    duration: '4 hr 20 mins',
    level: 'Intermediate',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=75',
    instructor: DEFAULT_INSTRUCTOR,
    status: 'published',
    publishedAt: '2025-07-30',
    highlights: [
      'A one-page monthly report template',
      'Set up Google Analytics properly, once',
      'The six numbers that actually change decisions',
    ],
    highlights_am: [
      'የአንድ ገጽ ወርሃዊ ሪፖርት አብነት',
      'Google Analytics ን በአግባቡ አንዴ ማዘጋጀት',
      'በእውነት ውሳኔዎችን የሚቀይሩት ስድስት ቁጥሮች',
    ],
    outcomes: [
      'Set up tracking that answers real questions',
      'Produce a monthly one-page report in 20 minutes',
      'Spot a channel that is losing money before it drains the budget',
    ],
    outcomes_am: [
      'እውነተኛ ጥያቄዎችን የሚመልስ ክትትል ማዘጋጀት',
      'ወርሃዊ የአንድ ገጽ ሪፖርት በ20 ደቂቃ ማዘጋጀት',
      'በጀቱን ከማሟጠጡ በፊት ገንዘብ እያጣ ያለውን መንገድ መለየት',
    ],
    modules: [
      {
        id: 'an-m1',
        title: 'Setting Up',
        title_am: 'ማዘጋጀት',
        lessons: [
          {
            id: 'an-m1-l1',
            title: 'What to Track and What to Ignore',
            title_am: 'ምን መከታተል እና ምን ችላ ማለት እንዳለበት',
            type: 'video',
            duration: '13:00',
            videoUrl: SAMPLE.d,
            isPreview: true,
          },
          {
            id: 'an-m1-l2',
            title: 'Google Analytics in 20 Minutes',
            title_am: 'Google Analytics በ20 ደቂቃ',
            type: 'video',
            duration: '20:40',
            videoUrl: SAMPLE.a,
          },
        ],
      },
      {
        id: 'an-m2',
        title: 'Reading the Numbers',
        title_am: 'ቁጥሮችን ማንበብ',
        lessons: [
          {
            id: 'an-m2-l1',
            title: 'The Monthly One-Page Report',
            title_am: 'ወርሃዊ የአንድ ገጽ ሪፖርት',
            type: 'video',
            duration: '16:25',
            videoUrl: SAMPLE.b,
          },
        ],
      },
    ],
  },

  // ── Free courses ────────────────────────────────────────────
  {
    kind: 'course',
    id: 'free-foundations',
    slug: 'digital-marketing-foundations',
    title: 'Digital Marketing Foundations',
    title_am: 'የዲጂታል ግብይት መሠረቶች',
    category: 'Foundations',
    category_am: 'መሠረቶች',
    summary: 'The vocabulary and the big picture, in under an hour. Free, forever.',
    summary_am: 'መሠረታዊ ቃላትና ሙሉው ምስል፣ ከአንድ ሰዓት በታች። ነጻ፣ ለዘላለም።',
    description:
      'Start here if terms like funnel, CPC and conversion still feel like jargon. Four short lessons, no jargon, nothing to buy.',
    description_am:
      'ፈነል፣ CPC እና ኮንቨርዥን የመሳሰሉ ቃላት አሁንም እንግዳ ከሆኑባችሁ ከዚህ ጀምሩ። አራት አጫጭር ትምህርቶች፣ አስቸጋሪ ቃላት የሉም፣ የሚገዛ ነገር የለም።',
    price: 0,
    isFree: true,
    duration: '52 mins',
    level: 'Beginner',
    thumbnail:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=75',
    instructor: DEFAULT_INSTRUCTOR,
    status: 'published',
    publishedAt: '2025-01-08',
    highlights: [
      'Plain-language definitions of every term you keep hearing',
      'How the pieces fit together',
      'No credit card, no email required',
    ],
    highlights_am: [
      'ደጋግማችሁ የምትሰሟቸው ቃላት በቀላል ቋንቋ ተብራርተዋል',
      'ክፍሎቹ እንዴት እርስ በርስ እንደሚገጣጠሙ',
      'ክሬዲት ካርድ አያስፈልግም፣ ኢሜይልም አይጠየቅም',
    ],
    outcomes: [
      'Follow a marketing conversation without getting lost',
      'Know which area to learn first for your situation',
    ],
    outcomes_am: [
      'ሳትጠፉ የግብይት ውይይትን መከታተል',
      'ለሁኔታችሁ የትኛውን ዘርፍ መጀመሪያ መማር እንዳለባችሁ ማወቅ',
    ],
    modules: [
      {
        id: 'ff-m1',
        title: 'The Basics',
        title_am: 'መሠረታዊ ነገሮች',
        lessons: [
          {
            id: 'ff-m1-l1',
            title: 'What Digital Marketing Covers',
            title_am: 'ዲጂታል ግብይት ምን ይሸፍናል',
            type: 'video',
            duration: '11:20',
            videoUrl: SAMPLE.a,
          },
          {
            id: 'ff-m1-l2',
            title: 'The Words People Use',
            title_am: 'ሰዎች የሚጠቀሙባቸው ቃላት',
            type: 'video',
            duration: '14:05',
            videoUrl: SAMPLE.b,
          },
          {
            id: 'ff-m1-l3',
            title: 'Where to Start for Your Business',
            title_am: 'ለንግዳችሁ ከየት መጀመር እንዳለባችሁ',
            type: 'video',
            duration: '15:40',
            videoUrl: SAMPLE.c,
          },
          {
            id: 'ff-m1-l4',
            title: 'Your Next Step',
            title_am: 'ቀጣይ እርምጃችሁ',
            type: 'reading',
            duration: '05:00',
            videoUrl: null,
            body: 'You now know enough to choose a direction. Pick the one area that would make the biggest difference to your business in the next 90 days, and go deep on that instead of sampling all of them.',
            body_am:
              'አሁን አቅጣጫ ለመምረጥ የሚበቃ እውቀት አላችሁ። በሚቀጥሉት 90 ቀናት ለንግዳችሁ ትልቁን ለውጥ የሚያመጣውን አንድ ዘርፍ ምረጡ፤ ሁሉንም ከመቅመስ ይልቅ በዚያ ላይ ጥልቀት ግቡ።',
          },
        ],
      },
    ],
  },

  {
    kind: 'course',
    id: 'free-seo-starter',
    slug: 'seo-starter-kit',
    title: 'SEO Starter Kit',
    title_am: 'የSEO መነሻ ስብስብ',
    category: 'SEO',
    category_am: 'SEO',
    summary: 'Get found on Google. Three lessons, no cost.',
    summary_am: 'በGoogle ላይ ተገኙ። ሦስት ትምህርቶች፣ ያለ ክፍያ።',
    description:
      'A free introduction to search: how Google decides what to show, how to find words people are actually typing, and the ten fixes that matter most on your own pages.',
    description_am:
      'ስለ ፍለጋ ነጻ መግቢያ፡ Google ምን እንደሚያሳይ እንዴት እንደሚወስን፣ ሰዎች በእውነት የሚጽፏቸውን ቃላት እንዴት ማግኘት እንደሚቻል፣ እና በራሳችሁ ገጾች ላይ በጣም አስፈላጊ የሆኑት አሥር ማስተካከያዎች።',
    price: 0,
    isFree: true,
    duration: '48 mins',
    level: 'Beginner',
    thumbnail:
      'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=1200&q=75',
    instructor: DEFAULT_INSTRUCTOR,
    status: 'published',
    publishedAt: '2025-03-14',
    highlights: [
      'How search engines actually rank pages',
      'Free tools for finding keywords',
      'A 10-point checklist for any page',
    ],
    highlights_am: [
      'የፍለጋ ሞተሮች ገጾችን በእውነት እንዴት እንደሚደረድሩ',
      'ቁልፍ ቃላትን ለማግኘት ነጻ መሣሪያዎች',
      'ለማንኛውም ገጽ የ10 ነጥብ ማረጋገጫ ዝርዝር',
    ],
    outcomes: ['Find keywords worth targeting', 'Fix the ten things that matter on a page'],
    outcomes_am: ['ዒላማ ማድረግ የሚገባቸውን ቁልፍ ቃላት ማግኘት', 'በአንድ ገጽ ላይ አስፈላጊ የሆኑትን አሥር ነገሮች ማስተካከል'],
    modules: [
      {
        id: 'seo-m1',
        title: 'Search Basics',
        title_am: 'የፍለጋ መሠረቶች',
        lessons: [
          {
            id: 'seo-m1-l1',
            title: 'How Google Decides',
            title_am: 'Google እንዴት እንደሚወስን',
            type: 'video',
            duration: '16:00',
            videoUrl: SAMPLE.d,
          },
          {
            id: 'seo-m1-l2',
            title: 'Finding Keywords for Free',
            title_am: 'ቁልፍ ቃላትን በነጻ ማግኘት',
            type: 'video',
            duration: '17:30',
            videoUrl: SAMPLE.a,
          },
          {
            id: 'seo-m1-l3',
            title: 'The 10-Point Page Checklist',
            title_am: 'የ10 ነጥብ የገጽ ማረጋገጫ ዝርዝር',
            type: 'video',
            duration: '14:30',
            videoUrl: SAMPLE.b,
          },
        ],
      },
    ],
  },
];

export const PAID_COURSES = COURSES.filter((c) => !c.isFree);
export const FREE_COURSES = COURSES.filter((c) => c.isFree);
