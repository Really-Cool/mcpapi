import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchResults } from '@components/search/search-results';
import { MCPItem } from '@/types/mcp';
import { useMCPContext } from '@/contexts/mcp-context';

// Mock the MCP context
jest.mock('@/contexts/mcp-context', () => ({
  useMCPContext: jest.fn().mockReturnValue({
    state: { darkMode: false },
    toggleDarkMode: jest.fn()
  })
}));

// Mock the components used by SearchResults
jest.mock('@components/mcp/mcp-card', () => ({
  MCPCard: ({ title }: { title: string }) => <div data-testid="mcp-card">{title}</div>,
}));

jest.mock('../section-grid', () => ({
  SectionGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-grid">{children}</div>
  ),
}));

jest.mock('../recommendations-section', () => ({
  RecommendationsSection: ({ recommendations }: { recommendations: MCPItem[] }) => (
    <div data-testid="recommendations-section">
      {recommendations.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/ui/loading', () => ({
  Loading: ({ text }: { text: string }) => <div data-testid="loading">{text}</div>,
}));

// Mock the useInfiniteScroll hook
jest.mock('@/hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: jest.fn().mockReturnValue({
    observerRef: jest.fn(),
    isLoading: false,
    hasMore: true,
    resetObserver: jest.fn(),
  }),
}));

describe('SearchResults', () => {
  // Mock data for testing
  const mockResults: MCPItem[] = [
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

  const mockRecommendations: MCPItem[] = [
    { 
      id: '3', 
      title: 'Recommended MCP 1', 
      packageName: 'rec-mcp-1', 
      description: 'Recommended description 1',
      icon: 'rec-icon',
      iconName: 'rec-icon-name',
      downloads: '300',
      isActive: true,
      githubLink: 'https://github.com/test/rec1'
    },
  ];

  it('should render loading state', () => {
    const { getByTestId, getByText } = render(
      <SearchResults
        results={[]}
        isLoading={true}
        query="test"
      />
    );

    expect(getByTestId('loading')).toBeInTheDocument();
    expect(getByText('思考中...')).toBeInTheDocument();
  });

  it('should render empty state when no results and no recommendations', () => {
    const { getByText } = render(
      <SearchResults
        results={[]}
        recommendations={[]}
        query="test"
      />
    );

    expect(getByText('没有找到与"test"相关的MCP服务器')).toBeInTheDocument();
  });

  it('should render empty state with reset button when onReset is provided', () => {
    const onReset = jest.fn();
    
    const { getByText } = render(
      <SearchResults
        results={[]}
        recommendations={[]}
        query="test"
        onReset={onReset}
      />
    );

    const resetButton = getByText('返回首页');
    expect(resetButton).toBeInTheDocument();
    
    resetButton.click();
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should render search results and recommendations', () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <SearchResults
        results={mockResults}
        recommendations={mockRecommendations}
        explanation="Test explanation"
        query="test"
      />
    );

    // Check search results header
    expect(getByText('"test" 的搜索结果')).toBeInTheDocument();
    
    // Check search results
    expect(getByTestId('section-grid')).toBeInTheDocument();
    expect(getAllByTestId('mcp-card')).toHaveLength(2);
    expect(getByText('Test MCP 1')).toBeInTheDocument();
    expect(getByText('Test MCP 2')).toBeInTheDocument();
    
    // Check recommendations
    expect(getByTestId('recommendations-section')).toBeInTheDocument();
    expect(getByText('Recommended MCP 1')).toBeInTheDocument();
  });

  it('should render clear button when onReset is provided', () => {
    const onReset = jest.fn();
    
    const { getByText } = render(
      <SearchResults
        results={mockResults}
        query="test"
        onReset={onReset}
      />
    );

    const clearButton = getByText('清除');
    expect(clearButton).toBeInTheDocument();
    
    clearButton.click();
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should render infinite scroll loading trigger when hasMore is true', () => {
    const { getByTestId } = render(
      <SearchResults
        results={mockResults}
        query="test"
        hasMore={true}
        onLoadMore={() => Promise.resolve()}
      />
    );

    expect(getByTestId('load-more-trigger')).toBeInTheDocument();
  });

  it('should not render infinite scroll loading trigger when hasMore is false', () => {
    const { queryByTestId } = render(
      <SearchResults
        results={mockResults}
        query="test"
        hasMore={false}
        onLoadMore={() => Promise.resolve()}
      />
    );

    expect(queryByTestId('load-more-trigger')).not.toBeInTheDocument();
  });

  it('should show loading indicator when loading more results', () => {
    // Override the mock implementation for this test
    const useInfiniteScrollMock = require('@/hooks/use-infinite-scroll').useInfiniteScroll;
    useInfiniteScrollMock.mockReturnValueOnce({
      observerRef: jest.fn(),
      isLoading: true,
      hasMore: true,
      resetObserver: jest.fn(),
    });

    const { getByText } = render(
      <SearchResults
        results={mockResults}
        query="test"
        hasMore={true}
        onLoadMore={() => Promise.resolve()}
      />
    );

    // Verify that the loading indicator is shown when isLoading is true
    expect(getByText('加载更多...')).toBeInTheDocument();
  });
});
