import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with correct conflict resolution.
 *
 * Without this, `cn('px-4', props.className)` silently loses to whichever class
 * the compiler emitted last. With it, the caller always wins — which is what
 * makes the `className` escape hatch on our primitives actually reliable.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
