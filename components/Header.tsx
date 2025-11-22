import React from 'react';
import { BarChart3 } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-gxBlack/80 backdrop-blur-md border-b border-gxBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={onReset}>
            <BarChart3 className="h-8 w-8 text-gxText mr-2" />
            <span className="font-bold text-xl tracking-tight text-gxText">
              Gx <span className="text-gxBlue">SEO</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button onClick={onReset} className="text-gxTextMuted hover:text-gxText transition-colors text-sm font-medium">
              Home
            </button>
            <button className="text-gxTextMuted hover:text-gxText transition-colors text-sm font-medium">
              Features
            </button>
            <button className="text-gxTextMuted hover:text-gxText transition-colors text-sm font-medium">
              Pricing
            </button>
          </nav>
          <div>
            <button className="bg-gxText text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};