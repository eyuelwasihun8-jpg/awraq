import { cn } from '../lib/cn';

/**
 * Wordmark.
 *
 * Previously the navbar applied `brightness-0 invert` to force the logo white
 * over the dark hero — a filter hack that also destroyed the accent colour and
 * cost a repaint on every scroll. The mark is now an inline SVG that takes its
 * colours from props, so both surfaces get a correct, sharp logo.
 */
export function BrandLogo({
  size = 'md',
  tone = 'auto',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  /** `auto` follows the theme; `light` is for fixed-dark marketing surfaces. */
  tone?: 'auto' | 'light';
  className?: string;
}) {
  const dimensions = { sm: 24, md: 30, lg: 38 }[size];
  const text = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }[size];

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={dimensions}
        height={dimensions}
        viewBox="0 0 64 64"
        aria-hidden
        className="shrink-0"
      >
        <rect width="64" height="64" rx="14" className="fill-ink" />
        <path
          d="M20 44 L32 18 L44 44"
          fill="none"
          stroke="var(--cyan-500)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M25.5 36 H38.5" stroke="var(--amber-400)" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span
        className={cn(
          'font-extrabold tracking-tight',
          text,
          tone === 'light' ? 'text-white' : 'text-fg',
        )}
      >
        Awraq
      </span>
    </span>
  );
}
