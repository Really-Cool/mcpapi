import { ReactNode } from "react";
import { theme } from "@/lib/constants/theme";

export interface SectionGridProps {
  children: ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: 2 | 4 | 6 | 8;
  className?: string;
}

/**
 * SectionGrid component provides a responsive grid layout for displaying content
 * It adapts to different screen sizes with customizable column counts
 * 
 * @param children - The grid items to display
 * @param columns - Optional object to specify column counts for different breakpoints
 * @param gap - Optional gap size between grid items (in multiples of 4px)
 * @param className - Optional additional CSS classes
 */
export function SectionGrid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 5 },
  gap = 4,
  className = ""
}: SectionGridProps) {
  // Get column values with defaults
  const { sm = 1, md = 2, lg = 5 } = columns;
  
  // Create grid classes based on column configuration
  // Using fixed classes instead of template literals for Tailwind compatibility
  let gridColsClass = "grid-cols-1";
  let mdGridColsClass = "md:grid-cols-2";
  let lgGridColsClass = "lg:grid-cols-5";
  
  // Set small screen columns
  if (sm === 2) gridColsClass = "grid-cols-2";
  if (sm === 3) gridColsClass = "grid-cols-3";
  if (sm === 4) gridColsClass = "grid-cols-4";
  if (sm === 5) gridColsClass = "grid-cols-5";
  if (sm === 6) gridColsClass = "grid-cols-6";
  
  // Set medium screen columns
  if (md === 1) mdGridColsClass = "md:grid-cols-1";
  if (md === 3) mdGridColsClass = "md:grid-cols-3";
  if (md === 4) mdGridColsClass = "md:grid-cols-4";
  if (md === 5) mdGridColsClass = "md:grid-cols-5";
  if (md === 6) mdGridColsClass = "md:grid-cols-6";
  
  // Set large screen columns
  if (lg === 1) lgGridColsClass = "lg:grid-cols-1";
  if (lg === 2) lgGridColsClass = "lg:grid-cols-2";
  if (lg === 3) lgGridColsClass = "lg:grid-cols-3";
  if (lg === 4) lgGridColsClass = "lg:grid-cols-4";
  if (lg === 6) lgGridColsClass = "lg:grid-cols-6";
  
  // Set gap class
  let gapClass = "gap-4";
  if (gap === 2) gapClass = "gap-2";
  if (gap === 6) gapClass = "gap-6";
  if (gap === 8) gapClass = "gap-8";
  
  return (
    <div 
      className={`grid ${gridColsClass} ${mdGridColsClass} ${lgGridColsClass} ${gapClass} ${className}`}
    >
      {children}
    </div>
  );
}
