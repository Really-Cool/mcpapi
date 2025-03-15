import Link from "next/link";
import { Github, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getTheme } from "@/utils/constants/theme";
import { useMCPItems } from '@/hooks/mcp/use-mcp-items';
import { useMemo } from "react";

export interface HeaderProps {
  showGithub?: boolean;
}

/**
 * Header component for the application
 * Includes navigation links and theme toggle
 */
export function Header({ showGithub = true }: HeaderProps) {
  // Get the dark mode state from context
  const { darkMode } = useMCPItems();
  
  // Get the current theme based on dark mode state
  const currentTheme = useMemo(() => 
    getTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  return (
    <header 
      className="border-b px-6 py-4 flex items-center justify-between"
      style={{ 
        borderColor: currentTheme.colors.border.default
      }}
    >
      <div className="flex items-center">
        <Link 
          href="/" 
          className="text-xl font-bold mr-8"
          style={{ color: currentTheme.colors.text.primary }}
        >
          <span>MC</span>
          <span style={{ color: currentTheme.colors.text.accent }}>Papi</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {showGithub && (
          <Link 
            href="https://github.com/Really-Cool/mcpapi" 
            className="flex items-center gap-1 px-3 py-1 rounded transition-colors"
            style={{ 
              backgroundColor: currentTheme.colors.background.secondary,
              color: currentTheme.colors.text.secondary
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
        )}
        <Link 
          href="https://xiaohui.cool/Farming-in-the-cyber-world" 
          className="flex items-center gap-1 px-3 py-1 rounded transition-colors"
          style={{ 
            backgroundColor: currentTheme.colors.background.secondary,
            color: currentTheme.colors.text.secondary
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BookOpen className="h-4 w-4" />
          <span>文档</span>
        </Link>
        
        {/* Theme toggle button */}
        <ThemeToggle />
      </div>
    </header>
  );
}
