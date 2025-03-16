import { ReactNode, useEffect } from 'react';
import { useMCPContext } from '@/contexts/mcp-context';
import { getTheme, ThemeMode } from '@/utils/constants/theme';
import { systemPrefersDarkMode, listenForColorSchemeChanges, applyThemeClass } from '@/utils/helpers/theme-utils';

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
    // Get the document body and html element
    const body = document.body;
    const html = document.documentElement;
    
    // Apply dark class to html element for tailwind dark mode
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Get the appropriate theme based on dark mode
    const currentTheme = getTheme(darkMode ? 'dark' : 'light');
    
    // Apply theme class
    applyThemeClass(darkMode);
    
    // Clean up function to reset styles when component unmounts
    return () => {
      html.classList.remove('dark');
    };
  }, [darkMode]);
  
  return (
    <div className="theme-provider">
      {children}
    </div>
  );
}
