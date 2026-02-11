import SocialLinks from '@/components/SocialLinks'
import { siteConfig } from '@/lib/siteConfig'
import type { Metadata } from 'next'
import PageContainer from '@/components/PageContainer'
import { INTRO_FRAME_CLASS, CONTENT_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'

export const metadata: Metadata = {
  title: 'Contact - Andreas Juon',
  description: 'Contact Andreas Juon for consulting, collaboration, or inquiries',
}

export default function ContactPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact</h1>
        
        {/* Frame 1: Short intro */}
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <p className="text-lg text-gray-700">
            I&apos;m always interested in hearing about new opportunities for collaboration, 
            consulting projects, or research partnerships. Feel free to reach out through 
            any of the channels below.
          </p>
        </div>

        {/* Frame 2: Get in Touch and contact details */}
        <div className={`${CONTENT_FRAME_CLASS} prose prose-lg max-w-none`}>
          <h2 className="text-2xl font-semibold text-gray-900 mt-0 mb-4">Get in Touch</h2>
          <div className="space-y-4 mb-8">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="text-primary-dark hover:underline">
                {siteConfig.email}
              </a>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Social Media</p>
              <SocialLinks
                github={siteConfig.socialLinks.github}
                scholar={siteConfig.socialLinks.scholar}
                twitter={siteConfig.socialLinks.twitter}
                email={siteConfig.email}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Consulting Inquiries</h3>
            <p className="text-gray-700">
              For consulting and advisory services, please include details about your project, 
              timeline, and specific needs in your message.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
