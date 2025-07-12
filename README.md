# Ferreiras.Me - Site Institucional

**Site "EM BREVE" para a Ferreiras.Me - Semijoias Exclusivas em Portugal**

🆕 **Última Atualização**: 12/07/2025

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com as credenciais do Supabase e Resend
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Páginas Administrativas

- `/admin/newsletter-all` - Gestão completa de inscritos
- `/admin/monitor` - Monitor do sistema
- `/admin/newsletter-backup` - Lista de backup

## Documentação

- `CLAUDE.md` - Diretrizes do projeto
- `PROJECT_STATUS.md` - Status atual detalhado
- `DEBUG_LOG.md` - Histórico de problemas resolvidos
- `COMMANDS.md` - Comandos úteis

## Deploy

O projeto está configurado para deploy automático no Vercel ao fazer push para o branch `main`.

## Estrutura de Pastas para Imagens

Coloque suas imagens nas seguintes pastas:
- `/public/images/modelos/` - Fotos das modelos
- `/public/images/semijoias/` - Fotos das semijoias

As imagens aparecerão automaticamente na galeria.

## Recursos Implementados

### Frontend
- ✅ Página "EM BREVE" minimalista e elegante
- ✅ Sistema de newsletter com confirmação por correio eletrónico
- ✅ Formulário de contacto integrado
- ✅ Botão WhatsApp flutuante (+351912465539)
- ✅ Partículas douradas animadas
- ✅ Tema claro/escuro
- ✅ Design totalmente responsivo
- ✅ PWA configurado

### Backend
- ✅ Sistema de newsletter com backup redundante
- ✅ Integração com Supabase (PostgreSQL)
- ✅ Envio de correio eletrónico via Resend
- ✅ Sistema de descadastro completo
- ✅ Cache em memória otimizado
- ✅ API RESTful completa

### Administrativo
- ✅ Painel de gestão de newsletter (`/admin/newsletter-all`)
- ✅ Monitor em tempo real (`/admin/monitor`)
- ✅ Sistema de health check
- ✅ Exportação para CSV

## Tecnologias

- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- Supabase (PostgreSQL)
- Resend (Envio de correio eletrónico)
- Vercel (Deploy)
- Framer Motion
- Instagram API

## Instagram Integration

O site possui integração com Instagram para exibir os posts mais recentes da @ferreirasme.

### Configuração Rápida

1. Veja o guia completo em `/docs/INSTAGRAM_SETUP.md`
2. Configure as variáveis de ambiente no `.env.local`
3. Teste a integração em `/test-instagram`

### Recursos da Integração

- Exibição automática dos últimos 6 posts
- Cache de 1 hora para evitar limite de requisições
- Fallback com imagens locais quando API indisponível
- Design responsivo e elegante
- Suporte para autenticação OAuth