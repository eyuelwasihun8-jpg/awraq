/**
 * Domain model.
 *
 * Design notes:
 * - Catalogue items are a discriminated union on `kind`. The old code detected
 *   type with structural probes like `'includedCourseIds' in item` and
 *   `'lessonsCount' in item`, which silently misclassified anything that
 *   gained a field. `kind` makes it explicit and exhaustively checkable.
 * - Every user-visible string has an optional `_am` sibling consumed by
 *   `useLocalized`.
 * - Money is stored as a plain number of Birr and formatted at the edge only.
 */

// ───────────────────────────────────────────────────────────────
// Shared
// ───────────────────────────────────────────────────────────────

export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type LessonType = 'video' | 'reading' | 'quiz' | 'resource';
export type PublishStatus = 'draft' | 'published' | 'archived';

export interface Instructor {
  id: string;
  name: string;
  name_am?: string;
  role: string;
  role_am?: string;
  avatar: string;
  bio: string;
  bio_am?: string;
  /** Used in trust copy; keep it honest and update it yearly. */
  yearsExperience: number;
}

export interface Attachment {
  id: string;
  name: string;
  name_am?: string;
  /** Human-readable, e.g. "2.4 MB". Display only. */
  size: string;
  /** MIME-ish label shown in the UI: "PDF", "Excel", "ZIP Archive". */
  type: string;
  /**
   * Download URL. In production this is a short-lived signed URL minted by the
   * backend after an entitlement check — never a public object URL.
   * `null` means "not yet provisioned" and the UI renders a disabled state
   * rather than an anchor to "#".
   */
  url: string | null;
}

// ───────────────────────────────────────────────────────────────
// Course
// ───────────────────────────────────────────────────────────────

/** A WebVTT caption/subtitle track for a lesson video. */
export interface CaptionTrack {
  /** BCP-47 tag, e.g. 'am' or 'en'. */
  srcLang: string;
  /** Human label shown in the player's subtitle menu. */
  label: string;
  /** URL of the .vtt file. */
  src: string;
  default?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  title_am?: string;
  type: LessonType;
  /** mm:ss */
  duration: string;
  description?: string;
  description_am?: string;
  /**
   * Playable source. `null` = content not yet uploaded; the player renders an
   * explicit "coming soon" state instead of a dead play button.
   */
  videoUrl: string | null;
  /**
   * Caption tracks. Empty until the videos are transcribed.
   *
   * Captions are not optional polish for this audience: they make lessons
   * usable in a noisy shop, on mute, and by deaf learners, and they let people
   * follow an English lesson while reading Amharic. Treat authoring these as a
   * launch requirement, not a nice-to-have.
   */
  captions?: CaptionTrack[];
  /** Poster frame; falls back to the course thumbnail. */
  posterUrl?: string;
  /** Markdown-ish body for `type: 'reading'`. */
  body?: string;
  body_am?: string;
  attachments?: Attachment[];
  /** Free preview lessons are playable before purchase. */
  isPreview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  title_am?: string;
  description?: string;
  description_am?: string;
  lessons: Lesson[];
}

export interface Course {
  kind: 'course';
  id: string;
  slug: string;
  title: string;
  title_am?: string;
  category: string;
  category_am?: string;
  description: string;
  description_am?: string;
  /** One-line summary for cards and meta descriptions. */
  summary: string;
  summary_am?: string;
  price: number;
  originalPrice?: number;
  /** Human-readable total, e.g. "14 hr 30 mins". */
  duration: string;
  level: Level;
  thumbnail: string;
  instructor: Instructor;
  modules: Module[];
  highlights: string[];
  highlights_am?: string[];
  outcomes: string[];
  outcomes_am?: string[];
  requirements?: string[];
  requirements_am?: string[];
  isFree?: boolean;
  isPopular?: boolean;
  status: PublishStatus;
  /**
   * Ratings are optional and only rendered when `reviewsCount > 0`.
   * The old build hardcoded "4.9 from 384 reviews" with no review system
   * behind it — unverifiable social proof is worse than none.
   */
  rating?: number;
  reviewsCount?: number;
  publishedAt: string;
}

// ───────────────────────────────────────────────────────────────
// Digital product
// ───────────────────────────────────────────────────────────────

export interface DigitalProduct {
  kind: 'product';
  id: string;
  slug: string;
  title: string;
  title_am?: string;
  category: string;
  category_am?: string;
  summary: string;
  summary_am?: string;
  description: string;
  description_am?: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  files: Attachment[];
  highlights: string[];
  highlights_am?: string[];
  previewUrl?: string;
  status: PublishStatus;
  publishedAt: string;
}

// ───────────────────────────────────────────────────────────────
// Bundle
// ───────────────────────────────────────────────────────────────

export interface Bundle {
  kind: 'bundle';
  id: string;
  slug: string;
  title: string;
  title_am?: string;
  summary: string;
  summary_am?: string;
  description: string;
  description_am?: string;
  price: number;
  /** Sum of member prices; used to compute and justify the saving. */
  originalPrice: number;
  thumbnail: string;
  courseIds: string[];
  productIds: string[];
  status: PublishStatus;
}

export type CatalogItem = Course | DigitalProduct | Bundle;
export type PurchasableKind = CatalogItem['kind'];

// ───────────────────────────────────────────────────────────────
// Free sessions (top-of-funnel video content)
// ───────────────────────────────────────────────────────────────

export interface FreeSession {
  id: string;
  slug: string;
  title: string;
  title_am?: string;
  category: string;
  category_am?: string;
  description: string;
  description_am?: string;
  duration: string;
  level: Level;
  thumbnail: string;
  youtubeId: string;
  instructorId: string;
  takeaways: string[];
  takeaways_am?: string[];
  watchCount: number;
}

// ───────────────────────────────────────────────────────────────
// Commerce
// ───────────────────────────────────────────────────────────────

export type PaymentMethod = 'telebirr' | 'cbe' | 'chapa';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CartLine {
  itemId: string;
  kind: PurchasableKind;
  title: string;
  title_am?: string;
  thumbnail: string;
  unitPrice: number;
}

export interface OrderLine extends CartLine {
  /** Zero for items unlocked as part of a bundle. */
  pricePaid: number;
}

export interface Order {
  id: string;
  /** ISO 8601. */
  placedAt: string;
  status: OrderStatus;
  method: PaymentMethod;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  total: number;
}

/** Flat entitlement grant — what the learner may actually access. */
export interface Entitlement {
  itemId: string;
  kind: PurchasableKind;
  grantedAt: string;
  /** Order that produced this grant; supports refund reversal. */
  orderId: string;
}

// ───────────────────────────────────────────────────────────────
// Learning progress
// ───────────────────────────────────────────────────────────────

export interface CourseProgress {
  completedLessonIds: string[];
  lastLessonId?: string;
  /** ISO 8601. Set once, when the final lesson is completed. */
  completedAt?: string;
  startedAt: string;
}

export interface LessonNote {
  courseId: string;
  lessonId: string;
  body: string;
  /** Epoch ms. */
  updatedAt: number;
}

// ───────────────────────────────────────────────────────────────
// Auth
// ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}
