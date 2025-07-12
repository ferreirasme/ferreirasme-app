import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Função para criar hash de senha
function hashPassword(password: string): string {
  // Usar o mesmo salt que está no SQL
  return crypto
    .createHash('sha256')
    .update(password + 'ferreirasme-2025')
    .digest('hex');
}

// Gerar token de sessão único
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verificar credenciais e criar sessão
export async function loginWithSupabase(
  username: string, 
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const passwordHash = hashPassword(password);
    console.log('Login attempt for:', username);
    console.log('Password hash:', passwordHash);
    
    // Primeiro, buscar apenas por username para debug
    const { data: userCheck, error: checkError } = await supabase
      .from('admin_users')
      .select('id, username, password_hash, is_active')
      .eq('username', username);
    
    console.log('User lookup result:', userCheck, 'Error:', checkError);
    
    if (!userCheck || userCheck.length === 0) {
      return { success: false, error: 'Usuário não encontrado' };
    }
    
    // Verificar senha
    const user = userCheck[0];
    if (user.password_hash !== passwordHash) {
      console.log('Password mismatch. Expected:', user.password_hash, 'Got:', passwordHash);
      return { success: false, error: 'Senha incorreta' };
    }
    
    if (!user.is_active) {
      return { success: false, error: 'Usuário inativo' };
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
export async function verifySessionSupabase(token: string): Promise<{
  valid: boolean;
  username?: string;
  userId?: string;
}> {
  try {
    // Buscar sessão válida
    const { data: session, error } = await supabase
      .from('admin_sessions')
      .select(`
        id,
        user_id,
        expires_at,
        admin_users (
          username,
          is_active
        )
      `)
      .eq('session_token', token)
      .gte('expires_at', new Date().toISOString())
      .single();
    
    if (error || !session) {
      return { valid: false };
    }
    
    // Verificar se usuário está ativo
    const user = session.admin_users as any;
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
export async function logoutSupabase(token: string): Promise<boolean> {
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