import { useMemo } from 'react';
import { MCPItem } from '@/types/mcp';
import { SectionHeader } from './section-header';
import { SectionGrid } from './section-grid';
import { MCPCard } from './mcp-card';
import { Sparkles } from 'lucide-react';
import { getTheme } from '@/utils/constants/theme';
import { useMCPContext } from '@/contexts/mcp-context';

interface RecommendationsSectionProps {
  recommendations: MCPItem[];
  title?: string;
  explanation?: string;
  clearButton?: React.ReactNode;
}

/**
 * Component to display recommended MCP items
 * Shows a grid of MCPCards with an optional explanation
 */
export function RecommendationsSection({
  recommendations,
  title = '推荐',
  explanation,
  clearButton,
}: RecommendationsSectionProps) {
  // Don't render if there are no recommendations
  if (!recommendations.length) {
    return null;
  }

  // Get current theme mode
  const { state } = useMCPContext();
  const { darkMode } = state;
  const currentTheme = getTheme(darkMode ? 'dark' : 'light');

  // Memoize the recommendations to avoid unnecessary re-renders
  const memoizedRecommendations = useMemo(() => recommendations, [recommendations]);

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <SectionHeader
          title={title}
          icon={<Sparkles size={18} style={{ color: currentTheme.colors.text.accent }} />}
        />
        {clearButton}
      </div>

      {explanation && <p className="mb-4">{explanation}</p>}
      
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
