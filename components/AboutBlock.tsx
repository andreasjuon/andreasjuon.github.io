import Image from 'next/image'
import Link from 'next/link'

interface AboutBlockProps {
  portraitImage?: string
  name?: string
  positioning?: string
  description?: string
}

export default function AboutBlock({
  portraitImage = "/images/portrait.jpg",
  name = "Dr. Andreas Juon",
  positioning = "Researcher in Conflict & Security | Data Analytics | Consulting",
  description,
}: AboutBlockProps) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 md:p-8 flex flex-col h-full">
      <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
        {portraitImage && (
          <div className="relative w-64 h-64 md:w-64 md:h-64 flex-shrink-0 rounded-full overflow-hidden">
            <Image
              src={portraitImage}
              alt={name}
              fill
              className="object-cover transform scale-150 translate-y-10"
              sizes="(max-width: 768px) 192px, 192px"
            />
          </div>
        )}
        <div className="flex-1 text-center md:text-left min-w-0 flex flex-col overflow-hidden">
          <div className="flex-shrink">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              {name}
            </h2>
            <p className="text-sm text-gray-500 font-medium mb-4 tracking-wide">
              {positioning}
            </p>
            {description && (
              <p className="hidden md:block text-base text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                {description}
              </p>
            )}
          </div>
          <div className="mt-3 md:mt-4 flex flex-row gap-2 sm:gap-4 justify-center md:justify-start flex-wrap flex-shrink-0 pb-0">
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-md bg-primary-dark text-white text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <span className="md:hidden">About me</span>
              <span className="hidden md:inline">Learn more about me</span>
            </Link>
            <a
              href="/cv_andreas_juon.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-md border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <span className="md:hidden">CV (PDF)</span>
              <span className="hidden md:inline">Download CV (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
