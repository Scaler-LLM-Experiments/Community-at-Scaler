'use client'

import { useState } from 'react'

export default function MasterclassWidget() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-40 bg-scaler-blue hover:bg-scaler-blue-dark text-white p-4 shadow-lg transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 bg-scaler-dark shadow-2xl overflow-hidden">
      {/* Header with close/minimize */}
      <div className="flex items-center justify-end p-3 border-b border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-4">
          Your First Step To Success
        </h3>

        {/* Badges */}
        <div className="flex gap-2 mb-3">
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium">
            UPCOMING
          </span>
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            CERTIFICATE
          </span>
        </div>

        {/* Event Title */}
        <h4 className="text-white font-semibold mb-3">
          Build an E-Commerce platform using React
        </h4>

        {/* Instructor */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">BK</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">By Bipin Kalra</p>
            <p className="text-gray-400 text-xs">Tech Lead at Coding Minutes</p>
          </div>
        </div>

        {/* Date & Duration */}
        <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Nov 25, 2025 | 7:30 PM
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            3 Hrs
          </div>
        </div>

        {/* Registration Count */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-green-400 text-sm font-medium">3757</span>
          <span className="text-gray-400 text-sm">people have registered</span>
        </div>

        {/* CTA Button */}
        <a
          href="https://www.scaler.com/events"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-scaler-blue hover:bg-scaler-blue-dark text-white text-center py-3 font-semibold transition-colors"
        >
          REGISTER NOW
        </a>
      </div>
    </div>
  )
}
