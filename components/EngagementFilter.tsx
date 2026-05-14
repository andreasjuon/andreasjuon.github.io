'use client'

import { useState, useMemo } from 'react'
import type { ContentItem, ContentType } from '@/lib/types'
import { getTypeColor } from '@/lib/typeColors'
import ContentList from '@/components/ContentList'

const ENGAGEMENT_TYPES: ContentType[] = [
  'talk',
  'conference-presentation',
  'media',
  'teaching',
  'organized-workshop',
]

const TYPE_LABELS: Record<ContentType, string> = {
  project: 'Projects',
  publication: 'Publications',
  dataset: 'Datasets',
  tool: 'Tools',
  talk: 'Public Talks',
  media: 'Media Appearances',
  'conference-presentation': 'Conference Presentations',
  teaching: 'Teaching',
  'organized-workshop': 'Organized Workshops',
}

const PAGE_SIZE = 10

interface EngagementFilterProps {
  items: ContentItem[]
}

export default function EngagementFilter({ items }: EngagementFilterProps) {
  const [activeTypes, setActiveTypes] = useState<Set<ContentType>>(
    new Set(ENGAGEMENT_TYPES)
  )
  const [page, setPage] = useState(1)

  function toggleType(type: ContentType) {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        if (next.size === 1) return prev // keep at least one active
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
    setPage(1)
  }

  function selectAll() {
    setActiveTypes(new Set(ENGAGEMENT_TYPES))
    setPage(1)
  }

  const filtered = useMemo(
    () => items.filter((item) => activeTypes.has(item.type as ContentType)),
    [items, activeTypes]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const allActive = activeTypes.size === ENGAGEMENT_TYPES.length

  // Only show types that have at least one item
  const typesWithItems = ENGAGEMENT_TYPES.filter((t) =>
    items.some((item) => item.type === t)
  )

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={selectAll}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            allActive
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
          }`}
        >
          All
        </button>
        {typesWithItems.map((type) => {
          const active = activeTypes.has(type)
          const color = getTypeColor(type)
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={{
                backgroundColor: active ? color : 'white',
                borderColor: color,
                color: active ? 'white' : color,
              }}
            >
              {TYPE_LABELS[type]}
            </button>
          )
        })}
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length === 0
          ? 'No items match the selected categories.'
          : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} items`}
      </p>

      {/* List */}
      {pageItems.length > 0 ? (
        <ContentList items={pageItems} />
      ) : (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <p className="text-gray-600">No items match the selected categories.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded border text-sm font-medium transition-colors ${
                p === currentPage
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
