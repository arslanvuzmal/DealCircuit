import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LeadPilot AI - Intelligent Lead Qualification & Automation Platform',
  description: 'Automated lead capture, 5-criteria qualification scoring, AI safety defense, and CRM integration platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-dark-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
