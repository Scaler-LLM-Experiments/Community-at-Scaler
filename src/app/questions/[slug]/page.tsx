import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchQuestionsFromSheet } from '@/lib/sheets'
import { Question } from '@/lib/types'
import { PortableText } from '@portabletext/react'
import { PortableTextComponents } from '@/components/PortableTextComponents'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for all questions
export async function generateStaticParams() {
  const questions = await fetchQuestionsFromSheet()

  return questions.map((question) => ({
    slug: question.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const questions = await fetchQuestionsFromSheet()
  const question = questions.find((q) => q.slug === params.slug)

  if (!question) {
    return {
      title: 'Question Not Found',
    }
  }

  return {
    title: `${question.title} | Scaler Knowledge Hub`,
    description: question.excerpt || question.body.substring(0, 155),
    openGraph: {
      title: question.title,
      description: question.excerpt || question.body.substring(0, 155),
      type: 'article',
      publishedTime: question.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: question.title,
      description: question.excerpt || question.body.substring(0, 155),
    },
  }
}

export default async function QuestionPage({ params }: PageProps) {
  const questions = await fetchQuestionsFromSheet()
  const question = questions.find((q) => q.slug === params.slug)

  if (!question) {
    notFound()
  }

  // Generate QAPage structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      text: question.body,
      answerCount: 1,
      upvoteCount: question.upvotes,
      downvoteCount: question.downvotes,
      datePublished: question.publishedAt,
      author: {
        '@type': 'Organization',
        name: 'Scaler Knowledge Hub',
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer.body,
        upvoteCount: question.upvotes,
        downvoteCount: question.downvotes,
        datePublished: question.publishedAt,
        author: {
          '@type': 'Organization',
          name: 'Scaler Knowledge Hub',
        },
      },
    },
  }

  return (
    <>
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="bg-gray-50 min-h-screen pb-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Breadcrumbs */}
          <nav className="mb-4 sm:mb-6 text-xs sm:text-sm overflow-x-auto">
            <ol className="flex items-center space-x-2 text-scaler-gray whitespace-nowrap">
              <li>
                <Link href="/" className="hover:text-scaler-blue">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/" className="hover:text-scaler-blue">
                  Questions
                </Link>
              </li>
              <li>/</li>
              <li className="text-scaler-dark font-medium truncate max-w-[200px] sm:max-w-md">
                {question.title}
              </li>
            </ol>
          </nav>

          {/* Question Card */}
          <article className="bg-white border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 rounded-lg lg:rounded-none">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-scaler-blue/10 text-scaler-blue rounded-full">
                {question.category}
              </span>
            </div>

            {/* Question Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-scaler-dark mb-4 leading-tight">
              {question.title}
            </h1>

            {/* Question Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-scaler-gray mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="truncate">
                  {new Date(question.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="font-medium">
                  {(question.upvotes || 0) - (question.downvotes || 0)} votes
                </span>
              </div>
            </div>

            {/* Question Body */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-scaler-dark mb-3">Question</h2>
              <div className="prose prose-sm max-w-none text-scaler-gray text-sm sm:text-base leading-relaxed">
                {question.body}
              </div>
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {question.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/?category=${encodeURIComponent(tag)}`}
                      className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs bg-gray-100 text-scaler-gray hover:bg-scaler-blue/10 hover:text-scaler-blue transition-colors rounded"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Answer Card */}
          <article className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg lg:rounded-none">
            <h2 className="text-lg sm:text-xl font-bold text-scaler-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Answer</span>
            </h2>
            <div className="prose prose-sm max-w-none text-scaler-gray leading-relaxed text-sm sm:text-base">
              {question.answer.body}
            </div>

            {/* Resources if available */}
            {question.answer.resources && question.answer.resources.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-scaler-dark mb-3">Additional Resources</h3>
                <ul className="space-y-2">
                  {question.answer.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-scaler-blue hover:underline flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Back to Questions */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-scaler-blue hover:text-scaler-blue-dark font-medium text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-scaler-blue/5 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Questions
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
