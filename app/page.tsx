import { getAllContentItems } from '@/lib/content'
import { siteConfig } from '@/lib/siteConfig'
import AboutBlock from '@/components/AboutBlock'
import ContentCarousel from '@/components/ContentCarousel'
import CTASection from '@/components/CTASection'
import SocialLinks from '@/components/SocialLinks'

export default function Home() {
  const allItems = getAllContentItems()
  // Mix different content types for the portfolio carousel
  const portfolioItems = allItems.slice(0, 6)

  return (
    <main className="min-h-screen bg-primary-light">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* CTA Section - Above the fold */}
        <div className="mb-12">
          <CTASection />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Left Column - About Block */}
          <div className="lg:col-span-3">
            <AboutBlock />
          </div>

          {/* Right Sidebar - Recent News/Blog (optional) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
              <p className="text-sm text-gray-600">
                News and updates will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Carousel */}
        {portfolioItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Featured Work</h2>
            <ContentCarousel items={portfolioItems} itemsPerView={3} />
          </div>
        )}
        
        {portfolioItems.length === 0 && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Featured Work</h2>
            <div className="bg-white rounded-lg shadow-card p-8 text-center">
              <p className="text-gray-600">Content will appear here once added.</p>
            </div>
          </div>
        )}

        {/* Bottom Section - Social Links & Contact */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get in Touch</h3>
              <p className="text-gray-600">Connect with me on social media or reach out directly.</p>
            </div>
            <SocialLinks
              github={siteConfig.socialLinks.github}
              scholar={siteConfig.socialLinks.scholar}
              twitter={siteConfig.socialLinks.twitter}
              email={siteConfig.email}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
