// Sistema de gerenciamento de descadastros em memória + Supabase
// Como o Vercel não permite escrita em arquivos, usamos memória como fallback

import { supabase } from './supabase'

interface UnsubscribedEntry {
  email: string
  unsubscribedAt: string
  reason?: string
}

// Cache em memória (persiste enquanto o worker estiver ativo)
let memoryUnsubscribed: UnsubscribedEntry[] = []
let lastSync = 0
const SYNC_INTERVAL = 60000 // 1 minuto

// Sincronizar com Supabase
async function syncWithSupabase() {
  if (!supabase || Date.now() - lastSync < SYNC_INTERVAL) return
  
  try {
    const { data } = await supabase
      .from('newsletter_unsubscribed')
      .select('*')
      .order('unsubscribed_at', { ascending: false })
    
    if (data) {
      // Mesclar com memória local
      const memoryEmails = memoryUnsubscribed.map(e => e.email.toLowerCase())
      
      data.forEach((entry: any) => {
        if (!memoryEmails.includes(entry.email.toLowerCase())) {
          memoryUnsubscribed.push({
            email: entry.email,
            unsubscribedAt: entry.unsubscribed_at || entry.created_at,
            reason: entry.reason
          })
        }
      })
      
      lastSync = Date.now()
      console.log(`Synced ${data.length} unsubscribed emails from Supabase`)
    }
  } catch (err) {
    console.error('Error syncing unsubscribed:', err)
  }
}

// Adicionar email à lista de descadastrados
export async function addToUnsubscribedMemory(email: string, reason?: string): Promise<boolean> {
  const entry: UnsubscribedEntry = {
    email: email.toLowerCase(),
    unsubscribedAt: new Date().toISOString(),
    reason
  }

  // Adicionar à memória imediatamente
  if (!memoryUnsubscribed.find(e => e.email === entry.email)) {
    memoryUnsubscribed.push(entry)
    console.log(`Added to memory unsubscribed: ${email} (total: ${memoryUnsubscribed.length})`)
  }

  // Tentar salvar no Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from('newsletter_unsubscribed')
        .upsert({
          email: entry.email,
          unsubscribed_at: entry.unsubscribedAt,
          reason: entry.reason
        }, {
          onConflict: 'email'
        })
      
      if (!error) {
        console.log(`Saved to Supabase unsubscribed: ${email}`)
        return true
      } else {
        console.error('Supabase unsubscribe error:', error)
      }
    } catch (err) {
      console.error('Error saving to Supabase:', err)
    }
  }

  // Mesmo se Supabase falhar, consideramos sucesso pois está na memória
  return true
}

// Verificar se email está descadastrado
export async function isUnsubscribedMemory(email: string): Promise<boolean> {
  const emailLower = email.toLowerCase()
  
  // Sincronizar primeiro
  await syncWithSupabase()
  
  // Verificar na memória
  return memoryUnsubscribed.some(e => e.email === emailLower)
}

// Obter lista de descadastrados
export async function getUnsubscribedListMemory(): Promise<UnsubscribedEntry[]> {
  // Sincronizar primeiro
  await syncWithSupabase()
  
  // Retornar cópia da lista
  return [...memoryUnsubscribed]
}

// Obter emails descadastrados (apenas os emails)
export async function getUnsubscribedEmailsMemory(): Promise<string[]> {
  await syncWithSupabase()
  return memoryUnsubscribed.map(e => e.email.toLowerCase())
}

// Limpar cache (para testes)
export function clearUnsubscribedCache() {
  lastSync = 0
}