import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation } from '../types';

// Initialize the client
// Note: In a real production app, never expose API keys on the client.
// This should be proxied through a backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSeoRecommendations = async (
  url: string, 
  issues: string[]
): Promise<AIRecommendation[]> => {
  
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return [
      {
        title: "Configuration Error",
        description: "API Key is missing. Please configure the environment.",
        impact: "High"
      }
    ];
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are an expert SEO Technical Consultant.
    Analyze the following website context and reported issues for: ${url}
    
    Reported Issues:
    ${issues.join('\n')}

    Provide 3 to 5 highly specific, technical, and actionable recommendations to improve ranking.
    Focus on "Low Hanging Fruit" that saves money on paid ads.
    
    Return the response in JSON format conforming to the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              codeSnippet: { type: Type.STRING, description: "Optional HTML/CSS/JS snippet to fix the issue" },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["title", "description", "impact"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text) as AIRecommendation[];
    return data;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return [
      {
        title: "AI Analysis Unavailable",
        description: "We couldn't generate live recommendations at this moment. Please try again later.",
        impact: "Medium"
      }
    ];
  }
};