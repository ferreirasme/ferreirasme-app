'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { analytics } from '@/lib/analytics/analytics-events'

interface ImageItem {
  src: string
  alt: string
  category: 'modelo' | 'semijoia'
}

interface ImageModalProps {
  images: ImageItem[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function ImageModal({ images, currentIndex, isOpen, onClose, onNavigate }: ImageModalProps) {
  // Track image view when modal opens
  useEffect(() => {
    if (isOpen && images[currentIndex]) {
      const image = images[currentIndex]
      analytics.engagement.imageView(image.alt, image.category)
    }
  }, [isOpen, currentIndex, images])

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1)
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, images.length, isOpen, onNavigate, onClose])

  const currentImage = images[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-black/95 border-yellow-400/20">
        <div className="relative w-full" style={{ height: '90vh' }}>
          {/* Imagem principal */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain"
              priority
              sizes="100vw"
              quality={90}
            />
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navegação Esquerda */}
          {currentIndex > 0 && (
            <button
              onClick={() => onNavigate(currentIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all hover:scale-110 z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Navegação Direita */}
          {currentIndex < images.length - 1 && (
            <button
              onClick={() => onNavigate(currentIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all hover:scale-110 z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Indicadores */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <span className="text-yellow-400 font-light text-sm">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Informações da imagem */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-50"
          >
            <p className="text-white/80 font-light tracking-wider">{currentImage.alt}</p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}