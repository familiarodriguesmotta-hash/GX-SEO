
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, AIToolkitData } from '../types';

// Create a new instance right before use to ensure the latest API key is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSeoRecommendations = async (
  url: string, 
  issues: string[]
): Promise<AIRecommendation[]> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert SEO Technical Consultant.
    Analyze the following website context and reported issues for: ${url}
    
    Reported Issues:
    ${issues.join('\n')}

    Provide 5 highly specific, technical, and actionable recommendations to improve ranking.
    Categorize them into 'Keyword', 'Content', 'Technical', or 'Backlink'.
    Return the response in JSON format.
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
              codeSnippet: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              category: { type: Type.STRING, enum: ["Keyword", "Content", "Technical", "Backlink"] }
            },
            required: ["title", "description", "impact", "category"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return [];
  }
};

export const conductDeepAILandscape = async (url: string): Promise<AIToolkitData> => {
  const ai = getAI();
  // Using Pro for better reasoning and Google Search grounding for real-world competitor data
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    Conduct a deep SEO landscape analysis for the URL: ${url}
    1. Identify high-value keywords relevant to their niche.
    2. Suggest viral-potential content ideas.
    3. Find real-world competitors and identify the 'Content Gap'.
    4. Use Google Search to find recent trends or news related to their business niche.
    
    Format the results into the specified JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  volume: { type: Type.STRING },
                  difficulty: { type: Type.NUMBER }
                }
              }
            },
            contentIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  priority: { type: Type.STRING }
                }
              }
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  gap: { type: Type.STRING }
                }
              }
            },
            searchInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          },
          required: ["keywords", "contentIdeas", "competitors"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Supplement with grounding metadata URLs if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && data.searchInsights) {
      // Enrichment logic here if needed
    }

    return data;
  } catch (error) {
    console.error("Deep Landscape Failed:", error);
    throw error;
  }
};
