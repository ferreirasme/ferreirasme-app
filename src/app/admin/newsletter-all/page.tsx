'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { Mail, CheckCircle, XCircle, Download, RefreshCw, Filter, UserX, Database, Archive } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  confirmed: boolean
  confirmed_at?: string
  source?: string
  unsubscribed?: boolean
  unsubscribed_at?: string
}

type FilterType = 'all' | 'active' | 'unsubscribed' | 'confirmed' | 'pending'

export default function NewsletterAllPage() {
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('active')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    confirmed: 0,
    pending: 0,
    unsubscribed: 0
  })
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [filter, allSubscribers])

  const loadAllData = async () => {
    setLoading(true)
    
    try {
      // Buscar todos os dados incluindo descadastrados
      const response = await fetch('/api/newsletter/all?include_unsubscribed=true')
      const result = await response.json()
      
      if (result.success && result.data) {
        setAllSubscribers(result.data)
        
        // Calcular estatísticas
        const stats = {
          total: result.data.length,
          active: result.data.filter((s: Subscriber) => !s.unsubscribed).length,
          confirmed: result.data.filter((s: Subscriber) => s.confirmed && !s.unsubscribed).length,
          pending: result.data.filter((s: Subscriber) => !s.confirmed && !s.unsubscribed).length,
          unsubscribed: result.data.filter((s: Subscriber) => s.unsubscribed).length
        }
        setStats(stats)
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    let filtered = [...allSubscribers]
    
    switch (filter) {
      case 'active':
        filtered = allSubscribers.filter(s => !s.unsubscribed)
        break
      case 'unsubscribed':
        filtered = allSubscribers.filter(s => s.unsubscribed)
        break
      case 'confirmed':
        filtered = allSubscribers.filter(s => s.confirmed && !s.unsubscribed)
        break
      case 'pending':
        filtered = allSubscribers.filter(s => !s.confirmed && !s.unsubscribed)
        break
      // 'all' mostra todos
    }
    
    setFilteredSubscribers(filtered)
  }

  const handleUnsubscribe = async (email: string) => {
    if (!confirm(`Tem certeza que deseja descadastrar ${email}?`)) return
    
    setProcessing(email)
    
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        // Atualizar dados localmente para resposta imediata
        setAllSubscribers(prev => 
          prev.map(sub => 
            sub.email === email 
              ? { ...sub, unsubscribed: true, unsubscribed_at: new Date().toISOString() }
              : sub
          )
        )
        
        // Recarregar dados após 1 segundo para garantir sincronização
        setTimeout(() => loadAllData(), 1000)
      } else {
        alert('Erro ao descadastrar email')
      }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      alert('Erro ao descadastrar email')
    } finally {
      setProcessing(null)
    }
  }

  const exportToCSV = () => {
    const headers = ['Email', 'Data de Inscrição', 'Confirmado', 'Data de Confirmação', 'Status', 'Fonte']
    const rows = filteredSubscribers.map(sub => [
      sub.email,
      new Date(sub.subscribed_at).toLocaleString('pt-PT'),
      sub.confirmed ? 'Sim' : 'Não',
      sub.confirmed_at ? new Date(sub.confirmed_at).toLocaleString('pt-PT') : '',
      sub.unsubscribed ? 'Descadastrado' : 'Ativo',
      sub.source || 'newsletter'
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `newsletter_${filter}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getFilterLabel = (type: FilterType) => {
    switch (type) {
      case 'all': return 'Todos'
      case 'active': return 'Ativos'
      case 'unsubscribed': return 'Descadastrados'
      case 'confirmed': return 'Confirmados'
      case 'pending': return 'Pendentes'
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light text-foreground mb-2">
                  Newsletter - Gestão Completa
                </h1>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-muted-foreground">
                    Total: <strong className="text-foreground">{stats.total}</strong>
                  </span>
                  <span className="text-green-400">
                    Ativos: <strong>{stats.active}</strong>
                  </span>
                  <span className="text-yellow-400">
                    Confirmados: <strong>{stats.confirmed}</strong>
                  </span>
                  <span className="text-orange-400">
                    Pendentes: <strong>{stats.pending}</strong>
                  </span>
                  <span className="text-red-400">
                    Descadastrados: <strong>{stats.unsubscribed}</strong>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={loadAllData}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                  disabled={filteredSubscribers.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex items-center gap-2 p-4 bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10">
              <Filter className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-foreground/70 mr-4">Filtrar:</span>
              <div className="flex gap-2">
                {(['active', 'all', 'confirmed', 'pending', 'unsubscribed'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === type
                        ? 'bg-yellow-400 text-black'
                        : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                    }`}
                  >
                    {getFilterLabel(type)}
                    {type === 'active' && <span className="ml-1">({stats.active})</span>}
                    {type === 'all' && <span className="ml-1">({stats.total})</span>}
                    {type === 'confirmed' && <span className="ml-1">({stats.confirmed})</span>}
                    {type === 'pending' && <span className="ml-1">({stats.pending})</span>}
                    {type === 'unsubscribed' && <span className="ml-1">({stats.unsubscribed})</span>}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 overflow-hidden">
                <div className="p-4 border-b border-foreground/10 bg-foreground/5">
                  <p className="text-sm text-foreground/70">
                    Mostrando: <strong className="text-yellow-400">{filteredSubscribers.length}</strong> {getFilterLabel(filter).toLowerCase()}
                  </p>
                </div>
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
                      <th className="text-center p-4 text-yellow-400 font-light">
                        Status
                      </th>
                      <th className="text-left p-4 text-yellow-400 font-light">
                        Fonte
                      </th>
                      <th className="text-center p-4 text-yellow-400 font-light">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                      >
                        <td className="p-4 text-foreground">
                          <div className="flex items-center gap-2">
                            {subscriber.unsubscribed && (
                              <UserX className="w-4 h-4 text-red-400" />
                            )}
                            <span className={subscriber.unsubscribed ? 'line-through text-foreground/50' : ''}>
                              {subscriber.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-foreground/70">
                          {new Date(subscriber.subscribed_at).toLocaleString('pt-PT')}
                        </td>
                        <td className="p-4 text-center">
                          {subscriber.confirmed ? (
                            <CheckCircle className="w-5 h-5 text-green-500 inline" />
                          ) : (
                            <XCircle className="w-5 h-5 text-orange-500 inline" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {subscriber.unsubscribed ? (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                              Descadastrado
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                              Ativo
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-foreground/70">
                          <div className="flex items-center gap-1">
                            {subscriber.source === 'backup' ? (
                              <Archive className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <Database className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="text-xs">{subscriber.source || 'banco'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {!subscriber.unsubscribed && (
                            <button
                              onClick={() => handleUnsubscribe(subscriber.email)}
                              disabled={processing === subscriber.email}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processing === subscriber.email ? 'Processando...' : 'Descadastrar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredSubscribers.length === 0 && (
                  <div className="text-center py-12 text-foreground/50">
                    Nenhum email encontrado com o filtro selecionado
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}