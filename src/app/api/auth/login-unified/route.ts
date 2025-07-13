import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, generateSessionToken } from '@/lib/auth-unified';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Utilizador e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar credenciais
    const isValid = await verifyCredentials(username, password);
    
    if (isValid) {
      // Gerar token de sessão
      const token = generateSessionToken(username);
      
      // Criar resposta com cookie
      const response = NextResponse.json({
        success: true,
        username
      });
      
      // Configurar cookie de sessão
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 horas
        path: '/'
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}