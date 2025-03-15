import { useEffect, useCallback, useRef } from 'react';

type KeyboardKey = string;
type KeyboardModifier = 'ctrl' | 'alt' | 'shift' | 'meta';
type KeyCombination = {
  key: KeyboardKey;
  modifiers?: KeyboardModifier[];
};
type ShortcutCallback = (event: KeyboardEvent) => void;

interface UseKeyboardShortcutOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}

/**
 * Custom hook for registering keyboard shortcuts
 * 
 * @param keyCombination - The key combination to listen for
 * @param callback - The function to call when the key combination is pressed
 * @param options - Additional options for the shortcut
 * @returns void
 */
export function useKeyboardShortcut(
  keyCombination: KeyCombination | KeyCombination[],
  callback: ShortcutCallback,
  options: UseKeyboardShortcutOptions = {}
): void {
  // Default options
  const {
    preventDefault = true,
    stopPropagation = false,
    enabled = true
  } = options;
  
  // Use a ref for the callback to avoid re-registering the event listener
  // when the callback changes
  const callbackRef = useRef<ShortcutCallback>(callback);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Convert single key combination to array for consistent handling
  const combinations = Array.isArray(keyCombination) 
    ? keyCombination 
    : [keyCombination];
  
  // Check if the event matches a key combination
  const matchesCombination = useCallback((event: KeyboardEvent, combo: KeyCombination): boolean => {
    // Check if the key matches
    if (event.key.toLowerCase() !== combo.key.toLowerCase()) {
      return false;
    }
    
    // If no modifiers are specified, only the key needs to match
    if (!combo.modifiers || combo.modifiers.length === 0) {
      // Ensure no modifiers are pressed
      return !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
    }
    
    // Check if all required modifiers are pressed
    const requiredModifiers = {
      ctrl: combo.modifiers.includes('ctrl'),
      alt: combo.modifiers.includes('alt'),
      shift: combo.modifiers.includes('shift'),
      meta: combo.modifiers.includes('meta')
    };
    
    // Check that exactly the required modifiers are pressed
    return (
      event.ctrlKey === requiredModifiers.ctrl &&
      event.altKey === requiredModifiers.alt &&
      event.shiftKey === requiredModifiers.shift &&
      event.metaKey === requiredModifiers.meta
    );
  }, []);
  
  // Event handler for keydown events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Skip if disabled
    if (!enabled) {
      return;
    }
    
    // Check if any combination matches
    const matchedCombo = combinations.find(combo => matchesCombination(event, combo));
    
    if (matchedCombo) {
      if (preventDefault) {
        event.preventDefault();
      }
      
      if (stopPropagation) {
        event.stopPropagation();
      }
      
      // Call the callback with the event
      callbackRef.current(event);
    }
  }, [combinations, enabled, matchesCombination, preventDefault, stopPropagation]);
  
  // Register and unregister the event listener
  useEffect(() => {
    // Only add the event listener if enabled
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    // Clean up the event listener when the component unmounts
    // or when enabled changes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
