'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Sparkles, Instagram, ArrowRight } from 'lucide-react'

export default function NewsletterConfirmation() {
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
          console.error('Erro ao confirmar:', error)
        }
      }
      setIsLoading(false)
    }

    confirmSubscription()
  }, [token])

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        {isLoading ? (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-lg">A confirmar a sua inscrição...</p>
          </div>
        ) : isConfirmed ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Inscrição Confirmada!
            </h1>

            <div className="prose prose-lg prose-invert mx-auto mb-12">
              <p className="text-muted-foreground leading-relaxed">
                Parabéns! A sua inscrição foi confirmada com sucesso. 
                Agora faz parte do nosso círculo exclusivo e será a primeira 
                a conhecer as nossas novidades.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="my-8 p-6 bg-foreground/5 backdrop-blur-md rounded-2xl border border-yellow-400/20"
              >
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-light text-yellow-400 mb-3">
                  O que esperar da Ferreiras.Me?
                </h3>
                <ul className="text-left space-y-3 text-muted-foreground">
                  <li>• Acesso antecipado às novas coleções</li>
                  <li>• Ofertas exclusivas para subscritores</li>
                  <li>• Conteúdo inspirador sobre joalharia</li>
                  <li>• Convites para eventos especiais</li>
                </ul>
              </motion.div>

              <p className="text-muted-foreground">
                Cada peça Ferreiras.Me é criada com paixão e dedicação aos detalhes, 
                transformando momentos em memórias preciosas que duram para sempre.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                Voltar ao Início
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <a
                href="https://www.instagram.com/ferreirasme/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground/10 backdrop-blur-md text-foreground rounded-lg font-medium border border-foreground/20 hover:border-yellow-400 transition-colors"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Seguir no Instagram
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-light mb-6">
              Link de Confirmação Inválido
            </h1>
            <p className="text-muted-foreground mb-8">
              O link de confirmação é inválido ou expirou. 
              Por favor, inscreva-se novamente.
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Voltar ao Início
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}