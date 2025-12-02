'use client'

import { useState } from 'react'

interface VoteButtonsProps {
  questionId: string
  upvotes?: number
  downvotes?: number
  initialUpvotes?: number
  initialDownvotes?: number
  userVote?: 'up' | 'down' | null
}

export default function VoteButtons({
  questionId,
  upvotes: propUpvotes,
  downvotes: propDownvotes,
  initialUpvotes,
  initialDownvotes,
  userVote: initialUserVote,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(propUpvotes || initialUpvotes || 0)
  const [downvotes, setDownvotes] = useState(propDownvotes || initialDownvotes || 0)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote || null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVote = async (voteType: 'up' | 'down') => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          voteType,
        }),
      })

      if (response.status === 401) {
        // Redirect to login
        window.location.href = '/api/auth/signin'
        return
      }

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      const data = await response.json()

      // Update local state based on vote action
      if (userVote === voteType) {
        // Remove vote
        setUserVote(null)
        if (voteType === 'up') {
          setUpvotes((prev) => prev - 1)
        } else {
          setDownvotes((prev) => prev - 1)
        }
      } else if (userVote) {
        // Change vote
        setUserVote(voteType)
        if (voteType === 'up') {
          setUpvotes((prev) => prev + 1)
          setDownvotes((prev) => prev - 1)
        } else {
          setDownvotes((prev) => prev + 1)
          setUpvotes((prev) => prev - 1)
        }
      } else {
        // New vote
        setUserVote(voteType)
        if (voteType === 'up') {
          setUpvotes((prev) => prev + 1)
        } else {
          setDownvotes((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const netVotes = (upvotes || 0) - (downvotes || 0)

  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <button
        onClick={() => handleVote('up')}
        disabled={isLoading}
        className={`vote-btn p-1.5 sm:p-2 rounded-lg transition-colors ${
          userVote === 'up'
            ? 'bg-green-100 text-green-600'
            : 'hover:bg-gray-100 text-scaler-gray'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Upvote"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <span
        className={`text-base sm:text-xl font-bold ${
          netVotes > 0
            ? 'text-green-600'
            : netVotes < 0
            ? 'text-red-500'
            : 'text-scaler-gray'
        }`}
      >
        {netVotes}
      </span>

      <button
        onClick={() => handleVote('down')}
        disabled={isLoading}
        className={`vote-btn p-1.5 sm:p-2 rounded-lg transition-colors ${
          userVote === 'down'
            ? 'bg-red-100 text-red-500'
            : 'hover:bg-gray-100 text-scaler-gray'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Downvote"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  )
}
