'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { Mail, CheckCircle, XCircle, Download, AlertCircle, RefreshCw } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  confirmed: boolean
  confirmed_at?: string
}

interface Stats {
  total: number
  confirmed: number
  pending: number
  source: string
  hasSupabaseConnection: boolean
  errors?: any[]
}

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSubscribers()
  }, [showAll])

  const loadSubscribers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/newsletter/list?confirmed=${!showAll}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setSubscribers(result.data)
        setStats(result.stats)
      } else {
        setError(result.error || 'Erro ao carregar dados')
        setSubscribers([])
      }
    } catch (err) {
      console.error('Erro ao carregar inscritos:', err)
      setError('Erro ao conectar com o servidor')
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Email', 'Data de Inscrição', 'Confirmado', 'Data de Confirmação']
    const rows = subscribers.map(sub => [
      sub.email,
      new Date(sub.subscribed_at).toLocaleString('pt-PT'),
      sub.confirmed ? 'Sim' : 'Não',
      sub.confirmed_at ? new Date(sub.confirmed_at).toLocaleString('pt-PT') : ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light text-foreground mb-2">
                  Newsletter - Inscritos
                </h1>
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                    Total: {stats?.total || subscribers.length} inscritos
                  </p>
                  {stats && (
                    <p className="text-sm text-muted-foreground">
                      {stats.confirmed} confirmados • {stats.pending} pendentes
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={loadSubscribers}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>
            
            {stats && stats.source && (
              <div className={`mb-6 p-4 rounded-lg border ${
                stats.hasSupabaseConnection 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">
                    Dados carregados de: <strong>{
                      stats.source === 'hybrid' ? 'Sistema híbrido (backup + banco)' :
                      stats.source === 'backup' ? 'Sistema de backup' :
                      'Banco de dados'
                    }</strong>
                    {!stats.hasSupabaseConnection && ' • Conexão Supabase indisponível'}
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="w-4 h-4 text-yellow-400"
                />
                <span className="text-foreground/70">
                  Mostrar não confirmados
                </span>
              </label>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : error ? (
                <div className="bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 p-8">
                  <div className="flex flex-col items-center text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-red-400 mb-2">Erro ao carregar dados</h3>
                    <p className="text-foreground/70 mb-4">{error}</p>
                    <button
                      onClick={loadSubscribers}
                      className="px-4 py-2 bg-red-400 text-black rounded-lg hover:bg-red-500 transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-foreground/10">
                        <th className="text-left p-4 text-yellow-400 font-light">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email
                        </th>
                        <th className="text-left p-4 text-yellow-400 font-light">
                          Data de Inscrição
                        </th>
                        <th className="text-center p-4 text-yellow-400 font-light">
                          Confirmado
                        </th>
                        <th className="text-left p-4 text-yellow-400 font-light">
                          Data de Confirmação
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr
                          key={subscriber.id}
                          className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                        >
                          <td className="p-4 text-foreground">
                            {subscriber.email}
                          </td>
                          <td className="p-4 text-foreground/70">
                            {new Date(subscriber.subscribed_at).toLocaleString('pt-PT')}
                          </td>
                          <td className="p-4 text-center">
                            {subscriber.confirmed ? (
                              <CheckCircle className="w-5 h-5 text-green-500 inline" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 inline" />
                            )}
                          </td>
                          <td className="p-4 text-foreground/70">
                            {subscriber.confirmed_at
                              ? new Date(subscriber.confirmed_at).toLocaleString('pt-PT')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {subscribers.length === 0 && !loading && (
                    <div className="text-center py-12 text-foreground/50">
                      {showAll ? 'Nenhum inscrito encontrado' : 'Nenhum inscrito confirmado encontrado'}
                    </div>
                  )}
                </div>
              )
            }
          </div>
        </div>
      </main>
    </>
  )
}