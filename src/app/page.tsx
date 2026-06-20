'use client';

import { useState } from 'react';
import PreviewFrame from '@/components/PreviewFrame';
import { Code, Eye, Sparkles, Upload } from 'lucide-react';

export default function VibeStudio() {
  const [prompt, setPrompt] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.htmlCode) setHtmlCode(data.htmlCode);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Vibe Coding Studio
          </h1>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Powered by Gemini 2.5 & GCP
        </span>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden h-[calc(100vh-73px)]">
        {/* Left Input Sidebar */}
        <div className="w-1/3 border-r border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Upload Component Blueprint / Wireframe</label>
            <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 transition rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/40 group">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-slate-400 transition" />
              <p className="text-sm text-slate-400">Drop your screenshot here or click to browse</p>
              <p className="text-xs text-slate-600">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-300 mb-2">Vibe Requirements & Features</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe adjustments, interactions, or branding details..."
              className="w-full flex-1 min-h-[150px] bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none text-sm"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? 'Generating Canvas...' : 'Manifest Application'}
          </button>
        </div>

        {/* Right Sandbox Canvas */}
        <div className="w-2/3 p-6 bg-slate-950 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800/80">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition ${activeTab === 'preview' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Eye className="w-3.5 h-3.5" /> Canvas Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition ${activeTab === 'code' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Code className="w-3.5 h-3.5" /> Source Code
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'preview' ? (
              <PreviewFrame htmlCode={htmlCode} />
            ) : (
              <pre className="w-full h-full bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 overflow-auto font-mono text-xs selection:bg-indigo-500/30">
                <code>{htmlCode || '// No code manifested yet.'}</code>
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
