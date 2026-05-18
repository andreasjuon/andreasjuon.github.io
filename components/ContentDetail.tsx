import { getContentBySlug, getRelatedItems, getPublicationsByProject, resolveHeaderImage, typeToUrlSegment, typeToListPath } from '@/lib/content'
import { ContentType, PublicationItem } from '@/lib/types'
import { getExternalLinkIcon } from '@/lib/icons'
import Image from 'next/image'
import Link from 'next/link'
import ContentTile from './ContentTile'
import ContentCarousel from './ContentCarousel'
import PublicationListByType from './PublicationListByType'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import React from 'react'
import Figure from './Figure'

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
  const headerImage = resolveHeaderImage(item)

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-card p-8 mb-8">
        <div className="mb-6">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={headerImage}
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
            {type === 'publication' && (() => {
              const pub = item as PublicationItem
              const statusLabels: Record<string, string> = { forthcoming: 'Forthcoming', 'under-review': 'Under review', 'first-draft': 'First draft', 'in-preparation': 'In preparation' }
              const yearOrStatus = pub.year || (pub.status ? statusLabels[pub.status] || pub.status : null) || (pub.date ? new Date(pub.date).getFullYear().toString() : null)

              if (pub.publicationType === 'book-chapter') {
                const authorsStr = pub.authors && pub.authors.length > 0 ? pub.authors.join(', ') : ''
                const yearStr = yearOrStatus || ''
                const editorsStr = pub.editors && pub.editors.length > 0 ? `${pub.editors.join(', ')} (eds.)` : ''
                const booktitleStr = pub.booktitle || ''
                const publisherStr = pub.publisher || ''

                if (authorsStr || yearStr || editorsStr || booktitleStr || publisherStr) {
                  const parts: string[] = []
                  if (authorsStr || yearStr) {
                    parts.push([authorsStr, yearStr].filter(Boolean).join(' '))
                  }
                  const inParts: string[] = []
                  if (editorsStr) inParts.push(editorsStr)
                  if (booktitleStr) inParts.push(booktitleStr)
                  if (inParts.length > 0) {
                    parts.push(`In: ${inParts.join(': ')}`)
                  }
                  if (publisherStr) {
                    parts.push(publisherStr)
                  }
                  const formatted = parts.join(' - ').replace('In:', '- In:').replace(' - - ', ' - ')

                  return (
                    <span className="text-sm text-gray-600">
                      {authorsStr && yearStr
                        ? `${authorsStr} ${yearStr} - In: ${editorsStr}${editorsStr && booktitleStr ? ': ' : ''}${!editorsStr && booktitleStr ? booktitleStr : ''}${booktitleStr ? (editorsStr ? booktitleStr : '') : ''}${publisherStr ? `. ${publisherStr}.` : ''}`
                        : [
                            authorsStr || yearStr,
                            inParts.length > 0 ? `In: ${inParts.join(': ')}` : '',
                            publisherStr ? publisherStr : '',
                          ]
                            .filter(Boolean)
                            .join(' - ')
                      }
                    </span>
                  )
                }
              }

              let journalInfo: string | null = null
              if (pub.journal || pub.volume || pub.number) {
                if (pub.journal) {
                  journalInfo = pub.journal
                  if (pub.volume) {
                    journalInfo += `, ${pub.volume}`
                    if (pub.number) {
                      journalInfo += `(${pub.number})`
                    }
                  }
                } else if (pub.volume || pub.number) {
                  journalInfo = [pub.volume, pub.number ? `(${pub.number})` : null].filter(Boolean).join(' ')
                }
              }
              return pub.authors?.length || yearOrStatus ? (
                <>
                  {pub.authors && pub.authors.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {pub.authors.join(", ")}
                    </span>
                  )}
                  {yearOrStatus && (
                    <span className="text-sm text-gray-600">
                      {yearOrStatus}
                    </span>
                  )}
                  {pub.publisher && (
                    <span className="text-sm text-gray-600">
                      {pub.publisher}
                    </span>
                  )}
                  {journalInfo && (
                    <span className="italic text-sm text-gray-600">
                      {journalInfo}
                    </span>
                  )}
                  {pub.editors && pub.editors.length > 0 && (
                    <span className="text-sm text-gray-600">
                      Editors: {pub.editors.join(', ')}
                    </span>
                  )}
                </>
              ) : null;
            })()}
            {type !== 'publication' && item.date && (
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

          {/* External Links - for publications use publicationLinks (subtle); else externalLinks */}
          {(() => {
            const pubItem = item as { publicationLinks?: Record<string, string>; externalLinks?: Record<string, string> }
            const links = pubItem.publicationLinks
              ? Object.entries(pubItem.publicationLinks).filter(([, v]) => v)
              : item.externalLinks
                ? Object.entries(item.externalLinks).filter(([, v]) => v)
                : []
            if (links.length === 0) return null
            const isPublication = type === 'publication'
            const linkLabels: Record<string, string> = { description: 'Description', pdf: 'PDF', supplementary: 'Supplementary', doi: 'DOI' }
            return (
              <div className={`flex flex-wrap gap-4 ${isPublication ? 'pt-2' : ''}`}>
                {links.map(([key, url]) => {
                  const isDescription = key === 'description'
                  const href = isDescription ? (url || `/${typeToUrlSegment[type]}/${slug}`) : url
                  const isExternal = !isDescription || (url && (url.startsWith('http://') || url.startsWith('https://')))
                  return (
                    <a
                      key={key}
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className={`flex items-center gap-2 transition-colors text-gray-600 hover:text-gray-900 ${
                        isPublication ? 'text-sm' : 'px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg'
                      }`}
                    >
                      {getExternalLinkIcon(key, isPublication ? 'w-4 h-4' : 'w-5 h-5')}
                      <span>{linkLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </a>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Content */}
      {item.content && (
        <div className="bg-white rounded-lg shadow-card p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <MDXRemote 
              source={item.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
              components={{
                Figure,
                img: (props: any) => {
                  const { style, className, ...rest } = props
                  return (
                    <img
                      {...rest}
                      alt={rest.alt ?? ''}
                      className={`!my-0 ${className || ''}`}
                      style={{
                        ...style,
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                  )
                },
                figure: (props: any) => {
                  const { style, className, children, ...rest } = props

                  let imgSrc: string | undefined
                  let imgAlt: string | undefined
                  let captionText: string | undefined
                  React.Children.forEach(children, (child) => {
                    if (!React.isValidElement(child)) return
                    if (child.type === 'img') {
                      imgSrc = (child.props as { src?: string }).src
                      imgAlt = (child.props as { alt?: string }).alt
                    }
                    if (child.type === 'figcaption') {
                      const c = (child.props as { children?: React.ReactNode }).children
                      captionText = typeof c === 'string' ? c : undefined
                    }
                  })

                  const canDelegate = imgSrc != null && imgAlt !== undefined
                  if (canDelegate) {
                    const widthMatch = typeof style?.width === 'string' && style.width.match(/^(\d+)px$/)
                    const width = widthMatch ? parseInt(widthMatch[1], 10) : 500
                    const align =
                      style?.float === 'left' ? 'left' : style?.float === 'right' ? 'right' : 'center'
                    return (
                      <Figure
                        src={imgSrc!}
                        alt={imgAlt!}
                        caption={captionText}
                        align={align}
                        width={width}
                      />
                    )
                  }

                  return (
                    <figure
                      {...rest}
                      className={className}
                      style={{
                        ...style,
                        marginTop: '0',
                        marginBottom: '1rem',
                        maxWidth: '100%',
                      }}
                    >
                      {children}
                    </figure>
                  )
                },
                figcaption: (props: any) => {
                  const { style, className, ...rest } = props
                  return (
                    <figcaption
                      {...rest}
                      className={className}
                      style={{
                        fontSize: '0.875rem',
                        color: '#4B5563',
                        marginTop: '0.5rem',
                        ...style
                      }}
                    />
                  )
                },
                a: (props: any) => {
                  const href = props.href || ''
                  const isExternal = href.startsWith('http://') || href.startsWith('https://')
                  if (isExternal) {
                    return <a {...props} target="_blank" rel="noopener noreferrer" />
                  }
                  return <Link {...props} href={href} />
                },
                table: (props: any) => {
                  const { className, style, ...rest } = props
                  return (
                    <div className="overflow-x-auto -mt-10 mb-6">
                      <table 
                        {...rest} 
                        className={`min-w-full border-collapse ${className || ''}`}
                        style={style}
                      />
                    </div>
                  )
                },
                thead: (props: any) => {
                  const { className, style, ...rest } = props
                  return <thead {...rest} className={`bg-gray-50 ${className || ''}`} style={style} />
                },
                tbody: (props: any) => {
                  const { className, style, ...rest } = props
                  return <tbody {...rest} className={className} style={style} />
                },
                tr: (props: any) => {
                  const { className, style, ...rest } = props
                  return <tr {...rest} className={`border-b border-gray-200 ${className || ''}`} style={style} />
                },
                th: (props: any) => {
                  const { className, style, ...rest } = props
                  return (
                    <th 
                      {...rest} 
                      className={`text-left font-semibold text-gray-900 px-4 py-3 ${className || ''}`}
                      style={style}
                    />
                  )
                },
                td: (props: any) => {
                  const { className, style, ...rest } = props
                  return (
                    <td 
                      {...rest} 
                      className={`px-4 py-3 text-gray-700 ${className || ''}`}
                      style={style}
                    />
                  )
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Project-specific: Publications linked to this project */}
      {type === 'project' && (() => {
        const projectPublications = getPublicationsByProject(slug)
        if (projectPublications.length === 0) return null
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Publications</h2>
            <PublicationListByType publications={projectPublications} />
          </div>
        )
      })()}

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Items</h2>
          <ContentCarousel items={relatedItems} />
        </div>
      )}

      {/* Back Link */}
      <div className="text-center">
        <Link
          href={`${typeToListPath[type]}/`}
          className="inline-block text-primary-dark hover:text-gray-700 transition-colors"
        >
          ← Back to {type.charAt(0).toUpperCase() + type.slice(1)}s
        </Link>
      </div>
    </>
  )
}
