import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { storage } from '../lib/storage';

export type Theme = 'light' | 'dark';

interface ThemeValue {
  theme: Theme;
  /** True when the user has explicitly chosen, vs. following the OS. */
  isExplicit: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);
const KEY = 'theme';

/**
 * Theme provider.
 *
 * Two fixes over the previous implementation:
 *
 * 1. No mount gate. The old provider returned a dummy `light` context until
 *    `mounted` flipped true, which meant the first paint was always light and
 *    dark-mode users got a white flash on every load. The initial theme is now
 *    applied by an inline script in index.html before first paint, and this
 *    provider just reads it back.
 *
 * 2. Transitions are scoped. The old stylesheet put a 300ms transition on
 *    `*, *::before, *::after` permanently — every hover on every element paid
 *    for it. Here a `.theme-switching` class is added for exactly one frame
 *    during the swap, then removed.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'dark' ? 'dark' : 'light';
  });
  const [isExplicit, setIsExplicit] = useState(() => storage.get<Theme | null>(KEY, null) !== null);

  const apply = useCallback((next: Theme, explicit: boolean) => {
    const root = document.documentElement;

    root.classList.add('theme-switching');
    root.setAttribute('data-theme', next);

    // Remove the transition class after it has run so it never taxes hovers.
    window.setTimeout(() => root.classList.remove('theme-switching'), 240);

    setThemeState(next);
    if (explicit) {
      setIsExplicit(true);
      storage.set(KEY, next);
    }
  }, []);

  // Follow the OS only while the user hasn't made an explicit choice.
  useEffect(() => {
    if (isExplicit) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => apply(e.matches ? 'dark' : 'light', false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [isExplicit, apply]);

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      isExplicit,
      setTheme: (next) => apply(next, true),
      toggleTheme: () => apply(theme === 'dark' ? 'light' : 'dark', true),
    }),
    [theme, isExplicit, apply],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
