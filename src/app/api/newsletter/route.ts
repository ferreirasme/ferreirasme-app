import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import DOMPurify from 'isomorphic-dompurify'
import { rateLimit } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Rate limiting
    try {
      await rateLimit('newsletter')
    } catch (error) {
      return NextResponse.json(
        { error: 'Demasiadas tentativas. Por favor, aguarde antes de tentar novamente.' },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    // Validação
    if (!email) {
      return NextResponse.json(
        { error: 'Correio eletrónico é obrigatório' },
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

    // Sanitização
    const sanitizedEmail = DOMPurify.sanitize(email.trim())

    // Enviar correio eletrónico de confirmação para o utilizador
    await resend.emails.send({
      from: 'Ferreiras.Me <noreply@ferreiras.me>',
      to: sanitizedEmail,
      subject: 'Confirmação de Inscrição - Ferreiras.Me',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background-color: #f8f8f8;">
            <h1 style="color: #FFD700; margin: 0;">Ferreiras.Me</h1>
            <p style="color: #666; margin-top: 10px;">SEMIJOIAS EXCLUSIVAS</p>
          </div>
          
          <div style="padding: 40px 20px;">
            <h2 style="color: #333;">Obrigado pela sua inscrição!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              A sua inscrição foi confirmada com sucesso. Será a primeira a saber quando 
              lançarmos a nossa coleção exclusiva de semijoias.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Enquanto isso, siga-nos no Instagram 
              <a href="https://www.instagram.com/ferreirasme/" style="color: #FFD700;">@ferreirasme</a> 
              para acompanhar as novidades.
            </p>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #FFD700; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #000; font-weight: bold;">EM BREVE</p>
            </div>
          </div>
          
          <div style="padding: 20px; background-color: #f8f8f8; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Ferreiras.Me - Todos os direitos reservados
            </p>
          </div>
        </div>
      `
    })

    // Enviar notificação para o administrador
    await resend.emails.send({
      from: 'Ferreiras.Me <noreply@ferreiras.me>',
      to: 'contacto@ferreirasme.com',
      subject: 'Nova Inscrição na Newsletter - Ferreiras.Me',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700;">Nova Inscrição na Newsletter</h2>
          <p><strong>Correio eletrónico:</strong> ${sanitizedEmail}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-PT')}</p>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Inscrição realizada com sucesso! Verifique o seu correio eletrónico.'
    })
    
  } catch (error) {
    // Em produção, não expor detalhes do erro
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Erro ao processar a inscrição. Tente novamente.' },
        { status: 500 }
      )
    }
    
    console.error('Erro na newsletter:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar inscrição. Tente novamente.',
        debug: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}