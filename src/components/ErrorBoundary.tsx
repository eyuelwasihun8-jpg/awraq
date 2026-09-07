import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  /** Shown instead of the default shell — used to scope a boundary to a region. */
  fallback?: (reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Error boundary.
 *
 * The previous app had none, so a single bad render — a malformed localStorage
 * value, a missing course id, an undefined thumbnail — produced a blank white
 * page with no message and no way back except a manual URL edit.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Replace with the real telemetry sink (Sentry, etc.) at integration time.
    console.error('[Awraq] Unhandled render error', error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(this.reset);

    return (
      <div className="dvh-screen grid place-items-center bg-canvas px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-danger-soft text-danger-text">
            <TriangleAlert className="size-7" aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold text-fg">Something went wrong</h1>
          <p className="mt-2 text-sm font-medium text-fg-muted">
            The page hit an unexpected error. Your purchases and progress are safe — nothing was
            lost.
          </p>

          {import.meta.env.DEV && (
            <pre className="mt-5 max-h-40 overflow-auto rounded-control border border-line bg-surface-2 p-3 text-start text-xs text-danger-text">
              {error.message}
            </pre>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={this.reset} leadingIcon={<RotateCcw className="size-4" />}>
              Try again
            </Button>
            <Button variant="secondary" onClick={() => window.location.assign('/')}>
              Go to homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
