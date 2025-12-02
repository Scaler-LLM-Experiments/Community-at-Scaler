'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import QuestionCard from '@/components/QuestionCard'
import QuestionModal from '@/components/QuestionModal'
import LeadFormModal from '@/components/LeadFormModal'
import { Question, CATEGORIES } from '@/lib/types'

type SortOption = 'newest' | 'votes' | 'oldest'

interface KnowledgeContentProps {
  initialQuestions: Question[]
}

function KnowledgeContent({ initialQuestions }: KnowledgeContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [allQuestions] = useState<Question[]>(initialQuestions)
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false)

  // Inject header CTA button
  useEffect(() => {
    const container = document.getElementById('header-cta-container')
    if (container && container.children.length === 0) {
      const button = document.createElement('button')
      button.className = 'bg-scaler-blue hover:bg-scaler-blue-dark text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors flex-shrink-0'
      button.textContent = 'Request Free 1:1 Career Call'
      button.onclick = () => setIsLeadFormOpen(true)
      container.appendChild(button)
    }
  }, [])

  // Check for question in URL on mount
  useEffect(() => {
    const questionSlug = searchParams.get('q')
    if (questionSlug && allQuestions.length > 0) {
      const question = allQuestions.find(q => q.slug === questionSlug)
      if (question) {
        setSelectedQuestion(question)
        setIsModalOpen(true)
      }
    }
  }, [searchParams, allQuestions])

  useEffect(() => {
    const searchQuery = searchParams.get('search')?.toLowerCase() || ''
    const category = searchParams.get('category') || ''

    setSelectedCategory(category)

    let filtered = allQuestions

    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery) ||
          q.excerpt?.toLowerCase().includes(searchQuery) ||
          q.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
      )
    }

    if (category) {
      // Filter by category field OR tags
      filtered = filtered.filter((q) =>
        q.category.toLowerCase() === category.toLowerCase() ||
        q.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
      )
    }

    // Sort questions
    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      )
    } else if (sortBy === 'votes') {
      filtered = [...filtered].sort((a, b) =>
        (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      )
    }

    setQuestions(filtered)
  }, [searchParams, sortBy, allQuestions])

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    const url = params.toString() ? `?${params.toString()}` : ''
    router.push(`/${url}`)
  }

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)
    // Update URL for SEO without navigation
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', question.slug)
    window.history.pushState({}, '', `/?${params.toString()}`)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedQuestion(null)
    // Remove question from URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    const newUrl = params.toString() ? `/?${params.toString()}` : '/'
    window.history.pushState({}, '', newUrl)
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* Left Sidebar - Hidden on mobile, collapsible */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Community Info */}
            <div className="bg-white border border-gray-200 p-4">
              <h3 className="font-semibold text-scaler-dark mb-3">About Scaler Knowledge Hub</h3>
              <p className="text-sm text-scaler-gray mb-4">
                Get honest answers to your questions about Scaler Academy - fees, placements, curriculum, and more from real experiences.
              </p>
              <div className="text-sm text-scaler-gray-light">
                <div className="flex justify-between mb-2">
                  <span>Questions</span>
                  <span className="font-medium text-scaler-dark">{allQuestions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories</span>
                  <span className="font-medium text-scaler-dark">{Object.keys(CATEGORIES).length}</span>
                </div>
              </div>
            </div>

            {/* Filter by Topics */}
            <div className="bg-white border border-gray-200 p-4">
              <h3 className="font-semibold text-scaler-dark mb-3">Filter by Topic</h3>
              <div className="space-y-1">
                {/* All Questions option */}
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selectedCategory === ''
                      ? 'bg-scaler-blue/10 text-scaler-blue font-medium'
                      : 'text-scaler-gray hover:bg-gray-100'
                  }`}
                >
                  All Questions
                </button>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      selectedCategory === key
                        ? 'bg-scaler-blue/10 text-scaler-blue font-medium'
                        : 'text-scaler-gray hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white border border-gray-200 p-4">
              <h3 className="font-semibold text-scaler-dark mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['scaler', 'fees', 'placements', 'worth', 'investment', 'reviews', 'salary', 'mentors'].map((tag) => (
                  <span
                    key={tag}
                    onClick={() => handleCategoryChange(tag)}
                    className="px-2 py-1 text-xs bg-gray-100 text-scaler-gray hover:bg-scaler-blue/10 hover:text-scaler-blue cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            {/* Mobile Category Filter */}
            <div className="lg:hidden mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-scaler-blue"
              >
                <option value="">All Questions</option>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar />
            </div>

            {/* StackOverflow-style Filter Tabs */}
            <div className="bg-white border border-gray-200 mb-4 rounded-lg lg:rounded-none overflow-hidden">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
                <h2 className="font-semibold text-scaler-dark text-sm sm:text-base">
                  {questions.length} Question{questions.length !== 1 ? 's' : ''}
                </h2>
                <div className="flex">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                      sortBy === 'newest'
                        ? 'border-scaler-blue text-scaler-blue'
                        : 'border-transparent text-scaler-gray hover:text-scaler-dark'
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortBy('votes')}
                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                      sortBy === 'votes'
                        ? 'border-scaler-blue text-scaler-blue'
                        : 'border-transparent text-scaler-gray hover:text-scaler-dark'
                    }`}
                  >
                    Votes
                  </button>
                </div>
              </div>

              {/* Questions List */}
              {loading ? (
                <div className="divide-y divide-gray-200">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 animate-pulse">
                      <div className="h-5 bg-gray-200 w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-100 w-full mb-2"></div>
                      <div className="h-4 bg-gray-100 w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : questions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {questions.map((question) => (
                    <Link
                      key={question._id}
                      href={`/questions/${question.slug}`}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <QuestionCard question={question} compact />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-scaler-gray-light text-lg mb-2">
                    No questions found
                  </div>
                  <p className="text-scaler-gray text-sm">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="bg-scaler-dark text-white p-4 sm:p-6 text-center rounded-lg lg:rounded-none mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Want to level up your career?</h3>
              <p className="text-scaler-gray-light mb-4 text-sm sm:text-base">
                Join 500,000+ learners who transformed their careers with Scaler
              </p>
              <button
                onClick={() => setIsLeadFormOpen(true)}
                className="inline-block bg-scaler-blue hover:bg-scaler-blue-dark px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-colors rounded-lg"
              >
                Know More About Scaler
              </button>
            </div>
          </main>

          {/* Right Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Free Live Class Widget */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="bg-scaler-blue p-4">
                <h3 className="font-bold text-white text-sm">Free Live Class</h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-scaler-gray mb-3">
                  Join live sessions with Scaler founders and learn proven techniques to crack coding interviews at top companies.
                </p>
                <ul className="text-xs text-scaler-gray space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Live coding with founders
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Interview preparation strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Q&A with industry experts
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Certificate of completion
                  </li>
                </ul>
                <a
                  href="https://www.scaler.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-scaler-blue hover:bg-scaler-blue-dark text-white text-center py-2 text-sm font-medium transition-colors"
                >
                  Register for Free
                </a>
              </div>
            </div>

            {/* Career Roadmap Tool Widget */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-scaler-dark to-scaler-dark-light p-4">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Career Roadmap Tool
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-scaler-blue/10 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-scaler-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-xs text-scaler-gray">
                    Benchmark your profile and get shortlisting insights for top companies
                  </p>
                </div>
                <div className="bg-gray-50 p-3 mb-4 text-center">
                  <div className="text-xs text-scaler-gray-light mb-1">Trusted by</div>
                  <div className="text-lg font-bold text-scaler-dark">50,000+</div>
                  <div className="text-xs text-scaler-gray">professionals</div>
                </div>
                <a
                  href="https://www.scaler.com/career-plan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-scaler-dark hover:bg-scaler-dark-light text-white text-center py-2 text-sm font-medium transition-colors rounded"
                >
                  Build Your Roadmap
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Question Modal */}
      {isModalOpen && selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          onClose={handleCloseModal}
        />
      )}

      {/* Lead Form Modal */}
      {isLeadFormOpen && (
        <LeadFormModal onClose={() => setIsLeadFormOpen(false)} />
      )}

      {/* Sticky Bottom CTA Bar - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-scaler-blue shadow-2xl z-50">
        <div className="px-3 py-2.5 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-scaler-dark truncate">Need Career Guidance?</p>
            <p className="text-[10px] text-scaler-gray truncate">Talk to experts for free</p>
          </div>
          <button
            onClick={() => setIsLeadFormOpen(true)}
            className="flex-shrink-0 bg-scaler-blue hover:bg-scaler-blue-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-md"
          >
            Book Call
          </button>
        </div>
      </div>
    </div>
  )
}

export default async function KnowledgePage() {
  // Fetch questions on server-side
  const { fetchQuestionsFromSheet } = await import('@/lib/sheets')
  const questions = await fetchQuestionsFromSheet()

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <KnowledgeContent initialQuestions={questions} />
    </Suspense>
  )
}
