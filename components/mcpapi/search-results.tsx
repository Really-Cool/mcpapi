import { MCPItem } from "@/types/mcp";
import { MCPCard } from "./mcp-card";
import { SectionGrid } from "./section-grid";

export interface SearchResultsProps {
  results: MCPItem[];
  recommendations?: MCPItem[];
  explanation?: string;
  isLoading?: boolean;
  query?: string;
}

export function SearchResults({
  results,
  recommendations,
  explanation,
  isLoading = false,
  query
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="my-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ea580c] border-r-transparent"></div>
        <p className="mt-2 text-[#9ca3af]">思考中...</p>
      </div>
    );
  }

  if (!results.length && !recommendations?.length) {
    return (
      <div className="my-8 text-center">
        <p className="text-[#9ca3af]">
          {query ? `没有找到与"${query}"相关的MCP服务器` : "请输入搜索词以推荐MCP服务器"}
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {recommendations && recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#e5e5e5] mb-4">推荐的MCP服务器</h2>
          {explanation && (
            <p className="text-[#9ca3af] mb-4">{explanation}</p>
          )}
          <SectionGrid>
            {recommendations.map((item) => (
              <MCPCard 
                key={item.id}
                title={item.title}
                packageName={item.packageName}
                description={item.description}
                icon={item.icon}
                downloads={item.downloads}
                isActive={item.isActive}
                githubLink={item.githubLink}
              />
            ))}
          </SectionGrid>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[#e5e5e5] mb-4">搜索结果</h2>
          <SectionGrid>
            {results.map((item) => (
              <MCPCard 
                key={item.id}
                title={item.title}
                packageName={item.packageName}
                description={item.description}
                icon={item.icon}
                downloads={item.downloads}
                isActive={item.isActive}
                githubLink={item.githubLink}
              />
            ))}
          </SectionGrid>
        </div>
      )}
    </div>
  );
}
