'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Data de lançamento: 1 de Fevereiro de 2025
    const launchDate = new Date('2025-02-01T00:00:00')
    
    const timer = setInterval(() => {
      const now = new Date()
      const difference = launchDate.getTime() - now.getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-black/20 backdrop-blur-md rounded-3xl p-8 border border-yellow-400/20"
    >
      <h3 className="text-2xl font-light tracking-wider text-yellow-400 text-center mb-6">
        LANÇAMENTO OFICIAL EM
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-4">
              <span className="text-3xl md:text-4xl font-bold text-black">
                {value.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs md:text-sm text-yellow-400/80 mt-2 uppercase tracking-wider">
              {unit === 'days' ? 'Dias' : unit === 'hours' ? 'Horas' : unit === 'minutes' ? 'Min' : 'Seg'}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}