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

---

## 4. CollapsibleSection
**Componente:** `CollapsibleSection` (`src/components/layouts/CollapsibleSection.tsx`)
**Descrição:** Seção colapsável padronizada para páginas de detalhes. Fornece estrutura consistente com Card, header com título, ícone de chevron e padding interno padronizado.

**Funcionalidades:**
- Card com estilo "card-magical" automático
- Header com título e ícone de chevron (expande/colapsa)
- **Área de clique expandida** - Todo o header é clicável
- **Hover brilhante** - Fundo branco translúcido (5% light, 10% dark)
- Toggle de visibilidade opcional (ícone de olho) em modo edição
- Padding interno padronizado via CardContent
- Estilos automáticos para estado visível/invisível
- Opção de desabilitar comportamento colapsável

**Exemplo básico:**
```tsx
<CollapsibleSection
  title="Informações Avançadas"
  isOpen={isAdvancedOpen}
  onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
>
  <div className="space-y-4">
    {/* Conteúdo da seção */}
    <p>Seus campos e informações aqui</p>
  </div>
</CollapsibleSection>
```

**Com controle de visibilidade:**
```tsx
<CollapsibleSection
  title="Relacionamentos"
  isOpen={isRelationshipsOpen}
  onToggle={() => setIsRelationshipsOpen(!isRelationshipsOpen)}
  isEditMode={isEditing}
  isVisible={showRelationships}
  onVisibilityToggle={() => setShowRelationships(!showRelationships)}
>
  <RelationshipsContent />
</CollapsibleSection>
```

**Modo não-colapsável:**
```tsx
<CollapsibleSection
  title="Seção Sempre Visível"
  isOpen={true}
  onToggle={() => {}}
  isCollapsible={false}
>
  <p>Esta seção não pode ser colapsada</p>
</CollapsibleSection>
```

**Propriedades obrigatórias:**
- `title`: string - Título exibido no header
- `isOpen`: boolean - Estado de abertura da seção
- `onToggle`: () => void - Callback quando estado de abertura muda
- `children`: ReactNode - Conteúdo interno (com padding automático)

**Propriedades opcionais:**
- `isEditMode`: boolean (default: false) - Habilita toggle de visibilidade
- `isVisible`: boolean (default: true) - Controla visibilidade (opacidade e estilo)
- `onVisibilityToggle`: () => void - Callback quando visibilidade muda
- `className`: string - Classes CSS adicionais para o Card
- `isCollapsible`: boolean (default: true) - Se a seção pode ser colapsada

**Comportamento de visibilidade:**
Quando `isVisible = false` e `isEditMode = true`:
- Opacidade reduzida (50%)
- Background com cor muted/30
- Border tracejada com cor muted-foreground/30

**Nota sobre padding:**
O padding interno é gerenciado automaticamente pelo componente `CardContent`. Não é necessário adicionar padding extra ao conteúdo passado como `children`.

**Interatividade:**
- **Hover:** Fundo branco translúcido (`white/5` light mode, `white/10` dark mode)
- **Efeito:** Aparência levemente brilhante e sutil
- **Área clicável:** Todo o CardHeader é clicável (não apenas o texto)
- **Transições:** Animação suave de 200ms no background
