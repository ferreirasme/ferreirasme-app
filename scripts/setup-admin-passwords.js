const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Configurar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Função para criar hash de senha
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + 'ferreirasme-2025')
    .digest('hex');
}

async function setupAdminPasswords() {
  console.log('Configurando senhas dos administradores...');
  
  const users = [
    { username: 'tamaraleal', password: 'New***159753' },
    { username: 'johnnyhelder', password: 'New***159753' }
  ];
  
  for (const user of users) {
    const passwordHash = hashPassword(user.password);
    console.log(`\nUsuário: ${user.username}`);
    console.log(`Hash: ${passwordHash}`);
    
    // Atualizar no banco
    const { error } = await supabase
      .from('admin_users')
      .update({ password_hash: passwordHash })
      .eq('username', user.username);
    
    if (error) {
      console.error(`Erro ao atualizar ${user.username}:`, error);
    } else {
      console.log(`✅ ${user.username} atualizado com sucesso!`);
    }
  }
  
  console.log('\n✅ Configuração completa!');
  console.log('\nPara testar o login, use:');
  console.log('- tamaraleal / New***159753');
  console.log('- johnnyhelder / New***159753');
}

// Executar
setupAdminPasswords().catch(console.error);