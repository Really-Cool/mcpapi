import { Search } from "lucide-react";

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  placeholder = "随便问问,看您还需要什么MCP", 
  onSearch 
}: SearchBarProps) {
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
        className="w-full bg-[#292524] border border-[#444444] rounded px-4 py-2 text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
      />
      <button 
        type="submit"
        className="absolute right-1 top-1 bg-[#ea580c] p-1.5 rounded"
      >
        <Search className="h-4 w-4 text-white" />
      </button>
    </form>
  );
}
