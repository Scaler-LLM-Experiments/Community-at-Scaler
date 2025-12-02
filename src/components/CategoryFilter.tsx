'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES } from '@/lib/types'

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleCategoryChange = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange(null)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          !currentCategory
            ? 'bg-scaler-blue text-white'
            : 'bg-gray-100 text-scaler-gray hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {Object.entries(CATEGORIES).map(([key, label]) => (
        <button
          key={key}
          onClick={() => handleCategoryChange(key)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            currentCategory === key
              ? 'bg-scaler-blue text-white'
              : 'bg-gray-100 text-scaler-gray hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
