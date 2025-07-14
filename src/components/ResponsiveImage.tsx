'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  onClick?: () => void
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  priority = false,
  onClick
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isWebPSupported, setIsWebPSupported] = useState(true)

  // Detectar suporte a WebP
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const result = canvas.toDataURL('image/webp').indexOf('image/webp') === 5
      setIsWebPSupported(result)
    }
    checkWebPSupport()
  }, [])

  // Gerar srcset responsivo
  const generateSrcSet = () => {
    const basePath = src.replace(/\.(jpg|jpeg|png)$/i, '')
    const ext = isWebPSupported ? 'webp' : 'jpg'
    
    // Se a imagem estiver na pasta optimized, usar as versões otimizadas
    if (src.includes('/images/') && !src.includes('/optimized/')) {
      const optimizedBase = src.replace('/images/', '/images/optimized/').replace(/\.(jpg|jpeg|png)$/i, '')
      
      return {
        src: `${optimizedBase}-mobile.${ext}`,
        srcSet: `
          ${optimizedBase}-mobile.${ext} 640w,
          ${optimizedBase}-tablet.${ext} 1024w,
          ${optimizedBase}-desktop.${ext} 1920w
        `.trim(),
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px'
      }
    }
    
    // Fallback para imagens não otimizadas
    return {
      src: currentSrc,
      srcSet: undefined,
      sizes: undefined
    }
  }

  const { src: imageSrc, srcSet, sizes } = generateSrcSet()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
      )}
      
      <picture>
        {/* WebP para navegadores modernos */}
        {isWebPSupported && srcSet && (
          <source
            type="image/webp"
            srcSet={srcSet}
            sizes={sizes}
          />
        )}
        
        {/* JPEG fallback */}
        {srcSet && (
          <source
            type="image/jpeg"
            srcSet={srcSet.replace(/\.webp/g, '.jpg')}
            sizes={sizes}
          />
        )}
        
        {/* Imagem padrão */}
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${onClick ? 'cursor-pointer' : ''}`}
          onLoad={() => setIsLoading(false)}
          onClick={onClick}
          onError={() => {
            // Fallback para imagem original se houver erro
            if (imageSrc !== src) {
              setCurrentSrc(src)
            }
            setIsLoading(false)
          }}
        />
      </picture>
    </div>
  )
}