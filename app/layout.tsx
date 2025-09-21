import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '(re)connect',
  description: 'A beautiful interactive octopus that comes alive with your nicknames',
  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">{children}</body>
    </html>
  );
}