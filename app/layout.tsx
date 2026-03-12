import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Pawn Shop Command Console',
  description: 'One squishy cockpit for every pawned item',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body
        className="font-sans antialiased bg-ps-bg-base text-ps-text flex h-screen overflow-hidden"
        suppressHydrationWarning
      >
        <Sidebar />
        {/* pt-16 gives space for the mobile hamburger button; md:pt-0 resets on desktop */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-16 pb-4 md:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
