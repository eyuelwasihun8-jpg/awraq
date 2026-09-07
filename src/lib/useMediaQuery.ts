import { useSyncExternalStore } from 'react';

/**
 * Subscribe to a media query.
 *
 * `useSyncExternalStore` rather than useState+useEffect so the first render
 * already has the correct value — no flash of the wrong layout.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false, // SSR / prerender default
  );
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
