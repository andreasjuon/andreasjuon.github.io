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
              I develop globally-representative datasets and data infrastructure to support my research and consulting work. 
              These include standardized global survey data,
              systematic assessments of nationalist movements and their ideologies,
              fine-grained datasets on political institutions,
              geospatial datasets on ethnic and regional boundaries,
              and systematic information on the ethnic identity of armed actors.
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
