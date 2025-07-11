'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'todos', label: 'Todos os Produtos' },
  { value: 'colar', label: 'Colares' },
  { value: 'brinco', label: 'Brincos' },
  { value: 'pulseira', label: 'Pulseiras' },
  { value: 'anel', label: 'Anéis' },
  { value: 'conjunto', label: 'Conjuntos' }
]

const sortOptions = [
  { value: 'featured', label: 'Destaques' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'name', label: 'Nome A-Z' }
]

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filtrar por categoria
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filtrar por preço
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Filtrar por estoque
    if (showOnlyInStock) {
      filtered = filtered.filter(p => p.inStock)
    }

    // Ordenar
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [selectedCategory, sortBy, priceRange, showOnlyInStock])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-neutral-900 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fadeUp">
              <h1 className="text-4xl md:text-5xl font-light text-center text-neutral-900 dark:text-white">
                Catálogo de <span className="text-yellow-600 dark:text-yellow-400">Semijoias</span>
              </h1>
              <p className="mt-4 text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Descubra nossa coleção exclusiva de peças artesanais, criadas com os melhores materiais
                e design único para realçar sua beleza.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'grid'
                        ? "bg-yellow-400 text-black"
                        : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                    aria-label="Visualização em grade"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'list'
                        ? "bg-yellow-400 text-black"
                        : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                    aria-label="Visualização em lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {filteredProducts.length} produtos
                </span>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-10 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3">Categorias</h3>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg transition-colors",
                            selectedCategory === cat.value
                              ? "bg-yellow-400 text-black"
                              : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-3">Faixa de Preço</h3>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Other Filters */}
                  <div>
                    <h3 className="font-medium mb-3">Outros Filtros</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnlyInStock}
                        onChange={(e) => setShowOnlyInStock(e.target.checked)}
                        className="rounded border-neutral-300"
                      />
                      <span>Apenas produtos em estoque</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid'
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}>
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('todos')
                    setPriceRange([0, 5000])
                    setShowOnlyInStock(false)
                  }}
                  className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}