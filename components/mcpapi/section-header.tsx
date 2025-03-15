import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SectionHeaderProps {
  title: string;
  count?: number;
  showViewAll?: boolean;
  showNavigation?: boolean;
  viewAllHref?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

/**
 * SectionHeader component displays a header for a section with optional navigation controls
 * and a "View all" link.
 */
export function SectionHeader({
  title,
  count,
  showViewAll = false,
  showNavigation = false,
  viewAllHref = "#",
  onPrevious,
  onNext
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {count !== undefined && (
          <span className="text-xs bg-[#292524] px-1.5 py-0.5 rounded text-[#9ca3af]">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showViewAll && (
          <Link 
            href={viewAllHref} 
            className="text-sm text-[#9ca3af] hover:text-[#e5e5e5]"
            aria-label={`View all ${title}`}
          >
            View all
          </Link>
        )}
        {showNavigation && (
          <div className="flex gap-1">
            <button 
              className="p-1 rounded bg-[#292524] text-[#9ca3af] hover:text-[#e5e5e5]"
              onClick={onPrevious}
              aria-label="Previous page"
              disabled={!onPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              className="p-1 rounded bg-[#292524] text-[#9ca3af] hover:text-[#e5e5e5]"
              onClick={onNext}
              aria-label="Next page"
              disabled={!onNext}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
