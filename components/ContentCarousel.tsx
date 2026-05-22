'use client'

import { useState, useEffect } from 'react'
import { ContentItem } from '@/lib/types'
import ContentTile from './ContentTile'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface ContentCarouselProps {
  items: ContentItem[]
  itemsPerView?: number
}

const SWIPE_THRESHOLD = 50

export default function ContentCarousel({ items, itemsPerView }: ContentCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(3)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  useEffect(() => {
    const updateVisibleItems = () => {
      if (itemsPerView !== undefined) {
        setVisibleItems(itemsPerView)
        return
      }
      const width = window.innerWidth
      if (width < 768) {
        setVisibleItems(1)
      } else if (width < 1024) {
        setVisibleItems(2)
      } else {
        setVisibleItems(3)
      }
    }

    updateVisibleItems()
    window.addEventListener('resize', updateVisibleItems)
    return () => window.removeEventListener('resize', updateVisibleItems)
  }, [itemsPerView])

  useEffect(() => {
    const maxIndex = Math.max(0, items.length - visibleItems)
    setStartIndex((prev) => (items.length <= visibleItems ? 0 : Math.min(prev, maxIndex)))
  }, [items.length, visibleItems])

  const maxIndex = Math.max(0, items.length - visibleItems)

  const goPrevious = () => setStartIndex((prev) => Math.max(0, prev - 1))
  const goNext = () => setStartIndex((prev) => Math.min(maxIndex, prev + 1))

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const delta = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta < 0 ? goNext() : goPrevious()
    }
    setTouchStartX(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => setDragStartX(e.clientX)
  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartX === null) return
    const delta = e.clientX - dragStartX
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta < 0 ? goNext() : goPrevious()
    }
    setDragStartX(null)
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
        className="grid gap-6 px-4 md:px-0 select-none cursor-grab active:cursor-grabbing"
        style={{ gridTemplateColumns: `repeat(${visibleItems}, minmax(0, 1fr))` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setDragStartX(null)}
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
