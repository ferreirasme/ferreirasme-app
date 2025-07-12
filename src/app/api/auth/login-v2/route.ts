import { NextRequest, NextResponse } from 'next/server';
import { loginWithSupabase } from '@/lib/auth-supabase';

export async function POST(request: NextRequest) {
  console.log('API Login V2: Recebendo requisição');
  
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('API Login V2: Tentando login para usuário:', username);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nome de utilizador e palavra-passe são obrigatórios' },
        { status: 400 }
      );
    }

    // Obter IP e User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Tentar fazer login com Supabase
    const result = await loginWithSupabase(username, password, ipAddress, userAgent);
    
    if (!result.success) {
      console.log('API Login V2: Login falhou:', result.error);
      return NextResponse.json(
        { error: result.error || 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    console.log('API Login V2: Login bem-sucedido, criando cookie');
    
    // Criar response com sucesso
    const response = NextResponse.json(
      { success: true, username },
      { status: 200 }
    );

    // Definir cookie com o token da sessão
    response.headers.set(
      'Set-Cookie',
      `admin-session=${result.token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${24 * 60 * 60}`
    );
    
    return response;
  } catch (error) {
    console.error('Erro no login V2:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}