import { getContentByType } from '@/lib/content'
import { INTRO_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import PageContainer from '@/components/PageContainer'
import ContentGrid from '@/components/ContentGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datasets & Data Infrastructure - Andreas Juon',
  description: 'Datasets and data infrastructure projects by Andreas Juon',
}

export default function DataPage() {
  const datasets = getContentByType('dataset')

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Datasets & Data Infrastructure</h1>
        
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
            <p className="text-lg text-gray-700">
              Datasets are treated as first-class outputs in my work. Below you&apos;ll find datasets I&apos;ve created, 
              curated, or contributed to, along with their relevance for research and consulting.
            </p>
        </div>

        {datasets.length > 0 ? (
          <ContentGrid items={datasets} />
        ) : (
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <p className="text-gray-600">No datasets available yet.</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
