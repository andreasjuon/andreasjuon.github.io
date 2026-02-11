import { getContentByType } from '@/lib/content'
import ContentList from '@/components/ContentList'
import ContentGrid from '@/components/ContentGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public Engagement - Andreas Juon',
  description: 'Talks, interviews, and media appearances by Andreas Juon',
}

export default function EngagementPage() {
  const talks = getContentByType('talk')
  const media = getContentByType('media')
  const allEngagement = [...talks, ...media]

  return (
    <main className="min-h-screen bg-primary-light">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Public Engagement</h1>
          
          <div className="bg-white rounded-lg shadow-card p-6 md:p-8 mb-8">
            <p className="text-lg text-gray-700">
              I regularly engage with the public through talks, interviews, and media appearances 
              to share research findings and insights.
            </p>
          </div>

          {allEngagement.length > 0 ? (
            <ContentList items={allEngagement} />
          ) : (
            <div className="bg-white rounded-lg shadow-card p-8 text-center">
              <p className="text-gray-600">No public engagement items available yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
