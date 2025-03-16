import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { getTheme } from "@/utils/constants/theme";
import { useMCPItems } from '@/hooks/mcp/use-mcp-items';

export interface SectionHeaderProps {
  title: string;
  count?: number;
  icon?: ReactNode;
  showViewAll?: boolean;
  showNavigation?: boolean;
  viewAllHref?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

/**
 * SectionHeader component displays a header for a section with optional navigation controls,
 * icon, and a "View all" link.
 */
export function SectionHeader({
  title,
  count,
  icon,
  showViewAll = false,
  showNavigation = false,
  viewAllHref = "#",
  onPrevious,
  onNext
}: SectionHeaderProps) {
  // Get the dark mode state from context
  const { darkMode } = useMCPItems();
  
  // Get the current theme based on dark mode state
  const currentTheme = useMemo(() => 
    getTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {icon && <div className="flex items-center">{icon}</div>}
        <h2 
          className="text-xl font-bold"
          style={{ color: currentTheme.colors.text.primary }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span 
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ 
              backgroundColor: currentTheme.colors.background.secondary,
              color: currentTheme.colors.text.secondary
            }}
          >
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* {showViewAll && (
          <Link 
            href={viewAllHref} 
            className="text-sm hover:underline"
            style={{ color: currentTheme.colors.text.link }}
            aria-label={`View all ${title}`}
          >
            查看全部
          </Link>
        )} */}
        {showNavigation && (
          <div className="flex gap-1">
            <button 
              className="p-1 rounded"
              style={{ 
                backgroundColor: currentTheme.colors.background.secondary,
                color: currentTheme.colors.text.secondary
              }}
              onClick={onPrevious}
              aria-label="Previous page"
              disabled={!onPrevious}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="p-1 rounded"
              style={{ 
                backgroundColor: currentTheme.colors.background.secondary,
                color: currentTheme.colors.text.secondary
              }}
              onClick={onNext}
              aria-label="Next page"
              disabled={!onNext}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
