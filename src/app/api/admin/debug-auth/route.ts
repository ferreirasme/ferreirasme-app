import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + 'ferreirasme-2025')
    .digest('hex');
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const debug = {
      step1_input: { username, password_length: password?.length },
      step2_hash: hashPassword(password || ''),
      step3_user_lookup: null as any,
      step4_all_users: null as any,
      step5_table_info: null as any,
    };
    
    // Passo 1: Buscar usuário específico
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username);
    
    debug.step3_user_lookup = { data: user, error: userError };
    
    // Passo 2: Buscar todos os usuários (para debug)
    const { data: allUsers, error: allError } = await supabase
      .from('admin_users')
      .select('username, password_hash, is_active');
    
    debug.step4_all_users = { 
      data: allUsers?.map(u => ({
        ...u,
        password_hash: u.password_hash?.substring(0, 20) + '...'
      })), 
      error: allError 
    };
    
    // Passo 3: Informações da tabela
    const { data: tableInfo, error: tableError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(0);
    
    debug.step5_table_info = { 
      columns: tableInfo ? Object.keys(tableInfo[0] || {}) : 'empty',
      error: tableError 
    };
    
    // Análise final
    const analysis = {
      user_exists: user && user.length > 0,
      password_matches: user && user[0] && user[0].password_hash === hashPassword(password || ''),
      expected_hash: hashPassword(password || ''),
      actual_hash: user && user[0] ? user[0].password_hash : null,
      recommendation: ''
    };
    
    if (!analysis.user_exists) {
      analysis.recommendation = 'Usuário não existe. Execute /admin/setup-passwords primeiro.';
    } else if (!analysis.password_matches) {
      analysis.recommendation = 'Senha incorreta. Verifique se o setup foi executado corretamente.';
    } else {
      analysis.recommendation = 'Credenciais corretas! O login deveria funcionar.';
    }
    
    return NextResponse.json({ debug, analysis });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}