-- Corrigir políticas RLS para permitir leitura das tabelas admin

-- 1. Remover política restritiva antiga
DROP POLICY IF EXISTS "Admin users são privados" ON admin_users;

-- 2. Criar nova política que permite leitura pública (temporário para debug)
CREATE POLICY "Permitir leitura admin_users" ON admin_users
  FOR SELECT USING (true);

-- 3. Permitir inserção e atualização também
CREATE POLICY "Permitir inserção admin_users" ON admin_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização admin_users" ON admin_users
  FOR UPDATE USING (true);

-- 4. Verificar se há usuários na tabela
SELECT 'Usuários existentes:' as info;
SELECT id, username, is_active, created_at FROM admin_users;

-- 5. Se não houver usuários, inserir novamente
INSERT INTO admin_users (username, password_hash, is_active) 
VALUES 
  ('tamaraleal', '767d99e2681abd036d1f566b7a746e04f37d51a90f93aa23f3fbe81ffd1b9114', true),
  ('johnnyhelder', '767d99e2681abd036d1f566b7a746e04f37d51a90f93aa23f3fbe81ffd1b9114', true)
ON CONFLICT (username) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active;

-- 6. Verificar novamente
SELECT 'Após inserção:' as info;
SELECT username, is_active FROM admin_users;