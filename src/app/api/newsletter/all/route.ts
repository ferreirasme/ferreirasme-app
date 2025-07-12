import { NextRequest, NextResponse } from 'next/server'
import { getNewsletterSubscribers } from '@/lib/newsletter-db'
import { getBackupEmails } from '@/lib/email-backup'
import { getUnsubscribedList } from '@/lib/unsubscribed'
import { supabase } from '@/lib/supabase'
import { cache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeUnsubscribed = searchParams.get('include_unsubscribed') === 'true'
    
    // Buscar todos os dados
    let allEmails: any[] = []
    
    // 1. Buscar do banco principal
    try {
      const { data } = await getNewsletterSubscribers(false) // Buscar todos
      if (data) {
        allEmails = data.map((item: any) => ({
          ...item,
          source: 'database',
          unsubscribed: false
        }))
      }
    } catch (err) {
      console.error('Error fetching from database:', err)
    }
    
    // 2. Buscar do backup
    try {
      const backupData = await getBackupEmails()
      
      // Adicionar emails do backup que não estão no banco principal
      backupData.forEach((backup: any) => {
        if (!allEmails.find((e: any) => e.email.toLowerCase() === backup.email.toLowerCase())) {
          allEmails.push({
            id: backup.id || `backup-${backup.email}`,
            email: backup.email,
            subscribed_at: backup.timestamp,
            confirmed: backup.confirmed || false,
            confirmed_at: backup.confirmed ? backup.timestamp : null,
            source: 'backup',
            unsubscribed: false
          })
        }
      })
    } catch (err) {
      console.error('Error fetching backup:', err)
    }
    
    // 3. Buscar lista de descadastrados
    if (includeUnsubscribed) {
      try {
        const unsubscribedList = await getUnsubscribedList()
        const unsubscribedEmails = unsubscribedList.map(u => u.email.toLowerCase())
        
        // Marcar emails como descadastrados
        allEmails = allEmails.map((email: any) => ({
          ...email,
          unsubscribed: unsubscribedEmails.includes(email.email.toLowerCase()),
          unsubscribed_at: unsubscribedList.find(
            (u: any) => u.email.toLowerCase() === email.email.toLowerCase()
          )?.unsubscribedAt
        }))
        
        // Adicionar emails que estão apenas na lista de descadastrados
        unsubscribedList.forEach((unsub: any) => {
          if (!allEmails.find((e: any) => e.email.toLowerCase() === unsub.email.toLowerCase())) {
            allEmails.push({
              id: `unsub-${unsub.email}`,
              email: unsub.email,
              subscribed_at: unsub.unsubscribedAt, // Usar data de descadastro
              confirmed: false,
              source: 'unsubscribed_only',
              unsubscribed: true,
              unsubscribed_at: unsub.unsubscribedAt
            })
          }
        })
      } catch (err) {
        console.error('Error fetching unsubscribed:', err)
      }
    } else {
      // Se não incluir descadastrados, filtrar eles
      try {
        const unsubscribedList = await getUnsubscribedList()
        const unsubscribedEmails = unsubscribedList.map((u: any) => u.email.toLowerCase())
        allEmails = allEmails.filter((email: any) => 
          !unsubscribedEmails.includes(email.email.toLowerCase())
        )
      } catch (err) {
        console.error('Error filtering unsubscribed:', err)
      }
    }
    
    // Ordenar por data
    allEmails.sort((a, b) => {
      const dateA = new Date(a.subscribed_at).getTime()
      const dateB = new Date(b.subscribed_at).getTime()
      return dateB - dateA
    })
    
    return NextResponse.json({
      success: true,
      data: allEmails,
      stats: {
        total: allEmails.length,
        confirmed: allEmails.filter((e: any) => e.confirmed && !e.unsubscribed).length,
        pending: allEmails.filter((e: any) => !e.confirmed && !e.unsubscribed).length,
        unsubscribed: allEmails.filter((e: any) => e.unsubscribed).length,
        hasSupabaseConnection: !!supabase
      }
    })
    
  } catch (error) {
    console.error('Error in newsletter all API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}