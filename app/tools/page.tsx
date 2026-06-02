import { getContentByType } from '@/lib/content'
import { INTRO_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import PageContainer from '@/components/PageContainer'
import ContentGrid from '@/components/ContentGrid'
import type { ContentItem } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools - Andreas Juon',
  description: 'Tools built by Andreas Juon — from full-scale platforms for political risk assessment and academic career development to smaller technical implementations in LLM and applied data science.',
}

export default function ToolsPage() {
  const tools = getContentByType('tool')

  const platforms = tools.filter((t: ContentItem) => !t.toolType || t.toolType === 'platform')
  const implementations = tools.filter((t: ContentItem) => t.toolType === 'implementation')

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tools</h1>

        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <p className="text-lg text-gray-700">
            Tools I have built for researchers, practitioners, and myself, ranging from full-scale platforms for political risk assessment and academic career development to smaller technical implementations in LLM and applied data science.
          </p>
        </div>

        {platforms.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Platforms</h2>
            <ContentGrid items={platforms} />
          </div>
        )}

        {implementations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Implementations</h2>
            <ContentGrid items={implementations} />
          </div>
        )}

        {tools.length === 0 && (
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <p className="text-gray-600">No tools available yet.</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
