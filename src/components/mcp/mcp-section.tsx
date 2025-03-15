import { useState } from "react";
import { MCPSection as MCPSectionType } from "@/types/mcp";
import { SectionHeader } from "./section-header";
import { SectionGrid } from "./section-grid";
import { MCPCard } from "./mcp-card";

export interface MCPSectionProps {
  section: MCPSectionType;
  showViewAll?: boolean;
  showNavigation?: boolean;
}

/**
 * MCPSection component displays a section of MCP cards with pagination
 * It handles the navigation between pages and renders the appropriate items
 */
export function MCPSection({ 
  section, 
  showViewAll = true, 
  showNavigation = true 
}: MCPSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(section.items.length / itemsPerPage);
  
  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  // Calculate the items to display on the current page
  const visibleItems = section.items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="mb-12">
      <SectionHeader
        title={section.title}
        count={section.count}
        showViewAll={showViewAll}
        showNavigation={showNavigation && totalPages > 1}
        viewAllHref={`/category/${section.id}`}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      
      <SectionGrid>
        {visibleItems.map((item) => (
          <MCPCard
            key={item.id}
            title={item.title}
            packageName={item.packageName}
            description={item.description}
            icon={item.icon}
            iconName={item.iconName}
            downloads={item.downloads}
            isActive={item.isActive}
            githubLink={item.githubLink}
          />
        ))}
      </SectionGrid>
    </section>
  );
}
