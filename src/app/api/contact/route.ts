import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import DOMPurify from 'isomorphic-dompurify'
import { contactRateLimit } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Rate limiting
    try {
      await contactRateLimit()
    } catch (error) {
      return NextResponse.json(
        { error: 'Demasiadas tentativas. Por favor, aguarde antes de tentar novamente.' },
        { status: 429 }
      )
    }

    const { name, email, message } = await request.json()

    // Validação completa
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Correio eletrónico inválido' },
        { status: 400 }
      )
    }

    // Validação de comprimento
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Nome muito longo (máximo 100 caracteres)' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Mensagem muito longa (máximo 1000 caracteres)' },
        { status: 400 }
      )
    }

    // Sanitização dos inputs
    const sanitizedName = DOMPurify.sanitize(name.trim())
    const sanitizedEmail = DOMPurify.sanitize(email.trim())
    const sanitizedMessage = DOMPurify.sanitize(message.trim())

    // Enviar email via Resend
    const data = await resend.emails.send({
      from: 'Ferreiras.Me <noreply@ferreiras.me>',
      to: 'contacto@ferreirasme.com',
      reply_to: sanitizedEmail,
      subject: `Novo contacto via site - ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
            Novo Contacto via Site
          </h2>
          
          <div style="margin: 20px 0; background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Nome:</strong> ${sanitizedName}</p>
            <p><strong>Correio eletrónico:</strong> ${sanitizedEmail}</p>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 5px;">
              ${sanitizedMessage}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #FFD700; color: black; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">📧 Responda diretamente a este correio eletrónico para entrar em contacto com ${sanitizedName}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            Este correio eletrónico foi enviado através do formulário de contacto do site Ferreiras.Me
          </p>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Correio eletrónico enviado com sucesso!'
    })
    
  } catch (error) {
    // Em produção, não expor detalhes do erro
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Erro ao enviar correio eletrónico. Tente novamente mais tarde.' },
        { status: 500 }
      )
    }
    
    // Em desenvolvimento, mostrar debug
    console.error('Erro ao enviar correio eletrónico:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao enviar correio eletrónico. Tente novamente mais tarde.',
        debug: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}