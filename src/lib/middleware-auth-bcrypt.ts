import { verifySessionBcrypt } from './auth-bcrypt';

export async function verifyAuthMiddleware(token: string): Promise<{
  valid: boolean;
  username?: string;
  userId?: string;
}> {
  // Verificar com sistema bcrypt
  return await verifySessionBcrypt(token);
}