import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DG Tracker | Dashboard de Masmorras & Airtable',
  description: 'Acompanhe as DGs realizadas por personagem e quem executou cada uma, sincronizado com o Airtable.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
