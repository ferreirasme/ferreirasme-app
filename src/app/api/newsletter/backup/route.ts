import { NextResponse } from 'next/server'
import { getBackupEmails } from '@/lib/email-backup'
import { getUnsubscribedList } from '@/lib/unsubscribed'

export async function GET() {
  try {
    let entries = await getBackupEmails()
    
    // Obter lista de descadastrados
    let unsubscribedEmails: string[] = []
    try {
      const unsubscribedList = await getUnsubscribedList()
      unsubscribedEmails = unsubscribedList.map(u => u.email.toLowerCase())
    } catch (err) {
      console.error('Error loading unsubscribed list:', err)
    }
    
    // Filtrar emails descadastrados
    if (unsubscribedEmails.length > 0) {
      const beforeFilter = entries.length
      entries = entries.filter(entry => 
        !unsubscribedEmails.includes(entry.email.toLowerCase())
      )
      console.log(`Backup: Filtered out ${beforeFilter - entries.length} unsubscribed emails`)
    }
    
    return NextResponse.json({
      success: true,
      entries,
      count: entries.length,
      uniqueCount: new Set(entries.map(e => e.email.toLowerCase())).size,
      unsubscribedFiltered: unsubscribedEmails.length
    })
  } catch (error) {
    console.error('Error reading backup:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao ler backup',
        entries: []
      },
      { status: 500 }
    )
  }
}