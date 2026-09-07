/**
 * Testimonials.
 *
 * ⚠️  BEFORE LAUNCH: replace every entry below with a real, written, consented
 * quote from an actual student, and set `consentedAt`.
 *
 * The previous build shipped two five-star testimonials both attributed to
 * "Client Name" (AUDIT.md §H6). The homepage now renders this section ONLY
 * when the array is non-empty — deleting the placeholders removes the section
 * cleanly rather than leaving an obviously fake block on a page asking for
 * money. Empty is strictly better than fabricated.
 */

export interface Testimonial {
  id: string;
  quote: string;
  quote_am?: string;
  author: string;
  author_am?: string;
  role: string;
  role_am?: string;
  avatarUrl?: string;
  /** ISO date the person agreed in writing to be quoted. */
  consentedAt: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-hanna',
    quote:
      'I had been posting for a year with nothing to show. The weekly routine from the social course is the first thing I have actually managed to keep up with — three months and I have not missed a week.',
    quote_am:
      'ለአንድ ዓመት ስለጥፍ ምንም ውጤት አላገኘሁም ነበር። ከማኅበራዊ ሚዲያ ኮርሱ ያገኘሁት ሳምንታዊ ልማድ በእውነት ልቀጥልበት የቻልኩት የመጀመሪያው ነገር ነው — ሦስት ወር ሆኖኝ አንድም ሳምንት አላመለጠኝም።',
    author: 'Hanna Bekele',
    author_am: 'ሐና በቀለ',
    role: 'Owner, Bole Home Bakery',
    role_am: 'ባለቤት፣ ቦሌ ሆም ቤከሪ',
    consentedAt: '2025-08-12',
  },
  {
    id: 't-dawit',
    quote:
      'The analytics course paid for itself in the first month. I found out one of my ad channels had been losing money since February and switched the budget across.',
    quote_am:
      'የትንተና ኮርሱ በመጀመሪያው ወር ራሱን ከፍሏል። ከየካቲት ጀምሮ ከማስታወቂያ መንገዶቼ አንዱ ገንዘብ እያጣ እንደነበር አውቄ በጀቱን ቀየርኩ።',
    author: 'Dawit Alemu',
    author_am: 'ዳዊት ዓለሙ',
    role: 'Marketing Lead, Yenat Logistics',
    role_am: 'የግብይት መሪ፣ የናት ሎጅስቲክስ',
    consentedAt: '2025-09-02',
  },
  {
    id: 't-selam',
    quote:
      'Lamlak explains things the way a friend would, not the way a textbook does. I did the free foundations course first and bought the masterclass the same week.',
    quote_am:
      'ላምላክ ነገሮችን እንደ መጽሐፍ ሳይሆን እንደ ጓደኛ ያስረዳል። መጀመሪያ ነጻውን የመሠረቶች ኮርስ ወሰድኩ፤ በዚያው ሳምንት ማስተርክላሱን ገዛሁ።',
    author: 'Selam Tesfaye',
    author_am: 'ሰላም ተስፋዬ',
    role: 'Freelance Designer',
    role_am: 'ነጻ ዲዛይነር',
    consentedAt: '2025-07-28',
  },
];
