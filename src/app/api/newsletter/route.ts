import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import DOMPurify from 'isomorphic-dompurify'
import { rateLimit } from '@/lib/rate-limit'
import { generateConfirmationToken } from '@/lib/newsletter-tokens'
import { saveNewsletterSubscriber, checkSubscriberExists } from '@/lib/newsletter-db'
import { backupEmailToFile, checkEmailInBackup } from '@/lib/email-backup'

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

    // Verificar se já existe (primeiro no banco, depois no backup)
    const dbCheck = await checkSubscriberExists(sanitizedEmail)
    const backupCheck = await checkEmailInBackup(sanitizedEmail)
    
    if ((dbCheck.exists && dbCheck.confirmed) || (backupCheck.exists && backupCheck.confirmed)) {
      return NextResponse.json(
        { error: 'Este correio eletrónico já está inscrito na newsletter.' },
        { status: 400 }
      )
    }
    
    const exists = dbCheck.exists || backupCheck.exists

    // Obter IP e User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const userAgent = request.headers.get('user-agent') || ''

    // SEMPRE salvar no backup primeiro (mais confiável)
    const backupSuccess = await backupEmailToFile({
      email: sanitizedEmail,
      timestamp: new Date().toISOString(),
      ip: ipAddress,
      userAgent,
      confirmed: false,
      source: 'subscription'
    })
    
    if (!backupSuccess) {
      // ERRO CRÍTICO - Email não foi salvo
      console.error('🚨 CRITICAL: Failed to save email to backup!')
      
      // Enviar email de emergência para admin
      try {
        await resend.emails.send({
          from: 'Ferreiras.Me <noreply@ferreiras.me>',
          to: 'contacto@ferreirasme.com',
          subject: '🚨 URGENTE: Falha ao salvar email de inscrito',
          html: `
            <h2 style="color: red;">ATENÇÃO: Email não foi salvo no backup!</h2>
            <p><strong>Email:</strong> ${sanitizedEmail}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-PT')}</p>
            <p><strong>IP:</strong> ${ipAddress}</p>
            <p>Por favor, adicione manualmente este email à lista!</p>
          `
        })
      } catch (e) {
        console.error('Failed to send emergency notification:', e)
      }
    }
    
    // Tentar salvar no banco de dados (se configurado)
    if (!exists) {
      const { success } = await saveNewsletterSubscriber(sanitizedEmail, ipAddress, userAgent)
      if (!success) {
        console.warn('Failed to save to database, but backup was successful')
      }
    }

    // Gerar token de confirmação
    const confirmationToken = generateConfirmationToken(sanitizedEmail)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ferreiras.me'
    const confirmationUrl = `${baseUrl}/confirmar-newsletter?token=${confirmationToken}`

    // Enviar correio eletrónico de confirmação para o utilizador
    await resend.emails.send({
      from: 'Ferreiras.Me <noreply@ferreiras.me>',
      to: sanitizedEmail,
      subject: 'Confirme a sua inscrição - Ferreiras.Me',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background-color: #f8f8f8;">
            <img src="${baseUrl}/logo.png" alt="Ferreiras.Me" style="max-width: 200px; height: auto; margin-bottom: 10px;">
            <p style="color: #666; margin-top: 10px;">SEMIJOIAS EXCLUSIVAS</p>
          </div>
          
          <div style="padding: 40px 20px;">
            <h2 style="color: #333; text-align: center;">Confirme a sua inscrição!</h2>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Está a um clique de fazer parte do mundo exclusivo Ferreiras.Me.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" style="display: inline-block; background-color: #FFD700; color: #000; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                Confirmar Inscrição
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Após confirmar, será a primeira a receber nossas novidades e ofertas exclusivas.
            </p>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Siga-nos no Instagram 
              <a href="https://www.instagram.com/ferreirasme/" style="color: #FFD700;">@ferreirasme</a> 
              para acompanhar as novidades diárias.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Se não solicitou esta inscrição, pode ignorar este email.
            </p>
          </div>
          
          <div style="padding: 20px; background-color: #f8f8f8; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2023-${new Date().getFullYear()} Ferreiras.Me - Todos os direitos reservados
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
      message: 'Inscrição realizada com sucesso! Verifique o seu correio eletrónico para confirmar.'
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