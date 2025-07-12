import fs from 'fs/promises'
import path from 'path'

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

// Salvar email em arquivo JSON
export async function backupEmailToFile(entry: BackupEntry): Promise<boolean> {
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
    
    console.log(`✅ Email backed up successfully: ${entry.email}`)
    return true
  } catch (error) {
    console.error('❌ CRITICAL ERROR backing up email:', error)
    
    // ÚLTIMO RECURSO: Logar no console para não perder
    console.error('🚨 EMERGENCY BACKUP - EMAIL NOT SAVED TO FILE:')
    console.error(JSON.stringify(entry))
    
    return false
  }
}

// Ler todos os emails do backup
export async function getBackupEmails(): Promise<BackupEntry[]> {
  try {
    const data = await fs.readFile(BACKUP_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Verificar se email existe no backup
export async function checkEmailInBackup(email: string): Promise<{ exists: boolean; confirmed: boolean }> {
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
  try {
    const entries = await getBackupEmails()
    const index = entries.findIndex(e => e.email.toLowerCase() === email.toLowerCase())
    
    if (index !== -1) {
      entries[index].confirmed = true
      await fs.writeFile(BACKUP_FILE, JSON.stringify(entries, null, 2))
      
      // Também adicionar ao log crítico
      const criticalLine = `${new Date().toISOString()}\t${email}\tCONFIRMED\n`
      await fs.appendFile(CRITICAL_BACKUP, criticalLine)
      
      return true
    }
    return false
  } catch (error) {
    console.error('Error updating confirmation in backup:', error)
    return false
  }
}