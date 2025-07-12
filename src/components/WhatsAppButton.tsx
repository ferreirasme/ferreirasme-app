'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { analytics, trackConversion } from '@/lib/analytics/analytics-events'

export default function WhatsAppButton() {
  const whatsappNumber = '351912465539'
  const message = 'Olá! Gostaria de saber mais sobre as semijoias Ferreiras.Me'
  
  const handleClick = () => {
    // Track WhatsApp click and conversion
    analytics.engagement.whatsappClick()
    trackConversion('WhatsApp Contact', undefined, {
      contact_method: 'whatsapp',
      button_location: 'fixed_bottom_right',
    })
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-colors"
    >
      <MessageCircle className="w-6 h-6" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
    </motion.button>
  )
}