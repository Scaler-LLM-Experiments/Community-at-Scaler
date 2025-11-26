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
                <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="0" y="24" fontFamily="Arial, Helvetica, sans-serif" fontSize="24" fontWeight="700" fill="white" letterSpacing="3">SCALER</text>
                  <g transform="translate(128, 8)">
                    <path d="M0 0 L6 8 L0 16" stroke="none" fill="#FF6B35"/>
                  </g>
                </svg>
              </a>
              <div className="flex items-center gap-4" id="header-cta-container">
                {/* This will be handled by the page component */}
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
