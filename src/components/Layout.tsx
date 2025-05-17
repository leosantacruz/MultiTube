import React, { ReactNode } from "react";
import Navigation from "./Navigation";
import { Github } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="text-xl font-bold tracking-tight">
            <img
              src="/images/multitube-logo.png"
              alt="Multitube Logo"
              width={180}
            />
          </a>
          <Navigation />
        </div>
      </header>

      <main className="w-full mx-auto p-4 flex-1">{children}</main>

      <footer className="bg-gray-800 py-3">
        <a
          href="https://github.com/leosantacruz/multitube"
          target="_blank"
          className="container mx-auto px-4 text-sm text-gray-400 hover:text-white hover:cursor-pointer text-center flex items-center justify-center gap-3"
        >
          Ver proyecto en Github <Github />
        </a>
      </footer>
    </div>
  );
};

export default Layout;
