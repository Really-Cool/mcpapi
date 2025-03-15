import { ReactNode } from "react";

export interface SectionGridProps {
  children: ReactNode;
}

export function SectionGrid({ children }: SectionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {children}
    </div>
  );
}
