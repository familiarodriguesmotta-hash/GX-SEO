
import React from 'react';
import { BarChart3, ChevronDown, User } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b0c10]/80 backdrop-blur-md border-b border-[#26282e]">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer group" onClick={onReset}>
            <div className="w-8 h-8 bg-gxBlue rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform">
                <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Gx<span className="text-gxBlue">SEO</span>
            </span>
          </div>
          
          <nav className="hidden lg:flex space-x-6 items-center">
            <button onClick={onReset} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              Audit Tool
            </button>
            <div className="h-4 w-[1px] bg-[#26282e]"></div>
            <button className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              Solutions
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              Enterprise
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center">
              Resources <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest px-4">
              Log In
            </button>
            <button className="bg-gxBlue hover:bg-gxBlue/90 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-gxBlue/20">
              Free Trial
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1c1e24] flex items-center justify-center border border-[#26282e] cursor-pointer">
               <User className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
