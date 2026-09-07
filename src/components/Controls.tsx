import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/cn';
import { SUPPORTED_LANGUAGES, changeLanguage } from '../i18n/config';
import { useTheme } from '../theme/ThemeProvider';

interface ToneProps {
  /** `light` for fixed-dark marketing surfaces. */
  tone?: 'auto' | 'light';
  className?: string;
}

const controlClasses = (tone: ToneProps['tone']) =>
  cn(
    'inline-flex h-10 items-center justify-center gap-1.5 rounded-control border px-3 text-sm font-bold transition-colors',
    tone === 'light'
      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
      : 'border-line bg-surface text-fg hover:bg-surface-2',
  );

// ── Language ──────────────────────────────────────────────────

export function LanguageSwitcher({ tone = 'auto', className }: ToneProps) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current =
    SUPPORTED_LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) ?? SUPPORTED_LANGUAGES[0];

  // Close on outside click AND on Escape — the old version only handled
  // mousedown, so keyboard users could never dismiss the menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={controlClasses(tone)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('nav.language')}: ${current.label}`}
      >
        <Globe className="size-4" aria-hidden />
        <span>{current.short}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="animate-scale-in absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-control border border-line bg-surface py-1 shadow-xl"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = i18n.language?.startsWith(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  void changeLanguage(lang.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-start text-sm font-bold text-fg transition-colors hover:bg-surface-2"
              >
                {lang.label}
                {active && <Check className="size-4 text-brand-text" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Theme ─────────────────────────────────────────────────────

/**
 * Theme toggle.
 *
 * Only rendered inside the app shell. The marketing pages are intentionally
 * fixed-dark, so offering a toggle there would be a control that does nothing —
 * which is exactly the bug this replaces (AUDIT.md §H3).
 */
export function ThemeToggle({ tone = 'auto', className }: ToneProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const label = theme === 'dark' ? t('nav.toLight') : t('nav.toDark');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(controlClasses(tone), 'w-10 px-0', className)}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}
