import { useState, useEffect, useRef } from 'react'

interface UseIntersectionObserverProps {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
    setIsVisible(entry.isIntersecting)
  }

  useEffect(() => {
    const node = elementRef.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, frozen])

  return { ref: elementRef, entry, isVisible }
}

// Hook for lazy loading components
export function useLazyLoad(options?: UseIntersectionObserverProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true,
    ...options
  })

  return { ref, shouldLoad: isVisible }
}

// Hook for infinite scrolling
export function useInfiniteScroll(
  hasNextPage: boolean,
  isFetching: boolean,
  fetchNextPage: () => void,
  options?: UseIntersectionObserverProps
) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    ...options
  })

  useEffect(() => {
    if (isVisible && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [isVisible, hasNextPage, isFetching, fetchNextPage])

  return { ref }
}

// Hook for scroll-triggered animations
export function useScrollAnimation(options?: UseIntersectionObserverProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '-50px',
    freezeOnceVisible: true,
    ...options
  })

  return { ref, shouldAnimate: isVisible }
}