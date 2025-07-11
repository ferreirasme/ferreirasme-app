'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

// Generate particles only once
const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    })
  }
  return particles
}

export default function GoldParticles() {
  const [isVisible, setIsVisible] = useState(false)
  
  // Reduce particle count for better performance
  const particles = useMemo(() => generateParticles(20), [])

  useEffect(() => {
    // Only render particles after initial page load
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Reduce particles on low-end devices
    if ('matchMedia' in window) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (prefersReducedMotion.matches) {
        return () => clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, transparent 70%)',
            boxShadow: '0 0 10px #FFD700',
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}