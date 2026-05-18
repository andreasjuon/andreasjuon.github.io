import Link from 'next/link'
import type { Metadata } from 'next'
import PageContainer from '@/components/PageContainer'
import { INTRO_FRAME_CLASS, CONTENT_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'

export const metadata: Metadata = {
  title: 'Consulting & Advisory Services - Andreas Juon',
  description: 'Consulting and advisory services offered by Andreas Juon',
}

export default function ConsultingPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Consulting & Advisory Services</h1>
        
        {/* Frame 1: Short intro */}
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <p className="text-lg text-gray-700">
            I provide consulting and advisory services in political science research, data analysis, 
            and quantitative methods. My expertise spans academic research, data science, and policy analysis.
          </p>
        </div>

        {/* Frame 2: Services and details */}
        <div className={`${CONTENT_FRAME_CLASS} prose prose-lg max-w-none`}>
          <h2 className="text-2xl font-semibold text-gray-900 mt-0 mb-4">Services Offered</h2>
          <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
            <li>Research design and methodology consultation</li>
            <li>Data analysis and statistical modeling</li>
            <li>Data visualization and dashboard development</li>
            <li>Policy analysis and evaluation</li>
            <li>Academic writing and research support</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Target Audiences</h2>
          <p className="text-gray-700 mb-4">
            I work with academic institutions, research organizations, government agencies, 
            non-profits, and private sector clients who need expertise in quantitative research 
            and data analysis.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Methods & Expertise</h2>
          <p className="text-gray-700 mb-8">
            My methodological toolkit includes advanced statistical methods, machine learning, 
            causal inference, survey design, and computational social science approaches.
          </p>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-block bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
