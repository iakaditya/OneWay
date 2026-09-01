import type { Metadata } from 'next';
import { Inter, Caveat } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'OneWay — Know the Road Before You Take It',
    template: '%s | OneWay',
  },
  description:
    'AI-powered travel intelligence. Understand weather, road conditions, alerts, community reports, and route risks before and during your journey.',
  keywords: [
    'travel safety',
    'route intelligence',
    'road conditions',
    'travel alerts',
    'journey planner',
    'AI travel',
  ],
  openGraph: {
    title: 'OneWay — Know the Road Before You Take It',
    description: 'AI-powered travel intelligence for safer journeys.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <body className="bg-background text-text-primary antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
