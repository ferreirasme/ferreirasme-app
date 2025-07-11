'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import AnimatedSection from '@/components/AnimatedSection'
import MagneticButton from '@/components/MagneticButton'
import { useCart } from '@/contexts/CartContext'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 299 ? 0 : 29.90
  const discount = appliedCoupon === 'PRIMEIRA10' ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const applyCoupon = () => {
    if (couponCode === 'PRIMEIRA10') {
      setAppliedCoupon(couponCode)
    } else {
      alert('Cupom inválido')
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-white dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-20">
            <AnimatedSection className="text-center">
              <ShoppingBag className="w-24 h-24 mx-auto text-neutral-300 dark:text-neutral-700 mb-6" />
              <h1 className="text-3xl font-light mb-4">Seu carrinho está vazio</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                Adicione produtos incríveis ao seu carrinho!
              </p>
              <Link
                href="/catalogo"
                className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                Continuar Comprando
              </Link>
            </AnimatedSection>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-neutral-900 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 py-12">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fadeUp">
              <h1 className="text-3xl md:text-4xl font-light text-center">
                Meu <span className="text-yellow-600 dark:text-yellow-400">Carrinho</span>
              </h1>
            </AnimatedSection>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/produto/${item.product.id}`}
                          className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link
                                href={`/produto/${item.product.id}`}
                                className="font-medium text-lg hover:text-yellow-600 transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                {item.product.materials.join(', ')}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-600 transition-colors p-2"
                              aria-label="Remover do carrinho"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex justify-between items-center">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-lg font-semibold">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {formatPrice(item.product.price)} cada
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <Link
                    href="/catalogo"
                    className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-yellow-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continuar Comprando</span>
                  </Link>

                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    Limpar Carrinho
                  </button>
                </div>
              </AnimatedSection>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-medium mb-6">Resumo do Pedido</h2>

                  {/* Coupon */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Cupom de Desconto</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Digite o código"
                        className="flex-1 px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        disabled={!!appliedCoupon}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!!appliedCoupon}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-colors",
                          appliedCoupon
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : "bg-yellow-400 text-black hover:bg-yellow-500"
                        )}
                      >
                        {appliedCoupon ? 'Aplicado' : 'Aplicar'}
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-green-600 text-sm mt-2">
                        Cupom {appliedCoupon} aplicado com sucesso!
                      </p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Frete</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Grátis</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-semibold">{formatPrice(total)}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          ou 3x de {formatPrice(total / 3)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <MagneticButton className="w-full">
                    <Link
                      href="/checkout"
                      className="block w-full py-3 bg-yellow-400 text-black text-center rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                    >
                      Finalizar Compra
                    </Link>
                  </MagneticButton>

                  {/* Security Info */}
                  <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                    <p>🔒 Compra 100% segura</p>
                    <p className="mt-1">Aceitamos todos os cartões</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}