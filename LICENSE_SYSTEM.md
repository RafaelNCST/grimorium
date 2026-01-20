# Sistema de Licenciamento do Grimorium

## Visão Geral

O Grimorium usa um sistema de licenciamento **offline** baseado em hash SHA-256. Não há validação com servidor - tudo é feito localmente no app do usuário.

## Estrutura de Licenças

### Tiers (Níveis)
- **Camponês** (Peasant): Trial de 30 dias
- **Cavaleiro** (Knight): Licença vitalícia

### Trial Period
- Duração: 30 dias
- Inicia no primeiro uso do app
- Armazenado em: `AppData/.license_data`

## Fórmula de Geração de Licença

### SECRET_KEY Atual
```
26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a
```

⚠️ **IMPORTANTE**: Mude este valor antes de produção! Gere um novo com:
```bash
openssl rand -hex 32
```

### Algoritmo de Geração

```
1. Processar email:
   - Converter para lowercase
   - Remover espaços em branco (trim)
   Exemplo: "Usuario@Email.COM  " → "usuario@email.com"

2. Criar string de dados:
   data = email_processado + ":" + SECRET_KEY
   Exemplo: "usuario@email.com:26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a"

3. Gerar hash SHA-256:
   hash = SHA256(data)
   Resultado: string hexadecimal de 64 caracteres

4. Extrair primeiros 32 caracteres:
   hash_substring = hash[0:32]

5. Formatar com hífens (XXXX-XXXX-XXXX-XXXX):
   license_key = hash[0:8] + "-" + hash[8:16] + "-" + hash[16:24] + "-" + hash[24:32]

6. Converter para MAIÚSCULAS:
   license_key = license_key.toUpperCase()
```

### Exemplo Completo

**Input:**
- Email: `dev@grimorium.com`
- Secret: `26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a`

**Processo:**
```
1. Email processado: "dev@grimorium.com"
2. Data: "dev@grimorium.com:26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a"
3. SHA-256: [64 caracteres hex]
4. Primeiros 32: [32 caracteres]
5. Formatado: XXXX-XXXX-XXXX-XXXX
6. Maiúsculas: XXXX-XXXX-XXXX-XXXX
```

## Implementação em Diferentes Linguagens

### Node.js / JavaScript
```javascript
const crypto = require('crypto');

function generateLicenseKey(email) {
  const SECRET_KEY = '26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a';

  // 1. Processar email
  const processedEmail = email.toLowerCase().trim();

  // 2. Criar data string
  const data = `${processedEmail}:${SECRET_KEY}`;

  // 3. Gerar SHA-256
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  // 4. Pegar primeiros 32 caracteres
  const hashSubstring = hash.substring(0, 32);

  // 5. Formatar com hífens
  const licenseKey = [
    hashSubstring.substring(0, 8),
    hashSubstring.substring(8, 16),
    hashSubstring.substring(16, 24),
    hashSubstring.substring(24, 32)
  ].join('-');

  // 6. Converter para maiúsculas
  return licenseKey.toUpperCase();
}

// Exemplo de uso
const email = 'usuario@exemplo.com';
const license = generateLicenseKey(email);
console.log(`Email: ${email}`);
console.log(`License Key: ${license}`);
```

### Python
```python
import hashlib

def generate_license_key(email):
    SECRET_KEY = '26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a'

    # 1. Processar email
    processed_email = email.lower().strip()

    # 2. Criar data string
    data = f"{processed_email}:{SECRET_KEY}"

    # 3. Gerar SHA-256
    hash_object = hashlib.sha256(data.encode())
    hash_hex = hash_object.hexdigest()

    # 4. Pegar primeiros 32 caracteres
    hash_substring = hash_hex[:32]

    # 5. Formatar com hífens
    license_key = '-'.join([
        hash_substring[0:8],
        hash_substring[8:16],
        hash_substring[16:24],
        hash_substring[24:32]
    ])

    # 6. Converter para maiúsculas
    return license_key.upper()

# Exemplo de uso
email = 'usuario@exemplo.com'
license = generate_license_key(email)
print(f'Email: {email}')
print(f'License Key: {license}')
```

### PHP
```php
<?php
function generateLicenseKey($email) {
    $SECRET_KEY = '26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a';

    // 1. Processar email
    $processedEmail = strtolower(trim($email));

    // 2. Criar data string
    $data = $processedEmail . ':' . $SECRET_KEY;

    // 3. Gerar SHA-256
    $hash = hash('sha256', $data);

    // 4. Pegar primeiros 32 caracteres
    $hashSubstring = substr($hash, 0, 32);

    // 5. Formatar com hífens
    $licenseKey = implode('-', [
        substr($hashSubstring, 0, 8),
        substr($hashSubstring, 8, 8),
        substr($hashSubstring, 16, 8),
        substr($hashSubstring, 24, 8)
    ]);

    // 6. Converter para maiúsculas
    return strtoupper($licenseKey);
}

// Exemplo de uso
$email = 'usuario@exemplo.com';
$license = generateLicenseKey($email);
echo "Email: $email\n";
echo "License Key: $license\n";
?>
```

## Integração com Backend

### Fluxo Recomendado

1. **Cliente compra** (Stripe, Gumroad, etc.)
2. **Webhook recebe confirmação de pagamento**
3. **Backend gera licença** usando a fórmula acima
4. **Email enviado** com:
   - Email usado na compra
   - License key gerada
   - Instruções de ativação
5. **Cliente abre Grimorium** e ativa com email + key

### Exemplo de Email
```
Assunto: Sua Licença do Grimorium

Olá!

Obrigado por adquirir o Grimorium! Aqui estão suas credenciais de ativação:

Email: usuario@exemplo.com
Chave de Licença: XXXX-XXXX-XXXX-XXXX

Para ativar:
1. Abra o Grimorium
2. Vá em Configurações > Minha Conta
3. Clique em "Ativar Licença"
4. Digite o email e a chave acima

Bem-vindo ao reino dos Cavaleiros! ⚔️

---
Equipe Grimorium
```

### Webhooks de Pagamento

#### Stripe Example
```javascript
// Endpoint webhook do Stripe
app.post('/webhook/stripe', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;

    // Gerar licença
    const licenseKey = generateLicenseKey(email);

    // Salvar no banco de dados
    await db.licenses.create({
      email: email,
      license_key: licenseKey,
      purchased_at: new Date(),
      tier: 'knight'
    });

    // Enviar email
    await sendLicenseEmail(email, licenseKey);
  }

  res.json({ received: true });
});
```

#### Gumroad Example
```javascript
// Endpoint webhook do Gumroad
app.post('/webhook/gumroad', async (req, res) => {
  const { email, sale_id } = req.body;

  // Gerar licença
  const licenseKey = generateLicenseKey(email);

  // Salvar no banco de dados
  await db.licenses.create({
    email: email,
    license_key: licenseKey,
    sale_id: sale_id,
    purchased_at: new Date(),
    tier: 'knight'
  });

  // Enviar email
  await sendLicenseEmail(email, licenseKey);

  res.status(200).send('OK');
});
```

## Validação no App

O app valida da seguinte forma:

1. Usuário digita email e license key
2. App processa email (lowercase, trim)
3. App gera hash com a mesma fórmula
4. App compara o hash gerado com o fornecido
5. Se bater = licença válida ✅
6. Se não bater = licença inválida ❌

## Armazenamento Local

Arquivo: `AppData/Roaming/com.grimorium.app/.license_data`

Formato: JSON codificado em Base64
```json
{
  "first_run": "2025-01-19T12:00:00Z",
  "license_key": "XXXX-XXXX-XXXX-XXXX",
  "activated_at": "2025-01-20T15:30:00Z",
  "license_email": "usuario@exemplo.com"
}
```

## Limitações do Sistema

### Vantagens
✅ Funciona 100% offline
✅ Sem necessidade de servidor de validação
✅ Rápido e simples
✅ Privacidade total do usuário

### Desvantagens
❌ Mesma chave funciona em múltiplos computadores (sem limite de devices)
❌ Chave pode ser compartilhada entre usuários
❌ Não há como revogar uma licença já ativada
❌ Não há como rastrear quantos devices usam uma licença

## Segurança

### Obfuscação
- `SECRET_KEY` é ofuscado com `obfstr!` no binário compilado
- Dificulta (mas não impede) engenharia reversa
- ~99% dos usuários não conseguem extrair

### Recomendações
1. Mude o `SECRET_KEY` antes de produção
2. Não compartilhe o secret publicamente
3. Mantenha o backend de geração privado
4. Monitore vendas vs ativações (estatísticas)

## Comandos Dev (Apenas em Debug Mode)

Disponíveis apenas durante desenvolvimento:

- `reset_database` - Deleta todo o banco de dados
- `reset_license` - Remove licença e expira trial
- `reset_trial` - Cria novo trial de 30 dias
- `activate_dev_license` - Ativa licença de desenvolvedor

Acessíveis via botão flutuante "Dev Tools" no canto inferior direito.

## Checklist Pré-Produção

- [ ] Mudar `SECRET_KEY` para valor único
- [ ] Atualizar `SECRET_KEY` no backend de geração
- [ ] Testar geração externa vs validação no app
- [ ] Configurar webhook de pagamento
- [ ] Configurar envio de email automático
- [ ] Remover/comentar comandos dev
- [ ] Remover botão "Dev Tools" flutuante
- [ ] Testar fluxo completo: compra → email → ativação

## Contato / Suporte

Para dúvidas sobre implementação do backend de licenciamento, consulte este documento.
