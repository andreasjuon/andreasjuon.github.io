import { getContentByType } from '@/lib/content'
import ContentGrid from '@/components/ContentGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools for Researchers - Andreas Juon',
  description: 'Tools and resources for researchers created by Andreas Juon',
}

export default function ToolsPage() {
  const tools = getContentByType('tool')

  return (
    <main className="min-h-screen bg-primary-light">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tools for Researchers</h1>
          
          <div className="bg-white rounded-lg shadow-card p-6 md:p-8 mb-8">
            <p className="text-lg text-gray-700">
              I develop tools and resources to support academic research and data analysis. 
              These tools are designed to make research workflows more efficient and accessible.
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
      </div>
    </main>
  )
}
