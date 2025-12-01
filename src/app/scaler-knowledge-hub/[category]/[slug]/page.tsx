'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import VoteButtons from '@/components/VoteButtons'
import { Question, CATEGORIES } from '@/lib/types'
import { mockQuestions } from '@/lib/mockData'

export default function QuestionDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  // Find question from mock data
  const question = mockQuestions.find((q) => q.slug === slug)

  if (!question) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-scaler-dark mb-4">
            Question Not Found
          </h1>
          <p className="text-scaler-gray mb-6">
            The question you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/scaler-knowledge-hub"
            className="text-scaler-blue hover:text-scaler-blue-dark font-medium"
          >
            ← Back to Knowledge Hub
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-scaler-gray">
            <li>
              <Link
                href="/scaler-knowledge-hub"
                className="hover:text-scaler-blue transition-colors"
              >
                Knowledge Hub
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/scaler-knowledge-hub?category=${question.category}`}
                className="hover:text-scaler-blue transition-colors"
              >
                {CATEGORIES[question.category] || question.category}
              </Link>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Question Section */}
            <div className="flex gap-6">
              {/* Vote Buttons */}
              <div className="hidden md:block">
                <VoteButtons
                  questionId={question._id}
                  initialUpvotes={question.upvotes}
                  initialDownvotes={question.downvotes}
                />
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-scaler-dark mb-4">
                  {question.title}
                </h1>

                {/* Tags and Category */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-scaler-blue/10 text-scaler-blue">
                    {CATEGORIES[question.category] || question.category}
                  </span>
                  {question.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 text-xs bg-gray-100 text-scaler-gray"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Question Body */}
                {question.body && (
                  <div className="prose prose-scaler mb-8">
                    <PortableText
                      value={question.body}
                      components={portableTextComponents}
                    />
                  </div>
                )}

                {/* Mobile Vote Buttons */}
                <div className="md:hidden mb-6">
                  <div className="flex items-center gap-4">
                    <VoteButtons
                      questionId={question._id}
                      initialUpvotes={question.upvotes}
                      initialDownvotes={question.downvotes}
                    />
                    <span className="text-sm text-scaler-gray">
                      {question.upvotes - question.downvotes} votes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-8 border-gray-200" />

            {/* Answer Section */}
            {question.answer && (
              <div>
                <h2 className="text-xl font-semibold text-scaler-dark mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Answer
                </h2>

                {/* Answer Body */}
                <div className="prose prose-scaler max-w-none">
                  <PortableText
                    value={question.answer.body}
                    components={portableTextComponents}
                  />
                </div>

                {/* Resources */}
                {question.answer.resources && question.answer.resources.length > 0 && (
                  <div className="mt-8 p-4 bg-gray-50">
                    <h3 className="font-semibold text-scaler-dark mb-3">
                      Additional Resources
                    </h3>
                    <ul className="space-y-2">
                      {question.answer.resources.map((resource, index) => (
                        <li key={index}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-scaler-blue hover:text-scaler-blue-dark transition-colors flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Share and Meta */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-scaler-gray">
              <div>
                Published:{' '}
                {new Date(question.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }}
                className="flex items-center gap-2 hover:text-scaler-blue transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6">
          <Link
            href="/scaler-knowledge-hub"
            className="text-scaler-blue hover:text-scaler-blue-dark font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all questions
          </Link>
        </div>
      </div>
    </div>
  )
}
