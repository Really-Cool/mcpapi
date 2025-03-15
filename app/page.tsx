'use client';

import { useState, useEffect } from 'react';
import { mcpSections } from '@/data/mcp-data';
import { MCPItem } from '@/types/mcp';
import {
  MainLayout,
  HeroSection,
  MCPSection
} from '@/components/mcpapi';
import { SearchResults } from '@/components/mcpapi/search-results';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MCPItem[]>([]);
  const [recommendations, setRecommendations] = useState<MCPItem[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSections, setShowSections] = useState<boolean>(true);

  // 处理搜索
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      resetSearch();
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setShowSections(false);

    try {
      // 调用搜索API
      const searchResponse = await fetch(`/api/mcp?query=${encodeURIComponent(query)}`);
      const searchData = await searchResponse.json();
      setSearchResults(searchData.items || []);

      // 调用LLM推荐API
      const recommendResponse = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          items: searchData.items,
        }),
      });

      const recommendData = await recommendResponse.json();
      setRecommendations(recommendData.recommendations || []);
      setExplanation(recommendData.explanation || '');
    } catch (error) {
      console.error('搜索出错:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 重置搜索
  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setRecommendations([]);
    setExplanation('');
    setShowSections(true);
  };

  return (
    <MainLayout>
      <HeroSection onSearch={handleSearch} />
      
      {!showSections ? (
        <SearchResults
          results={searchResults}
          recommendations={recommendations}
          explanation={explanation}
          isLoading={isSearching}
          query={searchQuery}
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
