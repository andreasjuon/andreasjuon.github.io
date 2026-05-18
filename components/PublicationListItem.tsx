'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PublicationItem } from '@/lib/types'
import { getContentHref } from '@/lib/contentPaths'
import { getExternalLinkIcon } from '@/lib/icons'

const PUBLICATION_STATUS_LABELS: Record<string, string> = {
  forthcoming: 'Forthcoming',
  'conditionally-accepted': 'Conditionally accepted',
  'under-review': 'Under review',
  'first-draft': 'First draft',
  'in-preparation': 'In preparation',
}

interface PublicationListItemProps {
  item: PublicationItem
}

export default function PublicationListItem({ item }: PublicationListItemProps) {
  const href = getContentHref('publication', item.slug)

  const links: [string, string][] = item.publicationLinks
    ? (Object.entries(item.publicationLinks).filter(([, url]) => url) as [string, string][])
    : item.externalLinks
      ? (Object.entries(item.externalLinks).filter(([, v]) => v) as [string, string][])
      : []

  const yearOrStatus = item.year || (item.status ? PUBLICATION_STATUS_LABELS[item.status] || item.status : null)

  return (
    <div className="block group relative">
      <Link href={href} className="block">
        <div className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow duration-300 border-l-4 border-l-purple-500 flex gap-4">
          <div className="relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0 rounded overflow-hidden">
            <Image
              src={item.previewImage ?? item.headerImage ?? ''}
              alt={item.title}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              {item.title}
            </h3>
            {item.authors && item.authors.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {item.authors.join(", ")}
              </p>
            )}
            {(yearOrStatus || item.date) && (
              <p className="text-xs text-gray-500 mt-1">
                {yearOrStatus ||
                  (item.date
                    ? new Date(item.date).getFullYear().toString()
                    : null)}
                {item.publisher && (
                  `, ${item.publisher}`
                )}
                {item.journal && (
                  <span className="italic">{`, ${item.journal}`}</span>
                )}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {item.summary}
            </p>
          </div>
        </div>
      </Link>
      {links.length > 0 && (
        <div className="hidden md:flex absolute top-4 right-4 gap-2 z-10">
          {links.map(([key, url]) =>
            url ? (
              <a
                key={key}
                href={key === "description" ? href : url}
                target={key === "description" ? undefined : "_blank"}
                rel={key === "description" ? undefined : "noopener noreferrer"}
                className="text-gray-500 hover:text-gray-900 transition-colors bg-white/90 rounded p-1.5"
                aria-label={`${key} link`}
              >
                {getExternalLinkIcon(key, "w-4 h-4")}
              </a>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
