'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('search', query)
      } else {
        params.delete('search')
      }
      // Keep other params like category
      params.delete('q') // Remove question param when searching
      const newUrl = params.toString() ? `/scaler-knowledge-hub?${params.toString()}` : '/scaler-knowledge-hub'
      router.push(newUrl)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, router, searchParams])

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-scaler-blue focus:border-transparent transition-all"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-scaler-gray-light"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}
