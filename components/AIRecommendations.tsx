import React from 'react';
import { AIRecommendation } from '../types';
import { Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  loading: boolean;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations, loading }) => {
  if (loading) {
    return (
      <div className="w-full p-8 border border-gxBorder rounded-2xl bg-gxDarkGray animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-800 rounded w-full"></div>
          <div className="h-24 bg-gray-800 rounded w-full"></div>
          <div className="h-24 bg-gray-800 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="w-full mt-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <Sparkles className="text-gxBlue mr-3 h-6 w-6" />
        <h2 className="text-2xl font-bold text-white">Premium AI Analysis</h2>
      </div>
      
      <div className="grid gap-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-gxDarkGray border border-gxBorder rounded-xl p-6 hover:border-gxBlue transition-colors duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start">
                <CheckCircle2 className={`mt-1 mr-3 h-5 w-5 ${rec.impact === 'High' ? 'text-gxOrange' : 'text-gxBlue'}`} />
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-gxBlue transition-colors">
                    {rec.title}
                  </h3>
                  <span className={`text-xs font-mono px-2 py-1 rounded mt-2 inline-block ${
                    rec.impact === 'High' ? 'bg-gxOrange/20 text-gxOrange' : 'bg-gxBlue/20 text-gxBlue'
                  }`}>
                    {rec.impact} IMPACT
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gxTextMuted mb-4 leading-relaxed">
              {rec.description}
            </p>

            {rec.codeSnippet && (
              <div className="bg-black rounded-lg p-4 border border-gray-800 font-mono text-sm text-gray-300 overflow-x-auto relative">
                <div className="absolute top-2 right-2">
                    <Terminal className="h-4 w-4 text-gray-600" />
                </div>
                <pre>{rec.codeSnippet}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};