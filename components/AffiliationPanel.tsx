import { AffiliationEntry } from '@/lib/types'
import AffiliationTimeline from './AffiliationTimeline'

type AffiliationPanelProps = {
  title: string
  description?: string
  items: AffiliationEntry[]
  minYear: number
  maxYear: number
  minYearOverride?: number
  compactTimeline?: boolean
}

export default function AffiliationPanel({
  title,
  description,
  items,
  minYear,
  maxYear,
  minYearOverride,
  compactTimeline,
}: AffiliationPanelProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-700 text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
      <AffiliationTimeline
        title={title}
        items={items}
        minYear={minYear}
        maxYear={maxYear}
        minYearOverride={minYearOverride}
        compact={compactTimeline}
      />
    </div>
  )
}

