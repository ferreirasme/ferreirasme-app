import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cache } from '@/lib/cache'

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: {
        status: 'up',
        latency: 0
      },
      database: {
        status: 'unknown',
        connected: false,
        error: null as string | null
      },
      email: {
        status: process.env.RESEND_API_KEY ? 'configured' : 'not_configured',
        hasApiKey: !!process.env.RESEND_API_KEY
      },
      cache: {
        status: 'active',
        type: 'memory'
      }
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://ferreiras.me'
    },
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  }

  // Testar conexão com Supabase
  const dbStart = Date.now()
  if (supabase) {
    try {
      const { count, error } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
      
      if (!error) {
        checks.services.database.status = 'up'
        checks.services.database.connected = true
      } else {
        checks.services.database.status = 'degraded'
        checks.services.database.error = error.message
      }
    } catch (err: any) {
      checks.services.database.status = 'down'
      checks.services.database.error = err.message
    }
  } else {
    checks.services.database.status = 'not_configured'
  }
  
  // Calcular latência da API
  checks.services.api.latency = Date.now() - dbStart

  // Determinar status geral
  const criticalServices = [
    checks.services.api.status,
    checks.services.email.status
  ]
  
  if (criticalServices.includes('down')) {
    checks.status = 'unhealthy'
  } else if (checks.services.database.status === 'down' || checks.services.database.status === 'degraded') {
    checks.status = 'degraded'
  }

  // Headers de cache
  const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'X-Health-Status': checks.status
  }

  return NextResponse.json(checks, { 
    status: checks.status === 'unhealthy' ? 503 : 200,
    headers 
  })
}