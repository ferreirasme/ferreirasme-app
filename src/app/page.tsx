'use client'

import { useState } from 'react'
import ImageGallery from '@/components/ImageGallery'
import ContactForm from '@/components/ContactForm'

export default function Home() {
  const [showGallery, setShowGallery] = useState(false)
  const [showContact, setShowContact] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Ferreiras.Me
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-2">Semijoias Exclusivas</p>
          <div className="inline-block bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 mb-8">
            <p className="text-lg font-semibold text-yellow-800">🚧 Site em Construção 🚧</p>
            <p className="text-sm text-yellow-700">Em breve, uma experiência única em semijoias!</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Enquanto isso...
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setShowGallery(!showGallery)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105"
              >
                {showGallery ? 'Ocultar' : 'Ver'} Galeria
              </button>
              
              <a
                href="https://instagram.com/ferreiras.me"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 px-6 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 transform hover:scale-105 text-center"
              >
                Siga no Instagram
              </a>
              
              <button
                onClick={() => setShowContact(!showContact)}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-500 transition duration-300 transform hover:scale-105"
              >
                {showContact ? 'Ocultar' : 'Abrir'} Contato
              </button>
            </div>

            {showGallery && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
                  Nossa Coleção
                </h3>
                <ImageGallery />
              </div>
            )}

            {showContact && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
                  Entre em Contato
                </h3>
                <ContactForm />
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-gray-600">
                Aguarde novidades incríveis que estão por vir!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                © 2024 Ferreiras.Me - Todos os direitos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}