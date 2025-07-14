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
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  })

  const validateField = (name: string, value: string) => {
    let error = ''
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Nome é obrigatório'
        } else if (value.length < 2) {
          error = 'Nome deve ter pelo menos 2 caracteres'
        } else if (value.length > 100) {
          error = 'Nome muito longo (máximo 100 caracteres)'
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          error = 'Correio eletrónico é obrigatório'
        } else if (!emailRegex.test(value)) {
          error = 'Correio eletrónico inválido'
        }
        break
      case 'message':
        if (!value.trim()) {
          error = 'Mensagem é obrigatória'
        } else if (value.length < 10) {
          error = 'Mensagem deve ter pelo menos 10 caracteres'
        } else if (value.length > 1000) {
          error = 'Mensagem muito longa (máximo 1000 caracteres)'
        }
        break
    }
    
    return error
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Validar campo em tempo real
    const error = validateField(name, value)
    setErrors({
      ...errors,
      [name]: error
    })
    
    // Limpar mensagem de submit quando usuário começa a digitar novamente
    if (submitMessage) {
      setSubmitMessage('')
      setSubmitStatus(null)
    }
    
    // Track form field interaction
    analytics.form.fieldInteraction('Contact Form', name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar todos os campos antes de enviar
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message)
    }
    
    setErrors(newErrors)
    
    // Se houver erros, não enviar
    if (Object.values(newErrors).some(error => error !== '')) {
      setSubmitMessage('Por favor, corrija os erros antes de enviar')
      setSubmitStatus('error')
      return
    }
    
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitStatus(null)
    
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
        setSubmitMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setErrors({ name: '', email: '', message: '' })
        
        // Track successful form submission and conversion
        analytics.form.submit('Contact Form', true)
        trackConversion('Contact Form Submission', undefined, {
          form_name: 'Contact Form',
          user_email: formData.email,
        })
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => {
          setSubmitMessage('')
          setSubmitStatus(null)
        }, 5000)
      } else {
        setSubmitMessage(data.error || 'Erro ao enviar mensagem. Tente novamente.')
        setSubmitStatus('error')
        
        // Track failed form submission
        analytics.form.submit('Contact Form', false)
      }
    } catch (error) {
      setSubmitMessage('Erro ao enviar mensagem. Tente novamente mais tarde.')
      setSubmitStatus('error')
      
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
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          maxLength={100}
          className={`w-full px-4 py-3 bg-foreground/5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
            errors.name 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500/50' 
              : 'border-foreground/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
          } text-foreground placeholder-foreground/30`}
          placeholder="O seu nome completo"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
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
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full px-4 py-3 bg-foreground/5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
            errors.email 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500/50' 
              : 'border-foreground/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
          } text-foreground placeholder-foreground/30`}
          placeholder="o.seu@email.com"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
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
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          rows={4}
          maxLength={1000}
          className={`w-full px-4 py-3 bg-foreground/5 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all duration-300 ${
            errors.message 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500/50' 
              : 'border-foreground/20 focus:ring-yellow-400/50 focus:border-yellow-400/50'
          } text-foreground placeholder-foreground/30`}
          placeholder="A sua mensagem..."
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
        <p className="mt-1 text-xs text-foreground/50">
          {formData.message.length}/1000 caracteres
        </p>
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
        <div className={`mt-6 p-4 rounded-lg text-center font-light tracking-wider transition-all duration-300 ${
          submitStatus === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-500'
            : 'bg-red-500/10 border border-red-500/30 text-red-500'
        }`}>
          {submitMessage}
        </div>
      )}
    </form>
  )
}