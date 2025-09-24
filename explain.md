# Grimorium - Projeto de Organização de Mundos de Fantasia

## Visão Geral
O Grimorium é uma aplicação desktop construída com **Tauri** (Rust + React) para ajudar escritores de fantasia a organizarem e gerenciarem seus universos ficcionais. É uma ferramenta completa para criação de personagens, mundos, organizações, raças, espécies, itens e enredos.

## Tecnologias Principais
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Tauri (Rust)
- **UI**: Radix UI + Tailwind CSS + shadcn/ui
- **Estado**: TanStack Query (React Query)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Drag & Drop**: dnd-kit
- **Temas**: next-themes
- **Ícones**: Lucide React

## Estrutura do Projeto

### 📁 Raiz do Projeto
```
grimorium/
├── 📁 src/                    # Código fonte React
├── 📁 src-tauri/             # Código Rust do Tauri
├── 📁 public/                # Assets públicos
├── 📁 dist/                  # Build de produção
├── 📁 node_modules/          # Dependências Node.js
├── 📄 package.json           # Configuração do projeto Node.js
├── 📄 vite.config.ts         # Configuração do Vite
├── 📄 tailwind.config.ts     # Configuração do Tailwind
├── 📄 tsconfig.json          # Configuração TypeScript
└── 📄 components.json        # Configuração shadcn/ui
```

### 📁 src/ - Frontend React
```
src/
├── 📁 components/            # Componentes React reutilizáveis
│   ├── 📁 ui/               # Componentes base da UI (shadcn/ui)
│   └── 📁 modals/           # Componentes de modais
├── 📁 pages/                # Páginas da aplicação
├── 📁 contexts/             # Contextos React (tema, idioma)
├── 📁 hooks/                # Custom hooks
├── 📁 lib/                  # Utilitários e helpers
├── 📁 types/                # Definições de tipos TypeScript
├── 📁 assets/               # Imagens e assets
├── 📄 main.tsx              # Ponto de entrada da aplicação
├── 📄 App.tsx               # Componente raiz e roteamento
└── 📄 index.css             # Estilos globais
```

### 📁 src-tauri/ - Backend Rust
```
src-tauri/
├── 📁 src/                  # Código fonte Rust
├── 📁 icons/                # Ícones da aplicação
├── 📁 capabilities/         # Permissões do Tauri
├── 📄 Cargo.toml            # Configuração do Rust
├── 📄 tauri.conf.json       # Configuração do Tauri
└── 📄 build.rs              # Script de build
```

## Arquivos de Configuração Importantes

### 📄 package.json
- Define dependências do frontend
- Scripts de desenvolvimento e build
- Configurações do projeto Node.js

### 📄 src-tauri/tauri.conf.json
- Configuração da janela da aplicação
- Permissões e segurança
- Build e distribuição
- Configuração da interface nativa

### 📄 vite.config.ts
- Configuração do bundler Vite
- Plugins React e SWC
- Configurações de desenvolvimento

### 📄 tailwind.config.ts
- Sistema de design personalizado
- Cores e variáveis CSS customizadas
- Tema mágico/fantasia

## Funcionalidades Principais

### 🏠 HomePage (`src/components/HomePage.tsx`)
- Dashboard principal
- Estatísticas de projetos
- Navegação para diferentes seções

### 📚 Gestão de Livros
- **BookDashboard**: Interface principal de livros
- **BookCard**: Cartões de visualização de livros
- **CreateBookModal**: Modal para criar novos livros

### 👥 Personagens
- **CharacterDetail**: Página de detalhes do personagem
- **CharacterNavigationSidebar**: Navegação lateral
- **CharacterVersionManager**: Controle de versões
- **CreateCharacterModal**: Criação de personagens
- **FamilyTreePage**: Árvore genealógica

### 🌍 Mundos e Localizações
- **WorldDetail**: Detalhes do mundo
- **WorldTimeline**: Timeline de eventos
- **CreateWorldModal**: Criação de mundos
- **CreateLocationModal**: Criação de localizações
- **CreateContinentModal**: Criação de continentes

### 🧬 Espécies e Raças
- **SpeciesDetail**: Detalhes de espécies
- **RaceDetail**: Detalhes de raças
- **CreateSpeciesModal**: Criação de espécies
- **CreateRaceModal**: Criação de raças

### 🏛️ Organizações
- **OrganizationDetail**: Detalhes de organizações
- **CreateOrganizationModal**: Criação de organizações

### 🐉 Criaturas
- **BeastDetail**: Detalhes de criaturas
- **CreateBeastModal**: Criação de criaturas

### 📜 Enredos
- **PlotArcDetail**: Detalhes de arcos narrativos
- **PlotTimeline**: Timeline de enredos
- **CreatePlotArcModal**: Criação de arcos

### 💎 Itens
- **ItemDetail**: Detalhes de itens
- **ItemTimeline**: Timeline de itens
- **CreateItemModal**: Criação de itens

### 📖 Capítulos
- **ChaptersPage**: Gestão de capítulos
- **ChapterEditor**: Editor de capítulos

### 📝 Editor de Arquivos
- **FileEditor**: Editor de arquivos markdown
- **RichTextEditor**: Editor de texto rico

## Componentes de UI Base

### 📁 src/components/ui/
Componentes baseados no **shadcn/ui** e **Radix UI**:
- **Button**, **Card**, **Dialog**, **Form**
- **Input**, **Select**, **Textarea**, **Tabs**
- **Toast**, **Tooltip**, **Dropdown Menu**
- **Accordion**, **Avatar**, **Badge**
- **Calendar**, **Checkbox**, **Progress**
- **Sidebar**, **Table**, **Sheet**

## Contextos e Estado

### 🎨 ThemeContext (`src/contexts/ThemeContext.tsx`)
- Gerenciamento de temas (claro/escuro)
- Sistema de cores personalizado
- Tema mágico/fantasia

### 🌐 LanguageContext (`src/contexts/LanguageContext.tsx`)
- Suporte a múltiplos idiomas
- Internacionalização da interface

## Hooks Customizados

### 📱 use-mobile (`src/hooks/use-mobile.tsx`)
- Detecção de dispositivos móveis
- Layout responsivo

### 🍞 use-toast (`src/hooks/use-toast.ts`)
- Sistema de notificações
- Feedback para o usuário

## Sistema de Design

### 🎨 Design System
O projeto usa um sistema de design personalizado com tema **mágico/fantasia**:
- **Cores primárias**: Roxo mágico (#8B5CF6)
- **Cores secundárias**: Azul místico
- **Acentos**: Dourado para elementos especiais
- **Gradientes mágicos**: Efeitos visuais especiais
- **Sombras com brilho**: Efeitos de "glow"

### 🎭 Animações
- **Fade in up**: Entrada suave de elementos
- **Glow effect**: Efeito de brilho mágico
- **Stagger animations**: Animações escalonadas
- **Hover effects**: Efeitos de hover interativos

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento
pnpm tauri:dev    # Inicia aplicação Tauri em desenvolvimento

# Build
pnpm build        # Build de produção web
pnpm tauri:build  # Build da aplicação desktop

# Qualidade de código
pnpm lint         # Verificação de lint
```

## Roteamento

A aplicação usa **React Router DOM** com as seguintes rotas principais:
- `/` - HomePage
- `/book/:bookId/character/:characterId` - Detalhes do personagem
- `/book/:bookId/world/:worldId` - Detalhes do mundo
- `/book/:bookId/chapters` - Gestão de capítulos
- `/plot-timeline` - Timeline de enredos
- E muitas outras rotas para diferentes entidades

## Tauri Desktop

### Configuração da Janela
- **Tamanho inicial**: 1400x900px
- **Tamanho mínimo**: 1200x800px
- **Redimensionável**: Sim
- **Centrizada**: Sim
- **Decorações nativas**: Sim

### Recursos Nativos
- Interface desktop nativa
- Integração com sistema operacional
- Performance otimizada
- Segurança aprimorada

## Considerações de Desenvolvimento

1. **Componentes**: Priorize componentes reutilizáveis
2. **Tipos**: Use TypeScript rigorosamente
3. **Estado**: Gerencie estado com React Query
4. **Formulários**: Use React Hook Form + Zod
5. **Estilo**: Siga o sistema de design estabelecido
6. **Performance**: Otimize para desktop com Tauri

Este projeto é uma ferramenta robusta para escritores de fantasia organizarem seus universos ficcionais de forma visual e intuitiva.