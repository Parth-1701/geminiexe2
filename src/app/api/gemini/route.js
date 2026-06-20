import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, imageBase64, mimeType } = body; 

    // Start with the prompt
    let contents = [];
    if (prompt) {
      contents.push(`Generate an application module matching these exact specs: ${prompt}`);
    } else {
      contents.push(`Recreate the UI shown in the provided image using Tailwind CSS.`);
    }

    // If an image was uploaded, attach it to the Gemini payload
    if (imageBase64 && mimeType) {
      contents.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: `You are an expert full-stack engineer and modern UI architect. 
        Your task is to generate complete, production-ready, beautiful, and fully functional single-page web applications or components based on the user's requirements and uploaded images.
        
        CRITICAL RULES:
        1. You MUST use inline Tailwind CSS utility classes exclusively for styling.
        2. Make the design modern, sleek, interactive, and visually striking.
        3. Do NOT use markdown formatting, triple backticks (\`\`\`), or extra text outside the JSON.
        
        You must return a valid JSON object matching this schema exactly:
        {
          "htmlCode": "string containing the full, raw HTML content including any script tags, inline styles, and embedded Tailwind layout elements"
        }`
      }
    });

    const text = response.text;

    if (!text) {
      return NextResponse.json({ error: 'No response from Gemini' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
