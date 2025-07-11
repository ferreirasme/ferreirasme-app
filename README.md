# Ferreiras.Me - Site Institucional

Site em construção para a Ferreiras.Me - Semijoias Exclusivas.

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (opcional para Instagram):
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura de Pastas para Imagens

Coloque suas imagens nas seguintes pastas:
- `/public/images/modelos/` - Fotos das modelos
- `/public/images/semijoias/` - Fotos das semijoias

As imagens aparecerão automaticamente na galeria.

## Recursos

- ✅ Página "Em Construção" responsiva
- ✅ Galeria de imagens com filtros
- ✅ Link para Instagram
- ✅ Formulário de contato
- ✅ Design moderno com gradientes
- ✅ Totalmente responsivo
- ✅ Integração com Instagram Feed
- ✅ Cache inteligente para otimização
- ✅ Fallback automático quando API indisponível

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
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