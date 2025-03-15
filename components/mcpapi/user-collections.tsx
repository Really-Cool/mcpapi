import { useMemo } from 'react';
import { useMCPItems } from '@/hooks/use-mcp-items';
import { MCPCard } from './mcp-card';
import { SectionGrid } from './section-grid';
import { theme } from '@/lib/constants/theme';
import { Bookmark, Clock, Trash2 } from 'lucide-react';

interface UserCollectionsProps {
  /**
   * Maximum number of items to show in each section
   * @default 4
   */
  maxItems?: number;
}

/**
 * Component to display user's favorites and recently viewed items
 */
export function UserCollections({ maxItems = 4 }: UserCollectionsProps) {
  const { 
    favorites, 
    recentlyViewed, 
    clearRecentlyViewed 
  } = useMCPItems();

  // Limit the number of items shown
  const limitedFavorites = useMemo(() => 
    favorites.slice(0, maxItems), 
    [favorites, maxItems]
  );
  
  const limitedRecentlyViewed = useMemo(() => 
    recentlyViewed.slice(0, maxItems), 
    [recentlyViewed, maxItems]
  );

  // Check if we have any items to display
  const hasFavorites = favorites.length > 0;
  const hasRecentlyViewed = recentlyViewed.length > 0;
  
  // If no items to display, don't render anything
  if (!hasFavorites && !hasRecentlyViewed) {
    return null;
  }

  return (
    <div className="my-8">
      {hasFavorites && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark 
              size={18} 
              className="text-[#ea580c]"
            />
            <h2 
              className="text-xl font-semibold" 
              style={{ color: theme.colors.text.primary }}
            >
              收藏
            </h2>
            <span 
              className="text-sm ml-2 px-2 py-0.5 rounded-full" 
              style={{ 
                backgroundColor: theme.colors.background.hover,
                color: theme.colors.text.secondary 
              }}
            >
              {favorites.length}
            </span>
          </div>
          
          <SectionGrid>
            {limitedFavorites.map(item => (
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
          
          {favorites.length > maxItems && (
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 rounded transition-colors"
                style={{ 
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.secondary
                }}
              >
                查看全部 ({favorites.length})
              </button>
            </div>
          )}
        </div>
      )}
      
      {hasRecentlyViewed && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock 
                size={18} 
                className="text-[#ea580c]"
              />
              <h2 
                className="text-xl font-semibold" 
                style={{ color: theme.colors.text.primary }}
              >
                最近查看
              </h2>
              <span 
                className="text-sm ml-2 px-2 py-0.5 rounded-full" 
                style={{ 
                  backgroundColor: theme.colors.background.hover,
                  color: theme.colors.text.secondary 
                }}
              >
                {recentlyViewed.length}
              </span>
            </div>
            
            <button
              onClick={clearRecentlyViewed}
              className="flex items-center gap-1 px-3 py-1 rounded transition-colors"
              style={{ 
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.secondary
              }}
              aria-label="清除最近查看"
              title="清除最近查看"
            >
              <Trash2 size={14} />
              <span>清除</span>
            </button>
          </div>
          
          <SectionGrid>
            {limitedRecentlyViewed.map(item => (
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
          
          {recentlyViewed.length > maxItems && (
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 rounded transition-colors"
                style={{ 
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.secondary
                }}
              >
                查看全部 ({recentlyViewed.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
