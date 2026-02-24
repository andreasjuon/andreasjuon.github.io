import { PublicationItem, PublicationType } from '@/lib/types'
import PublicationListItem from './PublicationListItem'

const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  book: 'Books',
  'peer-reviewed': 'Peer-reviewed articles',
  'book-chapter': 'Book chapters',
  'in-progress': 'In progress',
}

const PUBLICATION_TYPE_ORDER: PublicationType[] = ['book', 'peer-reviewed', 'book-chapter', 'in-progress']

// Lower rank means higher priority in the list
const STATUS_RANK: Record<string, number> = {
  forthcoming: 0,
  "R&R": 1,
  "under-review": 2,
  "first-draft": 3,
  "in-preparation": 4
};

const DEFAULT_STATUS_RANK = 5

function getYearNumber(p: PublicationItem): number {
  if (p.year) {
    const n = parseInt(p.year, 10)
    if (!Number.isNaN(n)) return n
  }
  if (p.date) {
    const d = new Date(p.date)
    if (!Number.isNaN(d.getTime())) return d.getFullYear()
  }
  return 0
}

function comparePublications(a: PublicationItem, b: PublicationItem): number {
  const rankA = a.status ? STATUS_RANK[a.status] ?? DEFAULT_STATUS_RANK : DEFAULT_STATUS_RANK
  const rankB = b.status ? STATUS_RANK[b.status] ?? DEFAULT_STATUS_RANK : DEFAULT_STATUS_RANK

  if (rankA !== rankB) {
    return rankA - rankB // lower rank first (forthcoming, then under-review, etc.)
  }

  const yearA = getYearNumber(a)
  const yearB = getYearNumber(b)

  if (yearA !== yearB) {
    return yearB - yearA // newer first
  }

  return a.title.localeCompare(b.title)
}

interface PublicationListByTypeProps {
  publications: PublicationItem[]
  showEmptySections?: boolean
}

export default function PublicationListByType({ publications, showEmptySections = false }: PublicationListByTypeProps) {
  const grouped: Partial<Record<PublicationType, PublicationItem[]>> = {}

  for (const type of PUBLICATION_TYPE_ORDER) {
    const items = publications
      .filter((p) => (p.publicationType || 'in-progress') === type)
      .slice()
      .sort(comparePublications)

    if (items.length > 0 || showEmptySections) {
      grouped[type] = items
    }
  }

  const untyped = publications.filter((p) => !p.publicationType)
  if (untyped.length > 0) {
    const existing = grouped['in-progress'] || []
    const merged = [...existing, ...untyped].sort(comparePublications)
    grouped['in-progress'] = merged
  }

  return (
    <div className="space-y-10">
      {PUBLICATION_TYPE_ORDER.map((type) => {
        const items = grouped[type]
        if (!items || items.length === 0) return null

        return (
          <div key={type}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{PUBLICATION_TYPE_LABELS[type]}</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <PublicationListItem key={item.slug} item={item} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

