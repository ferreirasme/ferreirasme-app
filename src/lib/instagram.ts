// Instagram API Configuration and Helper Functions

export interface InstagramConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

export interface InstagramTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
}

export interface InstagramUserProfile {
  id: string
  username: string
  account_type: string
  media_count: number
}

// Instagram OAuth URLs
export const INSTAGRAM_AUTH_URL = 'https://api.instagram.com/oauth/authorize'
export const INSTAGRAM_TOKEN_URL = 'https://api.instagram.com/oauth/access_token'
export const INSTAGRAM_GRAPH_URL = 'https://graph.instagram.com'

// Default scopes for Instagram API
export const DEFAULT_SCOPES = [
  'user_profile',
  'user_media'
]

/**
 * Generate Instagram OAuth authorization URL
 */
export function getInstagramAuthUrl(config: Partial<InstagramConfig>): string {
  const params = new URLSearchParams({
    client_id: config.clientId || process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || '',
    redirect_uri: config.redirectUri || process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || '',
    scope: (config.scope || DEFAULT_SCOPES).join(','),
    response_type: 'code'
  })
  
  return `${INSTAGRAM_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function getInstagramAccessToken(
  code: string,
  config: Partial<InstagramConfig>
): Promise<InstagramTokenResponse> {
  const formData = new FormData()
  formData.append('client_id', config.clientId || process.env.INSTAGRAM_CLIENT_ID || '')
  formData.append('client_secret', config.clientSecret || process.env.INSTAGRAM_CLIENT_SECRET || '')
  formData.append('grant_type', 'authorization_code')
  formData.append('redirect_uri', config.redirectUri || process.env.INSTAGRAM_REDIRECT_URI || '')
  formData.append('code', code)
  
  const response = await fetch(INSTAGRAM_TOKEN_URL, {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Get Instagram user profile
 */
export async function getInstagramUserProfile(accessToken: string): Promise<InstagramUserProfile> {
  const response = await fetch(
    `${INSTAGRAM_GRAPH_URL}/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
  )
  
  if (!response.ok) {
    throw new Error(`Failed to get user profile: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Get Instagram media posts
 */
export async function getInstagramMedia(
  accessToken: string,
  limit: number = 12,
  fields: string = 'id,media_type,media_url,caption,permalink,timestamp'
) {
  const response = await fetch(
    `${INSTAGRAM_GRAPH_URL}/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
  )
  
  if (!response.ok) {
    throw new Error(`Failed to get media: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Refresh Instagram long-lived access token
 */
export async function refreshInstagramToken(accessToken: string): Promise<InstagramTokenResponse> {
  const response = await fetch(
    `${INSTAGRAM_GRAPH_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
  )
  
  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Check if Instagram token is expired or about to expire
 */
export function isTokenExpired(expiresAt: string | Date): boolean {
  const expirationDate = new Date(expiresAt)
  const now = new Date()
  const bufferTime = 24 * 60 * 60 * 1000 // 24 hours buffer
  
  return now.getTime() + bufferTime >= expirationDate.getTime()
}