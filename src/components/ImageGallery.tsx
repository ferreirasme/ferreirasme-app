'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageItem {
  src: string
  alt: string
  category: 'modelo' | 'semijoia'
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'modelo' | 'semijoia'>('all')

  useEffect(() => {
    const allImages: ImageItem[] = [
      // Fotos das modelos
      { src: '/images/modelos/9W0A5115.jpg', alt: 'Modelo com brinco dourado', category: 'modelo' },
      { src: '/images/modelos/9W0A5131.jpg', alt: 'Modelo com acessórios', category: 'modelo' },
      { src: '/images/modelos/9W0A5170.jpg', alt: 'Modelo perfil', category: 'modelo' },
      { src: '/images/modelos/9W0A5228.jpg', alt: 'Modelo com semijoias', category: 'modelo' },
      { src: '/images/modelos/9W0A5378.jpg', alt: 'Modelo elegante', category: 'modelo' },
      { src: '/images/modelos/9W0A5720.jpg', alt: 'Modelo fashion', category: 'modelo' },
      { src: '/images/modelos/9W0A5751.jpg', alt: 'Modelo estilo', category: 'modelo' },
      { src: '/images/modelos/9W0A5805.jpg', alt: 'Modelo luxo', category: 'modelo' },
      { src: '/images/modelos/9W0A6270.jpg', alt: 'Modelo sofisticada', category: 'modelo' },
      { src: '/images/modelos/9W0A6308.jpg', alt: 'Modelo exclusiva', category: 'modelo' },
      
      // Fotos das semijoias
      { src: '/images/semijoias/1696288258266.jpg', alt: 'Conjunto rosa com anel', category: 'semijoia' },
      { src: '/images/semijoias/1696288412533.jpg', alt: 'Semijoias douradas', category: 'semijoia' },
      { src: '/images/semijoias/1696288412611.jpg', alt: 'Coleção exclusiva', category: 'semijoia' },
    ]
    setImages(allImages)
  }, [])

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  return (
    <div>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setSelectedCategory('modelo')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'modelo' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Modelos
        </button>
        <button
          onClick={() => setSelectedCategory('semijoia')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'semijoia' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Semijoias
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  )
}