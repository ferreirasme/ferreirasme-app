'use client'

import InstagramFeed from '@/components/InstagramFeed'
import InstagramSettings from '@/components/InstagramSettings'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TestInstagramPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-8">
      <div className="container mx-auto max-w-6xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>
        
        <h1 className="text-4xl font-light tracking-wider text-yellow-400 mb-12 text-center">
          Instagram Integration Test
        </h1>
        
        <div className="grid gap-12">
          {/* Settings Section */}
          <section>
            <h2 className="text-2xl font-light text-white mb-6">Configuration Status</h2>
            <InstagramSettings />
          </section>
          
          {/* Feed Preview Section */}
          <section>
            <h2 className="text-2xl font-light text-white mb-6">Feed Preview</h2>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <InstagramFeed limit={6} />
            </div>
          </section>
          
          {/* Debug Info */}
          <section className="bg-black/30 rounded-lg p-6">
            <h3 className="text-lg font-light text-yellow-400 mb-4">Debug Information</h3>
            <div className="space-y-2 text-sm font-mono text-white/70">
              <p>Client ID configured: {process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID ? '✓' : '✗'}</p>
              <p>Redirect URI: {process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || 'Not set'}</p>
              <p>API Endpoint: /api/instagram</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}