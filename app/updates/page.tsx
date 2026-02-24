import Link from 'next/link'
import { getAllUpdates, PAGE_SIZE_OPTIONS, type UpdateEntry } from '@/lib/updates'
import { INTRO_FRAME_CLASS, CONTENT_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import PageContainer from '@/components/PageContainer'

// Server component: fetch all updates at build time / on the server
export default function UpdatesPage() {
  const allUpdates = getAllUpdates()

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Recent Updates</h1>

        {/* Frame 1: Short intro */}
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <p className="text-lg text-gray-700">
            News and updates from my research and work.
          </p>
        </div>

        {/* Frame 2: Paginated list (client-side pagination) */}
        <div className={`${CONTENT_FRAME_CLASS}`}>
          <UpdatesClient allUpdates={allUpdates} />
        </div>
      </div>
    </PageContainer>
  )
}

interface UpdatesClientProps {
  allUpdates: UpdateEntry[]
}

// Client component handling searchParams and pagination purely on the client
function UpdatesClient({ allUpdates }: UpdatesClientProps) {
  'use client'
  // We intentionally keep this simple: client-side pagination over a static list.
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  )
  const pageParam = searchParams.get('page') || '1'
  const pageSizeParam = searchParams.get('pageSize') || '10'

  const page = Math.max(1, parseInt(pageParam, 10) || 1)
  const pageSize: number | 'all' =
    pageSizeParam === 'all' ? 'all' : Math.max(1, parseInt(pageSizeParam, 10) || 10)

  const total = allUpdates.length
  const effectivePageSize = pageSize === 'all' ? total : pageSize

  let updates: UpdateEntry[] = []
  let totalPages = 1

  if (pageSize === 'all') {
    updates = allUpdates
    totalPages = 1
  } else {
    totalPages = Math.max(1, Math.ceil(total / pageSize))
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    updates = allUpdates.slice(startIndex, endIndex)
  }

  const hasNext = page < totalPages
  const hasPrev = page > 1

  const start = total === 0 ? 0 : (page - 1) * (pageSize === 'all' ? 1 : effectivePageSize) + 1
  const end = pageSize === 'all' ? total : Math.min(page * effectivePageSize, total)

  const buildUrl = (p: number, ps: number | 'all') => {
    const q = new URLSearchParams()
    q.set('page', String(p))
    q.set('pageSize', String(ps))
    return `/updates?${q.toString()}`
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

      {/* Pagination and page size */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Showing {start}-{end} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-gray-600">Show per page:</span>
          <div className="flex gap-2">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <Link
                key={size}
                href={buildUrl(1, size)}
                className={`text-sm px-3 py-1.5 rounded ${
                  pageSize === size
                    ? 'bg-primary-dark text-white font-medium'
                    : 'text-primary-dark hover:underline'
                }`}
              >
                {size}
              </Link>
            ))}
            <Link
              href={buildUrl(1, 'all')}
              className={`text-sm px-3 py-1.5 rounded ${
                pageSize === 'all'
                  ? 'bg-primary-dark text-white font-medium'
                  : 'text-primary-dark hover:underline'
              }`}
            >
              All
            </Link>
          </div>
        </div>
      </div>
      {(hasPrev || hasNext) && pageSize !== 'all' && (
        <div className="mt-4 flex justify-center gap-4">
          {hasPrev && (
            <Link
              href={buildUrl(page - 1, pageSize)}
              className="text-primary-dark hover:underline font-medium"
            >
              ← Previous
            </Link>
          )}
          {hasNext && (
            <Link
              href={buildUrl(page + 1, pageSize)}
              className="text-primary-dark hover:underline font-medium"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  )
}
