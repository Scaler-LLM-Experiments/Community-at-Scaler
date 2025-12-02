import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const basePath = '/scaler-knowledge-hub'

  return {
    rules: {
      userAgent: '*',
      allow: basePath + '/',
      disallow: [basePath + '/api/'],
    },
    sitemap: `${baseUrl}${basePath}/sitemap.xml`,
  }
}
