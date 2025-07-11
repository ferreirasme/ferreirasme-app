'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Product } from '@/types/product'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
        {/* Badge de Destaque */}
        {product.featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
              Destaque
            </span>
          </div>
        )}

        {/* Badge de Esgotado */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
            <span className="bg-white text-black px-6 py-2 rounded-full font-medium">
              Esgotado
            </span>
          </div>
        )}

        {/* Imagem do Produto */}
        <Link href={`/produto/${product.id}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
          />
        </Link>

        {/* Overlay com Ações */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
        />

        {/* Botões de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-4 right-4 flex justify-between items-center"
        >
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorite(!isFavorite)
              }}
              className={cn(
                "p-3 rounded-full backdrop-blur-md transition-all duration-300",
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
              aria-label="Adicionar aos favoritos"
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>

            <Link
              href={`/produto/${product.id}`}
              className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300"
              aria-label="Ver detalhes"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {product.inStock && (
            <button
              onClick={(e) => {
                e.preventDefault()
                addToCart(product, 1)
              }}
              className="p-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-all duration-300"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Informações do Produto */}
      <div className="mt-4">
        <Link href={`/produto/${product.id}`}>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-semibold text-neutral-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex flex-wrap gap-1">
            {product.materials.slice(0, 2).map((material, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full"
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}