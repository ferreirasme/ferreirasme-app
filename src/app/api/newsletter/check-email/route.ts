import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    console.log(`Checking status for email: ${email}`)

    // Verificar em todas as tabelas
    const results: {
      subscribers: any,
      backup: any,
      tokens: any
    } = {
      subscribers: null,
      backup: null,
      tokens: null
    }

    // 1. Verificar na tabela principal
    if (supabase) {
      const { data: subData } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single()
      
      results.subscribers = subData

      // 2. Verificar no backup
      const { data: backupData } = await supabase
        .from('newsletter_backup')
        .select('*')
        .eq('email', email)
        .order('timestamp', { ascending: false })
      
      results.backup = backupData

      // 3. Verificar tokens
      const { data: tokenData } = await supabase
        .from('newsletter_confirmation_tokens')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
      
      results.tokens = tokenData
    }

    return NextResponse.json({
      email,
      results,
      summary: {
        isSubscribed: !!results.subscribers,
        isConfirmed: results.subscribers?.confirmed || false,
        backupCount: results.backup?.length || 0,
        tokenCount: results.tokens?.length || 0,
        hasValidToken: results.tokens?.some((t: any) => !t.used && new Date(t.expires_at) > new Date()) || false
      }
    })
    
  } catch (error) {
    console.error('Error checking email:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar email' },
      { status: 500 }
    )
  }
}