import Link from "next/link";
import { SearchBar } from "../search/search-bar";

export interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <div className="text-center mb-8">
      <p className="text-[#9ca3af] mb-6">
        让您的 Agent 通过  
        <Link 
          href="https://modelcontextprotocol.io/introduction" 
          className="text-[#ea580c] hover:underline"
        >
         Model Context Protocol
        </Link> servers 无所不能
      </p>

      <SearchBar onSearch={onSearch} />
    </div>
  );
}
