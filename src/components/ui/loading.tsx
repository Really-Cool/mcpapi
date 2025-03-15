import { theme } from '@/utils/constants/theme';

interface LoadingProps {
  /**
   * Size of the loading spinner in pixels
   * @default 32
   */
  size?: number;
  
  /**
   * Text to display below the spinner
   */
  text?: string;
  
  /**
   * Color of the spinner
   * @default theme.colors.status.loading
   */
  color?: string;
  
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Loading component that displays a spinner with optional text
 * Used to indicate loading states throughout the application
 */
export function Loading({
  size = 32,
  text,
  color = theme.colors.status.loading,
  className = '',
}: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-r-transparent"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${Math.max(2, size / 16)}px`,
          borderStyle: 'solid',
          borderColor: color,
          borderRightColor: 'transparent',
        }}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p
          className="mt-2"
          style={{ color: theme.colors.text.secondary }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
