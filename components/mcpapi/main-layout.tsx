import { ReactNode } from 'react';
import { Header } from './header';
import { ErrorBoundary } from '@/components/error-boundary';
import { MCPProvider } from '@/contexts/mcp-context';
import { ThemeProvider } from '@/components/ui/theme-provider';

export interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component provides the overall structure for the application
 * Includes error boundary, context providers, and header
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ErrorBoundary>
      <MCPProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header showGithub />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </MCPProvider>
    </ErrorBoundary>
  );
}
