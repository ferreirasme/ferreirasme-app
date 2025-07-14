'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { analytics, trackConversion } from '@/lib/analytics/analytics-events'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error' | 'loading' | null>(null)
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      return 'Correio eletrónico é obrigatório'
    }
    if (!emailRegex.test(email)) {
      return 'Correio eletrónico inválido'
    }
    return ''
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    // Validar em tempo real
    if (emailError) {
      const error = validateEmail(value)
      setEmailError(error)
    }
    
    // Limpar status quando usuário começa a digitar
    if (status) {
      setStatus('')
      setStatusType(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar email
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }
    
    // Track form start
    analytics.form.start('Newsletter Form')
    
    setStatus('A enviar...')
    setStatusType('loading')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('Obrigado! Verifique o seu correio eletrónico para confirmar.')
        setStatusType('success')
        
        // Track successful newsletter signup and conversion
        analytics.engagement.newsletterSignup(email, true)
        trackConversion('Newsletter Signup', undefined, {
          form_name: 'Newsletter Form',
          user_email_hash: btoa(email), // Basic hash for privacy
        })
        
        setEmail('')
        setEmailError('')
        setTimeout(() => {
          setStatus('')
          setStatusType(null)
        }, 10000)
      } else {
        setStatus(data.error || 'Erro ao registar. Tente novamente.')
        setStatusType('error')
        setTimeout(() => {
          setStatus('')
          setStatusType(null)
        }, 5000)
      }
    } catch (error) {
      setStatus('Erro ao registar. Tente novamente.')
      setStatusType('error')
      
      // Track failed newsletter signup
      analytics.engagement.newsletterSignup(email, false)
      
      setTimeout(() => {
        setStatus('')
        setStatusType(null)
      }, 5000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="bg-gradient-to-r from-purple-900/10 to-pink-900/10 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-md rounded-3xl p-8 border border-purple-400/20"
    >
      <h3 className="text-2xl font-light tracking-wider text-center mb-2 text-yellow-400">
        SEJA A PRIMEIRA A SABER
      </h3>
      <p className="text-center text-foreground/70 mb-6">
        Registe-se e receba ofertas exclusivas do lançamento
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="O seu melhor correio eletrónico"
            required
            aria-required="true"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : undefined}
            disabled={statusType === 'loading'}
            className={`w-full px-6 py-3 bg-foreground/10 border rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
              emailError
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-foreground/20 focus:ring-yellow-400/50'
            } ${
              statusType === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          {emailError && (
            <p id="email-error" className="mt-2 text-sm text-red-500 px-6">{emailError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={statusType === 'loading'}
          className={`px-8 py-3 font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
            statusType === 'loading'
              ? 'bg-foreground/20 text-foreground/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-400/30 transform hover:scale-105'
          }`}
        >
          <Send className={`w-4 h-4 ${statusType === 'loading' ? 'animate-pulse' : ''}`} />
          {statusType === 'loading' ? 'A enviar...' : 'Registar'}
        </button>
      </form>
      
      {status && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mt-4 font-light ${
            statusType === 'success' ? 'text-green-500' : 
            statusType === 'error' ? 'text-red-500' : 
            'text-yellow-400'
          }`}
        >
          {status}
        </motion.p>
      )}
    </motion.div>
  )
}