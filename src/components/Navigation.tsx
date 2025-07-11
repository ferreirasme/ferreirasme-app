'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Instagram, Mail, Phone, ShoppingBag, Heart, User, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import { useCart } from '@/contexts/CartContext'

interface NavigationProps {
  className?: string
}

const navItems = [
  { name: 'Início', href: '/' },
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '#contato' },
]

export default function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { getItemsCount } = useCart()

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
          isScrolled ? 'bg-black/90 backdrop-blur-md shadow-2xl' : 'bg-transparent',
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <Image
                src="/logo.png"
                alt="Ferreiras.Me"
                width={150}
                height={60}
                className="w-auto h-12 md:h-14"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-yellow-400 transition-colors duration-200 font-light tracking-wider text-sm uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <ThemeToggle />
              
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-white/80 hover:text-yellow-400 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <Link
                href="/favoritos"
                className="text-white/80 hover:text-yellow-400 transition-colors relative"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </Link>

              <Link
                href="/carrinho"
                className="text-white/80 hover:text-yellow-400 transition-colors relative"
                aria-label="Carrinho"
              >
                <ShoppingBag className="w-5 h-5" />
                {getItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {getItemsCount()}
                  </span>
                )}
              </Link>

              <Link
                href="/conta"
                className="text-white/80 hover:text-yellow-400 transition-colors"
                aria-label="Minha Conta"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white/80 hover:text-yellow-400 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/10 overflow-hidden"
              >
                <div className="py-4">
                  <form className="relative max-w-2xl mx-auto">
                    <input
                      type="search"
                      placeholder="Buscar produtos..."
                      className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 px-6 py-3 pr-12 rounded-full border border-white/20 focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-500 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-md z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 text-white/80 hover:text-yellow-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Logo */}
                <div className="mb-8">
                  <Image
                    src="/logo.png"
                    alt="Ferreiras.Me"
                    width={150}
                    height={60}
                    className="w-auto h-12"
                  />
                </div>

                {/* Search Mobile */}
                <form className="mb-8">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Buscar..."
                      className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 pr-10 rounded-full border border-white/20 focus:border-yellow-400 focus:outline-none transition-colors text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  </div>
                </form>

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
                        className="block py-3 text-white/80 hover:text-yellow-400 transition-colors font-light tracking-wider text-lg border-b border-white/10"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="space-y-4 mb-8">
                  <Link
                    href="/favoritos"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-3 text-white/80 hover:text-yellow-400 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <Heart className="w-5 h-5" />
                      <span>Favoritos</span>
                    </span>
                    <span className="bg-yellow-400/20 text-yellow-400 text-sm px-2 py-1 rounded">0</span>
                  </Link>

                  <Link
                    href="/carrinho"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-3 text-white/80 hover:text-yellow-400 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span>Carrinho</span>
                    </span>
                    {getItemsCount() > 0 && (
                      <span className="bg-yellow-400/20 text-yellow-400 text-sm px-2 py-1 rounded">
                        {getItemsCount()}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/conta"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 py-3 text-white/80 hover:text-yellow-400 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Minha Conta</span>
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="border-t border-white/10 pt-8 space-y-4">
                  <a
                    href="https://www.instagram.com/ferreirasme/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-white/60 hover:text-yellow-400 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>@ferreirasme</span>
                  </a>

                  <a
                    href="mailto:contato@ferreirasme.com"
                    className="flex items-center space-x-3 text-white/60 hover:text-yellow-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>contato@ferreirasme.com</span>
                  </a>

                  <a
                    href="tel:+351999999999"
                    className="flex items-center space-x-3 text-white/60 hover:text-yellow-400 transition-colors"
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