import Image from 'next/image'

interface AboutBlockProps {
  portraitImage?: string
  name?: string
  positioning?: string
}

export default function AboutBlock({
  portraitImage = '/images/portrait.jpg',
  name = 'Andreas Juon',
  positioning = 'Academic researcher | Data scientist | Advisory services',
}: AboutBlockProps) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {portraitImage && (
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden">
            <Image
              src={portraitImage}
              alt={name}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        )}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{name}</h2>
          <p className="text-lg text-gray-600">{positioning}</p>
        </div>
      </div>
    </div>
  )
}
