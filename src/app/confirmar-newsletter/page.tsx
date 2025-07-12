'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Sparkles, Instagram, ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import GoldParticles from '@/components/GoldParticles'

export default function ConfirmarNewsletter() {
  const searchParams = useSearchParams()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const token = searchParams.get('token')

  useEffect(() => {
    const confirmSubscription = async () => {
      if (token) {
        try {
          const response = await fetch('/api/newsletter/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          })
          
          if (response.ok) {
            setIsConfirmed(true)
          }
        } catch (error) {
          console.error('Erro ao confirmar inscrição:', error)
        }
      }
      setIsLoading(false)
    }

    confirmSubscription()
  }, [token])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative">
        <GoldParticles />
        
        <div className="container mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-12 relative inline-block"
            >
              <div className="absolute inset-0 blur-3xl bg-yellow-400/30 animate-pulse" />
              <Image
                src="/logo.png"
                alt="Ferreiras.Me - Logo"
                width={280}
                height={120}
                className="relative drop-shadow-2xl"
                priority
              />
            </motion.div>

            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-white/10 rounded-lg mb-4 max-w-md mx-auto" />
                <div className="h-4 bg-white/10 rounded-lg max-w-sm mx-auto" />
              </div>
            ) : (
              <>
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.3 
                  }}
                  className="mb-8"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-yellow-400/50 blur-2xl animate-pulse" />
                    <CheckCircle className="w-24 h-24 text-yellow-400 relative" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-4xl md:text-5xl font-light mb-6"
                >
                  Inscrição Confirmada!
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xl text-white/70 mb-12 leading-relaxed max-w-lg mx-auto"
                >
                  Bem-vinda ao mundo exclusivo Ferreiras.Me! 
                  Prepare-se para descobrir semijoias que transformam momentos em memórias preciosas.
                </motion.p>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/10"
                >
                  <h2 className="text-2xl font-light text-yellow-400 mb-6">
                    O que esperar:
                  </h2>
                  <div className="space-y-4 text-left max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-white/80">Acesso antecipado às novas coleções exclusivas</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-white/80">Ofertas especiais apenas para assinantes</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-white/80">Histórias e inspirações por trás de cada peça</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-white/80">Convites para eventos exclusivos</p>
                    </div>
                  </div>
                </motion.div>

                {/* Call to Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Link
                    href="/"
                    className="group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-white/10 backdrop-blur-md text-white font-light tracking-wider py-4 px-8 rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3">
                      <ArrowRight className="w-5 h-5" />
                      VOLTAR AO SITE
                    </div>
                  </Link>

                  <a
                    href="https://www.instagram.com/ferreirasme/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-white/10 backdrop-blur-md text-white font-light tracking-wider py-4 px-8 rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3">
                      <Instagram className="w-5 h-5" />
                      SEGUIR NO INSTAGRAM
                    </div>
                  </a>
                </motion.div>

                {/* Instagram Preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="mt-16 text-center"
                >
                  <p className="text-white/50 mb-4">
                    Acompanhe nossas novidades diariamente
                  </p>
                  <p className="text-yellow-400 font-light tracking-wider">
                    @ferreirasme
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </main>
    </>
  )
}