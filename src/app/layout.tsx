import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scaler Knowledge Hub',
  description: 'A curated Q&A knowledge base for developers. Find answers to programming, system design, and interview questions.',
  openGraph: {
    title: 'Scaler Knowledge Hub',
    description: 'A curated Q&A knowledge base for developers',
    siteName: 'Scaler Knowledge Hub',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="bg-scaler-dark text-white">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <a href="/knowledge" className="flex items-center gap-2">
                {/* Scaler Logo */}
                <svg width="120" height="28" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="0" y="22" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" fill="white" letterSpacing="2">SCALER</text>
                  <path d="M115 8L108 15L115 22" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.scaler.com/career-plan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-scaler-blue hover:bg-scaler-blue-dark px-6 py-2 font-medium transition-colors whitespace-nowrap"
                >
                  Request Free 1-on-1 Career Call
                </a>
              </div>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-scaler-dark text-white py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-scaler-gray-light">
              © {new Date().getFullYear()} Scaler Knowledge Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
