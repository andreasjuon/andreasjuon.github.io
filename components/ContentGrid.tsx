import { ContentItem } from '@/lib/types'
import ContentTile from './ContentTile'

interface ContentGridProps {
  items: ContentItem[]
  columns?: 1 | 2 | 3 | 4
}

const columnClassMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export default function ContentGrid({ items, columns }: ContentGridProps) {
  const gridColsClass = columnClassMap[columns ?? 3]

  return (
    <div className={`grid ${gridColsClass} gap-6`}>
      {items.map((item) => (
        <ContentTile key={`${item.type}-${item.slug}`} item={item} />
      ))}
    </div>
  )
}
