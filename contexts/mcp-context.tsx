import React, { createContext, useContext, ReactNode, useReducer, useCallback, useEffect } from 'react';
import { MCPItem } from '@/types/mcp';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'mcp-favorites',
  RECENTLY_VIEWED: 'mcp-recently-viewed',
  DARK_MODE: 'mcp-dark-mode',
};

// Maximum number of recently viewed items to store
const MAX_RECENTLY_VIEWED = 20;

// State type definition
interface MCPState {
  favorites: MCPItem[];
  recentlyViewed: MCPItem[];
  darkMode: boolean;
}

// Initial state
const initialState: MCPState = {
  favorites: [],
  recentlyViewed: [],
  darkMode: false,
};

// Action types
type MCPAction =
  | { type: 'ADD_FAVORITE'; payload: MCPItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENTLY_VIEWED'; payload: MCPItem }
  | { type: 'CLEAR_RECENTLY_VIEWED' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'INITIALIZE_STATE'; payload: Partial<MCPState> };

// Context type
interface MCPContextType {
  state: MCPState;
  addFavorite: (item: MCPItem) => void;
  removeFavorite: (id: string) => void;
  addRecentlyViewed: (item: MCPItem) => void;
  clearRecentlyViewed: () => void;
  toggleDarkMode: () => void;
}

// Create context
const MCPContext = createContext<MCPContextType | undefined>(undefined);

// Reducer function
const mcpReducer = (state: MCPState, action: MCPAction): MCPState => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      // Don't add if already in favorites
      if (state.favorites.some(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [action.payload, ...state.favorites],
      };
    
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload),
      };
    
    case 'ADD_RECENTLY_VIEWED':
      // Remove if already in recently viewed to avoid duplicates
      const filteredRecentlyViewed = state.recentlyViewed.filter(
        item => item.id !== action.payload.id
      );
      
      // Add to beginning of array and limit to MAX_RECENTLY_VIEWED items
      return {
        ...state,
        recentlyViewed: [
          action.payload,
          ...filteredRecentlyViewed,
        ].slice(0, MAX_RECENTLY_VIEWED),
      };
    
    case 'CLEAR_RECENTLY_VIEWED':
      return {
        ...state,
        recentlyViewed: [],
      };
    
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
      
    case 'INITIALIZE_STATE':
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
};

// Helper function to load state from localStorage
const loadStateFromStorage = (): Partial<MCPState> => {
  if (typeof window === 'undefined') {
    return {}; // Return empty object on server
  }
  
  try {
    const loadedState: Partial<MCPState> = {};
    
    // Load favorites
    const favoritesJson = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (favoritesJson) {
      loadedState.favorites = JSON.parse(favoritesJson);
    }
    
    // Load recently viewed
    const recentlyViewedJson = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    if (recentlyViewedJson) {
      loadedState.recentlyViewed = JSON.parse(recentlyViewedJson);
    }
    
    // Load dark mode preference
    const darkModeJson = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (darkModeJson) {
      loadedState.darkMode = JSON.parse(darkModeJson);
    }
    
    return loadedState;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return {};
  }
};

// Helper function to save state to localStorage
const saveStateToStorage = (key: string, value: any): void => {
  if (typeof window === 'undefined') {
    return; // No-op on server
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

// Provider component
export function MCPProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mcpReducer, initialState);
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedState = loadStateFromStorage();
    if (Object.keys(storedState).length > 0) {
      dispatch({ type: 'INITIALIZE_STATE', payload: storedState });
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    saveStateToStorage(STORAGE_KEYS.FAVORITES, state.favorites);
  }, [state.favorites]);
  
  // Save recently viewed to localStorage when they change
  useEffect(() => {
    saveStateToStorage(STORAGE_KEYS.RECENTLY_VIEWED, state.recentlyViewed);
  }, [state.recentlyViewed]);
  
  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    saveStateToStorage(STORAGE_KEYS.DARK_MODE, state.darkMode);
  }, [state.darkMode]);
  
  // Action creators
  const addFavorite = useCallback((item: MCPItem) => {
    dispatch({ type: 'ADD_FAVORITE', payload: item });
  }, []);
  
  const removeFavorite = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  }, []);
  
  const addRecentlyViewed = useCallback((item: MCPItem) => {
    dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: item });
  }, []);
  
  const clearRecentlyViewed = useCallback(() => {
    dispatch({ type: 'CLEAR_RECENTLY_VIEWED' });
  }, []);
  
  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);
  
  const contextValue = {
    state,
    addFavorite,
    removeFavorite,
    addRecentlyViewed,
    clearRecentlyViewed,
    toggleDarkMode,
  };
  
  return (
    <MCPContext.Provider value={contextValue}>
      {children}
    </MCPContext.Provider>
  );
}

// Custom hook to use the context
export function useMCPContext(): MCPContextType {
  const context = useContext(MCPContext);
  
  if (context === undefined) {
    throw new Error('useMCPContext must be used within a MCPProvider');
  }
  
  return context;
}
