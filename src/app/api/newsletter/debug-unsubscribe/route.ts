import { NextRequest, NextResponse } from 'next/server'
import { getUnsubscribedListMemory, addToUnsubscribedMemory } from '@/lib/unsubscribed-memory'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    // Listar todos os descadastrados
    const unsubscribedList = await getUnsubscribedListMemory()
    
    if (email) {
      // Verificar email específico
      const isUnsubscribed = unsubscribedList.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      )
      
      // Verificar também no Supabase
      let supabaseStatus = {
        main: null as any,
        backup: null as any,
        unsubscribed: null as any
      }
      
      if (supabase) {
        try {
          const { data: mainData } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .eq('email', email.toLowerCase())
            .single()
          supabaseStatus.main = mainData
        } catch {}
        
        try {
          const { data: backupData } = await supabase
            .from('newsletter_backup')
            .select('*')
            .eq('email', email.toLowerCase())
            .limit(1)
          supabaseStatus.backup = backupData?.[0]
        } catch {}
        
        try {
          const { data: unsubData } = await supabase
            .from('newsletter_unsubscribed')
            .select('*')
            .eq('email', email.toLowerCase())
            .single()
          supabaseStatus.unsubscribed = unsubData
        } catch {}
      }
      
      return NextResponse.json({
        email,
        isUnsubscribed: !!isUnsubscribed,
        unsubscribedEntry: isUnsubscribed,
        supabaseStatus,
        totalUnsubscribed: unsubscribedList.length
      })
    }
    
    return NextResponse.json({
      totalUnsubscribed: unsubscribedList.length,
      unsubscribedList: unsubscribedList.slice(0, 10) // Primeiros 10
    })
    
  } catch (error) {
    console.error('Debug unsubscribe error:', error)
    return NextResponse.json({
      error: 'Erro ao verificar descadastrados',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Endpoint para testar adicionar à lista
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }
    
    const result = await addToUnsubscribedMemory(email, 'debug_test')
    
    return NextResponse.json({
      success: result,
      message: result ? 'Adicionado à lista de descadastrados' : 'Falha ao adicionar'
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao processar',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}