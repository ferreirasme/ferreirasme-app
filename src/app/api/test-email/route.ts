import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    console.log('API Key exists:', !!process.env.RESEND_API_KEY)
    console.log('API Key length:', process.env.RESEND_API_KEY?.length)
    
    const data = await resend.emails.send({
      from: 'Teste Ferreiras.Me <onboarding@resend.dev>',
      to: 'contato@ferreirasme.com',
      subject: 'Teste de Email - Ferreiras.Me',
      html: `
        <h1>Teste de Email</h1>
        <p>Este é um email de teste enviado em: ${new Date().toLocaleString('pt-BR')}</p>
        <p>Se você recebeu este email, o sistema está funcionando corretamente!</p>
      `
    })

    return NextResponse.json({ 
      success: true,
      message: 'Email de teste enviado!',
      data: {
        id: (data as any).id || 'enviado',
        from: 'onboarding@resend.dev',
        to: 'contato@ferreirasme.com',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    console.error('Erro detalhado:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao enviar email',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}