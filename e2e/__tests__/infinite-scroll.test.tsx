import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { useMCPSearch } from '@/hooks/use-mcp-search';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { ApiClient } from '@/lib/services/api-client';

// Mock the necessary hooks and services
jest.mock('@/hooks/use-mcp-search');
jest.mock('@/hooks/use-infinite-scroll');
jest.mock('@/lib/services/api-client', () => ({
  ApiClient: {
    search: jest.fn(),
    getRecommendations: jest.fn(),
    loadMoreResults: jest.fn()
  }
}));

// Mock the components
jest.mock('@/components/mcpapi', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
  HeroSection: ({ onSearch }: { onSearch: (query: string) => Promise<void> }) => (
    <div data-testid="hero-section">
      <input 
        data-testid="search-input" 
        placeholder="Search" 
        onChange={(e) => {}}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch('test query');
          }
        }}
      />
      <button 
        data-testid="search-button" 
        onClick={() => onSearch('test query')}
      >
        Search
      </button>
    </div>
  ),
  MCPSection: ({ section }: { section: any }) => (
    <div data-testid={`mcp-section-${section.id}`}>{section.title}</div>
  ),
  UserCollections: () => <div data-testid="user-collections">User Collections</div>,
}));

// Mock the MCP context
jest.mock('@/contexts/mcp-context', () => ({
  useMCPContext: jest.fn().mockReturnValue({
    state: { darkMode: false },
    toggleDarkMode: jest.fn()
  }),
  MCPContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mcp-context-provider">{children}</div>
  )
}));

// Mock the SearchResults component
jest.mock('@/components/mcpapi/search-results', () => ({
  SearchResults: ({ 
    results, 
    recommendations, 
    query, 
    onReset,
    hasMore,
    onLoadMore
  }: any) => (
    <div data-testid="search-results">
      <div data-testid="results-count">{results.length} results</div>
      <div data-testid="recommendations-count">{recommendations?.length || 0} recommendations</div>
      <div data-testid="query">{query}</div>
      <button data-testid="reset-button" onClick={onReset}>Reset</button>
      {hasMore && (
        <div data-testid="load-more-trigger"></div>
      )}
      {hasMore && (
        <button 
          data-testid="load-more-button" 
          onClick={onLoadMore}
        >
          Load More
        </button>
      )}
    </div>
  ),
}));

describe('Infinite Scroll End-to-End Test', () => {
  // Mock data for testing
  const initialResults = [
    { 
      id: '1', 
      title: 'Test MCP 1', 
      packageName: 'test-mcp-1', 
      description: 'Test description 1',
      icon: 'test-icon',
      iconName: 'test-icon-name',
      downloads: '100',
      isActive: true,
      githubLink: 'https://github.com/test/test1'
    },
    { 
      id: '2', 
      title: 'Test MCP 2', 
      packageName: 'test-mcp-2', 
      description: 'Test description 2',
      icon: 'test-icon',
      iconName: 'test-icon-name',
      downloads: '200',
      isActive: true,
      githubLink: 'https://github.com/test/test2'
    },
  ];
  
  const additionalResults = [
    { 
      id: '3', 
      title: 'Test MCP 3', 
      packageName: 'test-mcp-3', 
      description: 'Test description 3',
      icon: 'test-icon',
      iconName: 'test-icon-name',
      downloads: '300',
      isActive: true,
      githubLink: 'https://github.com/test/test3'
    },
    { 
      id: '4', 
      title: 'Test MCP 4', 
      packageName: 'test-mcp-4', 
      description: 'Test description 4',
      icon: 'test-icon',
      iconName: 'test-icon-name',
      downloads: '400',
      isActive: true,
      githubLink: 'https://github.com/test/test4'
    },
  ];

  const mockRecommendations = [
    { 
      id: '5', 
      title: 'Recommended MCP 1', 
      packageName: 'rec-mcp-1', 
      description: 'Recommended description 1',
      icon: 'rec-icon',
      iconName: 'rec-icon-name',
      downloads: '500',
      isActive: true,
      githubLink: 'https://github.com/test/rec1'
    },
  ];

  // Mock the useMCPSearch hook
  const mockUseMCPSearch = {
    query: '',
    searchState: { status: 'idle' },
    showSections: true,
    search: jest.fn().mockResolvedValue(undefined),
    resetSearch: jest.fn(),
    loadMoreResults: jest.fn().mockResolvedValue(undefined),
  };

  // Mock the useInfiniteScroll hook
  let mockObserverCallback: () => Promise<void>;
  const mockUseInfiniteScroll = {
    observerRef: jest.fn((node) => {
      // Store the node for later triggering
      if (node) {
        setTimeout(() => {
          // Simulate intersection observer callback
          if (mockObserverCallback) {
            mockObserverCallback();
          }
        }, 100);
      }
    }),
    isLoading: false,
    hasMore: true,
    resetObserver: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup API client mock
    (ApiClient.search as jest.Mock).mockResolvedValue({
      results: initialResults,
      recommendations: mockRecommendations,
      explanation: 'Test explanation',
      hasMore: true,
      total: 4
    });
    
    (ApiClient.loadMoreResults as jest.Mock).mockResolvedValue({
      results: [...initialResults, ...additionalResults],
      recommendations: mockRecommendations,
      explanation: 'Test explanation',
      hasMore: false,
      total: 4
    });
    
    // Setup default useMCPSearch mock
    (useMCPSearch as jest.Mock).mockReturnValue(mockUseMCPSearch);
    
    // Setup default useInfiniteScroll mock
    (useInfiniteScroll as jest.Mock).mockImplementation((callback, hasMore) => {
      mockObserverCallback = callback;
      return {
        ...mockUseInfiniteScroll,
        hasMore
      };
    });
  });

  it('should perform search and display results', async () => {
    // Setup search state with results
    (useMCPSearch as jest.Mock).mockReturnValue({
      ...mockUseMCPSearch,
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: initialResults,
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: true,
          total: 4
        }
      },
      showSections: false,
    });

    const { getByTestId, getByText } = render(<Home />);
    
    // Verify search results are displayed
    expect(getByTestId('search-results')).toBeInTheDocument();
  });

  it('should load more results when load more button is clicked', async () => {
    // Initial state with 2 results
    const initialState = {
      ...mockUseMCPSearch,
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: initialResults,
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: true,
          total: 4
        }
      },
      showSections: false,
    };
    
    // State after loading more results (4 total)
    const loadedMoreState = {
      ...mockUseMCPSearch,
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: [...initialResults, ...additionalResults],
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: false,
          total: 4
        }
      },
      showSections: false,
    };
    
    // First return initial state, then after loadMoreResults is called, return updated state
    (useMCPSearch as jest.Mock)
      .mockReturnValueOnce(initialState)
      .mockReturnValueOnce(initialState) // For re-renders during test
      .mockReturnValueOnce(loadedMoreState);
    
    const { getByTestId, queryByTestId, rerender } = render(<Home />);
    
    // Verify initial state
    expect(getByTestId('search-results')).toBeInTheDocument();
    expect(getByTestId('load-more-button')).toBeInTheDocument();
    
    // Click load more button
    getByTestId('load-more-button').click();
    
    // Verify loadMoreResults was called
    expect(mockUseMCPSearch.loadMoreResults).toHaveBeenCalled();
    
    // Re-render with updated state
    rerender(<Home />);
  });

  it('should reset search when reset button is clicked', async () => {
    // Setup search state with results
    (useMCPSearch as jest.Mock).mockReturnValue({
      ...mockUseMCPSearch,
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: initialResults,
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: false,
          total: 2
        }
      },
      showSections: false,
    });
    
    const { getByTestId } = render(<Home />);
    
    // Click reset button
    getByTestId('reset-button').click();
    
    // Verify resetSearch was called
    expect(mockUseMCPSearch.resetSearch).toHaveBeenCalled();
  });
});
