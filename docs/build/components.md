# Componentes Visuais Reutilizáveis

Este documento documenta todos os componentes visuais reutilizáveis criados para o Grimorium, organizados por categoria: Formulário, Layout, Listas e Modais.

---

## Índice

1. [Componentes de Formulário](#componentes-de-formulário)
2. [Componentes de Layout](#componentes-de-layout)
3. [Componentes de Listas](#componentes-de-listas)
4. [Componentes de Modais/Dialogs](#componentes-de-modaisdialogs)
5. [Sistema de Versões](#sistema-de-versões)

---

## Componentes de Formulário

Todos os componentes de formulário seguem o padrão shadcn/ui e são compatíveis com React Hook Form.

### 1. FormInput

**Localização:** `src/components/forms/FormInput.tsx`

**Propósito:** Input de texto genérico com label, erro e estados visuais.

**Props:**
```typescript
interface FormInputProps {
  label: string;                    // Label do campo
  name: string;                     // Nome (para React Hook Form)
  value: string;                    // Valor atual
  onChange: (e: ChangeEvent) => void; // Callback de mudança
  onBlur?: () => void;              // Callback para validação (opcional)
  placeholder?: string;             // Placeholder
  type?: 'text' | 'email' | 'password' | 'number'; // Tipo do input
  disabled?: boolean;               // Desabilita o campo
  required?: boolean;               // Campo obrigatório (mostra asterisco vermelho)
  error?: string;                   // Mensagem de erro (borda vermelha + mensagem)
  helperText?: string;              // Texto de ajuda
  showOptionalLabel?: boolean;      // Mostrar "(opcional)"
  className?: string;               // Classes adicionais
  maxLength?: number;               // Limite de caracteres
}
```

**Exemplo de uso (campo básico obrigatório com validação):**
```tsx
<div className="space-y-2">
  <Label>
    {t("fields.name")}
    <span className="text-destructive ml-1">*</span>
  </Label>
  <Input
    value={editData.name || ""}
    onChange={(e) => onEditDataChange("name", e.target.value)}
    onBlur={() => validateField("name", editData.name)}
    placeholder={t("placeholders.name")}
    maxLength={200}
    className={errors.name ? "border-destructive" : ""}
    required
  />
  {errors.name && (
    <p className="text-sm text-destructive flex items-center gap-1">
      <AlertCircle className="h-4 w-4" />
      {errors.name}
    </p>
  )}
</div>
```

**Exemplo de uso (sem validação):**
```tsx
<FormInput
  label="Nome da Região"
  name="name"
  value={editData.name}
  onChange={(e) => updateField('name', e.target.value)}
  placeholder="Digite o nome da região..."
  disabled={!isEditing}
/>
```

**Quando usar:**
- Inputs de texto simples (nome, descrição curta, etc)
- Emails, senhas, números

**Quando NÃO usar:**
- Textos longos → use `FormTextarea`
- Seleção de opções → use `FormSelect`
- Seleção de entidades → use `EntitySelect`

---

### 2. FormTextarea

**Localização:** `src/components/forms/FormTextarea.tsx`

**Propósito:** Textarea para textos longos com contador de caracteres opcional.

**Props:**
```typescript
interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  maxLength?: number;               // Limite de caracteres
  showCharCount?: boolean;          // Mostrar contador
  rows?: number;                    // Número de linhas (padrão: 4)
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<FormTextarea
  label="Descrição"
  name="description"
  value={editData.description}
  onChange={(e) => updateField('description', e.target.value)}
  placeholder="Descreva a região..."
  maxLength={1000}
  showCharCount
  rows={6}
  disabled={!isEditing}
/>
```

**Features especiais:**
- Contador de caracteres: "245 / 1000"
- Auto-resize (opcional)

---

### 3. FormSelect

**Localização:** `src/components/forms/FormSelect.tsx`

**Propósito:** Dropdown simples para seleção única de opções estáticas.

**Props:**
```typescript
interface FormSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<FormSelect
  label="Tipo de Região"
  value={editData.regionType}
  onValueChange={(value) => updateField('regionType', value)}
  options={[
    { value: 'forest', label: 'Floresta' },
    { value: 'mountain', label: 'Montanha' },
    { value: 'desert', label: 'Deserto' },
  ]}
  placeholder="Selecione o tipo..."
  disabled={!isEditing}
  required
/>
```

**Quando usar:**
- Opções fixas conhecidas (tipos, categorias, etc)
- Lista pequena de opções (até ~20 itens)

**Quando NÃO usar:**
- Seleção de entidades do banco → use `EntitySelect`
- Seleção múltipla → use `FormMultiSelect`

---

### 4. FormMultiSelect

**Localização:** `src/components/forms/FormMultiSelect.tsx`

**Propósito:** Multi-select com badges para múltiplas opções estáticas.

**Props:**
```typescript
interface FormMultiSelectProps {
  label: string;
  value: string[];                  // Array de valores selecionados
  onChange: (value: string[]) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  maxItems?: number;                // Limite de itens selecionáveis
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<FormMultiSelect
  label="Climas"
  value={safeJsonParse(editData.climates)}
  onChange={(values) => updateField('climates', JSON.stringify(values))}
  options={[
    { value: 'tropical', label: 'Tropical' },
    { value: 'temperate', label: 'Temperado' },
    { value: 'cold', label: 'Frio' },
  ]}
  placeholder="Selecione os climas..."
  maxItems={3}
  disabled={!isEditing}
/>
```

**Features especiais:**
- Mostra badges dos itens selecionados
- Botão "X" para remover cada badge
- Limite de itens configurável
- Busca inline (opcional)

---

### 5. EntitySelect

**Localização:** `src/components/forms/EntitySelect.tsx`

**Propósito:** Dropdown que busca e seleciona uma entidade do banco de dados.

**Props:**
```typescript
interface EntitySelectProps {
  entity: 'character' | 'faction' | 'race' | 'item' | 'region';
  value: string | null;             // ID da entidade selecionada
  onValueChange: (value: string | null) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  filter?: (entity: T) => boolean;  // Filtro customizado
  excludeIds?: string[];            // IDs para excluir da lista
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<EntitySelect
  entity="character"
  value={editData.founderId}
  onValueChange={(id) => updateField('founderId', id)}
  label="Fundador"
  placeholder="Selecione o fundador..."
  disabled={!isEditing}
/>
```

**Features especiais:**
- Busca automática no banco de dados
- Mostra avatar/ícone da entidade
- Loading state enquanto busca
- Cache de resultados

**Busca por tipo:**
| Tipo | Service | Mostra |
|------|---------|--------|
| character | `getAllCharacters()` | Avatar + Nome |
| faction | `getAllFactions()` | Cor + Nome |
| race | `getAllRaces()` | Ícone + Nome |
| item | `getAllItems()` | Ícone + Nome |
| region | `getAllRegions()` | Nome + Tipo |

---

### 6. EntityMultiSelect

**Localização:** `src/components/forms/EntityMultiSelect.tsx`

**Propósito:** Multi-select de entidades do banco com badges e avatares.

**Props:**
```typescript
interface EntityMultiSelectProps {
  entity: 'character' | 'faction' | 'race' | 'item' | 'region';
  value: string[];                  // Array de IDs selecionados
  onChange: (value: string[]) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  maxItems?: number;
  filter?: (entity: T) => boolean;
  excludeIds?: string[];
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<EntityMultiSelect
  entity="faction"
  value={safeJsonParse(editData.residentFactions)}
  onChange={(ids) => updateField('residentFactions', JSON.stringify(ids))}
  label="Facções Residentes"
  placeholder="Selecione facções..."
  maxItems={10}
  disabled={!isEditing}
/>
```

**Features especiais:**
- Badges com avatar/ícone + nome
- Botão "X" em cada badge
- Limite de itens
- Loading state

---

## Componentes de Layout

Componentes estruturais para páginas de detalhes.

### 1. DetailPageLayout

**Localização:** `src/components/detail-page/DetailPageLayout.tsx`

**Propósito:** Layout principal de páginas de detalhes com sidebar e conteúdo.

**Props:**
```typescript
interface DetailPageLayoutProps {
  children: React.ReactNode;        // Conteúdo principal
  sidebar: React.ReactNode;         // Sidebar (menu lateral)
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<DetailPageLayout
  sidebar={
    <SideNavigation
      items={navItems}
      header={<VersionSelector ... />}
      footer={<DeleteButton ... />}
    />
  }
>
  <EditControls ... />
  <BasicInfoSection>...</BasicInfoSection>
  <AdvancedInfoSection>...</AdvancedInfoSection>
</DetailPageLayout>
```

**Estrutura renderizada:**
```
┌──────────┬─────────────────────┐
│          │                     │
│ Sidebar  │  Main Content       │
│ (w-64)   │  (flex-1)           │
│          │                     │
└──────────┴─────────────────────┘
```

**Responsividade:**
- Desktop: Sidebar 256px + conteúdo flexível
- Mobile: Sidebar colapsável (hamburger)

---

### 2. SideNavigation

**Localização:** `src/components/detail-page/SideNavigation.tsx`

**Propósito:** Menu de navegação lateral para páginas de detalhes.

**Props:**
```typescript
interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface SideNavigationProps {
  items: NavItem[];
  activeItem?: string;              // ID do item ativo
  header?: React.ReactNode;         // Ex: VersionSelector
  footer?: React.ReactNode;         // Ex: DeleteButton
  className?: string;
}
```

**Exemplo de uso:**
```tsx
const navItems = [
  { id: 'info', label: t('information'), icon: <Info /> },
  { id: 'timeline', label: t('timeline'), icon: <Clock /> },
  { id: 'map', label: t('map'), icon: <Map /> },
];

<SideNavigation
  items={navItems}
  activeItem={activeSection}
  header={<VersionSelector versions={versions} ... />}
  footer={
    <Button variant="destructive" onClick={openDeleteDialog}>
      <Trash2 /> {t('delete')}
    </Button>
  }
/>
```

**Features especiais:**
- Item ativo destacado visualmente
- Smooth scroll ao clicar
- Header/footer opcionais

---

### 3. BasicInfoSection

**Localização:** `src/components/detail-page/BasicInfoSection.tsx`

**Propósito:** Container para informações básicas da entidade (sempre visível).

**Props:**
```typescript
interface BasicInfoSectionProps {
  title?: string;                   // Título da seção (opcional)
  children: React.ReactNode;
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<BasicInfoSection title={t('basic_information')}>
  <FormInput label={t('name')} ... />
  <FormTextarea label={t('description')} ... />
  <FormSelect label={t('type')} ... />
</BasicInfoSection>
```

**Aparência:**
```
┌──────────────────────────────┐
│ Informações Básicas          │ ← Título (opcional)
├──────────────────────────────┤
│ Nome: [____________]         │
│ Descrição: [____________]    │
│ Tipo: [Dropdown ▼]          │
└──────────────────────────────┘
```

---

### 4. AdvancedInfoSection

**Localização:** `src/components/detail-page/AdvancedInfoSection.tsx`

**Propósito:** Container colapsável para informações avançadas.

**Props:**
```typescript
interface AdvancedInfoSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}
```

**Exemplo de uso:**
```tsx
const { openSections, toggleSection } = useCollapsibleSections('regionSections');

<AdvancedInfoSection
  title={t('advanced_information')}
  isOpen={openSections.advanced}
  onToggle={() => toggleSection('advanced')}
>
  <FormInput label={t('founded_date')} ... />
  <FormSelect label={t('government_type')} ... />
  <EntitySelect entity="character" label={t('ruler')} ... />
</AdvancedInfoSection>
```

**Aparência (collapsed):**
```
┌──────────────────────────────┐
│ ▶ Informações Avançadas      │ ← Clicável
└──────────────────────────────┘
```

**Aparência (expanded):**
```
┌──────────────────────────────┐
│ ▼ Informações Avançadas      │ ← Clicável
├──────────────────────────────┤
│ Data Fundação: [_________]   │
│ Governo: [Dropdown ▼]        │
│ Governante: [Dropdown ▼]     │
└──────────────────────────────┘
```

**Features especiais:**
- Animação suave de expand/collapse
- Estado persistido em localStorage (via useCollapsibleSections)

---

### 5. CollapsibleSection

**Localização:** `src/components/detail-page/CollapsibleSection.tsx`

**Propósito:** Seção colapsável genérica para features especiais (timeline, mapa, etc).

**Props:**
```typescript
interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<CollapsibleSection
  title={t('timeline')}
  icon={<Clock />}
  isOpen={openSections.timeline}
  onToggle={() => toggleSection('timeline')}
>
  <RegionTimeline timeline={timeline} ... />
</CollapsibleSection>
```

**Diferença de AdvancedInfoSection:**
- `AdvancedInfoSection`: Para campos de formulário avançados
- `CollapsibleSection`: Para features completas (timeline, mapa, etc)

---

### 6. EditControls

**Localização:** `src/components/detail-page/EditControls.tsx`

**Propósito:** Botões de controle de edição padronizados.

**Props:**
```typescript
interface EditControlsProps {
  isEditing: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;            // Opcional
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<EditControls
  isEditing={isEditing}
  hasChanges={hasChanges}
  isSaving={isSaving}
  onEdit={() => setIsEditing(true)}
  onSave={handleSave}
  onCancel={handleCancel}
  onDelete={openDeleteDialog}
/>
```

**Comportamento:**

**Quando NÃO está editando:**
```
[Editar] [Deletar]
```

**Quando está editando:**
```
[Salvar] [Cancelar]
```
- Botão "Salvar" desabilitado se `!hasChanges`
- Botão "Salvar" com loading se `isSaving`

**Quando está salvando:**
```
[⟳ Salvando...] [Cancelar]
```

---

## Componentes de Listas

### 1. CollapsibleEntityList

**Localização:** `src/components/entity-list/CollapsibleEntityList.tsx`

**Propósito:** Lista colapsável de entidades relacionadas com renderização customizada.

**Props:**
```typescript
interface CollapsibleEntityListProps<T> {
  title: string;
  entities: T[];                    // Array de entidades
  isOpen: boolean;
  onToggle: () => void;
  renderCard: (entity: T) => React.ReactNode; // Função de render
  emptyText: string;                // Texto quando vazio
  isEditing?: boolean;              // Modo de edição
  onRemove?: (entity: T) => void;   // Callback de remoção
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<CollapsibleEntityList
  title={t('resident_factions')}
  entities={residentFactionsData}
  isOpen={openSections.residentFactions}
  onToggle={() => toggleSection('residentFactions')}
  renderCard={(faction) => <FactionCard faction={faction} />}
  emptyText={t('no_resident_factions')}
  isEditing={isEditing}
  onRemove={handleRemoveFaction}
/>
```

**Aparência (collapsed):**
```
┌──────────────────────────────┐
│ ▶ Facções Residentes (3)     │
└──────────────────────────────┘
```

**Aparência (expanded - visualização):**
```
┌──────────────────────────────┐
│ ▼ Facções Residentes (3)     │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ [Ícone] Guarda Imperial  │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ [Ícone] Mercadores       │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ [Ícone] Ordem Mágica     │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

**Aparência (expanded - edição):**
```
┌──────────────────────────────┐
│ ▼ Facções Residentes (3)     │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ [Ícone] Guarda Imperial X│ │ ← Botão remover
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ [Ícone] Mercadores      X│ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ [Ícone] Ordem Mágica    X│ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

**Features especiais:**
- Renderização totalmente customizável via `renderCard`
- Contador de itens no título
- Modo de edição com botões de remoção
- Estado vazio customizável

**Uso típico em RegionDetail:**
```tsx
// Facções residentes
<CollapsibleEntityList
  entities={residentFactions}
  renderCard={(faction) => <FactionCard faction={faction} />}
  ...
/>

// Personagens importantes
<CollapsibleEntityList
  entities={importantCharacters}
  renderCard={(char) => <CharacterCard character={char} />}
  ...
/>

// Raças
<CollapsibleEntityList
  entities={races}
  renderCard={(race) => <RaceCard race={race} />}
  ...
/>
```

---

## Componentes de Modais/Dialogs

### 1. DeleteConfirmationDialog

**Localização:** `src/components/dialogs/DeleteConfirmationDialog.tsx`

**Propósito:** Dialog de confirmação de exclusão padronizado.

**Props:**
```typescript
interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;               // "region", "character", etc
  entityName: string;               // Nome da entidade
  onConfirm: () => Promise<void>;
  children?: React.ReactNode;       // Conteúdo customizado
  requireNameConfirmation?: boolean; // Exigir digitar nome
  translationNamespace?: string;    // Namespace de tradução
  className?: string;
}
```

**Exemplo de uso (básico):**
```tsx
<DeleteConfirmationDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  entityType="region"
  entityName={region.name}
  onConfirm={handleDelete}
  translationNamespace="world"
/>
```

**Exemplo de uso (com conteúdo customizado):**
```tsx
<DeleteConfirmationDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  entityType="region"
  entityName={region.name}
  onConfirm={handleDelete}
  requireNameConfirmation
>
  <p className="text-destructive font-semibold">
    {t('delete_warning')}
  </p>
  {hasVersions && (
    <p className="text-muted-foreground">
      {t('delete_versions_warning', { count: versions.length })}
    </p>
  )}
  {hasSubRegions && (
    <p className="text-destructive">
      {t('cannot_delete_has_subregions')}
    </p>
  )}
</DeleteConfirmationDialog>
```

**Aparência (básica):**
```
┌──────────────────────────────┐
│ Deletar Região?              │
├──────────────────────────────┤
│ Você tem certeza que deseja  │
│ deletar "Floresta Élfica"?   │
│ Esta ação não pode ser       │
│ desfeita.                    │
├──────────────────────────────┤
│        [Cancelar] [Deletar]  │
└──────────────────────────────┘
```

**Aparência (com confirmação de nome):**
```
┌──────────────────────────────┐
│ Deletar Região?              │
├──────────────────────────────┤
│ Você tem certeza que deseja  │
│ deletar "Floresta Élfica"?   │
│                              │
│ Digite o nome para confirmar:│
│ [____________________]       │
│                              │
├──────────────────────────────┤
│        [Cancelar] [Deletar]  │ ← Desabilitado
└──────────────────────────────┘
```

**Features especiais:**
- Confirmação por nome (opcional)
- Conteúdo customizado via children
- Loading state no botão
- Tradução automática baseada em entityType

---

## Sistema de Versões

Componentes específicos para o sistema de versionamento.

### 1. VersionSelector

**Localização:** `src/components/version-system/VersionSelector.tsx`

**Propósito:** Dropdown de seleção de versões (usado no header do menu lateral).

**Props:**
```typescript
interface VersionSelectorProps {
  versions: IVersion[];
  currentVersionId: string | null;
  onVersionChange: (versionId: string) => void;
  disabled?: boolean;
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<VersionSelector
  versions={versions}
  currentVersionId={currentVersion?.id}
  onVersionChange={handleVersionChange}
  disabled={isEditing}
/>
```

**Aparência:**
```
┌──────────────────────────┐
│ Versão: [Era dos Dragões ▼]
└──────────────────────────┘
       │
       ▼
┌────────────────────────────┐
│ ✓ Era dos Dragões (Principal) │
│   Era da Paz              │
│   Período Moderno         │
├────────────────────────────┤
│ + Criar Nova Versão       │
└────────────────────────────┘
```

**Features especiais:**
- Versão principal marcada com ✓ e label
- Botão "Criar Nova Versão" no dropdown
- Desabilitado se isEditing (previne perda de dados)

---

### 2. VersionCard

**Localização:** `src/components/version-system/VersionCard.tsx`

**Propósito:** Card de uma versão individual com ações.

**Props:**
```typescript
interface VersionCardProps {
  version: IVersion;
  isActive: boolean;                // É a versão atual?
  onActivate?: () => void;          // Ativar como principal
  onEdit?: () => void;              // Editar nome/descrição
  onDelete?: () => void;            // Deletar versão
  onClick?: () => void;             // Selecionar versão
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<VersionCard
  version={version}
  isActive={currentVersion?.id === version.id}
  onActivate={() => handleActivateVersion(version.id)}
  onEdit={() => openEditVersionDialog(version)}
  onDelete={() => handleDeleteVersion(version.id)}
  onClick={() => handleVersionChange(version.id)}
/>
```

**Aparência (versão principal):**
```
┌────────────────────────────────┐
│ ⭐ Era dos Dragões (Principal) │
│ Região durante o período...    │
│ Atualizado: 10/01/2025         │
│                                │
│ [Editar] [Trocar]             │
└────────────────────────────────┘
```

**Aparência (versão secundária):**
```
┌────────────────────────────────┐
│ Era da Paz                     │
│ Região durante o período...    │
│ Atualizado: 05/01/2025         │
│                                │
│ [Ativar] [Editar] [Deletar]   │
└────────────────────────────────┘
```

**Aparência (versão ativa - sendo visualizada):**
```
┌────────────────────────────────┐
│ ✓ Período Moderno              │ ← Border highlight
│ Versão atual da história       │
│ Atualizado: 12/01/2025         │
│                                │
│ [Editar] [Ativar] [Deletar]   │
└────────────────────────────────┘
```

---

### 3. CreateVersionDialog

**Localização:** `src/components/version-system/CreateVersionDialog.tsx`

**Propósito:** Dialog para criar nova versão.

**Props:**
```typescript
interface CreateVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { name: string; description: string }) => Promise<void>;
  translationNamespace?: string;
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<CreateVersionDialog
  open={createVersionDialogOpen}
  onOpenChange={setCreateVersionDialogOpen}
  onConfirm={handleCreateVersion}
  translationNamespace="world"
/>
```

**Aparência:**
```
┌──────────────────────────────┐
│ Criar Nova Versão            │
├──────────────────────────────┤
│ Nome:                        │
│ [_____________________]      │
│                              │
│ Descrição:                   │
│ [_____________________]      │
│ [_____________________]      │
│ [_____________________]      │
│                              │
│ ℹ️ A versão será criada com │
│ os dados atuais da região    │
│                              │
├──────────────────────────────┤
│        [Cancelar] [Criar]    │
└──────────────────────────────┘
```

**Validações:**
- Nome obrigatório
- Descrição opcional
- Loading state no botão Criar

---

### 4. VersionManager

**Localização:** `src/components/version-system/VersionManager.tsx`

**Propósito:** Componente completo de gerenciamento de versões (usado em modal ou página).

**Props:**
```typescript
interface VersionManagerProps {
  versions: IVersion[];
  currentVersionId: string | null;
  onVersionChange: (versionId: string) => void;
  onVersionCreate: (data: CreateVersionData) => Promise<void>;
  onVersionUpdate: (versionId: string, data: UpdateVersionData) => Promise<void>;
  onVersionDelete: (versionId: string) => Promise<void>;
  onVersionActivate: (versionId: string) => Promise<void>;
  entityType: string;               // "region", "character", etc
  translationNamespace?: string;
  className?: string;
}
```

**Exemplo de uso:**
```tsx
<VersionManager
  versions={versions}
  currentVersionId={currentVersion?.id}
  onVersionChange={handleVersionChange}
  onVersionCreate={handleVersionCreate}
  onVersionUpdate={handleVersionUpdate}
  onVersionDelete={handleVersionDelete}
  onVersionActivate={handleVersionActivate}
  entityType="region"
  translationNamespace="world"
/>
```

**Features especiais:**
- Lista todas as versões como cards
- Botão criar nova versão
- Todas as ações em um só lugar
- Validações automáticas

---

## Padrão de Validação Visual

Todas as páginas de detalhes DEVEM implementar validação usando Zod com feedback visual. **Não use toasts ou snackbars** - apenas feedback visual.

### Elementos Visuais de Validação

#### 1. Asterisco Vermelho em Campos Obrigatórios
```tsx
<Label>
  {t("region-detail:fields.name")}
  <span className="text-destructive ml-1">*</span>
</Label>
```

#### 2. Borda Vermelha em Campos com Erro
```tsx
<Input
  className={errors.name ? "border-destructive" : ""}
  onBlur={() => validateField("name", editData.name)}
  // ... other props
/>
```

#### 3. Mensagem de Erro com Ícone (AlertCircle)
```tsx
{errors.name && (
  <p className="text-sm text-destructive flex items-center gap-1">
    <AlertCircle className="h-4 w-4" />
    {errors.name}
  </p>
)}
```

#### 4. Botão Salvar Desabilitado
```tsx
<Button
  variant="magical"
  onClick={onSave}
  disabled={!hasChanges || hasRequiredFieldsEmpty}
>
  {t("region-detail:header.save")}
</Button>
```

#### 5. Texto de Campos Faltando (vermelho)
```tsx
{hasRequiredFieldsEmpty && (
  <p className="text-xs text-destructive">
    {missingFields.length > 0 ? (
      <>
        {t("missing_fields")}:{" "}
        {missingFields.map((field) => {
          // Mapeie os campos específicos da sua entidade
          const fieldNames: Record<string, string> = {
            name: t("fields.name"),
            // Adicione outros campos básicos da sua entidade aqui
          };
          return fieldNames[field] || field;
        }).join(", ")}
      </>
    ) : (
      t("fill_required_fields")
    )}
  </p>
)}
```

### Props de Validação Necessárias

Toda página de detalhes deve receber essas props:

```typescript
interface DetailViewProps {
  // ... other props
  errors: Record<string, string>;           // Erros por campo
  validateField: (field: string, value: any) => void;  // Validação individual
  hasRequiredFieldsEmpty: boolean;          // Há campos obrigatórios vazios?
  missingFields: string[];                  // Lista de campos faltando
}
```

### Regras de Validação

1. **Campos Básicos = Obrigatórios**: Todos os campos na seção "Informações Básicas" são obrigatórios
2. **Campos Avançados = Opcionais**: Todos os campos na seção "Informações Avançadas" são opcionais
3. **Validação em tempo real (onBlur)**: Valida o campo quando perde o foco
4. **Validação completa (onSave)**: Valida todos os campos ao salvar
5. **Bloqueio de botão**: Desabilita "Salvar" se houver campos obrigatórios vazios
6. **Sem notificações**: Não usar `toast.success()` ou `toast.error()`
7. **Feedback visual apenas**: Bordas vermelhas, mensagens de erro, botão desabilitado

### Exemplo Completo de Campo com Validação

```tsx
import { AlertCircle } from "lucide-react";

// Exemplo: Campo básico (obrigatório) em BasicInfoSection
<BasicInfoSection title={t("basic_information")}>
  <div className="space-y-2">
    {/* Label com asterisco vermelho (campo básico = obrigatório) */}
    <Label>
      {t("fields.name")}
      <span className="text-destructive ml-1">*</span>
    </Label>

    {/* Input com validação onBlur e borda vermelha se erro */}
    <Input
      value={editData.name || ""}
      onChange={(e) => onEditDataChange("name", e.target.value)}
      onBlur={() => validateField("name", editData.name)}
      placeholder={t("placeholders.name")}
      maxLength={200}
      className={errors.name ? "border-destructive" : ""}
      disabled={!isEditing}
      required
    />

    {/* Mensagem de erro com ícone */}
    {errors.name && (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {errors.name}
      </p>
    )}

    {/* Contador de caracteres (opcional) */}
    {maxLength && (
      <div className="flex justify-end text-xs text-muted-foreground">
        <span>{editData.name?.length || 0}/{maxLength}</span>
      </div>
    )}
  </div>
</BasicInfoSection>

// Exemplo: Campo avançado (opcional) em AdvancedInfoSection
<AdvancedInfoSection
  title={t("advanced_information")}
  isOpen={openSections.advanced}
  onToggle={() => toggleSection("advanced")}
>
  <div className="space-y-2">
    {/* Label sem asterisco (campo avançado = opcional) */}
    <Label>{t("fields.founded_date")}</Label>

    <Input
      value={editData.foundedDate || ""}
      onChange={(e) => onEditDataChange("foundedDate", e.target.value)}
      // SEM onBlur validation - campo opcional
      disabled={!isEditing}
    />
    {/* SEM mensagem de erro - campo opcional */}
  </div>
</AdvancedInfoSection>
```

---

## Guia de Uso Rápido

### Criar Nova Página de Detalhes

1. **Layout básico:**
```tsx
import { DetailPageLayout, SideNavigation, EditControls } from '@/components/detail-page';

<DetailPageLayout
  sidebar={
    <SideNavigation
      items={navItems}
      activeItem={activeSection}
    />
  }
>
  <EditControls ... />
  {/* Conteúdo */}
</DetailPageLayout>
```

2. **Adicionar campos:**
```tsx
import { FormInput, FormTextarea, FormSelect, EntitySelect } from '@/components/forms';

<BasicInfoSection>
  <FormInput label="Nome" ... />
  <FormTextarea label="Descrição" ... />
  <FormSelect label="Tipo" options={typeOptions} ... />
  <EntitySelect entity="character" label="Fundador" ... />
</BasicInfoSection>
```

3. **Adicionar seções avançadas:**
```tsx
import { AdvancedInfoSection } from '@/components/detail-page';

<AdvancedInfoSection
  title="Informações Avançadas"
  isOpen={openSections.advanced}
  onToggle={() => toggleSection('advanced')}
>
  {/* Campos avançados */}
</AdvancedInfoSection>
```

4. **Adicionar listas de entidades:**
```tsx
import { CollapsibleEntityList } from '@/components/entity-list';

<CollapsibleEntityList
  title="Facções"
  entities={factions}
  renderCard={(faction) => <FactionCard faction={faction} />}
  isOpen={openSections.factions}
  onToggle={() => toggleSection('factions')}
  emptyText="Nenhuma facção"
/>
```

5. **Adicionar exclusão:**
```tsx
import { DeleteConfirmationDialog } from '@/components/dialogs';

<DeleteConfirmationDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  entityType="myentity"
  entityName={entity.name}
  onConfirm={handleDelete}
/>
```

---

## Checklist de Componentes por Página

✅ **Obrigatório em toda página de detalhes:**
- [ ] DetailPageLayout
- [ ] SideNavigation
- [ ] EditControls
- [ ] BasicInfoSection
- [ ] DeleteConfirmationDialog

✅ **Opcional mas comum:**
- [ ] AdvancedInfoSection
- [ ] CollapsibleSection (para features especiais)
- [ ] CollapsibleEntityList (para relacionamentos)
- [ ] VersionSelector/VersionManager (se tiver versionamento)

✅ **Campos de formulário (conforme necessidade):**
- [ ] FormInput
- [ ] FormTextarea
- [ ] FormSelect
- [ ] FormMultiSelect
- [ ] EntitySelect
- [ ] EntityMultiSelect

---

Fim do documento.
