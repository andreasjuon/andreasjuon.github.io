/**
 * Recent updates / news entries.
 * Placeholder data for now; can be replaced with MDX or CMS later.
 */
export interface UpdateEntry {
  id: string
  date: string
  title: string
  summary?: string
  href?: string
}

const PLACEHOLDER_UPDATES: UpdateEntry[] = [
  { id: '1', date: '2024-06-15', title: 'New publication accepted', summary: 'Peer-reviewed article on power-sharing institutions accepted for publication.', href: '/publications/power-sharing-2023/' },
  { id: '2', date: '2024-05-20', title: 'Conference presentation delivered', summary: 'Presented research on dominant nationalism at annual conference.', href: '/talks/nationalism-conference-2024/' },
  { id: '3', date: '2024-04-10', title: 'Dataset released', summary: 'Power-sharing institutions dataset now available for researchers.', href: '/datasets/power-sharing-dataset/' },
  { id: '4', date: '2024-03-01', title: 'Reflections on power-sharing research', summary: 'Thoughts on methodological challenges and future directions.' },
  { id: '5', date: '2024-02-15', title: 'Research dashboard updated', summary: 'New visualization features added to the interactive dashboard.', href: '/tools/research-dashboard/' },
  { id: '6', date: '2024-01-20', title: 'Media interview published', summary: 'Discussion of recent findings on power-sharing and democratic stability.', href: '/media/interview-2024/' },
  { id: '7', date: '2024-01-05', title: 'Collaboration with international team', summary: 'Beginning work on comparative power-sharing analysis.' },
  { id: '8', date: '2023-12-10', title: 'Methodology notes: fixed-effects models', summary: 'Technical write-up on regression approaches used in recent work.' },
  { id: '9', date: '2023-11-22', title: 'Manuscript under review', summary: 'New article on territorial power-sharing submitted to journal.' },
  { id: '10', date: '2023-10-15', title: 'Workshop participation', summary: 'Contributed to methods workshop on quantitative conflict research.' },
]

export function getRecentUpdates(limit = 10): UpdateEntry[] {
  return PLACEHOLDER_UPDATES.slice(0, limit)
}

export function getAllUpdates(): UpdateEntry[] {
  return [...PLACEHOLDER_UPDATES]
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
