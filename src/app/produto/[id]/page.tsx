'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import AnimatedSection from '@/components/AnimatedSection'
import MagneticButton from '@/components/MagneticButton'
import { products } from '@/data/products'
import { Heart, ShoppingBag, Share2, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

export default function ProductDetailPage() {
  const params = useParams()
  const product = products.find(p => p.id === params.id)
  const { addToCart } = useCart()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description')

  if (!product) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-white dark:bg-neutral-900 pt-20">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-medium mb-4">Produto não encontrado</h1>
            <Link href="/catalogo" className="text-yellow-600 hover:text-yellow-700">
              Voltar ao catálogo
            </Link>
          </div>
        </main>
      </>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // Produtos relacionados
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-neutral-900 pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-yellow-600">Início</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-yellow-600">Catálogo</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <AnimatedSection animation="fadeIn">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                      <span className="bg-white text-black px-6 py-2 rounded-full font-medium text-lg">
                        Esgotado
                      </span>
                    </div>
                  )}
                  <Image
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/80 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/80 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </AnimatedSection>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                        selectedImage === index
                          ? "border-yellow-400"
                          : "border-transparent hover:border-neutral-300"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <AnimatedSection animation="fadeUp">
                <div>
                  {product.featured && (
                    <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium mb-3">
                      Produto em Destaque
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white mb-2">
                    {product.name}
                  </h1>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end space-x-3">
                  <span className="text-3xl font-semibold text-neutral-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-neutral-500 text-sm mb-1">
                    ou 3x de {formatPrice(product.price / 3)} sem juros
                  </span>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="font-medium mb-2">Materiais</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantity and Actions */}
                {product.inStock && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantidade</label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleQuantityChange('decrease')}
                          className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange('increase')}
                          className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <MagneticButton className="flex-1">
                        <button 
                          onClick={() => addToCart(product, quantity)}
                          className="w-full py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2">
                          <ShoppingBag className="w-5 h-5" />
                          <span>Adicionar ao Carrinho</span>
                        </button>
                      </MagneticButton>

                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-colors",
                          isFavorite
                            ? "bg-red-500 border-red-500 text-white"
                            : "border-neutral-300 dark:border-neutral-700 hover:border-yellow-400"
                        )}
                      >
                        <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                      </button>

                      <button className="p-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 hover:border-yellow-400 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">Frete Grátis</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Acima de R$ 299</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">Garantia</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">3 anos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">Trocas</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Em até 30 dias</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex space-x-8">
                {(['description', 'details', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-4 font-medium transition-colors relative",
                      activeTab === tab
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    {tab === 'description' && 'Descrição'}
                    {tab === 'details' && 'Detalhes'}
                    {tab === 'shipping' && 'Envio'}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-neutral dark:prose-invert max-w-none"
                >
                  <p>{product.description}</p>
                  <p className="mt-4">
                    Esta peça exclusiva da Ferreiras.Me combina elegância e sofisticação, 
                    sendo perfeita para ocasiões especiais ou para elevar o visual do dia a dia. 
                    Cada detalhe foi cuidadosamente pensado para proporcionar beleza e conforto.
                  </p>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Especificações</h4>
                      <dl className="space-y-2">
                        {product.dimensions?.length && (
                          <div className="flex justify-between">
                            <dt className="text-neutral-600 dark:text-neutral-400">Comprimento:</dt>
                            <dd>{product.dimensions.length}cm</dd>
                          </div>
                        )}
                        {product.dimensions?.width && (
                          <div className="flex justify-between">
                            <dt className="text-neutral-600 dark:text-neutral-400">Largura:</dt>
                            <dd>{product.dimensions.width}cm</dd>
                          </div>
                        )}
                        {product.dimensions?.weight && (
                          <div className="flex justify-between">
                            <dt className="text-neutral-600 dark:text-neutral-400">Peso:</dt>
                            <dd>{product.dimensions.weight}g</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cuidados</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                        <li>Evite contato com produtos químicos</li>
                        <li>Guarde em local seco e arejado</li>
                        <li>Limpe com flanela macia</li>
                        <li>Retire antes do banho</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h4 className="font-medium mb-2">Prazos de Entrega</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Os prazos variam de acordo com a região:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Capitais:</span>
                        <span className="font-medium">3 a 5 dias úteis</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Interior:</span>
                        <span className="font-medium">5 a 8 dias úteis</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Regiões remotas:</span>
                        <span className="font-medium">8 a 12 dias úteis</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Política de Trocas</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Aceitamos trocas em até 30 dias após o recebimento do produto, 
                      desde que esteja em perfeitas condições e com a embalagem original.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-light mb-8">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/produto/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 mb-3">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-medium group-hover:text-yellow-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-semibold">{formatPrice(relatedProduct.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  )
}