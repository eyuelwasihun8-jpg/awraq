import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Lightweight toast system.
 *
 * The old app had no notification primitive at all, so every confirmation was
 * a full-screen takeover — saving a note, copying a link and completing an
 * order all replaced the page the user was working in. Toasts let non-blocking
 * feedback stay non-blocking.
 *
 * Announced via `role="status"` + `aria-live="polite"` so screen readers get
 * the same feedback sighted users do.
 */

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastValue | null>(null);

const ICONS: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

const STYLES: Record<ToastVariant, string> = {
  success: 'border-success/40 text-success-text',
  error: 'border-danger/40 text-danger-text',
  info: 'border-line text-fg',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastValue['toast']>(
    (message, variant = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 safe-bottom sm:items-end sm:p-6"
      >
        {toasts.map(({ id, message, variant }) => {
          const Icon = ICONS[variant];
          return (
            <div
              key={id}
              className={cn(
                'animate-slide-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-control border bg-surface p-4 shadow-lg',
                STYLES[variant],
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="flex-1 text-sm font-semibold text-fg">{message}</p>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="-m-1 rounded p-1 text-fg-subtle transition-colors hover:text-fg"
                aria-label="Dismiss notification"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
