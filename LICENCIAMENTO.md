# Sistema de Licenciamento - Grimorium

---

## 📋 Especificações da Licença

### Características
- **Trial:** 30 dias gratuitos
- **Tipo:** Compra única, uso vitalício
- **Máquinas:** Ilimitadas (mesma licença em todos os PCs)
- **Ativação:** Offline (email + chave)
- **Proteção:** Ofuscação de chave secreta

### Validação
- **Algoritmo:** SHA-256
- **Entrada:** Email do cliente + SECRET_KEY (ofuscada)
- **Saída:** Chave de 32 caracteres (formato: XXXX-XXXX-XXXX-XXXX)
- **Verificação:** Local, sem servidor

### Armazenamento
- **Arquivo:** `.license_data` (oculto, base64)
- **Localização:**
  - Windows: `%APPDATA%\com.grimorium.app\.license_data`
  - macOS: `~/Library/Application Support/com.grimorium.app/.license_data`
  - Linux: `~/.local/share/com.grimorium.app/.license_data`

---

## 👤 Fluxos do Usuário

### Cenário 1: Primeiro Uso (Trial)

```
1. Cliente baixa e instala app

2. Abre app pela primeira vez
   └─> App cria arquivo .license_data
   └─> Salva data atual como "first_run"
   └─> Mostra: "30 dias de trial grátis"

3. Durante os 30 dias
   └─> App funciona normalmente
   └─> Mostra discretamente: "X dias restantes"

4. App funciona até day 30
```

**Arquivo criado:**
```json
{
  "first_run": "2026-01-19T10:00:00Z",
  "license_key": null,
  "activated_at": null,
  "license_email": null
}
```

---

### Cenário 2: Trial Expirou → Compra e Ativa

```
1. Dia 31: Cliente tenta abrir app
   └─> App bloqueia acesso
   └─> Mostra tela de ativação

2. Cliente decide comprar
   └─> Acessa seu site
   └─> Paga o app
   └─> Recebe email SEU com:
       ├─ Email: cliente@email.com
       └─ Chave: A1B2-C3D4-E5F6-G7H8

3. Cliente volta ao app
   └─> Ainda bloqueado na tela de ativação
   └─> Vê dois campos:
       ┌─────────────────────────┐
       │ Email: [____________]   │ ← Digita: cliente@email.com
       │ Chave: [____________]   │ ← Digita: A1B2-C3D4-E5F6-G7H8
       │      [Ativar]           │
       └─────────────────────────┘

4. Cliente clica "Ativar"
   └─> App valida localmente:
       ├─ Calcula: SHA256(email + SECRET_KEY)
       ├─ Compara com chave digitada
       └─> ✅ Se bater: ativa
           ❌ Se não bater: "Chave inválida"

5. Ativado com sucesso
   └─> App atualiza .license_data
   └─> App funciona para sempre
```

**Arquivo atualizado:**
```json
{
  "first_run": "2026-01-19T10:00:00Z",
  "license_key": "A1B2-C3D4-E5F6-G7H8",
  "activated_at": "2026-02-20T15:30:00Z",
  "license_email": "cliente@email.com"
}
```

---

### Cenário 3: Ativa Antes do Trial Expirar

```
1. Cliente compra no dia 5 do trial
   └─> Recebe email com licença

2. Abre app (ainda em trial)
   └─> App funcionando normalmente
   └─> Cliente vai em: Configurações → Licença
   └─> Clica "Ativar Licença" (ou botão similar)

3. Mostra tela de ativação
   └─> Cliente digita email + chave

4. Ativa
   └─> Trial "termina" imediatamente
   └─> Passa a ser licença vitalícia
```

---

### Cenário 4: Segunda Máquina (Laptop)

```
1. Cliente instala app no laptop
   └─> Novo arquivo .license_data criado
   └─> Trial começa do zero (30 dias)

2. Cliente NÃO quer esperar trial
   └─> Clica "Já tenho licença"
   └─> Ou vai em Configurações → Ativar

3. Digita MESMO email + MESMA chave
   ├─ Email: cliente@email.com
   └─ Chave: A1B2-C3D4-E5F6-G7H8

4. App valida
   └─> Calcula SHA256 localmente
   └─> ✅ Chave bate → Ativa

5. Laptop ativado
   └─> Mesma licença funciona
   └─> Sem limite de máquinas
```

---

### Cenário 5: Formatou o PC

```
1. Cliente formata PC
   └─> Arquivo .license_data é deletado

2. Reinstala app
   └─> App cria novo .license_data
   └─> Trial de 30 dias começa

3. Cliente clica "Já tenho licença"
   └─> Digita email + chave (que guardou)
   └─> Ativa novamente

4. Volta a funcionar
   └─> Sem problemas
```

**Importante:** Cliente precisa guardar email + chave que recebeu.

---

### Cenário 6: Chave Inválida

```
1. Cliente tenta ativar com chave errada
   └─> Digita:
       ├─ Email: cliente@email.com
       └─ Chave: XXXX-YYYY-ZZZZ-WWWW (inventada)

2. App calcula
   └─> SHA256("cliente@email.com" + SECRET_KEY)
   └─> Resultado: A1B2-C3D4-E5F6-G7H8

3. App compara
   └─> Esperava: A1B2-C3D4-E5F6-G7H8
   └─> Recebeu: XXXX-YYYY-ZZZZ-WWWW
   └─> ❌ Diferente!

4. Mostra erro
   └─> "Chave inválida. Verifique email e chave."
   └─> Cliente continua bloqueado
```

---

### Cenário 7: Email Errado

```
1. Cliente tem chave correta mas erra email
   └─> Digita:
       ├─ Email: cliente@gmal.com (typo)
       └─ Chave: A1B2-C3D4-E5F6-G7H8 (correta)

2. App calcula com email errado
   └─> SHA256("cliente@gmal.com" + SECRET_KEY)
   └─> Resultado: 9Z8Y-7X6W-5V4U-3T2S

3. App compara
   └─> Esperava (recalculado): 9Z8Y-7X6W-5V4U-3T2S
   └─> Recebeu: A1B2-C3D4-E5F6-G7H8
   └─> ❌ Diferente!

4. Rejeita
   └─> "Chave inválida"
   └─> Cliente precisa corrigir email
```

---

## 🔧 Seu Processo (Vendedor)

### Quando Cliente Compra

```
1. Cliente compra via Gumroad/LemonSqueezy
   └─> Você recebe notificação
   └─> Email do cliente: joao@email.com

2. Você gera chave
   └─> Terminal: node generate-key.cjs joao@email.com
   └─> Output:
       ════════════════════════════════
       Email: joao@email.com
       Chave: A1B2-C3D4-E5F6-G7H8
       ════════════════════════════════

3. Você envia email (use template)
   └─> Assunto: Sua licença do Grimorium
   └─> Corpo:
       Email: joao@email.com
       Chave: A1B2-C3D4-E5F6-G7H8

       [Instruções de ativação]

4. Cliente recebe e ativa
```

---

## ⚠️ Configuração Obrigatória

### Antes do Build de Produção

**1. Mudar SECRET_KEY ofuscada**

Arquivo: `src-tauri/src/license.rs`

```rust
fn get_secret_key() -> &'static str {
    obfstr!("GRIMORIUM_LICENSE_KEY_V1")  // ❌ MUDE ISSO!
}

// Para:
fn get_secret_key() -> &'static str {
    obfstr!("G7x9Kp2mQwE8rT4vYnB6zL1c")  // ✅ Algo único
}
```

**2. Atualizar generate-key.cjs**

Arquivo: `generate-key.cjs`

```javascript
const SECRET_KEY = 'GRIMORIUM_LICENSE_KEY_V1';  // ❌ MUDE!

// Para:
const SECRET_KEY = 'G7x9Kp2mQwE8rT4vYnB6zL1c';  // ✅ MESMA do license.rs
```

⚠️ **DEVEM SER IDÊNTICAS!**

---

## 🛡️ Proteção Implementada

### Ofuscação de String

```rust
use obfstr::obfstr;

fn get_secret_key() -> &'static str {
    obfstr!("sua_chave_secreta")
}
```

**O que faz:**
- Ofusca a string no binário compilado
- Dificulta encontrar SECRET_KEY via decompiler
- Não é 100% seguro, mas adiciona camada de proteção

**Nível de proteção:**
- Usuário casual: ⭐⭐⭐⭐⭐ (Não consegue)
- Hacker novato: ⭐⭐⭐⭐ (Muito difícil)
- Hacker experiente: ⭐⭐ (Consegue com esforço)

**Conclusão:** Suficiente para 99% dos casos.
