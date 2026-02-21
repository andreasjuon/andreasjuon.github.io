import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ContentItem, ContentType, ContentFrontmatterSchema, PublicationItem, PublicationType } from './types'
import { typeToUrlSegment } from './contentPaths'

// Re-export for server-side consumers (sitemap, ContentDetail, etc.)
export { typeToUrlSegment, typeToListPath, getContentHref } from './contentPaths'

/** Display order for publication types on Research page */
const PUBLICATION_TYPE_ORDER: PublicationType[] = ['book', 'peer-reviewed', 'book-chapter', 'in-progress']

const contentDirectory = path.join(process.cwd(), 'content')

function getContentDirectory(type: ContentType): string {
  return path.join(contentDirectory, typeToUrlSegment[type])
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, '')
}

/**
 * Validate frontmatter against the Zod schema.
 * Throws a descriptive error at build time if required fields are missing.
 */
function validateFrontmatter(data: Record<string, unknown>, filePath: string): void {
  const result = ContentFrontmatterSchema.safeParse(data)
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(
      `Invalid frontmatter in ${filePath}:\n${errors}`
    )
  }
}

// Build-time cache: content is read from disk once and reused across
// all calls within the same build process.
let _cachedAllItems: ContentItem[] | null = null

export function getAllContentItems(): ContentItem[] {
  if (_cachedAllItems) return _cachedAllItems

  const allItems: ContentItem[] = []
  const types: ContentType[] = ['project', 'publication', 'dataset', 'tool', 'talk', 'media']

  types.forEach((type) => {
    const typeDir = getContentDirectory(type)
    if (!fs.existsSync(typeDir)) return

    const files = fs.readdirSync(typeDir)
    files.forEach((filename) => {
      if (!filename.match(/\.mdx?$/)) return

      const filePath = path.join(typeDir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      validateFrontmatter(data, filePath)

      const slug = getSlugFromFilename(filename)

      allItems.push({
        ...data,
        type,
        slug: (data.slug as string) || slug,
        content,
      } as ContentItem)
    })
  })

  // Sort by date if available, newest first
  _cachedAllItems = allItems.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return _cachedAllItems
}

export function getContentByType(type: ContentType): ContentItem[] {
  return getAllContentItems().filter((item) => item.type === type)
}

export function getContentBySlug(type: ContentType, slug: string): ContentItem | null {
  const typeDir = getContentDirectory(type)
  if (!fs.existsSync(typeDir)) return null

  const files = fs.readdirSync(typeDir)
  
  const file = files.find((f) => getSlugFromFilename(f) === slug)
  if (!file) return null

  const filePath = path.join(typeDir, file)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  validateFrontmatter(data, filePath)

  return {
    ...data,
    type,
    slug,
    content,
  } as ContentItem
}

export function getRelatedItems(item: ContentItem): ContentItem[] {
  if (!item.relatedItems || item.relatedItems.length === 0) return []

  const allItems = getAllContentItems()
  const related: ContentItem[] = []

  item.relatedItems.forEach((slug) => {
    // Try to find item by slug across all types
    const found = allItems.find((i) => i.slug === slug)
    if (found) {
      related.push(found)
    }
  })

  return related
}

export function getAllSlugs(type: ContentType): string[] {
  const typeDir = getContentDirectory(type)
  if (!fs.existsSync(typeDir)) return []

  const files = fs.readdirSync(typeDir)
  return files
    .filter((filename) => filename.match(/\.mdx?$/))
    .map((filename) => getSlugFromFilename(filename))
}

/** Publications linked to a specific project (by relatedProjects or relatedItems for backward compat) */
export function getPublicationsByProject(projectSlug: string): PublicationItem[] {
  const publications = getContentByType('publication') as PublicationItem[]
  return publications.filter((p) => {
    if (p.relatedProjects?.includes(projectSlug)) return true
    if (p.relatedItems?.includes(projectSlug)) return true
    return false
  })
}

/** Publications grouped by type in display order. Empty groups omitted from keys. */
export function getPublicationsGroupedByType(): Partial<Record<PublicationType, PublicationItem[]>> {
  const publications = getContentByType('publication') as PublicationItem[]
  const grouped: Partial<Record<PublicationType, PublicationItem[]>> = {}

  for (const type of PUBLICATION_TYPE_ORDER) {
    const items = publications.filter(
      (p) => (p.publicationType || 'in-progress') === type
    )
    if (items.length > 0) {
      grouped[type] = items
    }
  }

  // Items without publicationType go to 'in-progress'
  const untyped = publications.filter((p) => !p.publicationType)
  if (untyped.length > 0) {
    grouped['in-progress'] = [...(grouped['in-progress'] || []), ...untyped]
  }

  return grouped
}
