'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FixPasswordsPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fixPasswords = async () => {
    setLoading(true);
    setResult('Corrigindo hashes das senhas...\n');
    
    try {
      const response = await fetch('/api/admin/fix-password-hashes', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Corrigir Hashes de Senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Clique no botão abaixo para corrigir os hashes das senhas no banco de dados.
          </p>
          
          <Button 
            onClick={fixPasswords} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Corrigindo...' : 'Corrigir Hashes'}
          </Button>

          {result && (
            <pre className="bg-gray-900 text-white p-4 rounded text-xs overflow-auto">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}