'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { UserX, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function TestUnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testUnsubscribe = async () => {
    if (!email) return
    
    setLoading(true)
    setStatus(null)
    
    try {
      // 1. Descadastrar
      const unsubResponse = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const unsubResult = await unsubResponse.json()
      
      // 2. Verificar status
      const debugResponse = await fetch(`/api/newsletter/debug-unsubscribe?email=${encodeURIComponent(email)}`)
      const debugResult = await debugResponse.json()
      
      // 3. Verificar na lista
      const listResponse = await fetch('/api/newsletter/all?include_unsubscribed=true')
      const listResult = await listResponse.json()
      
      const emailInList = listResult.data?.find((item: any) => 
        item.email.toLowerCase() === email.toLowerCase()
      )
      
      setStatus({
        unsubscribe: unsubResult,
        debug: debugResult,
        inList: emailInList,
        isMarkedUnsubscribed: emailInList?.unsubscribed || false
      })
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : 'Erro desconhecido' })
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async () => {
    if (!email) return
    
    setLoading(true)
    
    try {
      const response = await fetch(`/api/newsletter/debug-unsubscribe?email=${encodeURIComponent(email)}`)
      const result = await response.json()
      setStatus({ checkOnly: true, ...result })
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : 'Erro desconhecido' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-light text-foreground mb-8 flex items-center gap-3">
              <UserX className="w-8 h-8 text-red-400" />
              Teste de Descadastro
            </h1>

            <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Email para testar
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teste@exemplo.com"
                    className="w-full px-4 py-2 bg-background/50 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={testUnsubscribe}
                    disabled={!email || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-foreground/20 disabled:text-foreground/50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Testar Descadastro
                  </button>
                  
                  <button
                    onClick={checkStatus}
                    disabled={!email || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-foreground/20 disabled:text-foreground/50 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Verificar Status
                  </button>
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            )}

            {status && !loading && (
              <div className="space-y-4">
                {status.error ? (
                  <div className="bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 p-4">
                    <p className="text-red-400">Erro: {status.error}</p>
                  </div>
                ) : (
                  <>
                    {status.checkOnly ? (
                      <div className="bg-blue-500/20 backdrop-blur-md rounded-xl border border-blue-500/30 p-4">
                        <h3 className="font-semibold text-blue-400 mb-2">Status do Email</h3>
                        <p>Email: {status.email}</p>
                        <p>Descadastrado: {status.isUnsubscribed ? 
                          <span className="text-red-400">Sim</span> : 
                          <span className="text-green-400">Não</span>
                        }</p>
                        <p>Total descadastrados: {status.totalUnsubscribed}</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-green-500/20 backdrop-blur-md rounded-xl border border-green-500/30 p-4">
                          <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Resultado do Descadastro
                          </h3>
                          <p>Sucesso: {status.unsubscribe?.success ? 'Sim' : 'Não'}</p>
                          <p>Mensagem: {status.unsubscribe?.message}</p>
                          <p>Método: {status.unsubscribe?.method}</p>
                        </div>

                        <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-500/30 p-4">
                          <h3 className="font-semibold text-yellow-400 mb-2">Verificação</h3>
                          <p>Email na lista de descadastrados: {
                            status.debug?.isUnsubscribed ? 
                            <span className="text-green-400">Sim ✓</span> : 
                            <span className="text-red-400">Não ✗</span>
                          }</p>
                          <p>Status na lista geral: {
                            status.isMarkedUnsubscribed ? 
                            <span className="text-green-400">Marcado como descadastrado ✓</span> : 
                            <span className="text-red-400">Ainda ativo ✗</span>
                          }</p>
                        </div>

                        {status.debug && (
                          <details className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-4">
                            <summary className="cursor-pointer text-yellow-400">Debug Completo</summary>
                            <pre className="mt-2 text-xs overflow-auto">
                              {JSON.stringify(status, null, 2)}
                            </pre>
                          </details>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-500/30">
              <h3 className="font-semibold text-yellow-400 mb-2">Como testar:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-foreground/70">
                <li>Digite um email que existe na newsletter</li>
                <li>Clique em "Testar Descadastro"</li>
                <li>Verifique se foi marcado como descadastrado</li>
                <li>Acesse <a href="/admin/newsletter-all" className="text-yellow-400 underline">/admin/newsletter-all</a> e confirme que não aparece em "Ativos"</li>
                <li>Mude o filtro para "Descadastrados" para ver o email</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}