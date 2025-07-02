'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = "",
  onScroll
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    )

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length - 1, end + overscan)
    }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

  const visibleItems = useMemo(() => {
    const result = []
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        top: i * itemHeight
      })
    }
    return result
  }, [items, visibleRange, itemHeight])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, top }) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              top,
              width: '100%',
              height: itemHeight
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Optimized Grid Virtual List for product grids
interface VirtualGridProps<T> {
  items: T[]
  itemWidth: number
  itemHeight: number
  containerWidth: number
  containerHeight: number
  gap?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}

export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  gap = 16,
  renderItem,
  className = ""
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  const columnsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap))
  const totalRows = Math.ceil(items.length / columnsPerRow)
  const rowHeight = itemHeight + gap

  const visibleRowRange = useMemo(() => {
    const startRow = Math.floor(scrollTop / rowHeight)
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / rowHeight) + 1,
      totalRows - 1
    )

    return { startRow: Math.max(0, startRow), endRow }
  }, [scrollTop, rowHeight, containerHeight, totalRows])

  const visibleItems = useMemo(() => {
    const result = []
    for (let row = visibleRowRange.startRow; row <= visibleRowRange.endRow; row++) {
      for (let col = 0; col < columnsPerRow; col++) {
        const index = row * columnsPerRow + col
        if (index < items.length) {
          result.push({
            index,
            item: items[index],
            x: col * (itemWidth + gap),
            y: row * rowHeight
          })
        }
      }
    }
    return result
  }, [items, visibleRowRange, columnsPerRow, itemWidth, itemHeight, gap, rowHeight])

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div 
        style={{ 
          height: totalRows * rowHeight,
          position: 'relative',
          width: '100%'
        }}
      >
        {visibleItems.map(({ index, item, x, y }) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: itemWidth,
              height: itemHeight
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: (index % 10) * 0.02 }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Infinite Loading Virtual List
interface InfiniteVirtualListProps<T> {
  items: T[]
  hasNextPage: boolean
  isLoading: boolean
  loadMore: () => void
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  loadingComponent?: React.ReactNode
  threshold?: number
  className?: string
}

export function InfiniteVirtualList<T>({
  items,
  hasNextPage,
  isLoading,
  loadMore,
  itemHeight,
  containerHeight,
  renderItem,
  loadingComponent,
  threshold = 0.8,
  className = ""
}: InfiniteVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const newScrollTop = element.scrollTop
    setScrollTop(newScrollTop)

    // Check if we should load more
    const scrollHeight = element.scrollHeight
    const clientHeight = element.clientHeight
    const scrollPercent = (newScrollTop + clientHeight) / scrollHeight

    if (scrollPercent >= threshold && hasNextPage && !isLoading) {
      loadMore()
    }
  }, [hasNextPage, isLoading, loadMore, threshold])

  const totalHeight = items.length * itemHeight + (isLoading ? 100 : 0)

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 5,
      items.length - 1
    )

    return {
      start: Math.max(0, start - 5),
      end: Math.min(items.length - 1, end + 5)
    }
  }, [scrollTop, itemHeight, containerHeight, items.length])

  const visibleItems = useMemo(() => {
    const result = []
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        top: i * itemHeight
      })
    }
    return result
  }, [items, visibleRange, itemHeight])

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, top }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top,
              width: '100%',
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: items.length * itemHeight,
              width: '100%',
              height: 100
            }}
            className="flex items-center justify-center"
          >
            {loadingComponent || (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for window virtualization
export function useVirtualizer({
  count,
  estimateSize,
  overscan = 5
}: {
  count: number
  estimateSize: (index: number) => number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const items = useMemo(() => {
    let start = 0
    let end = count - 1

    if (containerHeight > 0) {
      // Calculate visible range
      let offset = 0
      start = 0
      
      while (offset < scrollTop && start < count) {
        offset += estimateSize(start)
        start++
      }
      
      start = Math.max(0, start - overscan)
      
      end = start
      offset = scrollTop
      
      while (offset < scrollTop + containerHeight && end < count) {
        offset += estimateSize(end)
        end++
      }
      
      end = Math.min(count - 1, end + overscan)
    }

    const visibleItems = []
    let offsetTop = 0
    
    for (let i = 0; i < start; i++) {
      offsetTop += estimateSize(i)
    }
    
    for (let i = start; i <= end; i++) {
      visibleItems.push({
        index: i,
        start: offsetTop,
        size: estimateSize(i)
      })
      offsetTop += estimateSize(i)
    }

    let totalSize = 0
    for (let i = 0; i < count; i++) {
      totalSize += estimateSize(i)
    }

    return {
      items: visibleItems,
      totalSize
    }
  }, [count, scrollTop, containerHeight, estimateSize, overscan])

  return {
    ...items,
    scrollToIndex: (index: number) => {
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += estimateSize(i)
      }
      setScrollTop(offset)
    },
    setScrollTop,
    setContainerHeight
  }
}