-- Script completo de configuração do Supabase para Ferreiras.Me
-- Este script pode ser executado múltiplas vezes sem erros

-- 1. Criar tabela newsletter_subscribers (se não existir)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  confirmed BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Criar índices (ignora se já existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_newsletter_email') THEN
    CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_newsletter_confirmed') THEN
    CREATE INDEX idx_newsletter_confirmed ON newsletter_subscribers(confirmed);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_newsletter_subscribed_at') THEN
    CREATE INDEX idx_newsletter_subscribed_at ON newsletter_subscribers(subscribed_at);
  END IF;
END $$;

-- 2. Criar tabela newsletter_backup (se não existir)
CREATE TABLE IF NOT EXISTS newsletter_backup (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  confirmed BOOLEAN DEFAULT false,
  source VARCHAR(50) DEFAULT 'backup'
);

-- Criar índices para backup
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_backup_email') THEN
    CREATE INDEX idx_backup_email ON newsletter_backup(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_backup_timestamp') THEN
    CREATE INDEX idx_backup_timestamp ON newsletter_backup(timestamp);
  END IF;
END $$;

-- 3. Criar tabela newsletter_confirmation_tokens (se não existir)
CREATE TABLE IF NOT EXISTS newsletter_confirmation_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- Criar índices para tokens
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_token') THEN
    CREATE INDEX idx_token ON newsletter_confirmation_tokens(token);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_token_email') THEN
    CREATE INDEX idx_token_email ON newsletter_confirmation_tokens(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_token_expires') THEN
    CREATE INDEX idx_token_expires ON newsletter_confirmation_tokens(expires_at);
  END IF;
END $$;

-- 4. Criar tabela newsletter_unsubscribed (se não existir)
CREATE TABLE IF NOT EXISTS newsletter_unsubscribed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para unsubscribed
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_unsubscribed_email') THEN
    CREATE INDEX idx_unsubscribed_email ON newsletter_unsubscribed(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_unsubscribed_at') THEN
    CREATE INDEX idx_unsubscribed_at ON newsletter_unsubscribed(unsubscribed_at);
  END IF;
END $$;

-- 5. Habilitar RLS em todas as tabelas
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_confirmation_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_unsubscribed ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de segurança (remove antigas se existirem)

-- Políticas para newsletter_subscribers
DROP POLICY IF EXISTS "Permitir inserção pública" ON newsletter_subscribers;
CREATE POLICY "Permitir inserção pública" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura apenas para admin" ON newsletter_subscribers;
CREATE POLICY "Permitir leitura apenas para admin" ON newsletter_subscribers
  FOR SELECT USING (false);

-- Políticas para newsletter_backup
DROP POLICY IF EXISTS "Permitir inserção pública no backup" ON newsletter_backup;
CREATE POLICY "Permitir inserção pública no backup" ON newsletter_backup
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública do backup" ON newsletter_backup;
CREATE POLICY "Permitir leitura pública do backup" ON newsletter_backup
  FOR SELECT USING (true);

-- Políticas para newsletter_confirmation_tokens
DROP POLICY IF EXISTS "Permitir inserção pública de tokens" ON newsletter_confirmation_tokens;
CREATE POLICY "Permitir inserção pública de tokens" ON newsletter_confirmation_tokens
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública de tokens" ON newsletter_confirmation_tokens;
CREATE POLICY "Permitir leitura pública de tokens" ON newsletter_confirmation_tokens
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir atualização pública de tokens" ON newsletter_confirmation_tokens;
CREATE POLICY "Permitir atualização pública de tokens" ON newsletter_confirmation_tokens
  FOR UPDATE USING (true);

-- Políticas para newsletter_unsubscribed
DROP POLICY IF EXISTS "Permitir inserção pública em unsubscribed" ON newsletter_unsubscribed;
CREATE POLICY "Permitir inserção pública em unsubscribed" ON newsletter_unsubscribed
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública de unsubscribed" ON newsletter_unsubscribed;
CREATE POLICY "Permitir leitura pública de unsubscribed" ON newsletter_unsubscribed
  FOR SELECT USING (true);

-- 7. Verificar se tudo foi criado corretamente
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Contar tabelas criadas
  SELECT COUNT(*) INTO v_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('newsletter_subscribers', 'newsletter_backup', 'newsletter_confirmation_tokens', 'newsletter_unsubscribed');
  
  RAISE NOTICE '✅ Total de tabelas criadas: %', v_count;
  
  -- Verificar cada tabela
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_subscribers') THEN
    RAISE NOTICE '✅ Tabela newsletter_subscribers OK';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_backup') THEN
    RAISE NOTICE '✅ Tabela newsletter_backup OK';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_confirmation_tokens') THEN
    RAISE NOTICE '✅ Tabela newsletter_confirmation_tokens OK';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_unsubscribed') THEN
    RAISE NOTICE '✅ Tabela newsletter_unsubscribed OK';
  END IF;
END $$;

-- 8. Mostrar estrutura final
SELECT 
  table_name,
  COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name IN ('newsletter_subscribers', 'newsletter_backup', 'newsletter_confirmation_tokens', 'newsletter_unsubscribed')
GROUP BY table_name
ORDER BY table_name;