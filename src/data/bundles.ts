import type { Bundle } from '../types';
import { COURSES } from './courses';
import { DIGITAL_PRODUCTS } from './digitalProducts';

/**
 * Bundles.
 *
 * `originalPrice` is DERIVED from the members rather than typed by hand, so a
 * price change on any course can never leave a bundle advertising a saving
 * that no longer exists.
 */
function sumOf(courseIds: string[], productIds: string[]): number {
  const courses = COURSES.filter((c) => courseIds.includes(c.id));
  const products = DIGITAL_PRODUCTS.filter((p) => productIds.includes(p.id));
  return [...courses, ...products].reduce((total, item) => total + item.price, 0);
}

function bundle(
  input: Omit<Bundle, 'kind' | 'originalPrice' | 'status'> & { status?: Bundle['status'] },
): Bundle {
  return {
    kind: 'bundle',
    status: 'published',
    ...input,
    originalPrice: sumOf(input.courseIds, input.productIds),
  };
}

export const BUNDLES: Bundle[] = [
  bundle({
    id: 'starter-bundle',
    slug: 'starter-bundle',
    title: 'Starter Bundle',
    title_am: 'የመነሻ ጥቅል',
    summary: 'Copywriting and social media, plus the two templates that support them.',
    summary_am: 'ጽሑፍ አጻጻፍ እና ማኅበራዊ ሚዲያ፣ እንዲሁም የሚደግፏቸው ሁለት አብነቶች።',
    description:
      'The two skills that produce results fastest for a small business, paired with the templates that keep you consistent after the course ends.',
    description_am:
      'ለአነስተኛ ንግድ በፍጥነት ውጤት የሚያመጡት ሁለቱ ክህሎቶች፣ ኮርሱ ካለቀ በኋላ ወጥነት እንድትይዙ ከሚያደርጓችሁ አብነቶች ጋር ተጣምረው።',
    price: 229,
    thumbnail:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=75',
    courseIds: ['copywriting', 'social-growth'],
    productIds: ['swipe-file', 'content-calendar'],
  }),

  bundle({
    id: 'complete-bundle',
    slug: 'complete-bundle',
    title: 'Everything Bundle',
    title_am: 'ሁሉንም ያካተተ ጥቅል',
    summary: 'All four paid courses and all four resources. The best value we offer.',
    summary_am: 'አራቱም የሚከፈልባቸው ኮርሶች እና አራቱም ግብዓቶች። የምናቀርበው ምርጥ ዋጋ።',
    description:
      'Everything in the catalogue, including future updates to any course in it. If you are planning to take more than two courses, this costs less than buying them separately.',
    description_am:
      'በካታሎጉ ውስጥ ያለው ሁሉም ነገር፣ በውስጡ ላሉ ኮርሶች የሚደረጉ የወደፊት ዝማኔዎችን ጨምሮ። ከሁለት በላይ ኮርሶች ለመውሰድ ካሰባችሁ፣ ይህ ለየብቻ ከመግዛት ያነሰ ያስከፍላል።',
    price: 449,
    thumbnail:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=75',
    courseIds: ['masterclass', 'copywriting', 'social-growth', 'analytics'],
    productIds: ['swipe-file', 'strategy-guide', 'content-calendar', 'email-pack'],
  }),
];
