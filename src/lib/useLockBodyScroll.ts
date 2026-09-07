import { useEffect, useRef } from 'react';

/**
 * Lock page scroll while an overlay is open — without the layout shift.
 *
 * The old code set `document.body.style.overflow = 'hidden'` in three separate
 * components. Two problems: (1) nested overlays fought over the same property,
 * so closing the inner one unlocked the page behind the outer one, and (2) on
 * desktop, removing the scrollbar shifted the entire layout ~15px sideways.
 *
 * This uses a reference count and compensates for the scrollbar width.
 */

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function lock() {
  if (lockCount === 0) {
    const { body } = document;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbarWidth}px`;
    }
  }
  lockCount += 1;
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  }
}

export function useLockBodyScroll(active: boolean): void {
  const isLocked = useRef(false);

  useEffect(() => {
    if (active && !isLocked.current) {
      isLocked.current = true;
      lock();
    } else if (!active && isLocked.current) {
      isLocked.current = false;
      unlock();
    }

    return () => {
      if (isLocked.current) {
        isLocked.current = false;
        unlock();
      }
    };
  }, [active]);
}
