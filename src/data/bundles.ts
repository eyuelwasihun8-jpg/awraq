import { BundleItem } from '../types';

export const BUNDLES: BundleItem[] = [
  {
    id: 'complete-bundle',
    slug: 'complete-awraq-bundle',
    title: 'Complete Bundle',
    price: 499.00,
    originalValue: 790.00, 
    currency: 'ETB',
    shortDescription: 'Get all 3 premium courses and all 4 digital tools in one complete package to master your marketing from start to finish.',
    description: 'The Complete Bundle is the ultimate digital marketing toolkit. It combines our most comprehensive step-by-step video courses with all our premium downloadable resources. Whether you are building a brand from scratch, running an agency, or scaling an e-commerce business, this bundle gives you lifetime access to every strategy, template, and swipe file you will ever need.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    
    // ✅ FIXED: These now match COURSES in courses.ts
    includedCourseIds: [
      'masterclass',
      'copywriting',
      'social-media'
    ],
    
    // ✅ FIXED: These now match DIGITAL_PRODUCTS in digitalProducts.ts
    includedDigitalProductIds: [
      'dp-copywriting-swipe',
      'dp-strategy-guide',
      'dp-social-calendar',
      'dp-email-templates'
    ],
    
    features: [
      'Lifetime access to all current and future lessons',
      'Ask questions directly to Lamlak in live sessions',
      'Easy templates in Notion, Google Sheets, and PDFs',
      'Permission to use all materials for your own business or clients',
      'Certificate of Completion from Awraq'
    ],
    
    includes: [
      'Complete Digital Marketing Masterclass',
      'Copywriting for Conversion',
      'Social Media Growth Blueprint',
      'Copywriting Swipe Files',
      'Digital Marketing Strategy Guide',
      'Social Media Content Calendar',
      'Email Marketing Template Pack'
    ],
    
    status: 'Published'
  }
];