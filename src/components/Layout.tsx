import React, { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">
            <img
              src="/images/multitube-logo.png"
              alt="Multitube Logo"
              width={180}
            />
          </h1>
          <Navigation />
        </div>
      </header>

      <main className="container mx-auto p-4 flex-1">{children}</main>

      <footer className="bg-gray-800 py-3">
        <div className="container mx-auto px-4 text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} MultiTube
        </div>
      </footer>
    </div>
  );
};

export default Layout;
