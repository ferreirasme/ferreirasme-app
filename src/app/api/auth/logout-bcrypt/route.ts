import { NextRequest, NextResponse } from 'next/server';
import { logoutBcrypt } from '@/lib/auth-bcrypt';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (token) {
      await logoutBcrypt(token);
    }
    
    const response = NextResponse.json({ success: true });
    
    // Remover cookies
    response.cookies.delete('admin-token');
    response.cookies.delete('admin-session'); // Remover cookie antigo também
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}