'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Instagram, Mail, Sparkles } from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'
import Navigation from '@/components/Navigation'

// Dynamic imports for better code splitting
const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div className="animate-pulse bg-foreground/10 h-96 rounded-lg" />
})
const GoldParticles = dynamic(() => import('@/components/GoldParticles'), {
  ssr: false
})
const ImageModal = dynamic(() => import('@/components/ImageModal'))
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'))
const NewsletterForm = dynamic(() => import('@/components/NewsletterForm'))
const InstagramFeed = dynamic(() => import('@/components/InstagramFeed'), {
  loading: () => <div className="animate-pulse bg-foreground/10 h-96 rounded-lg" />
})

interface ImageItem {
  src: string
  alt: string
  category: 'modelo' | 'semijoia'
}

const images: ImageItem[] = [
  // Fotos das modelos
  { src: '/images/modelos/9W0A5115.jpg', alt: 'Modelo elegante usando brinco dourado exclusivo Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A5131.jpg', alt: 'Modelo sofisticada com conjunto de semijoias douradas Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A5170.jpg', alt: 'Perfil de modelo exibindo brincos de design exclusivo Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A5228.jpg', alt: 'Modelo usando coleção completa de semijoias premium Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A5378.jpg', alt: 'Modelo elegante com colar e brincos dourados exclusivos Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A5720.jpg', alt: 'Modelo fashion destacando tendências em semijoias Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A5751.jpg', alt: 'Modelo com estilo único usando peças exclusivas Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A5805.jpg', alt: 'Modelo luxuosa com conjunto premium de semijoias Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A6270.jpg', alt: 'Modelo sofisticada exibindo joias artesanais exclusivas Ferreiras.Me', category: 'modelo' },
  { src: '/images/modelos/9W0A6308.jpg', alt: 'Modelo com peças exclusivas da coleção limitada Ferreiras.Me', category: 'modelo' },
  
  // Fotos das semijoias
  { src: '/images/semijoias/1696288412533.jpg', alt: 'Coleção de semijoias douradas premium com acabamento de alta qualidade Ferreiras.Me', category: 'semijoia' },
  { src: '/images/semijoias/1696288412611.jpg', alt: 'Coleção exclusiva de semijoias artesanais com design único Ferreiras.Me', category: 'semijoia' },
]

export default function Home() {
  const [showContact, setShowContact] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    // Check URL parameters for Instagram OAuth callback
    const params = new URLSearchParams(window.location.search)
    const instagramStatus = params.get('instagram')
    const error = params.get('error')
    
    if (instagramStatus === 'connected') {
      setNotification({ type: 'success', message: 'Instagram ligado com sucesso!' })
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (error) {
      setNotification({ type: 'error', message: `Erro ao ligar Instagram: ${error}` })
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    // Auto-hide notification after 5 seconds
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleImageClick = (image: ImageItem) => {
    const index = images.findIndex(img => img.src === image.src)
    setSelectedImageIndex(index)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background text-foreground relative">
        <GoldParticles />
        <WhatsAppButton />
      
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
      
      {/* Luxury Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent" />
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 pt-32 pb-16 relative">
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
                alt="Ferreiras.Me - Logo da marca de semijoias exclusivas"
                width={380}
                height={160}
                className="relative drop-shadow-2xl"
                priority
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl md:text-2xl text-yellow-400 mb-6 font-light tracking-wider"
            >
              SEMIJOIAS EXCLUSIVAS
            </motion.h1>
            
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


      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <NewsletterForm />
      </div>

      
      {/* Instagram Feed Section */}
      <div className="container mx-auto px-4 py-16">
        <InstagramFeed limit={6} />
      </div>

      {/* Elegant Actions */}
      <div id="contacto" className="container mx-auto px-4 py-12">
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
            <div className="relative bg-foreground/10 backdrop-blur-md text-foreground font-light tracking-wider py-4 px-8 rounded-full border border-foreground/30 hover:border-foreground/50 transition-all duration-300 flex items-center gap-3">
              <Instagram className="w-5 h-5" />
              INSTAGRAM
            </div>
          </a>
          
          <button
            onClick={() => setShowContact(!showContact)}
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-foreground/10 backdrop-blur-md text-foreground font-light tracking-wider py-4 px-8 rounded-full border border-foreground/30 hover:border-foreground/50 transition-all duration-300 flex items-center gap-3">
              <Mail className="w-5 h-5" />
              CONTACTO
            </div>
          </button>
        </motion.div>

        {/* Elegant Contact Form */}
        {showContact && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mb-16 bg-foreground/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-foreground/20"
          >
            <h2 className="text-2xl font-light tracking-wider text-center mb-6 text-yellow-400">
              ENTRE EM CONTACTO
            </h2>
            <ContactForm />
          </motion.div>
        )}
      </div>

      {/* Emotional Call */}
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            Porque cada peça carrega uma{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              preciosa história
            </span>
          </h2>
          <p className="text-xl text-foreground/70 font-light">
            Nossas semijoias são mais que acessórios. São memórias, momentos e emoções 
            transformadas em joias exclusivas que acompanham sua jornada.
          </p>
        </motion.div>
      </div>

      {/* Luxury Gallery Section */}
      <div className="container mx-auto px-4 pb-20">
        {/* Luxury Image Gallery */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
              onClick={() => handleImageClick(image)}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                {/* Gold border effect */}
                <div className="absolute inset-0 p-[1px] bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-400 rounded-2xl">
                  <div className="relative w-full h-full bg-background rounded-2xl overflow-hidden">
                    <OptimizedImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      quality={80}
                    />
                    
                    {/* Luxury overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-foreground/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Image Modal with Navigation */}
      <ImageModal
        images={images}
        currentIndex={selectedImageIndex ?? 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        onNavigate={setSelectedImageIndex}
      />

      {/* Luxury Footer */}
      <footer className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="relative bg-background/50 backdrop-blur-md border-t border-yellow-400/20">
          <div className="container mx-auto px-4 py-12 text-center">
            <Image
              src="/logo.png"
              alt="Ferreiras.Me - Logótipo rodapé"
              width={180}
              height={80}
              className="mx-auto mb-6 opacity-80"
              loading="lazy"
            />
            <p className="text-yellow-400/80 font-light tracking-wider mb-2">FERREIRAS.ME</p>
            <p className="text-foreground/50 text-sm font-light">© 2023-{new Date().getFullYear()} - Todos os direitos reservados</p>
            <p className="text-foreground/30 text-xs font-light mt-4">
              <a href="/descadastrar" className="hover:text-foreground/50 transition-colors">
                Descadastrar newsletter
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
    </>
  )
}// Force redeploy Thu Jul 10 15:10:09 BST 2025
// Force deploy after public: Thu Jul 10 15:20:04 BST 2025
