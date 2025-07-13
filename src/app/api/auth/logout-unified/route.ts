import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/auth-unified';

export async function POST(request: NextRequest) {
  try {
    await logout();
    
    const response = NextResponse.json({ success: true });
    
    // Garantir que os cookies sejam removidos
    response.cookies.delete('admin-token');
    response.cookies.delete('admin-session');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}