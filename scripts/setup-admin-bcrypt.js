const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupAdminUsers() {
  try {
    console.log('🔐 Configurando utilizadores admin com bcrypt...');
    
    // Senha padrão para ambos os utilizadores
    const defaultPassword = 'New***159753';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    console.log('Hash gerado:', hashedPassword);
    
    // Configurar tamaraleal
    const { data: tamara, error: tamaraError } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: hashedPassword,
        is_active: true 
      })
      .eq('username', 'tamaraleal')
      .select();
    
    if (tamaraError) {
      console.error('Erro ao atualizar tamaraleal:', tamaraError);
    } else {
      console.log('✅ tamaraleal atualizada:', tamara);
    }
    
    // Configurar johnnyhelder
    const { data: johnny, error: johnnyError } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: hashedPassword,
        is_active: true 
      })
      .eq('username', 'johnnyhelder')
      .select();
    
    if (johnnyError) {
      console.error('Erro ao atualizar johnnyhelder:', johnnyError);
    } else {
      console.log('✅ johnnyhelder atualizado:', johnny);
    }
    
    // Verificar utilizadores
    const { data: users, error: listError } = await supabase
      .from('admin_users')
      .select('username, is_active, created_at');
    
    console.log('\n📋 Utilizadores admin configurados:');
    console.table(users);
    
    console.log('\n✅ Configuração concluída!');
    console.log('🔑 Senha para ambos: New***159753');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

setupAdminUsers();