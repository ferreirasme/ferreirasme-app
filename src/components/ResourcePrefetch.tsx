'use client'

import { useEffect } from 'react'

// Critical images to prefetch
const criticalImages = [
  '/logo.png',
  '/images/modelos/9W0A5115.jpg',
  '/images/modelos/9W0A5131.jpg',
]

export default function ResourcePrefetch() {
  useEffect(() => {
    // Prefetch critical images
    criticalImages.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Prefetch critical routes
    const criticalRoutes = ['/api/contact']
    criticalRoutes.forEach((route) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })

    // Preload critical CSS for above-the-fold content
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Prefetch additional non-critical images during idle time
        const additionalImages = [
          '/images/modelos/9W0A5170.jpg',
          '/images/modelos/9W0A5228.jpg',
          '/images/semijoias/1696288412533.jpg',
        ]
        
        additionalImages.forEach((src) => {
          const img = new Image()
          img.src = src
        })
      })
    }
  }, [])

  return null
}