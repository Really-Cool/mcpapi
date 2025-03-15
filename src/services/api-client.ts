import { MCPItem } from "@/types/mcp";

/**
 * Response type for MCP search API
 */
export interface SearchResponse {
  items: MCPItem[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}

/**
 * Response type for MCP recommendation API
 */
export interface RecommendationResponse {
  recommendations: MCPItem[];
  explanation: string;
  query: string;
}

/**
 * Custom API error class for better error handling
 */
export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, options?: { cause?: Error; status?: number }) {
    super(message, options);
    this.name = 'ApiError';
    this.status = options?.status;
  }
}

/**
 * API client for interacting with MCP APIs
 * Centralizes all API calls and provides consistent error handling
 */
export const ApiClient = {
  /**
   * Search for MCP items based on a query
   * 
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param pageSize - Number of items per page
   * @returns Search response with items and pagination info
   * @throws ApiError if the request fails
   */
  search: async (
    query: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<SearchResponse> => {
    try {
      const params = new URLSearchParams({
        ...(query && { query: query }),
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      const response = await fetch(`/api/mcp?${params.toString()}`);
      
      if (!response.ok) {
        throw new ApiError(`Search request failed with status ${response.status}`, {
          status: response.status,
        });
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Search request failed', { 
        cause: error instanceof Error ? error : undefined 
      });
    }
  },
  
  /**
   * Get recommendations based on a query and optional items
   * 
   * @param query - User query for recommendations
   * @param items - Optional items to consider for recommendations
   * @returns Recommendation response with items and explanation
   * @throws ApiError if the request fails
   */
  getRecommendations: async (
    query: string, 
    items: MCPItem[] = []
  ): Promise<RecommendationResponse> => {
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          items,
        }),
      });
      
      if (!response.ok) {
        throw new ApiError(`Recommendation request failed with status ${response.status}`, {
          status: response.status,
        });
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Recommendation request failed', { 
        cause: error instanceof Error ? error : undefined 
      });
    }
  },
};
