import React, { createContext, useContext, ReactNode, useReducer, useCallback } from 'react';
import { MCPItem } from '@/types/mcp';

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
  darkMode: true,
};

// Action types
type MCPAction = 
  | { type: 'ADD_FAVORITE'; payload: MCPItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENTLY_VIEWED'; payload: MCPItem }
  | { type: 'CLEAR_RECENTLY_VIEWED' }
  | { type: 'TOGGLE_DARK_MODE' };

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
      // Avoid duplicates
      if (state.favorites.some(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
      
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload),
      };
      
    case 'ADD_RECENTLY_VIEWED': {
      // Remove if already exists to avoid duplicates
      const filteredItems = state.recentlyViewed.filter(
        item => item.id !== action.payload.id
      );
      
      // Add to the beginning of the array and limit to 10 items
      return {
        ...state,
        recentlyViewed: [action.payload, ...filteredItems].slice(0, 10),
      };
    }
      
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
      
    default:
      return state;
  }
};

// Provider component
export const MCPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mcpReducer, initialState);
  
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
  
  // Context value
  const value = {
    state,
    addFavorite,
    removeFavorite,
    addRecentlyViewed,
    clearRecentlyViewed,
    toggleDarkMode,
  };
  
  return (
    <MCPContext.Provider value={value}>
      {children}
    </MCPContext.Provider>
  );
};

// Custom hook to use the context
export const useMCPContext = (): MCPContextType => {
  const context = useContext(MCPContext);
  
  if (context === undefined) {
    throw new Error('useMCPContext must be used within a MCPProvider');
  }
  
  return context;
};
