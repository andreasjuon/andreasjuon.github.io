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

/** Publication type for grouping on Research page */
export const PublicationTypeSchema = z.enum(['book', 'peer-reviewed', 'book-chapter', 'in-progress'])
export type PublicationType = z.infer<typeof PublicationTypeSchema>

/** Publication status when not yet published */
export const PublicationStatusSchema = z.enum(['R&R','forthcoming', 'under-review', 'first-draft', 'in-preparation'])
export type PublicationStatus = z.infer<typeof PublicationStatusSchema>

/** Publication-specific links (subtle, accessible) */
export const PublicationLinksSchema = z.object({
  description: z.string().optional(),
  pdf: z.string().optional(),
  supplementary: z.string().optional(),
  doi: z.string().optional(),
}).optional()

export type PublicationLinks = z.infer<typeof PublicationLinksSchema>

/**
 * Schema for validating MDX frontmatter at build time.
 * `type`, `slug`, and `content` are injected by the content loader,
 * so they are not required in the frontmatter itself.
 * Publication-specific fields are optional for backward compatibility.
 */
export const ContentFrontmatterSchema = z.object({
  title: z.string({ error: 'Frontmatter field "title" is required' }),
  summary: z.string({ error: 'Frontmatter field "summary" is required' }),
  tags: z.array(z.string(), { error: 'Frontmatter field "tags" is required' }),
  previewImage: z.string({ error: 'Frontmatter field "previewImage" is required' }),
  date: z.string().optional(),
  externalLinks: ExternalLinksSchema,
  relatedItems: z.array(z.string()).optional(),
  // Publication-specific optional fields
  publicationType: PublicationTypeSchema.optional(),
  authors: z.array(z.string()).optional(),
  year: z.string().optional(),
  status: PublicationStatusSchema.optional(),
  relatedProjects: z.array(z.string()).optional(),
  relatedDatasets: z.array(z.string()).optional(),
  publicationLinks: PublicationLinksSchema.optional(),
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

/** ContentItem with type=publication; includes publication-specific fields */
export type PublicationItem = ContentItem & {
  type: "publication";
  publicationType?: PublicationType;
  authors?: string[];
  year?: string;
  status?: PublicationStatus;
  publisher?: string;
  journal?: string;
  relatedProjects?: string[];
  relatedDatasets?: string[];
  publicationLinks?: PublicationLinks;
};
