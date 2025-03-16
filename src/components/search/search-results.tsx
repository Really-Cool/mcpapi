import { MCPItem } from "@/types/mcp";
import { MCPCard } from "../mcp/mcp-card";
import { SectionGrid } from "../mcp/section-grid";
import { X, Search } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { getTheme } from "@/utils/constants/theme";
import { RecommendationsSection } from "../mcp/recommendations-section";
import { useInfiniteScroll } from '@/hooks/mcp/use-infinite-scroll';
import { useMCPContext } from "@/contexts/mcp-context";
import { useMemo, useRef } from "react";

export interface SearchResultsProps {
  results: MCPItem[];
  recommendations?: MCPItem[];
  explanation?: string;
  isLoading?: boolean;
  query?: string;
  onReset?: () => void;
  hasMore?: boolean;
  onLoadMore?: () => Promise<void>;
}

/**
 * SearchResults component displays search results and recommendations
 * Shows loading state, empty state, or results based on the current state
 * Supports infinite scrolling for loading more results
 */
export function SearchResults({
  results,
  recommendations = [],
  explanation = "",
  isLoading = false,
  query = "",
  onReset,
  hasMore = false,
  onLoadMore = async () => {}
}: SearchResultsProps) {
  const { state } = useMCPContext();
  const { darkMode } = state;
  
  // Get the current theme based on dark mode state
  const currentTheme = useMemo(() => 
    getTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  // Set up infinite scroll
  const {
    observerRef,
    isLoading: isLoadingMore,
    hasMore: hasMoreToLoad
  } = useInfiniteScroll(
    onLoadMore,
    hasMore,
    { threshold: 0.5, rootMargin: '0px 0px 300px 0px' }
  );

  // Show loading state for initial load
  if (isLoading && !results.length) {
    return (
      <div className="my-8 flex justify-center">
        <Loading size={32} text="思考中..." />
      </div>
    );
  }

  // Show empty state
  if (!results.length && !recommendations.length) {
    return (
      <div className="my-8 text-center">
        <p style={{ color: currentTheme.colors.text.secondary }}>
          {query ? `没有找到与"${query}"相关的MCP服务器` : "请输入搜索词以推荐MCP服务器"}
        </p>
        {query && onReset && (
          <button 
            onClick={onReset}
            className="mt-4 px-4 py-2 rounded flex items-center gap-2 mx-auto"
            style={{ 
              backgroundColor: currentTheme.colors.background.secondary,
              color: currentTheme.colors.text.secondary
            }}
          >
            <X size={16} />
            <span>返回首页</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="my-8">
      
      {/* Use the RecommendationsSection component for recommendations */}
      {recommendations.length > 0 && (
        <RecommendationsSection
          recommendations={recommendations}
          title="推荐"
          explanation={explanation}
          clearButton={
            onReset && (
              <button 
                onClick={onReset}
                className="flex items-center gap-1 px-3 py-1 rounded transition-colors"
                style={{ 
                  backgroundColor: currentTheme.colors.background.secondary,
                  color: currentTheme.colors.text.secondary
                }}
                aria-label="清除搜索结果"
              >
                <X size={16} />
                <span>清除</span>
              </button>
            )
          }
        />
      )}

      {results.length > 0 && (
        <section className="mb-8">
          <h3 
            className="text-lg font-semibold mb-4 flex items-center gap-2" 
            style={{ color: currentTheme.colors.text.primary }}
          >
            <Search size={20} style={{ color: currentTheme.colors.text.accent }} />
            <span>搜索结果</span>
          </h3>
          <SectionGrid>
            {results.map((item) => (
              <MCPCard 
                key={item.id}
                id={item.id}
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
          
          {/* Infinite scroll loading indicator */}
          {hasMore && (
            <div 
              ref={observerRef}
              className="w-full flex justify-center py-4"
              data-testid="load-more-trigger"
            >
              {isLoadingMore && (
                <Loading size={24} text="加载更多..." />
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
