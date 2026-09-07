import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/**
 * Trap focus inside a container while it is active, and restore focus to the
 * element that opened it on unmount.
 *
 * The previous modals had none of this. Tab walked straight out of the dialog
 * into the page behind the backdrop, and on close the user was dumped at the
 * top of the document — which for a keyboard or screen-reader user means
 * re-navigating the entire page to get back to where they were.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus in. Prefer an explicitly marked element, else the first
    // focusable, else the container itself (which carries tabIndex={-1}).
    const initial =
      container.querySelector<HTMLElement>('[data-autofocus]') ?? getFocusable(container)[0] ?? container;
    // rAF so the element is painted and focusable before we call focus().
    const raf = requestAnimationFrame(() => initial.focus({ preventScroll: true }));

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !container) return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active_ = document.activeElement;

      if (event.shiftKey && (active_ === first || active_ === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active_ === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      // Restore focus only if it is still inside the (now closing) container.
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [ref, active]);
}
