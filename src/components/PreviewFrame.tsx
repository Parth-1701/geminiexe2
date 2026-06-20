'use client';

interface PreviewFrameProps {
  htmlCode: string;
}

export default function PreviewFrame({ htmlCode }: PreviewFrameProps) {
  // Inject Tailwind CSS via CDN dynamically into the iframe head
  const completeSrcDoc = `
    <!DOCTYPE html>
    <html lang="en" class="h-full bg-slate-950">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          /* Smooth out custom scrollbars inside the preview */
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
      <iframe
        title="Vibe Coding Sandbox"
        srcDoc={completeSrcDoc}
        className="w-full h-full border-none bg-slate-950"
        sandbox="allow-scripts"
      />
    </div>
  );
}
