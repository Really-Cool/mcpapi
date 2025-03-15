import { MCPItem } from "@/types/mcp";
import { MCPCard } from "./mcp-card";
import { SectionGrid } from "./section-grid";
import { X, Search } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { theme } from "@/lib/constants/theme";
import { RecommendationsSection } from "./recommendations-section";

export interface SearchResultsProps {
  results: MCPItem[];
  recommendations?: MCPItem[];
  explanation?: string;
  isLoading?: boolean;
  query?: string;
  onReset?: () => void;
}

/**
 * SearchResults component displays search results and recommendations
 * Shows loading state, empty state, or results based on the current state
 */
export function SearchResults({
  results,
  recommendations = [],
  explanation = "",
  isLoading = false,
  query = "",
  onReset
}: SearchResultsProps) {
  // Show loading state
  if (isLoading) {
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
        <p style={{ color: theme.colors.text.secondary }}>
          {query ? `没有找到与"${query}"相关的MCP服务器` : "请输入搜索词以推荐MCP服务器"}
        </p>
        {query && onReset && (
          <button 
            onClick={onReset}
            className="mt-4 px-4 py-2 rounded flex items-center gap-2 mx-auto"
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.secondary
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Search size={20} style={{ color: theme.colors.text.accent }} />
          <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
            {query ? `"${query}" 的搜索结果` : "搜索结果"}
          </h2>
        </div>
        {onReset && (
          <button 
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1 rounded transition-colors"
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.secondary
            }}
            aria-label="清除搜索结果"
          >
            <X size={16} />
            <span>清除</span>
          </button>
        )}
      </div>
      
      {/* Use the RecommendationsSection component for recommendations */}
      {recommendations.length > 0 && (
        <RecommendationsSection
          recommendations={recommendations}
          title="推荐的MCP服务器"
          explanation={explanation}
        />
      )}

      {results.length > 0 && (
        <section className="mb-8">
          <h3 
            className="text-lg font-semibold mb-4" 
            style={{ color: theme.colors.text.primary }}
          >
            搜索结果
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
        </section>
      )}
    </div>
  );
}
