import { ReactNode, useEffect } from 'react';
import { useMCPContext } from '@/contexts/mcp-context';
import { getTheme, ThemeMode } from '@/lib/constants/theme';
import { systemPrefersDarkMode, listenForColorSchemeChanges, applyThemeClass } from '@/lib/utils/theme-utils';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider applies theme styles to the application based on dark mode state
 * Uses the MCPContext to access the current theme state and applies it to the DOM
 * Listens for system preference changes and updates theme accordingly
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { state, toggleDarkMode } = useMCPContext();
  const { darkMode } = state;
  
  // Initialize dark mode based on system preference on mount
  useEffect(() => {
    const prefersDark = systemPrefersDarkMode();
    
    // If system preference is dark and our state is light, toggle to match
    if (prefersDark && !darkMode) {
      toggleDarkMode();
    }
    
    // Listen for system preference changes
    const cleanup = listenForColorSchemeChanges((prefersDark) => {
      // Only toggle if the preference doesn't match our current state
      if (prefersDark !== darkMode) {
        toggleDarkMode();
      }
    });
    
    // Clean up listener on unmount
    return cleanup;
    // We only want this to run on mount, not when darkMode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Apply theme styles to the document body when dark mode changes
  useEffect(() => {
    // Get the document body
    const body = document.body;
    
    // Get the appropriate theme based on dark mode
    const currentTheme = getTheme(darkMode ? 'dark' : 'light');
    
    // Set background color based on theme
    body.style.backgroundColor = currentTheme.colors.background.primary;
    
    // Set text color based on theme
    body.style.color = currentTheme.colors.text.primary;
    
    // Apply theme class
    applyThemeClass(darkMode);
    
    // Set CSS variables for theme colors to use throughout the app
    Object.entries(currentTheme.colors).forEach(([category, values]) => {
      Object.entries(values as Record<string, string>).forEach(([name, value]) => {
        document.documentElement.style.setProperty(
          `--color-${category}-${name}`,
          value
        );
      });
    });
    
    // Clean up function to reset styles when component unmounts
    return () => {
      body.style.backgroundColor = '';
      body.style.color = '';
      
      // Remove CSS variables
      Object.entries(currentTheme.colors).forEach(([category, values]) => {
        Object.entries(values as Record<string, string>).forEach(([name]) => {
          document.documentElement.style.removeProperty(
            `--color-${category}-${name}`
          );
        });
      });
    };
  }, [darkMode]);
  
  return (
    <div className="theme-provider">
      {children}
    </div>
  );
}
