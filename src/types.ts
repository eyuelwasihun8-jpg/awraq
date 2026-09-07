export type Page = 
  | 'home' 
  | 'about' 
  | 'learning' 
  | 'courses' 
  | 'resources' 
  | 'contact'
  | 'course-detail' 
  | 'digital-product'
  | 'bundle-detail'
  | 'resource-access'
  | 'checkout' 
  | 'dashboard' 
  | 'learn'
  | 'certificate';

export type ProductStatus = 'Draft' | 'Published' | 'Archived';

// ────────────────────────────────────────────────────────────
// RESOURCE & LESSON TYPES
// ────────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  name: string;
  name_am?: string;
  type: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  title_am?: string;
  type: 'video' | 'reading' | 'quiz' | 'resource';
  duration?: string;
  description?: string;
  description_am?: string;
  videoUrl?: string;
  resources?: Resource[];
}

export interface Module {
  id: string;
  title: string;
  title_am?: string;
  description?: string;
  description_am?: string;
  lessons: Lesson[];
}

// ────────────────────────────────────────────────────────────
// COURSE TYPE
// ────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  title_am?: string;
  slug: string;
  category: string;
  category_am?: string;
  price: number;
  originalPrice?: number;
  currency: 'ETB';
  duration: string;
  lessonsCount: number;
  rating: number;
  reviewsCount: number;
  description: string;
  description_am?: string;
  instructor: {
    name: string;
    name_am?: string;
    role: string;
    role_am?: string;
    avatar: string;
    bio?: string;
    bio_am?: string;
  };
  thumbnail: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  isFree?: boolean;
  level: 'Beginner' | 'Intermediate' | 'All Levels' | 'Advanced';
  modules: Module[];
  highlights: string[];
  highlights_am?: string[];
}

// ────────────────────────────────────────────────────────────
// DIGITAL PRODUCT ARCHITECTURE
// ────────────────────────────────────────────────────────────

export interface DigitalFile {
  id: string;
  name: string;
  name_am?: string;
  size: string;
  type: string;
  url: string;
}

export interface DigitalProduct {
  id: string;
  slug: string;
  title: string;
  title_am?: string;
  description: string;
  description_am?: string;
  shortDescription: string;
  shortDescription_am?: string;
  price: number;
  currency: 'ETB';
  thumbnail: string;
  category: string;
  category_am?: string;
  files: DigitalFile[];
  previewUrl?: string;
  status: ProductStatus;
  includes: string[];
  includes_am?: string[];
  whoIsItFor: string[];
  whoIsItFor_am?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ────────────────────────────────────────────────────────────
// PURCHASE & TRANSACTION TYPES
// ────────────────────────────────────────────────────────────

export interface PurchaseRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  itemTitle_am?: string;
  type: 'course' | 'digital' | 'bundle';
  purchaseDate: string;
  pricePaid: number;
  status: 'Completed' | 'Pending' | 'Revoked';
}

// ────────────────────────────────────────────────────────────
// LEGACY RESOURCE ITEM (still used by some legacy code)
// ────────────────────────────────────────────────────────────

export interface ResourceItem {
  id: string;
  title: string;
  title_am?: string;
  category: string;
  category_am?: string;
  price: number;
  format: string;
  pagesOrCount: string;
  description: string;
  description_am?: string;
  thumbnail: string;
  badge?: string;
  badge_am?: string;
  deliverables: string[];
  deliverables_am?: string[];
}

// ────────────────────────────────────────────────────────────
// BUNDLE TYPE
// ────────────────────────────────────────────────────────────

export interface BundleItem {
  id: string;
  slug: string;
  title: string;
  title_am?: string;
  price: number;
  originalValue: number;
  currency: 'ETB';
  description: string;
  description_am?: string;
  shortDescription: string;
  shortDescription_am?: string;
  thumbnail: string;
  includedCourseIds: string[];
  includedDigitalProductIds: string[];
  features: string[];
  features_am?: string[];
  includes: string[];
  includes_am?: string[];
  status: ProductStatus;
}

// ────────────────────────────────────────────────────────────
// SESSION & COHORT TYPES
// ────────────────────────────────────────────────────────────

export interface SessionItem {
  id: string;
  title: string;
  title_am?: string;
  price: 'FREE' | number;
  category: string;
  category_am?: string;
  duration: string;
  level: string;
  description: string;
  description_am?: string;
  thumbnail: string;
  keyTakeaways: string[];
  keyTakeaways_am?: string[];
  videoEmbedId?: string;
  instructor: string;
  instructor_am?: string;
  viewsOrAttendees: string;
}

export interface LiveCohort {
  id: string;
  title: string;
  title_am?: string;
  date: string;
  time: string;
  seatsLeft: number;
  format: string;
  format_am?: string;
  instructor: string;
  topic: string;
  topic_am?: string;
  description: string;
  description_am?: string;
}

// ────────────────────────────────────────────────────────────
// ARTICLE TYPE
// ────────────────────────────────────────────────────────────

export interface ArticleItem {
  id: string;
  title: string;
  title_am?: string;
  slug: string;
  category: string;
  category_am?: string;
  date: string;
  readTime: string;
  excerpt: string;
  excerpt_am?: string;
  content: string[];
  content_am?: string[];
  thumbnail: string;
  author: {
    name: string;
    name_am?: string;
    role: string;
    role_am?: string;
    avatar: string;
  };
  featured?: boolean;
}

// ────────────────────────────────────────────────────────────
// VIDEO TYPE
// ────────────────────────────────────────────────────────────

export interface VideoItem {
  id: string;
  title: string;
  title_am?: string;
  category?: string;
  category_am?: string;
  duration: string;
  description: string;
  description_am?: string;
  thumbnail: string;
  youtubeId?: string;
  embedId?: string;
  views: string;
}

// ────────────────────────────────────────────────────────────
// TESTIMONIAL TYPE
// ────────────────────────────────────────────────────────────

export interface TestimonialItem {
  id: string;
  quote: string;
  quote_am?: string;
  author: string;
  author_am?: string;
  role: string;
  role_am?: string;
  company?: string;
  company_am?: string;
  avatar: string;
  highlightTag?: string;
  highlightTag_am?: string;
}

// ────────────────────────────────────────────────────────────
// FAQ TYPE
// ────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  question_am?: string;
  answer: string;
  answer_am?: string;
  category?: string;
  category_am?: string;
}

// ────────────────────────────────────────────────────────────
// SUPPORTED LANGUAGE TYPE (utility)
// ────────────────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'am';