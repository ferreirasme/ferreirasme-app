'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Mail, Sparkles, Crown, Gem } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import GoldParticles from '@/components/GoldParticles'
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
  { src: '/images/semijoias/1696288412533.jpg', alt: 'Semijoias douradas', category: 'semijoia' },
  { src: '/images/semijoias/1696288412611.jpg', alt: 'Coleção exclusiva', category: 'semijoia' },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'modelo' | 'semijoia'>('all')
  const [showContact, setShowContact] = useState(false)

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative">
      <GoldParticles />
      
      {/* Luxury Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 py-8 md:py-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8 relative inline-block"
            >
              <div className="absolute inset-0 blur-3xl bg-yellow-400/30 animate-pulse" />
              <Image
                src="/logo.png"
                alt="Ferreiras.Me"
                width={380}
                height={160}
                className="relative drop-shadow-2xl"
              />
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl md:text-2xl text-yellow-400 mb-6 font-light tracking-wider"
            >
              SEMIJOIAS EXCLUSIVAS
            </motion.p>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="inline-block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 blur-lg animate-pulse" />
              <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium px-8 py-3 rounded-full shadow-2xl">
                <p>EM BREVE</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Elegant Actions */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <a
            href="https://www.instagram.com/ferreirasme/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/10 backdrop-blur-md text-white font-light tracking-wider py-4 px-8 rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3">
              <Instagram className="w-5 h-5" />
              INSTAGRAM
            </div>
          </a>
          
          <button
            onClick={() => setShowContact(!showContact)}
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white/10 backdrop-blur-md text-white font-light tracking-wider py-4 px-8 rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3">
              <Mail className="w-5 h-5" />
              CONTATO
            </div>
          </button>
        </motion.div>

        {/* Elegant Contact Form */}
        {showContact && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mb-16 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-light tracking-wider text-center mb-6 text-yellow-400">
              ENTRE EM CONTATO
            </h3>
            <ContactForm />
          </motion.div>
        )}
      </div>

      {/* Luxury Gallery Section */}
      <div className="container mx-auto px-4 pb-20">
        {/* Elegant Filter */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { value: 'all', label: 'TODAS' },
            { value: 'modelo', label: 'MODELOS' },
            { value: 'semijoia', label: 'JOIAS' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedCategory(filter.value as any)}
              className={`relative px-8 py-3 font-light tracking-wider transition-all duration-300 ${
                selectedCategory === filter.value 
                  ? 'text-black' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {selectedCategory === filter.value && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative">{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Luxury Image Gallery */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.src}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                    {/* Gold border effect */}
                    <div className="absolute inset-0 p-[1px] bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-400 rounded-2xl">
                      <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        
                        {/* Luxury overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                        
                        {/* Text overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-sm font-light tracking-wider text-white/90">{image.alt}</p>
                          <div className="mt-2 h-[1px] w-12 bg-gradient-to-r from-yellow-400 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-black/95 border-yellow-400/20">
                  <div className="relative w-full" style={{ height: '85vh' }}>
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

      {/* Luxury Footer */}
      <footer className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="relative bg-black/50 backdrop-blur-md border-t border-yellow-400/20">
          <div className="container mx-auto px-4 py-12 text-center">
            <Image
              src="/logo.png"
              alt="Ferreiras.Me"
              width={180}
              height={80}
              className="mx-auto mb-6 opacity-80"
            />
            <p className="text-yellow-400/80 font-light tracking-wider mb-2">FERREIRAS.ME</p>
            <p className="text-white/50 text-sm font-light">© 2024 - Todos os direitos reservados</p>
            <div className="mt-6 flex justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400/50" />
              <p className="text-white/40 text-xs font-light tracking-wider">LUXO • ELEGÂNCIA • EXCLUSIVIDADE</p>
              <Sparkles className="w-4 h-4 text-yellow-400/50" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}