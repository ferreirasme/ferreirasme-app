import { NextResponse } from 'next/server'
import { validateConfirmationToken } from '@/lib/newsletter-tokens'
import { confirmNewsletterSubscriber } from '@/lib/newsletter-db'
import { updateEmailConfirmationInBackup, backupEmailToFile } from '@/lib/email-backup'

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
    const validation = await validateConfirmationToken(token)
    if (!validation) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // SEMPRE atualizar no backup primeiro
    const backupUpdated = await updateEmailConfirmationInBackup(validation.email)
    
    // Também registrar a confirmação como novo evento
    await backupEmailToFile({
      email: validation.email,
      timestamp: new Date().toISOString(),
      confirmed: true,
      source: 'confirmation'
    })
    
    // Tentar confirmar no banco de dados
    const { success } = await confirmNewsletterSubscriber(validation.email)
    
    if (!success && !backupUpdated) {
      return NextResponse.json(
        { error: 'Erro ao confirmar inscrição. Tente novamente.' },
        { status: 500 }
      )
    }
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