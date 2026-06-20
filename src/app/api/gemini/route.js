import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the AI client using your secret key from your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
