/**
 * Build-time content validation script.
 *
 * Checks for:
 * - Frontmatter schema violations (via Zod)
 * - Placeholder / dummy content markers
 * - Broken previewImage paths (files missing from public/)
 * - Broken relatedItems slugs (referencing non-existent content)
 *
 * Run: npx tsx scripts/validate-content.ts
 * Exits with code 1 if any errors are found.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { typeToUrlSegment } from '../lib/content'
import { ContentFrontmatterSchema, ContentType } from '../lib/types'

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const PUBLIC_DIR = path.join(ROOT, 'public')

const CONTENT_TYPES: ContentType[] = ['project', 'publication', 'dataset', 'tool', 'talk', 'media']

// Markers that indicate placeholder content that should not ship to production
const PLACEHOLDER_PATTERNS = [
  /YOUR_ID/,
  /example\.com/,
  /\[Your\s/,
  /will go here/i,
  /will be embedded here/i,
  /\[Citation information\]/,
  /\[X\]\s*countries/,
  /\[Y\]\s*years/,
]

interface ValidationError {
  file: string
  message: string
}

const errors: ValidationError[] = []
const allSlugs = new Set<string>()
const allRelatedRefs: { file: string; slug: string }[] = []

function validateFile(filePath: string, type: ContentType) {
  const relativePath = path.relative(ROOT, filePath)

  let fileContents: string
  try {
    fileContents = fs.readFileSync(filePath, 'utf8')
  } catch {
    errors.push({ file: relativePath, message: 'Could not read file' })
    return
  }

  let data: Record<string, unknown>
  let content: string
  try {
    const parsed = matter(fileContents)
    data = parsed.data
    content = parsed.content
  } catch (e) {
    errors.push({ file: relativePath, message: `Frontmatter parse error: ${e}` })
    return
  }

  // 1. Validate frontmatter schema
  const result = ContentFrontmatterSchema.safeParse(data)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push({
        file: relativePath,
        message: `Frontmatter: ${issue.path.join('.')} - ${issue.message}`,
      })
    }
  }

  // 2. Check for placeholder content in frontmatter values and body
  const fullText = JSON.stringify(data) + '\n' + content
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(fullText)) {
      errors.push({
        file: relativePath,
        message: `Contains placeholder content matching: ${pattern.source}`,
      })
    }
  }

  // 3. Validate previewImage path exists in public/
  const previewImage = data.previewImage as string | undefined
  if (previewImage && previewImage.startsWith('/')) {
    const imagePath = path.join(PUBLIC_DIR, previewImage)
    if (!fs.existsSync(imagePath)) {
      errors.push({
        file: relativePath,
        message: `previewImage "${previewImage}" not found in public/`,
      })
    }
  }

  // 4. Collect slugs and relatedItems for cross-reference validation
  const slug = (data.slug as string) || path.basename(filePath).replace(/\.mdx?$/, '')
  allSlugs.add(slug)

  const relatedItems = data.relatedItems as string[] | undefined
  if (relatedItems && Array.isArray(relatedItems)) {
    for (const ref of relatedItems) {
      allRelatedRefs.push({ file: relativePath, slug: ref })
    }
  }
}

// Scan all content files
for (const type of CONTENT_TYPES) {
  const typeDir = path.join(CONTENT_DIR, typeToUrlSegment[type])
  if (!fs.existsSync(typeDir)) continue

  const files = fs.readdirSync(typeDir).filter((f) => /\.mdx?$/.test(f))
  for (const file of files) {
    validateFile(path.join(typeDir, file), type)
  }
}

// 5. Validate relatedItems cross-references
for (const ref of allRelatedRefs) {
  if (!allSlugs.has(ref.slug)) {
    errors.push({
      file: ref.file,
      message: `relatedItems slug "${ref.slug}" does not match any content file`,
    })
  }
}

// Also scan static pages for placeholder markers
const STATIC_PAGE_GLOBS = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/consulting/page.tsx',
  'app/research/page.tsx',
  'app/data/page.tsx',
  'app/engagement/page.tsx',
  'app/tools/page.tsx',
  'lib/siteConfig.ts',
]

for (const relPath of STATIC_PAGE_GLOBS) {
  const fullPath = path.join(ROOT, relPath)
  if (!fs.existsSync(fullPath)) continue

  const content = fs.readFileSync(fullPath, 'utf8')
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(content)) {
      errors.push({
        file: relPath,
        message: `Contains placeholder content matching: ${pattern.source}`,
      })
    }
  }
}

// Report results
if (errors.length > 0) {
  console.error(`\n❌ Content validation failed with ${errors.length} error(s):\n`)
  for (const err of errors) {
    console.error(`  ${err.file}: ${err.message}`)
  }
  console.error('')
  process.exit(1)
} else {
  console.log('✅ Content validation passed — no issues found.')
}
