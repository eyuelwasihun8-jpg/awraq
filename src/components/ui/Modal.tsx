import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { useLockBodyScroll } from '../../lib/useLockBodyScroll';

/**
 * Accessible dialog.
 *
 * The previous build had five hand-rolled modals with, collectively:
 *   - no role="dialog", aria-modal or accessible name
 *   - no Escape-to-close
 *   - no focus trap and no focus restoration
 *   - backdrop dismissal via onClick, so a drag that started inside the dialog
 *     and ended on the backdrop destroyed whatever the user had typed
 *
 * All five now render through this component. Behaviour:
 *   - Portals to <body> so it can never be clipped by an ancestor's
 *     `overflow: hidden` or trapped under a stacking context.
 *   - `aria-labelledby` wired to the title, `aria-describedby` to the optional
 *     description.
 *   - Escape closes, unless `dismissible={false}` (used while a payment is in
 *     flight, where dismissing would orphan the transaction).
 *   - Backdrop dismissal tracks pointerdown target, so drags don't close it.
 *   - Mobile presents as a bottom sheet, desktop as a centred dialog.
 */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dismissible?: boolean;
  /** Hide the visual title but keep it for assistive tech. */
  hideTitle?: boolean;
  className?: string;
}

const SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
} as const;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  hideTitle = false,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pointerDownOnBackdrop = useRef(false);
  const titleId = useId();
  const descId = useId();

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open || !dismissible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4"
      // Only a pointerdown that BEGAN on the backdrop may dismiss.
      onPointerDown={(e) => {
        pointerDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onPointerUp={(e) => {
        if (dismissible && pointerDownOnBackdrop.current && e.target === e.currentTarget) {
          onClose();
        }
        pointerDownOnBackdrop.current = false;
      }}
    >
      <div className="animate-fade-in fixed inset-0 bg-black/60 backdrop-blur-[2px]" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'animate-slide-up relative flex max-h-[92dvh] w-full flex-col overflow-hidden',
          'rounded-t-3xl bg-surface shadow-2xl outline-none sm:animate-scale-in sm:rounded-3xl',
          'border border-line',
          SIZES[size],
          className,
        )}
      >
        {/* Drag affordance — communicates "swipe/tap away" on touch. */}
        <div className="flex justify-center pt-3 sm:hidden" aria-hidden>
          <div className="h-1 w-10 rounded-full bg-line-strong" />
        </div>

        <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-4 sm:px-7 sm:pt-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className={cn(
                'text-lg font-extrabold leading-tight text-fg sm:text-xl',
                hideTitle && 'sr-only',
              )}
            >
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm font-medium text-fg-muted">
                {description}
              </p>
            )}
          </div>

          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              className="-mr-1 -mt-1 grid size-10 shrink-0 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
              aria-label={`Close ${title}`}
            >
              <X className="size-5" aria-hidden />
            </button>
          )}
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 pb-6 sm:px-7">{children}</div>

        {footer && (
          <div className="border-t border-line bg-surface-2/60 px-5 py-4 safe-bottom sm:px-7">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
