'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from 'web-vitals'

interface MetricData {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production to avoid noise during development
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    const logMetric = (metric: MetricData) => {
      // Log to console in development
      console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`)
      
      // Send to analytics endpoint
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.sendBeacon) {
        const analyticsData = {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }
        
        // You can send this to your analytics service
        // navigator.sendBeacon('/api/analytics', JSON.stringify(analyticsData))
      }
    }

    // Core Web Vitals
    onCLS((metric) => logMetric(metric))
    onFCP((metric) => logMetric(metric))
    onFID((metric) => logMetric(metric))
    onLCP((metric) => logMetric(metric))
    onTTFB((metric) => logMetric(metric))
    
    // Interaction to Next Paint (new metric)
    onINP((metric) => logMetric(metric))

    // Additional performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor long tasks
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              console.warn('[Performance] Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
              })
            }
          })
          
          longTaskObserver.observe({ entryTypes: ['longtask'] })
          
          return () => {
            longTaskObserver.disconnect()
          }
        } catch (e) {
          // Long task monitoring not supported
        }
      }

      // Log navigation timing
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (navTiming) {
            console.log('[Performance] Navigation timing:', {
              domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
              domComplete: navTiming.domComplete - navTiming.domInteractive,
              loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart,
            })
          }
        }, 0)
      })
    }
  }, [])

  return null
}