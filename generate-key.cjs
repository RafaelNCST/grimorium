const crypto = require('crypto');

// ⚠️ CRÍTICO: Esta chave DEVE ser IDÊNTICA ao obfstr!("...") em src-tauri/src/license.rs
// NUNCA compartilhe esta chave publicamente - ela é única do seu app!
const SECRET_KEY = '26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a';

function generateLicenseKey(email) {
  // Normaliza o email
  const normalizedEmail = email.toLowerCase().trim();

  // Gera hash
  const data = `${normalizedEmail}:${SECRET_KEY}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  // Formata como XXXX-XXXX-XXXX-XXXX
  return `${hash.slice(0,8)}-${hash.slice(8,16)}-${hash.slice(16,24)}-${hash.slice(24,32)}`.toUpperCase();
}

// CLI
const customerEmail = process.argv[2];

if (!customerEmail) {
  console.log('\n❌ Erro: Email não fornecido\n');
  console.log('Uso: node generate-key.js email@cliente.com\n');
  console.log('Exemplo:');
  console.log('  node generate-key.js joao.silva@gmail.com\n');
  process.exit(1);
}

// Validação simples de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(customerEmail)) {
  console.log('\n❌ Erro: Email inválido\n');
  console.log('Por favor, forneça um email válido.\n');
  process.exit(1);
}

const key = generateLicenseKey(customerEmail);

console.log('\n════════════════════════════════════════════════');
console.log('          CHAVE DE LICENÇA GERADA');
console.log('════════════════════════════════════════════════');
console.log(`\nEmail:  ${customerEmail}`);
console.log(`Chave:  ${key}`);
console.log('\n════════════════════════════════════════════════');
console.log('\n📋 Próximos passos:');
console.log('   1. Copie o email e a chave acima');
console.log('   2. Envie ao cliente por email');
console.log('   3. Guarde em seu registro de vendas\n');
console.log('⚠️  IMPORTANTE:');
console.log('   • Cliente pode usar em múltiplos computadores');
console.log('   • Mesma chave funciona sempre');
console.log('   • Cliente deve guardar email + chave\n');
