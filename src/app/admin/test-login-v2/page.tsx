'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestLoginV2Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  
  const testLogin = async () => {
    setResult('Testando login V2...\n');
    
    try {
      const response = await fetch('/api/auth/login-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      setResult(prev => prev + `\nStatus: ${response.status}`);
      setResult(prev => prev + `\nResposta: ${JSON.stringify(data, null, 2)}`);
      
      if (response.ok) {
        setResult(prev => prev + '\n\n✅ Login bem-sucedido!');
        setResult(prev => prev + '\n\nAgora tente acessar: /admin/newsletter-all');
      }
    } catch (error) {
      setResult(prev => prev + `\n\n❌ Erro: ${error}`);
    }
  };
  
  const checkTables = async () => {
    setResult('Verificando tabelas no Supabase...\n');
    
    try {
      const response = await fetch('/api/admin/check-tables');
      const data = await response.json();
      
      setResult(prev => prev + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(prev => prev + `\n❌ Erro: ${error}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-black p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Teste Login V2 - Sistema Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome de utilizador</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tamaraleal"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Palavra-passe</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New***159753"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testLogin}>
              Testar Login V2
            </Button>
            <Button onClick={checkTables} variant="outline">
              Verificar Tabelas
            </Button>
          </div>
          
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