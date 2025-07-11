'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import { cn } from '@/lib/utils'
import AnimatedSection from './AnimatedSection'

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <AnimatedSection className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white">
            O que nossas <span className="text-yellow-600 dark:text-yellow-400">clientes dizem</span>
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Depoimentos reais de mulheres que confiam na qualidade e elegância das nossas semijoias
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400/20">
              <Quote className="w-16 h-16" />
            </div>

            {/* Testimonial Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {/* Avatar */}
                  <div className="mb-6 relative inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-yellow-400/20">
                      <Image
                        src={currentTestimonial.avatar || '/images/avatar-placeholder.jpg'}
                        alt={currentTestimonial.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    {currentTestimonial.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Verificado
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < currentTestimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-300 dark:text-neutral-600"
                        )}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                    "{currentTestimonial.comment}"
                  </p>

                  {/* Name and Product */}
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {currentTestimonial.name}
                    </p>
                    {currentTestimonial.product && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        Comprou: {currentTestimonial.product}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-400 hover:text-black transition-colors"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false)
                        setCurrentIndex(index)
                      }}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        index === currentIndex
                          ? "w-8 bg-yellow-400"
                          : "bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400"
                      )}
                      aria-label={`Ir para depoimento ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-400 hover:text-black transition-colors"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Additional Testimonials Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={testimonial.avatar || '/images/avatar-placeholder.jpg'}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}