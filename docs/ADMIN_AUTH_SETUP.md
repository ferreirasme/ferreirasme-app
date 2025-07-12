# Configuração de Autenticação Admin

## Configuração das Variáveis de Ambiente no Vercel

Para ativar o sistema de autenticação com as credenciais seguras, siga estes passos:

### 1. Acesse o Dashboard do Vercel
1. Vá para https://vercel.com/dashboard
2. Selecione o projeto `ferreirasme-app`
3. Clique em "Settings" (Configurações)
4. No menu lateral, clique em "Environment Variables"

### 2. Adicione as Seguintes Variáveis

#### Variáveis de Segurança (OBRIGATÓRIAS)
```
AUTH_SECRET = [gerar string aleatória de 32+ caracteres]
AUTH_SALT = [gerar outra string aleatória de 16+ caracteres]
```

**Como gerar strings seguras:**
- No terminal: `openssl rand -hex 32`
- Ou use: https://randomkeygen.com/

#### Credenciais dos Usuários
```
ADMIN_USER_1 = tamaraleal
ADMIN_PASS_1 = New***159753
ADMIN_USER_2 = johnnyhelder
ADMIN_PASS_2 = New***159753
```

### 3. Importante sobre Segurança

⚠️ **AVISO**: As senhas atuais são temporárias. Recomendo fortemente:

1. **Trocar as senhas** após a primeira configuração
2. **Usar senhas diferentes** para cada usuário
3. **Senhas fortes** com pelo menos 12 caracteres, incluindo:
   - Letras maiúsculas e minúsculas
   - Números
   - Caracteres especiais

### 4. Aplicar as Variáveis

1. Após adicionar todas as variáveis, clique em "Save"
2. O Vercel fará um novo deploy automaticamente
3. Aguarde o deploy concluir (cerca de 1-2 minutos)

### 5. Testar o Login

1. Acesse: https://ferreiras.me/admin/login
2. Use as credenciais configuradas
3. Você deve ser redirecionado para a página administrativa

## Fallback Temporário

Enquanto as variáveis não estão configuradas no Vercel, o sistema usa credenciais temporárias hardcoded:
- tamaraleal / New***159753
- johnnyhelder / New***159753

⚠️ **Isso é apenas temporário e aparecerá um aviso no console.**

## Troubleshooting

Se o login não funcionar:
1. Verifique se todas as variáveis foram adicionadas corretamente
2. Certifique-se de que o deploy foi concluído
3. Limpe os cookies do navegador para o domínio ferreiras.me
4. Tente em uma aba anônima/privada

## Segurança Adicional

Para máxima segurança, considere:
1. Implementar 2FA (autenticação de dois fatores)
2. Logs de auditoria para acessos admin
3. Rotação periódica de senhas
4. Limite de tentativas de login