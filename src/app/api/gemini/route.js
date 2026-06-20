import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, imageBase64, mimeType } = body; 

    let contents = [];
    if (prompt) contents.push(`Generate an application module matching these specs: ${prompt}`);
    else contents.push(`Recreate the UI shown in the provided image using Tailwind CSS.`);

    if (imageBase64 && mimeType) {
      contents.push({ inlineData: { data: imageBase64, mimeType: mimeType } });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: `You are an expert UI architect. Return a JSON object with a single key "htmlCode" containing the complete, raw HTML string with Tailwind CSS inline. No markdown formatting.`
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
