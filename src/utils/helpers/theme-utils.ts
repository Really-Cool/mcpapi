/**
 * Utility functions for theme management
 * Provides helpers for dark mode detection and system preferences
 */

/**
 * Check if the system prefers dark mode
 * Uses the window.matchMedia API to detect system preference
 * @returns {boolean} True if system prefers dark mode, false otherwise
 */
export const systemPrefersDarkMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Default to light mode on server
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Listen for changes in system color scheme preference
 * @param callback Function to call when preference changes
 * @returns {() => void} Cleanup function to remove the listener
 */
export const listenForColorSchemeChanges = (
  callback: (prefersDark: boolean) => void
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {}; // No-op on server
  }
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Define the event listener
  const handleChange = (event: MediaQueryListEvent): void => {
    callback(event.matches);
  };
  
  // Add the listener
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};

/**
 * Apply theme class to document based on dark mode state
 * @param isDarkMode Whether dark mode is active
 */
export const applyThemeClass = (isDarkMode: boolean): void => {
  if (typeof document === 'undefined') {
    return; // No-op on server
  }
  
  const root = document.documentElement;
  
  if (isDarkMode) {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
  } else {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
  }
};
