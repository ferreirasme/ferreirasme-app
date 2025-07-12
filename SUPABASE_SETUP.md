# Configuração do Supabase para Newsletter

## ⚠️ IMPORTANTE: Sistema de Backup Automático
O sistema agora possui um **backup automático local** que garante que NENHUM email seja perdido, mesmo se o Supabase falhar. Todos os emails são salvos em:
- `/newsletter-backup/subscribers.json` - Lista completa em JSON
- `/newsletter-backup/critical-YYYY-MM-DD.txt` - Backup diário em texto

### Páginas de Admin:
- `/admin/newsletter` - Visualizar emails do banco de dados
- `/admin/newsletter-backup` - Visualizar emails do backup local (USE EM EMERGÊNCIAS)

## Passo 1: Criar conta no Supabase
1. Acesse https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Crie um novo projeto (escolha a região mais próxima)

## Passo 2: Configurar a tabela
1. No dashboard do Supabase, vá para "SQL Editor"
2. Cole e execute o conteúdo do arquivo `supabase-setup.sql`
3. A tabela `newsletter_subscribers` será criada

## Passo 3: Obter as credenciais
1. Vá em "Settings" > "API"
2. Copie:
   - Project URL (será NEXT_PUBLIC_SUPABASE_URL)
   - Anon public key (será NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Passo 4: Configurar no projeto
1. Adicione ao arquivo `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

## Passo 5: Acessar o admin
Após configurar, acesse: http://localhost:3000/admin/newsletter

## Funcionalidades implementadas:
- ✅ Salvar emails no banco de dados
- ✅ Sistema de confirmação por email
- ✅ Prevenir duplicatas
- ✅ Página admin para visualizar inscritos
- ✅ Exportar lista para CSV
- ✅ Filtrar confirmados/não confirmados

## Envio de emails em massa (futuro)
Com a lista no banco, você poderá:
- Enviar campanhas de email
- Segmentar por data de inscrição
- Acompanhar métricas
- Integrar com ferramentas como SendGrid ou Resend