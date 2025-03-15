import { ReactNode } from "react";

export interface MCPItem {
  id: string;
  title: string;
  packageName: string;
  description: string;
  icon: ReactNode;
  downloads?: string;
  isActive?: boolean;
  githubLink?: string;
}

export interface MCPSection {
  id: string;
  title: string;
  count: number;
  items: MCPItem[];
}
