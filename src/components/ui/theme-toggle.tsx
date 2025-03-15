import { useMCPContext } from "@/contexts/mcp-context";
import { getTheme } from "@/utils/constants/theme";
import { Moon, Sun } from "lucide-react";
import { useMemo } from "react";

/**
 * Theme toggle component for switching between light and dark modes
 * Uses the MCPContext to manage theme state
 */
export function ThemeToggle() {
  const { state, toggleDarkMode } = useMCPContext();
  const { darkMode } = state;
  
  // Get the current theme based on dark mode state
  const currentTheme = useMemo(() => 
    getTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );
  
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition-colors"
      style={{ 
        backgroundColor: currentTheme.colors.background.secondary
      }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun size={18} color={currentTheme.colors.text.accent} />
      ) : (
        <Moon size={18} color={currentTheme.colors.text.accent} />
      )}
    </button>
  );
}
