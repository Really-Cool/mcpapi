import { ReactNode } from "react";
import { Header } from "./header";

export interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#e5e5e5]">
      <Header />
      <main className="px-6 md:px-12 py-8">
        {children}
      </main>
    </div>
  );
}
