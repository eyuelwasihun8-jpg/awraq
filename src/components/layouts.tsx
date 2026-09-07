import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

/**
 * Scroll and focus management on navigation.
 *
 * A client router doesn't reset scroll or focus the way a document load does.
 * Without this, every route change leaves the user halfway down the new page
 * with focus still on the link they clicked — and screen readers announce
 * nothing at all, so the navigation is silent.
 *
 * Hash links are honoured so /about#contact still works.
 */
export function ScrollAndFocusManager() {
  const { pathname, hash } = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // Move focus to the main landmark so the next Tab starts at the top of the
    // new page and assistive tech announces the new context.
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [pathname, hash, reducedMotion]);

  return null;
}

function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-control bg-brand px-4 py-3 font-bold text-brand-fg focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {t('nav.skipToContent')}
    </a>
  );
}

/**
 * Marketing shell — fixed-dark brand surface.
 *
 * This is a deliberate product decision, not an oversight. The landing page's
 * identity IS the dark treatment; a theme toggle here would either destroy the
 * design or, as in the previous build, silently do nothing while the navbar
 * stayed white over a dark page. The toggle lives in the app shell, where
 * theming is fully implemented.
 */
export function MarketingLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-white">
      <SkipLink />
      <Navbar variant="marketing" />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/** App shell — fully themed, light or dark. */
export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-fg">
      <SkipLink />
      <Navbar variant="app" />
      <main id="main" tabIndex={-1} className="flex-1 pt-16 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/** Immersive shell — no chrome. Used by the player and the certificate. */
export function FocusLayout() {
  return (
    <div className="min-h-dvh bg-canvas text-fg">
      <SkipLink />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
    </div>
  );
}
