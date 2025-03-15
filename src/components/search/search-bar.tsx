import { Search } from "lucide-react";
import { useMemo } from "react";
import { getTheme } from "@/utils/constants/theme";
import { useMCPItems } from '@/hooks/mcp/use-mcp-items';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  placeholder = "随便问问,看您还需要什么MCP", 
  onSearch 
}: SearchBarProps) {
  // Get the dark mode state from context
  const { darkMode } = useMCPItems();
  
  // Get the current theme based on dark mode state
  const currentTheme = useMemo(() => 
    getTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    if (onSearch && query) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
      <input
        type="text"
        name="query"
        placeholder={placeholder}
        className="w-full rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600"
        style={{
          backgroundColor: currentTheme.colors.background.secondary,
          borderColor: currentTheme.colors.border.default,
          color: currentTheme.colors.text.primary,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      />
      <button 
        type="submit"
        className="absolute right-1 top-1 p-1.5 rounded"
        style={{ backgroundColor: currentTheme.colors.text.accent }}
      >
        <Search className="h-4 w-4 text-white" />
      </button>
    </form>
  );
}
