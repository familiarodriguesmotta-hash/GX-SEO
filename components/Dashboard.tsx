
import React, { useState, useEffect } from 'react';
import { AnalysisResult, PlanType, AIRecommendation, AIToolkitData, ActiveTab } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { 
  AlertTriangle, CheckCircle, Zap, Smartphone, Globe, Lock, Star, 
  Loader2, LayoutDashboard, Key, PenTool, Users, Sparkles, ExternalLink,
  Target, TrendingUp, Search
} from 'lucide-react';
import { generateSeoRecommendations, conductDeepAILandscape } from '../services/geminiService';
import { AIRecommendations } from './AIRecommendations';

interface DashboardProps {
  data: AnalysisResult;
  plan: PlanType;
  onUpgrade: () => Promise<void>;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, plan, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [toolkitData, setToolkitData] = useState<AIToolkitData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (plan === PlanType.PREMIUM) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const [recs, toolkit] = await Promise.all([
            generateSeoRecommendations(data.url, data.issues.map(i => i.message)),
            conductDeepAILandscape(data.url)
          ]);
          setRecommendations(recs);
          setToolkitData(toolkit);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [plan, data]);

  const handleUpgradeClick = async () => {
    setIsUpgrading(true);
    try {
      await onUpgrade();
    } catch (error) {
      console.error("Upgrade failed", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Site Audit', icon: LayoutDashboard },
    { id: 'keywords', label: 'AI Keyword Research', icon: Key },
    { id: 'content', label: 'Content Strategy', icon: PenTool },
    { id: 'competitors', label: 'Competitor Intelligence', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] pt-20 flex flex-col md:flex-row">
      {/* Side Navigation - Semrush Style */}
      <aside className="w-full md:w-64 bg-[#14151a] border-r border-[#26282e] flex flex-col">
        <div className="p-6">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Project Workspace</p>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded bg-gxBlue flex items-center justify-center text-xs font-bold text-white uppercase">
              {data.url.replace(/https?:\/\//, '').charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{data.url}</p>
              <p className="text-[10px] text-gray-500">Active Campaign</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-gxBlue/10 text-gxBlue font-semibold' 
                    : 'text-gray-400 hover:bg-[#1c1e24] hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {plan === PlanType.FREE && (
          <div className="mt-auto p-4 m-4 bg-gradient-to-br from-[#1c1e24] to-[#121212] rounded-xl border border-gxBlue/20">
            <p className="text-xs text-gxBlue font-bold mb-1">PRO PLAN</p>
            <p className="text-[11px] text-gray-400 mb-3">Unlock AI Content Gap and Keyword Magic Tool.</p>
            <button 
              onClick={handleUpgradeClick}
              className="w-full py-2 bg-gxBlue hover:bg-gxBlue/80 text-white rounded text-xs font-bold transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-80px)]">
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#26282e] pb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Audit Overview</h1>
                <p className="text-sm text-gray-500">Comprehensive health check for your domain</p>
              </div>
              <div className="flex items-center space-x-2 bg-[#1c1e24] px-3 py-1.5 rounded-full border border-[#26282e]">
                <Activity className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[11px] font-mono text-gray-300 uppercase tracking-tighter">Live Audit Data</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-1 bg-[#14151a] p-6 rounded-2xl border border-[#26282e]">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">Site Health</p>
                 <ScoreGauge score={data.overallScore} />
               </div>

               <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Backlinks', val: data.backlinksCount.toLocaleString(), icon: Globe, color: 'text-gxBlue' },
                   { label: 'Load Speed', val: `${data.loadingSpeed}s`, icon: Zap, color: 'text-yellow-500' },
                   { label: 'Mobile Score', val: data.mobileFriendly ? 'Pass' : 'Fail', icon: Smartphone, color: 'text-green-500' }
                 ].map((stat, i) => (
                   <div key={i} className="bg-[#14151a] p-6 rounded-2xl border border-[#26282e] flex flex-col justify-between">
                     <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                       <stat.icon className={`w-4 h-4 ${stat.color}`} />
                     </div>
                     <p className="text-3xl font-bold text-white">{stat.val}</p>
                   </div>
                 ))}
                 
                 <div className="md:col-span-3 bg-[#14151a] p-6 rounded-2xl border border-[#26282e]">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Domain Performance Trend</p>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.metrics}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1D9BF0" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#1D9BF0" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="score" stroke="#1D9BF0" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-[#14151a] rounded-2xl border border-[#26282e] overflow-hidden">
                <div className="p-6 border-b border-[#26282e] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Prioritized Issues</h3>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold">{data.issues.filter(i => i.severity === 'high').length} CRITICAL</span>
                </div>
                <div className="divide-y divide-[#26282e]">
                    {data.issues.map((issue, idx) => (
                        <div key={idx} className="p-4 flex items-center hover:bg-white/[0.02] transition-colors group">
                            <div className={`w-2 h-2 rounded-full mr-4 ${issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-orange-500' : 'bg-gxBlue'}`}></div>
                            <p className="text-sm text-gray-300 flex-1">{issue.message}</p>
                            <span className="text-[10px] font-mono text-gray-500 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Technical Debt</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {plan === PlanType.PREMIUM && <AIRecommendations recommendations={recommendations} loading={loading} />}
          </div>
        )}

        {(activeTab === 'keywords' || activeTab === 'content' || activeTab === 'competitors') && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            {plan === PlanType.FREE ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-6">
                <div className="w-20 h-20 bg-gxBlue/10 rounded-full flex items-center justify-center mb-8">
                  <Lock className="w-10 h-10 text-gxBlue" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">AI Magic Tool Locked</h2>
                <p className="text-gray-400 max-w-md mb-10">
                  Join 10,000+ tech companies using Gx SEO Premium to automate their SEO growth using Gemini Pro reasoning.
                </p>
                <button 
                  onClick={handleUpgradeClick}
                  disabled={isUpgrading}
                  className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center disabled:opacity-50"
                >
                  {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2 text-gxBlue" />}
                  Unlock AI Toolkit for $9.99/mo
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {loading ? (
                  <div className="space-y-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Loader2 className="w-12 h-12 text-gxBlue animate-spin mb-4" />
                      <h2 className="text-xl font-bold text-white">Gemini is analyzing the landscape...</h2>
                      <p className="text-gray-500 text-sm">Performing semantic mapping and competitor gap analysis</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'keywords' && toolkitData && (
                      <div className="space-y-6">
                        <header>
                           <h2 className="text-2xl font-bold text-white">AI Keyword Magic</h2>
                           <p className="text-sm text-gray-500">Uncover high-intent phrases with low competition.</p>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {toolkitData.keywords.map((kw, i) => (
                            <div key={i} className="bg-[#14151a] p-6 rounded-2xl border border-[#26282e] hover:border-gxBlue transition-all cursor-default group">
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-lg font-bold text-white group-hover:text-gxBlue transition-colors">{kw.phrase}</span>
                                <TrendingUp className="w-4 h-4 text-gxBlue" />
                              </div>
                              <div className="flex items-end justify-between">
                                <div>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Search Vol</p>
                                  <p className="text-xl font-mono text-white">{kw.volume}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Difficulty</p>
                                  <p className={`text-xl font-mono font-bold ${kw.difficulty > 70 ? 'text-red-500' : kw.difficulty > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {kw.difficulty}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'content' && toolkitData && (
                      <div className="space-y-6">
                         <header>
                           <h2 className="text-2xl font-bold text-white">Content Strategy Blueprint</h2>
                           <p className="text-sm text-gray-500">AI-generated content cluster to dominate topical authority.</p>
                        </header>
                        <div className="space-y-4">
                          {toolkitData.contentIdeas.map((idea, i) => (
                            <div key={i} className="bg-[#14151a] p-5 rounded-xl border border-[#26282e] flex items-center justify-between group hover:bg-[#1c1e24] transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                  <Target className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-white">{idea.title}</h4>
                                  <p className="text-xs text-gray-500">Target Type: {idea.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  idea.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-gxBlue/10 text-gxBlue'
                                }`}>
                                  {idea.priority} Priority
                                </span>
                                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'competitors' && toolkitData && (
                      <div className="space-y-6">
                        <header>
                           <h2 className="text-2xl font-bold text-white">Competitor Market Insights</h2>
                           <p className="text-sm text-gray-500">Real-time gap analysis using Gemini Grounding.</p>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {toolkitData.competitors.map((comp, i) => (
                            <div key={i} className="bg-[#14151a] p-6 rounded-2xl border border-[#26282e]">
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-white text-lg">{comp.name}</span>
                                <ExternalLink className="w-4 h-4 text-gray-500" />
                              </div>
                              <p className="text-sm text-gray-400 leading-relaxed">
                                <span className="text-gxBlue font-bold block mb-2 uppercase text-[10px] tracking-widest">Growth Opportunity:</span>
                                {comp.gap}
                              </p>
                            </div>
                          ))}
                        </div>

                        {toolkitData.searchInsights && toolkitData.searchInsights.length > 0 && (
                          <div className="mt-12 bg-gxBlue/5 rounded-3xl p-8 border border-gxBlue/10">
                            <div className="flex items-center mb-6">
                              <Search className="w-5 h-5 text-gxBlue mr-3" />
                              <h3 className="text-lg font-bold text-white">AI Web Intelligence (Recent News)</h3>
                            </div>
                            <div className="grid gap-6">
                              {toolkitData.searchInsights.map((insight, i) => (
                                <div key={i} className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                   <p className="text-xs text-gxBlue font-bold mb-2 uppercase">{insight.source}</p>
                                   <p className="text-sm text-gray-300 mb-4">{insight.snippet}</p>
                                   <a href={insight.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gxBlue transition-colors flex items-center">
                                     View source <ExternalLink className="w-3 h-3 ml-1" />
                                   </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
