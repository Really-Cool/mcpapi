import Link from "next/link";
import { Github } from "lucide-react";

export interface HeaderProps {
  showGithub?: boolean;
}

export function Header({ showGithub = false }: HeaderProps) {
  return (
    <header className="border-b border-[#292524] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold mr-8">
          <span>MC</span>
          <span className="text-[#ea580c]">Papi</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {showGithub && (
          <Link href="#" className="text-[#9ca3af] hover:text-[#e5e5e5]">
            <Github className="h-5 w-5" />
          </Link>
        )}
        <Link href="https://xiaohui.cool/Farming-in-the-cyber-world" className="text-[#9ca3af] hover:text-[#e5e5e5]">
          <span>文档</span>
        </Link>
      </div>
    </header>
  );
}
