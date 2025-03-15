import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { IconService } from "@/lib/services/icon-service";
import { getTheme } from "@/lib/constants/theme";
import { Star, ExternalLink, Github } from "lucide-react";
import { MCPItem } from "@/types/mcp";
import { useMCPItems } from "@/hooks/use-mcp-items";

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
  
  // Handle card click
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    }
    
    // Add to recently viewed if id exists
    if (id) {
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
      
      trackItemView(item);
    }
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
      onClick={() => {
        handleCardClick();
        if (id) trackItemView(createMCPItem());
      }}
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
            <Github size={12} />
            <span>{packageName}</span>
            <ExternalLink size={10} />
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
