import { z } from 'zod'

export const ContentTypeSchema = z.enum(['project', 'publication', 'dataset', 'tool', 'talk', 'media', 'conference-presentation', 'teaching', 'organized-workshop'])
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
export const PublicationStatusSchema = z.enum([
  "R&R",
  "forthcoming",
  "conditionally-accepted",
  "under-review",
  "first-draft",
  "in-preparation",
]);
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
 * Affiliations (employment / education) timeline data.
 * Loaded from a dedicated MDX file, validated with Zod.
 */
export const AffiliationEntrySchema = z.object({
  institution: z.string(),
  // Full date precision for positioning on the timeline
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  logo: z.string().optional(),
  url: z.string().optional(),
  // Optional descriptive fields depending on category
  role: z.string().optional(),
  degree: z.string().optional(),
  field: z.string().optional(),
  // Optional rich details used in hover/tap tooltips
  details: z.string().optional(),
  detailsPoints: z.array(z.string()).optional(),
})

export type AffiliationEntry = z.infer<typeof AffiliationEntrySchema>

export const AffiliationsFrontmatterSchema = z.object({
  dataType: z.literal('affiliations'),
  employment: z.array(AffiliationEntrySchema).default([]),
  education: z.array(AffiliationEntrySchema).default([]),
})

export type AffiliationsFrontmatter = z.infer<typeof AffiliationsFrontmatterSchema>

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
  subtype: z.string().optional(),
  featured: z.number().optional(),
  // Publication-specific optional fields
  publicationType: PublicationTypeSchema.optional(),
  authors: z.array(z.string()).optional(),
  year: z.string().optional(),
  booktitle: z.string().optional(),
  status: PublicationStatusSchema.optional(),
  volume: z.string().optional(),
  number: z.string().optional(),
  editors: z.array(z.string()).optional(),
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
  booktitle?: string;
  year?: string;
  status?: PublicationStatus;
  publisher?: string;
  journal?: string;
  volume?: string;
  number?: string;
  editors?: string[];
  relatedProjects?: string[];
  relatedDatasets?: string[];
  publicationLinks?: PublicationLinks;
};
