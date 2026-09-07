import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { useStore } from '../store/StoreProvider';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { BrandLogo } from './BrandLogo';
import { LanguageSwitcher, ThemeToggle } from './Controls';
import { Button, ButtonLink } from './ui/Button';

/**
 * Site navigation.
 *
 * Rewritten against a real router. What changed:
 *
 * - Links are <NavLink>s to real URLs, not `scrollIntoView` calls on section
 *   ids. The old "Free sessions" item scrolled to `#learning` while the free
 *   sessions lived at `#free-learning`, so it silently landed users on the
 *   wrong section (AUDIT.md §H9).
 * - Active state comes from the router, not a scroll listener that ran
 *   unthrottled and called getBoundingClientRect() six times per frame.
 * - `aria-current="page"` is set, so the highlight is conveyed non-visually.
 * - Search actually searches — it navigates to /courses?q=… instead of
 *   discarding the query and scrolling to a section.
 * - Colours are tokens. The old navbar was hardcoded `bg-white`, which is why
 *   it stayed white in dark mode over a dark page.
 */

const LINKS = [
  { to: '/courses', key: 'nav.courses' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/free', key: 'nav.freeSessions' },
  { to: '/about', key: 'nav.about' },
] as const;

export function Navbar({ variant }: { variant: 'marketing' | 'app' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, user, signOut, cart } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(menuOpen);

  // Close the drawer on navigation — the old drawer stayed open behind the
  // new page because it was never told the route changed.
  //
  // This is React's documented "adjust state when a prop changes" pattern
  // rather than an effect: an effect would render the open drawer over the new
  // page for one frame, then close it. Adjusting during render never paints
  // the wrong thing.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (variant !== 'marketing') return;
    // Passive + a single boolean comparison. No layout reads.
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const onDark = variant === 'marketing';
  const transparent = onDark && !scrolled;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/courses?q=${encodeURIComponent(q)}` : '/courses');
    setMenuOpen(false);
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-bold transition-colors',
      onDark
        ? isActive
          ? 'text-white'
          : 'text-white/70 hover:text-white'
        : isActive
          ? 'text-brand-text'
          : 'text-fg-muted hover:text-fg',
    );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 safe-top transition-colors duration-300',
        transparent
          ? 'border-b border-transparent bg-transparent'
          : onDark
            ? 'border-b border-white/10 bg-ink/85 backdrop-blur-xl'
            : 'border-b border-line bg-surface/90 backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 rounded-lg"
          aria-label={`${t('brand.name')} — ${t('nav.home')}`}
        >
          <BrandLogo tone={onDark ? 'light' : 'auto'} />
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={submitSearch}
          role="search"
          className="ms-2 hidden min-w-0 flex-1 md:block lg:max-w-xs"
        >
          <label htmlFor="site-search" className="sr-only">
            {t('nav.search')}
          </label>
          <div className="relative">
            <Search
              className={cn(
                'pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2',
                onDark ? 'text-white/50' : 'text-fg-subtle',
              )}
              aria-hidden
            />
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('nav.search')}
              className={cn(
                'h-10 w-full rounded-full border ps-9 pe-4 text-sm transition-colors focus:outline-none focus:ring-2',
                onDark
                  ? 'border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:ring-white/30'
                  : 'border-line bg-surface-2 text-fg placeholder:text-fg-subtle focus:border-brand focus:ring-brand/30',
              )}
            />
          </div>
        </form>

        <nav aria-label="Main" className="ms-auto hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-2">
          {variant === 'app' && <ThemeToggle className="hidden sm:inline-flex" />}
          <LanguageSwitcher tone={onDark ? 'light' : 'auto'} className="hidden sm:block" />

          <CartButton count={cart.length} onDark={onDark} />

          {isSignedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink
                to="/dashboard"
                variant={onDark ? 'onDark' : 'secondary'}
                size="md"
                leadingIcon={<BookOpen className="size-4" />}
              >
                <span className="hidden lg:inline">{t('nav.myLearning')}</span>
                <span className="lg:hidden sr-only">{t('nav.myLearning')}</span>
              </ButtonLink>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className={cn(
                  'grid size-10 place-items-center rounded-control transition-colors',
                  onDark
                    ? 'text-white/70 hover:bg-white/10 hover:text-white'
                    : 'text-fg-subtle hover:bg-surface-2 hover:text-danger-text',
                )}
                aria-label={`${t('nav.signOut')} (${user?.email ?? ''})`}
                title={t('nav.signOut')}
              >
                <LogOut className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink
                to="/signin"
                state={{ from: location.pathname }}
                variant="ghost"
                size="md"
                className={onDark ? 'text-white/80 hover:bg-white/10 hover:text-white' : undefined}
              >
                {t('nav.signIn')}
              </ButtonLink>
              <ButtonLink to="/consultation" variant="primary" size="md">
                {t('nav.bookConsultation')}
              </ButtonLink>
            </div>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              'grid size-10 place-items-center rounded-control transition-colors lg:hidden',
              onDark ? 'text-white hover:bg-white/10' : 'text-fg hover:bg-surface-2',
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="animate-fade-in fixed inset-0 top-16 bg-black/50 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div
            id="mobile-nav"
            className="animate-fade-in absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-surface px-4 pb-6 pt-4 shadow-2xl safe-bottom lg:hidden"
          >
            <form onSubmit={submitSearch} role="search" className="mb-4">
              <label htmlFor="mobile-search" className="sr-only">
                {t('nav.search')}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
                  aria-hidden
                />
                <input
                  id="mobile-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="h-12 w-full rounded-control border border-line bg-surface-2 ps-9 pe-4 text-base text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            </form>

            <nav aria-label="Mobile" className="flex flex-col">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-control px-3 py-3.5 text-base font-bold transition-colors',
                      isActive ? 'bg-brand-soft text-brand-text' : 'text-fg hover:bg-surface-2',
                    )
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
              <LanguageSwitcher className="flex-1 [&>button]:w-full" />
              {variant === 'app' && <ThemeToggle />}
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              {isSignedIn ? (
                <>
                  <ButtonLink
                    to="/dashboard"
                    fullWidth
                    size="lg"
                    leadingIcon={<BookOpen className="size-4" />}
                  >
                    {t('nav.myLearning')}
                  </ButtonLink>
                  <Button
                    variant="secondary"
                    fullWidth
                    size="lg"
                    leadingIcon={<LogOut className="size-4" />}
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                  >
                    {t('nav.signOut')}
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink to="/consultation" fullWidth size="lg">
                    {t('nav.bookConsultation')}
                  </ButtonLink>
                  <ButtonLink
                    to="/signin"
                    state={{ from: location.pathname }}
                    variant="secondary"
                    fullWidth
                    size="lg"
                    leadingIcon={<User className="size-4" />}
                  >
                    {t('nav.signIn')}
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function CartButton({ count, onDark }: { count: number; onDark: boolean }) {
  const { t } = useTranslation();
  return (
    <Link
      to="/cart"
      className={cn(
        'relative grid size-10 place-items-center rounded-control transition-colors',
        onDark ? 'text-white hover:bg-white/10' : 'text-fg hover:bg-surface-2',
      )}
      aria-label={count > 0 ? `${t('nav.cart')} (${count})` : t('nav.cart')}
    >
      <ShoppingCart className="size-5" aria-hidden />
      {count > 0 && (
        <span
          className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-extrabold text-brand-fg"
          aria-hidden
        >
          {count}
        </span>
      )}
    </Link>
  );
}
