import { cn } from '../lib/cn';

/**
 * Awraq Skills logo.
 *
 * Rebuilt as inline SVG + live text from the supplied artwork rather than
 * shipped as a JPG, because a raster logo:
 *   - blurs on every retina/zoom level and in print (the certificate),
 *   - carries a baked-in navy box that fights any surface it sits on,
 *   - cannot recolour for the light app theme,
 *   - costs ~40 kB for something that is ~1 kB of vectors.
 *
 * The brand structure from the artwork is preserved exactly:
 *   "Awr" in the foreground colour, "aq" in the logo gold, "SKILLS" locked up
 *   beneath, and the ™ mark. Colours are sampled from the source file:
 *   navy #12294A, gold #C9A227.
 *
 * If you have the original vector, drop it in as `public/brand/wordmark.svg`
 * and swap the <Wordmark> below for an <img> — nothing else needs to change.
 */

type Tone = 'auto' | 'light';

/**
 * The icon mark: navy tile, white "A", gold crossbar.
 *
 * An earlier draft paired the "A" with a gold "aq" ligature to mirror the
 * wordmark. Rendered at favicon size it read as "A2", and at 16px the two
 * glyphs collapsed into noise. Carrying the white/gold split *inside* a single
 * letter says the same thing, stays unambiguous, and is still legible in a
 * browser tab.
 */
export function BrandMark({
  size = 32,
  className,
  /**
   * Hide the mark from assistive tech. Set this whenever the mark sits next to
   * something that already names the brand — otherwise the logo is announced
   * twice ("Awraq Skills, Awraq Skills"), which is exactly what <BrandLogo>
   * used to do.
   */
  decorative = false,
}: {
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'Awraq Skills' })}
      className={cn('shrink-0', className)}
    >
      <rect width="64" height="64" rx="15" fill="var(--navy-800)" />
      <path
        d="M18 47 L32 16 L46 47"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.5 37.5 H39.5"
        stroke="var(--gold-500)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The stacked wordmark.
 *
 * Rendered as text so it inherits the page's font, stays selectable and
 * searchable, and recolours with the theme. `aria-hidden` on the pieces plus a
 * single accessible name on the wrapper stops screen readers spelling out
 * "Awr… aq… SKILLS" as three fragments.
 */
function Wordmark({ tone, size }: { tone: Tone; size: 'sm' | 'md' | 'lg' }) {
  const scale = {
    sm: { name: 'text-base', sub: 'text-[8px] tracking-[0.22em]' },
    md: { name: 'text-xl', sub: 'text-[9px] tracking-[0.26em]' },
    lg: { name: 'text-3xl', sub: 'text-[11px] tracking-[0.28em]' },
  }[size];

  return (
    <span className="flex flex-col justify-center leading-none" aria-hidden>
      <span className={cn('font-extrabold tracking-tight', scale.name)}>
        <span className={tone === 'light' ? 'text-white' : 'text-fg'}>Awr</span>
        <span className="text-gold">aq</span>
        <span
          className={cn(
            'align-super text-[0.45em] font-bold',
            tone === 'light' ? 'text-white/60' : 'text-fg-subtle',
          )}
        >
          ™
        </span>
      </span>
      <span
        className={cn(
          'mt-0.5 font-extrabold uppercase',
          scale.sub,
          tone === 'light' ? 'text-white/70' : 'text-fg-muted',
        )}
      >
        Skills
      </span>
    </span>
  );
}

export function BrandLogo({
  size = 'md',
  tone = 'auto',
  showMark = true,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  /** `light` for the fixed-navy marketing surfaces. */
  tone?: Tone;
  showMark?: boolean;
  className?: string;
}) {
  const markSize = { sm: 26, md: 34, lg: 46 }[size];

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {showMark && <BrandMark size={markSize} decorative />}
      <Wordmark tone={tone} size={size} />
      <span className="sr-only">Awraq Skills</span>
    </span>
  );
}
