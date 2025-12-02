import { MetadataRoute } from 'next'
import { fetchQuestionsFromSheet } from '@/lib/sheets'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const questions = await fetchQuestionsFromSheet()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const basePath = '/scaler-knowledge-hub'

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}${basePath}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // Individual question pages
  const questionRoutes = questions.map((question) => ({
    url: `${baseUrl}${basePath}/questions/${question.slug}`,
    lastModified: new Date(question.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...questionRoutes]
}
