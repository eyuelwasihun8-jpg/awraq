import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { storage } from '../lib/storage';
import type {
  CartLine,
  CourseProgress,
  Entitlement,
  LessonNote,
  Order,
  OrderLine,
  PaymentMethod,
  PurchasableKind,
  User,
} from '../types';

/**
 * Application store.
 *
 * Replaces the previous eight `useState` hooks + five `useEffect` persistence
 * hooks that lived in App.tsx. Benefits:
 *
 * - State transitions are named and atomic. Completing a bundle purchase used
 *   to fire ~6 separate setState calls inside a forEach, each triggering a
 *   render and each reading a stale `purchaseHistory` closure.
 * - Persistence is one effect over a derived snapshot, not five.
 * - Entitlements are a single flat list instead of three parallel arrays
 *   (`purchasedCourseIds`, `purchasedDigitalProductIds`, `purchaseHistory`)
 *   that could — and did — drift out of sync.
 *
 * SECURITY: this is client state for a demo build. Entitlements are advisory
 * only — the real system must verify a Chapa webhook server-side and gate
 * signed media URLs behind a session check. A localStorage flag is not access
 * control. See AUDIT.md §C4.
 */

// ───────────────────────────────────────────────────────────────
// State
// ───────────────────────────────────────────────────────────────

interface State {
  user: User | null;
  entitlements: Entitlement[];
  orders: Order[];
  cart: CartLine[];
  progress: Record<string, CourseProgress>;
  notes: LessonNote[];
  /** Set while a mock payment is in flight so the UI can disable inputs. */
  checkoutStatus: 'idle' | 'processing' | 'succeeded' | 'failed';
}

const EMPTY: State = {
  user: null,
  entitlements: [],
  orders: [],
  cart: [],
  progress: {},
  notes: [],
  checkoutStatus: 'idle',
};

type Action =
  | { type: 'auth/signedIn'; user: User }
  | { type: 'auth/signedOut' }
  | { type: 'cart/add'; line: CartLine }
  | { type: 'cart/remove'; itemId: string }
  | { type: 'cart/clear' }
  | { type: 'checkout/start' }
  | { type: 'checkout/fail' }
  | { type: 'checkout/succeed'; order: Order; entitlements: Entitlement[] }
  | { type: 'checkout/reset' }
  | { type: 'entitlement/grantFree'; itemId: string; kind: PurchasableKind }
  | { type: 'progress/start'; courseId: string }
  | { type: 'progress/setLesson'; courseId: string; lessonId: string }
  | {
      type: 'progress/complete';
      courseId: string;
      lessonId: string;
      totalLessons: number;
    }
  | { type: 'progress/uncomplete'; courseId: string; lessonId: string }
  | { type: 'note/save'; courseId: string; lessonId: string; body: string }
  | { type: 'note/delete'; courseId: string; lessonId: string }
  | { type: 'state/hydrate'; state: Partial<State> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'state/hydrate':
      return { ...state, ...action.state, checkoutStatus: 'idle' };

    case 'auth/signedIn':
      return { ...state, user: action.user };

    /**
     * Sign-out clears identity but KEEPS entitlements and progress in storage,
     * so signing back in on the same device restores the learner's library.
     * The selectors below gate all of it behind `user !== null`, so nothing
     * leaks into the signed-out UI.
     */
    case 'auth/signedOut':
      return { ...state, user: null, cart: [], checkoutStatus: 'idle' };

    case 'cart/add':
      if (state.cart.some((l) => l.itemId === action.line.itemId)) return state;
      return { ...state, cart: [...state.cart, action.line] };

    case 'cart/remove':
      return { ...state, cart: state.cart.filter((l) => l.itemId !== action.itemId) };

    case 'cart/clear':
      return { ...state, cart: [] };

    case 'checkout/start':
      return { ...state, checkoutStatus: 'processing' };

    case 'checkout/fail':
      return { ...state, checkoutStatus: 'failed' };

    case 'checkout/reset':
      return { ...state, checkoutStatus: 'idle' };

    case 'checkout/succeed': {
      // De-duplicate: re-granting an owned item must not create a second row.
      const owned = new Set(state.entitlements.map((e) => e.itemId));
      const fresh = action.entitlements.filter((e) => !owned.has(e.itemId));

      const progress = { ...state.progress };
      fresh
        .filter((e) => e.kind === 'course')
        .forEach((e) => {
          progress[e.itemId] ??= { completedLessonIds: [], startedAt: e.grantedAt };
        });

      return {
        ...state,
        checkoutStatus: 'succeeded',
        cart: [],
        orders: [action.order, ...state.orders],
        entitlements: [...state.entitlements, ...fresh],
        progress,
      };
    }

    case 'entitlement/grantFree': {
      if (state.entitlements.some((e) => e.itemId === action.itemId)) return state;
      const now = new Date().toISOString();
      return {
        ...state,
        entitlements: [
          ...state.entitlements,
          { itemId: action.itemId, kind: action.kind, grantedAt: now, orderId: 'free' },
        ],
        progress:
          action.kind === 'course'
            ? { ...state.progress, [action.itemId]: { completedLessonIds: [], startedAt: now } }
            : state.progress,
      };
    }

    case 'progress/start': {
      if (state.progress[action.courseId]) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.courseId]: { completedLessonIds: [], startedAt: new Date().toISOString() },
        },
      };
    }

    case 'progress/setLesson': {
      const current = state.progress[action.courseId];
      if (current?.lastLessonId === action.lessonId) return state; // no-op guard
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.courseId]: {
            completedLessonIds: current?.completedLessonIds ?? [],
            startedAt: current?.startedAt ?? new Date().toISOString(),
            completedAt: current?.completedAt,
            lastLessonId: action.lessonId,
          },
        },
      };
    }

    case 'progress/complete': {
      const current = state.progress[action.courseId] ?? {
        completedLessonIds: [],
        startedAt: new Date().toISOString(),
      };
      if (current.completedLessonIds.includes(action.lessonId)) return state;

      const completedLessonIds = [...current.completedLessonIds, action.lessonId];
      const isFinished = completedLessonIds.length >= action.totalLessons;

      return {
        ...state,
        progress: {
          ...state.progress,
          [action.courseId]: {
            ...current,
            completedLessonIds,
            // Recorded once. The old certificate page rendered `new Date()`
            // on every visit, so the completion date changed every time.
            completedAt: isFinished ? (current.completedAt ?? new Date().toISOString()) : undefined,
          },
        },
      };
    }

    case 'progress/uncomplete': {
      const current = state.progress[action.courseId];
      if (!current) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.courseId]: {
            ...current,
            completedLessonIds: current.completedLessonIds.filter((id) => id !== action.lessonId),
            completedAt: undefined,
          },
        },
      };
    }

    case 'note/save': {
      const body = action.body;
      const rest = state.notes.filter(
        (n) => !(n.courseId === action.courseId && n.lessonId === action.lessonId),
      );
      if (!body.trim()) return { ...state, notes: rest };
      return {
        ...state,
        notes: [
          ...rest,
          { courseId: action.courseId, lessonId: action.lessonId, body, updatedAt: Date.now() },
        ],
      };
    }

    case 'note/delete':
      return {
        ...state,
        notes: state.notes.filter(
          (n) => !(n.courseId === action.courseId && n.lessonId === action.lessonId),
        ),
      };

    default:
      // Exhaustiveness check — adding an action without a case fails the build.
      return assertNever(action, state);
  }
}

/** Compile-time exhaustiveness guard that is still safe at runtime. */
function assertNever(_action: never, state: State): State {
  return state;
}

// ───────────────────────────────────────────────────────────────
// Persistence
// ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'state.v2';

type Persisted = Pick<State, 'user' | 'entitlements' | 'orders' | 'cart' | 'progress' | 'notes'>;

function loadPersisted(): Partial<State> {
  const raw = storage.get<Partial<Persisted>>(STORAGE_KEY, {});
  // Defensive: a shape change between deploys must not crash the app.
  return {
    user: raw.user ?? null,
    entitlements: Array.isArray(raw.entitlements) ? raw.entitlements : [],
    orders: Array.isArray(raw.orders) ? raw.orders : [],
    cart: Array.isArray(raw.cart) ? raw.cart : [],
    progress: raw.progress && typeof raw.progress === 'object' ? raw.progress : {},
    notes: Array.isArray(raw.notes) ? raw.notes : [],
  };
}

// ───────────────────────────────────────────────────────────────
// Context
// ───────────────────────────────────────────────────────────────

interface StoreValue extends State {
  isSignedIn: boolean;
  /** Entitlement lookup; always false when signed out. */
  owns: (itemId: string) => boolean;
  progressFor: (courseId: string) => CourseProgress | undefined;
  noteFor: (courseId: string, lessonId: string) => LessonNote | undefined;
  cartTotal: number;

  signIn: (user: Omit<User, 'id' | 'createdAt'>) => void;
  signOut: () => void;
  addToCart: (line: CartLine) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  /** Resolves to the created order, or null if payment "failed". */
  payForCart: (
    method: PaymentMethod,
    expand: (line: CartLine) => OrderLine[],
  ) => Promise<Order | null>;
  resetCheckout: () => void;
  enrollFree: (itemId: string, kind: PurchasableKind) => void;
  startCourse: (courseId: string) => void;
  setActiveLesson: (courseId: string, lessonId: string) => void;
  completeLesson: (courseId: string, lessonId: string, totalLessons: number) => void;
  uncompleteLesson: (courseId: string, lessonId: string) => void;
  saveNote: (courseId: string, lessonId: string, body: string) => void;
  deleteNote: (courseId: string, lessonId: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, EMPTY, (initial) => ({
    ...initial,
    ...loadPersisted(),
  }));

  // Single persistence effect over the persisted slice only.
  useEffect(() => {
    const snapshot: Persisted = {
      user: state.user,
      entitlements: state.entitlements,
      orders: state.orders,
      cart: state.cart,
      progress: state.progress,
      notes: state.notes,
    };
    storage.set(STORAGE_KEY, snapshot);
  }, [state.user, state.entitlements, state.orders, state.cart, state.progress, state.notes]);

  const isSignedIn = state.user !== null;

  const ownedIds = useMemo(
    () => (isSignedIn ? new Set(state.entitlements.map((e) => e.itemId)) : new Set<string>()),
    [state.entitlements, isSignedIn],
  );

  const owns = useCallback((itemId: string) => ownedIds.has(itemId), [ownedIds]);

  const progressFor = useCallback(
    (courseId: string) => (isSignedIn ? state.progress[courseId] : undefined),
    [state.progress, isSignedIn],
  );

  const noteFor = useCallback(
    (courseId: string, lessonId: string) =>
      state.notes.find((n) => n.courseId === courseId && n.lessonId === lessonId),
    [state.notes],
  );

  const cartTotal = useMemo(
    () => state.cart.reduce((sum, line) => sum + line.unitPrice, 0),
    [state.cart],
  );

  /**
   * Stable action creators.
   *
   * Every one of these closes over `dispatch` only, so the object is created
   * once and never changes identity. That matters: the dashboard's infinite
   * render loop (AUDIT.md §C1) existed because a value that changed identity
   * on every render was used in an effect's dependency array. Handing
   * consumers stable functions removes the whole class of bug rather than
   * patching the one place it happened to surface.
   *
   * `payForCart` needs the current cart, so it reads it from a ref instead of
   * closing over state — same stability, no stale reads.
   */
  const cartRef = useRef(state.cart);
  useEffect(() => {
    cartRef.current = state.cart;
  }, [state.cart]);

  const actions = useMemo(
    () => ({
      signIn: (input: Omit<User, 'id' | 'createdAt'>) =>
        dispatch({
          type: 'auth/signedIn' as const,
          user: {
            ...input,
            id: `usr_${Math.random().toString(36).slice(2, 10)}`,
            createdAt: new Date().toISOString(),
          },
        }),
      signOut: () => dispatch({ type: 'auth/signedOut' as const }),
      addToCart: (line: CartLine) => dispatch({ type: 'cart/add' as const, line }),
      removeFromCart: (itemId: string) => dispatch({ type: 'cart/remove' as const, itemId }),
      clearCart: () => dispatch({ type: 'cart/clear' as const }),
      resetCheckout: () => dispatch({ type: 'checkout/reset' as const }),
      enrollFree: (itemId: string, kind: PurchasableKind) =>
        dispatch({ type: 'entitlement/grantFree' as const, itemId, kind }),
      startCourse: (courseId: string) => dispatch({ type: 'progress/start' as const, courseId }),
      setActiveLesson: (courseId: string, lessonId: string) =>
        dispatch({ type: 'progress/setLesson' as const, courseId, lessonId }),
      completeLesson: (courseId: string, lessonId: string, totalLessons: number) =>
        dispatch({ type: 'progress/complete' as const, courseId, lessonId, totalLessons }),
      uncompleteLesson: (courseId: string, lessonId: string) =>
        dispatch({ type: 'progress/uncomplete' as const, courseId, lessonId }),
      saveNote: (courseId: string, lessonId: string, body: string) =>
        dispatch({ type: 'note/save' as const, courseId, lessonId, body }),
      deleteNote: (courseId: string, lessonId: string) =>
        dispatch({ type: 'note/delete' as const, courseId, lessonId }),

      payForCart: async (
        method: PaymentMethod,
        expand: (line: CartLine) => OrderLine[],
      ): Promise<Order | null> => {
        dispatch({ type: 'checkout/start' });

        // Stand-in for the Chapa initialise → redirect → webhook round trip.
        await new Promise((resolve) => setTimeout(resolve, 1400));

        const cart: CartLine[] = cartRef.current;
        const lines = cart.flatMap(expand);
        if (lines.length === 0) {
          dispatch({ type: 'checkout/fail' });
          return null;
        }

        const subtotal = cart.reduce((sum, l) => sum + l.unitPrice, 0);
        const placedAt = new Date().toISOString();
        const order: Order = {
          // Human-quotable reference. Real orders get their id from the backend.
          id: `AWQ-${placedAt.slice(2, 10).replace(/-/g, '')}-${Math.random()
            .toString(36)
            .slice(2, 6)
            .toUpperCase()}`,
          placedAt,
          status: 'paid',
          method,
          lines,
          subtotal,
          discount: 0,
          total: subtotal,
        };

        const entitlements: Entitlement[] = lines.map((line) => ({
          itemId: line.itemId,
          kind: line.kind,
          grantedAt: placedAt,
          orderId: order.id,
        }));

        dispatch({ type: 'checkout/succeed', order, entitlements });
        return order;
      },
    }),
    [],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      isSignedIn,
      owns,
      progressFor,
      noteFor,
      cartTotal,
      ...actions,
    }),
    [state, isSignedIn, owns, progressFor, noteFor, cartTotal, actions],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
