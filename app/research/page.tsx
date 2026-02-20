import { getContentByType } from '@/lib/content'
import { INTRO_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import PageContainer from '@/components/PageContainer'
import ContentCarousel from '@/components/ContentCarousel'
import PublicationListByType from '@/components/PublicationListByType'
import type { PublicationItem } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research - Andreas Juon',
  description: 'Research projects and publications by Andreas Juon',
}

export default function ResearchPage() {
  const projects = getContentByType('project')
  const publications = getContentByType('publication') as PublicationItem[]

  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Research
        </h1>

        {/* Research Overview */}
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <p className="text-lg text-gray-700">
            My research focuses on ethnic conflict and exclusionary nationalism - two of the most urgent challenges
            facing the contemporary global security architecture. I employ quantitative methods and data science techniques
            to examine the roots of ethno-nationalist conflict, evaluate the consequences of
            conflict resolution strategies, and assess the impact of different types of nationalism
            for geopolitics, warfare, and democracy.
          </p>
        </div>

        {/* Projects Carousel/Grid */}
        {projects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Research Projects
            </h2>

            <ContentCarousel items={projects} />
          </div>
        )}

        {/* Publications List - grouped by type */}
        {publications.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Publications
            </h2>
            <PublicationListByType publications={publications} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
