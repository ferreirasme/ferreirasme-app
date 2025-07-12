# 🛠️ Comandos Úteis - Ferreiras.Me

## Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificar tipos TypeScript
npm run type-check

# Lint
npm run lint
```

## Git & Deploy
```bash
# Status
git status

# Adicionar, commitar e fazer push (tudo junto)
git add -A && git commit -m "mensagem" && git push origin main

# Ver últimos commits
git log --oneline -10

# Deploy manual (normalmente é automático)
vercel --prod
```

## Supabase SQL Importantes
```sql
-- Ver todos os inscritos confirmados
SELECT * FROM newsletter_subscribers WHERE confirmed = true ORDER BY subscribed_at DESC;

-- Ver tokens não usados
SELECT * FROM newsletter_confirmation_tokens WHERE used = false AND expires_at > NOW();

-- Ver backup completo
SELECT * FROM newsletter_backup ORDER BY timestamp DESC;

-- Estatísticas
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN confirmed = true THEN 1 END) as confirmados,
  COUNT(CASE WHEN confirmed = false THEN 1 END) as pendentes
FROM newsletter_subscribers;
```

## Verificar Status de Email Específico
```bash
# Via curl
curl -X POST https://ferreiras.me/api/newsletter/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Logs no Vercel
```bash
# Ver logs em tempo real
vercel logs --follow

# Ver logs de função específica
vercel logs api/newsletter
```

## Testar Newsletter Localmente
```bash
# Terminal 1 - Rodar o projeto
npm run dev

# Terminal 2 - Testar inscrição
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@exemplo.com"}'
```

## Backup Manual do Banco
```bash
# Exportar tabela newsletter_subscribers
# Usar Supabase Dashboard > SQL Editor:
COPY (SELECT * FROM newsletter_subscribers) 
TO '/tmp/newsletter_backup.csv' 
WITH CSV HEADER;
```

## Limpar e Reconstruir
```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Build limpo
npm run build
```

## Variáveis de Ambiente
```bash
# Verificar variáveis locais
cat .env.local

# Verificar no Vercel
vercel env ls
```