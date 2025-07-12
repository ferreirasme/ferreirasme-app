import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Função para criar hash de senha
function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + (process.env.AUTH_SALT || 'ferreirasme-2025'))
    .digest('hex');
}

// Obter usuários autorizados das variáveis de ambiente
function getAuthorizedUsers() {
  const users = [];
  
  // Usuário 1
  if (process.env.ADMIN_USER_1 && process.env.ADMIN_PASS_1) {
    users.push({
      username: process.env.ADMIN_USER_1,
      passwordHash: hashPassword(process.env.ADMIN_PASS_1),
    });
  }
  
  // Usuário 2
  if (process.env.ADMIN_USER_2 && process.env.ADMIN_PASS_2) {
    users.push({
      username: process.env.ADMIN_USER_2,
      passwordHash: hashPassword(process.env.ADMIN_PASS_2),
    });
  }
  
  // Fallback temporário até configurar variáveis no Vercel
  if (users.length === 0) {
    console.warn('⚠️  Usando credenciais temporárias. Configure as variáveis de ambiente no Vercel!');
    users.push(
      {
        username: 'tamaraleal',
        passwordHash: hashPassword('New***159753'),
      },
      {
        username: 'johnnyhelder',
        passwordHash: hashPassword('New***159753'),
      }
    );
  }
  
  return users;
}

// Chave secreta para assinar tokens
const SECRET_KEY = process.env.AUTH_SECRET || 'ferreirasme-admin-secret-2025-temporary';

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
  console.log('Auth: Verificando token...');
  
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split('.');
    
    if (parts.length !== 2) {
      console.log('Auth: Token mal formado, partes:', parts.length);
      return { valid: false };
    }
    
    const [data, hash] = parts;
    
    const expectedHash = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(data)
      .digest('hex');
    
    console.log('Auth: Hash esperado vs recebido:', hash === expectedHash);
    
    if (hash !== expectedHash) {
      console.log('Auth: Hash não coincide');
      return { valid: false };
    }
    
    const payload = JSON.parse(data);
    console.log('Auth: Payload do token:', { username: payload.username, age: Date.now() - payload.timestamp });
    
    // Verificar se o token não é muito antigo (24 horas)
    const tokenAge = Date.now() - payload.timestamp;
    if (tokenAge > 24 * 60 * 60 * 1000) {
      console.log('Auth: Token expirado');
      return { valid: false };
    }
    
    console.log('Auth: Token válido para:', payload.username);
    return { valid: true, username: payload.username };
  } catch (error) {
    console.error('Auth: Erro ao verificar token:', error);
    return { valid: false };
  }
}

// Verificar credenciais
export function verifyCredentials(username: string, password: string): boolean {
  const users = getAuthorizedUsers();
  const passwordHash = hashPassword(password);
  
  console.log('Auth: Verificando credenciais para:', username);
  console.log('Auth: Total de usuários configurados:', users.length);
  console.log('Auth: Usuários disponíveis:', users.map(u => u.username));
  
  const found = users.some(
    (user) => {
      const match = user.username === username && user.passwordHash === passwordHash;
      if (user.username === username) {
        console.log(`Auth: Usuário ${username} encontrado, senha correta:`, match);
      }
      return match;
    }
  );
  
  console.log('Auth: Resultado da verificação:', found);
  return found;
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