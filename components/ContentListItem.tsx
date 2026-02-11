'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ContentItem } from '@/lib/types'
import { getContentHref } from '@/lib/contentPaths'
import { getTypeColor } from '@/lib/typeColors'
import { getExternalLinkIcon } from '@/lib/icons'

interface ContentListItemProps {
  item: ContentItem
  imagePosition?: 'left' | 'right'
}

export default function ContentListItem({ item, imagePosition = 'left' }: ContentListItemProps) {
  const typeColor = getTypeColor(item.type)
  const href = getContentHref(item.type, item.slug)

  const imageSection = (
    <div className="relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0 rounded overflow-hidden">
      <Image
        src={item.previewImage}
        alt={item.title}
        fill
        className="object-cover"
        sizes="160px"
      />
    </div>
  )

  return (
    <div className="block group relative">
      <Link href={href} className="block">
        <div
          className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow duration-300 border-l-4 flex gap-4"
          style={{ borderLeftColor: typeColor }}
        >
          {imagePosition === 'left' && imageSection}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {item.date && <span>{new Date(item.date).getFullYear()}</span>}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {imagePosition === 'right' && imageSection}
        </div>
      </Link>
      {item.externalLinks && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {Object.entries(item.externalLinks).map(([key, url]) =>
            url ? (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors bg-white/90 rounded p-1"
                aria-label={`${key} link`}
              >
                {getExternalLinkIcon(key, 'w-4 h-4')}
              </a>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
