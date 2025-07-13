import { NextRequest, NextResponse } from 'next/server';
import { loginWithBcrypt } from '@/lib/auth-bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Utilizador e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Obter IP e User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Tentar login
    const result = await loginWithBcrypt(username, password, ipAddress, userAgent);
    
    if (result.success && result.token) {
      // Criar resposta com cookie
      const response = NextResponse.json({
        success: true,
        username
      });
      
      // Configurar cookie de sessão
      response.cookies.set('admin-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 horas
        path: '/'
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: result.error || 'Credenciais inválidas' },
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