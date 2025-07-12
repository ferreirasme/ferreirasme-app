'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

interface DebugData {
  subscribers: any[]
  backup: any[]
  tokens: any[]
  error: any
}

export default function DebugPage() {
  const [data, setData] = useState<DebugData>({
    subscribers: [],
    backup: [],
    tokens: [],
    error: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      // Debug: verificar configuração
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase configured:', !!supabase)
      
      if (!supabase) {
        setData(prev => ({ ...prev, error: 'Supabase not configured - check environment variables' }))
        setLoading(false)
        return
      }

      // Carregar todas as tabelas
      const [subsResult, backupResult, tokensResult] = await Promise.all([
        supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
        supabase.from('newsletter_backup').select('*').order('timestamp', { ascending: false }),
        supabase.from('newsletter_confirmation_tokens').select('*').order('created_at', { ascending: false })
      ])

      setData({
        subscribers: subsResult.data || [],
        backup: backupResult.data || [],
        tokens: tokensResult.data || [],
        error: subsResult.error || backupResult.error || tokensResult.error
      })
    } catch (err) {
      setData((prev: DebugData) => ({ ...prev, error: err }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-light text-foreground mb-8">Debug - Newsletter System</h1>
          
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <div className="space-y-8">
              {data.error && (
                <div className="bg-red-500/20 p-4 rounded">
                  <pre>{JSON.stringify(data.error, null, 2)}</pre>
                </div>
              )}

              <div className="bg-foreground/5 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">newsletter_subscribers ({data.subscribers.length})</h2>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(data.subscribers, null, 2)}
                </pre>
              </div>

              <div className="bg-foreground/5 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">newsletter_backup ({data.backup.length})</h2>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(data.backup, null, 2)}
                </pre>
              </div>

              <div className="bg-foreground/5 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">newsletter_confirmation_tokens ({data.tokens.length})</h2>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(data.tokens.slice(0, 5), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}