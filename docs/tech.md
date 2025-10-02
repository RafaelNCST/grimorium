# Arquitetura do Projeto

## Tecnologias
- **Tauri, Vite, React, TypeScript** como principais
- **Tanstack Router** para roteamento
- **Tailwind CSS + Radix UI + shadcn/ui** para estilização
- **Zustand** para gerenciamento de estados globais
- **React Hook Form + Zod** para manipulação de formulários
- **Lucide React** para ícones
- **Internacionalização** com i18n
- **ESLint + Prettier** para padronização de código
- **pnpm** como gerenciador de pacotes
- **Named Exports** como padrão de exportação

---

## Regras gerais
- Sempre componentize componentes visuais muito grandes, lembre-se que eles devem ser puros
- Sempre evite implementações de soluções com gambiarra
- Sempre siga inicialmente as melhores práticas para qualquer implementação
- Navegações que precisam ser passadas pra view, devem ser funções que encapsulam a função de navegação do hook de navegação
- Não distribua comentários e consoles.logs pelo código

## Organização de Pastas

> Toda página visualizável ou modal deve ser separada em **controller (lógica)** e **view (visualização)**

**index.tsx (Controller)**
- Contém toda a lógica da página/modal: navegação, chamadas de hooks e utils
- É a entrada da página/modal e será exportado para uso na rota
- Chama e utiliza a **view**
- Funções e variáveis usadas na view devem ser passadas por props
- Funções devem ser memoizadas com `useCallback` e variáveis complexas com `useMemo`
- Funções devem seguir os padrões de SOLID, sendo légiveis
- Estrutura sugerida: variáveis, states e hooks no topo; funções no meio; chamada da view no final

**view.tsx**
- Componente puro.
- Contém apenas tags HTML ou componentes importados
- Pode ter variáveis que não disparam re-renderizações
- Contém o hook de i18n para traduções

**Pastas de apoio**
- Uma pasta pode ter subpastas auxiliares locais: `hooks`, `utils`, `components`, `mocks`
- Importante: não confundir com versões globais (estas ficam em `/src`)

**Visão final (Exemplo)**
Home
├── index.tsx
├── view.tsx
├── hooks/ (opcional)
├── utils/ (opcional)
├── components/ (opcional)
└── mocks/ (opcional)
└── constants/ (opcional)

## Regras Gerais de Pastas
- Existem arquivos **globais** (em `/src`) e **locais** (dentro de uma página)
- Arquivos globais são criados apenas quando usados em várias páginas diferentes
- Arquivos locais servem apenas para a página onde estão inseridos
- Sempre use **inglês** para nomeações

---

## Mocks
- Todo mock deve estar em uma pasta `mocks`
- **Nunca** devem estar dentro de `index` (controller) ou `view`
- Arquivos devem usar `kebab-case` com prefixo `mock` (ex: `mock-characters.ts`)
- Dentro do arquivo, mocks devem estar em **UPPER_SNAKE_CASE** (ex: `const MOCK_CHARACTERS`)

---

## Components
- Devem ser puros e representar partes complexas separadas da view
- **Não** devem conter lógica
- Podem conter variáveis simples ou chamar o hook de i18n
- Ficam em `components/` com nome de arquivo em `kebab-case` (ex: `tab-bar.tsx`)
- O nome do componente (export) deve estar em **PascalCase** (ex: `TabBar`)

---

## Hooks
- Criados para separar lógicas complexas do controller que usam hooks
- Usados somente dentro de controllers (`index.tsx`)
- Arquivos em `hooks/`, nomeados em `kebab-case` (ex: `use-characters-relationship.ts`)
- O nome do hook (export) deve estar em **camelCase** (ex: `useCharactersRelationship`)

---

## Utils
- Servem para pequenas lógicas **sem hooks**
- Usados apenas dentro de controllers
- Arquivos em `utils/`, nomeados em `kebab-case` (ex: `filter-characters.ts`)
- Dentro de `utils`, devem ser organizados por domínio (ex: `utils/filters/`, `utils/gets/`)
- O nome da função exportada deve estar em **camelCase** (ex: `filterCharacters`)

---

## Stores (Zustand)
- Cada store deve ficar em `stores/` ou como subpasta local se for restrito a uma página
- Arquivos em `kebab-case` (ex: `user-store.ts`)
- O hook exportado do store deve estar em **camelCase** começando com `use` (ex: `useUserStore`)
- Stores globais ficam em `/src/stores`, stores locais ficam dentro da respectiva página

---

## Constants 
- Organizado na pasta constants quando há valores constantes que não se enquadram em mocks, já que são valores constantes que subirão para produção
- Arquivos em `kebab-case` (ex: `user-names.ts`)
- A constant exportado do store deve estar em **UPPER_SNAKE_CASE** com o sufixo `CONSTANT`
- Constants globais ficam em `/src/constants`, constants locais ficam dentro da respectiva página

---

## Internacionalização (i18n)
- Chaves de tradução devem ser organizadas por domínio com notação em `dot.case`  
  - Exemplo: `page.home.title`, `form.login.submit`
- Arquivos de tradução ficam em `locales/`, organizados por idioma (ex: `locales/en`, `locales/pt`)
- Nome dos arquivos de tradução em `kebab-case` (ex: `home.json`, `login.json`)
- Uso em componentes/views deve ser feito apenas com o hook `useTranslation`

---

## TypeScript
- Interfaces usadas em componentes devem ter o prefixo `Props` no nome (ex: `PropsButton`)
- Interfaces não relacionadas a componentes devem ter o prefixo `I` (ex: `IJourney`)
- Todas as tipagens e interfaces globais devem estar em `/src/types`
- Arquivos em `kebab-case` (ex: `user-types.ts`)
- Nunca use `any` para atribuir tipagem, sempre olha as tipagens globais em `src/types` para ver se existe algum tipo, se não crie um tipo no arquivo

---

## Padrões de Nomeação

**Pastas e arquivos**
- Pastas e arquivos em `kebab-case`
- Exceção: parâmetros dentro de `routes/$worldId.tsx`

**Funções e variáveis**
- Funções em **camelCase**
- Funções de eventos em controllers começam com `handle` (ex: `handleClickCharacter`). Quando passadas para views, tornam-se props com prefixo `on` (ex: `onClickCharacter`). Outros tipos de funções devem conter no seu nome tudo o que elas fazem, inclusive seus efeitos colaterais
- Booleans com prefixos `is/has/should/can` (ex: `isActive`)
- Números indicando quantidade ou limite (ex: `maxRetries`)
- Coleções no plural (ex: `users`)
- Constantes em **UPPER_SNAKE_CASE** (ex: `MAX_CONNECTIONS`)

**Componentes**
- Nome do componente em **PascalCase**
- Nome do arquivo em `kebab-case`