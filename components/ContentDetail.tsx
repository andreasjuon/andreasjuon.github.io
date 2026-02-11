import { getContentBySlug, getRelatedItems, typeToUrlSegment } from '@/lib/content'
import { ContentType } from '@/lib/types'
import { getExternalLinkIcon } from '@/lib/icons'
import Image from 'next/image'
import Link from 'next/link'
import ContentTile from './ContentTile'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface ContentDetailProps {
  type: ContentType
  slug: string
}

export default function ContentDetail({ type, slug }: ContentDetailProps) {
  const item = getContentBySlug(type, slug)

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Content not found.</p>
      </div>
    )
  }

  const relatedItems = getRelatedItems(item)

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-card p-8 mb-8">
        <div className="mb-6">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={item.previewImage}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{item.title}</h1>
          <p className="text-lg text-gray-700 mb-4">{item.summary}</p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {item.date && (
              <span className="text-sm text-gray-600">
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* External Links */}
          {item.externalLinks && Object.keys(item.externalLinks).length > 0 && (
            <div className="flex flex-wrap gap-4">
              {Object.entries(item.externalLinks).map(([key, url]) => (
                url && (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                  >
                    {getExternalLinkIcon(key)}
                    <span className="capitalize">{key}</span>
                  </a>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {item.content && (
        <div className="bg-white rounded-lg shadow-card p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={item.content} />
          </div>
        </div>
      )}

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((relatedItem) => (
              <ContentTile key={`${relatedItem.type}-${relatedItem.slug}`} item={relatedItem} />
            ))}
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="text-center">
        <Link
          href={`/${typeToUrlSegment[type]}`}
          className="inline-block text-primary-dark hover:text-gray-700 transition-colors"
        >
          ← Back to {type.charAt(0).toUpperCase() + type.slice(1)}s
        </Link>
      </div>
    </>
  )
}
