'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Product } from '@/types/product'
import { CartItem, CartContextType } from '@/types/cart'

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('ferreirasme-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ferreirasme-cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToCart = (product: Product, quantity: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id)
      
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...currentItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemsCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}