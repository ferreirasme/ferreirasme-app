'use client'

import { useEffect, useState } from 'react'
import { getNewsletterSubscribers } from '@/lib/newsletter-db'
import Navigation from '@/components/Navigation'
import { Mail, CheckCircle, XCircle, Download } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  confirmed: boolean
  confirmed_at?: string
}

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadSubscribers()
  }, [showAll])

  const loadSubscribers = async () => {
    setLoading(true)
    const { data } = await getNewsletterSubscribers(!showAll)
    if (data) {
      setSubscribers(data)
    }
    setLoading(false)
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
                <p className="text-muted-foreground">
                  Total: {subscribers.length} inscritos
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
                
                {subscribers.length === 0 && (
                  <div className="text-center py-12 text-foreground/50">
                    Nenhum inscrito encontrado
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