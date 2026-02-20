'use client'

import { useState, useEffect } from 'react'
import { ContentItem } from '@/lib/types'
import ContentTile from './ContentTile'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface ContentCarouselProps {
  items: ContentItem[]
  itemsPerView?: number
}

export default function ContentCarousel({ items, itemsPerView }: ContentCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(3)

  useEffect(() => {
    // Calculate responsive items per view based on screen size
    const updateVisibleItems = () => {
      if (itemsPerView !== undefined) {
        // If itemsPerView is explicitly provided, use it
        setVisibleItems(itemsPerView)
        return
      }
      
      // Otherwise, calculate based on viewport width
      const width = window.innerWidth
      if (width < 768) {
        // Mobile: 1 item
        setVisibleItems(1)
      } else if (width < 1024) {
        // Tablet: 2 items
        setVisibleItems(2)
      } else {
        // Desktop: 3 items
        setVisibleItems(3)
      }
    }

    updateVisibleItems()
    window.addEventListener('resize', updateVisibleItems)
    return () => window.removeEventListener('resize', updateVisibleItems)
  }, [itemsPerView])

  const maxIndex = Math.max(0, items.length - visibleItems)

  const goPrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const goNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const visibleItemsList = items.slice(startIndex, startIndex + visibleItems)

  if (items.length === 0) return null

  return (
    <div className="relative">
      {items.length > visibleItems && (
        <>
          <button
            onClick={goPrevious}
            disabled={startIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Previous items"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goNext}
            disabled={startIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Next items"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      <div 
        className="grid gap-6 px-4 md:px-0"
        style={{
          gridTemplateColumns: `repeat(${visibleItems}, minmax(0, 1fr))`
        }}
      >
        {visibleItemsList.map((item) => (
          <ContentTile key={`${item.type}-${item.slug}`} item={item} />
        ))}
      </div>
      {items.length > visibleItems && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setStartIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === startIndex ? 'bg-gray-900 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
