export interface Testimonial {
  id: string
  name: string
  avatar?: string
  rating: number
  comment: string
  date: Date
  verified: boolean
  product?: string
}