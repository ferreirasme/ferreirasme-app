'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import GoldParticles from '@/components/GoldParticles'

const NewsletterConfirmation = dynamic(() => import('@/components/NewsletterConfirmation'), {
  ssr: false
})

export default function ConfirmarNewsletterPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background text-foreground relative">
        <GoldParticles />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-yellow-400">A carregar...</p>
            </div>
          </div>
        }>
          <NewsletterConfirmation />
        </Suspense>
      </main>
    </>
  )
}