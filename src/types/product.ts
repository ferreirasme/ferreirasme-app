export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: 'colar' | 'brinco' | 'pulseira' | 'anel' | 'conjunto'
  tags: string[]
  featured: boolean
  inStock: boolean
  materials: string[]
  dimensions?: {
    length?: number
    width?: number
    weight?: number
  }
  createdAt: Date
  updatedAt: Date
}