'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SetupPasswordsPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const setupPasswords = async () => {
    setLoading(true);
    setStatus('Configurando senhas...\n');
    
    try {
      const response = await fetch('/api/admin/setup-passwords', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus(prev => prev + '\n✅ Senhas configuradas com sucesso!\n');
        setStatus(prev => prev + '\nUsuários criados:\n');
        setStatus(prev => prev + '- tamaraleal / New***159753\n');
        setStatus(prev => prev + '- johnnyhelder / New***159753\n');
        setStatus(prev => prev + '\n🎉 Agora você pode fazer login em /admin/login');
      } else {
        setStatus(prev => prev + `\n❌ Erro: ${data.error}`);
      }
    } catch (error) {
      setStatus(prev => prev + `\n❌ Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Configurar Senhas Admin - Ferreiras.Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ ATENÇÃO:</strong> Execute esta página apenas UMA VEZ após criar as tabelas no Supabase.
            </p>
          </div>

          <div className="space-y-2">
            <p>Esta página vai:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Configurar as senhas dos usuários admin</li>
              <li>Criar os hashes corretos no banco de dados</li>
              <li>Permitir o login com as credenciais fornecidas</li>
            </ul>
          </div>

          <Button 
            onClick={setupPasswords} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Configurando...' : 'Configurar Senhas Admin'}
          </Button>

          {status && (
            <div className="bg-gray-900 p-4 rounded">
              <pre className="text-xs text-white whitespace-pre-wrap">{status}</pre>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>Após configurar, acesse:</p>
            <a href="/admin/login" className="text-blue-500 hover:underline">
              /admin/login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}