-- Criar tabela de backup para newsletter
CREATE TABLE IF NOT EXISTS newsletter_backup (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  confirmed BOOLEAN DEFAULT FALSE NOT NULL,
  source VARCHAR(50) DEFAULT 'subscription',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_backup_email ON newsletter_backup(email);
CREATE INDEX idx_backup_timestamp ON newsletter_backup(timestamp DESC);
CREATE INDEX idx_backup_confirmed ON newsletter_backup(confirmed);

-- Habilitar RLS
ALTER TABLE newsletter_backup ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção
CREATE POLICY "Anyone can backup email" ON newsletter_backup
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura (para admin)
CREATE POLICY "Anyone can read backup" ON newsletter_backup
  FOR SELECT USING (true);