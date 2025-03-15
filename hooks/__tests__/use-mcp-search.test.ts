import { renderHook, act } from '@testing-library/react';
import { useMCPSearch } from '../use-mcp-search';
import { ApiClient } from '@/lib/services/api-client';

// Mock the API client
jest.mock('@/lib/services/api-client', () => ({
  ApiClient: {
    search: jest.fn(),
    getRecommendations: jest.fn(),
  },
}));

// Mock console.error for error tests
const originalConsoleError = console.error;
const mockConsoleError = jest.fn();

describe('useMCPSearch', () => {
  // Mock data for testing
  const mockSearchResults = {
    items: [
      { id: '1', title: 'Test MCP 1', packageName: 'test-mcp-1', downloads: '100' },
      { id: '2', title: 'Test MCP 2', packageName: 'test-mcp-2', downloads: '200' },
    ],
    total: 4,
    page: 1,
    pageSize: 2,
    query: 'test',
  };

  const mockRecommendations = {
    recommendations: [
      { id: '3', title: 'Recommended MCP 1', packageName: 'rec-mcp-1', downloads: '300' },
    ],
    explanation: 'Test explanation',
    query: 'test',
  };

  const mockSearchResultsPage2 = {
    items: [
      { id: '4', title: 'Test MCP 3', packageName: 'test-mcp-3', downloads: '400' },
      { id: '5', title: 'Test MCP 4', packageName: 'test-mcp-4', downloads: '500' },
    ],
    total: 4,
    page: 2,
    pageSize: 2,
    query: 'test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Restore console.error to its original implementation for most tests
    console.error = originalConsoleError;
    // Set up default mock implementations
    (ApiClient.search as jest.Mock).mockResolvedValue(mockSearchResults);
    (ApiClient.getRecommendations as jest.Mock).mockResolvedValue(mockRecommendations);
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error = originalConsoleError;
  });

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useMCPSearch());
    
    expect(result.current.query).toBe('');
    expect(result.current.searchState).toEqual({ status: 'idle' });
    expect(result.current.showSections).toBe(true);
  });

  it('should handle search with valid query', async () => {
    const { result } = renderHook(() => useMCPSearch());
    
    await act(async () => {
      await result.current.search('test');
    });
    
    // Verify API calls
    expect(ApiClient.search).toHaveBeenCalledWith('test', 1, 10);
    expect(ApiClient.getRecommendations).toHaveBeenCalledWith(
      'test',
      mockSearchResults.items
    );
    
    // Verify state updates
    expect(result.current.query).toBe('test');
    expect(result.current.searchState).toEqual({
      status: 'success',
      data: {
        results: mockSearchResults.items,
        recommendations: mockRecommendations.recommendations,
        explanation: mockRecommendations.explanation,
        hasMore: true,
        total: mockSearchResults.total,
      },
    });
    expect(result.current.showSections).toBe(false);
  });

  it('should reset search state when query is empty', async () => {
    const { result } = renderHook(() => useMCPSearch());
    
    // First perform a search
    await act(async () => {
      await result.current.search('test');
    });
    
    // Then reset by searching with empty query
    await act(async () => {
      await result.current.search('');
    });
    
    // Verify state resets
    expect(result.current.query).toBe('');
    expect(result.current.searchState).toEqual({ status: 'idle' });
    expect(result.current.showSections).toBe(true);
  });

  it('should handle search error', async () => {
    // Mock console.error for this test
    console.error = mockConsoleError;
    
    // Mock API error
    const error = new Error('API error');
    (ApiClient.search as jest.Mock).mockRejectedValue(error);
    
    const { result } = renderHook(() => useMCPSearch());
    
    await act(async () => {
      await result.current.search('test');
    });
    
    // Verify error state
    expect(result.current.searchState).toEqual({
      status: 'error',
      error,
    });
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('should load more results when calling loadMoreResults', async () => {
    const { result } = renderHook(() => useMCPSearch());
    
    // First perform initial search
    await act(async () => {
      await result.current.search('test');
    });
    
    // Mock second page results
    (ApiClient.search as jest.Mock).mockResolvedValue(mockSearchResultsPage2);
    
    // Load more results
    await act(async () => {
      await result.current.loadMoreResults();
    });
    
    // Verify second page was requested
    expect(ApiClient.search).toHaveBeenCalledWith('test', 2, 10);
    
    // Verify results were appended
    expect(result.current.searchState).toEqual({
      status: 'success',
      data: {
        results: [
          ...mockSearchResults.items,
          ...mockSearchResultsPage2.items,
        ],
        recommendations: mockRecommendations.recommendations,
        explanation: mockRecommendations.explanation,
        hasMore: false, // Should be false since we've loaded all 4 items
        total: mockSearchResultsPage2.total,
      },
    });
  });

  it('should not load more results when there are no more results', async () => {
    // Mock search with no more results
    (ApiClient.search as jest.Mock).mockResolvedValue({
      ...mockSearchResults,
      total: 2, // Only 2 total items
    });
    
    const { result } = renderHook(() => useMCPSearch());
    
    // Perform initial search
    await act(async () => {
      await result.current.search('test');
    });
    
    // Reset mock to track if it gets called again
    (ApiClient.search as jest.Mock).mockClear();
    
    // Try to load more results
    await act(async () => {
      await result.current.loadMoreResults();
    });
    
    // Verify API was not called again
    expect(ApiClient.search).not.toHaveBeenCalled();
  });

  it('should handle error when loading more results', async () => {
    // Mock console.error for this test
    console.error = mockConsoleError;
    
    const { result } = renderHook(() => useMCPSearch());
    
    // First perform initial search
    await act(async () => {
      await result.current.search('test');
    });
    
    // Store the initial successful state
    const initialState = result.current.searchState;
    
    // Mock API error for second page
    const error = new Error('API error');
    (ApiClient.search as jest.Mock).mockRejectedValue(error);
    
    // Try to load more results
    await act(async () => {
      await result.current.loadMoreResults();
    });
    
    // Verify state remains unchanged (should preserve existing results)
    expect(result.current.searchState).toEqual(initialState);
    
    // Verify error was logged
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('should reset search state when calling resetSearch', async () => {
    const { result } = renderHook(() => useMCPSearch());
    
    // First perform a search
    await act(async () => {
      await result.current.search('test');
    });
    
    // Then reset
    act(() => {
      result.current.resetSearch();
    });
    
    // Verify state resets
    expect(result.current.query).toBe('');
    expect(result.current.searchState).toEqual({ status: 'idle' });
    expect(result.current.showSections).toBe(true);
  });
});
