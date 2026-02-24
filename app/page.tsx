import { getAllContentItems } from '@/lib/content'
import { siteConfig } from '@/lib/siteConfig'
import PageContainer from '@/components/PageContainer'
import AboutBlock from '@/components/AboutBlock'
import ContentCarousel from '@/components/ContentCarousel'
import RecentUpdatesPanel from '@/components/RecentUpdatesPanel'
import SocialLinks from '@/components/SocialLinks'

export default function Home() {
  const allItems = getAllContentItems()
  const featuredItems = allItems
    .filter((item) => typeof item.featured === 'number')
    .map((item) => ({ item, rand: Math.random() }))
    .sort((a, b) => {
      const aFeatured = a.item.featured ?? 0
      const bFeatured = b.item.featured ?? 0
      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured
      }
      return a.rand - b.rand
    })
    .map(({ item }) => item)
    .slice(0, 12)

  return (
    <PageContainer>
        {/* Main Content Grid - About Block and Recent Updates, equal height, height-capped so Featured Work stays visible */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6 items-stretch">
          {/* Left Column - About Block */}
          <div className="lg:col-span-3 min-h-[200px] lg:max-h-[350px] lg:h-full">
            <AboutBlock
              description="I specialize in quantitative research on political institutions, conflict, and democratic stability. My work combines data science with political science to investigate power-sharing arrangements and their effects on political outcomes."
            />
          </div>

          {/* Right Sidebar - Recent Updates (scrollable) */}
          <div className="lg:col-span-1 lg:h-full lg:max-h-[350px]">
            <RecentUpdatesPanel limit={10} />
          </div>
        </div>

        {/* Featured Work Carousel */}
        {featuredItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Featured Work</h2>
            <ContentCarousel items={featuredItems} />
          </div>
        )}

        {featuredItems.length === 0 && (
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
    </PageContainer>
  )
}
