import { useState, useCallback, useRef } from "react";
import { MCPItem } from "@/types/mcp";
import { ApiClient, ApiError, SearchResponse } from "@/lib/services/api-client";

/**
 * Search state interface representing different states of the search process
 */
type SearchState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: { results: MCPItem[]; recommendations: MCPItem[]; explanation: string; hasMore: boolean; total: number } }
  | { status: 'error'; error: Error };

interface UseMCPSearchReturn {
  query: string;
  searchState: SearchState;
  showSections: boolean;
  search: (searchQuery: string) => Promise<void>;
  resetSearch: () => void;
  loadMoreResults: () => Promise<void>;
}

/**
 * Hook for managing MCP search functionality and state
 * Handles searching, recommendations, pagination, and related state
 */
export const useMCPSearch = (): UseMCPSearchReturn => {
  // Search query state
  const [query, setQuery] = useState<string>('');
  
  // Search state using discriminated union for type safety
  const [searchState, setSearchState] = useState<SearchState>({ status: 'idle' });
  
  // Flag to control whether to show sections or search results
  const [showSections, setShowSections] = useState<boolean>(true);

  // Pagination state
  const currentPage = useRef<number>(1);
  const pageSize = useRef<number>(10);

  /**
   * Reset the search state to initial values
   */
  const resetSearch = useCallback(() => {
    setQuery('');
    setSearchState({ status: 'idle' });
    setShowSections(true);
    currentPage.current = 1;
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

    // Reset pagination for new searches
    currentPage.current = 1;

    // Update query and search state
    setQuery(searchQuery);
    setSearchState({ status: 'loading' });
    setShowSections(false);

    try {
      // Get search results
      const searchData = await ApiClient.search(
        searchQuery, 
        currentPage.current, 
        pageSize.current
      );
      
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
          hasMore: searchData.total > searchData.items.length,
          total: searchData.total
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

  /**
   * Load more search results for infinite scrolling
   */
  const loadMoreResults = useCallback(async () => {
    // Only proceed if we're in a success state
    if (searchState.status !== 'success') {
      return;
    }

    // Check if there are more results to load
    if (!searchState.data.hasMore) {
      return;
    }

    try {
      // Increment the page number
      currentPage.current += 1;

      // Get the next page of search results
      const searchData = await ApiClient.search(
        query,
        currentPage.current,
        pageSize.current
      );

      // Update the search state with the new results
      setSearchState({
        status: 'success',
        data: {
          ...searchState.data,
          results: [...searchState.data.results, ...searchData.items],
          hasMore: currentPage.current * pageSize.current < searchData.total,
          total: searchData.total
        },
      });
    } catch (error) {
      console.error('Error loading more results:', error);
      // We don't set the state to error here to preserve existing results
    }
  }, [query, searchState]);

  return {
    query,
    searchState,
    showSections,
    search,
    resetSearch,
    loadMoreResults,
  };
};
