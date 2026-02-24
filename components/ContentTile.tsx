'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ContentItem } from '@/lib/types'
import { getContentHref } from '@/lib/contentPaths'
import { getTypeColor } from '@/lib/typeColors'
import { getExternalLinkIcon } from '@/lib/icons'

interface ContentTileProps {
  item: ContentItem
  aspectRatio?: string
}

export default function ContentTile({ item, aspectRatio = '16/9' }: ContentTileProps) {
  const typeColor = getTypeColor(item.type)
  const href = getContentHref(item.type, item.slug)
  const label = (item as ContentItem & { subtype?: string }).subtype || item.type

  return (
    <div className="block group relative h-full">
      <Link href={href} className="block h-full">
        <div
          className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 border-l-4 h-full flex flex-col"
          style={{ borderLeftColor: typeColor }}
        >
          <div className="relative w-full" style={{ aspectRatio }}>
            <Image
              src={item.previewImage}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            <span
              className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium text-white bg-black/60"
              style={{ backgroundColor: typeColor }}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </span>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{item.summary}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 mt-auto">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
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
