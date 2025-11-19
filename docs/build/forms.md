# Componentes de Formulário

Componentes base reutilizáveis de formulário utilizados no projeto.

**Localização:** `src/components/` (ui, forms)

---

## 1. Input
**Componente:** `Input` (`src/components/ui/input.tsx`)
**Descrição:** Input padrão para textos de uma linha

---

## 2. Textarea
**Componente:** `Textarea` (`src/components/ui/textarea.tsx`)
**Descrição:** Textarea com suporte a múltiplas linhas e `resize-none`

---

## 3. Select
**Componente:** `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` (`src/components/ui/select.tsx`)
**Descrição:** Dropdown estilizado para selecionar uma opção

**Exemplo:**
```tsx
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

---

## 4. FormSelectGrid
**Componente:** `FormSelectGrid` (`src/components/forms/FormSelectGrid.tsx`)
**Descrição:** Grid de seleção com ícones à esquerda, label e descrição à direita. Layout horizontal.

**Padrão de estados:**
- **Normal**: `border-2 p-4` com `baseColorClass`
- **Hover**: `border-2 p-4` com cores ativas (SEM ring)
- **Active**: `border-2 p-4` com cores ativas + `ring-4`

**Exemplo:**
```tsx
<FormSelectGrid
  value={value}
  onChange={setValue}
  label="Label"
  columns={2}
  options={[
    {
      value: "option1",
      label: "Opção 1",
      description: "Descrição da opção",
      icon: IconComponent,
      baseColorClass: "bg-card text-muted-foreground border-border",
      hoverColorClass: "hover:bg-blue-500/10 hover:border-blue-500/20",
      activeColorClass: "bg-blue-500/20 border-blue-500/30 ring-4 ring-blue-500/50 text-white",
    },
  ]}
/>
```

**Propriedades:**
- `value`: string | null | undefined
- `onChange`: (value: string) => void
- `options`: GridSelectOption[]
- `label`: string
- `required`: boolean (opcional)
- `columns`: number (default: 2)
- `expandedContent`: ReactNode (opcional)
- `showExpandedContent`: boolean (opcional)

---

## 9. FormSimpleGrid
**Componente:** `FormSimpleGrid` (`src/components/forms/FormSimpleGrid.tsx`)
**Descrição:** Grid de seleção com ícone no topo e label abaixo. Layout vertical. Sem descrição.

**Padrão de estados:**
- **Normal**: `border-2 p-4` com `baseColorClass`
- **Hover**: `border-2 p-4` com cores ativas (SEM ring)
- **Active**: `border-2 p-4` com cores ativas + `ring-4`

**Exemplo:**
```tsx
<FormSimpleGrid
  value={value}
  onChange={setValue}
  label="Label"
  columns={5}
  options={[
    {
      value: "option1",
      label: "Opção 1",
      icon: IconComponent,
      baseColorClass: "border-muted",
      hoverColorClass: "hover:bg-yellow-500/10 hover:text-yellow-600 hover:border-yellow-500/20",
      activeColorClass: "bg-yellow-500/20 border-yellow-500/30 ring-4 ring-yellow-500/50 text-yellow-600",
    },
  ]}
/>
```

**Propriedades:**
- `value`: string | null | undefined
- `onChange`: (value: string) => void
- `options`: SimpleGridSelectOption[]
- `label`: string
- `required`: boolean (opcional)
- `columns`: 2 | 3 | 4 | 5 | 6 (default: 5)

**Diferenças do FormSelectGrid:**
- Layout vertical vs horizontal
- Sem campo de descrição
- Suporta até 6 colunas (FormSelectGrid limita a 4)

---

## 10. FormEntityMultiSelectAuto
**Componente:** `FormEntityMultiSelectAuto` (`src/components/forms/FormEntityMultiSelectAuto.tsx`)
**Descrição:** Multi-select que carrega automaticamente entidades do banco de dados. Possui busca integrada e avatares.

**Exemplo:**
```tsx
<FormEntityMultiSelectAuto
  entityType="faction"
  bookId={bookId}
  label="Facções"
  placeholder="Selecione..."
  emptyText="Nenhuma opção disponível"
  noSelectionText="Nenhuma seleção"
  searchPlaceholder="Buscar..."
  value={selected}
  onChange={setSelected}
  maxSelections={1} // Opcional: limita seleções
/>
```

**Propriedades:**
- `entityType`: 'character' | 'faction' | 'race' | 'item' | 'region'
- `bookId`: string
- `label`: string
- `value`: string[]
- `onChange`: (value: string[]) => void
- `maxSelections`: number (opcional)

---

## 11. ListInput
**Componente:** `ListInput` (`src/components/modals/create-region-modal/components/list-input.tsx`)
**Descrição:** Lista editável com drag & drop, adição, edição e remoção de itens.

**Exemplo:**
```tsx
<ListInput
  label="Lista"
  placeholder="Adicionar item..."
  buttonText="Adicionar"
  value={items}
  onChange={setItems}
/>
```

**Propriedades:**
- `label`: string
- `value`: string[]
- `onChange`: (value: string[]) => void

---

## 12. FormSimplePicker
**Componente:** `FormSimplePicker` (`src/components/forms/FormSimplePicker.tsx`)
**Descrição:** Seleção visual horizontal com ícone e label. Efeitos de hover e scale. Sem bordas.

**Diferenças do FormSimpleGrid:**
- Layout horizontal (flex) vs grid
- Efeito scale animado (hover 105%, selected 110%)
- Sem bordas/cards
- Ideal para 3-7 opções

**Exemplo:**
```tsx
<FormSimplePicker
  value={value}
  onChange={setValue}
  label="Status"
  options={[
    {
      value: "active",
      translationKey: "status.active",
      icon: IconComponent,
      color: "text-muted-foreground",
      activeColor: "text-green-600 dark:text-green-400",
    },
  ]}
/>
```

**Propriedades:**
- `value`: string | null
- `onChange`: (value: string) => void
- `options`: Array (value, translationKey, icon, color, activeColor)
- `label`: string
- `required`: boolean (opcional)

---

## 13. FormImageUpload
**Componente:** `FormImageUpload` (`src/components/forms/FormImageUpload.tsx`)
**Descrição:** Upload de imagem com preview. Suporta diferentes formas (square, rounded, circle) e modos de fit (fill, cover, contain).

**Exemplo:**
```tsx
<FormImageUpload
  value={image}
  onChange={setImage}
  label="Imagem"
  height="h-64"
  shape="rounded"
  imageFit="cover"
/>
```

**Propriedades:**
- `value`: string | null
- `onChange`: (value: string) => void
- `label`: string
- `shape`: 'square' | 'rounded' | 'circle'
- `imageFit`: 'fill' | 'cover' | 'contain'
- `height`: string (default: "h-[28rem]")

