import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Verificar tabela admin_users
    const { data: users, error: usersError } = await supabase
      .from('admin_users')
      .select('username, is_active, last_login')
      .limit(10);
    
    // Verificar tabela admin_sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('admin_sessions')
      .select('id, created_at, expires_at')
      .limit(5);
    
    return NextResponse.json({
      tables: {
        admin_users: {
          exists: !usersError,
          error: usersError?.message,
          count: users?.length || 0,
          data: users
        },
        admin_sessions: {
          exists: !sessionsError,
          error: sessionsError?.message,
          count: sessions?.length || 0,
          data: sessions
        }
      },
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}