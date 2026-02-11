import Link from 'next/link'

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
}

export default function CTASection({
  title = 'Interested in working together?',
  description = 'I provide consulting and advisory services in political science research, data analysis, and quantitative methods.',
  buttonText = 'Get in touch',
  buttonHref = '/contact',
}: CTASectionProps) {
  return (
    <div className="bg-primary-dark text-white rounded-lg shadow-card p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-gray-200 mb-6">{description}</p>
        <Link
          href={buttonHref}
          className="inline-block bg-white text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  )
}
