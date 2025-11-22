import React, { useState, useEffect } from 'react';
import { AnalysisResult, PlanType, AIRecommendation } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Zap, Smartphone, Globe, Lock, Star } from 'lucide-react';
import { generateSeoRecommendations } from '../services/geminiService';
import { AIRecommendations } from './AIRecommendations';

interface DashboardProps {
  data: AnalysisResult;
  plan: PlanType;
  onUpgrade: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, plan, onUpgrade }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Effect to fetch AI recommendations if user is Premium
  useEffect(() => {
    if (plan === PlanType.PREMIUM && recommendations.length === 0) {
      setAiLoading(true);
      const issueList = data.issues.map(i => i.message);
      generateSeoRecommendations(data.url, issueList)
        .then(recs => {
          setRecommendations(recs);
          setAiLoading(false);
        })
        .catch(() => setAiLoading(false));
    }
  }, [plan, data, recommendations.length]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analysis Results</h1>
            <p className="text-gxTextMuted font-mono text-sm">{data.url}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gxTextMuted">Last updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Score Card */}
          <div className="col-span-1 bg-gxDarkGray rounded-2xl p-6 border border-gxBorder relative overflow-hidden">
            <h3 className="text-lg font-medium text-white mb-4">Overall Health</h3>
            <ScoreGauge score={data.overallScore} />
            <div className="mt-4 text-center">
                <p className="text-gxTextMuted text-sm">
                    {data.overallScore > 80 ? "Your site is ranking well." : "Critical improvements needed."}
                </p>
            </div>
          </div>

          {/* Key Vitals */}
          <div className="col-span-1 bg-gxDarkGray rounded-2xl p-6 border border-gxBorder flex flex-col justify-between">
            <h3 className="text-lg font-medium text-white mb-6">Core Vitals</h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                        <Zap className="h-5 w-5 mr-3 text-gxBlue" />
                        <span>Speed Index</span>
                    </div>
                    <span className="font-mono font-bold text-white">{data.loadingSpeed}s</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                        <Smartphone className="h-5 w-5 mr-3 text-gxBlue" />
                        <span>Mobile Friendly</span>
                    </div>
                    <span className={`font-mono font-bold ${data.mobileFriendly ? 'text-green-500' : 'text-red-500'}`}>
                        {data.mobileFriendly ? 'Yes' : 'No'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                        <Globe className="h-5 w-5 mr-3 text-gxBlue" />
                        <span>Backlinks</span>
                    </div>
                    <span className="font-mono font-bold text-white">{data.backlinksCount.toLocaleString()}</span>
                </div>
            </div>
          </div>

          {/* Category Performance Chart */}
          <div className="col-span-1 bg-gxDarkGray rounded-2xl p-6 border border-gxBorder">
            <h3 className="text-lg font-medium text-white mb-4">Category Breakdown</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.metrics} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} 
                        />
                        <Bar dataKey="score" barSize={16} radius={[0, 4, 4, 0]}>
                            {data.metrics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#1D9BF0' : '#FF4500'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-gxDarkGray rounded-2xl border border-gxBorder overflow-hidden mb-12">
            <div className="p-6 border-b border-gxBorder">
                <h3 className="text-lg font-bold text-white">Identified Issues</h3>
            </div>
            <div className="divide-y divide-gxBorder">
                {data.issues.map((issue, idx) => (
                    <div key={idx} className="p-4 flex items-start hover:bg-white/5 transition-colors">
                        {issue.severity === 'high' ? (
                            <AlertTriangle className="h-5 w-5 text-gxOrange mt-1 flex-shrink-0" />
                        ) : (
                            <CheckCircle className="h-5 w-5 text-gxBlue mt-1 flex-shrink-0" />
                        )}
                        <div className="ml-4">
                            <p className="text-sm font-medium text-white">{issue.message}</p>
                            <p className="text-xs text-gxTextMuted mt-1 uppercase tracking-wide">Priority: {issue.severity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Upsell / Premium Section */}
        {plan === PlanType.FREE ? (
            <div className="relative rounded-3xl overflow-hidden p-1 bg-gradient-to-r from-gxBlue via-purple-500 to-gxOrange">
                <div className="bg-black rounded-[22px] p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Star className="h-12 w-12 text-gxOrange mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Unlock Premium AI Insights
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Stop guessing. Get actionable, AI-generated code snippets and strategy tailored to this specific site. 
                            Save thousands on Ads by mastering Organic Search.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={onUpgrade}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center justify-center"
                            >
                                <Lock className="h-5 w-5 mr-2" />
                                Unlock for $9.99/mo
                            </button>
                            <span className="text-sm text-gray-500">Cancel anytime. Secure payment.</span>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <AIRecommendations recommendations={recommendations} loading={aiLoading} />
        )}

      </div>
    </div>
  );
};