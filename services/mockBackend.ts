import { AnalysisResult, SeoMetric } from '../types';

/**
 * In a real-world scenario, this function would call a Python (Flask/FastAPI)
 * or Node.js (Express) backend that uses libraries like BeautifulSoup, Selenium, 
 * or Puppeteer to scrape the target URL.
 * 
 * Due to browser CORS restrictions, we simulate the scraping data here 
 * to demonstrate the UI capabilities.
 */
export const simulateBackendAnalysis = async (url: string): Promise<AnalysisResult> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Deterministic pseudo-random generator based on URL string
  // This ensures the same URL always gets the same "random" score
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  
  const getRandom = (mod: number) => (seed % mod);
  
  const overallScore = 60 + (getRandom(35)); // Score between 60 and 95
  const loadingSpeed = 0.5 + (getRandom(40) / 10); // 0.5s to 4.5s
  
  const metrics: SeoMetric[] = [
    { 
      name: 'Performance', 
      score: overallScore - 5, 
      maxScore: 100, 
      status: overallScore > 80 ? 'good' : 'warning',
      details: 'Time to First Byte (TTFB) needs improvement.'
    },
    { 
      name: 'Accessibility', 
      score: 90 + getRandom(10), 
      maxScore: 100, 
      status: 'good',
      details: 'All ARIA labels present.'
    },
    { 
      name: 'Best Practices', 
      score: 70 + getRandom(20), 
      maxScore: 100, 
      status: 'warning',
      details: 'HTTPS is used, but some mixed content found.'
    },
    { 
      name: 'SEO', 
      score: overallScore, 
      maxScore: 100, 
      status: overallScore > 85 ? 'good' : 'warning',
      details: 'Meta descriptions missing on 2 pages.'
    }
  ];

  return {
    url,
    overallScore,
    timestamp: new Date().toISOString(),
    loadingSpeed,
    mobileFriendly: seed % 2 === 0,
    backlinksCount: 120 + getRandom(5000),
    metrics,
    issues: [
      { severity: 'high', message: 'LCP (Largest Contentful Paint) is > 2.5s' },
      { severity: 'high', message: 'Missing H1 tag on landing page' },
      { severity: 'medium', message: 'Images missing Alt attributes (5 found)' },
      { severity: 'low', message: 'Low text-to-HTML ratio' },
      { severity: 'medium', message: 'Robots.txt is not optimized' }
    ]
  };
};