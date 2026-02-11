import Image from 'next/image'
import Link from 'next/link'

interface AboutBlockProps {
  portraitImage?: string
  name?: string
  positioning?: string
  description?: string
}

export default function AboutBlock({
  portraitImage = '/images/portrait.jpg',
  name = 'Andreas Juon',
  positioning = 'Academic researcher | Data scientist | Advisory services',
  description,
}: AboutBlockProps) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 md:p-8 h-full flex flex-col">
      <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
        {portraitImage && (
          <div className="relative w-48 h-48 md:h-full md:w-auto md:aspect-square flex-shrink-0 rounded-full overflow-hidden">
            <Image
              src={portraitImage}
              alt={name}
              fill
              className="object-cover transform scale-150 translate-y-10"
              sizes="(max-width: 768px) 192px, 400px"
            />
          </div>
        )}
        <div className="flex-1 text-center md:text-left min-w-0">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{name}</h2>
          <p className="text-sm text-gray-500 font-medium mb-4 tracking-wide">
            {positioning}
          </p>
          {description && (
            <p className="text-base text-gray-700 leading-relaxed">
              {description}
            </p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-dark text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Learn more about me
            </Link>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Download CV (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
