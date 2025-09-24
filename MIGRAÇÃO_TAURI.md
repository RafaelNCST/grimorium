# 🚀 Migração para Tauri - Grimorium Desktop

## 📋 O que mudou

O **Grimorium** foi migrado de uma aplicação web para uma **aplicação desktop** usando **Tauri**, mantendo 100% das funcionalidades e design originais.

## 🔧 Mudanças Técnicas Realizadas

### 1. **Dependências Adicionadas**
- `@tauri-apps/cli`: CLI do Tauri para desenvolvimento e build

### 2. **Configurações Atualizadas**

#### **package.json**
- Nome do projeto alterado para `grimorium`
- Novos scripts adicionados:
  - `pnpm tauri:dev` - Executa a aplicação desktop em modo desenvolvimento
  - `pnpm tauri:build` - Compila a aplicação desktop para distribuição
  - `pnpm tauri` - Acesso direto ao CLI do Tauri

#### **vite.config.ts**
- Configuração otimizada para Tauri
- Suporte a variáveis de ambiente Tauri (`TAURI_ENV_*`)
- Build targets específicos por plataforma
- Configuração de HMR para desenvolvimento mobile

#### **Estrutura do Projeto**
```
grimorium/
├── src/                    # Código React (inalterado)
├── src-tauri/             # Novo: Backend Rust do Tauri
│   ├── Cargo.toml         # Dependências Rust
│   ├── tauri.conf.json    # Configuração da aplicação
│   ├── build.rs           # Build script Rust
│   ├── icons/             # Ícones da aplicação
│   └── src/
│       ├── main.rs        # Entry point Rust
│       └── lib.rs         # Lógica principal Tauri
└── dist/                  # Build da aplicação web
```

## 🖥️ Como usar agora

### **Desenvolvimento**
```bash
# Antes (web):
pnpm dev

# Agora (desktop):
pnpm tauri:dev
```

### **Build para produção**
```bash
# Antes (web):
pnpm build

# Agora (desktop):
pnpm tauri:build
```

### **Preview/teste**
```bash
# Web ainda funciona:
pnpm dev          # Abre no navegador (localhost:8080)
pnpm tauri:dev    # Abre janela desktop nativa
```

## 📱 Configuração da Janela

A aplicação desktop é configurada com:
- **Tamanho inicial**: 1400x900 pixels
- **Tamanho mínimo**: 1200x800 pixels
- **Título**: "Grimorium - Organize Seus Mundos de Fantasia"
- **Redimensionável**: Sim
- **Centralizada**: Sim

## 🔧 Requisitos de Sistema

### **Para desenvolvimento:**
- **Node.js** 18+
- **pnpm** (gerenciador de pacotes)
- **Rust** (instalado automaticamente pelo Tauri)
- **Build tools** do sistema operacional:
  - **Linux/WSL**: `build-essential` (gcc, make, etc.)
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools

### ⚠️ **IMPORTANTE - Dependências do Sistema (Linux/WSL):**

**ANTES** de executar `pnpm tauri:dev`, você DEVE instalar TODAS as dependências:

```bash
# Ubuntu/Debian/WSL - Comando COMPLETO:
sudo apt update
sudo apt install -y \
    build-essential \
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    pkg-config

# Fedora/CentOS/RHEL:
sudo dnf groupinstall "Development Tools"
sudo dnf install \
    webkit2gtk4.0-devel \
    gtk3-devel \
    libappindicator-gtk3-devel \
    librsvg2-devel \
    pkgconf-pkg-config

# Arch Linux:
sudo pacman -S \
    base-devel \
    webkit2gtk \
    gtk3 \
    libappindicator-gtk3 \
    librsvg \
    pkgconf
```

**Verificar se foi instalado:**
```bash
gcc --version
pkg-config --version
# Ambos devem mostrar versões
```

### **Para usuários finais:**
- Apenas o executável gerado (sem dependências)

## 🚀 Vantagens da Migração

### ✅ **Mantido:**
- Todo o design e UX existente
- Todas as funcionalidades (personagens, mundos, timeline, etc.)
- Performance da interface React
- Compatibilidade com Tailwind CSS
- Todos os componentes Shadcn/ui

### 🆕 **Novo:**
- **Performance superior** (sem overhead do navegador)
- **Aplicação nativa** do sistema operacional
- **Ícone na área de trabalho** e menu iniciar
- **Instalação única** (não precisa de navegador)
- **Melhor segurança** (sandbox isolado)
- **Menor uso de recursos** (sem abas do navegador)

## 📦 Distribuição

### **Arquivos gerados:**
- **Linux**: `.deb`, `.AppImage`
- **macOS**: `.dmg`, `.app`
- **Windows**: `.msi`, `.exe`

### **Localização dos builds:**
```
src-tauri/target/release/bundle/
```

## 🔄 Compatibilidade

- ✅ **Funciona offline** (não precisa de internet)
- ✅ **Dados locais** (localStorage ainda funciona)
- ✅ **Todas as features** React/TypeScript mantidas
- ✅ **Hot reload** durante desenvolvimento
- ✅ **Pode ainda ser usado no navegador** se necessário

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento desktop
pnpm tauri:dev

# Build para produção
pnpm tauri:build

# Desenvolvimento web (ainda funciona)
pnpm dev

# Linting e verificações
pnpm lint

# Info sobre o Tauri
pnpm tauri info
```

## 🔧 Solução de Problemas

### **❌ Erro: `linker 'cc' not found`**
**Causa:** Build tools não instaladas no sistema.

**Solução:**
```bash
# Ubuntu/Debian/WSL:
sudo apt update
sudo apt install -y build-essential
```

### **❌ Erro: `pkg-config` not found ou `atk-sys` build failed**
**Causa:** Dependências GUI/GTK não instaladas no sistema.

**Solução COMPLETA (Ubuntu/Debian/WSL):**
```bash
sudo apt update
sudo apt install -y \
    build-essential \
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    pkg-config

# Verificar:
gcc --version
pkg-config --version
```

### **❌ Erro de compilação Rust:**
```bash
# Limpar cache e recompilar:
cd src-tauri
cargo clean
cd ..
pnpm tauri:dev

# Se ainda não funcionar, reinstalar Rust:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### **⚠️ Warnings: `libEGL warning: failed to open /dev/dri/renderD128`**
**Causa:** Limitações de acesso a GPU no WSL/ambientes virtualizados.

**Status:** ✅ **NORMAL - Não afeta o funcionamento da aplicação**

Estes warnings são esperados no WSL e podem ser ignorados. A aplicação funciona perfeitamente com renderização por software.

### **🎨 Problemas Visuais e Performance (RESOLVIDOS)**

#### **❌ Borda branca ao redor da aplicação**
**Causa:** CSS não otimizado para aplicação desktop.

**✅ Solução aplicada:**
- CSS otimizado para eliminar bordas brancas
- Background consistente em todo o HTML/body
- Configurações de janela otimizadas

#### **🐌 Aplicação travada/lenta**
**Causa:** Configuração não otimizada para desenvolvimento.

**✅ Soluções aplicadas:**
- Otimização do Vite com manual chunks
- Redução do file watching overhead
- Otimização de dependências
- Performance melhorada para desktop

### **Aplicação não abre:**
- Verificar se o build foi bem-sucedido
- Executar `pnpm tauri:dev` para debug
- Verificar logs no terminal

## 📝 Próximos Passos Opcionais

Para futuras melhorias, considerar:
- **Auto-updater** para atualizações automáticas
- **Menus nativos** do sistema operacional
- **Atalhos de teclado** globais
- **Integração com sistema de arquivos** nativo
- **Notificações** do sistema operacional

---

**A aplicação mantém toda sua funcionalidade original, agora em uma experiência desktop nativa! 🎉**