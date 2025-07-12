-- Criar tabela de inscritos na newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  confirmed BOOLEAN DEFAULT FALSE NOT NULL,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_confirmed ON newsletter_subscribers(confirmed);
CREATE INDEX idx_newsletter_subscribed_at ON newsletter_subscribers(subscribed_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção (qualquer um pode se inscrever)
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Política para permitir atualização do próprio registro (para confirmação)
CREATE POLICY "Users can confirm their own subscription" ON newsletter_subscribers
  FOR UPDATE USING (true);

-- Política para admin visualizar todos (você precisará configurar isso no Supabase)
-- CREATE POLICY "Admins can view all subscribers" ON newsletter_subscribers
--   FOR SELECT USING (auth.uid() = 'SEU_USER_ID_ADMIN');