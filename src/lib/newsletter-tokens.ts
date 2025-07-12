import crypto from 'crypto'
import { supabase } from './supabase'

// In-memory cache as fallback
const confirmationTokens = new Map<string, { email: string, timestamp: number }>()

// Helper function to generate confirmation token
export async function generateConfirmationToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  
  // Try to save in Supabase first
  if (supabase) {
    try {
      const { error } = await supabase
        .from('newsletter_confirmation_tokens')
        .insert([{
          token,
          email,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }])
      
      if (!error) {
        console.log('Token saved to Supabase')
        return token
      }
    } catch (err) {
      console.error('Error saving token to Supabase:', err)
    }
  }
  
  // Fallback to memory storage
  confirmationTokens.set(token, { email, timestamp: Date.now() })
  console.log('Token saved to memory (fallback)')
  
  // Clean up old tokens
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  const tokensToDelete: string[] = []
  
  confirmationTokens.forEach((data, t) => {
    if (data.timestamp < oneDayAgo) {
      tokensToDelete.push(t)
    }
  })
  
  tokensToDelete.forEach(t => confirmationTokens.delete(t))
  
  return token
}

export async function validateConfirmationToken(token: string): Promise<{ email: string } | null> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('newsletter_confirmation_tokens')
        .select('email, used, expires_at')
        .eq('token', token)
        .single()
      
      if (!error && data) {
        // Check if not used and not expired
        if (!data.used && new Date(data.expires_at) > new Date()) {
          // Mark as used
          await supabase
            .from('newsletter_confirmation_tokens')
            .update({ used: true, used_at: new Date().toISOString() })
            .eq('token', token)
          
          return { email: data.email }
        }
      }
    } catch (err) {
      console.error('Error validating token in Supabase:', err)
    }
  }
  
  // Fallback to memory
  const data = confirmationTokens.get(token)
  if (!data) return null
  
  // Check if token is expired (24 hours)
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  if (data.timestamp < oneDayAgo) {
    confirmationTokens.delete(token)
    return null
  }
  
  confirmationTokens.delete(token) // Remove after use
  return { email: data.email }
}