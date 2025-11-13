# Índice de Componentes e Nomenclatura

Glossário rápido de todos os componentes, hooks e utilities do Grimorium para referência e comunicação rápida entre instâncias.

---

## Componentes de Formulário

| Nome | O que é |
|------|---------|
| **FormInput** | Input de texto genérico com label e erro |
| **FormTextarea** | Textarea para textos longos com contador de caracteres |
| **FormSelect** | Dropdown simples para opções estáticas (single select) |
| **FormMultiSelect** | Dropdown múltiplo para opções estáticas com badges |
| **EntitySelect** | Dropdown que busca e seleciona UMA entidade do banco (character, faction, race, item, region) |
| **EntityMultiSelect** | Dropdown que busca e seleciona MÚLTIPLAS entidades do banco com badges |

---

## Componentes de Layout de Páginas de Detalhes

| Nome | O que é |
|------|---------|
| **DetailPageLayout** | Layout principal de páginas de detalhes (sidebar + conteúdo) |
| **BasicInfoSection** | Container para informações básicas (sempre visível, não colapsável) |
| **AdvancedInfoSection** | Container colapsável para informações avançadas |
| **CollapsibleSection** | Seção colapsável genérica para features especiais (timeline, mapa, etc) |
| **EditControls** | Botões de controle de edição padronizados (Editar/Salvar/Cancelar) |
| **SideNavigation** | Menu de navegação lateral com header/footer opcionais |

---

## Componentes de Listas

| Nome | O que é |
|------|---------|
| **CollapsibleEntityList** | Lista colapsável de entidades com renderização customizada (para facções, personagens, itens, etc) |

---

## Componentes de Modais/Dialogs

| Nome | O que é |
|------|---------|
| **DeleteConfirmationDialog** | Dialog de confirmação de exclusão padronizado com opção de digitar nome |

---

## Sistema de Versões (Componentes)

| Nome | O que é |
|------|---------|
| **VersionSelector** | Dropdown de seleção de versões (usado no header do menu lateral) |
| **VersionCard** | Card de uma versão individual com ações (ativar, editar, deletar) |
| **CreateVersionDialog** | Dialog para criar nova versão |
| **VersionManager** | Componente completo de gerenciamento de versões (lista + ações) |

---

## Hooks Customizados

| Nome | O que é |
|------|---------|
| **useLocalStorageState** | State do React sincronizado com localStorage com debounce automático |
| **useCollapsibleSections** | Gerencia estado de múltiplas seções colapsáveis com persistência |
| **useEditMode** | Gerencia modo de edição com dirty checking e validação |
| **useVersionManagement** | Gerencia todo o ciclo de vida de versões de entidades |
| **useOrphanedIdCleanup** | Limpa IDs órfãos (referências a entidades deletadas) de forma segura |

---

## Utilities

| Nome | O que é |
|------|---------|
| **safeJsonParse** | Parse JSON seguro com fallback (elimina try-catch repetitivo) |
| **getLocalStorageItem** | Busca item do localStorage com parse automático |
| **setLocalStorageItem** | Salva item no localStorage com stringify automático |
| **removeLocalStorageItem** | Remove item do localStorage |

---

## Features das Páginas de Detalhes

| Nome | O que é |
|------|---------|
| **Menu Lateral** | Navegação rápida entre seções da página com smooth scroll |
| **Sistema de Versões** | Versionamento de entidades com versão principal e secundárias |
| **Sistema de Edição** | Modo de edição inline com dirty checking e confirmações |
| **Sistema de Exclusão** | Exclusão com confirmação e validações de dependências |
| **Sistema de Validação** | Validação Zod com feedback visual (sem toasts) - bordas vermelhas, mensagens de erro, botão desabilitado |

---

## Libs Externas Integradas

| Nome | Para que serve |
|------|----------------|
| **@tanstack/react-virtual** | Virtualização de listas longas (98% menos DOM) |
| **use-debounce** | Debounce e throttle de valores e callbacks |
| **zod** | Validação de schemas com TypeScript |

---

## Terminologia Padrão

### Tipos de Seções
- **Basic Info** = Informações básicas (sempre visível)
- **Advanced Info** = Informações avançadas (colapsável)
- **Special Section** = Seção especial (timeline, mapa, etc - colapsável)

### Estados de Edição
- **isEditing** = Está em modo de edição?
- **isSaving** = Está salvando?
- **hasChanges** = Tem mudanças não salvas? (dirty checking)

### Estados de Validação
- **errors** = Record de erros por campo (ex: `{ name: "Nome é obrigatório" }`)
- **validateField** = Função que valida um campo específico (ex: `validateField("fieldName", value)`)
- **hasRequiredFieldsEmpty** = Há campos básicos (obrigatórios) vazios?
- **missingFields** = Array de nomes dos campos básicos faltando (ex: `["name", "otherBasicField"]`)

**Regra:** Campos em BasicInfoSection = obrigatórios | Campos em AdvancedInfoSection = opcionais

### Tipos de Versões
- **Main Version** = Versão principal (apenas 1 por entidade)
- **Secondary Version** = Versão secundária (múltiplas permitidas)
- **Active Version** = Versão atualmente sendo visualizada

### Ações Padrão
- **Create** = Criar nova entidade/versão
- **Update** = Atualizar entidade/versão existente
- **Delete** = Deletar entidade/versão
- **Activate** = Ativar versão como principal

---

## Nomenclatura de Props Comuns

| Prop | Tipo | Significado |
|------|------|-------------|
| **label** | string | Label do campo/seção |
| **value** | any | Valor atual |
| **onChange** | function | Callback de mudança |
| **onValueChange** | function | Callback de mudança (para Radix UI components) |
| **onBlur** | function | Callback quando campo perde foco (para validação) |
| **disabled** | boolean | Campo desabilitado? |
| **required** | boolean | Campo obrigatório? (mostra asterisco vermelho) |
| **error** | string | Mensagem de erro (mostra borda vermelha + mensagem) |
| **placeholder** | string | Placeholder |
| **isOpen** | boolean | Seção aberta? (colapsáveis) |
| **onToggle** | function | Callback de toggle (abrir/fechar) |
| **isEditing** | boolean | Está em modo de edição? |
| **isSaving** | boolean | Está salvando? |
| **hasChanges** | boolean | Tem mudanças não salvas? |
| **errors** | Record<string, string> | Erros por campo (validação) |
| **validateField** | function | Valida um campo específico (validação) |
| **hasRequiredFieldsEmpty** | boolean | Há campos obrigatórios vazios? (validação) |
| **missingFields** | string[] | Lista de campos obrigatórios faltando (validação) |

---

## Padrões de Nomenclatura de Arquivos

```
Componente visual:
- PascalCase
- Singular
- Exemplo: FormInput.tsx, VersionCard.tsx

Hook customizado:
- camelCase
- Prefixo "use"
- Exemplo: useEditMode.ts, useVersionManagement.ts

Utility:
- camelCase
- Verbo ou substantivo
- Exemplo: safeJsonParse.ts, storage.ts

Service (banco de dados):
- kebab-case
- Sufixo ".service"
- Exemplo: regions.service.ts, characters.service.ts

Tipo/Interface:
- PascalCase
- Prefixo "I" para interfaces
- Exemplo: IRegion, ICharacter, IVersion
```

---

## Estrutura de Pastas Padrão

```
src/
├── components/
│   ├── forms/              # Componentes de formulário
│   ├── detail-page/        # Componentes de layout de detalhes
│   ├── version-system/     # Sistema de versões
│   ├── entity-list/        # Listas de entidades
│   └── dialogs/            # Dialogs reutilizáveis
│
├── hooks/                  # Hooks customizados
│
├── lib/
│   ├── db/                # Services do banco de dados
│   └── utils/             # Utilities globais
│
└── pages/
    └── dashboard/
        └── tabs/
            ├── world/          # Tab Mundo
            │   ├── region-detail/
            │   └── region-map/
            ├── characters/     # Tab Personagens
            │   └── character-detail/
            ├── factions/       # Tab Facções
            │   └── faction-detail/
            └── items/          # Tab Itens
                └── item-detail/
```

---

## Como Usar Este Índice

### Cenário 1: Comunicação Rápida
```
Você: "Use o EntityMultiSelect para selecionar facções"
Claude: *sabe que é o dropdown múltiplo que busca facções do banco*
```

### Cenário 2: Criar Nova Tela
```
Você: "Crie CharacterDetail usando DetailPageLayout,
      EditControls, BasicInfoSection e CollapsibleEntityList"
Claude: *sabe exatamente quais componentes usar*
```

### Cenário 3: Adicionar Feature
```
Você: "Adicione useVersionManagement no CharacterDetail"
Claude: *sabe que é o hook de versionamento completo*
```

### Cenário 4: Debug
```
Você: "O useEditMode não está detectando mudanças"
Claude: *sabe que useEditMode é o hook de edição com dirty checking*
```

---

## Documentação Completa

Para detalhes completos de cada componente/hook:

- **Componentes visuais** → `docs/build/components.md`
- **Lógica das features** → `docs/build/details-features.md`
- **Utils, hooks, libs** → `docs/build/logic.md`

---

**Última atualização:** 2025-11-13
