import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyCredentials, generateSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  console.log('API Login: Recebendo requisição');
  
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('API Login: Tentando login para usuário:', username);

    if (!username || !password) {
      console.log('API Login: Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'Nome de utilizador e palavra-passe são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar credenciais
    const isValid = verifyCredentials(username, password);
    console.log('API Login: Credenciais válidas?', isValid);
    
    if (!isValid) {
      console.log('API Login: Credenciais inválidas para:', username);
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Gerar token de sessão
    const sessionToken = generateSessionToken(username);
    console.log('API Login: Token gerado com sucesso');

    // Criar response
    const response = NextResponse.json(
      { success: true, username },
      { status: 200 }
    );

    // Definir cookie de sessão
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 horas
      path: '/',
    });
    
    console.log('API Login: Cookie definido, retornando sucesso');
    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}