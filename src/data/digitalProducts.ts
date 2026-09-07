import { DigitalProduct } from '../types';

const now = new Date('2026-09-05T00:00:00Z').toISOString();

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'dp-copywriting-swipe',
    slug: 'copywriting-swipe-files',
    title: 'Copywriting Swipe Files',
    shortDescription: 'A collection of useful copywriting examples and ideas to help you write better marketing messages.',
    description: 'Never stare at a blank page again. This premium swipe file contains our best performing ad copies, email hooks, and landing page structures. A collection of useful copywriting examples and ideas to help you write better marketing messages.',
    price: 45.00,
    currency: 'ETB',
    thumbnail: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=800&q=80',
    category: 'Copywriting',
    files: [
      { id: 'f1', name: 'Swipe-Files.pdf', size: '2.1 MB', type: 'PDF', url: '#' },
      { id: 'f2', name: 'Headline-Examples.pdf', size: '1.4 MB', type: 'PDF', url: '#' },
      { id: 'f3', name: 'CTA-Examples.pdf', size: '0.8 MB', type: 'PDF', url: '#' }
    ],
    status: 'Published',
    includes: [
      'Headline examples',
      'Call-to-action examples',
      'Sales copy examples',
      'Email examples',
      'Social media copy examples'
    ],
    whoIsItFor: [
      'Freelance Copywriters',
      'Digital Marketers',
      'Small Business Owners'
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'dp-strategy-guide',
    slug: 'digital-marketing-strategy-guide',
    title: 'Digital Marketing Strategy Guide',
    shortDescription: 'A practical guide to help you plan your digital marketing step by step.',
    description: 'Stop guessing and start planning. This comprehensive strategy guide takes you through the exact frameworks used by top agencies to plan, execute, and measure digital marketing campaigns.',
    price: 59.00,
    currency: 'ETB',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    category: 'Strategy',
    files: [
      { id: 'f4', name: 'Digital_Marketing_Strategy_Guide.pdf', size: '8.1 MB', type: 'PDF', url: '#' },
      { id: 'f5', name: 'Strategy_Checklist.pdf', size: '1.1 MB', type: 'PDF', url: '#' }
    ],
    status: 'Published',
    includes: [
      'Step-by-step strategy planning',
      'Budget allocation templates',
      'KPI tracking sheets',
      'Target audience worksheets'
    ],
    whoIsItFor: [
      'Marketing Managers',
      'Founders',
      'Agency Owners'
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'dp-social-calendar',
    slug: 'social-media-content-calendar',
    title: 'Social Media Content Calendar',
    shortDescription: 'A ready-to-use content calendar to help you plan your social media posts.',
    description: 'Consistency is the key to social media growth. This extensive calendar provides 365 days of content prompts, platform-specific strategies, and organizational templates.',
    price: 39.00,
    currency: 'ETB',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    category: 'Social Media',
    files: [
      { id: 'f6', name: 'social-media-content-calendar.xlsx', size: '2.5 MB', type: 'Excel', url: '#' }
    ],
    status: 'Published',
    includes: [
      '365 days of content prompts',
      'Hashtag strategy guide',
      'Platform-specific posting times',
      'Monthly review templates'
    ],
    whoIsItFor: [
      'Social Media Managers',
      'Content Creators',
      'Influencers'
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'dp-email-templates',
    slug: 'email-marketing-template-pack',
    title: 'Email Marketing Template Pack',
    shortDescription: 'Ready-to-use email templates to help you create useful marketing emails.',
    description: 'Boost your open and click-through rates. This pack includes welcome sequences, abandoned cart reminders, and promotional blasts ready to be copy-pasted into your ESP.',
    price: 49.00,
    currency: 'ETB',
    thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80',
    category: 'Email Marketing',
    files: [
      { id: 'f7', name: 'Email_Templates_Pack.zip', size: '12.4 MB', type: 'ZIP Archive', url: '#' }
    ],
    status: 'Published',
    includes: [
      'Welcome series templates',
      'Abandoned cart sequences',
      'Newsletter frameworks',
      'Subject line formulas'
    ],
    whoIsItFor: [
      'E-commerce Owners',
      'Email Marketers',
      'Newsletter Creators'
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  }
];