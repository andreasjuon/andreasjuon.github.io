'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { UpdateEntry } from '@/lib/updates'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

interface Props {
  allUpdates: UpdateEntry[]
}

export default function UpdatesPaginated({ allUpdates }: Props) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number | 'all'>(10)

  const total = allUpdates.length

  let updates: UpdateEntry[]
  let totalPages: number

  if (pageSize === 'all') {
    updates = allUpdates
    totalPages = 1
  } else {
    totalPages = Math.max(1, Math.ceil(total / pageSize))
    const clampedPage = Math.min(page, totalPages)
    const startIndex = (clampedPage - 1) * pageSize
    updates = allUpdates.slice(startIndex, startIndex + pageSize)
  }

  const currentPage = pageSize === 'all' ? 1 : Math.min(page, totalPages)
  const hasNext = currentPage < totalPages
  const hasPrev = currentPage > 1
  const effectivePageSize = pageSize === 'all' ? total : pageSize
  const start = total === 0 ? 0 : (currentPage - 1) * effectivePageSize + 1
  const end = pageSize === 'all' ? total : Math.min(currentPage * effectivePageSize, total)

  function changePageSize(size: number | 'all') {
    setPageSize(size)
    setPage(1)
  }

  return (
    <>
      <div className="space-y-4">
        {updates.map((entry) => {
          const content = (
            <>
              <span className="text-xs text-gray-500 block mb-0.5">{entry.date}</span>
              <span className="text-sm font-medium text-gray-900 block">{entry.title}</span>
              {entry.summary && (
                <span className="text-xs text-gray-600 block mt-1">{entry.summary}</span>
              )}
            </>
          )
          if (entry.href) {
            return (
              <Link
                key={entry.id}
                href={entry.href}
                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                {content}
              </Link>
            )
          }
          return (
            <div
              key={entry.id}
              className="block p-3 rounded-lg border-b border-gray-100 last:border-0"
            >
              {content}
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Showing {start}–{end} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-gray-600">Show per page:</span>
          <div className="flex gap-2">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => changePageSize(size)}
                className={`text-sm px-3 py-1.5 rounded ${
                  pageSize === size
                    ? 'bg-primary-dark text-white font-medium'
                    : 'text-primary-dark hover:underline'
                }`}
              >
                {size}
              </button>
            ))}
            <button
              onClick={() => changePageSize('all')}
              className={`text-sm px-3 py-1.5 rounded ${
                pageSize === 'all'
                  ? 'bg-primary-dark text-white font-medium'
                  : 'text-primary-dark hover:underline'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {(hasPrev || hasNext) && pageSize !== 'all' && (
        <div className="mt-4 flex justify-center gap-4">
          {hasPrev && (
            <button
              onClick={() => setPage((p) => p - 1)}
              className="text-primary-dark hover:underline font-medium"
            >
              ← Previous
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="text-primary-dark hover:underline font-medium"
            >
              Next →
            </button>
          )}
        </div>
      )}
    </>
  )
}
