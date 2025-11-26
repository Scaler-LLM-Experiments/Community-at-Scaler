export interface Question {
  _id: string
  title: string
  slug: string
  body?: string | any[]
  category: string
  tags: string[]
  answer?: Answer
  upvotes: number
  downvotes: number
  publishedAt: string
  excerpt?: string
}

export interface Answer {
  body: string | any[]
  resources?: Resource[]
}

export interface Resource {
  title: string
  url: string
}

export interface Vote {
  userId: string
  questionId: string
  voteType: 'up' | 'down'
}

export const CATEGORIES: Record<string, string> = {
  'career': 'All Questions',
  'fees': 'Fees & Investment',
  'placements': 'Placements & Jobs',
  'curriculum': 'Curriculum & Learning',
  'reviews': 'Reviews & Testimonials',
  'eligibility': 'Eligibility & Requirements',
  'comparison': 'Comparisons',
}
