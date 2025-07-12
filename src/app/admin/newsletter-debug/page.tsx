'use client'

import { useEffect, useState } from 'react'
import { getNewsletterSubscribersDebug } from '@/lib/newsletter-db-debug'
import Navigation from '@/components/Navigation'

export default function NewsletterDebugPage() {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDebugData()
  }, [])

  const loadDebugData = async () => {
    const data = await getNewsletterSubscribersDebug()
    setDebugData(data)
    setLoading(false)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-light text-foreground mb-8">
              Newsletter Debug - Diagnóstico Detalhado
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-yellow-400">Estado da Configuração</h2>
                  <div className="space-y-2 font-mono text-sm">
                    <p className="flex items-center gap-2">
                      Cliente Supabase: 
                      <span className={debugData?.hasClient ? 'text-green-400' : 'text-red-400'}>
                        {debugData?.hasClient ? '✅ Inicializado' : '❌ Não inicializado'}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      URL Configurada: 
                      <span className={debugData?.url ? 'text-green-400' : 'text-red-400'}>
                        {debugData?.url ? '✅' : '❌'} {debugData?.url || 'Não definida'}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      Chave API: 
                      <span className={debugData?.hasKey ? 'text-green-400' : 'text-red-400'}>
                        {debugData?.hasKey ? '✅ Configurada' : '❌ Não configurada'}
                      </span>
                    </p>
                  </div>
                </div>

                {debugData?.results && (
                  <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-yellow-400">Resultado da Query</h2>
                    <div className="space-y-2">
                      <p>Status: {debugData.results.status || 'N/A'}</p>
                      <p>Status Text: {debugData.results.statusText || 'N/A'}</p>
                      <p>Registos encontrados: {debugData.results.count}</p>
                      {debugData.results.data && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
                            Ver dados ({debugData.results.count} registos)
                          </summary>
                          <pre className="mt-2 text-xs bg-foreground/5 p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(debugData.results.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                {debugData?.error && (
                  <div className="bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-400">Erro Encontrado</h2>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(debugData.error, null, 2)}
                    </pre>
                  </div>
                )}

                {debugData?.rawResponse && (
                  <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-yellow-400">Resposta REST Direta</h2>
                    <div className="space-y-2">
                      <p>Status HTTP: {debugData.rawResponse.status} {debugData.rawResponse.statusText}</p>
                      <p>OK: {debugData.rawResponse.ok ? '✅' : '❌'}</p>
                      
                      {debugData.rawResponse.headers && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
                            Ver headers da resposta
                          </summary>
                          <pre className="mt-2 text-xs bg-foreground/5 p-4 rounded overflow-auto">
                            {JSON.stringify(debugData.rawResponse.headers, null, 2)}
                          </pre>
                        </details>
                      )}
                      
                      {debugData.rawResponse.data && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
                            Ver resposta completa
                          </summary>
                          <pre className="mt-2 text-xs bg-foreground/5 p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(debugData.rawResponse.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-500/30 p-6">
                  <h3 className="font-semibold mb-4 text-yellow-400">Diagnóstico e Soluções</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {!debugData?.hasClient && (
                      <li className="text-red-300">
                        <strong>Cliente não inicializado:</strong> Verificar variáveis de ambiente no .env.local e no Vercel
                      </li>
                    )}
                    {debugData?.error?.code === 'PGRST301' && (
                      <li className="text-yellow-300">
                        <strong>Erro RLS:</strong> As políticas de Row Level Security podem estar bloqueando o acesso. 
                        Verificar no painel Supabase → Authentication → Policies
                      </li>
                    )}
                    {debugData?.rawResponse?.status === 401 && (
                      <li className="text-red-300">
                        <strong>Não autorizado:</strong> A chave API pode estar incorreta ou sem permissões
                      </li>
                    )}
                    {debugData?.rawResponse?.status === 404 && (
                      <li className="text-red-300">
                        <strong>Tabela não encontrada:</strong> Verificar se a tabela newsletter_subscribers existe
                      </li>
                    )}
                    <li>
                      <strong>Solução temporária:</strong> Usar <a href="/admin/newsletter-backup" className="text-yellow-400 underline">
                        /admin/newsletter-backup
                      </a> que está funcionando com o sistema de backup local
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <a
                    href="/admin/newsletter-backup"
                    className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Ver Newsletter (Backup)
                  </a>
                  <a
                    href="/admin/test-supabase"
                    className="px-6 py-3 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors"
                  >
                    Testar Conexão
                  </a>
                  <button
                    onClick={loadDebugData}
                    className="px-6 py-3 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors"
                  >
                    Recarregar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}