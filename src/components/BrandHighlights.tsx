'use client'

import { motion } from 'framer-motion'
import { Shield, Gem, Heart, Award } from 'lucide-react'

const highlights = [
  {
    icon: Shield,
    title: '3 Anos de Garantia',
    description: 'Todas as peças com garantia total contra defeitos'
  },
  {
    icon: Gem,
    title: 'Materiais Premium',
    description: 'Ouro 18k, prata 925 e pedras selecionadas'
  },
  {
    icon: Heart,
    title: 'Feito com Amor',
    description: 'Cada peça carrega uma história única e especial'
  },
  {
    icon: Award,
    title: 'Design Exclusivo',
    description: 'Coleções autorais criadas por designers renomados'
  }
]

export default function BrandHighlights() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {highlights.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          whileHover={{ y: -5 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-300"
        >
          <div className="mb-4 inline-flex p-3 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-xl">
            <item.icon className="w-6 h-6 text-yellow-400" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">{item.title}</h4>
          <p className="text-sm text-white/60">{item.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}