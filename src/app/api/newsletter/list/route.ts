import { NextRequest, NextResponse } from 'next/server'
import { getNewsletterSubscribers } from '@/lib/newsletter-db'
import { getBackupEmails } from '@/lib/email-backup'
import { supabase } from '@/lib/supabase'
import { cache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const onlyConfirmed = searchParams.get('confirmed') !== 'false'
    const source = searchParams.get('source') || 'hybrid' // hybrid, database, backup
    const noCache = searchParams.get('nocache') === 'true'
    
    // Chave do cache baseada nos parâmetros
    const cacheKey = `newsletter:${source}:${onlyConfirmed}`
    
    // Verificar cache primeiro (a menos que seja desabilitado)
    if (!noCache) {
      const cachedData = cache.get(cacheKey)
      if (cachedData) {
        return NextResponse.json({
          ...cachedData,
          cached: true,
          timestamp: new Date().toISOString()
        })
      }
    }

    let subscribers = []
    let backupData = []
    let errors = []

    // Tentar buscar do banco de dados principal
    if (source === 'database' || source === 'hybrid') {
      try {
        const { data, error } = await getNewsletterSubscribers(onlyConfirmed)
        if (error) {
          errors.push({ source: 'database', error: error })
        } else if (data && data.length > 0) {
          subscribers = data
        }
      } catch (err: any) {
        errors.push({ source: 'database', error: err.message })
      }
    }

    // Buscar do backup (sempre, ou quando não há dados do banco)
    if (source === 'backup' || source === 'hybrid') {
      try {
        const backup = await getBackupEmails()
        if (backup && backup.length > 0) {
          // Filtrar confirmados se necessário
          backupData = onlyConfirmed 
            ? backup.filter(email => email.confirmed === true)
            : backup
        }
      } catch (err: any) {
        errors.push({ source: 'backup', error: err.message })
      }
    }

    // Se estamos no modo híbrido e temos dados do backup mas não do banco
    if (source === 'hybrid' && backupData.length > 0 && subscribers.length === 0) {
      // Converter dados do backup para o formato esperado
      subscribers = backupData.map(item => ({
        id: item.id,
        email: item.email,
        subscribed_at: item.timestamp,
        confirmed: item.confirmed || false,
        confirmed_at: item.confirmed ? item.timestamp : null,
        ip_address: item.ip_address,
        user_agent: item.user_agent
      }))
    }

    // Remover duplicatas se temos dados de ambas as fontes
    if (source === 'hybrid' && subscribers.length > 0 && backupData.length > 0) {
      const uniqueEmails = new Map()
      
      // Adicionar do banco primeiro (prioridade)
      subscribers.forEach(sub => {
        uniqueEmails.set(sub.email, sub)
      })
      
      // Adicionar do backup se não existir
      backupData.forEach(backup => {
        if (!uniqueEmails.has(backup.email)) {
          uniqueEmails.set(backup.email, {
            id: backup.id,
            email: backup.email,
            subscribed_at: backup.timestamp,
            confirmed: backup.confirmed || false,
            confirmed_at: backup.confirmed ? backup.timestamp : null,
            ip_address: backup.ip_address,
            user_agent: backup.user_agent
          })
        }
      })
      
      subscribers = Array.from(uniqueEmails.values())
    }

    // Ordenar por data de inscrição (mais recente primeiro)
    subscribers.sort((a, b) => {
      const dateA = new Date(a.subscribed_at).getTime()
      const dateB = new Date(b.subscribed_at).getTime()
      return dateB - dateA
    })

    // Adicionar estatísticas
    const stats = {
      total: subscribers.length,
      confirmed: subscribers.filter(s => s.confirmed).length,
      pending: subscribers.filter(s => !s.confirmed).length,
      source: source,
      hasSupabaseConnection: !!supabase,
      errors: errors.length > 0 ? errors : undefined
    }

    // Resultado final
    const result = {
      success: true,
      data: subscribers,
      stats,
      timestamp: new Date().toISOString()
    }
    
    // Salvar no cache por 30 segundos
    cache.set(cacheKey, result, 30)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in newsletter list API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar inscritos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// Endpoint para estatísticas rápidas
export async function HEAD() {
  try {
    const backup = await getBackupEmails()
    const count = backup?.length || 0
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        'X-Total-Count': count.toString(),
        'X-Source': 'backup'
      }
    })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}