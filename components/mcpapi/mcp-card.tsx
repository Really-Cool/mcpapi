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
 * 1. Original React Element: When defined in mcp-data.tsx, your icons are proper React elements like:
 * <FileText className="h-5 w-5" />
 * 2. After JSON Serialization/Deserialization: The icon becomes a plain JavaScript object that looks something like:
 * {
    "type": {},
    "props": {
      "className": "h-5 w-5",
      "children": "📄" // For some icons, especially custom spans
    }
  }
  3. The Problem: This object is no longer a valid React element that can be rendered directly. It's just a data structure that resembles one.
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
  // 渲染图标
  const renderIcon = (icon: ReactNode, iconName?: string) => {
    // 检查是否为有效的 React 元素或字符串
    if (icon === null || icon === undefined) {
      return iconName || "📦"; // 使用 iconName 或默认图标
    }
    console.log(`icon: ${JSON.stringify(icon)}`);
    console.log(`iconName: ${iconName}`);
    // 如果是对象但不是有效的 React 元素（比如从 API 返回的序列化对象）
    if (typeof icon === 'object' && 
        Object.prototype.toString.call(icon) !== '[object Symbol]' && 
        !('$$typeof' in (icon as any))) {
      if(icon.props && icon.props.children) {
        console.log('使用 icon props children');
        return icon.props.children;
      }
      console.log('使用 iconName');
      return iconName || "📦"; // 使用 iconName 或默认图标
    }
    console.log('使用 icon');
    // 返回有效的图标
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
