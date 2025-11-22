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
  loadingSpeed: number; // in seconds
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