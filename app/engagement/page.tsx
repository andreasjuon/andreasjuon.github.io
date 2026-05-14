import { getContentByType } from '@/lib/content'
import { INTRO_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import PageContainer from '@/components/PageContainer'
import EngagementFilter from '@/components/EngagementFilter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public Engagement - Andreas Juon',
  description: 'Talks, conference presentations, media appearances, teaching, and organized workshops by Andreas Juon',
}

export default function EngagementPage() {
  const talks = getContentByType('talk')
  const conferencePresentations = getContentByType('conference-presentation')
  const media = getContentByType('media')
  const teaching = getContentByType('teaching')
  const organizedWorkshops = getContentByType('organized-workshop')

  const allEngagement = [
    ...talks,
    ...conferencePresentations,
    ...media,
    ...teaching,
    ...organizedWorkshops,
  ].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Public Engagement</h1>

        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <p className="text-lg text-gray-700">
            I engage with researchers and the broader public through invited talks, conference
            presentations, media appearances, teaching, and organized workshops.
          </p>
        </div>

        <EngagementFilter items={allEngagement} />
      </div>
    </PageContainer>
  )
}
