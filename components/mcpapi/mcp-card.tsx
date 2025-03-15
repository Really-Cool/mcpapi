import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { IconService } from "@/lib/services/icon-service";

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
 * Uses the IconService to handle different icon formats
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
  // Process the icon using the IconService and memoize the result
  const renderedIcon = useMemo(() => 
    IconService.createIcon(icon, iconName),
    [icon, iconName]
  );

  return (
    <div className="bg-[#292524] rounded-md p-4 border border-[#444444] hover:border-[#ea580c] transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[#ea580c]">{renderedIcon}</span>
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
