import type { Bundle, CartLine, CatalogItem, Course, DigitalProduct, OrderLine } from '../types';
import { BUNDLES } from './bundles';
import { COURSES } from './courses';
import { DIGITAL_PRODUCTS } from './digitalProducts';

/**
 * Catalogue access layer.
 *
 * Everything that needs to resolve an id or slug goes through here, so when
 * this is swapped for a real API only this file changes. The previous build
 * scattered `COURSES.find(...) || FREE_COURSES.find(...)` across App.tsx,
 * HomePage and the dashboard, each with slightly different fallback behaviour.
 */

const published = <T extends { status: string }>(items: T[]) =>
  items.filter((i) => i.status === 'published');

export const allCourses = () => published(COURSES);
export const allProducts = () => published(DIGITAL_PRODUCTS);
export const allBundles = () => published(BUNDLES);

const byId = new Map<string, CatalogItem>(
  [...COURSES, ...DIGITAL_PRODUCTS, ...BUNDLES].map((item) => [item.id, item]),
);
const bySlug = new Map<string, CatalogItem>(
  [...COURSES, ...DIGITAL_PRODUCTS, ...BUNDLES].map((item) => [item.slug, item]),
);

export const getItem = (id: string): CatalogItem | undefined => byId.get(id);
export const getBySlug = (slug: string): CatalogItem | undefined => bySlug.get(slug);

export function getCourse(idOrSlug: string): Course | undefined {
  const item = byId.get(idOrSlug) ?? bySlug.get(idOrSlug);
  return item?.kind === 'course' ? item : undefined;
}

export function getProduct(idOrSlug: string): DigitalProduct | undefined {
  const item = byId.get(idOrSlug) ?? bySlug.get(idOrSlug);
  return item?.kind === 'product' ? item : undefined;
}

export function getBundle(idOrSlug: string): Bundle | undefined {
  const item = byId.get(idOrSlug) ?? bySlug.get(idOrSlug);
  return item?.kind === 'bundle' ? item : undefined;
}

/** Flatten a course to its lesson list — used by the player and progress maths. */
export const lessonsOf = (course: Course) => course.modules.flatMap((m) => m.lessons);
export const lessonCount = (course: Course) => lessonsOf(course).length;

export function bundleMembers(bundle: Bundle): { courses: Course[]; products: DigitalProduct[] } {
  return {
    courses: bundle.courseIds.map(getCourse).filter((c): c is Course => Boolean(c)),
    products: bundle.productIds.map(getProduct).filter((p): p is DigitalProduct => Boolean(p)),
  };
}

/** Cart line for any catalogue item. */
export function toCartLine(item: CatalogItem): CartLine {
  return {
    itemId: item.id,
    kind: item.kind,
    title: item.title,
    title_am: item.title_am,
    thumbnail: item.thumbnail,
    unitPrice: item.price,
  };
}

/**
 * Expand a cart line into the order lines it actually grants.
 *
 * A bundle produces one paid line plus a zero-priced line for every member, so
 * the dashboard can show the individual courses AND the order history stays
 * honest about what was charged. The old implementation did this with nested
 * setState calls inside a forEach, reading stale state each iteration.
 */
export function expandToOrderLines(line: CartLine): OrderLine[] {
  const item = getItem(line.itemId);
  if (!item) return [];

  const head: OrderLine = { ...line, pricePaid: line.unitPrice };
  if (item.kind !== 'bundle') return [head];

  const { courses, products } = bundleMembers(item);
  const members: OrderLine[] = [...courses, ...products].map((member) => ({
    itemId: member.id,
    kind: member.kind,
    title: member.title,
    title_am: member.title_am,
    thumbnail: member.thumbnail,
    unitPrice: member.price,
    pricePaid: 0, // included in the bundle price
  }));

  return [head, ...members];
}

/** Categories present in the live catalogue, for filter chips. */
export function courseCategories(): string[] {
  return Array.from(new Set(allCourses().map((c) => c.category))).sort();
}

export function productCategories(): string[] {
  return Array.from(new Set(allProducts().map((p) => p.category))).sort();
}
