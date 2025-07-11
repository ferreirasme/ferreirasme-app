import { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: '1',
    name: 'Colar Imperatriz Dourado',
    description: 'Colar de design exclusivo com acabamento em ouro 18k, inspirado na realeza e elegância imperial.',
    price: 890.00,
    images: ['/images/semijoias/1696288412533.jpg'],
    category: 'colar',
    tags: ['luxo', 'dourado', 'exclusivo', 'festa'],
    featured: true,
    inStock: true,
    materials: ['Ouro 18k', 'Zircônia'],
    dimensions: {
      length: 45,
      weight: 28
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Brinco Cascata Real',
    description: 'Brincos em cascata com cristais austríacos e acabamento em ouro rosé.',
    price: 650.00,
    images: ['/images/semijoias/1696288412611.jpg'],
    category: 'brinco',
    tags: ['elegante', 'rosé', 'cristais', 'festa'],
    featured: true,
    inStock: true,
    materials: ['Ouro Rosé', 'Cristal Austríaco'],
    dimensions: {
      length: 8,
      weight: 12
    },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    name: 'Pulseira Infinity Premium',
    description: 'Pulseira delicada com símbolo do infinito cravejado com micro zircônias.',
    price: 420.00,
    images: ['/images/modelos/9W0A5115.jpg'],
    category: 'pulseira',
    tags: ['delicada', 'infinito', 'zircônia', 'dia-a-dia'],
    featured: false,
    inStock: true,
    materials: ['Prata 925', 'Zircônia'],
    dimensions: {
      length: 18,
      weight: 8
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '4',
    name: 'Anel Solitário Luxo',
    description: 'Anel solitário com zircônia de 2 quilates, ideal para ocasiões especiais.',
    price: 780.00,
    images: ['/images/modelos/9W0A5131.jpg'],
    category: 'anel',
    tags: ['solitário', 'luxo', 'noivado', 'especial'],
    featured: true,
    inStock: true,
    materials: ['Ouro 18k', 'Zircônia 2ct'],
    dimensions: {
      weight: 6
    },
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: '5',
    name: 'Conjunto Versailles',
    description: 'Conjunto completo com colar, brincos e pulseira, inspirado nos jardins de Versailles.',
    price: 1890.00,
    images: ['/images/modelos/9W0A5228.jpg'],
    category: 'conjunto',
    tags: ['conjunto', 'completo', 'luxo', 'presente'],
    featured: true,
    inStock: true,
    materials: ['Ouro 18k', 'Pérolas', 'Zircônia'],
    dimensions: {
      weight: 65
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '6',
    name: 'Colar Choker Moderna',
    description: 'Choker contemporânea com design minimalista e acabamento espelhado.',
    price: 520.00,
    images: ['/images/modelos/9W0A5378.jpg'],
    category: 'colar',
    tags: ['moderno', 'minimalista', 'choker', 'tendência'],
    featured: false,
    inStock: true,
    materials: ['Prata 925', 'Ródio'],
    dimensions: {
      length: 35,
      weight: 18
    },
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')
  },
  {
    id: '7',
    name: 'Brinco Argola Twisted',
    description: 'Argolas médias com design torcido e acabamento texturizado.',
    price: 380.00,
    images: ['/images/modelos/9W0A5720.jpg'],
    category: 'brinco',
    tags: ['argola', 'moderno', 'dia-a-dia', 'versátil'],
    featured: false,
    inStock: true,
    materials: ['Ouro 18k'],
    dimensions: {
      width: 3,
      weight: 10
    },
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07')
  },
  {
    id: '8',
    name: 'Pulseira Tennis Deluxe',
    description: 'Pulseira tennis clássica com zircônias de alto brilho em toda extensão.',
    price: 1250.00,
    images: ['/images/modelos/9W0A5751.jpg'],
    category: 'pulseira',
    tags: ['tennis', 'clássico', 'luxo', 'brilhante'],
    featured: true,
    inStock: false,
    materials: ['Ouro Branco 18k', 'Zircônia AAA'],
    dimensions: {
      length: 19,
      weight: 22
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }
]