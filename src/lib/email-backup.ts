import fs from 'fs/promises'
import path from 'path'
import { supabase } from './supabase'

const BACKUP_DIR = path.join(process.cwd(), 'newsletter-backup')
const BACKUP_FILE = path.join(BACKUP_DIR, 'subscribers.json')
const CRITICAL_BACKUP = path.join(BACKUP_DIR, `critical-${new Date().toISOString().split('T')[0]}.txt`)

interface BackupEntry {
  email: string
  timestamp: string
  ip?: string
  userAgent?: string
  confirmed: boolean
  source: 'subscription' | 'confirmation'
}

// Garantir que o diretório existe
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating backup directory:', error)
  }
}

// Salvar email em arquivo JSON e/ou Supabase
export async function backupEmailToFile(entry: BackupEntry): Promise<boolean> {
  let savedToSupabase = false
  let savedToFile = false
  
  // PRIMEIRA TENTATIVA: Salvar no Supabase (mais confiável no Vercel)
  if (supabase) {
    try {
      const { error } = await supabase
        .from('newsletter_backup')
        .insert([{
          email: entry.email,
          timestamp: entry.timestamp,
          ip_address: entry.ip,
          user_agent: entry.userAgent,
          confirmed: entry.confirmed,
          source: entry.source
        }])
      
      if (!error) {
        savedToSupabase = true
        console.log(`✅ Email backed up to Supabase: ${entry.email}`)
      } else {
        console.error('Error saving to Supabase backup:', error)
      }
    } catch (err) {
      console.error('Failed to save to Supabase backup:', err)
    }
  }
  
  // SEGUNDA TENTATIVA: Salvar em arquivo (funciona apenas localmente)
  try {
    await ensureBackupDir()
    
    // Ler arquivo existente ou criar array vazio
    let entries: BackupEntry[] = []
    try {
      const data = await fs.readFile(BACKUP_FILE, 'utf-8')
      entries = JSON.parse(data)
    } catch {
      // Arquivo não existe ainda
    }
    
    // Adicionar nova entrada
    entries.push(entry)
    
    // Salvar arquivo atualizado
    await fs.writeFile(BACKUP_FILE, JSON.stringify(entries, null, 2))
    
    // BACKUP CRÍTICO: Salvar também em arquivo de texto simples
    const criticalLine = `${entry.timestamp}\t${entry.email}\t${entry.confirmed ? 'CONFIRMED' : 'PENDING'}\n`
    await fs.appendFile(CRITICAL_BACKUP, criticalLine)
    
    savedToFile = true
    console.log(`✅ Email backed up to file: ${entry.email}`)
  } catch (error) {
    // No Vercel, isso falhará porque o sistema de arquivos é read-only
    console.log('File backup failed (expected on Vercel):', error.message)
  }
  
  // Se não salvou em nenhum lugar, é crítico!
  if (!savedToSupabase && !savedToFile) {
    console.error('❌ CRITICAL ERROR: Email not backed up anywhere!')
    console.error('🚨 EMERGENCY BACKUP - EMAIL NOT SAVED:')
    console.error(JSON.stringify(entry))
    return false
  }
  
  return true
}

// Ler todos os emails do backup
export async function getBackupEmails(): Promise<BackupEntry[]> {
  // Tentar ler do Supabase primeiro
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('newsletter_backup')
        .select('*')
        .order('timestamp', { ascending: false })
      
      if (!error && data) {
        return data.map(item => ({
          email: item.email,
          timestamp: item.timestamp,
          ip: item.ip_address,
          userAgent: item.user_agent,
          confirmed: item.confirmed,
          source: item.source as 'subscription' | 'confirmation'
        }))
      }
    } catch (err) {
      console.error('Failed to read from Supabase backup:', err)
    }
  }
  
  // Fallback: tentar ler do arquivo
  try {
    const data = await fs.readFile(BACKUP_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Verificar se email existe no backup
export async function checkEmailInBackup(email: string): Promise<{ exists: boolean; confirmed: boolean }> {
  // Verificar no Supabase primeiro
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('newsletter_backup')
        .select('email, confirmed')
        .ilike('email', email)
        .single()
      
      if (!error && data) {
        return {
          exists: true,
          confirmed: data.confirmed
        }
      }
    } catch {
      // Não encontrado ou erro
    }
  }
  
  // Fallback: verificar nos arquivos
  try {
    const entries = await getBackupEmails()
    const entry = entries.find(e => e.email.toLowerCase() === email.toLowerCase())
    return {
      exists: !!entry,
      confirmed: entry?.confirmed || false
    }
  } catch {
    return { exists: false, confirmed: false }
  }
}

// Atualizar status de confirmação no backup
export async function updateEmailConfirmationInBackup(email: string): Promise<boolean> {
  let updated = false
  
  // Atualizar no Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from('newsletter_backup')
        .update({ confirmed: true })
        .ilike('email', email)
      
      if (!error) {
        updated = true
      }
    } catch (err) {
      console.error('Error updating Supabase backup:', err)
    }
  }
  
  // Atualizar no arquivo (se existir)
  try {
    const entries = await getBackupEmails()
    const index = entries.findIndex(e => e.email.toLowerCase() === email.toLowerCase())
    
    if (index !== -1) {
      entries[index].confirmed = true
      await fs.writeFile(BACKUP_FILE, JSON.stringify(entries, null, 2))
      
      // Também adicionar ao log crítico
      const criticalLine = `${new Date().toISOString()}\t${email}\tCONFIRMED\n`
      await fs.appendFile(CRITICAL_BACKUP, criticalLine)
      
      updated = true
    }
  } catch (error) {
    // Esperado no Vercel
  }
  
  return updated
}