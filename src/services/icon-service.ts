import { ReactNode, isValidElement } from "react";

/**
 * Custom type for serialized icon objects that might come from API responses
 */
interface SerializedIcon {
  type?: any;
  props?: {
    children?: ReactNode;
    className?: string;
  };
}

/**
 * Utility function to check if an object is likely a serialized icon
 */
const isSerializedIcon = (obj: unknown): obj is SerializedIcon => {
  return (
    typeof obj === 'object' && 
    obj !== null && 
    !isValidElement(obj) &&
    'props' in (obj as SerializedIcon)
  );
};

/**
 * Functions for handling icon processing and rendering
 * Centralizes the logic for dealing with different icon formats
 */
export const IconService = {
  /**
   * Creates a renderable icon from various input formats
   * Handles both React elements and serialized objects from API responses
   * 
   * @param icon - The icon to process
   * @param fallbackIcon - Fallback icon to use if the main icon is invalid
   * @returns A renderable React node
   */
  createIcon: (icon: ReactNode | SerializedIcon | string | null | undefined, fallbackIcon?: string): ReactNode => {
    // If no icon is provided, use fallback or default
    if (icon === null || icon === undefined) {
      return fallbackIcon || "📦";
    }
    
    // If it's already a valid React element, return it directly
    if (isValidElement(icon)) {
      return icon;
    }
    
    // Handle serialized React elements (from API responses)
    if (isSerializedIcon(icon)) {
      // Extract children from props if available
      if (icon.props?.children) {
        return icon.props.children;
      }
    }
    
    // For string icons (emoji), return directly
    if (typeof icon === 'string') {
      return icon;
    }
    
    // Fallback to provided fallback or default
    return fallbackIcon || "📦";
  }
};
