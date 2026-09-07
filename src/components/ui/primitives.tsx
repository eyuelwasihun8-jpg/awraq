import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// ── Badge ─────────────────────────────────────────────────────

type BadgeTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'onDark';

const TONES: Record<BadgeTone, string> = {
  brand: 'bg-brand-soft text-brand-text',
  success: 'bg-success-soft text-success-text',
  warning: 'bg-warning-soft text-warning-text',
  danger: 'bg-danger-soft text-danger-text',
  neutral: 'bg-surface-2 text-fg-muted',
  onDark: 'bg-white/10 text-white border border-white/20 backdrop-blur-md',
};

export function Badge({
  tone = 'neutral',
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide',
        TONES[tone],
        className,
      )}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────

export function Card({
  as: Tag = 'div',
  interactive = false,
  className,
  children,
}: {
  as?: 'div' | 'article' | 'section' | 'li';
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-line bg-surface',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

// ── Progress ──────────────────────────────────────────────────

/**
 * `role="progressbar"` with the full ARIA value set — the old progress bars
 * were bare divs with an inline width, invisible to assistive tech.
 */
export function ProgressBar({
  value,
  label,
  tone = 'brand',
  size = 'md',
  className,
}: {
  /** 0–100 */
  value: number;
  label: string;
  tone?: 'brand' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        'w-full overflow-hidden rounded-full bg-surface-2',
        size === 'sm' ? 'h-1' : 'h-2',
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500',
          tone === 'success' ? 'bg-success' : 'bg-brand',
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

// ── Rating ────────────────────────────────────────────────────

/**
 * Renders nothing when there are no reviews. Fabricated ratings are worse than
 * absent ones — see AUDIT.md §H6.
 */
export function Rating({
  value,
  count,
  className,
}: {
  value?: number;
  count?: number;
  className?: string;
}) {
  if (!value || !count) return null;

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      <span className="font-extrabold text-warning-text">{value.toFixed(1)}</span>
      <span aria-hidden className="text-warning-text">
        {'★'.repeat(Math.round(value))}
        <span className="opacity-30">{'★'.repeat(5 - Math.round(value))}</span>
      </span>
      <span className="font-semibold text-fg-subtle">({count})</span>
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5 from {count} reviews
      </span>
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-md', className)} aria-hidden />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <Skeleton className="mb-4 aspect-video w-full rounded-xl" />
      <Skeleton className="mb-2 h-4 w-20" />
      <Skeleton className="mb-2 h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-dashed border-line px-6 py-14 text-center',
        className,
      )}
    >
      {icon && <div className="mb-4 text-fg-subtle">{icon}</div>}
      <h3 className="text-base font-extrabold text-fg">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm font-medium text-fg-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'start';
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl space-y-3',
        align === 'center' ? 'mx-auto text-center' : 'text-start',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'text-xs font-extrabold uppercase tracking-[0.14em]',
            onDark ? 'text-brand' : 'text-brand-text',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'text-3xl font-extrabold tracking-tight text-balance md:text-4xl',
          onDark ? 'text-white' : 'text-fg',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-base font-medium leading-relaxed text-pretty',
            onDark ? 'text-white/70' : 'text-fg-muted',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
