import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

/**
 * Recent updates / news entries loaded from MDX files in content/updates.
 */
export interface UpdateEntry {
  id: string
  date: string
  title: string
  summary?: string
  href?: string
}

const UpdateEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  href: z.string().optional(),
})

const updatesDirectory = path.join(process.cwd(), 'content', 'updates')

let _cachedAllUpdates: UpdateEntry[] | null = null

function parseUpdatesFromFile(filePath: string): UpdateEntry[] {
  const fileContents = fs.readFileSync(filePath, 'utf8')

  // Strip frontmatter so we can safely search the remaining MDX/JS content
  const { content } = matter(fileContents)

  // Look for a top-level `export const updates = [...]` array in the MDX body
  const exportMatch = content.match(
    /export\s+const\s+updates\s*=\s*(\[[\s\S]*?\]);?/m
  )
  if (!exportMatch) {
    return []
  }

  const arraySource = exportMatch[1]

  try {
    // Evaluate the array literal in a sandboxed function scope.
    // The MDX files are part of the repo, so this is trusted input.
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return ${arraySource}`) as () => unknown
    const raw = fn()
    if (!Array.isArray(raw)) {
      return []
    }

    const parsed: UpdateEntry[] = []
    for (const item of raw) {
      const result = UpdateEntrySchema.safeParse(item)
      if (!result.success) continue
      parsed.push(result.data)
    }
    return parsed
  } catch {
    return []
  }
}

function loadAllUpdatesFromDisk(): UpdateEntry[] {
  if (_cachedAllUpdates) return _cachedAllUpdates

  if (!fs.existsSync(updatesDirectory)) {
    _cachedAllUpdates = []
    return _cachedAllUpdates
  }

  const files = fs.readdirSync(updatesDirectory)
  const all: UpdateEntry[] = []

  for (const filename of files) {
    if (!filename.match(/\.mdx?$/)) continue
    const filePath = path.join(updatesDirectory, filename)
    const updates = parseUpdatesFromFile(filePath)
    all.push(...updates)
  }

  // Sort by date descending (newest first). Invalid dates fall to the end.
  all.sort((a, b) => {
    const aTime = Date.parse(a.date)
    const bTime = Date.parse(b.date)
    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0
    if (Number.isNaN(aTime)) return 1
    if (Number.isNaN(bTime)) return -1
    return bTime - aTime
  })

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/10613f17-857b-46af-94cd-2be4ef75b626', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': 'c68d74',
    },
    body: JSON.stringify({
      sessionId: 'c68d74',
      runId: 'post-fix-1',
      hypothesisId: 'H1',
      location: 'lib/updates.ts:loadAllUpdatesFromDisk',
      message: 'Loaded updates from MDX files',
      data: { total: all.length },
      timestamp: Date.now(),
    }),
  }).catch(() => {})
  // #endregion agent log

  _cachedAllUpdates = all
  return _cachedAllUpdates
}

export function getAllUpdates(): UpdateEntry[] {
  return loadAllUpdatesFromDisk()
}

export function getRecentUpdates(limit = 10): UpdateEntry[] {
  return getAllUpdates().slice(0, limit)
}

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export function getUpdatesPaginated(page: number, pageSize: number | 'all'): {
  updates: UpdateEntry[]
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
} {
  const all = getAllUpdates()
  const total = all.length
  if (pageSize === 'all' || pageSize >= total) {
    return { updates: all, total, totalPages: 1, hasNext: false, hasPrev: false }
  }
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const updates = all.slice(start, end)
  return {
    updates,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
