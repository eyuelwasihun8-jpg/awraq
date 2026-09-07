import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Form controls with labels, hints and errors wired up correctly.
 *
 * Every form in the previous build had bare <input>s with a sibling <label>
 * and no `htmlFor`/`id` pairing — so clicking the label did nothing, screen
 * readers announced "edit text, blank", and browser autofill had nothing to
 * match against. None of them had error states at all.
 *
 * Here the id is generated once with useId and threaded to `htmlFor`,
 * `aria-describedby` and `aria-invalid` automatically.
 */

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Visually hide the label but keep it for assistive tech. */
  hideLabel?: boolean;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
  }) => ReactNode;
  className?: string;
}

export function Field({
  label,
  hint,
  error,
  required,
  hideLabel,
  children,
  className,
}: FieldShellProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          'block text-sm font-bold text-fg',
          hideLabel && 'sr-only',
        )}
      >
        {label}
        {required && (
          <span className="ml-1 text-danger-text" aria-hidden>
            *
          </span>
        )}
      </label>

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })}

      {hint && !error && (
        <p id={hintId} className="text-xs font-medium text-fg-subtle">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-bold text-danger-text">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

const CONTROL = cn(
  'w-full rounded-control border bg-surface px-3.5 py-2.5 text-base text-fg',
  'border-line-strong placeholder:text-fg-subtle',
  'transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/30',
);

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode;
  /** Static prefix inside the control, e.g. "+251". */
  prefix?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, leadingIcon, prefix, ...rest },
  ref,
) {
  if (prefix) {
    return (
      <div className="flex">
        <span className="inline-flex select-none items-center rounded-l-control border border-r-0 border-line-strong bg-surface-2 px-3.5 text-sm font-bold text-fg-muted">
          {prefix}
        </span>
        <input ref={ref} className={cn(CONTROL, 'rounded-l-none', className)} {...rest} />
      </div>
    );
  }

  if (leadingIcon) {
    return (
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
          aria-hidden
        >
          {leadingIcon}
        </span>
        <input ref={ref} className={cn(CONTROL, 'pl-10', className)} {...rest} />
      </div>
    );
  }

  return <input ref={ref} className={cn(CONTROL, className)} {...rest} />;
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cn(CONTROL, 'resize-y', className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(CONTROL, 'cursor-pointer pr-9', className)} {...rest}>
        {children}
      </select>
    );
  },
);
