'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Mail, Globe } from 'lucide-react'

interface SystemStatus {
  newsletter: {
    api: boolean
    list: boolean
    unsubscribe: boolean
    subscribers: number
    source: string
  }
  database: {
    supabase: boolean
    backup: boolean
    error?: string
  }
  email: {
    resend: boolean
    configured: boolean
  }
  cache: {
    active: boolean
    entries?: number
  }
  deployment: {
    environment: string
    version: string
  }
}

export default function MonitorPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const checkSystem = async () => {
    setLoading(true)
    
    try {
      // Testar API de newsletter
      const newsletterTest = await fetch('/api/newsletter/list')
      const newsletterData = await newsletterTest.json()
      
      // Testar verificação de email
      const checkEmailTest = await fetch('/api/newsletter/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@monitor.com' })
      })
      
      // Testar unsubscribe GET
      const unsubscribeTest = await fetch('/api/newsletter/unsubscribe?email=test@monitor.com')
      
      const systemStatus: SystemStatus = {
        newsletter: {
          api: newsletterTest.ok,
          list: newsletterData.success || false,
          unsubscribe: unsubscribeTest.ok,
          subscribers: newsletterData.stats?.total || 0,
          source: newsletterData.stats?.source || 'unknown'
        },
        database: {
          supabase: newsletterData.stats?.hasSupabaseConnection || false,
          backup: newsletterData.stats?.source === 'hybrid' || newsletterData.stats?.source === 'backup',
          error: newsletterData.stats?.errors?.[0]?.error
        },
        email: {
          resend: !!process.env.NEXT_PUBLIC_APP_URL,
          configured: true
        },
        cache: {
          active: newsletterData.cached || false
        },
        deployment: {
          environment: process.env.NODE_ENV || 'development',
          version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'
        }
      }
      
      setStatus(systemStatus)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Monitor error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystem()
    const interval = setInterval(checkSystem, 30000) // Atualizar a cada 30 segundos
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (isOk: boolean) => {
    return isOk ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    )
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'database': return 'text-blue-400'
      case 'backup': return 'text-yellow-400'
      case 'hybrid': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light text-foreground mb-2 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-yellow-400" />
                  Monitor do Sistema
                </h1>
                <p className="text-muted-foreground">
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-PT')}
                </p>
              </div>
              
              <button
                onClick={checkSystem}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:bg-foreground/20 disabled:text-foreground/50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>

            {loading && !status ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : status && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Newsletter Status */}
                <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Newsletter
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">API Principal</span>
                      {getStatusIcon(status.newsletter.api)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Listagem</span>
                      {getStatusIcon(status.newsletter.list)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Descadastro</span>
                      {getStatusIcon(status.newsletter.unsubscribe)}
                    </div>
                    <div className="pt-3 border-t border-foreground/10">
                      <p className="text-sm text-foreground/50">
                        Total de inscritos: <span className="text-yellow-400 font-semibold">{status.newsletter.subscribers}</span>
                      </p>
                      <p className="text-sm text-foreground/50">
                        Fonte: <span className={`font-semibold ${getSourceColor(status.newsletter.source)}`}>
                          {status.newsletter.source}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Database Status */}
                <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Base de Dados
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Supabase</span>
                      {getStatusIcon(status.database.supabase)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Sistema Backup</span>
                      {getStatusIcon(status.database.backup)}
                    </div>
                    {status.database.error && (
                      <div className="pt-3 border-t border-foreground/10">
                        <p className="text-sm text-red-400">
                          Erro: {status.database.error}
                        </p>
                      </div>
                    )}
                    {!status.database.supabase && status.database.backup && (
                      <div className="flex items-center gap-2 text-yellow-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Usando sistema de backup</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Info */}
                <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Sistema
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Email (Resend)</span>
                      {getStatusIcon(status.email.configured)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Cache</span>
                      {getStatusIcon(status.cache.active)}
                    </div>
                    <div className="pt-3 border-t border-foreground/10 space-y-1">
                      <p className="text-sm text-foreground/50">
                        Ambiente: <span className="text-yellow-400">{status.deployment.environment}</span>
                      </p>
                      <p className="text-sm text-foreground/50">
                        Versão: <span className="text-yellow-400">{status.deployment.version}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Status Summary */}
            {status && (
              <div className="mt-8 bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Resumo do Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">{
                      Object.values(status.newsletter).filter(v => v === true).length +
                      Object.values(status.database).filter(v => v === true).length +
                      Object.values(status.email).filter(v => v === true).length
                    }</p>
                    <p className="text-sm text-foreground/50">Serviços Online</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">{status.newsletter.subscribers}</p>
                    <p className="text-sm text-foreground/50">Total de Inscritos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">
                      {status.newsletter.source === 'hybrid' ? 'Híbrido' : 
                       status.newsletter.source === 'backup' ? 'Backup' : 'Banco'}
                    </p>
                    <p className="text-sm text-foreground/50">Fonte de Dados</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/admin/newsletter" className="text-yellow-400 hover:text-yellow-300 text-sm">
                → Newsletter Admin
              </a>
              <a href="/admin/newsletter-debug" className="text-yellow-400 hover:text-yellow-300 text-sm">
                → Debug Newsletter
              </a>
              <a href="/admin/test-supabase" className="text-yellow-400 hover:text-yellow-300 text-sm">
                → Testar Supabase
              </a>
              <a href="/admin/status" className="text-yellow-400 hover:text-yellow-300 text-sm">
                → Status Detalhado
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}