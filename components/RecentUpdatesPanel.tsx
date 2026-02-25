import Link from 'next/link'
import { getRecentUpdates } from '@/lib/updates'

interface RecentUpdatesPanelProps {
  limit?: number
  className?: string
}

export default function RecentUpdatesPanel({ limit = 10, className = '' }: RecentUpdatesPanelProps) {
  const updates = getRecentUpdates(limit)

  return (
    <>
      {/* Stacked view: collapsed by default, expandable (same threshold as grid stack) */}
      <div className={`bg-white rounded-lg shadow-card p-6 2xl:hidden ${className}`}>
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <span className="text-lg font-semibold text-gray-900">
              Recent Updates
            </span>
            <span className="ml-2 text-base text-gray-500 transition-transform group-open:-rotate-180">
              ▾
            </span>
          </summary>

          <div className="mt-4 space-y-4">
            {updates.map((entry) => {
              const content = (
                <>
                  <span className="text-xs text-gray-500 block mb-0.5">
                    {entry.date}
                  </span>
                  <span className="text-sm font-medium text-gray-900 block">
                    {entry.title}
                  </span>
                  {entry.summary && (
                    <span className="text-xs text-gray-600 block mt-1 line-clamp-2">
                      {entry.summary}
                    </span>
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

          <Link
            href="/updates"
            className="mt-4 pt-4 border-t border-gray-100 text-primary-dark hover:underline text-sm font-medium inline-block"
          >
            View all updates
          </Link>
        </details>
      </div>

      {/* Side-by-side view: always-visible sidebar with scrollable list */}
      <div className={`hidden 2xl:flex bg-white rounded-lg shadow-card p-6 2xl:flex-col 2xl:h-full 2xl:min-h-0 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Recent Updates</h3>

        <div className="2xl:flex-1 2xl:overflow-y-auto 2xl:min-h-0 space-y-4 pr-1">
          {updates.map((entry) => {
            const content = (
              <>
                <span className="text-xs text-gray-500 block mb-0.5">
                  {entry.date}
                </span>
                <span className="text-sm font-medium text-gray-900 block">
                  {entry.title}
                </span>
                {entry.summary && (
                  <span className="text-xs text-gray-600 block mt-1 line-clamp-2">
                    {entry.summary}
                  </span>
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
        
        <Link
          href="/updates"
          className="flex-shrink-0 mt-4 pt-4 border-t border-gray-100 text-primary-dark hover:underline text-sm font-medium"
        >
          View all updates
        </Link>
      </div>
    </>
  )
}
