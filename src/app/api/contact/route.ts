import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    console.log('Recebendo contato:', { name, email, message })

    // Validação básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('Enviando email via Resend...')
    console.log('API Key presente:', !!process.env.RESEND_API_KEY)

    // Enviar email via Resend
    const data = await resend.emails.send({
      from: 'Ferreiras.Me <onboarding@resend.dev>',
      to: 'contato@ferreirasme.com',
      reply_to: email,
      subject: `Novo contato via site - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
            Novo Contato via Site
          </h2>
          
          <div style="margin: 20px 0; background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 5px;">
              ${message}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #FFD700; color: black; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">📧 Responda diretamente este email para entrar em contato com ${name}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            Este email foi enviado através do formulário de contato do site Ferreiras.Me
          </p>
        </div>
      `
    })

    console.log('Resposta do Resend:', data)

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado com sucesso!',
      debug: {
        emailId: data.id,
        from: 'onboarding@resend.dev',
        to: 'contato@ferreirasme.com'
      }
    })
    
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao enviar email. Tente novamente mais tarde.',
        debug: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}