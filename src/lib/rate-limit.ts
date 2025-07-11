import { headers } from 'next/headers'
import { RateLimiter } from 'limiter'

// Map para armazenar limitadores por IP
const limiters = new Map<string, RateLimiter>()

// Configuração do rate limiter
const REQUESTS_PER_MINUTE = 10
const REQUESTS_PER_HOUR = 100

export async function rateLimit(identifier?: string) {
  // Obter IP do cliente
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  
  const ip = forwardedFor?.split(',')[0] || realIp || 'anonymous'
  const key = identifier ? `${ip}:${identifier}` : ip

  // Criar ou obter limiter existente
  let limiter = limiters.get(key)
  
  if (!limiter) {
    limiter = new RateLimiter({
      tokensPerInterval: REQUESTS_PER_MINUTE,
      interval: 'minute',
      fireImmediately: true
    })
    limiters.set(key, limiter)
    
    // Limpar após 1 hora para evitar vazamento de memória
    setTimeout(() => {
      limiters.delete(key)
    }, 60 * 60 * 1000)
  }

  // Verificar se ainda há tokens disponíveis
  const remainingRequests = await limiter.removeTokens(1)
  
  if (remainingRequests < 0) {
    throw new Error('Rate limit exceeded')
  }

  return {
    remaining: remainingRequests,
    limit: REQUESTS_PER_MINUTE
  }
}

// Rate limiter específico para API de contato (mais restritivo)
export async function contactRateLimit() {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  
  const ip = forwardedFor?.split(',')[0] || realIp || 'anonymous'
  const key = `contact:${ip}`

  let limiter = limiters.get(key)
  
  if (!limiter) {
    limiter = new RateLimiter({
      tokensPerInterval: 3, // Apenas 3 emails por hora
      interval: 'hour',
      fireImmediately: true
    })
    limiters.set(key, limiter)
    
    // Limpar após 2 horas
    setTimeout(() => {
      limiters.delete(key)
    }, 2 * 60 * 60 * 1000)
  }

  const remainingRequests = await limiter.removeTokens(1)
  
  if (remainingRequests < 0) {
    throw new Error('Too many contact requests. Please try again later.')
  }

  return {
    remaining: remainingRequests,
    limit: 3
  }
}