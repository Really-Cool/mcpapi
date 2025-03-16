/**
 * Theme constants for the application
 * Centralizes color definitions and other theme-related values
 */

// Define the theme type for better type safety
export type ThemeMode = 'light' | 'dark';

// Color palette definitions
const palette = {
  // Neutral colors
  neutral: {
    10: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  // Brand colors
  brand: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c', // Primary brand color
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  // Status colors
  green: {
    500: '#22c55e',
    600: '#16a34a',
  },
  red: {
    500: '#ef4444',
    600: '#dc2626',
  },
  blue: {
    500: '#3b82f6',
    600: '#2563eb',
  },
  black:{
    500: '#000000',
    600: '#171717',
    700: '#262626',
    800: '#404040',
    900: '#737373',
  }
};

// Theme configuration for both light and dark modes
export const themeConfig = {
  light: {
    background: {
      primary: palette.neutral[50],
      secondary: palette.neutral[10],
      hover: palette.neutral[200],
      light: palette.neutral[50],
      dark: palette.neutral[900],
    },
    text: {
      primary: palette.neutral[900],
      secondary: palette.neutral[600],
      accent: palette.brand[600],
      link: palette.brand[500],
      light: palette.neutral[50],
      dark: palette.neutral[900],
    },
    border: {
      default: palette.neutral[300],
      accent: palette.brand[600],
    },
    status: {
      active: palette.green[600],
      error: palette.red[600],
      loading: palette.brand[600],
      info: palette.blue[600],
    },
  },
  dark: {
    background: {
      primary: palette.neutral[900],
      secondary: palette.black[500],
      hover: palette.neutral[700],
      light: palette.neutral[50],
      dark: palette.neutral[900],
    },
    text: {
      primary: palette.neutral[200],
      secondary: palette.neutral[400],
      accent: palette.brand[500],
      link: palette.brand[400],
      light: palette.neutral[50],
      dark: palette.neutral[900],
    },
    border: {
      default: palette.neutral[700],
      accent: palette.brand[500],
    },
    status: {
      active: palette.green[500],
      error: palette.red[500],
      loading: palette.brand[500],
      info: palette.blue[500],
    },
  },
};

// Common theme values that don't change between modes
const commonTheme = {
  // Spacing scale (in pixels)
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem',  // 8px
    full: '9999px',
  },
  
  // Transitions
  transitions: {
    default: 'all 0.2s ease-in-out',
    fast: 'all 0.1s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },
};

// Function to get theme based on mode
export const getTheme = (mode: ThemeMode = 'dark') => ({
  colors: themeConfig[mode],
  ...commonTheme,
});

// Default theme (backward compatible with existing code)
export const theme = {
  colors: {
    // Background colors
    background: {
      ...themeConfig.dark.background,
    },
    
    // Text colors
    text: {
      ...themeConfig.dark.text,
    },
    
    // Border colors
    border: {
      ...themeConfig.dark.border,
    },
    
    // Status colors
    status: {
      ...themeConfig.dark.status,
    },
  },
  ...commonTheme,
};
