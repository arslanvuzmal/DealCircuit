import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LeadPilot AI - AI Lead Operations & n8n Automation',
  description: 'Automated lead capture, 5-criteria qualification scoring, AI safety defense, and n8n workflow automation platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
        {children}
      </body>
    </html>
  );
}