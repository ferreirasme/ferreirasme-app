import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Login SUPER simples - comparação direta
    const { data: user } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .single();
    
    if (user) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin-session', 'logged-in', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/'
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}