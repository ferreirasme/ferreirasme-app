import crypto from 'crypto'

// Simple in-memory storage for demo purposes
// In production, use a database to store and validate tokens
const confirmationTokens = new Map<string, { email: string, timestamp: number }>()

// Helper function to generate confirmation token
export function generateConfirmationToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  confirmationTokens.set(token, { email, timestamp: Date.now() })
  
  // Clean up old tokens (older than 24 hours)
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  for (const [t, data] of confirmationTokens.entries()) {
    if (data.timestamp < oneDayAgo) {
      confirmationTokens.delete(t)
    }
  }
  
  return token
}

export function validateConfirmationToken(token: string): { email: string } | null {
  const data = confirmationTokens.get(token)
  if (!data) return null
  
  // Check if token is expired (24 hours)
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  if (data.timestamp < oneDayAgo) {
    confirmationTokens.delete(token)
    return null
  }
  
  return { email: data.email }
}