'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate'
  delay?: number
  duration?: number
  stagger?: number
}

const animations: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 }
  }
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  stagger = 0.1
}: AnimatedSectionProps) {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 })

  return (
    <motion.section
      ref={ref as any}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      <motion.div
        variants={animations[animation]}
        transition={{
          duration,
          ease: [0.4, 0, 0.2, 1] // Custom easing curve
        }}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}