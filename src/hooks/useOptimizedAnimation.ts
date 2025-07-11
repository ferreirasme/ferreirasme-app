import { useEffect, useRef, useCallback } from 'react'

interface AnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useOptimizedAnimation(
  animationCallback: (element: Element) => void,
  options: AnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options
  const elementsRef = useRef<Set<Element>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for smooth animations
          requestAnimationFrame(() => {
            animationCallback(entry.target)
          })

          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(entry.target)
            elementsRef.current.delete(entry.target)
          }
        }
      })
    },
    [animationCallback, triggerOnce]
  )

  const observe = useCallback((element: Element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element)
      elementsRef.current.add(element)
    }
  }, [])

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element)
      elementsRef.current.delete(element)
    }
  }, [])

  useEffect(() => {
    // Only create observer if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin,
      })
    }

    return () => {
      // Cleanup
      if (observerRef.current) {
        elementsRef.current.forEach((element) => {
          observerRef.current?.unobserve(element)
        })
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold, rootMargin])

  return { observe, unobserve }
}

// Debounce helper for expensive operations
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  ) as T
}

// Throttle helper for scroll/resize events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false)

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args)
        inThrottle.current = true
        setTimeout(() => {
          inThrottle.current = false
        }, limit)
      }
    },
    [callback, limit]
  ) as T
}