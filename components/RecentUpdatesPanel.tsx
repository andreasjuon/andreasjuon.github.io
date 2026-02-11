import Link from 'next/link'
import { getRecentUpdates } from '@/lib/updates'

interface RecentUpdatesPanelProps {
  limit?: number
  className?: string
}

export default function RecentUpdatesPanel({ limit = 10, className = '' }: RecentUpdatesPanelProps) {
  const updates = getRecentUpdates(limit)

  return (
    <div className={`bg-white rounded-lg shadow-card p-6 h-full flex flex-col min-h-0 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Recent Updates</h3>
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
        {updates.map((entry) => {
          const content = (
            <>
              <span className="text-xs text-gray-500 block mb-0.5">{entry.date}</span>
              <span className="text-sm font-medium text-gray-900 block">{entry.title}</span>
              {entry.summary && (
                <span className="text-xs text-gray-600 block mt-1 line-clamp-2">{entry.summary}</span>
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
  )
}
