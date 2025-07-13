import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Interface para usuário admin
interface AdminUser {
  username: string;
  passwordHash: string;
}

// Obter usuários autorizados das variáveis de ambiente
function getAuthorizedUsers(): AdminUser[] {
  const users: AdminUser[] = [];
  
  // Usuário 1
  if (process.env.ADMIN_USER_1 && process.env.ADMIN_PASS_1) {
    users.push({
      username: process.env.ADMIN_USER_1,
      passwordHash: process.env.ADMIN_PASS_1, // Já deve vir como hash do Vercel
    });
  }
  
  // Usuário 2
  if (process.env.ADMIN_USER_2 && process.env.ADMIN_PASS_2) {
    users.push({
      username: process.env.ADMIN_USER_2,
      passwordHash: process.env.ADMIN_PASS_2, // Já deve vir como hash do Vercel
    });
  }
  
  return users;
}

// Chave secreta para assinar tokens
const SECRET_KEY = process.env.AUTH_SECRET || '';

// Verificar se o SECRET_KEY está configurado
if (!SECRET_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET não está configurado!');
}

// Gerar token de sessão seguro
export function generateSessionToken(username: string): string {
  const payload = {
    username,
    timestamp: Date.now(),
    random: crypto.randomBytes(16).toString('hex'),
  };
  
  const data = JSON.stringify(payload);
  const hash = crypto
    .createHmac('sha256', SECRET_KEY || 'dev-secret')
    .update(data)
    .digest('hex');
  
  return Buffer.from(`${data}.${hash}`).toString('base64url');
}

// Verificar token de sessão
export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const lastDotIndex = decoded.lastIndexOf('.');
    
    if (lastDotIndex === -1) {
      return { valid: false };
    }
    
    const data = decoded.substring(0, lastDotIndex);
    const hash = decoded.substring(lastDotIndex + 1);
    
    const expectedHash = crypto
      .createHmac('sha256', SECRET_KEY || 'dev-secret')
      .update(data)
      .digest('hex');
    
    if (hash !== expectedHash) {
      return { valid: false };
    }
    
    const payload = JSON.parse(data);
    
    // Verificar se o token não é muito antigo (24 horas)
    const tokenAge = Date.now() - payload.timestamp;
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return { valid: false };
    }
    
    return { valid: true, username: payload.username };
  } catch (error) {
    return { valid: false };
  }
}

// Verificar credenciais usando bcrypt
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const users = getAuthorizedUsers();
  
  if (users.length === 0) {
    console.error('Nenhum usuário admin configurado!');
    return false;
  }
  
  // Procurar usuário
  const user = users.find(u => u.username === username);
  if (!user) {
    return false;
  }
  
  try {
    // Verificar se é um hash bcrypt válido
    if (user.passwordHash.startsWith('$2')) {
      // É um hash bcrypt, comparar diretamente
      return await bcrypt.compare(password, user.passwordHash);
    } else {
      // Não é bcrypt, assumir que a senha precisa ser hasheada
      // Isso é apenas para desenvolvimento local
      if (process.env.NODE_ENV !== 'production') {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Hash bcrypt para ${username}: ${hashedPassword}`);
        return password === user.passwordHash; // Comparação simples para dev
      }
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar credenciais:', error);
    return false;
  }
}

// Verificar se está autenticado (para uso em Server Components)
export async function isAuthenticated(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin-token') || cookieStore.get('admin-session');
  
  if (!sessionToken) {
    return { authenticated: false };
  }
  
  const { valid, username } = verifySessionToken(sessionToken.value);
  return { authenticated: valid, username };
}

// Fazer logout (limpar cookies)
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
  cookieStore.delete('admin-session');
}