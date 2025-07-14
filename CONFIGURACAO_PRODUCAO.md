# Guia de Configuração para Produção - FerreiraSME App

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Conta na [Resend](https://resend.com) para envio de emails
- Repositório no GitHub com o código do projeto
- Domínio próprio (opcional, mas recomendado)

## 🚀 Passo a Passo para Deploy

### 1. Preparar o Código

#### 1.1 Verificar o Build Local
```bash
# Testar build de produção
npm run build

# Executar localmente
npm start

# Acessar http://localhost:3000 e testar todas as funcionalidades
```

#### 1.2 Criar Repositório no GitHub
```bash
# Se ainda não fez
git init
git add .
git commit -m "Initial commit: FerreiraSME App ready for production"

# Criar repositório no GitHub e adicionar
git remote add origin https://github.com/SEU_USUARIO/ferreirasme-app.git
git push -u origin main
```

### 2. Configurar Resend (Email Service)

#### 2.1 Criar Conta e API Key
1. Acesse [https://resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Vá para **API Keys** no dashboard
4. Clique em **Create API Key**
5. Dê um nome (ex: "FerreiraSME Production")
6. Copie a API Key (formato: `re_xxxxxxxxxxxxxxxxxx`)

#### 2.2 Verificar Domínio (Recomendado)
1. No dashboard da Resend, vá para **Domains**
2. Adicione seu domínio (ex: ferreirasme.com.br)
3. Siga as instruções para adicionar registros DNS
4. Aguarde verificação (geralmente 5-10 minutos)

### 3. Deploy na Vercel

#### 3.1 Importar Projeto
1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **Add New Project**
4. Selecione o repositório `ferreirasme-app`
5. Clique em **Import**

#### 3.2 Configurar Variáveis de Ambiente
Na tela de configuração do projeto, adicione as seguintes variáveis:

```env
# Resend API
RESEND_API_KEY=re_sua_api_key_aqui

# NextAuth
NEXTAUTH_URL=https://seu-dominio.com.br
NEXTAUTH_SECRET=gerar-secret-aleatorio-aqui

# Email Settings
EMAIL_FROM=noreply@seu-dominio.com.br
EMAIL_TO=contato@ferreirasme.com.br

# Opcional: Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Para gerar NEXTAUTH_SECRET:**
```bash
# No terminal, execute:
openssl rand -base64 32
```

#### 3.3 Configurações do Build
- **Framework Preset:** Next.js (auto-detectado)
- **Build Command:** `npm run build` (padrão)
- **Output Directory:** `.next` (padrão)
- **Install Command:** `npm install` (padrão)

#### 3.4 Deploy
1. Clique em **Deploy**
2. Aguarde o build (geralmente 2-5 minutos)
3. Acesse o URL temporário fornecido (ex: ferreirasme-app.vercel.app)

### 4. Configurar Domínio Customizado

#### 4.1 Na Vercel
1. No dashboard do projeto, vá para **Settings** → **Domains**
2. Adicione seu domínio (ex: ferreirasme.com.br)
3. Escolha entre:
   - **www** como principal (recomendado)
   - **apex** (sem www) como principal

#### 4.2 Configurar DNS
No seu provedor de DNS, adicione:

**Para domínio apex (ferreirasme.com.br):**
```
Tipo: A
Nome: @
Valor: 76.76.21.21
```

**Para subdomínio www:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

#### 4.3 Aguardar Propagação
- DNS pode levar até 48h para propagar
- SSL é configurado automaticamente pela Vercel

### 5. Configurações Pós-Deploy

#### 5.1 Testar Funcionalidades
- [ ] Navegação entre páginas
- [ ] Formulário de contato
- [ ] Login administrativo
- [ ] Responsividade mobile
- [ ] Performance (Lighthouse)

#### 5.2 Configurar Analytics (Opcional)
1. Crie conta no [Google Analytics](https://analytics.google.com)
2. Crie uma propriedade GA4
3. Copie o ID de medição (G-XXXXXXXXXX)
4. Adicione como variável de ambiente na Vercel

#### 5.3 Monitoramento
1. **Vercel Analytics:** Ative no dashboard
2. **Error Tracking:** Configure Sentry (opcional)
3. **Uptime Monitor:** Use UptimeRobot ou similar

### 6. Segurança e Otimizações

#### 6.1 Headers de Segurança
Crie `next.config.js` se ainda não existir:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

#### 6.2 Rate Limiting (API Routes)
Considere adicionar rate limiting para prevenir abuse:

```bash
npm install express-rate-limit
```

#### 6.3 Backup de Dados
- Configure backups automáticos se usar banco de dados
- Exporte contatos regularmente
- Mantenha backup do código no GitHub

### 7. Manutenção

#### 7.1 Atualizações de Segurança
```bash
# Verificar vulnerabilidades
npm audit

# Atualizar dependências
npm update

# Fazer novo deploy
git add .
git commit -m "chore: security updates"
git push
```

#### 7.2 Monitorar Performance
- Vercel Analytics Dashboard
- Google PageSpeed Insights
- GTmetrix

#### 7.3 Logs e Debugging
```bash
# Ver logs em tempo real
vercel logs --follow

# Ver logs de um deploy específico
vercel logs [deployment-url]
```

## 📊 Checklist Final

### Antes do Deploy
- [x] Build local funcionando
- [x] Todas as funcionalidades testadas
- [x] Variáveis de ambiente preparadas
- [x] Código no GitHub

### Durante o Deploy
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] URL temporário funcionando

### Após o Deploy
- [ ] Domínio customizado configurado
- [ ] SSL ativo
- [ ] Emails funcionando
- [ ] Analytics configurado
- [ ] Monitoramento ativo

## 🆘 Troubleshooting

### Erro: "Build Failed"
1. Verifique os logs de build na Vercel
2. Teste build local: `npm run build`
3. Verifique variáveis de ambiente

### Erro: "500 Internal Server Error"
1. Verifique logs: `vercel logs`
2. Confirme variáveis de ambiente
3. Teste localmente com variáveis de produção

### Emails não chegam
1. Verifique API Key da Resend
2. Confirme domínio verificado
3. Verifique spam/lixo eletrônico
4. Teste no dashboard da Resend

### Domínio não funciona
1. Verifique configurações DNS
2. Use ferramentas como `nslookup` ou `dig`
3. Aguarde propagação (até 48h)
4. Confirme configuração na Vercel

## 📞 Suporte

- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Resend:** [resend.com/docs](https://resend.com/docs)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)

---

**Última atualização:** 14/07/2025  
**Versão:** 1.0.0