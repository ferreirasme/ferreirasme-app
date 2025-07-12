// Sistema de gerenciamento de descadastros
// Como o Supabase está com problemas de RLS, vamos manter uma lista de emails descadastrados

import { supabase } from './supabase'
import fs from 'fs/promises'
import path from 'path'

const UNSUBSCRIBED_FILE = path.join(process.cwd(), 'newsletter-backup', 'unsubscribed.json')

interface UnsubscribedEntry {
  email: string
  unsubscribedAt: string
  reason?: string
}

// Garantir que o arquivo existe
async function ensureUnsubscribedFile() {
  try {
    const dir = path.dirname(UNSUBSCRIBED_FILE)
    await fs.mkdir(dir, { recursive: true })
    
    try {
      await fs.access(UNSUBSCRIBED_FILE)
    } catch {
      // Arquivo não existe, criar vazio
      await fs.writeFile(UNSUBSCRIBED_FILE, '[]')
    }
  } catch (error) {
    console.error('Error ensuring unsubscribed file:', error)
  }
}

// Adicionar email à lista de descadastrados
export async function addToUnsubscribed(email: string, reason?: string): Promise<boolean> {
  const entry: UnsubscribedEntry = {
    email: email.toLowerCase(),
    unsubscribedAt: new Date().toISOString(),
    reason
  }

  // Tentar salvar no Supabase primeiro (criar tabela se necessário)
  if (supabase) {
    try {
      // Tentar inserir na tabela de unsubscribed
      const { error } = await supabase
        .from('newsletter_unsubscribed')
        .insert([entry])
      
      if (!error) {
        console.log(`Added to unsubscribed list (Supabase): ${email}`)
        return true
      }
    } catch (err) {
      console.error('Error adding to Supabase unsubscribed:', err)
    }
  }

  // Fallback: salvar em arquivo local
  try {
    await ensureUnsubscribedFile()
    
    const data = await fs.readFile(UNSUBSCRIBED_FILE, 'utf-8')
    const entries: UnsubscribedEntry[] = JSON.parse(data)
    
    // Verificar se já existe
    if (!entries.find(e => e.email === entry.email)) {
      entries.push(entry)
      await fs.writeFile(UNSUBSCRIBED_FILE, JSON.stringify(entries, null, 2))
      console.log(`Added to unsubscribed list (file): ${email}`)
    }
    
    return true
  } catch (error) {
    console.error('Error adding to unsubscribed file:', error)
    return false
  }
}

// Verificar se email está descadastrado
export async function isUnsubscribed(email: string): Promise<boolean> {
  const emailLower = email.toLowerCase()

  // Verificar no Supabase primeiro
  if (supabase) {
    try {
      const { data } = await supabase
        .from('newsletter_unsubscribed')
        .select('email')
        .eq('email', emailLower)
        .single()
      
      if (data) return true
    } catch {
      // Tabela pode não existir ou email não encontrado
    }
  }

  // Verificar no arquivo local
  try {
    await ensureUnsubscribedFile()
    const data = await fs.readFile(UNSUBSCRIBED_FILE, 'utf-8')
    const entries: UnsubscribedEntry[] = JSON.parse(data)
    return entries.some(e => e.email === emailLower)
  } catch {
    return false
  }
}

// Obter lista de descadastrados
export async function getUnsubscribedList(): Promise<UnsubscribedEntry[]> {
  const allUnsubscribed: UnsubscribedEntry[] = []

  // Buscar do Supabase
  if (supabase) {
    try {
      const { data } = await supabase
        .from('newsletter_unsubscribed')
        .select('*')
        .order('unsubscribedAt', { ascending: false })
      
      if (data) {
        allUnsubscribed.push(...data)
      }
    } catch {
      // Ignorar erro
    }
  }

  // Buscar do arquivo local
  try {
    await ensureUnsubscribedFile()
    const data = await fs.readFile(UNSUBSCRIBED_FILE, 'utf-8')
    const entries: UnsubscribedEntry[] = JSON.parse(data)
    
    // Adicionar apenas emails que não estão no Supabase
    entries.forEach(entry => {
      if (!allUnsubscribed.find(e => e.email === entry.email)) {
        allUnsubscribed.push(entry)
      }
    })
  } catch {
    // Ignorar erro
  }

  return allUnsubscribed
}