import { getContentByType } from '@/lib/content'
import ContentCarousel from '@/components/ContentCarousel'
import ContentList from '@/components/ContentList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research - Andreas Juon',
  description: 'Research projects and publications by Andreas Juon',
}

export default function ResearchPage() {
  const projects = getContentByType('project')
  const publications = getContentByType('publication')

  return (
    <main className="min-h-screen bg-primary-light">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Research</h1>
          
          {/* Research Overview */}
          <div className="bg-white rounded-lg shadow-card p-6 md:p-8 mb-8">
            <p className="text-lg text-gray-700">
              My research focuses on [your research areas]. I employ quantitative methods and data science 
              techniques to investigate [your research questions].
            </p>
          </div>

          {/* Projects Carousel/Grid */}
          {projects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Projects</h2>
              <ContentCarousel items={projects} itemsPerView={3} />
            </div>
          )}

          {/* Publications List */}
          {publications.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Publications</h2>
              <ContentList items={publications} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
