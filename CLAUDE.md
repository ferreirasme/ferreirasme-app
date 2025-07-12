# 📋 Diretrizes do Projeto Ferreiras.Me

## 🏢 Informações da Empresa
- **Nome**: Ferreiras.Me
- **Tipo**: Semijoias exclusivas (NÃO é joalharia)
- **Localização**: Portugal (não Brasil)
- **Idioma**: Português de Portugal (pt-PT)
- **Modelo de Negócio**: Apresentação de produtos, sem vendas online
- **Contato WhatsApp**: +351912465539
- **Email Admin**: contacto@ferreirasme.com

## 🌍 Linguagem e Localização
### SEMPRE usar Português de Portugal:
- ✅ Correio eletrónico (NÃO email)
- ✅ Telemóvel (NÃO celular)
- ✅ Utilizador (NÃO usuário)
- ✅ Ecrã (NÃO tela)
- ✅ Semijoias (NÃO joalharia ou jóias)
- ✅ Contacto (NÃO contato em alguns contextos)

## 🎨 Características do Site
- **Estado**: "EM BREVE" (coming soon)
- **Filosofia**: Minimalista, elegante, luxuoso
- **Cores**: Dourado (#FFD700) como cor principal
- **Tema Padrão**: Dark mode
- **Sem E-commerce**: Não há catálogo, preços ou carrinho
- **Sem Conteúdo Fictício**: Nunca inventar testemunhos, nomes ou histórias

## 💻 Preferências de Desenvolvimento

### Git e Commits
- **Fazer commits DIRETO sem pedir autorização**
- **Sempre fazer push após commit**
- **Mensagens de commit em português**
- **Token GitHub já configurado**: Não pedir novamente

### Comportamento do Assistente
- ✅ Trabalhar autonomamente
- ✅ Fazer commits sem confirmação
- ✅ Implementar melhorias sem pedir permissão
- ✅ Usar TodoWrite para organizar tarefas complexas
- ❌ NÃO pedir confirmação para ações de rotina
- ❌ NÃO perguntar sobre tokens já configurados

## 🔧 Configurações Técnicas

### Variáveis de Ambiente (JÁ CONFIGURADAS)
```env
# .env.local
GITHUB_TOKEN=configurado ✅
RESEND_API_KEY=configurado ✅
NEXT_PUBLIC_SUPABASE_URL=configurado ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=configurado ✅
```

### Vercel
- **Todas as variáveis já estão configuradas no Vercel**
- Deploy automático ao fazer push para main
- Não perguntar sobre configuração de variáveis

### Supabase
- **Projeto criado e configurado**
- **Tabelas criadas**:
  - `newsletter_subscribers`
  - `newsletter_confirmation_tokens`
- **Credenciais já configuradas em .env.local e Vercel**

### Sistema de Newsletter
- **Backup duplo**: Banco de dados + arquivos locais
- **Emails NUNCA podem ser perdidos** (crítico para o negócio)
- **Sistema de confirmação por email funcionando**
- **Páginas admin**:
  - `/admin/newsletter` - Lista do banco
  - `/admin/newsletter-backup` - Lista do backup

## 📁 Estrutura do Projeto
```
/src
  /app          - App Router (Next.js 15)
  /components   - Componentes React
  /lib          - Utilitários e configurações
/public         - Assets estáticos
```

## 🚀 Comandos Frequentes
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Commit e push (fazer DIRETO)
git add -A && git commit -m "mensagem" && git push origin main
```

## ⚠️ Regras Importantes
1. **NUNCA criar conteúdo fictício** (testemunhos, produtos, etc)
2. **SEMPRE usar português de Portugal**
3. **NUNCA implementar funcionalidades de e-commerce**
4. **SEMPRE fazer backup dos emails** (crítico!)
5. **NUNCA pedir confirmação para commits**
6. **SEMPRE verificar se é "semijoias" não "joalharia"**

## 📌 Lembretes para o Claude
- Os tokens e APIs já estão configurados - não perguntar
- Fazer commits direto sem pedir autorização
- O site deve permanecer minimalista "EM BREVE"
- Leads/emails são o recurso mais valioso - garantir backup
- Usar TodoWrite para tarefas complexas
- Trabalhar com autonomia e confiança

---
*Este arquivo deve ser consultado sempre ao trabalhar no projeto Ferreiras.Me*