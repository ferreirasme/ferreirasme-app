import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple in-memory storage for demo purposes
// In production, use a database to store and validate tokens
const confirmationTokens = new Map<string, { email: string, timestamp: number }>()

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token de confirmação é obrigatório' },
        { status: 400 }
      )
    }

    // In a real application, you would validate the token against a database
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Inscrição confirmada com sucesso!'
    })
    
  } catch (error) {
    console.error('Erro na confirmação:', error)
    return NextResponse.json(
      { error: 'Erro ao confirmar inscrição. Tente novamente.' },
      { status: 500 }
    )
  }
}

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