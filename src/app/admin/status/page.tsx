'use client'

import Navigation from '@/components/Navigation'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function StatusPage() {
  // Verificar variáveis de ambiente
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const checks = [
    {
      name: 'Supabase URL',
      status: !!envVars.NEXT_PUBLIC_SUPABASE_URL,
      value: envVars.NEXT_PUBLIC_SUPABASE_URL ? 'Configurado' : 'Não configurado'
    },
    {
      name: 'Supabase Anon Key',
      status: !!envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      value: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurado' : 'Não configurado'
    },
    {
      name: 'Ambiente',
      status: true,
      value: process.env.NODE_ENV
    }
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-light text-foreground mb-8">Status do Sistema</h1>
          
          <div className="space-y-4">
            <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10">
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Verificação de Configuração
              </h2>
              
              <div className="space-y-3">
                {checks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span className="font-medium">{check.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{check.value}</span>
                      {check.status ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Nota:</strong> Se as variáveis não estão configuradas, verifique:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>As variáveis estão configuradas no Vercel?</li>
                <li>O deploy foi feito após adicionar as variáveis?</li>
                <li>As variáveis começam com NEXT_PUBLIC_?</li>
              </ul>
            </div>

            <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10">
              <h3 className="font-medium mb-3">URLs de Admin:</h3>
              <div className="space-y-2 text-sm">
                <a href="/admin/newsletter" className="block text-blue-500 hover:underline">
                  /admin/newsletter - Newsletter principal
                </a>
                <a href="/admin/newsletter-backup" className="block text-blue-500 hover:underline">
                  /admin/newsletter-backup - Sistema de backup
                </a>
                <a href="/admin/debug" className="block text-blue-500 hover:underline">
                  /admin/debug - Debug completo
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}