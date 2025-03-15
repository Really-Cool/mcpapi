import Link from "next/link";
import { ReactNode } from "react";

export interface MCPCardProps {
  title: string;
  packageName?: string;
  description: string;
  icon?: ReactNode;
  iconName?: string;
  downloads?: string;
  isActive?: boolean;
  githubLink?: string;
}

/**
 * MCPCard component displays information about a Model Context Protocol package
 * 
 * Notes about icon handling:
 * 1. Original React Element: When defined in mcp-data.tsx, icons are proper React elements like:
 *    <FileText className="h-5 w-5" />
 * 2. After JSON Serialization/Deserialization: The icon becomes a plain JavaScript object:
 *    {
 *      "type": {},
 *      "props": {
 *        "className": "h-5 w-5",
 *        "children": "📄" // For some icons, especially custom spans
 *      }
 *    }
 * 3. The renderIcon function handles these different formats appropriately
 */
export function MCPCard({
  title,
  packageName,
  description,
  icon,
  iconName,
  downloads,
  isActive = false,
  githubLink
}: MCPCardProps) {
  /**
   * Renders the appropriate icon based on the provided icon and iconName props
   * Handles different formats of icon data that might come from API responses
   */
  const renderIcon = (icon: ReactNode, iconName?: string): ReactNode => {
    // If no icon is provided, use iconName or default emoji
    if (icon === null || icon === undefined) {
      return iconName || "📦";
    }
    
    // Handle serialized React elements (from API responses)
    if (
      typeof icon === 'object' && 
      Object.prototype.toString.call(icon) !== '[object Symbol]' && 
      !('$$typeof' in (icon as any))
    ) {
      // Try to extract children from props if available
      if (icon && 'props' in (icon as any) && (icon as any).props?.children) {
        return (icon as any).props.children;
      }
      
      // Fallback to iconName or default
      return iconName || "📦";
    }
    
    // Return the valid React element
    return icon;
  };

  return (
    <div className="bg-[#292524] rounded-md p-4 border border-[#444444] hover:border-[#ea580c] transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[#ea580c]">{renderIcon(icon, iconName)}</span>
          <span className="font-medium">{title}</span>
        </div>
        {downloads && (
          <span className="text-xs text-[#9ca3af]">↓ {downloads}</span>
        )}
      </div>
      <div className="text-xs text-[#9ca3af] mb-2">
        {githubLink ? (
          <Link href={githubLink} className="text-[#f97316] hover:underline">
            {packageName}
          </Link>
        ) : (
          packageName && <span>{packageName}</span>
        )}
        {isActive && (
          <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
        )}
      </div>
      <p className="text-sm text-[#9ca3af]">{description}</p>
    </div>
  );
}
