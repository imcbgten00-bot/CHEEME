import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateIdeaAnalysis = async (idea: string) => {
  const prompt = `Analyze the following business idea: "${idea}". 
  Provide a business name, a short description, and a SWOT analysis.
  Return JSON with this schema:
  {
    "name": "string",
    "description": "string",
    "swot": {
      "strengths": ["string"],
      "weaknesses": ["string"],
      "opportunities": ["string"],
      "threats": ["string"]
    }
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateBranding = async (businessName: string, idea: string) => {
  const prompt = `Create branding for a business named "${businessName}" which does: ${idea}.
  Return a JSON object with a slogan and a color palette (array of 3 hex codes).`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slogan: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateLogo = async (businessName: string, idea: string) => {
  const prompt = `A professional, modern, minimalist vector logo for a company named "${businessName}". 
  The company does: ${idea}. 
  The logo should be clean, iconic, and suitable for a tech startup or modern brand. White background.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', 
    contents: prompt,
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateWebsiteCode = async (businessName: string, idea: string, colors: string[]) => {
  const colorString = colors.join(', ');
  const prompt = `Create a single-file React Landing Page for "${businessName}" (${idea}).
  
  RULES:
  1. Use Tailwind CSS for styling.
  2. Use these colors if possible: ${colorString}.
  3. The code MUST be a default export function named 'App'.
  4. RETURN RAW JAVASCRIPT/JSX ONLY. NO MARKDOWN. NO \`\`\` code blocks.
  5. Import 'lucide-react' for icons.
  6. Import 'React' from 'react'.
  7. Do NOT use ReactDOM.render or createRoot. The file will be imported by an index file.
  8. Include sections: Hero, Features, Testimonials, Footer.
  
  EXAMPLE START:
  import React, { useState } from 'react';
  import { Menu, X } from 'lucide-react';
  export default function App() {
  ...
  
  Generate the full code now.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  let code = response.text || '';
  // Aggressive cleanup to ensure no markdown text breaks the preview
  code = code.replace(/```javascript/g, '')
             .replace(/```jsx/g, '')
             .replace(/```tsx/g, '')
             .replace(/```/g, '')
             .trim();
  
  return code;
};

export const generateStrategy = async (businessName: string, idea: string) => {
  const prompt = `Write a concise 3-step go-to-market strategy for "${businessName}" (${idea}).
  Format it with clear headers and bullet points. Use Markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || '';
};

export const generateSimulationData = async (businessName: string, idea: string) => {
  const prompt = `Generate a realistic 12-month financial projection for a new startup named "${businessName}" (${idea}).
  
  CRITICAL INSTRUCTIONS FOR REALISM:
  1. DO NOT generate linear growth. Real businesses have slow starts, spikes, and plateaus.
  2. Include initial high expenses (burn rate) and low revenue.
  3. Incorporate seasonality or market events relevant to this specific industry.
  4. The "event" field must describe a specific, plausible real-world occurrence (e.g., "Competitor Price Cut", "Viral TikTok Feature", "Seasonality Dip", "Key Hire Onboarding").
  5. Base the numbers on realistic market benchmarks for this sector.
  
  Return a JSON array of 12 objects. Each object should have:
  "month" (Month 1 - Month 12), 
  "revenue" (integer), 
  "expenses" (integer), 
  "profit" (integer),
  "event" (string).`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            month: { type: Type.STRING },
            revenue: { type: Type.INTEGER },
            expenses: { type: Type.INTEGER },
            profit: { type: Type.INTEGER },
            event: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generatePitchDeck = async (businessName: string, idea: string, strategy: string | null) => {
  const prompt = `Create a 7-slide pitch deck for a startup named "${businessName}" (${idea}).
  Context from strategy: ${strategy || 'Standard startup growth'}.
  
  Generate specific content for these 7 slides:
  1. Title Slide (Catchy tagline)
  2. The Problem (What pain point are we solving?)
  3. The Solution (Our product)
  4. Market Opportunity (Why now? How big?)
  5. Business Model (How do we make money?)
  6. Go-To-Market (How do we get users?)
  7. The Ask (What do we need?)

  Return a JSON array of 7 objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING, description: "Main bullet points or paragraph text" },
            notes: { type: Type.STRING, description: "Speaker notes for the presenter" }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};