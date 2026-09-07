import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * The one button in the system.
 *
 * The previous codebase had the "pressable" treatment
 * (`border-b-[5px] hover:border-b-[2px] hover:translate-y-[3px]`) copy-pasted
 * across ~40 call sites in four different colours, with the shadow, radius and
 * border colour hand-tuned each time. It was the best interaction in the app
 * and the least consistent thing in it.
 *
 * Notes:
 * - `primary` uses a brand fill with dark text (9.41:1) rather than brand text
 *   on white (1.90:1). See AUDIT.md §C5.
 * - The press effect is a translate + border-width swap, which is composited
 *   and doesn't reflow. It's disabled under `prefers-reduced-motion` by the
 *   global rule in index.css.
 * - `loading` keeps the button mounted and sized, sets `aria-busy`, and blocks
 *   double submission — the old checkout could be double-tapped during its
 *   fake 2s timeout.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'onDark';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: cn(
    'bg-brand text-brand-fg border-b-[3px] border-b-[color-mix(in_srgb,var(--brand)_70%,black)]',
    'hover:bg-brand-hover shadow-[0_6px_16px_-6px_var(--brand)]',
  ),
  success: cn(
    'bg-success text-white border-b-[3px] border-b-[color-mix(in_srgb,var(--success)_70%,black)]',
    'hover:brightness-110 shadow-[0_6px_16px_-6px_var(--success)]',
  ),
  danger: cn(
    'bg-danger text-white border-b-[3px] border-b-[color-mix(in_srgb,var(--danger)_70%,black)]',
    'hover:brightness-110',
  ),
  secondary: cn(
    'bg-surface text-fg border border-line-strong border-b-[3px]',
    'hover:bg-surface-2 hover:border-line-strong',
  ),
  ghost: 'bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg',
  // For the fixed-dark marketing surfaces, where themed tokens don't apply.
  onDark: cn(
    'bg-white/10 text-white border border-white/20 border-b-[3px] border-b-white/25',
    'hover:bg-white/20 backdrop-blur-md',
  ),
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-control',
  lg: 'h-13 px-7 text-base gap-2.5 rounded-control',
};

const BASE = cn(
  'relative inline-flex select-none items-center justify-center whitespace-nowrap font-bold',
  'transition-[transform,background-color,border-width,filter] duration-150',
  'active:translate-y-[2px] active:border-b-[1px]',
  'disabled:pointer-events-none disabled:opacity-55',
  'aria-busy:pointer-events-none',
);

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  /** Rendered before the label; hidden from a11y tree. */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

function useButtonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: CommonProps): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className);
}

function Content({
  loading,
  leadingIcon,
  trailingIcon,
  children,
}: Pick<CommonProps, 'loading' | 'leadingIcon' | 'trailingIcon' | 'children'>) {
  return (
    <>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {!loading && leadingIcon && <span aria-hidden>{leadingIcon}</span>}
      {children}
      {!loading && trailingIcon && <span aria-hidden>{trailingIcon}</span>}
    </>
  );
}

// ── <button> ──────────────────────────────────────────────────

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, fullWidth, leadingIcon, trailingIcon, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      // Explicit: an unspecified <button> inside a <form> defaults to submit,
      // which is how the old filter chips accidentally submitted the search.
      type={rest.type ?? 'button'}
      aria-busy={loading || undefined}
      disabled={rest.disabled || loading}
      className={useButtonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      <Content loading={loading} leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </Content>
    </button>
  );
});

// ── <Link> (internal navigation) ──────────────────────────────

export type ButtonLinkProps = CommonProps & LinkProps;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant, size, fullWidth, leadingIcon, trailingIcon, className, children, ...rest },
  ref,
) {
  return (
    <Link ref={ref} className={useButtonClasses({ variant, size, fullWidth, className })} {...rest}>
      <Content leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </Content>
    </Link>
  );
});

// ── <a> (external) ────────────────────────────────────────────

export type ButtonAnchorProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const ButtonAnchor = forwardRef<HTMLAnchorElement, ButtonAnchorProps>(function ButtonAnchor(
  { variant, size, fullWidth, leadingIcon, trailingIcon, className, children, ...rest },
  ref,
) {
  const isExternal = /^https?:/.test(rest.href);
  return (
    <a
      ref={ref}
      // noopener protects against reverse-tabnabbing on target=_blank.
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={useButtonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      <Content leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </Content>
    </a>
  );
});
