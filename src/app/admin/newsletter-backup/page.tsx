'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface BackupEntry {
  email: string
  timestamp: string
  ip?: string
  userAgent?: string
  confirmed: boolean
  source: 'subscription' | 'confirmation'
}

export default function NewsletterBackupAdmin() {
  const [entries, setEntries] = useState<BackupEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBackupData()
  }, [])

  const loadBackupData = async () => {
    try {
      const response = await fetch('/api/newsletter/backup')
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
      } else {
        setError('Erro ao carregar backup')
      }
    } catch (err) {
      setError('Erro ao conectar com servidor')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Email', 'Data/Hora', 'Confirmado', 'IP', 'Fonte']
    const rows = entries.map(entry => [
      entry.email,
      new Date(entry.timestamp).toLocaleString('pt-PT'),
      entry.confirmed ? 'Sim' : 'Não',
      entry.ip || '',
      entry.source || 'subscription'
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `backup_newsletter_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Agrupar emails únicos
  const uniqueEmails = entries.reduce((acc, entry) => {
    const existing = acc.find(e => e.email === entry.email)
    if (!existing) {
      acc.push(entry)
    } else if (entry.confirmed && !existing.confirmed) {
      // Atualizar para confirmado se encontrar confirmação
      existing.confirmed = true
      existing.timestamp = entry.timestamp
    }
    return acc
  }, [] as BackupEntry[])

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Alerta de Backup */}
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-500">Sistema de Backup</h3>
                <p className="text-sm text-foreground/70 mt-1">
                  Esta página mostra os emails salvos no sistema de backup local. 
                  Use esta lista se o banco de dados principal estiver indisponível.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light text-foreground mb-2">
                  Backup de Newsletter
                </h1>
                <p className="text-muted-foreground">
                  Total: {uniqueEmails.length} emails únicos | {entries.length} eventos totais
                </p>
              </div>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                {error}
              </div>
            ) : (
              <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="text-left p-4 text-yellow-400 font-light">Email</th>
                      <th className="text-left p-4 text-yellow-400 font-light">Última Atividade</th>
                      <th className="text-center p-4 text-yellow-400 font-light">Status</th>
                      <th className="text-left p-4 text-yellow-400 font-light">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueEmails.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                      >
                        <td className="p-4 text-foreground font-medium">
                          {entry.email}
                        </td>
                        <td className="p-4 text-foreground/70 text-sm">
                          {new Date(entry.timestamp).toLocaleString('pt-PT')}
                        </td>
                        <td className="p-4 text-center">
                          {entry.confirmed ? (
                            <span className="inline-flex items-center gap-1 text-green-500">
                              <CheckCircle className="w-4 h-4" />
                              Confirmado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-orange-500">
                              <XCircle className="w-4 h-4" />
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-foreground/50 text-sm">
                          {entry.ip || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {uniqueEmails.length === 0 && (
                  <div className="text-center py-12 text-foreground/50">
                    Nenhum email no backup
                  </div>
                )}
              </div>
            )}

            {/* Log de todos os eventos */}
            <details className="mt-8">
              <summary className="cursor-pointer text-foreground/70 hover:text-foreground">
                Ver log completo ({entries.length} eventos)
              </summary>
              <div className="mt-4 bg-foreground/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-foreground/60">
                  {entries.map((entry, i) => (
                    <div key={i}>
                      {new Date(entry.timestamp).toISOString()} | {entry.email} | {entry.confirmed ? 'CONFIRMED' : 'SUBSCRIBED'} | {entry.source}
                    </div>
                  ))}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </main>
    </>
  )
}