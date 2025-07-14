const bcrypt = require('bcryptjs');

// Script para gerar hash bcrypt para configurar no Vercel
async function generateHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.log('Uso: node generate-bcrypt-hash.js <senha>');
    console.log('Exemplo: node generate-bcrypt-hash.js MinhaS3nh@Segura');
    process.exit(1);
  }
  
  const hash = await bcrypt.hash(password, 10);
  console.log('\nHash bcrypt gerado:');
  console.log(hash);
  console.log('\nUse este hash como valor das variáveis ADMIN_PASS_1 ou ADMIN_PASS_2 no Vercel');
}

generateHash();