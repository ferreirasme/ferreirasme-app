import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Usuários autorizados
const AUTHORIZED_USERS = [
  {
    username: 'tamaraleal',
    password: 'New***159753',
  },
  {
    username: 'johnnyhelder',
    password: 'New***159753',
  },
];

// Chave secreta para assinar tokens (em produção, usar variável de ambiente)
const SECRET_KEY = process.env.AUTH_SECRET || 'ferreirasme-admin-secret-2025';

// Gerar token de sessão
export function generateSessionToken(username: string): string {
  const payload = {
    username,
    timestamp: Date.now(),
    random: crypto.randomBytes(16).toString('hex'),
  };
  
  const data = JSON.stringify(payload);
  const hash = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('hex');
  
  return Buffer.from(`${data}.${hash}`).toString('base64');
}

// Verificar token de sessão
export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [data, hash] = decoded.split('.');
    
    if (!data || !hash) {
      return { valid: false };
    }
    
    const expectedHash = crypto
      .createHmac('sha256', SECRET_KEY)
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

// Verificar credenciais
export function verifyCredentials(username: string, password: string): boolean {
  return AUTHORIZED_USERS.some(
    (user) => user.username === username && user.password === password
  );
}

// Verificar se está autenticado (para uso em Server Components)
export async function isAuthenticated(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin-session');
  
  if (!sessionToken) {
    return { authenticated: false };
  }
  
  const { valid, username } = verifySessionToken(sessionToken.value);
  return { authenticated: valid, username };
}

// Fazer logout (limpar cookie)
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}