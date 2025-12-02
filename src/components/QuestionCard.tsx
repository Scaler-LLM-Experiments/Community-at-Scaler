'use client'

import Link from 'next/link'
import { Question, CATEGORIES } from '@/lib/types'

interface QuestionCardProps {
  question: Question
  compact?: boolean
}

export default function QuestionCard({ question, compact = false }: QuestionCardProps) {
  const netVotes = question.upvotes - question.downvotes

  const content = (
    <div className={`flex items-start gap-4 ${compact ? 'p-4' : 'p-6'}`}>
      {/* Vote count on left for compact mode */}
      <div className="flex flex-col items-center min-w-[50px]">
        <div
          className={`${compact ? 'text-base' : 'text-lg'} font-semibold ${
            netVotes > 0
              ? 'text-green-600'
              : netVotes < 0
              ? 'text-red-500'
              : 'text-scaler-gray'
          }`}
        >
          {netVotes > 0 ? '+' : ''}
          {netVotes}
        </div>
        <div className="text-xs text-scaler-gray-light">votes</div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold text-scaler-dark mb-1 line-clamp-2 hover:text-scaler-blue transition-colors`}>
          {question.title}
        </h3>
        {!compact && question.excerpt && (
          <p className="text-scaler-gray text-sm mb-3 line-clamp-2">
            {question.excerpt}...
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center ${compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'} font-medium bg-scaler-blue/10 text-scaler-blue`}>
            {CATEGORIES[question.category] || question.category}
          </span>
          {question.tags?.slice(0, compact ? 2 : 3).map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center ${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} bg-gray-100 text-scaler-gray`}
            >
              {tag}
            </span>
          ))}
          {compact && (
            <span className="text-xs text-scaler-gray-light ml-auto">
              {new Date(question.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (compact) {
    return (
      <div className="hover:bg-gray-50 transition-colors">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={`/${question.category}/${question.slug}`}
      className="block bg-white border border-gray-200 hover:border-scaler-blue hover:shadow-md transition-all duration-200"
    >
      {content}
    </Link>
  )
}
