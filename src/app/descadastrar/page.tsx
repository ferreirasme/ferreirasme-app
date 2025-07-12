'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'

function UnsubscribeForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [checking, setChecking] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      checkEmail(emailParam)
    }
  }, [searchParams])

  const checkEmail = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) return
    
    setChecking(true)
    try {
      const response = await fetch(`/api/newsletter/unsubscribe?email=${encodeURIComponent(emailToCheck)}`)
      const data = await response.json()
      setEmailExists(data.exists || false)
    } catch {
      // Ignorar erro de verificação
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Descadastro realizado com sucesso.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Erro ao processar descadastro.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Erro ao conectar com o servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-foreground mb-4">
                Descadastrar Newsletter
              </h1>
              <p className="text-muted-foreground">
                Lamentamos vê-lo partir. Insira o seu correio eletrónico abaixo para cancelar a subscrição.
              </p>
            </div>

            {status === 'success' ? (
              <div className="bg-green-500/20 backdrop-blur-md rounded-xl border border-green-500/30 p-8">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                  <h2 className="text-xl font-semibold text-green-400 mb-2">
                    Descadastro Confirmado
                  </h2>
                  <p className="text-foreground/70">
                    {message}
                  </p>
                  <p className="text-sm text-foreground/50 mt-4">
                    Não receberá mais as nossas newsletters. Esperamos vê-lo novamente no futuro!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-8">
                  <div className="space-y-4">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground/70">
                      Correio Eletrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          checkEmail(e.target.value)
                        }}
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-background/50 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    
                    {checking && (
                      <p className="text-sm text-foreground/50 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verificando...
                      </p>
                    )}
                    
                    {!checking && email && !emailExists && (
                      <p className="text-sm text-yellow-400">
                        Este correio eletrónico não está inscrito na newsletter.
                      </p>
                    )}

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        {message}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email || checking}
                    className="w-full mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-foreground/20 disabled:text-foreground/50 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Confirmar Descadastro'
                    )}
                  </button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-foreground/50">
                    Mudou de ideias?
                  </p>
                  <a 
                    href="/#newsletter" 
                    className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                  >
                    Voltar para inscrição
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
    </main>
  )
}

export default function UnsubscribePage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      }>
        <UnsubscribeForm />
      </Suspense>
    </>
  )
}