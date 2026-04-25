
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { AppState, PlanType, AnalysisResult } from './types';
import { simulateBackendAnalysis } from './services/mockBackend';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [userPlan, setUserPlan] = useState<PlanType>(PlanType.FREE);

  const handleAnalyze = useCallback(async (url: string) => {
    setAppState(AppState.ANALYZING);
    try {
      const results = await simulateBackendAnalysis(url);
      setAnalysisData(results);
      setAppState(AppState.DASHBOARD);
    } catch (error) {
      console.error("Analysis failed", error);
      setAppState(AppState.IDLE);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setAnalysisData(null);
  }, []);

  const handleUpgrade = useCallback(async () => {
    // Simula um delay de processamento de pagamento
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUserPlan(PlanType.PREMIUM);
        resolve();
      }, 1500);
    });
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-gxBlue selection:text-white">
      <Header onReset={handleReset} />
      
      <main>
        {appState === AppState.IDLE && (
          <Hero onAnalyze={handleAnalyze} isAnalyzing={false} />
        )}

        {appState === AppState.ANALYZING && (
           <div className="h-screen flex flex-col items-center justify-center bg-black">
              <div className="w-24 h-24 border-t-4 border-b-4 border-gxBlue rounded-full animate-spin mb-8"></div>
              <h2 className="text-2xl font-bold text-white animate-pulse">Scanning site structure...</h2>
              <p className="text-gxTextMuted mt-2">Checking Core Web Vitals and Backlinks</p>
           </div>
        )}

        {appState === AppState.DASHBOARD && analysisData && (
          <Dashboard 
            data={analysisData} 
            plan={userPlan} 
            onUpgrade={handleUpgrade} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
