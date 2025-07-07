'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  X,
  Play,
  Pause,
  RotateCw,
  Download,
  Share2,
  Move3D
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product360ViewerTrigger } from './product-360-viewer'

interface ProductImageGalleryProps {
  productId: string
  productName: string
  images: string[]
  className?: string
}

// Sample images for demonstration
const sampleImages: string[] = [
  '/images/products/quinoa-mix.jpg',
  '/images/products/quinoa-mix.jpg',
  '/images/products/quinoa-mix.jpg',
  '/images/products/quinoa-mix.jpg',
  '/images/products/quinoa-mix.jpg',
]

export function ProductImageGallery({ 
  productId, 
  productName, 
  images = sampleImages,
  className = "" 
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const slideInterval = useRef<NodeJS.Timeout | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const filteredImages = images
  const currentImage = filteredImages[currentIndex] || images[0]

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying) {
      slideInterval.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredImages.length)
      }, 3000)
    } else {
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }
  }, [isPlaying, filteredImages.length])

  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setCurrentIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
    setZoom(1)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setZoom(1)
  }

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = currentImage
    link.download = `${productName}.jpg`
    link.click()
  }

  const shareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: productName,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* No type filter; all images are shown */}

      {/* Main Image Display */}
      <div className="relative bg-cream-100 rounded-lg overflow-hidden group">
        <div className="aspect-square relative">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={productName}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => openLightbox(currentIndex)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Image Controls Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
            {/* Navigation Arrows */}
            {filteredImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Top Controls */}
            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openLightbox(currentIndex)}
                className="h-8 w-8 p-0"
              >
                <Maximize className="h-3 w-3" />
              </Button>
              
              <Product360ViewerTrigger 
                productId={productId}
                productName={productName}
                className="h-8 px-2 text-xs"
              />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {filteredImages.length > 1 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={togglePlayPause}
                  className="h-8 px-2"
                >
                  {isPlaying ? (
                    <Pause className="h-3 w-3 mr-1" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>
              )}
            </div>
          </div>

          {/* No image type badge; just product name */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {productName}
            </Badge>
          </div>

          {/* Image Counter */}
          {filteredImages.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {currentIndex + 1} / {filteredImages.length}
              </Badge>
            </div>
          )}
        </div>

        {/* No caption; just product name */}
        <div className="p-3 bg-cream-200 border-t border-cream-300">
          <p className="text-sm text-earth-700">{productName}</p>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {filteredImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filteredImages.map((image, index) => (
            <motion.button
              key={image}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-primary-500 ring-2 ring-primary-200' 
                  : 'border-cream-300 hover:border-primary-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image}
                alt={productName}
                fill
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full"
            >
              {/* Lightbox Controls */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={downloadImage}
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={shareImage}
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {Math.round(zoom * 100)}%
                </span>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={closeLightbox}
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setLightboxIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setLightboxIndex(prev => (prev + 1) % filteredImages.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Main Lightbox Image */}
              <div className="flex items-center justify-center h-full overflow-hidden">
                <motion.img
                  ref={imageRef}
                  src={filteredImages[lightboxIndex]}
                  alt={productName}
                  className="max-w-full max-h-full object-contain cursor-move"
                  style={{ transform: `scale(${zoom})` }}
                  drag={zoom > 1}
                  dragConstraints={{
                    left: -(zoom - 1) * 200,
                    right: (zoom - 1) * 200,
                    top: -(zoom - 1) * 200,
                    bottom: (zoom - 1) * 200
                  }}
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white p-3 rounded">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge>
                    {productName}
                  </Badge>
                  <span className="text-sm">
                    {lightboxIndex + 1} / {filteredImages.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}