import { getContentByType } from '@/lib/content'
import { INTRO_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import PageContainer from '@/components/PageContainer'
import ContentGrid from '@/components/ContentGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools for Research and Policy - Andreas Juon',
  description: 'Tools and resources for research and policy created by Andreas Juon',
}

export default function ToolsPage() {
  const tools = getContentByType('tool')

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tools for Researchers and Practitioners</h1>
        
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
            <p className="text-lg text-gray-700">
              I develop tools and resources to support academics and practitioners in related fields. For academics, these tools and resources support their workflow in research and teaching as well as the career prospects of junior scholars. For policymakers, I support systematic assessments of national divisions and entailed risks for political stability.
            </p>
        </div>

        {tools.length > 0 ? (
          <ContentGrid items={tools} />
        ) : (
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <p className="text-gray-600">No tools available yet.</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
