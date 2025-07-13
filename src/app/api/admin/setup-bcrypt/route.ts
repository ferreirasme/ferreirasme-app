import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPasswordBcrypt } from '@/lib/auth-bcrypt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const defaultPassword = 'New***159753';
    const hashedPassword = await hashPasswordBcrypt(defaultPassword);
    
    const results = {
      tamaraleal: null as any,
      johnnyhelder: null as any,
      hash: hashedPassword,
      users: null as any
    };
    
    // Criar/atualizar tamaraleal
    const { data: tamara, error: tamaraError } = await supabase
      .from('admin_users')
      .upsert({ 
        username: 'tamaraleal',
        password_hash: hashedPassword,
        is_active: true 
      }, {
        onConflict: 'username'
      })
      .select();
    
    if (tamaraError) {
      results.tamaraleal = { error: tamaraError.message };
    } else {
      results.tamaraleal = tamara;
    }
    
    // Criar/atualizar johnnyhelder
    const { data: johnny, error: johnnyError } = await supabase
      .from('admin_users')
      .upsert({ 
        username: 'johnnyhelder',
        password_hash: hashedPassword,
        is_active: true 
      }, {
        onConflict: 'username'
      })
      .select();
    
    if (johnnyError) {
      results.johnnyhelder = { error: johnnyError.message };
    } else {
      results.johnnyhelder = johnny;
    }
    
    // Listar todos os utilizadores
    const { data: users, error: listError } = await supabase
      .from('admin_users')
      .select('username, is_active, created_at, last_login');
    
    if (!listError) {
      results.users = users;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Utilizadores configurados com sucesso',
      defaultPassword: 'New***159753',
      results
    });
    
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Erro ao configurar utilizadores' },
      { status: 500 }
    );
  }
}