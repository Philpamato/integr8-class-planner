import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Integr8 Class Planner',
  description: 'Structured class planning system for Integr8 Martial Arts coaches.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          {/* Top nav */}
          <header className="bg-midnight text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-palestra flex items-center justify-center text-white font-bold text-sm">
                  I8
                </div>
                <span className="font-semibold text-lg tracking-tight">Class Planner</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link href="/plans" className="text-gray-300 hover:text-white transition-colors">
                  Plans
                </Link>
                <Link href="/plans/new" className="text-gray-300 hover:text-white transition-colors">
                  + New Plan
                </Link>
                <Link href="/drills" className="text-gray-300 hover:text-white transition-colors">
                  Drill Library
                </Link>
              </nav>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
            {children}
          </main>

          <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
            Integr8 Martial Arts &amp; Fitness — Internal Tool
          </footer>
        </div>
      </body>
    </html>
  );
}
