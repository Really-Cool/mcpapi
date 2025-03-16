'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/mcp';
import { mcpSections } from '@/data/mcp-data';
import { getTheme } from '@/utils/constants/theme';
import { ArrowLeft, Github, Download, Star, ExternalLink } from 'lucide-react';
import { IconService } from '@/services/icon-service';
import Link from 'next/link';
import { MCPItem } from '@/types/mcp';

// Storage keys for local functionality
const STORAGE_KEYS = {
  FAVORITES: 'mcp-favorites',
  DARK_MODE: 'mcp-dark-mode',
};

/**
 * MCP Detail Page displays comprehensive information about a specific MCP server
 */
export default function MCPDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mcpItem, setMcpItem] = useState<MCPItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load user preferences from localStorage
  useEffect(() => {
    try {
      // Get dark mode preference
      const storedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (storedDarkMode !== null) {
        setDarkMode(JSON.parse(storedDarkMode));
      } else {
        // Use system preference if nothing stored
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
      
      // Get favorites
      const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavorites) {
        const favoritesData = JSON.parse(storedFavorites);
        setFavorites(favoritesData.map((item: MCPItem) => item.id));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);
  
  // Get the current theme based on dark mode state
  const currentTheme = getTheme(darkMode ? 'dark' : 'light');
  
  // Find the MCP item from all sections based on the ID
  useEffect(() => {
    const id = params.id as string;
    console.log('Looking for MCP with ID:', id);
    
    // Search all MCP sections to find the item with matching ID
    const allItems = mcpSections.flatMap(section => section.items);
    
    const foundItem = allItems.find(item => item.id === id);
      
    setMcpItem(foundItem || null);
    setLoading(false);
  }, [params.id]);
  
  // Check if the current item is in favorites
  const isItemFavorite = mcpItem ? favorites.includes(mcpItem.id) : false;
  
  // Toggle favorite status
  const toggleFavorite = (item: MCPItem) => {
    try {
      let updatedFavorites: MCPItem[] = [];
      const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      
      if (storedFavorites) {
        updatedFavorites = JSON.parse(storedFavorites);
      }
      
      const existingIndex = updatedFavorites.findIndex(fav => fav.id === item.id);
      
      if (existingIndex >= 0) {
        // Remove from favorites
        updatedFavorites.splice(existingIndex, 1);
      } else {
        // Add to favorites
        updatedFavorites.push(item);
      }
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      
      // Update state
      setFavorites(updatedFavorites.map(fav => fav.id));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="py-8 px-4 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!mcpItem) {
    return (
      <MainLayout>
        <div className="py-8 px-4 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text.primary }}>
            MCP 服务器未找到
          </h1>
          <p className="mb-6" style={{ color: currentTheme.colors.text.secondary }}>
            无法找到指定的 MCP 服务器，它可能已被删除或 ID 无效。
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: currentTheme.colors.status.active,
              color: '#ffffff'
            }}
          >
            <ArrowLeft size={16} className="mr-2" />
            返回首页
          </button>
        </div>
      </MainLayout>
    );
  }
  
  // Render the icon using IconService
  const renderedIcon = IconService.createIcon(mcpItem.icon, mcpItem.iconName);
  
  // Create code snippets for installation methods
  const npmInstallCode = `npx -y @alipay-smithery/mcpbridge ${mcpItem.packageName} -p userId=xiaohui.wyh`;
  const yarnInstallCode = `yarn add ${mcpItem.packageName}`;
  
  // Sample TypeScript usage code
  const tsUsageCode = `
1. 检查当前 MCP 客户端是否正常
2. 检查当前MCP 客户端配置路径
3. 检查是否要使用 mcpbridge
4. 配置 ${mcpItem.packageName} MCP 服务器
5. 检查MCP 服务器是否正常工作
`;

  return (
    <MainLayout>
      <div className="py-8 px-4 max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center mb-6 hover:underline"
          style={{ color: currentTheme.colors.text.link }}
        >
          <ArrowLeft size={16} className="mr-1" />
          返回 MCP 列表
        </button>
        
        {/* Header section */}
        <div className="flex items-center mb-6">
          <div className="mr-4 text-3xl">{renderedIcon}</div>
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-3" style={{ color: currentTheme.colors.text.primary }}>
                {mcpItem.title}
              </h1>
              {mcpItem.isActive && (
                <span 
                  className="inline-flex items-center"
                  title="活跃包"
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: currentTheme.colors.status.active }}
                  ></span>
                  <span className="text-xs" style={{ color: currentTheme.colors.text.secondary }}>活跃</span>
                </span>
              )}
              <button
                onClick={() => toggleFavorite(mcpItem)}
                className={`ml-3 p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                aria-label={isItemFavorite ? "从收藏中移除" : "添加到收藏"}
                title={isItemFavorite ? "从收藏中移除" : "添加到收藏"}
              >
                <Star
                  size={18}
                  fill={isItemFavorite ? currentTheme.colors.status.active : "none"}
                  stroke={isItemFavorite ? currentTheme.colors.status.active : currentTheme.colors.text.secondary}
                />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm" style={{ color: currentTheme.colors.text.secondary }}>
                {mcpItem.packageName}
              </span>
              {mcpItem.downloads && (
                <span 
                  className="text-sm flex items-center" 
                  style={{ color: currentTheme.colors.text.secondary }}
                >
                  <Download size={14} className="mr-1" />
                  {mcpItem.downloads}
                </span>
              )}
              {mcpItem.githubLink && (
                <Link 
                  href={mcpItem.githubLink} 
                  className="text-sm flex items-center hover:underline"
                  style={{ color: currentTheme.colors.text.link }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} className="mr-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div 
          className="p-4 rounded-md mb-8"
          style={{ backgroundColor: currentTheme.colors.background.secondary }}
        >
          <p style={{ color: currentTheme.colors.text.primary }}>{mcpItem.description}</p>
        </div>
        
        {/* Installation section */}
        <section className="mb-10">
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: currentTheme.colors.text.primary }}
          >
            手动安装
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div 
              className="p-4 rounded-md"
              style={{ backgroundColor: currentTheme.colors.background.secondary }}
            >
              <pre 
                className="p-3 rounded-md overflow-x-auto"
                style={{ backgroundColor: currentTheme.colors.background.hover }}
              >
                <code style={{ color: currentTheme.colors.text.primary }}>
                  {npmInstallCode}
                </code>
              </pre>
            </div>
            <div 
              className="p-4 rounded-md"
              style={{ backgroundColor: currentTheme.colors.background.secondary }}
            >
            </div>
          </div>
        </section>
        
        {/* Usage example section */}
        <section className="mb-10">
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: currentTheme.colors.text.primary }}
          >
            Dr.Smithery 安装
          </h2>
          <div 
            className="p-4 rounded-md"
            style={{ backgroundColor: currentTheme.colors.background.secondary }}
          >
            <div className="flex justify-between items-center mb-2">
            </div>
            <pre 
              className="p-3 rounded-md overflow-x-auto"
              style={{ backgroundColor: currentTheme.colors.background.hover }}
            >
              <code style={{ color: currentTheme.colors.text.primary, whiteSpace: 'pre-wrap' }}>
                {tsUsageCode}
              </code>
            </pre>
          </div>
        </section>
        
        {/* Documentation link */}
        {mcpItem.githubLink && (
          <section className="mb-10">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: currentTheme.colors.text.primary }}
            >
              使用说明
            </h2>
            <div 
              className="p-4 rounded-md flex items-center justify-between"
              style={{ backgroundColor: currentTheme.colors.background.secondary }}
            >
              <span style={{ color: currentTheme.colors.text.primary }}>查看更多</span>
              <Link 
                href={mcpItem.githubLink} 
                className="flex items-center px-3 py-2 rounded transition-colors"
                style={{
                  backgroundColor: currentTheme.colors.status.active,
                  color: '#ffffff'
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} className="mr-2" />
                访问文档
              </Link>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
