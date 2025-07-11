'use client'

import { useState, useEffect } from 'react'
import { Instagram, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { getInstagramAuthUrl } from '@/lib/instagram'

export default function InstagramSettings() {
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      // Check if we have an Instagram connection
      const response = await fetch('/api/instagram')
      if (response.ok) {
        const data = await response.json()
        if (data.posts && data.posts.length > 0 && !data.posts[0].id.startsWith('fallback')) {
          setIsConnected(true)
          setUsername(data.posts[0].username)
        }
      }
    } catch (error) {
      console.error('Error checking Instagram connection:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    const authUrl = getInstagramAuthUrl({
      clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI
    })
    
    window.location.href = authUrl
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Instagram className="w-8 h-8 text-yellow-400" />
        <h3 className="text-2xl font-light tracking-wider text-yellow-400">
          Instagram Integration
        </h3>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-light">Connected to @{username}</span>
          </div>
          <p className="text-white/70 text-sm font-light">
            Your Instagram feed is connected and will automatically display your latest posts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-yellow-400/70">
            <AlertCircle className="w-5 h-5" />
            <span className="font-light">Not connected</span>
          </div>
          <p className="text-white/70 text-sm font-light mb-4">
            Connect your Instagram account to display your latest posts on the website.
          </p>
          
          {process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID ? (
            <button
              onClick={handleConnect}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-light tracking-wider py-3 px-6 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Connect Instagram Account
            </button>
          ) : (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-400 text-sm font-light">
                Instagram API credentials not configured. Please add the following environment variables:
              </p>
              <ul className="mt-2 text-white/70 text-sm font-mono">
                <li>NEXT_PUBLIC_INSTAGRAM_CLIENT_ID</li>
                <li>NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI</li>
                <li>INSTAGRAM_CLIENT_SECRET</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="text-lg font-light text-white mb-3">Setup Instructions:</h4>
        <ol className="space-y-2 text-white/70 text-sm font-light">
          <li>1. Create a Facebook App at developers.facebook.com</li>
          <li>2. Add Instagram Basic Display product to your app</li>
          <li>3. Configure OAuth Redirect URI: {process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || 'https://yourdomain.com/api/auth/instagram/callback'}</li>
          <li>4. Add the required environment variables to your .env file</li>
          <li>5. Click "Connect Instagram Account" to authorize</li>
        </ol>
      </div>
    </div>
  )
}