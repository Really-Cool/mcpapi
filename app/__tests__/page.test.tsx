import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import { useMCPSearch } from '@/hooks/use-mcp-search';

// Mock the hooks and components
jest.mock('@/hooks/use-mcp-search');
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

// Mock the data
jest.mock('@/data/mcp-data', () => ({
  mcpSections: [
    { id: 'featured', title: 'Featured' },
    { id: 'popular', title: 'Popular' },
  ],
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

describe('Home Page with Infinite Scrolling', () => {
  // Setup mock data
  const mockResults = [
    { id: '1', title: 'Test MCP 1' },
    { id: '2', title: 'Test MCP 2' },
  ];
  
  const mockRecommendations = [
    { id: '3', title: 'Recommended MCP 1' },
  ];
  
  const mockMoreResults = [
    { id: '4', title: 'Test MCP 3' },
    { id: '5', title: 'Test MCP 4' },
  ];

  // Setup mock implementation
  const mockSearch = jest.fn().mockResolvedValue(undefined);
  const mockResetSearch = jest.fn();
  const mockLoadMoreResults = jest.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation for idle state
    (useMCPSearch as jest.Mock).mockReturnValue({
      query: '',
      searchState: { status: 'idle' },
      showSections: true,
      search: mockSearch,
      resetSearch: mockResetSearch,
      loadMoreResults: mockLoadMoreResults,
    });
  });

  it('should render sections when not searching', () => {
    const { getByTestId } = render(<Home />);
    
    expect(getByTestId('user-collections')).toBeInTheDocument();
    expect(getByTestId('mcp-section-featured')).toBeInTheDocument();
    expect(getByTestId('mcp-section-popular')).toBeInTheDocument();
  });

  it('should render search results when searching', () => {
    // Mock search in progress
    (useMCPSearch as jest.Mock).mockReturnValue({
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: mockResults,
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: true,
          total: 10
        }
      },
      showSections: false,
      search: mockSearch,
      resetSearch: mockResetSearch,
      loadMoreResults: mockLoadMoreResults,
    });
    
    const { getByTestId, getByText } = render(<Home />);
    
    expect(getByTestId('search-results')).toBeInTheDocument();
    expect(getByTestId('results-count')).toHaveTextContent('2 results');
    expect(getByTestId('recommendations-count')).toHaveTextContent('1 recommendations');
    expect(getByTestId('query')).toHaveTextContent('test query');
  });

  it('should perform search when search button is clicked', async () => {
    const { getByTestId } = render(<Home />);
    
    // Click search button
    const searchButton = getByTestId('search-button');
    searchButton.click();
    
    // Verify search was called
    expect(mockSearch).toHaveBeenCalledWith('test query');
  });

  it('should reset search when reset button is clicked', () => {
    // Mock search results state
    (useMCPSearch as jest.Mock).mockReturnValue({
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: mockResults,
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: false,
          total: 2
        }
      },
      showSections: false,
      search: mockSearch,
      resetSearch: mockResetSearch,
      loadMoreResults: mockLoadMoreResults,
    });
    
    const { getByTestId } = render(<Home />);
    
    // Click reset button
    const resetButton = getByTestId('reset-button');
    resetButton.click();
    
    // Verify reset was called
    expect(mockResetSearch).toHaveBeenCalled();
  });

  it('should load more results when load more button is clicked', async () => {
    // Mock search results state with hasMore=true
    (useMCPSearch as jest.Mock).mockReturnValue({
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: mockResults,
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: true,
          total: 4
        }
      },
      showSections: false,
      search: mockSearch,
      resetSearch: mockResetSearch,
      loadMoreResults: mockLoadMoreResults,
    });
    
    const { getByTestId } = render(<Home />);
    
    // Verify load more button is present
    const loadMoreButton = getByTestId('load-more-button');
    expect(loadMoreButton).toBeInTheDocument();
    
    // Click load more button
    loadMoreButton.click();
    
    // Verify loadMoreResults was called
    expect(mockLoadMoreResults).toHaveBeenCalled();
  });

  it('should not show load more button when hasMore is false', () => {
    // Mock search results state with hasMore=false
    (useMCPSearch as jest.Mock).mockReturnValue({
      query: 'test query',
      searchState: { 
        status: 'success',
        data: {
          results: mockResults,
          recommendations: mockRecommendations,
          explanation: 'Test explanation',
          hasMore: false,
          total: 2
        }
      },
      showSections: false,
      search: mockSearch,
      resetSearch: mockResetSearch,
      loadMoreResults: mockLoadMoreResults,
    });
    
    const { queryByTestId } = render(<Home />);
    
    // Verify load more button is not present
    expect(queryByTestId('load-more-button')).not.toBeInTheDocument();
  });
});
