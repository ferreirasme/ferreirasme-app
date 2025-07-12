import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Função para criar hash de senha
function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + 'ferreirasme-2025')
    .digest('hex');
}

export async function POST() {
  try {
    console.log('Configurando senhas dos administradores...');
    
    const users = [
      { username: 'tamaraleal', password: 'New***159753' },
      { username: 'johnnyhelder', password: 'New***159753' }
    ];
    
    const results = [];
    
    for (const user of users) {
      const passwordHash = hashPassword(user.password);
      console.log(`Usuário: ${user.username}, Hash: ${passwordHash}`);
      
      // Primeiro, verificar se o usuário existe
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', user.username)
        .single();
      
      if (existingUser) {
        // Atualizar senha
        const { error } = await supabase
          .from('admin_users')
          .update({ password_hash: passwordHash })
          .eq('username', user.username);
        
        if (error) {
          console.error(`Erro ao atualizar ${user.username}:`, error);
          results.push({ username: user.username, status: 'erro', error: error.message });
        } else {
          results.push({ username: user.username, status: 'atualizado' });
        }
      } else {
        // Criar usuário
        const { error } = await supabase
          .from('admin_users')
          .insert({
            username: user.username,
            password_hash: passwordHash,
            is_active: true
          });
        
        if (error) {
          console.error(`Erro ao criar ${user.username}:`, error);
          results.push({ username: user.username, status: 'erro', error: error.message });
        } else {
          results.push({ username: user.username, status: 'criado' });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      message: 'Senhas configuradas! Use tamaraleal ou johnnyhelder com a senha New***159753'
    });
  } catch (error) {
    console.error('Erro ao configurar senhas:', error);
    return NextResponse.json(
      { error: 'Erro ao configurar senhas: ' + error },
      { status: 500 }
    );
  }
}