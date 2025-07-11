'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { analytics, trackConversion } from '@/lib/analytics/analytics-events'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Track form start
    analytics.form.start('Newsletter Form')
    
    // Por enquanto, apenas simula o envio
    setStatus('Enviando...')
    
    try {
      // Aqui você pode integrar com um serviço de newsletter
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('Obrigado! Você será avisado em primeira mão!')
      
      // Track successful newsletter signup and conversion
      analytics.engagement.newsletterSignup(email, true)
      trackConversion('Newsletter Signup', undefined, {
        form_name: 'Newsletter Form',
        user_email_hash: btoa(email), // Basic hash for privacy
      })
      
      setEmail('')
      
      setTimeout(() => setStatus(''), 5000)
    } catch (error) {
      setStatus('Erro ao cadastrar. Tente novamente.')
      
      // Track failed newsletter signup
      analytics.engagement.newsletterSignup(email, false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-md rounded-3xl p-8 border border-purple-400/20"
    >
      <h3 className="text-2xl font-light tracking-wider text-center mb-2 text-yellow-400">
        SEJA A PRIMEIRA A SABER
      </h3>
      <p className="text-center text-white/70 mb-6">
        Cadastre-se e receba ofertas exclusivas do lançamento
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor email"
          required
          className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        />
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium rounded-full hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Cadastrar
        </button>
      </form>
      
      {status && (
        <p className="text-center mt-4 text-yellow-400">
          {status}
        </p>
      )}
    </motion.div>
  )
}