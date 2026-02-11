import SocialLinks from '@/components/SocialLinks'
import { siteConfig } from '@/lib/siteConfig'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Andreas Juon',
  description: 'Contact Andreas Juon for consulting, collaboration, or inquiries',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-primary-light">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-8">
              I&apos;m always interested in hearing about new opportunities for collaboration, 
              consulting projects, or research partnerships. Feel free to reach out through 
              any of the channels below.
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
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
      </div>
    </main>
  )
}
