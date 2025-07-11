'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate sizes automatically if not provided
  const generateSizes = () => {
    if (sizes) return sizes
    if (fill) return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    return undefined
  }

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse rounded-lg" />
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 rounded-lg">
          <span className="text-neutral-400 text-sm">Failed to load image</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          priority={priority}
          sizes={generateSizes()}
          loading={priority ? 'eager' : 'lazy'}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      )}
    </div>
  )
}