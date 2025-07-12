'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Instagram, Mail, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'

interface NavigationProps {
  className?: string
}

const navItems = [
  { name: 'Início', href: '/' },
  { name: 'Contacto', href: '/contacto' },
]

export default function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-background/90 backdrop-blur-md shadow-2xl' : 'bg-transparent',
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Brand Name */}
            <Link href="/" className="relative z-10">
              <span className="text-2xl md:text-3xl font-light tracking-wider text-yellow-400">
                FERREIRAS.ME
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-yellow-400 transition-colors duration-200 font-light tracking-wider text-sm uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <ThemeToggle />
              
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-foreground/80 hover:text-yellow-400 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background/95 backdrop-blur-md z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 text-foreground/80 hover:text-yellow-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Brand Name */}
                <div className="mb-8">
                  <span className="text-2xl font-light tracking-wider text-yellow-400">
                    FERREIRAS.ME
                  </span>
                </div>


                {/* Mobile Navigation */}
                <nav className="mb-8">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-3 text-foreground/80 hover:text-yellow-400 transition-colors font-light tracking-wider text-lg border-b border-foreground/10"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>


                {/* Contact Info */}
                <div className="border-t border-foreground/10 pt-8 space-y-4">
                  <a
                    href="https://www.instagram.com/ferreirasme/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-foreground/60 hover:text-yellow-400 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>@ferreirasme</span>
                  </a>

                  <a
                    href="mailto:contacto@ferreirasme.com"
                    className="flex items-center space-x-3 text-foreground/60 hover:text-yellow-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>contacto@ferreirasme.com</span>
                  </a>

                  <a
                    href="tel:+351999999999"
                    className="flex items-center space-x-3 text-foreground/60 hover:text-yellow-400 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+351 999 999 999</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}