import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = body.prompt; 

    // Combine user prompt with strict formatting rules
    let contents = [
      `Generate an application module matching these exact specs: ${prompt}`
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: `You are an expert full-stack engineer and modern UI architect. 
        Your task is to generate complete, production-ready, beautiful, and fully functional single-page web applications or components based on the user's requirements.
        
        CRITICAL RULES:
        1. You MUST use inline Tailwind CSS utility classes exclusively for styling.
        2. Make the design modern, sleek, interactive, and visually striking (use gradients, clean spacing, clear typography, and glassmorphism where appropriate).
        3. Include mock data or interactive JavaScript within the HTML if needed to show a working dashboard or app.
        4. Do NOT use markdown formatting, triple backticks (\`\`\`), or extra text outside the JSON.
        
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

    // Return the parsed JSON securely to the frontend
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
