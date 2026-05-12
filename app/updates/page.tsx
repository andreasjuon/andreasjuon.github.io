import { getAllUpdates } from '@/lib/updates'
import { INTRO_FRAME_CLASS, CONTENT_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import PageContainer from '@/components/PageContainer'
import UpdatesPaginated from '@/components/UpdatesPaginated'

export default function UpdatesPage() {
  const allUpdates = getAllUpdates()

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Recent Updates</h1>

        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <p className="text-lg text-gray-700">
            News and updates from my research and work.
          </p>
        </div>

        <div className={`${CONTENT_FRAME_CLASS}`}>
          <UpdatesPaginated allUpdates={allUpdates} />
        </div>
      </div>
    </PageContainer>
  )
}
