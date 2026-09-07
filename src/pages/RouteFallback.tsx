import { CardSkeleton, Skeleton } from '../components/ui/primitives';

/**
 * Suspense fallback for lazily-loaded routes.
 *
 * A skeleton that echoes the page's real layout, not a centred spinner. A
 * spinner communicates "wait"; a skeleton communicates "here is what's
 * arriving", which measurably lowers perceived latency and stops the page
 * height from collapsing to zero and back (a layout-shift source).
 */
export function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-busy="true">
      <span className="sr-only" role="status">
        Loading
      </span>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default RouteFallback;
