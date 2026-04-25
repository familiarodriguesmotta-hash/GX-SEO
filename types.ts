
export interface SeoMetric {
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  details: string;
}

export interface AnalysisResult {
  url: string;
  overallScore: number;
  timestamp: string;
  loadingSpeed: number;
  mobileFriendly: boolean;
  backlinksCount: number;
  metrics: SeoMetric[];
  issues: {
    severity: 'high' | 'medium' | 'low';
    message: string;
  }[];
}

export interface AIRecommendation {
  title: string;
  description: string;
  codeSnippet?: string;
  impact: 'High' | 'Medium' | 'Low';
  category?: 'Keyword' | 'Content' | 'Technical' | 'Backlink';
}

export interface AIToolkitData {
  keywords: { phrase: string; volume: string; difficulty: number }[];
  contentIdeas: { title: string; type: string; priority: string }[];
  competitors: { name: string; gap: string }[];
  searchInsights?: { source: string; snippet: string; url: string }[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
}

export enum PlanType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export type ActiveTab = 'overview' | 'keywords' | 'content' | 'competitors';
