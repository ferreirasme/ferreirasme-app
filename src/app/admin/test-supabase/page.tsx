'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

export default function TestSupabasePage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    const testResults: any = {
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
        hasClient: !!supabase
      },
      tests: []
    }

    if (!supabase) {
      testResults.tests.push({
        name: 'Cliente Supabase',
        status: 'erro',
        error: 'Cliente não configurado'
      })
      setResults(testResults)
      setLoading(false)
      return
    }

    // Teste 1: Query simples
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('count')
        .single()
      
      testResults.tests.push({
        name: 'Query count newsletter_subscribers',
        status: error ? 'erro' : 'sucesso',
        data,
        error: error?.message
      })
    } catch (err: any) {
      testResults.tests.push({
        name: 'Query count newsletter_subscribers',
        status: 'erro',
        error: err.message
      })
    }

    // Teste 2: Select com limit
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .limit(5)
      
      testResults.tests.push({
        name: 'Select newsletter_subscribers (limit 5)',
        status: error ? 'erro' : 'sucesso',
        count: data?.length || 0,
        error: error?.message
      })
    } catch (err: any) {
      testResults.tests.push({
        name: 'Select newsletter_subscribers (limit 5)',
        status: 'erro',
        error: err.message
      })
    }

    // Teste 3: Verificar RLS
    try {
      const { data, error } = await supabase.rpc('auth.uid')
      
      testResults.tests.push({
        name: 'Verificar autenticação (auth.uid)',
        status: error ? 'erro' : 'sucesso',
        authenticated: !!data,
        error: error?.message
      })
    } catch (err: any) {
      testResults.tests.push({
        name: 'Verificar autenticação',
        status: 'info',
        note: 'RPC não disponível'
      })
    }

    // Teste 4: Teste direto de conexão
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/newsletter_subscribers?select=count`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      })
      
      const data = await response.json()
      
      testResults.tests.push({
        name: 'Teste direto REST API',
        status: response.ok ? 'sucesso' : 'erro',
        statusCode: response.status,
        data: data
      })
    } catch (err: any) {
      testResults.tests.push({
        name: 'Teste direto REST API',
        status: 'erro',
        error: err.message
      })
    }

    setResults(testResults)
    setLoading(false)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-light text-foreground mb-8">Teste de Conexão Supabase</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                <h2 className="text-xl font-semibold mb-4 text-yellow-400">Configuração</h2>
                <div className="space-y-2 font-mono text-sm">
                  <p>URL: {results.config?.url || 'não definida'}</p>
                  <p>Chave ANON: {results.config?.hasKey ? '✅ Configurada' : '❌ Não configurada'}</p>
                  <p>Prefixo da chave: {results.config?.keyPrefix || 'n/a'}</p>
                  <p>Cliente Supabase: {results.config?.hasClient ? '✅ Criado' : '❌ Não criado'}</p>
                </div>
              </div>

              <div className="bg-foreground/5 backdrop-blur-md rounded-xl border border-foreground/10 p-6">
                <h2 className="text-xl font-semibold mb-4 text-yellow-400">Resultados dos Testes</h2>
                <div className="space-y-4">
                  {results.tests?.map((test: any, index: number) => (
                    <div key={index} className="border-b border-foreground/10 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{test.name}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${
                          test.status === 'sucesso' ? 'bg-green-500/20 text-green-400' :
                          test.status === 'erro' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {test.status}
                        </span>
                      </div>
                      {test.error && (
                        <p className="text-red-400 text-sm">Erro: {test.error}</p>
                      )}
                      {test.data && (
                        <pre className="text-xs bg-foreground/5 p-2 rounded mt-2 overflow-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      )}
                      {test.count !== undefined && (
                        <p className="text-sm text-foreground/70">Registos encontrados: {test.count}</p>
                      )}
                      {test.statusCode && (
                        <p className="text-sm text-foreground/70">Status HTTP: {test.statusCode}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-500/30 p-6">
                <h3 className="font-semibold mb-2 text-yellow-400">Possíveis soluções:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Verificar se as variáveis de ambiente estão corretas no Vercel</li>
                  <li>Verificar políticas RLS no painel do Supabase</li>
                  <li>Confirmar que o projeto Supabase está ativo (não pausado)</li>
                  <li>Verificar se a chave ANON tem permissões adequadas</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}