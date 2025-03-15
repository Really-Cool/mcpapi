'use client';

import { mcpSections } from '@/data/mcp-data';
import {
  MainLayout,
  HeroSection,
  MCPSection,
  UserCollections
} from '@/components/mcp';
import { SearchResults } from '@/components/search/search-results';
import { useMCPSearch } from '@/hooks/mcp/use-mcp-search';

/**
 * Home page component that displays MCP sections and search functionality
 * Includes user collections (favorites and recently viewed) when not searching
 * Supports infinite scrolling for search results
 */
export default function Home() {
  // Use our custom hook for search functionality with infinite scrolling
  const { 
    query, 
    searchState, 
    showSections, 
    search, 
    resetSearch,
    loadMoreResults
  } = useMCPSearch();

  // Determine if we're currently searching
  const isSearching = searchState.status === 'loading';

  // Extract search results data when available
  const searchResults = searchState.status === 'success' 
    ? searchState.data.results 
    : [];
  
  const recommendations = searchState.status === 'success' 
    ? searchState.data.recommendations 
    : [];
  
  const explanation = searchState.status === 'success' 
    ? searchState.data.explanation 
    : '';

  // Check if there are more results to load
  const hasMore = searchState.status === 'success' 
    ? searchState.data.hasMore 
    : false;

  return (
    <MainLayout>
      <HeroSection onSearch={search} />
      
      {!showSections ? (
        <SearchResults
          results={searchResults}
          recommendations={recommendations}
          explanation={explanation}
          isLoading={isSearching}
          query={query}
          onReset={resetSearch}
          hasMore={hasMore}
          onLoadMore={loadMoreResults}
        />
      ) : (
        <>
          {/* User collections - favorites and recently viewed */}
          <UserCollections maxItems={4} />
          
          {/* MCP sections from data */}
          {mcpSections.map((section) => (
            <MCPSection 
              key={section.id}
              section={section}
              showViewAll={section.id !== 'featured'}
              showNavigation={section.id !== 'featured'}
            />
          ))}
        </>
      )}
    </MainLayout>
  );
}
