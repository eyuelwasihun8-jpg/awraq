import { SessionItem, LiveCohort } from '../types';

export const FREE_SESSIONS: SessionItem[] = [
  {
    id: 'seo-mastery',
    title: 'SEO Mastery for Beginners',
    price: 'FREE',
    category: 'SEO',
    duration: '1 hr 15 mins',
    level: 'Beginner',
    description: 'Learn how Google works, how to choose useful keywords, and how to help your website appear in search results.',
    thumbnail: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=800&q=80',
    instructor: 'Lamlak',
    viewsOrAttendees: '2,840+ watched',
    videoEmbedId: 'f02mOEt11OQ',
    keyTakeaways: [
      'How search engines decide which websites to show first',
      'The 4 main reasons people search on Google',
      'Free and easy ways to find the best search words',
      'A 10-step checklist to improve your web pages'
    ]
  },
  {
    id: 'email-excellence',
    title: 'Email Marketing Excellence',
    price: 'FREE',
    category: 'Email',
    duration: '58 mins',
    level: 'All Levels',
    description: 'Learn how to write friendly emails that people actually open, read, and buy from.',
    thumbnail: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
    instructor: 'Lamlak',
    viewsOrAttendees: '3,120+ watched',
    videoEmbedId: 'e-ORhEE9VVg',
    keyTakeaways: [
      'Why genuine replies matter more than open rates',
      'A simple 5-day welcome email sequence for new readers',
      'How to group your subscribers so they get the right emails',
      'Writing subject lines that avoid the spam folder'
    ]
  },
  {
    id: 'content-blueprint',
    title: 'Content Marketing Blueprint',
    price: 'FREE',
    category: 'Content',
    duration: '1 hr 22 mins',
    level: 'Intermediate',
    description: 'Learn how to create useful content for the right people without spending all day on social media.',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    instructor: 'Lamlak',
    viewsOrAttendees: '4,450+ watched',
    videoEmbedId: 'aircAruvnKk',
    keyTakeaways: [
      'How to turn one core idea into multiple helpful posts',
      'How to share helpful tips that build real trust',
      'How to stand out from other accounts in your space',
      'A simple posting schedule you can easily keep up with'
    ]
  },
  {
    id: 'campaign-architecture',
    title: 'How to Build a Marketing Funnel',
    price: 'FREE',
    category: 'Strategy',
    duration: '1 hr 08 mins',
    level: 'Intermediate',
    description: 'Learn how to guide a new visitor step-by-step until they become a happy paying customer.',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    instructor: 'Lamlak',
    viewsOrAttendees: '1,980+ watched',
    videoEmbedId: '3JZ_D3ELwOQ',
    keyTakeaways: [
      'The simple stages of a customer buying journey',
      'How to find and fix places where visitors leave',
      'What to say to people who are discovering your brand',
      'How to check your numbers before spending money on ads'
    ]
  },
  {
    id: 'social-organic',
    title: 'Growing on Social Media Without Ads',
    price: 'FREE',
    category: 'Social Media',
    duration: '52 mins',
    level: 'Beginner',
    description: 'Learn how to grow a loyal audience and attract clients on social media without paying for ads.',
    thumbnail: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80',
    instructor: 'Lamlak',
    viewsOrAttendees: '2,610+ watched',
    videoEmbedId: 'kJQP7kiw5Fk',
    keyTakeaways: [
      'How to make your bio clear and welcoming',
      'How to write posts that people save and share',
      'How to chat with followers and turn interest into sales',
      'A simple 90-minute weekly plan to create your posts'
    ]
  }
];

export const UPCOMING_COHORTS: LiveCohort[] = [
  {
    id: 'cohort-1',
    title: 'Live Website Review: Funnels and Sales Pages',
    date: 'Thursday, Sept 18',
    time: '6:00 PM - 7:30 PM UTC',
    seatsLeft: 8,
    format: 'Live Video Call (Zoom)',
    instructor: 'Lamlak',
    topic: 'Reviewing student websites and marketing campaigns live',
    description: 'Bring your website or marketing project. Lamlak will look at your headlines, layout, and words to show you how to improve results live.'
  },
  {
    id: 'cohort-2',
    title: 'Live Copywriting Workshop: From Idea to First Draft',
    date: 'Tuesday, Sept 23',
    time: '5:00 PM - 6:30 PM UTC',
    seatsLeft: 5,
    format: 'Hands-on Writing Workshop',
    instructor: 'Lamlak',
    topic: 'Writing headlines and sales text together with real-time feedback',
    description: 'Write together with Lamlak. We will review your headlines, opening lines, and email ideas to make them clear and persuasive.'
  },
  {
    id: 'cohort-3',
    title: 'SEO and Google Search Workshop',
    date: 'Saturday, Oct 04',
    time: '3:00 PM - 4:30 PM UTC',
    seatsLeft: 12,
    format: 'Live Interactive Workshop',
    instructor: 'Lamlak',
    topic: 'How to get steady organic traffic from Google without paying for ads',
    description: 'Learn how people search today, how to write articles that rank on Google, and how to get steady visitors every month.'
  }
];
