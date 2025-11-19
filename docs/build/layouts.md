# Layouts

Componentes de layout para estruturar páginas do projeto.

**Localização:** `src/components/layouts/`

---

## 1. EntityListLayout
**Componente:** `EntityListLayout` (`src/components/layouts/EntityListLayout.tsx`)
**Descrição:** Layout orquestrador para páginas de listagem de entidades. Gerencia automaticamente estados de loading, empty, filtros, busca e renderização de cards.

**Estados gerenciados:**
- Loading: Spinner centralizado
- Empty: Sem dados no sistema
- No Results: Filtros/busca sem resultados
- Success: Exibição completa

**Exemplo básico:**
```tsx
<EntityListLayout
  isLoading={false}
  isEmpty={items.length === 0}
  emptyState={{
    icon: Users,
    title: "Nenhum item criado",
    description: "Crie seu primeiro item",
  }}
  header={{
    title: "Items",
    description: "Gerencie seus itens",
    primaryAction: {
      label: "Novo Item",
      onClick: () => setShowModal(true),
      variant: "magical",
    },
  }}
>
  <EntityCardList
    items={items}
    renderCard={(item) => <ItemCard item={item} />}
    gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
  />
</EntityListLayout>
```

**Com filtros e busca:**
```tsx
<EntityListLayout
  isLoading={loading}
  isEmpty={items.length === 0}
  showNoResultsState={filtered.length === 0 && items.length > 0}
  emptyState={{...}}
  header={{...}}
  search={{
    value: searchTerm,
    onChange: setSearchTerm,
    placeholder: "Buscar...",
  }}
  filters={{
    totalCount: items.length,
    totalLabel: "Todos",
    selectedFilters: selected,
    filterRows: filterRows,
    onFilterToggle: handleToggle,
    onClearFilters: handleClear,
  }}
>
  <EntityCardList items={filtered} renderCard={...} />
</EntityListLayout>
```

**Propriedades obrigatórias:**
- `isLoading`: boolean
- `isEmpty`: boolean
- `emptyState`: { icon, title, description, primaryButton?, secondaryButton? }
- `header`: { title, description, primaryAction, secondaryActions? }
- `children`: ReactNode

**Propriedades opcionais:**
- `loadingText`: string (default: "Loading...")
- `showNoResultsState`: boolean
- `noResultsState`: { icon, title, description }
- `search`: { value, onChange, placeholder, maxWidth? }
- `filters`: { totalCount, totalLabel, selectedFilters, filterRows, onFilterToggle, onClearFilters }

---

## 2. EntityCardList
**Componente:** `EntityCardList` (`src/components/layouts/EntityCardList.tsx`)
**Descrição:** Renderiza lista de cards em grid responsivo.

**Exemplo:**
```tsx
<EntityCardList
  items={characters}
  renderCard={(char) => <CharacterCard key={char.id} character={char} />}
  gridCols={{ sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
  gap="gap-6"
/>
```

**Propriedades:**
- `items`: T[]
- `renderCard`: (item: T) => ReactNode
- `gridCols`: { sm?, md?, lg?, xl?, "2xl"? }
- `gap`: string (default: "gap-4")
- `layout`: "grid" | "horizontal" | "vertical" (default: "grid")
- `className`: string (opcional)

**Presets de grid:**
```tsx
// Padrão (4 colunas máx)
gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}

// Denso (5 colunas)
gridCols={{ sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}

// Amplo (3 colunas máx)
gridCols={{ sm: 1, md: 2, lg: 3 }}

// Listagem (2 colunas máx)
gridCols={{ sm: 1, md: 2 }}
```

---

## 3. EntityDetailLayout
**Componente:** `EntityDetailLayout` (`src/components/layouts/EntityDetailLayout.tsx`)
**Descrição:** Layout para páginas de detalhes de entidades com modo edição/visualização.

**Exemplo:**
```tsx
<EntityDetailLayout
  isLoading={loading}
  entity={character}
  isEditing={isEditing}
  onEdit={() => setIsEditing(true)}
  onSave={handleSave}
  onCancel={() => setIsEditing(false)}
  onDelete={handleDelete}
>
  {/* Conteúdo dos detalhes */}
</EntityDetailLayout>
```

**Propriedades:**
- `isLoading`: boolean
- `entity`: T | null
- `isEditing`: boolean
- `onEdit`: () => void
- `onSave`: () => void
- `onCancel`: () => void
- `onDelete`: () => void
- `children`: ReactNode
