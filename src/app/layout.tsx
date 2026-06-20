export const metadata = {
  title: 'Vibe Coding Studio',
  description: 'Powered by Gemini and GCP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 m-0 p-0 antialiased">
        {children}
      </body>
    </html>
  )
}
