# Tabs - EntityListLayout (Super Layout)

Sistema completo e genérico para criação de páginas de listagem de entidades (tabs). Gerencia automaticamente estados de loading, empty, filtros, busca e renderização de cards.

**Localização:** `src/components/layouts/EntityListLayout.tsx`

---

## 📋 Visão Geral

O `EntityListLayout` é um **super layout orquestrador** que unifica toda a estrutura de uma página de listagem. Ele gerencia 4 estados automaticamente e integra todos os componentes necessários (header, filtros, busca, cards).

### Componentes da Arquitetura

```
EntityListLayout (Orquestrador Principal)
├── EntityListHeader (Título + Ações + Filtros)
│   ├── Título e Descrição
│   ├── Botões (Primário + Secundários)
│   └── EntityFilterBadges (Filtros opcionais)
├── EntitySearchBar (Busca opcional)
├── EntityCardList (Renderização de cards)
└── EmptyState (Estados vazios)
```

### Estados Gerenciados Automaticamente

1. **Loading** - Spinner centralizado enquanto carrega
2. **Empty** - Quando não há dados no sistema (header + empty state)
3. **No Results** - Quando filtros/busca não retornam nada (header + filtros + no results)
4. **Success** - Exibição do conteúdo completo (header + filtros + busca + cards)

---

## 🚀 Uso Básico (Exemplo Simples)

```tsx
import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { Users } from "lucide-react";

export function CharactersTab({ bookId }: Props) {
  const characters = useCharactersStore((state) => state.characters);
  const fetchCharacters = useCharactersStore((state) => state.fetchCharacters);

  useEffect(() => {
    fetchCharacters(bookId);
  }, [bookId]);

  return (
    <EntityListLayout
      // Estados
      isLoading={false}
      isEmpty={characters.length === 0}

      // Empty state
      emptyState={{
        icon: Users,
        title: "Nenhum personagem criado",
        description: "Crie seu primeiro personagem para começar",
      }}

      // Header
      header={{
        title: "Personagens",
        description: "Gerencie os personagens da sua história",
        primaryAction: {
          label: "Novo Personagem",
          onClick: () => setShowModal(true),
          variant: "magical",
        },
      }}
    >
      {/* Renderização de cards */}
      <EntityCardList
        items={characters}
        renderCard={(character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={() => navigate(character.id)}
          />
        )}
        gridCols={{ sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
      />
    </EntityListLayout>
  );
}
```

---

## 🎯 Uso Avançado (Filtros + Busca + Botões Extras)

```tsx
import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { Network, Plus } from "lucide-react";
import { useEntityFilters } from "@/hooks/use-entity-filters";
import { calculateEntityStats } from "@/utils/calculate-entity-stats";
import { createScaleFilterRows } from "./helpers/scale-filter-config";

export function WorldTab({ bookId }: Props) {
  const { t } = useTranslation("world");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);

  const regions = useWorldStore((state) => state.regions);
  const isLoading = useWorldStore((state) => state.isLoading);

  // Hook de filtros genérico
  const {
    searchTerm,
    setSearchTerm,
    filters: { scales },
    toggleFilterValue,
    clearAllFilters,
    filteredEntities: filteredRegions,
  } = useEntityFilters({
    entities: regions,
    searchFields: ["name", "summary"],
    filterGroups: [{ key: "scales", entityField: "scale" }],
  });

  // Cálculo de estatísticas
  const scaleStats = useMemo(
    () => calculateEntityStats(regions, {
      field: "scale",
      values: ["local", "regional", "continental", "global", "planetary", "cosmic"],
    }),
    [regions]
  );

  // Configuração de filtros
  const scaleFilterRows = useMemo(
    () => createScaleFilterRows(scaleStats, t),
    [scaleStats, t]
  );

  return (
    <EntityListLayout
      // Estados
      isLoading={isLoading}
      loadingText={t("loading")}
      isEmpty={regions.length === 0}
      showNoResultsState={filteredRegions.length === 0 && regions.length > 0}

      // Empty states
      emptyState={{
        icon: Network,
        title: t("empty_state.title"),
        description: t("empty_state.description"),
        primaryButton: {
          label: t("new_region_button"),
          onClick: () => setShowCreateModal(true),
          variant: "magical",
        },
      }}
      noResultsState={{
        icon: Search,
        title: t("no_results.title"),
        description: t("no_results.description"),
      }}

      // Header com botões extras
      header={{
        title: t("title"),
        description: t("description"),
        primaryAction: {
          label: t("new_region_button"),
          onClick: () => setShowCreateModal(true),
          variant: "magical",
          icon: Plus,
          className: "animate-glow",
        },
        secondaryActions: [
          {
            label: t("manage_hierarchy_button"),
            onClick: () => setShowHierarchyModal(true),
            variant: "secondary",
            icon: Network,
          },
        ],
      }}

      // Filtros (OPCIONAL - só aparece se passar)
      filters={{
        totalCount: regions.length,
        totalLabel: t("filters.all"),
        selectedFilters: scales || [],
        filterRows: scaleFilterRows,
        onFilterToggle: (scale) => toggleFilterValue("scales", scale),
        onClearFilters: clearAllFilters,
      }}

      // Busca (OPCIONAL - só aparece se passar)
      search={{
        value: searchTerm,
        onChange: setSearchTerm,
        placeholder: t("search_placeholder"),
        maxWidth: "max-w-lg",
      }}
    >
      {/* Renderização de cards */}
      <EntityCardList
        items={filteredRegions}
        renderCard={(region) => (
          <RegionCard
            key={region.id}
            region={region}
            onClick={() => navigate(region.id)}
          />
        )}
        gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      />
    </EntityListLayout>
  );
}
```

---

## 📝 Props do EntityListLayout

### Estados Obrigatórios

| Prop | Tipo | Descrição |
|------|------|-----------|
| `isLoading` | `boolean` | Estado de carregamento. Quando `true`, exibe spinner |
| `isEmpty` | `boolean` | Indica se não há dados. Quando `true`, exibe empty state |
| `emptyState` | `EmptyStateConfig` | Configuração do estado vazio (ícone, título, descrição, botões) |
| `header` | `HeaderConfig` | Configuração do header (título, descrição, ações) |
| `children` | `ReactNode` | Conteúdo a renderizar (geralmente um `EntityCardList`) |

### Estados Opcionais

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `loadingText` | `string` | `"Loading..."` | Texto exibido abaixo do spinner |
| `showNoResultsState` | `boolean` | `false` | Exibe estado "sem resultados" ao invés do conteúdo |
| `noResultsState` | `EmptyStateConfig` | _(genérico)_ | Configuração customizada para "sem resultados" |

### Componentes Opcionais (só aparecem se passar)

| Prop | Tipo | Descrição |
|------|------|-----------|
| `search` | `SearchConfig` | Configuração da barra de busca (OPCIONAL) |
| `filters` | `FilterConfig<T>` | Configuração dos filtros (OPCIONAL) |

---

## 🎨 Interfaces de Configuração

### EmptyStateConfig

```typescript
interface EmptyStateConfig {
  icon: LucideIcon;              // Ícone a exibir
  title: string;                 // Título do estado vazio
  description: string;           // Descrição explicativa
  primaryButton?: {              // Botão primário (opcional)
    label: string;
    onClick: () => void;
    variant: "default" | "magical" | "destructive" | ...;
  };
  secondaryButton?: {            // Botão secundário (opcional)
    label: string;
    onClick: () => void;
    variant: "default" | "outline" | ...;
  };
}
```

### HeaderConfig

```typescript
interface HeaderConfig {
  title: string;                 // Título da página
  description: string;           // Descrição/subtítulo
  primaryAction: {               // Ação primária (obrigatória)
    label: string;               // Texto do botão
    onClick: () => void;         // Callback do clique
    variant: ButtonVariant;      // Variante do botão
    icon?: LucideIcon;           // Ícone (opcional)
    className?: string;          // Classes extras (opcional)
  };
  secondaryActions?: Array<{     // Ações secundárias (opcional)
    label: string;
    onClick: () => void;
    variant: ButtonVariant;
    icon?: LucideIcon;
  }>;
}
```

### SearchConfig (Opcional)

```typescript
interface SearchConfig {
  value: string;                 // Valor atual da busca
  onChange: (value: string) => void; // Callback de mudança
  placeholder: string;           // Placeholder do input
  maxWidth?: string;             // Max-width (default: "max-w-md")
}
```

### FilterConfig (Opcional)

```typescript
interface FilterConfig<T = string> {
  totalCount: number;            // Total de itens
  totalLabel: string;            // Label do badge "All" (ex: "Total", "Todos")
  selectedFilters: T[];          // Filtros atualmente selecionados
  filterRows: FilterRow<T>[];    // Linhas de filtros (múltiplas linhas suportadas)
  onFilterToggle: (value: T) => void; // Callback ao clicar em filtro
  onClearFilters: () => void;    // Callback para limpar todos os filtros
}

interface FilterRow<T = string> {
  id: string;                    // ID único da linha
  items: FilterItem<T>[];        // Itens de filtro da linha
}

interface FilterItem<T = string> {
  value: T;                      // Valor do filtro
  label: string;                 // Label exibido (já traduzido)
  count: number;                 // Contagem de itens
  icon?: LucideIcon;             // Ícone (opcional)
  colorConfig: {                 // Configuração de cores
    activeText: string;          // Cor do texto ativo (ex: "text-yellow-600")
    activeBg: string;            // Cor do fundo ativo (ex: "bg-yellow-500/20")
    activeBorder: string;        // Cor da borda ativa (ex: "border-yellow-500/50")
    inactiveText: string;        // Cor do texto inativo (ex: "text-gray-500")
    inactiveBg: string;          // Cor do fundo inativo (ex: "bg-gray-500/10")
    inactiveBorder: string;      // Cor da borda inativa (ex: "border-gray-500/20")
  };
}
```

---

## 🎴 EntityCardList - Renderização de Cards

**Componente:** `EntityCardList` (`src/components/layouts/EntityCardList.tsx`)

Componente genérico para renderizar listas de cards em grid responsivo.

### Props

```typescript
interface EntityCardListProps<T> {
  items: T[];                    // Array de itens a renderizar
  renderCard: (item: T) => ReactNode; // Função de renderização de cada card
  gridCols?: GridCols;           // Configuração de colunas por breakpoint (opcional)
  gap?: string;                  // Gap do grid (default: "gap-4")
  layout?: "grid" | "horizontal" | "vertical"; // Layout (default: "grid")
  className?: string;            // Classes CSS adicionais
}

// Configuração de grid responsivo
type GridCols = {
  sm?: number;    // Small screens (640px+)
  md?: number;    // Medium screens (768px+)
  lg?: number;    // Large screens (1024px+)
  xl?: number;    // Extra large screens (1280px+)
  "2xl"?: number; // 2X large screens (1536px+)
};
```

### Exemplo de Uso

```tsx
<EntityCardList
  items={filteredCharacters}
  renderCard={(character) => (
    <CharacterCard
      key={character.id}
      character={character}
      onClick={() => navigateToDetail(character.id)}
    />
  )}
  gridCols={{ sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
  gap="gap-6"
/>
```

### Presets de Grid Recomendados

```typescript
// Padrão (4 colunas no máximo)
gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}

// Denso (5 colunas em telas grandes)
gridCols={{ sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}

// Amplo (3 colunas no máximo)
gridCols={{ sm: 1, md: 2, lg: 3 }}

// Listagem (2 colunas no máximo)
gridCols={{ sm: 1, md: 2 }}
```

---

## 🔍 EntitySearchBar - Barra de Busca

**Componente:** `EntitySearchBar` (`src/components/entity-list/EntitySearchBar.tsx`)

Barra de busca reutilizável com ícone de lupa.

### Props

```typescript
interface EntitySearchBarProps {
  value: string;          // Valor atual
  onChange: (value: string) => void; // Callback de mudança
  placeholder: string;    // Placeholder
  maxWidth?: string;      // Max-width (default: "max-w-md")
  className?: string;     // Classes adicionais
}
```

### Exemplo

```tsx
<EntitySearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Buscar personagens..."
  maxWidth="max-w-lg"
/>
```

---

## 🏷️ EntityFilterBadges - Sistema de Filtros

**Componente:** `EntityFilterBadges` (`src/components/entity-list/EntityFilterBadges.tsx`)

Sistema completo de filtros com badges coloridos e clicáveis.

### Features

- ✅ Badge "All" automático (mostra total + limpa filtros)
- ✅ Múltiplas linhas de filtros (categorias diferentes)
- ✅ Cores customizáveis por filtro (ativo/inativo)
- ✅ Ícones opcionais
- ✅ Contador de itens por filtro
- ✅ Toggle ao clicar (adiciona/remove do array de selecionados)

### Exemplo de Configuração

```typescript
import { Crown, Sword, Users, Ghost } from "lucide-react";

// 1. Definir constantes de cores
export const BADGE_COLORS = {
  yellow: {
    activeText: "text-yellow-600 dark:text-yellow-400",
    activeBg: "bg-yellow-500/20",
    activeBorder: "border-yellow-500/50",
    inactiveText: "text-gray-500 dark:text-gray-400",
    inactiveBg: "bg-gray-500/10",
    inactiveBorder: "border-gray-500/20",
  },
  red: {
    activeText: "text-red-600 dark:text-red-400",
    activeBg: "bg-red-500/20",
    activeBorder: "border-red-500/50",
    inactiveText: "text-gray-500 dark:text-gray-400",
    inactiveBg: "bg-gray-500/10",
    inactiveBorder: "border-gray-500/20",
  },
  // ... mais cores
};

// 2. Criar função de criação de filtros
export function createRoleFilterRows(
  stats: RoleStats,
  t: (key: string) => string
): FilterRow<CharacterRole>[] {
  return [
    {
      id: "character-roles",
      items: [
        {
          value: "protagonist",
          label: t("characters:page.protagonist_badge"),
          count: stats.protagonist,
          icon: Crown,
          colorConfig: BADGE_COLORS.yellow,
        },
        {
          value: "antagonist",
          label: t("characters:page.antagonist_badge"),
          count: stats.antagonist,
          icon: Sword,
          colorConfig: BADGE_COLORS.red,
        },
        {
          value: "secondary",
          label: t("characters:page.secondary_badge"),
          count: stats.secondary,
          icon: Users,
          colorConfig: BADGE_COLORS.blue,
        },
        {
          value: "villain",
          label: t("characters:page.villain_badge"),
          count: stats.villain,
          icon: Ghost,
          colorConfig: BADGE_COLORS.purple,
        },
        // ... mais roles
      ],
    },
  ];
}

// 3. Usar no componente
const roleFilterRows = useMemo(
  () => createRoleFilterRows(roleStats, t),
  [roleStats, t]
);

<EntityListLayout
  filters={{
    totalCount: characters.length,
    totalLabel: t("filters.all"),
    selectedFilters: selectedRoles,
    filterRows: roleFilterRows,
    onFilterToggle: handleRoleToggle,
    onClearFilters: handleClearFilters,
  }}
  // ... outras props
/>
```

### Filtros Múltiplos (Exemplo: Items Tab)

```typescript
// Items tem 2 tipos de filtros: categorias E status
const filters = {
  totalCount: items.length,
  totalLabel: t("filters.all"),
  selectedFilters: [...selectedCategories, ...selectedStatuses], // Combinar todos
  filterRows: [
    ...categoryFilterRows,  // Linha 1: Categorias
    ...statusFilterRows,    // Linha 2: Status
  ],
  onFilterToggle: (value) => {
    // Lógica para determinar qual grupo foi clicado
    if (isCategoryValue(value)) {
      toggleCategory(value);
    } else {
      toggleStatus(value);
    }
  },
  onClearFilters: () => {
    clearCategories();
    clearStatuses();
  },
};
```

---

## 📭 EmptyState - Estados Vazios

**Componente:** `EmptyState` (`src/components/empty-state.tsx`)

Componente para exibir estados vazios (sem dados ou sem resultados).

### Props

```typescript
interface EmptyStateProps {
  icon: LucideIcon;       // Ícone a exibir
  title: string;          // Título
  description: string;    // Descrição
  primaryButton?: {       // Botão primário (opcional)
    label: string;
    onClick: () => void;
    variant: ButtonVariant;
  };
  secondaryButton?: {     // Botão secundário (opcional)
    label: string;
    onClick: () => void;
    variant: ButtonVariant;
  };
  className?: string;     // Classes adicionais
}
```

### Uso

Você raramente usará diretamente - o `EntityListLayout` gerencia automaticamente os empty states.

---

## 🎯 Casos de Uso

### 1. Tab Simples (Sem Filtros, Sem Busca)

**Exemplo:** Listagem de capítulos de um livro

```tsx
<EntityListLayout
  isLoading={loading}
  isEmpty={chapters.length === 0}
  emptyState={{
    icon: BookOpen,
    title: "Nenhum capítulo",
    description: "Comece escrevendo seu primeiro capítulo",
  }}
  header={{
    title: "Capítulos",
    description: "Organize os capítulos da sua história",
    primaryAction: {
      label: "Novo Capítulo",
      onClick: handleCreate,
      variant: "magical",
    },
  }}
>
  <EntityCardList
    items={chapters}
    renderCard={(chapter) => <ChapterCard chapter={chapter} />}
  />
</EntityListLayout>
```

### 2. Tab com Busca (Sem Filtros)

**Exemplo:** Busca simples por nome

```tsx
const [searchTerm, setSearchTerm] = useState("");

const filteredItems = useMemo(
  () => items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ),
  [items, searchTerm]
);

<EntityListLayout
  isLoading={loading}
  isEmpty={items.length === 0}
  showNoResultsState={filteredItems.length === 0 && items.length > 0}
  emptyState={...}
  header={...}
  search={{
    value: searchTerm,
    onChange: setSearchTerm,
    placeholder: "Buscar itens...",
  }}
>
  <EntityCardList items={filteredItems} renderCard={...} />
</EntityListLayout>
```

### 3. Tab com Filtros (Sem Busca)

**Exemplo:** Filtrar personagens por role

```tsx
const {
  filters: { roles },
  toggleFilterValue,
  clearAllFilters,
  filteredEntities,
} = useEntityFilters({
  entities: characters,
  searchFields: ["name"],
  filterGroups: [{ key: "roles", entityField: "role" }],
});

<EntityListLayout
  isLoading={loading}
  isEmpty={characters.length === 0}
  showNoResultsState={filteredEntities.length === 0 && characters.length > 0}
  emptyState={...}
  header={...}
  filters={{
    totalCount: characters.length,
    totalLabel: "Todos",
    selectedFilters: roles || [],
    filterRows: roleFilterRows,
    onFilterToggle: (role) => toggleFilterValue("roles", role),
    onClearFilters: clearAllFilters,
  }}
>
  <EntityCardList items={filteredEntities} renderCard={...} />
</EntityListLayout>
```

### 4. Tab Completa (Filtros + Busca + Botões Extras)

**Exemplo:** World tab (veja exemplo completo na seção "Uso Avançado")

---

## ✅ Boas Práticas

### 1. Use o hook `useEntityFilters` para Filtros

**❌ Evite:**
```tsx
// Lógica manual de filtros
const [searchTerm, setSearchTerm] = useState("");
const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

const filteredCharacters = useMemo(() =>
  characters.filter((char) => {
    const matchesSearch = char.name.includes(searchTerm);
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(char.role);
    return matchesSearch && matchesRole;
  }),
  [characters, searchTerm, selectedRoles]
);
```

**✅ Prefira:**
```tsx
// Hook genérico
const {
  searchTerm,
  setSearchTerm,
  filters: { roles },
  toggleFilterValue,
  clearAllFilters,
  filteredEntities: filteredCharacters,
} = useEntityFilters({
  entities: characters,
  searchFields: ["name", "description"],
  filterGroups: [{ key: "roles", entityField: "role" }],
});
```

### 2. Use `calculateEntityStats` para Estatísticas

**❌ Evite:**
```tsx
const roleStats = useMemo(() => ({
  total: characters.length,
  protagonist: characters.filter((c) => c.role === "protagonist").length,
  antagonist: characters.filter((c) => c.role === "antagonist").length,
  // ... manual para cada role
}), [characters]);
```

**✅ Prefira:**
```tsx
const roleStats = useMemo(
  () => calculateEntityStats(characters, {
    field: "role",
    values: ["protagonist", "antagonist", "secondary", "villain", "extra"],
  }),
  [characters]
);
```

### 3. Sempre use `EntityCardList` para Renderização

**❌ Evite:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map((item) => <ItemCard key={item.id} item={item} />)}
</div>
```

**✅ Prefira:**
```tsx
<EntityCardList
  items={items}
  renderCard={(item) => <ItemCard key={item.id} item={item} />}
  gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
/>
```

### 4. Configure `showNoResultsState` Corretamente

**Padrão:**
```tsx
// Mostra "no results" quando:
// 1. Há itens no sistema (items.length > 0)
// 2. Mas filtros/busca não retornaram nada (filteredItems.length === 0)
showNoResultsState={filteredItems.length === 0 && items.length > 0}
```

### 5. Sempre Forneça `noResultsState` Customizado (Opcional mas Recomendado)

```tsx
noResultsState={{
  icon: Search,
  title: t("no_results.title"), // "Nenhum resultado encontrado"
  description: t("no_results.description"), // "Tente ajustar seus filtros ou busca"
}}
```

### 6. Use Internacionalização (i18n)

```tsx
// ❌ Evite textos hardcoded
title: "Characters"
description: "Manage your story characters"

// ✅ Prefira traduções
title: t("characters:page.title")
description: t("characters:page.description")
```

### 7. Memoize Configurações de Filtros

```tsx
// ✅ Evita recriação desnecessária
const roleFilterRows = useMemo(
  () => createRoleFilterRows(roleStats, t),
  [roleStats, t]
);
```

### 8. Use Variantes Semânticas de Botões

```tsx
primaryAction: {
  label: t("new_character"),
  onClick: handleCreate,
  variant: "magical",    // Para ações de criação
  icon: Plus,
  className: "animate-glow", // Opcional: animação extra
}

secondaryActions: [
  {
    label: t("export"),
    onClick: handleExport,
    variant: "secondary", // Para ações secundárias
    icon: Download,
  },
]
```

---

## 🔗 Integração com Hooks e Utils

### Hook: `useEntityFilters`

**Localização:** `src/hooks/use-entity-filters.ts`

Hook genérico para gerenciar filtros e busca.

```typescript
const {
  searchTerm,           // Termo de busca atual
  setSearchTerm,        // Setter do termo de busca
  filters,              // Objeto com todos os filtros { roles: [], categories: [] }
  setFilter,            // Setter de um filtro específico
  toggleFilterValue,    // Toggle de um valor em um filtro
  clearAllFilters,      // Limpa todos os filtros
  clearFilterGroup,     // Limpa um grupo específico
  filteredEntities,     // Entidades filtradas (resultado final)
} = useEntityFilters({
  entities: characters,              // Array de entidades
  searchFields: ["name", "description"], // Campos para buscar
  filterGroups: [                    // Grupos de filtros (opcional)
    { key: "roles", entityField: "role" },
    { key: "statuses", entityField: "status" },
  ],
});
```

### Util: `calculateEntityStats`

**Localização:** `src/utils/calculate-entity-stats.ts`

Função genérica para calcular estatísticas de entidades.

```typescript
const stats = calculateEntityStats(items, {
  field: "category",  // Campo a contar
  values: ["weapon", "armor", "accessory"], // Valores possíveis
});

// Resultado:
// {
//   total: 100,
//   weapon: 35,
//   armor: 25,
//   accessory: 40,
// }
```

---

## ⚠️ Notas Importantes

1. **Filtros e Busca são OPCIONAIS** - Só aparecem se você passar as props
2. **EntityCardList deve ser usado sempre** - Evite divs com grid manual
3. **Use hooks e utils globais** - Não reimplemente lógica de filtros/stats
4. **Sempre configure `showNoResultsState`** - Melhora UX quando não há resultados
5. **Memoize configurações pesadas** - Filter rows, stats, etc.
6. **Use i18n para todos os textos** - Nunca hardcode strings

---

**Última atualização:** 2025-11-19
