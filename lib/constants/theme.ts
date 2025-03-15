/**
 * Theme constants for the application
 * Centralizes color definitions and other theme-related values
 */
export const theme = {
  colors: {
    // Background colors
    background: {
      primary: '#121212',
      secondary: '#292524',
      hover: '#3a3533',
    },
    
    // Text colors
    text: {
      primary: '#e5e5e5',
      secondary: '#9ca3af',
      accent: '#ea580c',
      link: '#f97316',
    },
    
    // Border colors
    border: {
      default: '#444444',
      accent: '#ea580c',
    },
    
    // Status colors
    status: {
      active: '#22c55e',
      loading: '#ea580c',
    },
  },
  
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
