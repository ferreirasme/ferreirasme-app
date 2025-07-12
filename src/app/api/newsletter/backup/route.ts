import { NextResponse } from 'next/server'
import { getBackupEmails } from '@/lib/email-backup'

export async function GET() {
  try {
    const entries = await getBackupEmails()
    
    return NextResponse.json({
      success: true,
      entries,
      count: entries.length,
      uniqueCount: new Set(entries.map(e => e.email.toLowerCase())).size
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