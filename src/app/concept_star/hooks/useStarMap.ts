"use client";

import { useState, useEffect } from "react";
import { Opinion } from "../types";

interface UseStarMapProps {
  opinions: Opinion[];
  selectedDimension: string | null;
}

interface UseStarMapReturn {
  filteredOpinions: Opinion[];
  dimensionCounts: Record<string, number>;
  totalOpinions: number;
}

export function useStarMap({ 
  opinions, 
  selectedDimension 
}: UseStarMapProps): UseStarMapReturn {
  const [filteredOpinions, setFilteredOpinions] = useState<Opinion[]>(opinions);
  const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    // Filter opinions based on selected dimension
    const filtered = selectedDimension
      ? opinions.filter((o) => o.dimension === selectedDimension)
      : opinions;
    
    setFilteredOpinions(filtered);
    
    // Calculate counts per dimension
    const counts: Record<string, number> = {};
    opinions.forEach((opinion) => {
      counts[opinion.dimension] = (counts[opinion.dimension] || 0) + 1;
    });
    
    setDimensionCounts(counts);
  }, [opinions, selectedDimension]);
  
  return {
    filteredOpinions,
    dimensionCounts,
    totalOpinions: opinions.length,
  };
}
