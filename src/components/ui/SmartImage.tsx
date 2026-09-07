import { useState, type ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  /** Intrinsic aspect ratio — reserves space so the image can't shift layout. */
  ratio?: '16/9' | '4/3' | '1/1' | '3/2';
  /** Only the LCP image should be eager. Everything else defers. */
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const RATIOS = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-4/3',
  '1/1': 'aspect-square',
  '3/2': 'aspect-3/2',
} as const;

/**
 * Image with lazy loading, reserved space and a real error state.
 *
 * The previous build had 31 <img> tags: zero with `loading`, zero with
 * intrinsic dimensions, zero with error handling. The homepage alone fetched
 * ~20 full-size Unsplash images on first paint, and every one of them was a
 * cumulative-layout-shift contributor as it popped in.
 *
 * - `loading="lazy"` + `decoding="async"` for everything below the fold.
 * - `fetchPriority="high"` only for the hero.
 * - A skeleton holds the box until load, so nothing reflows.
 * - Broken sources render a labelled placeholder instead of the browser's
 *   torn-page icon (the old Cloudinary URLs 404 regularly).
 */
export function SmartImage({
  src,
  alt,
  ratio = '16/9',
  priority = false,
  className,
  wrapperClassName,
  ...rest
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={cn('relative overflow-hidden bg-surface-2', RATIOS[ratio], wrapperClassName)}>
      {status === 'loading' && <div className="skeleton absolute inset-0" aria-hidden />}

      {status === 'error' ? (
        <div className="absolute inset-0 grid place-items-center gap-2 text-fg-subtle">
          <ImageOff className="size-6" aria-hidden />
          <span className="sr-only">{alt} (image unavailable)</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'size-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...rest}
        />
      )}
    </div>
  );
}

/** Round avatar variant — same loading discipline, different shape. */
export function Avatar({
  src,
  alt,
  size = 40,
  className,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = alt
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  if (!src || failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          'grid shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-extrabold text-brand-text',
          className,
        )}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className={cn('shrink-0 rounded-full object-cover', className)}
    />
  );
}
