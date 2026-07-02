import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RaeburnAI Business Twin',
  description: 'Live digital twin for business operations and scenario modelling.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
