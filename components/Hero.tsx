import React, { useState } from 'react';
import { Search, ArrowRight, Activity } from 'lucide-react';

interface HeroProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyze, isAnalyzing }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onAnalyze(url);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-black">
        
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gxBlue/10 rounded-full blur-[128px]" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gxOrange/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-4xl w-full text-center z-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-gxBorder bg-white/5 backdrop-blur-sm mb-8">
             <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
             <span className="text-xs font-mono text-gxTextMuted">SYSTEM OPERATIONAL v2.5</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
          Rank <span className="text-transparent bg-clip-text bg-gradient-to-r from-gxBlue to-purple-400">Higher.</span>
          <br />
          Grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-gxOrange to-red-500">Faster.</span>
        </h1>
        
        <p className="text-xl text-gxTextMuted mb-12 max-w-2xl mx-auto leading-relaxed">
          The advanced SEO platform for modern tech teams. Analyze technical debt, core vitals, and content gaps in seconds.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gxBlue to-gxOrange rounded-full blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
          <div className="relative flex items-center bg-black rounded-full border border-gxBorder p-2 pl-6 shadow-2xl">
            <Search className="h-6 w-6 text-gray-500 flex-shrink-0 mr-4" />
            <input
              type="url"
              required
              placeholder="Enter website URL (e.g. https://example.com)"
              className="w-full bg-transparent border-none text-white text-lg placeholder-gray-600 focus:ring-0 focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center ml-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <Activity className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Analyze <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-16 flex justify-center items-center space-x-8 text-gray-600 grayscale opacity-60">
             {/* Mock Logos */}
             <span className="font-bold text-xl">ACME Corp</span>
             <span className="font-bold text-xl">StarkInd</span>
             <span className="font-bold text-xl">WayneEnt</span>
             <span className="font-bold text-xl">Cyberdyne</span>
        </div>
      </div>
    </div>
  );
};