'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SetupBcryptPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const setupUsers = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/setup-bcrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Erro ao configurar utilizadores');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurar Utilizadores Admin (Bcrypt)</CardTitle>
            <CardDescription>
              Criar/atualizar utilizadores admin com senhas seguras usando bcrypt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                Esta página irá criar ou atualizar os seguintes utilizadores:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>tamaraleal</strong> - Senha: New***159753</li>
                <li>• <strong>johnnyhelder</strong> - Senha: New***159753</li>
              </ul>
            </div>

            <Button
              onClick={setupUsers}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'A configurar...' : 'Configurar Utilizadores'}
            </Button>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md">
                <p className="font-semibold">Erro:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md">
                <p className="font-semibold">Sucesso!</p>
                <pre className="text-xs mt-2 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>1. Clique em "Configurar Utilizadores" para criar/atualizar os utilizadores admin</p>
            <p>2. Após configurar, aceda a <a href="/admin/login-bcrypt" className="text-blue-500 hover:underline">/admin/login-bcrypt</a></p>
            <p>3. Use as credenciais configuradas para entrar</p>
            <p>4. As senhas são encriptadas com bcrypt para máxima segurança</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}