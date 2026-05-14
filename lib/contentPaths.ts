/**
 * Client-safe content path utilities.
 * No Node.js imports (fs, path) - safe to use in 'use client' components.
 */
import type { ContentType } from './types'

/**
 * Maps content type to its plural URL segment.
 * Most types just append 's', but 'media' is already plural.
 */
export const typeToUrlSegment: Record<ContentType, string> = {
  project: 'projects',
  publication: 'publications',
  dataset: 'datasets',
  tool: 'tools',
  talk: 'talks',
  media: 'media',
  'conference-presentation': 'conference-presentations',
  teaching: 'teaching',
  'organized-workshop': 'organized-workshops',
}

/**
 * Maps content type to the list page where that type is shown.
 * Used for "Back to …" links (list pages are not always at /typeSegment).
 */
export const typeToListPath: Record<ContentType, string> = {
  project: '/research',
  publication: '/research',
  dataset: '/data',
  tool: '/tools',
  talk: '/engagement',
  media: '/engagement',
  'conference-presentation': '/engagement',
  teaching: '/engagement',
  'organized-workshop': '/engagement',
}

/** Returns the URL path for a content item (e.g. /projects/slug or /media/slug) */
export function getContentHref(type: ContentType, slug: string): string {
  return `/${typeToUrlSegment[type]}/${slug}`
}
