'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  RotateCcw, 
  Play, 
  Pause, 
  RotateCw, 
  Maximize, 
  ZoomIn, 
  ZoomOut,
  Move3D,
  Eye,
  Info,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Product360ViewerProps {
  productId: string
  productName: string
  images: string[]
  isOpen: boolean
  onClose: () => void
}

interface ViewerControls {
  isPlaying: boolean
  currentFrame: number
  zoom: number
  rotation: number
  isDragging: boolean
  isFullscreen: boolean
}

// Generate sample 360° images for demonstration
const generate360Images = (productId: string, count: number = 36): string[] => {
  const baseImages = [
    '/images/products/quinoa-mix.jpg',
    '/images/products/protein-balls.jpg',
    '/images/products/granola.jpg'
  ]
  
  const baseImage = baseImages[parseInt(productId) % baseImages.length] || baseImages[0]
  
  // In a real implementation, these would be actual 360° product images
  // For demo purposes, we'll simulate with the same image
  return Array.from({ length: count }, (_, i) => baseImage)
}

const hotspots = [
  {
    id: '1',
    x: 30,
    y: 40,
    title: 'Premium Packaging',
    description: 'Eco-friendly, resealable packaging keeps products fresh',
    frame: 8
  },
  {
    id: '2',
    x: 70,
    y: 30,
    title: 'Nutrition Label',
    description: 'Detailed nutritional information and ingredient list',
    frame: 18
  },
  {
    id: '3',
    x: 50,
    y: 70,
    title: 'Quality Seal',
    description: 'Certified organic and quality assurance seals',
    frame: 28
  }
]

export function Product360Viewer({ productId, productName, images, isOpen, onClose }: Product360ViewerProps) {
  const [controls, setControls] = useState<ViewerControls>({
    isPlaying: false,
    currentFrame: 0,
    zoom: 1,
    rotation: 0,
    isDragging: false,
    isFullscreen: false
  })
  
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null)
  const [showHotspots, setShowHotspots] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)

  const frameImages = generate360Images(productId, 36)

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const promises = frameImages.map((src, index) => {
        return new Promise<number>((resolve) => {
          const img = new Image()
          img.onload = () => resolve(index)
          img.onerror = () => resolve(index)
          img.src = src
        })
      })

      for (const index of await Promise.all(promises)) {
        setLoadedImages(prev => new Set([...prev, index]))
      }
    }

    if (isOpen) {
      preloadImages()
    }
  }, [isOpen, frameImages])

  // Auto-rotation animation
  useEffect(() => {
    if (controls.isPlaying) {
      const animate = (timestamp: number) => {
        if (timestamp - lastUpdateRef.current > 100) { // 10 FPS
          setControls(prev => ({
            ...prev,
            currentFrame: (prev.currentFrame + 1) % frameImages.length
          }))
          lastUpdateRef.current = timestamp
        }
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [controls.isPlaying, frameImages.length])

  // Handle manual rotation via drag
  const handleDrag = useCallback((event: MouseEvent | TouchEvent, info: PanInfo) => {
    const sensitivity = 0.5
    const deltaX = info.delta.x * sensitivity
    const frameChange = Math.round(deltaX / 10)
    
    if (frameChange !== 0) {
      setControls(prev => ({
        ...prev,
        currentFrame: (prev.currentFrame + frameChange + frameImages.length) % frameImages.length,
        isDragging: true
      }))
    }
  }, [frameImages.length])

  const handleDragEnd = useCallback(() => {
    setControls(prev => ({ ...prev, isDragging: false }))
  }, [])

  // Control functions
  const togglePlayPause = () => {
    setControls(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const resetView = () => {
    setControls(prev => ({
      ...prev,
      currentFrame: 0,
      zoom: 1,
      rotation: 0,
      isPlaying: false
    }))
  }

  const zoomIn = () => {
    setControls(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.2, 3) }))
  }

  const zoomOut = () => {
    setControls(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.2, 0.5) }))
  }

  const rotateLeft = () => {
    setControls(prev => ({
      ...prev,
      currentFrame: (prev.currentFrame - 1 + frameImages.length) % frameImages.length
    }))
  }

  const rotateRight = () => {
    setControls(prev => ({
      ...prev,
      currentFrame: (prev.currentFrame + 1) % frameImages.length
    }))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen?.()
      setControls(prev => ({ ...prev, isFullscreen: true }))
    } else {
      document.exitFullscreen?.()
      setControls(prev => ({ ...prev, isFullscreen: false }))
    }
  }

  const getCurrentHotspots = () => {
    return hotspots.filter(hotspot => 
      Math.abs(hotspot.frame - controls.currentFrame) <= 2
    )
  }

  const goToHotspot = (hotspot: typeof hotspots[0]) => {
    setControls(prev => ({ ...prev, currentFrame: hotspot.frame, isPlaying: false }))
    setSelectedHotspot(hotspot.id)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white rounded-lg overflow-hidden ${
            controls.isFullscreen ? 'w-full h-full' : 'max-w-4xl w-full max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{productName}</h2>
              <p className="text-sm text-gray-600">360° Product View</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Frame {controls.currentFrame + 1}/{frameImages.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Viewer */}
          <div className="relative bg-gray-100 flex items-center justify-center h-96 md:h-[500px] overflow-hidden">
            {/* 360° Image */}
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              className="relative cursor-grab active:cursor-grabbing"
              style={{
                scale: controls.zoom,
                rotate: controls.rotation
              }}
            >
              <img
                ref={imageRef}
                src={frameImages[controls.currentFrame]}
                alt={`${productName} - View ${controls.currentFrame + 1}`}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />

              {/* Hotspots */}
              <AnimatePresence>
                {showHotspots && getCurrentHotspots().map((hotspot) => (
                  <motion.button
                    key={hotspot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors group"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedHotspot(
                      selectedHotspot === hotspot.id ? null : hotspot.id
                    )}
                  >
                    <Info className="h-3 w-3 text-white" />
                    
                    {/* Hotspot tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {hotspot.title}
                      </div>
                      <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1"></div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {!loadedImages.has(controls.currentFrame) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200/80">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              )}
            </motion.div>

            {/* Drag instruction */}
            {!controls.isDragging && !controls.isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-black/60 text-white text-sm px-3 py-1 rounded-full flex items-center space-x-2">
                  <Move3D className="h-4 w-4" />
                  <span>Drag to rotate • Click hotspots for details</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              {/* Playback Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                  className="flex items-center space-x-2"
                >
                  {controls.isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>{controls.isPlaying ? 'Pause' : 'Play'}</span>
                </Button>

                <Button variant="outline" size="sm" onClick={rotateLeft}>
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm" onClick={rotateRight}>
                  <RotateCw className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm" onClick={resetView}>
                  Reset
                </Button>
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-gray-600 min-w-12 text-center">
                  {Math.round(controls.zoom * 100)}%
                </span>
                
                <Button variant="outline" size="sm" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHotspots(!showHotspots)}
                  className={showHotspots ? 'bg-blue-50 text-blue-600' : ''}
                >
                  <Eye className="h-4 w-4" />
                  Hotspots
                </Button>

                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Frame Scrubber */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={frameImages.length - 1}
                value={controls.currentFrame}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  currentFrame: parseInt(e.target.value),
                  isPlaying: false
                }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Hotspot Details */}
            <AnimatePresence>
              {selectedHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  {(() => {
                    const hotspot = hotspots.find(h => h.id === selectedHotspot)
                    return hotspot ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-900">{hotspot.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedHotspot(null)}
                            className="h-6 w-6 p-0 text-blue-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-blue-800 text-sm">{hotspot.description}</p>
                      </div>
                    ) : null
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hotspot Navigation */}
            {hotspots.length > 0 && (
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-sm text-gray-600">Jump to:</span>
                {hotspots.map((hotspot) => (
                  <Button
                    key={hotspot.id}
                    variant="outline"
                    size="sm"
                    onClick={() => goToHotspot(hotspot)}
                    className={`text-xs ${
                      Math.abs(hotspot.frame - controls.currentFrame) <= 2
                        ? 'bg-blue-50 text-blue-600 border-blue-300'
                        : ''
                    }`}
                  >
                    {hotspot.title}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function Product360ViewerTrigger({ 
  productId, 
  productName, 
  className = "" 
}: { 
  productId: string
  productName: string
  className?: string 
}) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsViewerOpen(true)}
        variant="outline"
        className={`flex items-center space-x-2 ${className}`}
      >
        <Move3D className="h-4 w-4" />
        <span>360° View</span>
      </Button>

      <Product360Viewer
        productId={productId}
        productName={productName}
        images={[]} // Will be generated internally
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  )
}