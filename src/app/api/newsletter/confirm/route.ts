import { NextResponse } from 'next/server'
import { validateConfirmationToken } from '@/lib/newsletter-tokens'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token de confirmação é obrigatório' },
        { status: 400 }
      )
    }

    // Validate token
    const validation = validateConfirmationToken(token)
    if (!validation) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // In a real application, you would save the confirmed email to database
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Inscrição confirmada com sucesso!',
      email: validation.email
    })
    
  } catch (error) {
    console.error('Erro na confirmação:', error)
    return NextResponse.json(
      { error: 'Erro ao confirmar inscrição. Tente novamente.' },
      { status: 500 }
    )
  }
}