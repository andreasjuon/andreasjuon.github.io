import { ContentItem } from '@/lib/types'
import ContentListItem from './ContentListItem'

interface ContentListProps {
  items: ContentItem[]
  imagePosition?: 'left' | 'right'
}

export default function ContentList({ items, imagePosition = 'left' }: ContentListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ContentListItem
          key={`${item.type}-${item.slug}`}
          item={item}
          imagePosition={imagePosition}
        />
      ))}
    </div>
  )
}
