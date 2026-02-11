import { z } from 'zod'

export const ContentTypeSchema = z.enum(['project', 'publication', 'dataset', 'tool', 'talk', 'media'])
export type ContentType = z.infer<typeof ContentTypeSchema>

export const ExternalLinksSchema = z.object({
  paper: z.string().optional(),
  code: z.string().optional(),
  data: z.string().optional(),
  demo: z.string().optional(),
  website: z.string().optional(),
}).optional()

export type ExternalLinks = z.infer<typeof ExternalLinksSchema>

/**
 * Schema for validating MDX frontmatter at build time.
 * `type`, `slug`, and `content` are injected by the content loader,
 * so they are not required in the frontmatter itself.
 */
export const ContentFrontmatterSchema = z.object({
  title: z.string({ error: 'Frontmatter field "title" is required' }),
  summary: z.string({ error: 'Frontmatter field "summary" is required' }),
  tags: z.array(z.string(), { error: 'Frontmatter field "tags" is required' }),
  previewImage: z.string({ error: 'Frontmatter field "previewImage" is required' }),
  date: z.string().optional(),
  externalLinks: ExternalLinksSchema,
  relatedItems: z.array(z.string()).optional(),
})

/**
 * Full ContentItem schema including fields injected by the content loader.
 */
export const ContentItemSchema = ContentFrontmatterSchema.extend({
  type: ContentTypeSchema,
  slug: z.string(),
  content: z.string().optional(),
})

export type ContentItem = z.infer<typeof ContentItemSchema>
