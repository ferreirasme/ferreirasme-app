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

export async function POST() {
  try {
    const password = 'New***159753';
    const correctHash = hashPassword(password);
    
    console.log('Hash correto para a senha:', correctHash);
    
    // Atualizar ambos os usuários com o hash correto
    const users = ['tamaraleal', 'johnnyhelder'];
    const results = [];
    
    for (const username of users) {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: correctHash,
          is_active: true 
        })
        .eq('username', username);
      
      if (error) {
        results.push({ username, status: 'erro', error: error.message });
      } else {
        results.push({ username, status: 'atualizado', hash: correctHash });
      }
    }
    
    // Verificar se funcionou
    const { data: users_check } = await supabase
      .from('admin_users')
      .select('username, password_hash');
    
    return NextResponse.json({
      success: true,
      correctHash,
      updateResults: results,
      verification: users_check,
      message: 'Hashes corrigidos! Agora o login deve funcionar.'
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}