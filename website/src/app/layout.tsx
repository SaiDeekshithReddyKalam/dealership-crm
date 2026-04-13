import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Dealership',
  description: 'Quality pre-owned vehicles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="border-b sticky top-0 bg-white z-10">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gray-900">Smart Dealership</a>
            <nav className="flex gap-6 text-sm">
              <a href="/inventory" className="text-gray-600 hover:text-gray-900">Inventory</a>
              <a href="mailto:nanirock704@gmail.com" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t mt-16 py-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Smart Dealership. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
