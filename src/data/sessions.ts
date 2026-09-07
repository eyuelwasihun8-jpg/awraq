import type { FreeSession } from '../types';

/**
 * Free sessions — the top of the funnel.
 *
 * This data existed in the previous build with real YouTube ids, and a
 * `VideoModal` component that knew how to play them. Neither was ever imported
 * anywhere, so the feature was ~90% built and completely invisible. It is now
 * wired into the homepage.
 */
export const FREE_SESSIONS: FreeSession[] = [
  {
    id: 'seo-mastery',
    slug: 'seo-for-beginners',
    title: 'SEO for Beginners',
    title_am: 'SEO ለጀማሪዎች',
    category: 'SEO',
    category_am: 'SEO',
    description:
      'How Google decides what to show, how to pick words people actually search, and how to get your pages found.',
    description_am:
      'Google ምን እንደሚያሳይ እንዴት እንደሚወስን፣ ሰዎች በእውነት የሚፈልጓቸውን ቃላት እንዴት መምረጥ እንደሚቻል፣ እና ገጾቻችሁ እንዴት እንደሚገኙ።',
    duration: '1 hr 15 mins',
    level: 'Beginner',
    thumbnail:
      'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=1200&q=75',
    youtubeId: 'f02mOEt11OQ',
    instructorId: 'lamlak',
    watchCount: 2840,
    takeaways: [
      'How search engines decide which pages rank first',
      'The four reasons people search',
      'Free ways to find the words your customers use',
      'A 10-step checklist for improving any page',
    ],
    takeaways_am: [
      'የፍለጋ ሞተሮች የትኞቹ ገጾች መጀመሪያ እንደሚወጡ እንዴት እንደሚወስኑ',
      'ሰዎች የሚፈልጉባቸው አራት ምክንያቶች',
      'ደንበኞቻችሁ የሚጠቀሙባቸውን ቃላት ለማግኘት ነጻ መንገዶች',
      'ማንኛውንም ገጽ ለማሻሻል የ10 ደረጃ ማረጋገጫ ዝርዝር',
    ],
  },
  {
    id: 'email-excellence',
    slug: 'email-marketing-that-works',
    title: 'Email Marketing That Works',
    title_am: 'የሚሠራ የኢሜይል ግብይት',
    category: 'Email',
    category_am: 'ኢሜይል',
    description:
      'How to write emails people open, read and reply to — without buying a list or sounding like a robot.',
    description_am:
      'ዝርዝር ሳትገዙ እና እንደ ሮቦት ሳትሰሙ ሰዎች የሚከፍቷቸውን፣ የሚያነቧቸውን እና ምላሽ የሚሰጡባቸውን ኢሜይሎች እንዴት መጻፍ እንደሚቻል።',
    duration: '58 mins',
    level: 'All Levels',
    thumbnail:
      'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1200&q=75',
    youtubeId: 'e-ORhEE9VVg',
    instructorId: 'lamlak',
    watchCount: 3120,
    takeaways: [
      'Why replies matter more than open rates',
      'A 5-day welcome sequence you can copy',
      'How to group subscribers so they get the right message',
      'Subject lines that stay out of the spam folder',
    ],
    takeaways_am: [
      'ለምን ምላሾች ከመክፈቻ መጠን የበለጠ አስፈላጊ እንደሆኑ',
      'ልትቀዱት የምትችሉት የ5 ቀን የእንኳን ደህና መጣችሁ ተከታታይ',
      'ተመዝጋቢዎችን ትክክለኛውን መልእክት እንዲያገኙ እንዴት መከፋፈል እንደሚቻል',
      'ከስፓም አቃፊ የሚርቁ የርዕስ መስመሮች',
    ],
  },
  {
    id: 'brand-basics',
    slug: 'building-a-brand-people-remember',
    title: 'Building a Brand People Remember',
    title_am: 'ሰዎች የሚያስታውሱት ብራንድ መገንባት',
    category: 'Strategy',
    category_am: 'ስትራቴጂ',
    description:
      'Brand is not your logo. A practical session on the three decisions that make a small business memorable.',
    description_am:
      'ብራንድ ማለት አርማችሁ አይደለም። አነስተኛ ንግድን የማይረሳ የሚያደርጉት ሦስት ውሳኔዎች ላይ ያተኮረ ተግባራዊ ክፍለ ጊዜ።',
    duration: '42 mins',
    level: 'Beginner',
    thumbnail:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=75',
    youtubeId: 'f02mOEt11OQ',
    instructorId: 'lamlak',
    watchCount: 1960,
    takeaways: [
      'The three decisions that define a brand',
      'Why consistency beats cleverness',
      'How to sound like yourself in writing',
    ],
    takeaways_am: [
      'ብራንድን የሚወስኑት ሦስት ውሳኔዎች',
      'ለምን ወጥነት ከብልጠት እንደሚበልጥ',
      'በጽሑፍ እንደራሳችሁ እንዴት መሰማት እንደሚቻል',
    ],
  },
];
