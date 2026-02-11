import { ContentItem } from './types'
import { siteConfig } from './siteConfig'
import type { Metadata } from 'next'

const siteUrl = siteConfig.url
const siteName = siteConfig.name
const defaultDescription = siteConfig.description

export function generatePageMetadata(
  title: string,
  description?: string,
  image?: string,
  path?: string
): Metadata {
  const fullTitle = `${title} - ${siteName}`
  const fullDescription = description || defaultDescription
  const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : undefined
  const url = path ? `${siteUrl}${path}` : siteUrl

  return {
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName,
      images: imageUrl ? [{ url: imageUrl }] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export function generateContentMetadata(item: ContentItem, path: string): Metadata {
  return generatePageMetadata(item.title, item.summary, item.previewImage, path)
}
