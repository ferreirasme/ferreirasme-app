'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Mail, Sparkles } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ImageItem {
  src: string
  alt: string
  category: 'modelo' | 'semijoia'
}

const images: ImageItem[] = [
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'modelo' | 'semijoia'>('all')
  const [showContact, setShowContact] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Ferreiras.Me
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Semijoias Exclusivas
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </p>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-full px-6 py-3 shadow-lg"
            >
              <p className="text-lg font-semibold text-yellow-800">✨ Em Construção ✨</p>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href="https://instagram.com/ferreiras.me"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            Siga no Instagram
          </a>
          <button
            onClick={() => setShowContact(!showContact)}
            className="group flex items-center gap-2 bg-white text-gray-800 font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200"
          >
            <Mail className="w-5 h-5" />
            Entre em Contato
          </button>
        </div>

        {/* Contact Form */}
        {showContact && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-12 bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
              Entre em Contato
            </h3>
            <ContactForm />
          </motion.div>
        )}
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 pb-16">
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedCategory('modelo')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === 'modelo' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            Modelos
          </button>
          <button
            onClick={() => setSelectedCategory('semijoia')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === 'semijoia' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            Semijoias
          </button>
        </div>

        {/* Image Gallery */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.src}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-gradient-to-br from-purple-100 to-pink-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium">{image.alt}</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
                  <div className="relative w-full" style={{ height: '80vh' }}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-medium mb-2">Ferreiras.Me</p>
          <p className="text-sm opacity-90">© 2024 - Todos os direitos reservados</p>
          <p className="text-xs mt-4 opacity-75">Aguarde novidades incríveis!</p>
        </div>
      </footer>
    </main>
  )
}