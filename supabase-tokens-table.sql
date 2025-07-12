-- Criar tabela para tokens de confirmação
CREATE TABLE IF NOT EXISTS newsletter_confirmation_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  used BOOLEAN DEFAULT FALSE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours') NOT NULL
);

-- Criar índices
CREATE INDEX idx_token ON newsletter_confirmation_tokens(token);
CREATE INDEX idx_email_token ON newsletter_confirmation_tokens(email);
CREATE INDEX idx_expires_at ON newsletter_confirmation_tokens(expires_at);

-- Habilitar RLS
ALTER TABLE newsletter_confirmation_tokens ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção
CREATE POLICY "Anyone can create token" ON newsletter_confirmation_tokens
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura e atualização
CREATE POLICY "Anyone can verify token" ON newsletter_confirmation_tokens
  FOR ALL USING (true);