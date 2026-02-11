import { notFound } from 'next/navigation'
import { getAllSlugs, getContentBySlug } from '@/lib/content'
import ContentDetail from '@/components/ContentDetail'
import type { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('project')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getContentBySlug('project', params.slug)
  
  if (!item) {
    return { title: 'Not Found' }
  }

  return {
    title: `${item.title} - Andreas Juon`,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: item.previewImage ? [item.previewImage] : [],
    },
  }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const item = getContentBySlug('project', params.slug)

  if (!item) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-primary-light">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <ContentDetail type="project" slug={params.slug} />
      </div>
    </main>
  )
}
