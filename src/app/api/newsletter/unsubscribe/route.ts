import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cache } from '@/lib/cache'
import { getBackupEmails } from '@/lib/email-backup'
import { addToUnsubscribedMemory, clearUnsubscribedCache } from '@/lib/unsubscribed-memory'

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Correio eletrónico é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o token é válido (se fornecido)
    if (token) {
      // Por enquanto, vamos aceitar qualquer token não vazio
      // No futuro, podemos implementar uma verificação mais robusta
    }

    let unsubscribed = false
    const errors = []

    const emailLower = email.toLowerCase()

    // Tentar atualizar no Supabase principal
    if (supabase) {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('email', emailLower)

        if (!error) {
          unsubscribed = true
          console.log(`Unsubscribed from main database: ${email}`)
        } else {
          errors.push({ source: 'main_db', error: error.message })
        }
      } catch (err: any) {
        errors.push({ source: 'main_db', error: err.message })
      }

      // Também remover do backup do Supabase
      try {
        const { error } = await supabase
          .from('newsletter_backup')
          .delete()
          .eq('email', emailLower)

        if (!error) {
          unsubscribed = true
          console.log(`Unsubscribed from backup: ${email}`)
        } else {
          errors.push({ source: 'backup_db', error: error.message })
        }
      } catch (err: any) {
        errors.push({ source: 'backup_db', error: err.message })
      }
    }

    // Adicionar à lista de descadastrados (solução alternativa)
    const addedToUnsubscribed = await addToUnsubscribedMemory(email, 'user_request')
    
    if (addedToUnsubscribed) {
      unsubscribed = true
      console.log(`Added to unsubscribed list: ${email}`)
    }

    // Limpar caches
    cache.clear()
    clearUnsubscribedCache()

    if (unsubscribed || addedToUnsubscribed) {
      // Sucesso se conseguimos marcar como descadastrado de alguma forma
      return NextResponse.json({
        success: true,
        message: 'O seu correio eletrónico foi removido da nossa lista de newsletter.',
        errors: errors.length > 0 ? errors : undefined,
        method: addedToUnsubscribed ? 'unsubscribed_list' : 'direct_delete'
      })
    } else {
      return NextResponse.json(
        { error: 'Não foi possível processar o descadastro. Tente novamente.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in unsubscribe:', error)
    return NextResponse.json(
      { error: 'Erro ao processar descadastro' },
      { status: 500 }
    )
  }
}

// GET para verificar se email existe antes de descadastrar
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Correio eletrónico é obrigatório' },
        { status: 400 }
      )
    }

    let exists = false
    const emailLower = email.toLowerCase()

    // Verificar no banco principal
    if (supabase) {
      try {
        const { data: mainData } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .eq('email', emailLower)
          .single()

        if (mainData) exists = true
      } catch {
        // Não encontrado no banco principal
      }

      // Verificar no backup do Supabase
      if (!exists) {
        try {
          const { data: backupData } = await supabase
            .from('newsletter_backup')
            .select('email')
            .eq('email', emailLower)
            .limit(1)

          if (backupData && backupData.length > 0) exists = true
        } catch {
          // Não encontrado no backup do Supabase
        }
      }
    }

    // Se ainda não encontrou, verificar no backup local/híbrido
    if (!exists) {
      try {
        const backupEmails = await getBackupEmails()
        const found = backupEmails.find(
          entry => entry.email.toLowerCase() === emailLower
        )
        if (found) exists = true
      } catch {
        // Erro ao verificar backup
      }
    }

    // Como última tentativa, usar a API de listagem
    if (!exists) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/newsletter/list`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const found = data.data.find(
              (sub: any) => sub.email.toLowerCase() === emailLower
            )
            if (found) exists = true
          }
        }
      } catch {
        // Erro na API
      }
    }

    return NextResponse.json({
      exists,
      email: exists ? email : null
    })

  } catch (error) {
    console.error('Error checking email:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar correio eletrónico' },
      { status: 500 }
    )
  }
}