import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
}

interface UseInfiniteScrollReturn {
  observerRef: (node: HTMLElement | null) => void;
  isLoading: boolean;
  hasMore: boolean;
  resetObserver: () => void;
}

/**
 * Custom hook for implementing infinite scrolling
 * Uses Intersection Observer API to detect when the user has scrolled to the bottom
 * 
 * @param loadMore - Function to call when more items need to be loaded
 * @param hasMore - Whether there are more items to load
 * @param options - Additional options for the infinite scroll
 * @returns Object containing the observer ref, loading state, and reset function
 */
export function useInfiniteScroll(
  loadMore: () => Promise<void> | void,
  hasMore: boolean,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  // Default options
  const {
    threshold = 0.1,
    rootMargin = '0px 0px 200px 0px',
    disabled = false
  } = options;
  
  // State for tracking loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Ref for the observer
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Ref for the callback function to avoid recreating the observer
  // when the callback changes
  const loadMoreRef = useRef(loadMore);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);
  
  // Cleanup function to disconnect the observer
  const cleanup = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }
  }, []);
  
  // Reset the observer
  const resetObserver = useCallback(() => {
    cleanup();
    setIsLoading(false);
  }, [cleanup]);
  
  // Callback ref for the sentinel element
  const observerRef = useCallback(
    (node: HTMLElement | null) => {
      // Skip if disabled, loading, or no more items
      if (disabled || isLoading || !hasMore) {
        return;
      }
      
      // Clean up previous observer
      cleanup();
      
      // Skip if no node
      if (!node) {
        return;
      }
      
      // Create a new observer
      observer.current = new IntersectionObserver(
        async (entries) => {
          // Check if the sentinel element is intersecting
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            try {
              setIsLoading(true);
              await loadMoreRef.current();
            } catch (error) {
              console.error('Error loading more items:', error);
            } finally {
              setIsLoading(false);
            }
          }
        },
        {
          root: null, // Use the viewport as the root
          rootMargin,
          threshold,
        }
      );
      
      // Start observing the sentinel element
      observer.current.observe(node);
    },
    [disabled, hasMore, isLoading, cleanup, rootMargin, threshold]
  );
  
  // Clean up the observer when the component unmounts
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return {
    observerRef,
    isLoading,
    hasMore,
    resetObserver,
  };
}
