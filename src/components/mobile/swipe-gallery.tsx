'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SwipeGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  showThumbnails?: boolean
  enableZoom?: boolean
  onImageChange?: (index: number) => void
}

export const SwipeGallery = ({
  images,
  className,
  autoPlay = false,
  autoPlayInterval = 3000,
  showThumbnails = true,
  enableZoom = true,
  onImageChange
}: SwipeGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isFullscreen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, isFullscreen, images.length])

  // Handle image change
  useEffect(() => {
    onImageChange?.(currentIndex)
  }, [currentIndex, onImageChange])

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  // Drag handling
  const handleDragStart = () => {
    setIsDragging(true)
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    setDragOffset(0)

    const threshold = 100
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragOffset(info.offset.x)
  }

  // Zoom handling
  const handleZoom = (newScale: number, event?: React.MouseEvent) => {
    if (!enableZoom) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect && event) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      setPosition({
        x: (centerX - x) * (newScale - 1),
        y: (centerY - y) * (newScale - 1)
      })
    }

    setScale(newScale)
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Fullscreen handling
  const enterFullscreen = () => {
    setIsFullscreen(true)
    document.body.style.overflow = 'hidden'
  }

  const exitFullscreen = () => {
    setIsFullscreen(false)
    resetZoom()
    document.body.style.overflow = ''
  }

  // Touch handling for zoom
  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 2) {
      // Pinch to zoom start
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      // Store initial distance for pinch calculation
      containerRef.current?.setAttribute('data-initial-distance', distance.toString())
      containerRef.current?.setAttribute('data-initial-scale', scale.toString())
    }
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (event.touches.length === 2 && enableZoom) {
      event.preventDefault()
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      const initialDistance = parseFloat(containerRef.current?.getAttribute('data-initial-distance') || '0')
      const initialScale = parseFloat(containerRef.current?.getAttribute('data-initial-scale') || '1')
      
      if (initialDistance > 0) {
        const newScale = Math.min(Math.max(initialScale * (distance / initialDistance), 0.5), 3)
        setScale(newScale)
      }
    }
  }

  const currentImage = images[currentIndex]

  return (
    <>
      {/* Main Gallery */}
      <div className={cn('relative bg-gray-900 rounded-lg overflow-hidden', className)}>
        <div
          ref={containerRef}
          className="relative h-64 sm:h-80 md:h-96 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <motion.div
            className="flex h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            animate={{ x: -currentIndex * 100 + '%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ x: dragOffset }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-full h-full flex-shrink-0"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Fullscreen button */}
          {enableZoom && (
            <button
              onClick={enterFullscreen}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="View fullscreen"
            >
              <Maximize2 size={20} />
            </button>
          )}

          {/* Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex space-x-2 p-4 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                  index === currentIndex ? 'border-orange-500' : 'border-gray-600'
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <motion.div
              className="relative w-full h-full overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <motion.img
                src={currentImage.src}
                alt={currentImage.alt}
                className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
                drag
                dragConstraints={{
                  left: -200,
                  right: 200,
                  top: -200,
                  bottom: 200
                }}
                style={{
                  scale,
                  x: position.x,
                  y: position.y
                }}
                onDoubleClick={(e) => {
                  if (scale === 1) {
                    handleZoom(2, e)
                  } else {
                    resetZoom()
                  }
                }}
              />

              {/* Fullscreen controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleZoom(Math.max(scale - 0.5, 0.5))}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Zoom out"
                >
                  -
                </button>
                <button
                  onClick={() => handleZoom(Math.min(scale + 0.5, 3))}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  onClick={exitFullscreen}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Exit fullscreen"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Fullscreen navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Fullscreen indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToIndex(index)}
                      className={cn(
                        'w-3 h-3 rounded-full transition-colors',
                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Swipe navigation component for general use
interface SwipeNavigationProps {
  children: React.ReactNode[]
  className?: string
  onIndexChange?: (index: number) => void
  initialIndex?: number
}

export const SwipeNavigation = ({
  children,
  className,
  onIndexChange,
  initialIndex = 0
}: SwipeNavigationProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [dragOffset, setDragOffset] = useState(0)

  const handleDragEnd = (event: any, info: PanInfo) => {
    setDragOffset(0)

    const threshold = 100
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 && currentIndex > 0) {
        const newIndex = currentIndex - 1
        setCurrentIndex(newIndex)
        onIndexChange?.(newIndex)
      } else if (info.offset.x < 0 && currentIndex < children.length - 1) {
        const newIndex = currentIndex + 1
        setCurrentIndex(newIndex)
        onIndexChange?.(newIndex)
      }
    }
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragOffset(info.offset.x)
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <motion.div
        className="flex"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        animate={{ x: -currentIndex * 100 + '%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ x: dragOffset }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>

      {/* Navigation dots */}
      {children.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                onIndexChange?.(index)
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-400'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SwipeGallery