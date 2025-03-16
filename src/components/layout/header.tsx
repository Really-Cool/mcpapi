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
          <span>Dr.</span>
          <span style={{ color: currentTheme.colors.text.accent }}>Smithery</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* TODO YUQUE */}
        <Link 
          href="https://yuque.antfin.com/qtglgq/iyhwc1/quiaolo5c2d878ie?singleDoc# " 
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
