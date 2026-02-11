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
  const slugs = getAllSlugs('publication')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getContentBySlug('publication', params.slug)
  
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

export default function PublicationDetailPage({ params }: PageProps) {
  const item = getContentBySlug('publication', params.slug)

  if (!item) {
    notFound()
  }

  return (
    <PageContainer>
      <ContentDetail type="publication" slug={params.slug} />
    </PageContainer>
  )
}
