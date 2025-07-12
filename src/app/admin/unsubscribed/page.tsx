'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { UserX, RefreshCw, Calendar, Info } from 'lucide-react'
import { getUnsubscribedList } from '@/lib/unsubscribed'

interface UnsubscribedEntry {
  id?: string
  email: string
  unsubscribedAt: string
  reason?: string
}

export default function UnsubscribedPage() {
  const [entries, setEntries] = useState<UnsubscribedEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUnsubscribed = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getUnsubscribedList()
      setEntries(data)
    } catch (err) {
      console.error('Error loading unsubscribed:', err)
      setError('Erro ao carregar lista de descadastrados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUnsubscribed()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getReasonLabel = (reason?: string) => {
    switch (reason) {
      case 'user_request': return 'Pedido do utilizador'
      case 'manual_test': return 'Teste manual'
      case 'admin': return 'Administrador'
      default: return reason || 'Não especificado'
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light text-foreground mb-2 flex items-center gap-3">
                  <UserX className="w-8 h-8 text-red-400" />
                  Emails Descadastrados
                </h1>
                <p className="text-muted-foreground">
                  Total: {entries.length} emails removidos da newsletter
                </p>
              </div>
              
              <button
                onClick={loadUnsubscribed}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 disabled:bg-foreground/20 disabled:text-foreground/50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
              </div>
            ) : entries.length === 0 ? (
              <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-12 text-center">
                <UserX className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/50 text-lg">
                  Nenhum email descadastrado ainda
                </p>
                <p className="text-foreground/30 text-sm mt-2">
                  Os emails que solicitarem descadastro aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="text-left p-4 text-red-400 font-light">
                        <UserX className="w-4 h-4 inline mr-2" />
                        Email
                      </th>
                      <th className="text-left p-4 text-red-400 font-light">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Data de Descadastro
                      </th>
                      <th className="text-left p-4 text-red-400 font-light">
                        <Info className="w-4 h-4 inline mr-2" />
                        Motivo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr
                        key={entry.id || index}
                        className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                      >
                        <td className="p-4 text-foreground">
                          {entry.email}
                        </td>
                        <td className="p-4 text-foreground/70">
                          {formatDate(entry.unsubscribedAt)}
                        </td>
                        <td className="p-4 text-foreground/70">
                          <span className="text-sm px-2 py-1 bg-red-500/20 text-red-400 rounded">
                            {getReasonLabel(entry.reason)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-500/30">
              <h3 className="font-semibold mb-2 text-yellow-400 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informação Importante
              </h3>
              <ul className="space-y-1 text-sm text-foreground/70">
                <li>• Emails descadastrados não recebem mais newsletters</li>
                <li>• Não aparecem nas listas de inscritos (sistema híbrido e backup)</li>
                <li>• O descadastro é permanente e não pode ser revertido pelo sistema</li>
                <li>• Para reinscrever, o utilizador deve fazer nova inscrição</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}