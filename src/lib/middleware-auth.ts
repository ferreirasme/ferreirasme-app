import { NextRequest, NextResponse } from 'next/server';
import { verifySessionSupabase } from './auth-supabase';

export async function checkAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('admin-session');
  
  if (!sessionToken) {
    console.log('[Auth Middleware] Sem token de sessão');
    return { authenticated: false };
  }
  
  console.log('[Auth Middleware] Verificando sessão no Supabase...');
  const session = await verifySessionSupabase(sessionToken.value);
  
  console.log('[Auth Middleware] Resultado:', session);
  return { 
    authenticated: session.valid, 
    username: session.username 
  };
}