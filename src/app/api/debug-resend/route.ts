import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY
    
    // Verificações básicas
    const checks = {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyStart: apiKey?.substring(0, 10) + '...',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    }

    // Tentar criar instância do Resend
    let resendTest = null
    try {
      const resend = new Resend(apiKey)
      
      // Tentar enviar email simples
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'contato@ferreirasme.com',
        subject: 'Debug Test - ' + new Date().toISOString(),
        text: 'Este é um teste de debug'
      })
      
      resendTest = {
        success: true,
        result: result,
        resultType: typeof result,
        hasId: !!(result as any)?.id
      }
    } catch (err: any) {
      resendTest = {
        success: false,
        error: err.message,
        errorType: err.name,
        statusCode: err.statusCode || 'none'
      }
    }

    return NextResponse.json({
      checks,
      resendTest,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Erro geral',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}