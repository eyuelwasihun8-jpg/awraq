import { Course, ResourceItem, BundleItem } from '../types';

export const COURSES: Course[] = [
  {
    id: 'masterclass',
    title: 'Complete Digital Marketing Masterclass',
    slug: 'complete-digital-marketing-masterclass',
    category: 'Full Course',
    price: 199.00,
    originalPrice: 289.00,
    currency: 'ETB',
    duration: '14 hr 30 mins',
    lessonsCount: 15, 
    rating: 4.9,
    reviewsCount: 384,
    description: 'Learn the basics and advanced parts of digital marketing in one complete course. You will learn strategy, content, social media, SEO, email marketing, and analytics.',
    instructor: {
      name: 'Lamlak',
      role: 'Founder & Teacher',
      avatar: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg',
    },
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    level: 'All Levels',
    highlights: [
      'Step-by-step plan for your whole marketing strategy',
      'Simple audit sheets and budget calculators',
      'Real examples from successful businesses',
      'Lifetime access with free future updates'
    ],
    modules: [
      {
        id: 'mc-m1',
        title: 'Module 01: Strategy & Finding Your Audience',
        description: 'Learn who your buyers are and what makes your offer special.',
        lessons: [
          { id: 'mc-m1-l1', title: 'Understand Your Customer', type: 'video', duration: '12:45' },
          { id: 'mc-m1-l2', title: 'Creating Your Core Offer', type: 'video', duration: '18:20' },
          { id: 'mc-m1-l3', title: 'Mapping How People Buy', type: 'video', duration: '14:10' }
        ]
      },
      {
        id: 'mc-m2',
        title: 'Module 02: Clear Copywriting & Content',
        description: 'Write simple messages that help people take action.',
        lessons: [
          { id: 'mc-m2-l1', title: 'How to Write Clear Sentences', type: 'video', duration: '16:05' },
          { id: 'mc-m2-l2', title: 'Hooking Attention on Social Media', type: 'video', duration: '11:30' },
          { id: 'mc-m2-l3', title: 'Simple Stories That Sell', type: 'reading', duration: '08:00' }
        ]
      },
      {
        id: 'mc-m3',
        title: 'Module 03: Getting Traffic (SEO & Social)',
        description: 'Get found on Google and build an audience on social media.',
        lessons: [
          { id: 'mc-m3-l1', title: 'Finding Keywords on Google', type: 'video', duration: '22:15' },
          { id: 'mc-m3-l2', title: 'How to Share Content Consistently', type: 'video', duration: '15:40' },
          { id: 'mc-m3-l3', title: 'Turning One Idea Into Five Posts', type: 'video', duration: '19:00' }
        ]
      },
      {
        id: 'mc-m4',
        title: 'Module 04: Email Marketing & Follow-Up',
        description: 'Send helpful emails that turn readers into happy buyers.',
        lessons: [
          { id: 'mc-m4-l1', title: 'Your 5-Day Welcome Email Sequence', type: 'video', duration: '17:50' },
          { id: 'mc-m4-l2', title: 'How to Group Your Email List', type: 'video', duration: '13:25' },
          { id: 'mc-m4-l3', title: 'Automating Helpful Emails', type: 'reading', duration: '10:00' }
        ]
      },
      {
        id: 'mc-m5',
        title: 'Module 05: Analytics & Improving Results',
        description: 'See what works, what to fix, and how to improve your numbers.',
        lessons: [
          { id: 'mc-m5-l1', title: 'Reading Your Website Numbers Easily', type: 'video', duration: '21:10' },
          { id: 'mc-m5-l2', title: 'Checklist to Fix Slow Sales', type: 'resource', duration: '05:00' },
          { id: 'mc-m5-l3', title: 'Testing Simple Changes', type: 'video', duration: '14:45' }
        ]
      }
    ]
  },
  {
    id: 'copywriting',
    title: 'Copywriting for Conversion',
    slug: 'copywriting-for-conversion',
    category: 'Copywriting',
    price: 149.00,
    originalPrice: 199.00,
    currency: 'ETB',
    duration: '06 hr 45 mins',
    lessonsCount: 9, 
    rating: 4.8,
    reviewsCount: 219,
    description: 'Learn how to write clear, persuasive words that grab attention and turn readers into customers.',
    instructor: {
      name: 'Lamlak',
      role: 'Founder & Teacher',
      avatar: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg',
    },
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    level: 'All Levels',
    highlights: [
      '20+ simple headline formulas that work',
      'A clear layout for landing pages',
      'How to answer buyer questions and build trust'
    ],
    modules: [
      {
        id: 'cw-m1',
        title: 'Module 01: Understanding Your Reader',
        description: 'Learn what people want and how they make choices.',
        lessons: [
          { id: 'cw-m1-l1', title: 'Grabbing Attention Fast', type: 'video', duration: '14:20' },
          { id: 'cw-m1-l2', title: 'Feelings vs Logic in Buying', type: 'video', duration: '16:15' },
          { id: 'cw-m1-l3', title: 'Removing Customer Doubts', type: 'video', duration: '12:50' }
        ]
      },
      {
        id: 'cw-m2',
        title: 'Module 02: Writing Great Sales Pages',
        description: 'How to write a simple, high-converting sales page.',
        lessons: [
          { id: 'cw-m2-l1', title: 'Writing the Top Headline', type: 'video', duration: '19:30' },
          { id: 'cw-m2-l2', title: 'Showing Real Proof and Reviews', type: 'video', duration: '11:45' },
          { id: 'cw-m2-l3', title: 'Writing Clear Call-to-Action Buttons', type: 'reading', duration: '07:00' }
        ]
      },
      {
        id: 'cw-m3',
        title: 'Module 03: Short Copy & Email Subject Lines',
        description: 'Write short email subject lines and buttons people click.',
        lessons: [
          { id: 'cw-m3-l1', title: 'Curiosity and Clear Words', type: 'video', duration: '15:10' },
          { id: 'cw-m3-l2', title: 'Button Text That Gets Clicks', type: 'video', duration: '10:25' },
          { id: 'cw-m3-l3', title: 'Subject Lines People Open', type: 'resource', duration: '05:00' }
        ]
      }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media Growth Blueprint',
    slug: 'social-media-growth-blueprint',
    category: 'Social Media',
    price: 129.00,
    originalPrice: 179.00,
    currency: 'ETB',
    duration: '07 hr 15 mins',
    lessonsCount: 9, 
    rating: 4.8,
    reviewsCount: 174,
    description: 'Learn how to build a consistent social media strategy, create engaging content, understand your audience, and improve growth.',
    instructor: {
      name: 'Lamlak',
      role: 'Founder & Teacher',
      avatar: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg',
    },
    thumbnail: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788623685/iepszmduc1voktlnjflg.jpg',
    level: 'Beginner',
    highlights: [
      'How to grow on social media without burning out',
      'A simple 3-hour weekly posting plan',
      'How to start friendly chats that turn into sales'
    ],
    modules: [
      {
        id: 'sm-m1',
        title: 'Module 01: Picking Your Main Topics',
        description: 'Choose what to talk about and find your clear voice.',
        lessons: [
          { id: 'sm-m1-l1', title: 'Finding What You Are Great At', type: 'video', duration: '13:40' },
          { id: 'sm-m1-l2', title: 'The 4 Core Content Topics', type: 'video', duration: '17:15' },
          { id: 'sm-m1-l3', title: 'Keeping a Clean Visual Style', type: 'reading', duration: '06:30' }
        ]
      },
      {
        id: 'sm-m2',
        title: 'Module 02: Creating Posts Fast',
        description: 'How to create posts fast without running out of ideas.',
        lessons: [
          { id: 'sm-m2-l1', title: 'Saving Post Ideas Easily', type: 'video', duration: '14:50' },
          { id: 'sm-m2-l2', title: 'Turn 1 Idea Into 5 Different Formats', type: 'video', duration: '20:10' },
          { id: 'sm-m2-l3', title: 'Helpful Free Tools', type: 'resource', duration: '05:00' }
        ]
      },
      {
        id: 'sm-m3',
        title: 'Module 03: Turning Followers Into Customers',
        description: 'How to turn followers into newsletter readers and buyers.',
        lessons: [
          { id: 'sm-m3-l1', title: 'Creating a Useful Free Download', type: 'video', duration: '18:35' },
          { id: 'sm-m3-l2', title: 'Sharing Offers in Stories', type: 'video', duration: '12:20' },
          { id: 'sm-m3-l3', title: 'Friendly Direct Messages That Help', type: 'video', duration: '16:00' }
        ]
      }
    ]
  }
];

// ────────────────────────────────────────────────────────────
// FREE COURSES (No Checkout Required)
// ────────────────────────────────────────────────────────────
export const FREE_COURSES: Course[] = [
  {
    id: 'free-seo',
    title: 'SEO Mastery for Beginners',
    slug: 'seo-mastery-for-beginners',
    category: 'SEO Basics',
    price: 0,
    currency: 'ETB',
    duration: '2 Hours',
    lessonsCount: 9,
    rating: 4.9,
    reviewsCount: 842,
    isFree: true,
    description: 'Learn how search engines work, how to choose useful keywords, and how to improve your website without confusing technical jargon.',
    instructor: {
      name: 'Lamlak',
      role: 'Founder & Educator',
      avatar: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg',
    },
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    level: 'Beginner',
    highlights: [
      'Understand the basics of SEO',
      'Learn how search engines work',
      'Understand keywords',
      'Learn about search intent',
      'Improve basic on-page SEO',
      'Learn how to create better search-friendly content',
      'Understand the basics of measuring SEO results'
    ],
    modules: [
      {
        id: 'seo-m1',
        title: 'Module 1 — SEO Basics',
        lessons: [
          { id: 'seo-m1-l1', title: 'What is SEO?', type: 'video', duration: '10:00' },
          { id: 'seo-m1-l2', title: 'How Search Engines Work', type: 'video', duration: '12:00' },
          { id: 'seo-m1-l3', title: 'Why SEO Matters', type: 'video', duration: '08:00' }
        ]
      },
      {
        id: 'seo-m2',
        title: 'Module 2 — Keywords',
        lessons: [
          { id: 'seo-m2-l1', title: 'What Are Keywords?', type: 'video', duration: '11:00' },
          { id: 'seo-m2-l2', title: 'Search Intent', type: 'video', duration: '14:00' },
          { id: 'seo-m2-l3', title: 'Choosing Keywords', type: 'video', duration: '15:00' }
        ]
      },
      {
        id: 'seo-m3',
        title: 'Module 3 — On-Page SEO',
        lessons: [
          { id: 'seo-m3-l1', title: 'Page Titles', type: 'video', duration: '09:00' },
          { id: 'seo-m3-l2', title: 'Meta Descriptions', type: 'video', duration: '07:00' },
          { id: 'seo-m3-l3', title: 'Content Optimization', type: 'video', duration: '16:00' }
        ]
      }
    ]
  },
  {
    id: 'free-email',
    title: 'Email Marketing Excellence',
    slug: 'email-marketing-excellence',
    category: 'Email Basics',
    price: 0,
    currency: 'ETB',
    duration: '1.5 Hours',
    lessonsCount: 6,
    rating: 4.8,
    reviewsCount: 520,
    isFree: true,
    description: 'Learn the foundational steps to building an email list and sending messages that people actually want to read.',
    instructor: {
      name: 'Lamlak',
      role: 'Founder & Educator',
      avatar: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg',
    },
    thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80',
    level: 'Beginner',
    highlights: [
      'Learn how to capture emails legally',
      'Understand the Welcome Sequence',
      'Learn how to avoid the spam folder'
    ],
    modules: [
      {
        id: 'em-m1',
        title: 'Module 1 — List Building',
        lessons: [
          { id: 'em-m1-l1', title: 'Why Email Matters', type: 'video', duration: '08:00' },
          { id: 'em-m1-l2', title: 'Setting Up Forms', type: 'video', duration: '12:00' },
        ]
      },
      {
        id: 'em-m2',
        title: 'Module 2 — Sending Emails',
        lessons: [
          { id: 'em-m2-l1', title: 'The Welcome Email', type: 'video', duration: '10:00' },
          { id: 'em-m2-l2', title: 'Writing Newsletters', type: 'video', duration: '15:00' },
        ]
      }
    ]
  },
  {
    id: 'free-content',
    title: 'Content Marketing Blueprint',
    slug: 'content-marketing-blueprint',
    category: 'Content Basics',
    price: 0,
    currency: 'ETB',
    duration: '2.5 Hours',
    lessonsCount: 7,
    rating: 4.7,
    reviewsCount: 312,
    isFree: true,
    description: 'A beginner-friendly guide to planning, creating, and publishing content that attracts the right audience.',
    instructor: {
      name: 'Lamlak',
      role: 'Founder & Educator',
      avatar: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg',
    },
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    level: 'Beginner',
    highlights: [
      'Learn how to plan a simple content calendar',
      'Understand the difference between platforms',
      'Learn how to repurpose one piece of content'
    ],
    modules: [
      {
        id: 'cm-m1',
        title: 'Module 1 — Planning',
        lessons: [
          { id: 'cm-m1-l1', title: 'What is Content Marketing?', type: 'video', duration: '09:00' },
          { id: 'cm-m1-l2', title: 'Choosing Your Platforms', type: 'video', duration: '11:00' },
          { id: 'cm-m1-l3', title: 'The Content Calendar', type: 'video', duration: '14:00' }
        ]
      },
      {
        id: 'cm-m2',
        title: 'Module 2 — Creation',
        lessons: [
          { id: 'cm-m2-l1', title: 'Writing Your First Post', type: 'video', duration: '13:00' },
          { id: 'cm-m2-l2', title: 'Repurposing Content', type: 'video', duration: '16:00' }
        ]
      }
    ]
  }
];

// Legacy Resources 
export const RESOURCES: ResourceItem[] = [
  {
    id: 'swipe-files',
    title: 'Copywriting Swipe Files',
    category: 'Copywriting',
    price: 45.00,
    format: 'Notion + PDF Vault',
    pagesOrCount: '150+ Examples',
    description: 'Over 150 real examples of headlines, sales emails, ads, and web pages with simple notes on why they work.',
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    deliverables: [
      '150+ real marketing examples',
      'Easy-to-copy Notion template',
      'Headline ideas cheat sheet',
      'Welcome email examples'
    ]
  },
  {
    id: 'strategy-guide',
    title: 'Digital Marketing Strategy Guide',
    category: 'Planning',
    price: 59.00,
    format: 'Workbook + Sheets',
    pagesOrCount: '84 Pages',
    description: 'A simple step-by-step guide to help you plan, run, and track your marketing throughout the year.',
    thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80',
    deliverables: [
      '84-page practical guidebook',
      'Simple budget and revenue spreadsheet',
      'Checklist for your customer journey',
      'Quarterly goals dashboard'
    ]
  },
  {
    id: 'content-calendar',
    title: 'Social Media Content Calendar',
    category: 'Content',
    price: 39.00,
    format: 'Airtable + Google Sheets',
    pagesOrCount: '365 Days of Ideas',
    description: 'A full year of post ideas, easy schedules, and tracking sheets for Google Sheets and Airtable.',
    thumbnail: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80',
    deliverables: [
      '365 ready-to-use post ideas',
      'Scheduling boards for all major platforms',
      'Review and planning workflow',
      'List of hooks and caption starters'
    ]
  },
  {
    id: 'email-pack',
    title: 'Email Marketing Template Pack',
    category: 'Email',
    price: 49.00,
    format: 'Templates + Text',
    pagesOrCount: '24 Ready Emails',
    description: '24 ready-to-use email templates for welcoming new subscribers, launching products, and following up with buyers.',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    badge: 'Ready to Use',
    deliverables: [
      '24 customizable email templates',
      'Easy to copy into any email software',
      'Clean email wireframe layouts',
      'Subject line ideas that get opened'
    ]
  }
];