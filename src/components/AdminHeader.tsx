'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminHeaderProps {
  username?: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-sm text-gray-500">
        Conectado como: <span className="font-semibold">{username}</span>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        disabled={loading}
      >
        {loading ? 'A sair...' : 'Sair'}
      </Button>
    </div>
  );
}