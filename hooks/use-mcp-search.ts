import { useState, useCallback } from "react";
import { MCPItem } from "@/types/mcp";
import { ApiClient, ApiError } from "@/lib/services/api-client";

/**
 * Search state interface representing different states of the search process
 */
type SearchState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: { results: MCPItem[]; recommendations: MCPItem[]; explanation: string } }
  | { status: 'error'; error: Error };

/**
 * Hook for managing MCP search functionality and state
 * Handles searching, recommendations, and related state
 */
export const useMCPSearch = () => {
  // Search query state
  const [query, setQuery] = useState<string>('');
  
  // Search state using discriminated union for type safety
  const [searchState, setSearchState] = useState<SearchState>({ status: 'idle' });
  
  // Flag to control whether to show sections or search results
  const [showSections, setShowSections] = useState<boolean>(true);

  /**
   * Reset the search state to initial values
   */
  const resetSearch = useCallback(() => {
    setQuery('');
    setSearchState({ status: 'idle' });
    setShowSections(true);
  }, []);

  /**
   * Perform a search with the given query
   */
  const search = useCallback(async (searchQuery: string) => {
    // If query is empty, reset search
    if (!searchQuery.trim()) {
      resetSearch();
      return;
    }

    // Update query and search state
    setQuery(searchQuery);
    setSearchState({ status: 'loading' });
    setShowSections(false);

    try {
      // Get search results
      const searchData = await ApiClient.search(searchQuery);
      
      // Get recommendations based on search results
      const recommendData = await ApiClient.getRecommendations(
        searchQuery, 
        searchData.items
      );

      // Update state with successful results
      setSearchState({
        status: 'success',
        data: {
          results: searchData.items,
          recommendations: recommendData.recommendations,
          explanation: recommendData.explanation,
        },
      });
    } catch (error) {
      // Handle errors
      console.error('Search error:', error);
      setSearchState({ 
        status: 'error', 
        error: error instanceof Error ? error : new Error('Unknown search error') 
      });
    }
  }, [resetSearch]);

  return {
    query,
    searchState,
    showSections,
    search,
    resetSearch,
  };
};
