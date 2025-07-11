'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Heart, MessageCircle, Loader2 } from 'lucide-react'

interface InstagramPost {
  id: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  caption?: string
  permalink: string
  timestamp: string
  username: string
  like_count?: number
  comments_count?: number
}

interface InstagramFeedProps {
  limit?: number
  className?: string
}

export default function InstagramFeed({ limit = 6, className = '' }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInstagramPosts()
  }, [])

  const fetchInstagramPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/instagram')
      
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts')
      }
      
      const data = await response.json()
      setPosts(data.posts.slice(0, limit))
    } catch (err) {
      console.error('Error fetching Instagram posts:', err)
      setError('Unable to load Instagram feed')
      
      // Set fallback posts for demonstration
      setPosts(getFallbackPosts().slice(0, limit))
    } finally {
      setLoading(false)
    }
  }

  const getFallbackPosts = (): InstagramPost[] => {
    // Fallback posts using existing images
    return [
      {
        id: '1',
        media_url: '/images/modelos/9W0A5115.jpg',
        media_type: 'IMAGE',
        caption: 'Elegância em cada detalhe ✨',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme',
        like_count: 234,
        comments_count: 12
      },
      {
        id: '2',
        media_url: '/images/modelos/9W0A5378.jpg',
        media_type: 'IMAGE',
        caption: 'Nova coleção chegando 💎',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme',
        like_count: 342,
        comments_count: 23
      },
      {
        id: '3',
        media_url: '/images/semijoias/1696288412533.jpg',
        media_type: 'IMAGE',
        caption: 'Semijoias que contam histórias',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme',
        like_count: 456,
        comments_count: 34
      },
      {
        id: '4',
        media_url: '/images/modelos/9W0A5720.jpg',
        media_type: 'IMAGE',
        caption: 'Brilhe com Ferreiras.Me',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme',
        like_count: 567,
        comments_count: 45
      },
      {
        id: '5',
        media_url: '/images/modelos/9W0A6270.jpg',
        media_type: 'IMAGE',
        caption: 'Luxo e sofisticação',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme',
        like_count: 678,
        comments_count: 56
      },
      {
        id: '6',
        media_url: '/images/semijoias/1696288412611.jpg',
        media_type: 'IMAGE',
        caption: 'Coleção exclusiva disponível',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme',
        like_count: 789,
        comments_count: 67
      }
    ]
  }

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className={className}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <Instagram className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-light tracking-wider text-yellow-400">
            SIGA-NOS NO INSTAGRAM
          </h2>
        </div>
        <p className="text-white/70 font-light">
          @ferreirasme - Acompanhe nossas novidades e lançamentos
        </p>
      </motion.div>

      {error && !posts.length && (
        <div className="text-center text-white/50 py-8">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative block"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              {/* Gold border effect */}
              <div className="absolute inset-0 p-[1px] bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-400 rounded-2xl">
                <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
                  <Image
                    src={post.media_url}
                    alt={post.caption || 'Instagram post'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay with Instagram info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Instagram handle */}
                      <div className="flex items-center gap-2 mb-3">
                        <Instagram className="w-4 h-4 text-white" />
                        <span className="text-sm text-white font-light">@{post.username}</span>
                      </div>
                      
                      {/* Caption */}
                      {post.caption && (
                        <p className="text-white/90 text-sm mb-3 line-clamp-2 font-light">
                          {post.caption}
                        </p>
                      )}
                      
                      {/* Engagement metrics */}
                      <div className="flex items-center gap-4">
                        {post.like_count && (
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
                            <span className="text-white/80 text-sm">{post.like_count}</span>
                          </div>
                        )}
                        {post.comments_count && (
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4 text-white/80" />
                            <span className="text-white/80 text-sm">{post.comments_count}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Instagram icon indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-2">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* View more on Instagram button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12"
      >
        <a
          href="https://www.instagram.com/ferreirasme/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-light tracking-wider py-4 px-8 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
        >
          <Instagram className="w-5 h-5" />
          VER MAIS NO INSTAGRAM
        </a>
      </motion.div>
    </div>
  )
}