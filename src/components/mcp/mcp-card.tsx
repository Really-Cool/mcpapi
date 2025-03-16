import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { IconService } from "@/services/icon-service";
import { getTheme } from "@/utils/constants/theme";
import { Star } from "lucide-react";
import { MCPItem } from "@/types/mcp";
import { useMCPItems } from '@/hooks/mcp/use-mcp-items';
import { useRouter } from 'next/navigation';

export interface MCPCardProps {
  id?: string;
  title: string;
  packageName?: string;
  description: string;
  icon?: ReactNode;
  iconName?: string;
  downloads?: string;
  isActive?: boolean;
  githubLink?: string;
  onCardClick?: () => void;
}

/**
 * MCPCard component displays information about a Model Context Protocol package
 * Uses the IconService to handle different icon formats
 */
export function MCPCard({
  id,
  title,
  packageName,
  description,
  icon,
  iconName,
  downloads,
  isActive = false,
  githubLink,
  onCardClick
}: MCPCardProps) {
  // Use our custom hook for favorites and tracking
  const { isFavorite, toggleFavorite, trackItemView, darkMode } = useMCPItems();
  const router = useRouter();
  
  // Get the current theme based on dark mode state
  const currentTheme = useMemo(() => 
    getTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );
  
  // Check if this card is in favorites
  const isItemFavorite = useMemo(() => 
    id ? isFavorite(id) : false,
    [id, isFavorite]
  );
  
  // Process the icon using the IconService and memoize the result
  const renderedIcon = useMemo(() => 
    IconService.createIcon(icon, iconName),
    [icon, iconName]
  );

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!id) return;
    
    // Create a valid MCPItem object with required fields
    const item: MCPItem = {
      id,
      title,
      description,
      // Provide default values for required fields that might be undefined
      packageName: packageName || "",
      downloads: downloads || "0",
      // Optional fields
      icon,
      iconName,
      isActive,
      githubLink
    };
    
    toggleFavorite(item);
  };
  
  // Extract the creation of MCPItem to a helper function to avoid duplication
  const createMCPItem = (): MCPItem => ({
    id: id || crypto.randomUUID(), // Generate a random ID if not provided
    title,
    description,
    packageName: packageName || "",
    downloads: downloads || "0",
    icon,
    iconName,
    isActive,
    githubLink
  });

  // Handle card click with navigation to detail page
  const handleCardClick = () => {
    // Log for debugging
    console.log(`MCPCard clicked: ${id}`);
    
    if (id) {
      const item = createMCPItem();
      
      // Track item view in user's history
      trackItemView(item);
      
      // Navigate to detail page - Using direct window location for reliable navigation
      // during development to ensure the navigation works
      console.log(`Navigating to /mcp/${id}`);
      
      // Try both methods of navigation for better compatibility
      try {
        router.push(`/mcp/${id}`);
      } catch (error) {
        console.error("Navigation error with router:", error);
        // Fallback to window.location
        window.location.href = `/mcp/${id}`;
      }
    }
    
    // Still call the original onCardClick if provided
    if (onCardClick) {
      onCardClick();
    }
  };
  
  // Get border color based on favorite status
  const borderColor = isItemFavorite 
    ? currentTheme.colors.status.active 
    : currentTheme.colors.border.default;

  return (
    <div 
      className="rounded-md p-4 border transition-colors cursor-pointer hover:border-orange-600"
      style={{ 
        backgroundColor: currentTheme.colors.background.secondary,
        borderColor: borderColor,
        color: currentTheme.colors.text.primary
      }}
      onClick={handleCardClick}
      role="article"
      aria-label={`${title} package`}
      tabIndex={0}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span style={{ color: currentTheme.colors.text.accent }}>{renderedIcon}</span>
          <span className="font-medium" style={{ color: currentTheme.colors.text.primary }}>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {downloads && (
            <span className="text-xs" style={{ color: currentTheme.colors.text.secondary }}>↓ {downloads}</span>
          )}
          {id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(createMCPItem());
              }}
              className={`p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              aria-label={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                size={14}
                fill={isItemFavorite ? currentTheme.colors.status.active : "none"}
                stroke={isItemFavorite ? currentTheme.colors.status.active : currentTheme.colors.text.secondary}
              />
            </button>
          )}
        </div>
      </div>
      <div className="text-xs mb-2 flex items-center gap-2">
        {githubLink ? (
          <Link 
            href={githubLink} 
            className="flex items-center gap-1 hover:underline"
            style={{ color: currentTheme.colors.text.link }}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${packageName || ''} on GitHub`}
          >
            <span>{packageName}</span>
          </Link>
        ) : (
          packageName && <span style={{ color: currentTheme.colors.text.secondary }}>{packageName}</span>
        )}
        {isActive && (
          <span 
            className="inline-flex items-center"
            title="Active package"
          >
            <span 
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: currentTheme.colors.status.active }}
            ></span>
            <span className="text-xs" style={{ color: currentTheme.colors.text.secondary }}>Active</span>
          </span>
        )}
      </div>
      <p className="text-sm" style={{ color: currentTheme.colors.text.secondary }}>{description}</p>
    </div>
  );
}
