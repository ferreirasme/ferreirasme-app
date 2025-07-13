import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Gerar token de sessão único
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verificar credenciais e criar sessão
export async function loginWithBcrypt(
  username: string, 
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    console.log('Login attempt for:', username);
    
    // Buscar usuário
    const { data: users, error: userError } = await supabase
      .from('admin_users')
      .select('id, username, password_hash, is_active')
      .eq('username', username);
    
    if (userError || !users || users.length === 0) {
      console.log('User not found:', userError);
      return { success: false, error: 'Utilizador não encontrado' };
    }
    
    const user = users[0];
    
    // Verificar se está ativo
    if (!user.is_active) {
      return { success: false, error: 'Utilizador inativo' };
    }
    
    // Verificar senha com bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return { success: false, error: 'Senha incorreta' };
    }
    
    // Criar sessão
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas
    
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      });
    
    if (sessionError) {
      console.error('Failed to create session:', sessionError);
      return { success: false, error: 'Erro ao criar sessão' };
    }
    
    // Atualizar último login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);
    
    return { success: true, token: sessionToken };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Erro interno' };
  }
}

// Verificar se a sessão é válida
export async function verifySessionBcrypt(token: string): Promise<{
  valid: boolean;
  username?: string;
  userId?: string;
}> {
  try {
    // Buscar sessão válida com join
    const { data: sessions, error } = await supabase
      .from('admin_sessions')
      .select(`
        id,
        user_id,
        expires_at,
        admin_users!inner (
          username,
          is_active
        )
      `)
      .eq('session_token', token)
      .gte('expires_at', new Date().toISOString());
    
    if (error || !sessions || sessions.length === 0) {
      return { valid: false };
    }
    
    const session = sessions[0];
    const user = session.admin_users as any;
    
    // Verificar se usuário está ativo
    if (!user || !user.is_active) {
      return { valid: false };
    }
    
    return {
      valid: true,
      username: user.username,
      userId: session.user_id
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return { valid: false };
  }
}

// Fazer logout (deletar sessão)
export async function logoutBcrypt(token: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('session_token', token);
    
    return !error;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Limpar sessões expiradas
export async function cleanExpiredSessions(): Promise<void> {
  try {
    await supabase
      .from('admin_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());
  } catch (error) {
    console.error('Clean sessions error:', error);
  }
}

// Criar hash de senha com bcrypt
export async function hashPasswordBcrypt(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}