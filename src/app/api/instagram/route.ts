import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getInstagramMedia } from '@/lib/instagram'

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600
let cachedData: any = null
let cacheTimestamp: number = 0

interface InstagramPost {
  id: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  caption?: string
  permalink: string
  timestamp: string
  username: string
}

export async function GET(request: NextRequest) {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now()
    if (cachedData && (now - cacheTimestamp) < (CACHE_DURATION * 1000)) {
      return NextResponse.json(cachedData)
    }

    // Instagram API configuration
    const instagramUsername = 'ferreirasme'
    
    // Try to get access token from cookie first, then from environment
    const cookieStore = await cookies()
    const tokenFromCookie = cookieStore.get('instagram_token')?.value
    const accessToken = tokenFromCookie || process.env.INSTAGRAM_ACCESS_TOKEN
    
    if (!accessToken) {
      console.log('Instagram access token not configured, using fallback data')
      return NextResponse.json(getFallbackData())
    }

    // Fetch Instagram posts using the helper function
    const data = await getInstagramMedia(accessToken, 12)
    
    // Transform the data to our format
    const posts: InstagramPost[] = data.data.map((post: any) => ({
      id: post.id,
      media_url: post.media_url,
      media_type: post.media_type,
      caption: post.caption,
      permalink: post.permalink,
      timestamp: post.timestamp,
      username: post.username || instagramUsername
    }))
    
    // Update cache
    cachedData = { posts, lastUpdated: new Date().toISOString() }
    cacheTimestamp = now
    
    return NextResponse.json(cachedData)
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json(getFallbackData())
  }
}

function getFallbackData() {
  // Return fallback data when API is unavailable
  return {
    posts: [
      {
        id: 'fallback-1',
        media_url: '/images/modelos/9W0A5115.jpg',
        media_type: 'IMAGE',
        caption: 'Elegância em cada detalhe ✨',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme'
      },
      {
        id: 'fallback-2',
        media_url: '/images/modelos/9W0A5378.jpg',
        media_type: 'IMAGE',
        caption: 'Nova coleção chegando 💎',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme'
      },
      {
        id: 'fallback-3',
        media_url: '/images/semijoias/1696288412533.jpg',
        media_type: 'IMAGE',
        caption: 'Semijoias que contam histórias',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme'
      },
      {
        id: 'fallback-4',
        media_url: '/images/modelos/9W0A5720.jpg',
        media_type: 'IMAGE',
        caption: 'Brilhe com Ferreiras.Me',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme'
      },
      {
        id: 'fallback-5',
        media_url: '/images/modelos/9W0A6270.jpg',
        media_type: 'IMAGE',
        caption: 'Luxo e sofisticação',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme'
      },
      {
        id: 'fallback-6',
        media_url: '/images/semijoias/1696288412611.jpg',
        media_type: 'IMAGE',
        caption: 'Coleção exclusiva disponível',
        permalink: 'https://www.instagram.com/ferreirasme/',
        timestamp: new Date().toISOString(),
        username: 'ferreirasme'
      }
    ],
    lastUpdated: new Date().toISOString()
  }
}