import { ReactNode } from "react";

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
 * Tailwind CSS 的工作原理是在构建时静态分析代码中所有可能使用的类名，然后只生成那些被使用的类的样式。当我们使用模板字符串动态生成类名（如 grid-cols-${sm}）时，Tailwind 无法在构建时识别这些类名
 * 
 * 
 * @param children - The grid items to display
 * @param columns - Optional object to specify column counts for different breakpoints
 * @param gap - Optional gap size between grid items (in multiples of 4px)
 * @param className - Optional additional CSS classes
 */
export function SectionGrid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 4 },
  gap = 4,
  className = ""
}: SectionGridProps) {
  // Get column values with defaults
  const { sm = 1, md = 2, lg = 4 } = columns;
  
  // Create grid classes based on column configuration
  // Using fixed classes for Tailwind compatibility
  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      case 5: return "grid-cols-5";
      case 6: return "grid-cols-6";
      default: return "grid-cols-1";
    }
  };
  
  const getMdGridColsClass = (cols: number) => {
    switch (cols) {
      case 1: return "md:grid-cols-1";
      case 2: return "md:grid-cols-2";
      case 3: return "md:grid-cols-3";
      case 4: return "md:grid-cols-4";
      case 5: return "md:grid-cols-5";
      case 6: return "md:grid-cols-6";
      default: return "md:grid-cols-2";
    }
  };
  
  const getLgGridColsClass = (cols: number) => {
    switch (cols) {
      case 1: return "lg:grid-cols-1";
      case 2: return "lg:grid-cols-2";
      case 3: return "lg:grid-cols-3";
      case 4: return "lg:grid-cols-4";
      case 5: return "lg:grid-cols-5";
      case 6: return "lg:grid-cols-6";
      default: return "lg:grid-cols-4";
    }
  };
  
  const getGapClass = (gapSize: number) => {
    switch (gapSize) {
      case 2: return "gap-2";
      case 4: return "gap-4";
      case 6: return "gap-6";
      case 8: return "gap-8";
      default: return "gap-4";
    }
  };
  
  const gridColsClass = getGridColsClass(sm);
  const mdGridColsClass = getMdGridColsClass(md);
  const lgGridColsClass = getLgGridColsClass(lg);
  const gapClass = getGapClass(gap);
  
  return (
    <div 
      className={`grid ${gridColsClass} ${mdGridColsClass} ${lgGridColsClass} ${gapClass} ${className}`}
    >
      {children}
    </div>
  );
}
