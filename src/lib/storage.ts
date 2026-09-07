/**
 * Namespaced, fail-safe wrapper around localStorage.
 *
 * The previous implementation called `JSON.parse(localStorage.getItem(...))`
 * directly inside `useState` initialisers. One corrupted key — from a half
 * written value, a quota error, or a user editing devtools — threw during
 * render and white-screened the entire app with no recovery path.
 *
 * Every operation here is total: it either returns a valid value or the
 * fallback. It never throws.
 */

const PREFIX = 'awraq.';

function isAvailable(): boolean {
  try {
    const probe = `${PREFIX}__probe__`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    // Safari private mode, disabled cookies, quota exhausted.
    return false;
  }
}

const available = typeof window !== 'undefined' && isAvailable();

/** In-memory fallback so the app still works when storage is unavailable. */
const memory = new Map<string, string>();

function read(key: string): string | null {
  if (!available) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (!available) {
    memory.set(key, value);
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota exceeded — degrade to memory rather than crash a checkout.
    memory.set(key, value);
  }
}

export const storage = {
  /**
   * Read and parse a JSON value.
   * @param validate Optional type guard. If it fails, the corrupt value is
   *        discarded and the fallback returned — self-healing on bad data.
   */
  get<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
    const raw = read(PREFIX + key);
    if (raw === null) return fallback;

    try {
      const parsed: unknown = JSON.parse(raw);
      if (validate && !validate(parsed)) {
        storage.remove(key);
        return fallback;
      }
      return parsed as T;
    } catch {
      storage.remove(key);
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      write(PREFIX + key, JSON.stringify(value));
    } catch {
      /* value contained a cycle — nothing sensible to do, drop it */
    }
  },

  remove(key: string): void {
    if (!available) {
      memory.delete(PREFIX + key);
      return;
    }
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* no-op */
    }
  },

  /** Clear only Awraq keys — never nuke the whole origin. */
  clearNamespace(): void {
    if (!available) {
      memory.clear();
      return;
    }
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      /* no-op */
    }
  },
};

export const isArrayOf =
  <T>(guard: (v: unknown) => v is T) =>
  (value: unknown): value is T[] =>
    Array.isArray(value) && value.every(guard);

export const isString = (v: unknown): v is string => typeof v === 'string';
