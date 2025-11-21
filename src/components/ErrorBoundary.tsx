import React from 'react';
import { useToast } from '@/hooks/use-toast';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error | null;
};

class ErrorBoundaryInner extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-card p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred. Please refresh the page or contact support if the problem persists.</p>
            <details className="whitespace-pre-wrap text-xs p-2 bg-muted rounded">
              {this.state.error ? String(this.state.error.stack || this.state.error.message) : 'No details available'}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper so we can use hooks for side-effects (toasts) if desired in the future.
export default function ErrorBoundary({ children }: Props) {
  const { toast } = useToast();

  // We could show a toast when the boundary catches an error, but avoid noisy behavior on mount.
  React.useEffect(() => {
    // no-op for now
  }, []);

  return <ErrorBoundaryInner>{children}</ErrorBoundaryInner>;
}
