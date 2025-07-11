'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  offset?: number
}

export default function ParallaxSection({ 
  children, 
  className = '',
  offset = 50
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4])

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          y,
          opacity
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}