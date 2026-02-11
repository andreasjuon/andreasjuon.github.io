import fs from 'fs'
import path from 'path'
import { load } from 'cheerio'

// Simple slugify helper
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  return await res.text()
}

interface Frontmatter {
  title: string
  summary: string
  tags: string[]
  previewImage: string
  date?: string
  externalLinks?: Record<string, string>
  relatedItems?: string[]
  publicationType?: string
  authors?: string[]
  year?: string
  status?: string
  relatedProjects?: string[]
  relatedDatasets?: string[]
  publicationLinks?: Record<string, string>
}

function toFrontmatterBlock(data: Frontmatter & { type: string; slug: string }): string {
  const yamlLines: string[] = []
  yamlLines.push('---')
  yamlLines.push(`slug: ${data.slug}`)
  yamlLines.push(`title: "${data.title.replace(/"/g, '\\"')}"`)
  yamlLines.push(`type: ${data.type}`)
  yamlLines.push(`summary: "${data.summary.replace(/"/g, '\\"')}"`)
  yamlLines.push(`previewImage: "${data.previewImage}"`)
  if (data.date) yamlLines.push(`date: "${data.date}"`)
  if (data.tags?.length) {
    yamlLines.push('tags:')
    for (const tag of data.tags) {
      yamlLines.push(`  - "${tag.replace(/"/g, '\\"')}"`)
    }
  } else {
    yamlLines.push('tags: []')
  }
  if (data.publicationType) yamlLines.push(`publicationType: ${data.publicationType}`)
  if (data.year) yamlLines.push(`year: "${data.year}"`)
  if (data.status) yamlLines.push(`status: ${data.status}`)
  if (data.authors?.length) {
    yamlLines.push('authors:')
    for (const author of data.authors) {
      yamlLines.push(`  - "${author.replace(/"/g, '\\"')}"`)
    }
  }
  if (data.publicationLinks && Object.keys(data.publicationLinks).length > 0) {
    yamlLines.push('publicationLinks:')
    for (const [key, value] of Object.entries(data.publicationLinks)) {
      yamlLines.push(`  ${key}: "${value.replace(/"/g, '\\"')}"`)
    }
  }
  if (data.externalLinks && Object.keys(data.externalLinks).length > 0) {
    yamlLines.push('externalLinks:')
    for (const [key, value] of Object.entries(data.externalLinks)) {
      yamlLines.push(`  ${key}: "${value.replace(/"/g, '\\"')}"`)
    }
  }
  yamlLines.push('---')
  return yamlLines.join('\n')
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// --- Publications ---

async function importPublications() {
  const url = 'https://andreasjuon.com/publications/'
  console.log(`Fetching publications from ${url}`)
  const html = await fetchHtml(url)
  const $ = load(html)

  const contentDir = path.join(process.cwd(), 'content', 'publications')
  ensureDir(contentDir)

  // Very simple heuristic: look for strong headings followed by paragraphs
  // Each bold title line and the following citation/link lines are grouped.
  const sections: { title: string; lines: string[] }[] = []

  $('h2, h3, strong').each((_, el) => {
    const text = $(el).text().trim()
    if (!text) return
    const parent = $(el).parent()
    const following: string[] = []
    parent.nextAll('p').each((__, p) => {
      const t = $(p).text().trim()
      if (!t) return
      // Stop if we hit a new major heading
      if ($(p).find('strong').length > 0) return false
      following.push(t)
      return
    })
    if (following.length > 0) {
      sections.push({ title: text, lines: following })
    }
  })

  console.log(`Discovered ${sections.length} candidate publication sections`)

  for (const section of sections) {
    const slug = slugify(section.title)
    const filePath = path.join(contentDir, `${slug}.mdx`)
    if (fs.existsSync(filePath)) {
      console.log(`Skipping existing publication: ${slug}`)
      continue
    }

    const citationLine = section.lines[0] || ''
    const linkLine = section.lines.find((l) => l.includes('PDF') || l.includes('Description') || l.includes('DOI')) || ''

    // Very rough year + authors parsing
    const yearMatch = citationLine.match(/(19|20)\\d{2}/)
    const year = yearMatch ? yearMatch[0] : undefined

    const authors: string[] = []
    const beforeYear = year ? citationLine.split(year)[0] : citationLine
    if (beforeYear) {
      // split on & and commas, keep non-empty
      beforeYear
        .split(/&|and/gi)[0]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((a) => authors.push(a))
    }

    const publicationLinks: Record<string, string> = {}
    if (linkLine) {
      const anchors = $(`a:contains("Description"), a:contains("PDF"), a:contains("Supplement"), a:contains("DOI")`)
      anchors.each((_, a) => {
        const label = $(a).text().trim().toLowerCase()
        const href = $(a).attr('href')
        if (!href) return
        if (label.includes('description')) publicationLinks.description = href
        else if (label.includes('pdf')) publicationLinks.pdf = href
        else if (label.includes('supplement')) publicationLinks.supplementary = href
        else if (label.includes('doi')) publicationLinks.doi = href
      })
    }

    const fm: Frontmatter & { type: string; slug: string } = {
      type: 'publication',
      slug,
      title: section.title,
      summary: citationLine || `Auto-imported publication from ${url}`,
      tags: ['publication'],
      previewImage: '/images/publications/default.jpg',
      year,
      authors: authors.length ? authors : undefined,
      publicationLinks: Object.keys(publicationLinks).length ? publicationLinks : undefined,
    }

    const fmBlock = toFrontmatterBlock(fm)
    const body = `\n\nAuto-imported from ${url}.\n\nOriginal citation:\n\n${citationLine}\n`

    fs.writeFileSync(filePath, `${fmBlock}${body}`, 'utf8')
    console.log(`Wrote publication: ${filePath}`)
  }
}

async function main() {
  try {
    await importPublications()
    console.log('Import completed.')
  } catch (err) {
    console.error('Import failed:', err)
    process.exitCode = 1
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()

