'use client';

import { useState, useRef } from 'react';
import { Code, Eye, Sparkles, Upload, Image as ImageIcon, X, Download } from 'lucide-react';

function PreviewFrame({ htmlCode }: { htmlCode: string }) {
  const completeSrcDoc = `
    <!DOCTYPE html>
    <html lang="en" class="h-full bg-slate-950">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        </style>
      </head>
      <body class="h-full text-slate-100 antialiased p-4">
        ${htmlCode || '<div class="flex items-center justify-center h-full text-slate-500 text-sm">Your generated app will render here live...</div>'}
      </body>
    </html>
  `;

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      <iframe title="Sandbox" srcDoc={completeSrcDoc} className="w-full h-full border-none bg-slate-950" sandbox="allow-scripts" />
    </div>
  );
}

export default function VibeStudio() {
  const [prompt, setPrompt] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageBase64, mimeType }),
      });
      const data = await res.json();
      if (data.htmlCode) setHtmlCode(data.htmlCode);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Flawless Local Download Function
  const handleDownload = () => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe-app-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white"><Sparkles className="w-5 h-5 animate-pulse" /></div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Vibe Coding Studio</h1>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Powered by Gemini 2.5</span>
      </header>

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-73px)]">
        <div className="w-1/3 border-r border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Upload Component Blueprint</label>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            {!imageBase64 ? (
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 hover:border-slate-700 transition rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/40 group">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-slate-400" />
                <p className="text-sm text-slate-400 text-center">Tap to upload a screenshot</p>
              </div>
            ) : (
              <div className="relative border border-slate-700 rounded-xl p-4 flex items-center gap-4 bg-slate-800/50">
                <ImageIcon className="w-8 h-8 text-indigo-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">Image attached</p>
                  <p className="text-xs text-slate-400">Ready for analysis</p>
                </div>
                <button onClick={() => { setImageBase64(null); setMimeType(null); }} className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-red-400"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-300 mb-2">Vibe Requirements</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe styling or interactions..." className="w-full flex-1 min-h-[150px] bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 focus:border-indigo-500 resize-none text-sm" />
          </div>

          <button onClick={handleGenerate} disabled={loading || (!prompt && !imageBase64)} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg flex items-center justify-center text-sm transition">
            {loading ? 'Generating Canvas...' : 'Manifest Application'}
          </button>
        </div>

        <div className="w-2/3 p-6 bg-slate-950 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800/80">
              <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition ${activeTab === 'preview' ? 'bg-slate-800 text-white shadow' : 'text-slate-400'}`}><Eye className="w-3.5 h-3.5" /> Preview</button>
              <button onClick={() => setActiveTab('code')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition ${activeTab === 'code' ? 'bg-slate-800 text-white shadow' : 'text-slate-400'}`}><Code className="w-3.5 h-3.5" /> Source Code</button>
            </div>
            
            {/* The Download Button appears when code exists */}
            {htmlCode && (
              <button onClick={handleDownload} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition">
                <Download className="w-4 h-4" /> Download HTML
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'preview' ? (
              <PreviewFrame htmlCode={htmlCode} />
            ) : (
              <pre className="w-full h-full bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 overflow-auto font-mono text-xs whitespace-pre-wrap break-all">
                <code>{htmlCode || '// No code manifested yet.'}</code>
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
