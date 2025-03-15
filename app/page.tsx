'use client';

import { mcpSections } from '@/data/mcp-data';
import {
  MainLayout,
  HeroSection,
  MCPSection
} from '@/components/mcpapi';
import { SearchResults } from '@/components/mcpapi/search-results';
import { useMCPSearch } from '@/hooks/use-mcp-search';

/**
 * Home page component that displays MCP sections and search functionality
 */
export default function Home() {
  // Use our custom hook for search functionality
  const { 
    query, 
    searchState, 
    showSections, 
    search, 
    resetSearch 
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
        />
      ) : (
        mcpSections.map((section) => (
          <MCPSection 
            key={section.id}
            section={section}
            showViewAll={section.id !== 'featured'}
            showNavigation={section.id !== 'featured'}
          />
        ))
      )}
    </MainLayout>
  );
}
