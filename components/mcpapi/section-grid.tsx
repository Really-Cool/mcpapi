import { ReactNode } from "react";

export interface SectionGridProps {
  children: ReactNode;
}

/**
 * SectionGrid component provides a responsive grid layout for displaying content
 * It adapts to different screen sizes with appropriate column counts:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 5 columns
 */
export function SectionGrid({ children }: SectionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {children}
    </div>
  );
}
