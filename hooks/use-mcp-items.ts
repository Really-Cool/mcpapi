import { useCallback, useMemo } from 'react';
import { MCPItem } from '@/types/mcp';
import { useMCPContext } from '@/contexts/mcp-context';

/**
 * Return type for the useMCPItems hook
 */
export interface UseMCPItemsReturn {
  // State
  favorites: MCPItem[];
  recentlyViewed: MCPItem[];
  darkMode: boolean;
  
  // Methods
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: MCPItem) => void;
  addToFavorites: (item: MCPItem) => void;
  removeFromFavorites: (id: string) => void;
  getFavorites: () => MCPItem[];
  getRecentlyViewed: () => MCPItem[];
  trackItemView: (item: MCPItem) => void;
  clearRecentlyViewed: () => void;
  
  // Stats
  favoritesCount: number;
  recentlyViewedCount: number;
}

/**
 * Custom hook for managing MCP item operations like favorites and recently viewed
 * Provides a functional interface to the MCP context with memoized values and functions
 * 
 * @returns {UseMCPItemsReturn} Object containing state and methods for managing MCP items
 */
export function useMCPItems(): UseMCPItemsReturn {
  const { 
    state, 
    addFavorite, 
    removeFavorite, 
    addRecentlyViewed, 
    clearRecentlyViewed 
  } = useMCPContext();
  
  /**
   * Check if an item is in favorites
   * @param {string} id - The ID of the item to check
   * @returns {boolean} True if the item is in favorites, false otherwise
   */
  const isFavorite = useCallback((id: string): boolean => {
    return state.favorites.some(item => item.id === id);
  }, [state.favorites]);
  
  /**
   * Toggle favorite status of an item
   * @param {MCPItem} item - The item to toggle favorite status for
   */
  const toggleFavorite = useCallback((item: MCPItem): void => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [isFavorite, addFavorite, removeFavorite]);
  
  /**
   * Add an item to favorites
   * @param {MCPItem} item - The item to add to favorites
   */
  const addToFavorites = useCallback((item: MCPItem): void => {
    if (!isFavorite(item.id)) {
      addFavorite(item);
    }
  }, [addFavorite, isFavorite]);
  
  /**
   * Remove an item from favorites
   * @param {string} id - The ID of the item to remove from favorites
   */
  const removeFromFavorites = useCallback((id: string): void => {
    removeFavorite(id);
  }, [removeFavorite]);
  
  /**
   * Get all favorite items
   * @returns {MCPItem[]} Array of favorite items
   */
  const getFavorites = useCallback((): MCPItem[] => {
    return [...state.favorites];
  }, [state.favorites]);
  
  /**
   * Get all recently viewed items
   * @returns {MCPItem[]} Array of recently viewed items
   */
  const getRecentlyViewed = useCallback((): MCPItem[] => {
    return [...state.recentlyViewed];
  }, [state.recentlyViewed]);
  
  /**
   * Track an item as recently viewed
   * @param {MCPItem} item - The item to track as recently viewed
   */
  const trackItemView = useCallback((item: MCPItem): void => {
    addRecentlyViewed(item);
  }, [addRecentlyViewed]);
  
  // Memoize counts to avoid recalculation on each render
  const favoritesCount = useMemo(() => state.favorites.length, [state.favorites]);
  const recentlyViewedCount = useMemo(() => state.recentlyViewed.length, [state.recentlyViewed]);
  
  return {
    // State (immutable references)
    favorites: state.favorites,
    recentlyViewed: state.recentlyViewed,
    darkMode: state.darkMode,
    
    // Methods
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    getRecentlyViewed,
    trackItemView,
    clearRecentlyViewed,
    
    // Stats
    favoritesCount,
    recentlyViewedCount,
  };
}
