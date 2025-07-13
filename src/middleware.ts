import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
  
  // Verificar autenticação para rotas admin
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    // Permitir acesso às páginas de login, debug e teste
    const publicAdminPaths = [
      '/admin/login',
      '/admin/login-debug',
      '/admin/test-login-v2',
      '/admin/setup-passwords',
      '/admin/fix-passwords',
      '/admin/login-bcrypt',
      '/admin/setup-bcrypt'
    ];
    
    if (publicAdminPaths.includes(request.nextUrl.pathname)) {
      console.log('[Middleware] Permitindo acesso a página pública admin');
      return NextResponse.next()
    }
    
    // Verificar token de sessão (suportar ambos os sistemas)
    const sessionToken = request.cookies.get('admin-session')
    const adminToken = request.cookies.get('admin-token')
    const hasToken = sessionToken || adminToken
    console.log('[Middleware] Token existe?', !!hasToken, 'admin-session:', !!sessionToken, 'admin-token:', !!adminToken);
    
    if (!hasToken) {
      // Redirecionar para login
      console.log('[Middleware] Sem token, redirecionando para login');
      const loginUrl = new URL('/admin/login-bcrypt', request.url)
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Por enquanto, permitir acesso se houver qualquer token
    // TODO: Implementar verificação assíncrona do token bcrypt
    if (adminToken) {
      console.log('[Middleware] Token bcrypt presente, permitindo acesso temporariamente');
      return NextResponse.next()
    }
    
    // Verificar token antigo se existir
    if (sessionToken) {
      const { valid } = verifySessionToken(sessionToken.value)
      console.log('[Middleware] Token antigo válido?', valid);
      
      if (!valid) {
        // Token inválido, redirecionar para login
        console.log('[Middleware] Token inválido, redirecionando para login');
        const loginUrl = new URL('/admin/login-bcrypt', request.url)
        loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname)
        const response = NextResponse.redirect(loginUrl)
        response.cookies.delete('admin-session')
        return response
      }
    }
    
    console.log('[Middleware] Autenticação OK, permitindo acesso');
  }
  
  // Clone o response
  const response = NextResponse.next()
  
  // Adicionar headers de segurança
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')
  
  // Headers CORS para APIs
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Permitir apenas origem do próprio domínio
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'https://ferreiras.me',
      'https://www.ferreiras.me',
      process.env.NEXT_PUBLIC_APP_URL
    ].filter(Boolean)
    
    if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development')) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    // Preflight requests
    if (request.method === 'OPTIONS') {
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Max-Age', '86400')
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }
  
  // Headers de cache para assets estáticos
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Headers de cache para páginas
  if (!request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/_next/')) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}