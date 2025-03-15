'use client';

import { useState } from 'react';
import { mcpSections } from '@/data/mcp-data';
import {
  MainLayout,
  HeroSection,
  MCPSection
} from '@/components/mcpapi';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Here you would typically implement search functionality
    console.log('Searching for:', query);
  };

  return (
    <MainLayout>
      <HeroSection onSearch={handleSearch} />
      
      {mcpSections.map((section) => (
        <MCPSection 
          key={section.id}
          section={section}
          showViewAll={section.id !== 'featured'}
          showNavigation={section.id !== 'featured'}
        />
      ))}
    </MainLayout>
  );
}
