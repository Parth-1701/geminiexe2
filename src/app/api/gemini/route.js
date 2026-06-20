import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, imageBase64, mimeType } = body; 

    // 1. Ask Gemini to write the code
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
    
    const result = JSON.parse(text);
    const htmlCode = result.htmlCode;

    // 2. Upload to Supabase using pure REST API (Hackathon Shortcut!)
    let liveUrl = null;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      // Create a unique filename for this generation
      const filename = `vibe-app-${Date.now()}.html`;
      
      // The exact REST endpoint to upload files to a bucket
      const uploadUrl = `${supabaseUrl}/storage/v1/object/vibe-exports/${filename}`;
      
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'text/html; charset=utf-8', // Crucial: Tell the browser it's a website!
        },
        body: htmlCode,
      });

      if (uploadRes.ok) {
        // Construct the public URL that anyone can visit
        liveUrl = `${supabaseUrl}/storage/v1/object/public/vibe-exports/${filename}`;
      } else {
        const errorText = await uploadRes.text();
        console.error('Supabase upload failed:', errorText);
      }
    }

    // Return BOTH the code for the preview iframe AND the live shareable URL
    return NextResponse.json({ 
      htmlCode, 
      liveUrl 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
