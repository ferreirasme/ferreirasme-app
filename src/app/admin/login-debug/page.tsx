'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Verificar informações do ambiente
    setDebugInfo({
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
      location: window.location.href,
      nodeEnv: process.env.NODE_ENV,
    });
  }, []);

  const testLogin = async () => {
    setTestResult('Testando login...\n');
    
    try {
      // Teste 1: Verificar se a API responde
      setTestResult(prev => prev + '1. Testando API de login...\n');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'tamaraleal',
          password: 'New***159753'
        }),
        credentials: 'include', // Importante para cookies
      });

      setTestResult(prev => prev + `   Status: ${response.status}\n`);
      setTestResult(prev => prev + `   Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}\n`);
      
      const data = await response.json();
      setTestResult(prev => prev + `   Response: ${JSON.stringify(data)}\n\n`);

      // Teste 2: Verificar cookies
      setTestResult(prev => prev + '2. Verificando cookies...\n');
      setTestResult(prev => prev + `   document.cookie: ${document.cookie || 'Nenhum cookie visível'}\n\n`);

      // Teste 3: Tentar acessar área protegida
      setTestResult(prev => prev + '3. Testando acesso a área protegida...\n');
      const protectedResponse = await fetch('/admin/newsletter-all', {
        method: 'GET',
        credentials: 'include',
      });
      
      setTestResult(prev => prev + `   Status: ${protectedResponse.status}\n`);
      setTestResult(prev => prev + `   Redirecionado: ${protectedResponse.redirected}\n`);
      setTestResult(prev => prev + `   URL final: ${protectedResponse.url}\n\n`);

      // Teste 4: Verificar middleware
      setTestResult(prev => prev + '4. Testando middleware...\n');
      const testPath = '/api/test-middleware';
      try {
        const middlewareTest = await fetch(testPath);
        setTestResult(prev => prev + `   Middleware test: ${middlewareTest.status}\n`);
      } catch (e) {
        setTestResult(prev => prev + `   Middleware test error: ${e}\n`);
      }

    } catch (error) {
      setTestResult(prev => prev + `\nERRO: ${error}\n`);
    }
  };

  const testDirectAccess = () => {
    window.location.href = '/admin/newsletter-all';
  };

  const clearCookies = () => {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    setTestResult('Cookies limpos!');
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Debug de Login - Ferreiras.Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Informações do Ambiente:</h3>
              <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

            <div className="flex gap-2">
              <Button onClick={testLogin} variant="default">
                Testar Login Completo
              </Button>
              <Button onClick={testDirectAccess} variant="outline">
                Tentar Acesso Direto
              </Button>
              <Button onClick={clearCookies} variant="destructive">
                Limpar Cookies
              </Button>
            </div>

            {testResult && (
              <div>
                <h3 className="font-bold mb-2">Resultado dos Testes:</h3>
                <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto whitespace-pre-wrap">
                  {testResult}
                </pre>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>Esta página testa:</p>
              <ul className="list-disc list-inside">
                <li>Resposta da API de login</li>
                <li>Criação de cookies</li>
                <li>Redirecionamento após login</li>
                <li>Funcionamento do middleware</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}