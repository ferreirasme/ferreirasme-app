'use client'

import { useState } from 'react'
import { analytics, trackConversion } from '@/lib/analytics/analytics-events'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Track form field interaction
    analytics.form.fieldInteraction('Contact Form', e.target.name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    
    // Track form submission start
    analytics.form.start('Contact Form')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage('Mensagem enviada com sucesso! Entraremos em contacto em breve.')
        setFormData({ name: '', email: '', message: '' })
        
        // Track successful form submission and conversion
        analytics.form.submit('Contact Form', true)
        trackConversion('Contact Form Submission', undefined, {
          form_name: 'Contact Form',
          user_email: formData.email,
        })
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => setSubmitMessage(''), 5000)
      } else {
        setSubmitMessage(data.error || 'Erro ao enviar mensagem. Tente novamente.')
        
        // Track failed form submission
        analytics.form.submit('Contact Form', false)
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setSubmitMessage('Erro ao enviar mensagem. Tente novamente mais tarde.')
      
      // Track form submission error
      analytics.form.submit('Contact Form', false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <label htmlFor="name" className="block text-yellow-400/80 font-light tracking-wider text-sm mb-2">
          NOME
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-foreground/5 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-foreground placeholder-foreground/30 transition-all duration-300"
          placeholder="O seu nome completo"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-yellow-400/80 font-light tracking-wider text-sm mb-2">
          CORREIO ELETRÓNICO
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-foreground/5 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-foreground placeholder-foreground/30 transition-all duration-300"
          placeholder="o.seu@email.com"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-yellow-400/80 font-light tracking-wider text-sm mb-2">
          MENSAGEM
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white placeholder-white/30 resize-none transition-all duration-300"
          placeholder="Sua mensagem..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`relative w-full py-4 px-6 rounded-lg font-light tracking-wider overflow-hidden transition-all duration-300 ${
          isSubmitting 
            ? 'bg-foreground/10 cursor-not-allowed text-foreground/50' 
            : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-400/30 transform hover:scale-[1.02]'
        }`}
      >
        {isSubmitting ? 'A ENVIAR...' : 'ENVIAR MENSAGEM'}
      </button>

      {submitMessage && (
        <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-yellow-400 text-center font-light tracking-wider">
          {submitMessage}
        </div>
      )}
    </form>
  )
}