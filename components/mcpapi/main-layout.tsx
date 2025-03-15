import { ReactNode } from "react";
import { Header } from "./header";
import { ErrorBoundary } from "@/components/error-boundary";
import { MCPProvider } from "@/contexts/mcp-context";
import { theme } from "@/lib/constants/theme";

export interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps the entire application
 * Provides error boundary and context provider for global state
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ErrorBoundary>
      <MCPProvider>
        <div 
          className="min-h-screen"
          style={{ 
            backgroundColor: theme.colors.background.primary,
            color: theme.colors.text.primary
          }}
        >
          <Header />
          <main className="px-6 md:px-12 py-8">
            {children}
          </main>
        </div>
      </MCPProvider>
    </ErrorBoundary>
  );
}
