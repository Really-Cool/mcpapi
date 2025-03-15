import React, { Component, ErrorInfo, ReactNode } from 'react';
import { theme } from '@utils/constants/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the whole application
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback;
      }

      return (
        <div
          style={{
            padding: theme.spacing.lg,
            margin: theme.spacing.md,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border.default}`,
          }}
        >
          <h2 style={{ color: theme.colors.text.accent, marginBottom: theme.spacing.md }}>
            出现了一些问题
          </h2>
          <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.md }}>
            应用程序遇到了错误。请尝试刷新页面或联系支持团队。
          </p>
          {error && (
            <details
              style={{
                whiteSpace: 'pre-wrap',
                backgroundColor: theme.colors.background.primary,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.sm,
                marginTop: theme.spacing.md,
              }}
            >
              <summary style={{ color: theme.colors.text.secondary, cursor: 'pointer' }}>
                错误详情
              </summary>
              <p style={{ color: theme.colors.text.secondary, marginTop: theme.spacing.sm }}>
                {error.toString()}
              </p>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: theme.spacing.md,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.background.hover,
              color: theme.colors.text.primary,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return children;
  }
}
