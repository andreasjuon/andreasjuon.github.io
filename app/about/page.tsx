import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Andreas Juon',
  description: 'About Andreas Juon - Academic researcher, data scientist, and advisory services',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary-light">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              I am Andreas Juon, a political and data scientist specializing in quantitative research methods, 
              data analysis, and advisory services.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Biography</h2>
            <p className="text-gray-700 mb-4">
              [Your biography content will go here. This section can include your academic background, 
              research interests, and professional experience.]
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Curriculum Vitae</h2>
            <p className="text-gray-700 mb-4">
              [CV content will be embedded here. You can add a link to download your CV or embed it directly.]
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
