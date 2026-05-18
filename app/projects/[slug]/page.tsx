import { notFound } from 'next/navigation'
import { getAllSlugs, getContentBySlug } from '@/lib/content'
import PageContainer from '@/components/PageContainer'
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
      images: (item.previewImage ?? item.headerImage) ? [(item.previewImage ?? item.headerImage)!] : [],
    },
  }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const item = getContentBySlug('project', params.slug)

  if (!item) {
    notFound()
  }

  return (
    <PageContainer>
      <ContentDetail type="project" slug={params.slug} />
    </PageContainer>
  )
}
