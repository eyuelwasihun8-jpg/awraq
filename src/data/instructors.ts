import type { Instructor } from '../types';

export const INSTRUCTORS: Record<string, Instructor> = {
  lamlak: {
    id: 'lamlak',
    yearsExperience: 3,
    name: 'Lamlak',
    name_am: 'ላምላክ',
    role: 'Founder & Lead Instructor',
    role_am: 'መስራች እና ዋና አስተማሪ',
    avatar:
      'https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg',
    bio: 'Lamlak has spent three years helping Ethiopian small businesses turn confusing marketing advice into simple, repeatable steps. He teaches the way he consults — plain language, real numbers, and work you can apply the same week.',
    bio_am:
      'ላምላክ ላለፉት ሦስት ዓመታት የኢትዮጵያ አነስተኛ ንግዶች ውስብስብ የግብይት ምክሮችን ወደ ቀላል እና ተደጋጋሚ እርምጃዎች እንዲቀይሩ ሲረዳ ቆይቷል። እንደሚያማክረው ሁሉ ያስተምራል — ቀላል ቋንቋ፣ ትክክለኛ ቁጥሮች እና በዚያው ሳምንት ተግባራዊ ልታደርጉት የምትችሉት ሥራ።',
  },
};

export const DEFAULT_INSTRUCTOR = INSTRUCTORS.lamlak;
