import { useMemo } from 'react';
import { MCPItem } from '@/types/mcp';
import { SectionHeader } from './section-header';
import { SectionGrid } from './section-grid';
import { MCPCard } from './mcp-card';
import { Sparkles } from 'lucide-react';
import { theme } from '@/lib/constants/theme';

interface RecommendationsSectionProps {
  recommendations: MCPItem[];
  title?: string;
  explanation?: string;
}

/**
 * Component to display recommended MCP items
 * Shows a grid of MCPCards with an optional explanation
 */
export function RecommendationsSection({
  recommendations,
  title = '推荐',
  explanation,
}: RecommendationsSectionProps) {
  // Don't render if there are no recommendations
  if (!recommendations.length) {
    return null;
  }

  // Memoize the recommendations to avoid unnecessary re-renders
  const memoizedRecommendations = useMemo(() => recommendations, [recommendations]);

  return (
    <section className="mb-8">
      <SectionHeader
        title={title}
        icon={<Sparkles size={18} style={{ color: theme.colors.text.accent }} />}
      />
      
      {explanation && (
        <div 
          className="mb-4 p-4 rounded-md text-sm"
          style={{ 
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.secondary 
          }}
        >
          <p>{explanation}</p>
        </div>
      )}
      
      <SectionGrid>
        {memoizedRecommendations.map((item) => (
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
  );
}
