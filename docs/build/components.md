# Componentes Gerais

Componentes reutilizáveis gerais utilizados no projeto (excluindo formulários e botões).

**Localização:** `src/components/`

---

## 1. Button
**Componente:** `Button` (`src/components/ui/button.tsx`)
**Descrição:** Botão base com múltiplas variantes (magical, destructive, secondary, ghost, etc.)
**Documentação:** Ver `buttons.md`

---

## 2. Card
**Componente:** `Card` + `CardHeader` + `CardTitle` + `CardContent` (`src/components/ui/card.tsx`)
**Descrição:** Container estilizado com header e conteúdo

---

## 3. Badge
**Componente:** `Badge` (`src/components/ui/badge.tsx`)
**Descrição:** Distintivo pequeno com variantes (default, secondary, outline, destructive)

---

## 4. EntityTagBadge
**Componente:** `EntityTagBadge` (`src/components/ui/entity-tag-badge.tsx`)
**Descrição:** Tag padronizada com ícone + texto + background colorido translúcido.

**Exemplo:**
```tsx
<EntityTagBadge
  config={roleData}
  label={t(`role.${character.role}`)}
/>
```

**Propriedades:**
- `config`: IEntityTagConfig (value, icon, translationKey, colorClass, bgColorClass)
- `label`: string
- `className`: string (opcional)

---

## 5. EntitySearchBar
**Componente:** `EntitySearchBar` (`src/components/entity-list/EntitySearchBar.tsx`)
**Descrição:** Input de busca com ícone de lupa para filtrar listas de entidades.

**Exemplo:**
```tsx
<EntitySearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Buscar..."
/>
```

**Propriedades:**
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `maxWidth`: string (default: "max-w-md")

---

## 6. InfoAlert
**Componente:** `InfoAlert` (`src/components/ui/info-alert.tsx`)
**Descrição:** Caixa de alerta com ícone de informação e fundo colorido.

**Exemplo:**
```tsx
<InfoAlert>
  Informação importante para o usuário.
</InfoAlert>
```

**Propriedades:**
- `children`: ReactNode

---

## 7. CollapsibleSection
**Componente:** `CollapsibleSection` (`src/components/detail-page/CollapsibleSection.tsx`)
**Descrição:** Seção com header clicável que expande/colapsa conteúdo.

**Exemplo:**
```tsx
<CollapsibleSection
  title="Seção"
  icon={<Icon className="h-5 w-5" />}
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
>
  {/* conteúdo */}
</CollapsibleSection>
```

**Propriedades:**
- `title`: string
- `icon`: ReactNode (opcional)
- `isOpen`: boolean
- `onToggle`: () => void
- `children`: ReactNode

---

## 8. FieldWithVisibilityToggle
**Componente:** `FieldWithVisibilityToggle` (`src/components/detail-page/FieldWithVisibilityToggle.tsx`)
**Descrição:** Wrapper para campos opcionais que podem ser ocultados no modo visualização.

**Exemplo:**
```tsx
<FieldWithVisibilityToggle
  fieldName="climate"
  label="Clima"
  isOptional={true}
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={handleToggle}
>
  {/* conteúdo do campo */}
</FieldWithVisibilityToggle>
```

**Propriedades:**
- `fieldName`: string
- `label`: string
- `children`: ReactNode
- `isOptional`: boolean (default: true)
- `fieldVisibility`: objeto com estados
- `isEditing`: boolean
- `onFieldVisibilityToggle`: (field: string) => void
