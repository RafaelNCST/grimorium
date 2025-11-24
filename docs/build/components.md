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
**Componente:** `CollapsibleSection` (`src/components/layouts/CollapsibleSection.tsx`)
**Descrição:** Seção colapsável padronizada com estados vazios integrados. Usada em páginas de detalhes para seções extras (relacionamentos, família, etc).

**Exemplo Básico:**
```tsx
<CollapsibleSection
  title="Relacionamentos"
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
>
  {/* conteúdo */}
</CollapsibleSection>
```

**Exemplo com Estado Vazio em Visualização:**
```tsx
<CollapsibleSection
  title="Relacionamentos"
  isOpen={true}
  onToggle={() => {}}
  emptyState="empty-view"
  emptyIcon={Users}
  emptyTitle="Nenhum relacionamento"
  emptyDescription="Este personagem ainda não tem relacionamentos cadastrados"
/>
```

**Exemplo com Estado Vazio em Edição:**
```tsx
<CollapsibleSection
  title="Relacionamentos"
  isOpen={true}
  onToggle={() => {}}
  isEditMode={true}
  emptyState="empty-edit"
  addButtonLabel="Adicionar Relacionamento"
  onAddClick={() => setIsAddDialogOpen(true)}
/>
```

**Exemplo com Estado Bloqueado (sem dados):**
```tsx
<CollapsibleSection
  title="Relacionamentos"
  isOpen={true}
  onToggle={() => {}}
  isEditMode={true}
  emptyState="blocked-no-data"
  blockedEntityName="personagens"
/>
```

**Exemplo com Estado Bloqueado (todos usados):**
```tsx
<CollapsibleSection
  title="Relacionamentos"
  isOpen={true}
  onToggle={() => {}}
  isEditMode={true}
  emptyState="blocked-all-used"
  blockedEntityName="personagens"
>
  {/* Lista de relacionamentos existentes */}
</CollapsibleSection>
```

**Propriedades:**
- `title`: string - Título da seção
- `isOpen`: boolean - Se a seção está aberta/expandida
- `onToggle`: () => void - Callback ao clicar para abrir/fechar
- `children`: ReactNode - Conteúdo da seção
- `isEditMode`: boolean (opcional) - Se está em modo de edição
- `isVisible`: boolean (opcional) - Controla visibilidade da seção
- `onVisibilityToggle`: () => void (opcional) - Callback para toggle de visibilidade
- `isCollapsible`: boolean (opcional, default: true) - Se pode ser colapsada
- `emptyState`: "empty-view" | "empty-edit" | "blocked-no-data" | "blocked-all-used" | null (opcional) - Estado vazio
- `emptyIcon`: LucideIcon (opcional) - Ícone para estado vazio em visualização
- `emptyTitle`: string (opcional) - Título do estado vazio
- `emptyDescription`: string (opcional) - Descrição do estado vazio
- `addButtonLabel`: string (opcional) - Label do botão de adicionar em edição
- `onAddClick`: () => void (opcional) - Callback ao clicar no botão de adicionar
- `blockedEntityName`: string (opcional) - Nome da entidade bloqueada (ex: "personagens")

**Estados Vazios:**
1. **empty-view**: Mostra ícone + título + descrição (modo visualização sem dados)
2. **empty-edit**: Mostra botão magical "Adicionar" (modo edição sem dados)
3. **blocked-no-data**: Mostra InfoAlert informando falta de dados para adicionar
4. **blocked-all-used**: Mostra InfoAlert + conteúdo existente (todos os dados disponíveis já foram usados)

**Padronização de Textos:**

Para manter consistência, siga este padrão ao usar estados vazios:

**Estado empty-view (visualização):**
- **Título**: "Nenhum/Nenhuma {entidade} definido/definida"
  - Exemplos: "Nenhum relacionamento definido", "Nenhuma linha do tempo definida"
- **Descrição**: "Use o modo de edição para adicionar {ação}"
  - Exemplos: "Use o modo de edição para adicionar relacionamentos", "Use o modo de edição para adicionar eras"

**Estado blocked-no-data:**
- Usa automaticamente: "Não há {blockedEntityName} suficientes"
- Exemplo: `blockedEntityName: "personagens"` → "Não há personagens suficientes"

**Estado blocked-all-used:**
- Usa automaticamente: "Todos os {blockedEntityName} disponíveis foram adicionados"
- Exemplo: `blockedEntityName: "facções"` → "Todos as facções disponíveis foram adicionadas"

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
