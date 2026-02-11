import { PublicationItem, PublicationType } from '@/lib/types'
import PublicationListItem from './PublicationListItem'

const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  book: 'Books',
  'peer-reviewed': 'Peer-reviewed articles',
  'book-chapter': 'Book chapters',
  'in-progress': 'In progress',
}

const PUBLICATION_TYPE_ORDER: PublicationType[] = ['book', 'peer-reviewed', 'book-chapter', 'in-progress']

interface PublicationListByTypeProps {
  publications: PublicationItem[]
  showEmptySections?: boolean
}

export default function PublicationListByType({ publications, showEmptySections = false }: PublicationListByTypeProps) {
  const grouped: Partial<Record<PublicationType, PublicationItem[]>> = {}

  for (const type of PUBLICATION_TYPE_ORDER) {
    const items = publications.filter((p) => (p.publicationType || 'in-progress') === type)
    if (items.length > 0 || showEmptySections) {
      grouped[type] = items
    }
  }

  const untyped = publications.filter((p) => !p.publicationType)
  if (untyped.length > 0) {
    grouped['in-progress'] = [...(grouped['in-progress'] || []), ...untyped]
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
