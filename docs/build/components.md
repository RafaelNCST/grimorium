# Components Documentation

Documentação completa dos componentes reutilizáveis disponíveis no projeto Grimorium.

## Índice

- [Componentes de Layout](#componentes-de-layout)
- [Componentes de Listagem](#componentes-de-listagem)
- [Componentes de Cards](#componentes-de-cards)
- [Componentes de Dialogs](#componentes-de-dialogs)
- [Componentes de Navegação](#componentes-de-navegação)
- [Componentes de Estado Vazio](#componentes-de-estado-vazio)
- [Componentes de Versionamento](#componentes-de-versionamento)
- [Componentes de Texto](#componentes-de-texto)
- [Componentes de Alertas](#componentes-de-alertas)
- [Padrões de Uso](#padrões-de-uso)

---

## Componentes de Layout

Componentes para estruturar páginas de detalhes de entidades com padrão consistente.

### DetailPageLayout
**Localização:** `src/components/detail-page/DetailPageLayout.tsx`

Layout principal para páginas de detalhes com sidebar opcional.

**Quando usar:**
- Base de todas as páginas de detalhes de entidades
- Quando precisa de layout consistente com sidebar opcional
- Páginas de detalhes de Character, Faction, Item, Race, Region

**Props principais:**
```typescript
interface DetailPageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  mainClassName?: string;
}
```

**Exemplo:**
```tsx
<DetailPageLayout
  sidebar={<SideNavigation items={navItems} />}
  sidebarClassName="w-64"
>
  {/* Conteúdo principal */}
  <EditControls ... />
  <BasicInfoSection>...</BasicInfoSection>
</DetailPageLayout>
```

---

### BasicInfoSection
**Localização:** `src/components/detail-page/BasicInfoSection.tsx`

Container para campos de informações básicas (não colapsável).

**Quando usar:**
- Seções de informações básicas/essenciais
- Campos que devem estar sempre visíveis
- Primeira seção de páginas de detalhes

**Props principais:**
```typescript
interface BasicInfoSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}
```

**Exemplo:**
```tsx
<BasicInfoSection title="Informações Básicas">
  <FormInput label="Nome" value={name} onChange={setName} />
  <FormTextarea label="Descrição" value={description} onChange={setDescription} />
</BasicInfoSection>
```

---

### AdvancedInfoSection
**Localização:** `src/components/detail-page/AdvancedInfoSection.tsx`

Container colapsável para informações avançadas.

**Quando usar:**
- Informações secundárias/opcionais
- Campos avançados que podem ficar ocultos
- Segunda seção de páginas de detalhes

**Props principais:**
```typescript
interface AdvancedInfoSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}
```

**Exemplo:**
```tsx
const [isOpen, setIsOpen] = useState(false);

<AdvancedInfoSection
  title="Informações Avançadas"
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
>
  <FormSelectGrid label="Tipo" ... />
  <FormListInput label="Habilidades" ... />
</AdvancedInfoSection>
```

---

### CollapsibleSection
**Localização:** `src/components/detail-page/CollapsibleSection.tsx`

Seção genérica colapsável com ícone customizável.

**Quando usar:**
- Seções genéricas (timeline, mapa, relacionamentos)
- Quando precisa de ícone customizado na header
- Seções com conteúdo complexo (não apenas formulários)

**Props principais:**
```typescript
interface CollapsibleSectionProps {
  title: string;
  icon?: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
}
```

**Exemplo:**
```tsx
<CollapsibleSection
  title="Timeline"
  icon={Clock}
  isOpen={showTimeline}
  onToggle={() => setShowTimeline(!showTimeline)}
>
  <Timeline events={events} />
</CollapsibleSection>
```

---

### EditControls
**Localização:** `src/components/detail-page/EditControls.tsx`

Controles padronizados de editar/salvar/cancelar.

**Quando usar:**
- Todas as páginas de detalhes com modo de edição
- Quando precisa de controles de edição consistentes
- Suporte a estados de loading e mudanças não salvas

**Props principais:**
```typescript
interface EditControlsProps {
  isEditing: boolean;
  hasChanges?: boolean;
  isSaving?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  position?: 'top' | 'bottom' | 'sticky'; // default: 'sticky'
  saveText?: string;
  cancelText?: string;
  editText?: string;
}
```

**Exemplo:**
```tsx
<EditControls
  isEditing={isEditing}
  hasChanges={hasChanges}
  isSaving={isSaving}
  onEdit={() => setIsEditing(true)}
  onSave={handleSave}
  onCancel={handleCancel}
  position="sticky"
/>
```

**Funcionalidades:**
- Posição sticky por padrão (sempre visível no scroll)
- Loading state no botão salvar
- Desabilita botão salvar quando não há mudanças
- Visual consistente com todas as páginas

---

### FieldWithVisibilityToggle
**Localização:** `src/components/detail-page/FieldWithVisibilityToggle.tsx`

⭐ **Componente recomendado** - Wrapper para campos opcionais que podem ser ocultados/mostrados.

**Quando usar:**
- Campos OPCIONAIS da seção avançada (Advanced Info Section)
- Campos que o usuário pode escolher esconder na visualização
- Apenas para campos não obrigatórios

**⚠️ IMPORTANTE - Regras de Uso:**
1. ✅ **APENAS campos OPCIONAIS** podem ser ocultados
2. ❌ **Campos OBRIGATÓRIOS** (required) NÃO podem ser ocultados (use `isOptional={false}`)
3. ✅ **Modo VIEW:** Campos ocultos são completamente removidos (return null)
4. ✅ **Modo EDIT:** Campos ocultos são mostrados com opacidade reduzida e borda tracejada
5. ✅ **Seções avançadas:** Se TODOS os campos forem ocultados, a seção inteira deve ser ocultada no modo VIEW
6. ✅ **Seções especiais:** Seções como Timeline, Map podem ser ocultadas por inteiro (use `ISectionVisibility`)

**Props principais:**
```typescript
interface FieldWithVisibilityToggleProps {
  fieldName: string;              // Nome único do campo (ex: "biography")
  label: string;                  // Label do campo
  children: React.ReactNode;      // Conteúdo do campo (input, textarea, etc.)
  isOptional?: boolean;           // Se false, campo não pode ser ocultado (default: true)
  fieldVisibility: { [key: string]: boolean };  // Objeto de visibilidade
  isEditing: boolean;             // Se está em modo de edição
  onFieldVisibilityToggle: (fieldName: string) => void;  // Handler de toggle
  className?: string;             // Classes adicionais
}
```

**Exemplo básico:**
```tsx
import { FieldWithVisibilityToggle } from '@/components/detail-page';

<FieldWithVisibilityToggle
  fieldName="biography"
  label="Biografia"
  isOptional={true}
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={handleFieldVisibilityToggle}
>
  {isEditing ? (
    <FormTextarea
      value={editData.biography || ""}
      onChange={(e) => onEditDataChange("biography", e.target.value)}
      placeholder="Escreva a biografia..."
    />
  ) : (
    region.biography ? (
      <p className="text-sm">{region.biography}</p>
    ) : (
      <EmptyFieldState />
    )
  )}
</FieldWithVisibilityToggle>
```

**Exemplo com campo obrigatório (não pode ser ocultado):**
```tsx
<FieldWithVisibilityToggle
  fieldName="name"
  label="Nome"
  isOptional={false}  // Campo obrigatório - não mostra botão de ocultar
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={handleFieldVisibilityToggle}
>
  {isEditing ? (
    <FormInput value={editData.name} onChange={...} />
  ) : (
    <p>{entity.name}</p>
  )}
</FieldWithVisibilityToggle>
```

**Exemplo de ocultar seção inteira quando todos os campos estão ocultos:**
```tsx
import { hasVisibleFields } from '@/components/detail-page';

// Lista de todos os campos da seção avançada
const advancedFields = [
  'biography', 'personality', 'goals', 'fears', 'motivations'
];

// Verifica se pelo menos um campo está visível
const hasAnyVisibleField = hasVisibleFields(advancedFields, fieldVisibility);

// Renderização condicional
{(!isEditing && !hasAnyVisibleField) ? null : (
  <AdvancedInfoSection title="Informações Avançadas">
    <FieldWithVisibilityToggle fieldName="biography" {...props}>
      {/* conteúdo */}
    </FieldWithVisibilityToggle>

    <FieldWithVisibilityToggle fieldName="personality" {...props}>
      {/* conteúdo */}
    </FieldWithVisibilityToggle>

    {/* ... outros campos */}
  </AdvancedInfoSection>
)}
```

**Funcionalidades:**
- **Toggle visual:** Botão de olho (Eye/EyeOff) aparece apenas em modo de edição para campos opcionais
- **Indicador de obrigatório:** Asterisco vermelho (*) aparece ao lado do label de campos não opcionais
- **Feedback visual no modo edit:**
  - Campo visível: aparência normal
  - Campo oculto: `opacity-50`, `bg-muted/30`, borda tracejada
- **Comportamento no modo view:**
  - Campo visível: renderiza normalmente
  - Campo oculto: return null (não renderiza nada)
- **Gerenciamento de label:** O componente já renderiza o label, portanto:
  - ✅ Remova tags `<Label>` de dentro do children
  - ✅ Para componentes que têm prop `label`, passe `label=""` (string vazia)

**Helpers de Visibilidade:**
```typescript
import {
  hasVisibleFields,
  isSectionVisible,
  toggleFieldVisibility,
  toggleSectionVisibility,
  getHiddenFields,
  getHiddenSections,
  resetFieldsVisibility,
  resetSectionsVisibility,
} from '@/components/detail-page';

// Verificar se algum campo de uma lista está visível
const isVisible = hasVisibleFields(['bio', 'personality'], fieldVisibility);

// Verificar se seção especial está visível
const timelineVisible = isSectionVisible('timeline', sectionVisibility);

// Toggle de visibilidade
const newVisibility = toggleFieldVisibility('biography', fieldVisibility);
setFieldVisibility(newVisibility);

// Obter lista de campos ocultos
const hidden = getHiddenFields(fieldVisibility);  // ['bio', 'goals']

// Reset para todos visíveis
const resetFields = resetFieldsVisibility(['bio', 'personality', 'goals']);
```

**Estrutura no banco de dados:**
```typescript
// Type definition
interface IEntity {
  // ... outros campos
  fieldVisibility?: string;      // JSON string de IFieldVisibility
  sectionVisibility?: string;    // JSON string de ISectionVisibility
}

interface IFieldVisibility {
  [fieldName: string]: boolean;  // false = oculto, true/undefined = visível
}

interface ISectionVisibility {
  [sectionName: string]: boolean;  // false = oculto, true/undefined = visível
}

// Exemplo de valor salvo no banco
{
  fieldVisibility: '{"biography": false, "goals": false}',
  sectionVisibility: '{"timeline": false}'
}
```

**Padrão completo de implementação:**

1. **Adicionar tipos no entity type:**
```typescript
import type { IFieldVisibility, ISectionVisibility } from '@/components/detail-page';

interface IRegion {
  // ... campos existentes
  fieldVisibility?: string;
  sectionVisibility?: string;
}

interface IRegionFormData {
  // ... campos existentes
  fieldVisibility?: IFieldVisibility;
  sectionVisibility?: ISectionVisibility;
}
```

2. **Controller - Gerenciar estado:**
```typescript
import {
  type IFieldVisibility,
  type ISectionVisibility,
  toggleFieldVisibility,
  toggleSectionVisibility,
} from '@/components/detail-page';
import { safeJsonParse } from '@/lib/utils/json-parse';

// Estados
const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
const [sectionVisibility, setSectionVisibility] = useState<ISectionVisibility>({});

// Carregar do banco
useEffect(() => {
  const region = await getRegionById(id);
  setFieldVisibility(safeJsonParse<IFieldVisibility>(region.fieldVisibility, {}));
  setSectionVisibility(safeJsonParse<ISectionVisibility>(region.sectionVisibility, {}));
}, [id]);

// Handlers
const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
  setFieldVisibility((prev) => toggleFieldVisibility(fieldName, prev));
}, []);

const handleSectionVisibilityToggle = useCallback((sectionName: string) => {
  setSectionVisibility((prev) => toggleSectionVisibility(sectionName, prev));
}, []);

// Salvar no banco
const handleSave = async () => {
  await updateRegion(regionId, {
    // ... outros campos
    fieldVisibility: JSON.stringify(fieldVisibility),
    sectionVisibility: JSON.stringify(sectionVisibility),
  });
};

// Passar para view
return (
  <RegionDetailView
    fieldVisibility={fieldVisibility}
    sectionVisibility={sectionVisibility}
    onFieldVisibilityToggle={handleFieldVisibilityToggle}
    onSectionVisibilityToggle={handleSectionVisibilityToggle}
    // ... outras props
  />
);
```

3. **View - Usar componente:**
```tsx
import {
  FieldWithVisibilityToggle,
  hasVisibleFields,
  isSectionVisible,
} from '@/components/detail-page';

// Lista de campos da seção
const advancedFields = ['climate', 'season', 'description', 'anomalies'];

// Verificar se deve mostrar seção
const hasVisibleAdvancedFields = hasVisibleFields(advancedFields, fieldVisibility);

// Renderização
{(!isEditing && !hasVisibleAdvancedFields) ? null : (
  <AdvancedInfoSection title="Informações Avançadas">
    <FieldWithVisibilityToggle
      fieldName="climate"
      label="Clima"
      isOptional={true}
      fieldVisibility={fieldVisibility}
      isEditing={isEditing}
      onFieldVisibilityToggle={onFieldVisibilityToggle}
    >
      {isEditing ? (
        <FormTextarea value={editData.climate} onChange={...} />
      ) : (
        <p>{region.climate}</p>
      )}
    </FieldWithVisibilityToggle>

    {/* Repetir para outros campos */}
  </AdvancedInfoSection>
)}

{/* Seções especiais (ex: Timeline) */}
{isSectionVisible('timeline', sectionVisibility) && (
  <CollapsibleSection
    title="Timeline"
    isOpen={timelineSectionOpen}
    onToggle={onTimelineSectionToggle}
  >
    <Timeline data={timeline} />
  </CollapsibleSection>
)}
```

**⚠️ Notas importantes:**
- Apenas campos da **seção avançada** devem usar este componente
- Campos da **seção básica** (Basic Info Section) NÃO devem ser ocultáveis
- Se um campo é obrigatório (required), use `isOptional={false}` para remover o botão de toggle
- Sempre salve o estado de visibilidade no banco de dados como JSON string
- Use `safeJsonParse` para carregar com fallback para objeto vazio `{}`

---

### SideNavigation
**Localização:** `src/components/detail-page/SideNavigation.tsx`

Navegação lateral genérica para páginas de detalhes.

**Quando usar:**
- Navegação entre seções da página
- Menu lateral customizado
- Links de navegação com ícones

**Props principais:**
```typescript
interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
}

interface SideNavigationProps {
  items: NavItem[];
  activeItem?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  navClassName?: string;
}
```

**Exemplo:**
```tsx
<SideNavigation
  items={[
    { id: 'basic', label: 'Informações Básicas', icon: FileText },
    { id: 'advanced', label: 'Avançado', icon: Settings },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ]}
  activeItem={activeSection}
  header={<h3>Navegação</h3>}
/>
```

---

## Componentes de Listagem

Componentes padronizados para páginas de listagem de entidades.

### EntityListHeader
**Localização:** `src/components/entity-list/EntityListHeader.tsx`

Header padronizado para páginas de listagem.

**Quando usar:**
- ✅ Todas as páginas de listagem (World, Characters, Factions, etc.)
- ✅ Quando precisa de título, descrição e botões de ação
- ✅ Suporte a filtros integrados via children

**Props principais:**
```typescript
interface HeaderAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'magical';
  size?: 'sm' | 'default' | 'lg';
  icon?: LucideIcon;
  className?: string;
}

interface EntityListHeaderProps {
  title: string;
  description: string;
  primaryAction: HeaderAction;
  secondaryActions?: HeaderAction[];
  children?: React.ReactNode; // Geralmente filter badges
}
```

**Exemplo:**
```tsx
<EntityListHeader
  title="Personagens"
  description="Gerencie os personagens da sua história"
  primaryAction={{
    label: "Novo Personagem",
    onClick: () => setShowCreateModal(true),
    variant: "magical",
    icon: Plus,
  }}
  secondaryActions={[
    {
      label: "Importar",
      onClick: handleImport,
      variant: "outline",
      icon: Upload,
    },
  ]}
>
  <EntityFilterBadges ... />
</EntityListHeader>
```

**Funcionalidades:**
- Layout responsivo (stack em mobile)
- Botão primário com destaque
- Múltiplos botões secundários
- Ícones integrados
- Área para filtros (children)

---

### EntitySearchBar
**Localização:** `src/components/entity-list/EntitySearchBar.tsx`

Barra de busca padronizada com ícone de lupa.

**Quando usar:**
- ✅ Busca em páginas de listagem
- ✅ Quando precisa de busca simples por texto
- ✅ Todas as tabs de entidades

**Props principais:**
```typescript
interface EntitySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxWidth?: string; // default: 'max-w-md'
}
```

**Exemplo:**
```tsx
<EntitySearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Buscar personagens..."
  maxWidth="max-w-lg"
/>
```

**Funcionalidades:**
- Ícone de busca integrado
- Largura máxima configurável
- Placeholder customizável
- Debounce recomendado no onChange

---

### EntityFilterBadges
**Localização:** `src/components/entity-list/EntityFilterBadges.tsx`

Sistema de badges de filtros genérico e flexível.

**Quando usar:**
- ✅ Filtros em páginas de listagem
- ✅ Suporta múltiplas linhas de filtros
- ✅ Filtros com cores customizadas
- ✅ Contadores por filtro

**Props principais:**
```typescript
interface BadgeColorConfig {
  color: string;
  activeClasses: string;
  inactiveClasses: string;
}

interface FilterItem<T = string> {
  value: T;
  label: string;
  count: number;
  colorConfig: BadgeColorConfig;
  icon?: LucideIcon;
}

interface FilterRow<T = string> {
  id: string;
  items: FilterItem<T>[];
  label?: string;
}

interface EntityFilterBadgesProps<T = string> {
  totalCount: number;
  totalLabel: string;
  selectedFilters: T[];
  filterRows: FilterRow<T>[];
  onFilterToggle: (value: T) => void;
  onClearFilters: () => void;
}
```

**Exemplo:**
```tsx
// Configuração de cores
const STATUS_COLORS = {
  active: {
    color: 'green',
    activeClasses: 'bg-green-500 text-white border-green-500',
    inactiveClasses: 'bg-green-500/10 text-green-700 dark:text-green-300',
  },
  inactive: {
    color: 'gray',
    activeClasses: 'bg-gray-500 text-white border-gray-500',
    inactiveClasses: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
  },
};

// Criação de filter rows
const filterRows: FilterRow<string>[] = [
  {
    id: 'status',
    label: 'Status',
    items: [
      {
        value: 'active',
        label: 'Ativos',
        count: 10,
        colorConfig: STATUS_COLORS.active,
        icon: Check,
      },
      {
        value: 'inactive',
        label: 'Inativos',
        count: 5,
        colorConfig: STATUS_COLORS.inactive,
        icon: X,
      },
    ],
  },
];

// Uso
<EntityFilterBadges
  totalCount={allCharacters.length}
  totalLabel="Todos"
  selectedFilters={selectedFilters}
  filterRows={filterRows}
  onFilterToggle={(filter) => toggleFilter(filter)}
  onClearFilters={() => setSelectedFilters([])}
/>
```

**Funcionalidades:**
- Suporta múltiplas linhas de filtros
- Cores customizadas por filtro
- Ícones opcionais
- Contador por filtro
- Badge "Todos" com contador total
- Botão "Limpar filtros" (aparece quando há filtros ativos)
- Estados active/inactive com estilos diferentes

---

### CollapsibleEntityList
**Localização:** `src/components/entity-list/CollapsibleEntityList.tsx`

Lista colapsável genérica de entidades com cards customizáveis.

**Quando usar:**
- Listas de entidades relacionadas
- Seções colapsáveis com múltiplos itens
- Quando precisa renderizar cards customizados

**Props principais:**
```typescript
interface CollapsibleEntityListProps<T> {
  title: string;
  entities: T[];
  isOpen: boolean;
  onToggle: () => void;
  renderCard: (entity: T, index: number) => React.ReactNode;
  emptyText: string;
  isEditing?: boolean;
  onRemove?: (entity: T, index: number) => void;
}
```

**Exemplo:**
```tsx
<CollapsibleEntityList
  title="Personagens Relacionados"
  entities={relatedCharacters}
  isOpen={showRelated}
  onToggle={() => setShowRelated(!showRelated)}
  renderCard={(character) => (
    <CharacterCard key={character.id} character={character} />
  )}
  emptyText="Nenhum personagem relacionado"
  isEditing={isEditing}
  onRemove={(character) => handleRemove(character.id)}
/>
```

---

## Componentes de Cards

Cards genéricos e reutilizáveis.

### BookCard
**Localização:** `src/components/common/book-card.tsx`

Card de livro com capa e overlay de ações.

**Quando usar:**
- ✅ Tela Home - listagem de livros do projeto
- Grid de livros

**Props principais:**
```typescript
interface BookCardProps {
  id: string;
  title: string;
  genre?: string[];
  visualStyle?: string;
  coverImage?: string;
  chapters?: number;
  lastModified?: number;
  onClick?: (bookId: string) => void;
  onEdit?: (bookId: string) => void;
}
```

**Exemplo:**
```tsx
<BookCard
  id={book.id}
  title={book.title}
  genre={['Fantasia', 'Aventura']}
  coverImage={book.coverImage}
  chapters={12}
  lastModified={Date.now()}
  onClick={handleBookClick}
  onEdit={handleBookEdit}
/>
```

**Funcionalidades:**
- Aspect ratio 3:4 para capa
- Overlay com botões (aparece no hover)
- Badges de gênero (até 2 + contador)
- Data de modificação formatada
- Animação de hover

---

## Componentes de Dialogs

Modais e dialogs para confirmações e ações.

### DeleteConfirmationDialog
**Localização:** `src/components/dialogs/DeleteConfirmationDialog.tsx`

Dialog de confirmação de exclusão padronizado e moderno.

**Quando usar:**
- ✅ Confirmação de exclusão de entidades
- ✅ Quando não precisa de validação extra (digitação do nome)
- ✅ **Este é o componente padrão para exclusão**

**Props principais:**
```typescript
interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string; // ex: "região", "personagem"
  entityName: string;
  onConfirm: () => Promise<void>;
  children?: React.ReactNode; // Info adicional
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}
```

**Exemplo:**
```tsx
<DeleteConfirmationDialog
  open={showDeleteDialog}
  onOpenChange={setShowDeleteDialog}
  entityType="personagem"
  entityName={character.name}
  onConfirm={async () => {
    await deleteCharacter(character.id);
    toast.success('Personagem excluído com sucesso');
  }}
>
  {/* Informações adicionais (opcional) */}
  <p className="text-sm text-muted-foreground">
    Todas as versões e relacionamentos também serão excluídos.
  </p>
</DeleteConfirmationDialog>
```

**Funcionalidades:**
- Ícone de alerta
- Loading state automático durante exclusão
- Área para informações adicionais (children)
- Botão destrutivo com estado de loading
- Textos customizáveis
- Animação de diálogo

---

### ConfirmDeleteModal
**Localização:** `src/components/modals/confirm-delete-modal.tsx`

Modal de confirmação de exclusão com input de validação (versão antiga).

**Quando usar:**
- ⚠️ Use apenas quando precisa de validação extra
- Exclusões críticas que requerem digitação do nome
- Exclusões de dados importantes

**Props principais:**
```typescript
interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string; // Nome que deve ser digitado para confirmar
  itemType?: string;
}
```

**Exemplo:**
```tsx
<ConfirmDeleteModal
  open={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDeleteVersion}
  title="Excluir Versão"
  description="Esta ação não pode ser desfeita."
  itemName={version.name}
  itemType="versão"
/>
```

**Funcionalidades:**
- Exige digitação do nome do item para confirmar (se `itemName` fornecido)
- Ícone de alerta
- Botão destrutivo com animação glow
- Validação inline

**Recomendação:**
- Use `DeleteConfirmationDialog` para casos comuns
- Use `ConfirmDeleteModal` apenas para exclusões críticas

---

### WarningDialog
**Localização:** `src/components/dialogs/WarningDialog.tsx`

Dialog genérico de aviso/confirmação para ações não destrutivas.

**Quando usar:**
- ✅ Avisos de ações que causam perda de dados temporários (ex: descartar alterações)
- ✅ Confirmações de ações importantes mas não destrutivas (ex: trocar imagem do mapa)
- ✅ **Este é o componente padrão para avisos/confirmações não destrutivas**

**Props principais:**
```typescript
interface WarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string; // default: "Cancelar"
  confirmText?: string; // default: "Confirmar"
  children?: React.ReactNode; // Info adicional (opcional)
}
```

**Exemplo:**
```tsx
<WarningDialog
  open={showWarning}
  onOpenChange={setShowWarning}
  title="Trocar imagem do mapa?"
  description="Existem 5 elementos colocados neste mapa. Ao trocar a imagem, todos os elementos serão removidos e você precisará posicioná-los novamente."
  cancelText="Cancelar"
  confirmText="Continuar e escolher imagem"
  onConfirm={handleContinue}
/>

// Exemplo com children (info adicional)
<WarningDialog
  open={showWarning}
  onOpenChange={setShowWarning}
  title="Descartar alterações?"
  description="Você tem alterações não salvas. Se sair agora, todas as mudanças serão perdidas."
  cancelText="Continuar Editando"
  confirmText="Descartar Alterações"
  onConfirm={handleDiscard}
>
  <p className="text-sm text-muted-foreground">
    Esta ação não pode ser desfeita.
  </p>
</WarningDialog>
```

**Funcionalidades:**
- Ícone de alerta amarelo em círculo (AlertTriangle)
- Layout consistente com modal width de `sm:max-w-md`
- Botões com largura completa e mesmo tamanho (`flex-1`)
- Botão de confirmação destrutivo com animação `animate-glow-red`
- Textos customizáveis para cancelar e confirmar
- Área opcional para informações adicionais (children)
- Animação de entrada/saída

**Visual:**
- Header: Ícone amarelo + Título lado a lado
- Description: Espaçamento `pt-3`
- Footer: Dois botões com mesma largura
  - Cancelar: `AlertDialogCancel` com `h-11`
  - Confirmar: `Button destructive` com `size="lg"` e `animate-glow-red`

**Casos de Uso:**
- Descartar alterações não salvas (UnsavedChangesDialog usa internamente)
- Trocar imagem do mapa quando há marcadores posicionados
- Sair de uma tela com trabalho em progresso
- Resetar configurações importantes
- Qualquer ação que cause perda de dados temporários

**Componentes que usam internamente:**
- `UnsavedChangesDialog` (`src/pages/dashboard/tabs/world/region-detail/components/unsaved-changes-dialog.tsx`)
- Modal de troca de imagem em `region-map/index.tsx`

**Diferenças do DeleteConfirmationDialog:**
- **WarningDialog**: Avisos gerais, confirmações não destrutivas, perda de dados temporários
- **DeleteConfirmationDialog**: Exclusões permanentes de entidades

**Arquivo de exportação:**
```tsx
import { WarningDialog } from '@/components/dialogs';
// ou
import { WarningDialog } from '@/components/dialogs/WarningDialog';
```

---

## Componentes de Navegação

Sidebars de navegação entre entidades com busca e destaque da entidade atual.

### Padrão dos Navigation Sidebars

Todos os navigation sidebars seguem o mesmo padrão:

**Estrutura:**
```
┌─────────────────────────┐
│ [Ícone] Título    (42) │ ← Header com contador
├─────────────────────────┤
│ 🔍 Buscar...           │ ← Search bar
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ [IMG] Nome 1     ✓ │ │ ← Item atual (destacado)
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ [IMG] Nome 2       │ │ ← Outros itens
│ └─────────────────────┘ │
│ ...                     │ ← Scroll área
└─────────────────────────┘
```

**Características comuns:**
- Fixed left com animação de slide
- Header com ícone, título e contador
- Search bar integrada
- Lista scrollável
- Destaque visual do item atual
- Avatares/imagens com fallback
- Fechamento ao clicar fora ou no X
- Transição suave de entrada/saída

---

### CharacterNavigationSidebar
**Localização:** `src/components/character-navigation-sidebar.tsx`

Sidebar de navegação entre personagens.

**Quando usar:**
- ✅ Navegação rápida entre personagens
- ✅ Páginas de detalhes de personagem
- ✅ Qualquer tela que precise trocar entre personagens

**Props principais:**
```typescript
interface CharacterNavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Array<{ id: string; name: string; image?: string }>;
  currentCharacterId?: string;
  onCharacterSelect: (characterId: string) => void;
}
```

**Exemplo:**
```tsx
const [showNav, setShowNav] = useState(false);

// Botão para abrir
<Button onClick={() => setShowNav(true)}>
  <Menu className="w-4 h-4" />
</Button>

// Sidebar
<CharacterNavigationSidebar
  isOpen={showNav}
  onClose={() => setShowNav(false)}
  characters={allCharacters}
  currentCharacterId={currentCharacter.id}
  onCharacterSelect={(id) => {
    navigate(`/characters/${id}`);
    setShowNav(false);
  }}
/>
```

**Funcionalidades:**
- Busca de personagens por nome
- Destaque do personagem atual (background diferente)
- Avatares circulares com fallback de iniciais
- Scroll área para muitos personagens
- Animação de slide da esquerda
- Contador de personagens no header
- Botão X para fechar
- Overlay escuro ao fundo

**Visual:**
- Avatar circular (rounded-full)
- Iniciais coloridas como fallback
- Check mark (✓) no personagem atual
- Hover effect em cada item

---

### FactionNavigationSidebar
**Localização:** `src/components/faction-navigation-sidebar.tsx`

Sidebar de navegação entre facções.

**Quando usar:**
- ✅ Navegação rápida entre facções
- ✅ Páginas de detalhes de facção
- ✅ Qualquer tela que precise trocar entre facções

**Props principais:**
```typescript
interface FactionNavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  factions: Array<{ id: string; name: string; image?: string }>;
  currentFactionId?: string;
  onFactionSelect: (factionId: string) => void;
}
```

**Exemplo:**
```tsx
<FactionNavigationSidebar
  isOpen={showFactionNav}
  onClose={() => setShowFactionNav(false)}
  factions={allFactions}
  currentFactionId={currentFaction.id}
  onFactionSelect={(id) => {
    navigate(`/factions/${id}`);
    setShowFactionNav(false);
  }}
/>
```

**Diferenças do CharacterNavigationSidebar:**
- **Avatar quadrado** (rounded-lg) em vez de circular
- Ícone **Shield** como fallback em vez de iniciais
- Mesmas funcionalidades, apenas visual diferente

---

### ItemNavigationSidebar
**Localização:** `src/components/item-navigation-sidebar.tsx`

Sidebar de navegação entre itens.

**Quando usar:**
- ✅ Navegação rápida entre itens
- ✅ Páginas de detalhes de item
- ✅ Qualquer tela que precise trocar entre itens

**Props principais:**
```typescript
interface ItemNavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ id: string; name: string; image?: string }>;
  currentItemId?: string;
  onItemSelect: (itemId: string) => void;
}
```

**Exemplo:**
```tsx
<ItemNavigationSidebar
  isOpen={showItemNav}
  onClose={() => setShowItemNav(false)}
  items={allItems}
  currentItemId={currentItem.id}
  onItemSelect={(id) => {
    navigate(`/items/${id}`);
    setShowItemNav(false);
  }}
/>
```

**Visual:**
- Avatar circular (rounded-full)
- Ícone de Package como fallback
- Check mark (✓) no item atual

---

### Padrão de Implementação

Para adicionar navigation sidebar em uma página de detalhes:

```tsx
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CharacterNavigationSidebar } from '@/components/character-navigation-sidebar';

function CharacterDetailPage() {
  const [showNav, setShowNav] = useState(false);
  const { characterId } = useParams();
  const navigate = useNavigate();

  // Carregar todos os personagens
  const allCharacters = useCharacterStore((state) => state.characters);

  return (
    <>
      {/* Botão no header ou sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowNav(true)}
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Sidebar de navegação */}
      <CharacterNavigationSidebar
        isOpen={showNav}
        onClose={() => setShowNav(false)}
        characters={allCharacters}
        currentCharacterId={characterId}
        onCharacterSelect={(id) => {
          navigate(`/characters/${id}`);
          setShowNav(false); // Fecha após selecionar
        }}
      />

      {/* Resto do conteúdo */}
    </>
  );
}
```

---

## Componentes de Estado Vazio

### EmptyState
**Localização:** `src/components/empty-state.tsx`

Componente de estado vazio padronizado.

**Quando usar:**
- ✅ Listagens vazias
- ✅ Seções sem conteúdo
- ✅ Estados iniciais
- ✅ Resultados de busca vazios

**Props principais:**
```typescript
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**Exemplo:**
```tsx
// Estado vazio inicial
<EmptyState
  icon={Users}
  title="Nenhum personagem criado"
  description="Crie seu primeiro personagem para começar"
  actionLabel="Criar Personagem"
  onAction={() => setShowCreateModal(true)}
/>

// Busca vazia
<EmptyState
  icon={Search}
  title="Nenhum resultado encontrado"
  description="Tente ajustar sua busca ou filtros"
/>
```

**Funcionalidades:**
- Ícone centralizado
- Título e descrição
- Botão de ação opcional
- Layout centralizado e responsivo

**Uso atual:**
- World tab (regiões vazias)
- Power System tab (sistemas vazios)
- Plot tab (tramas vazias)
- Races tab (raças vazias)
- Characters tab (personagens vazios)
- Factions tab (facções vazias)
- Items tab (itens vazios)

---

## Componentes de Versionamento

### VersionCard
**Localização:** `src/components/version-system/VersionCard.tsx`

Card genérico para exibir uma versão de qualquer entidade.

**Quando usar:**
- ✅ **Componente padrão para exibir versões**
- ✅ Listagem de versões de personagens, facções, itens, raças, regiões
- ✅ Qualquer entidade que tenha sistema de versões

**Props principais:**
```typescript
interface VersionCardVersion {
  id: string;
  name: string;
  description?: string;
  isMain: boolean;
  createdAt: string | number;
}

interface VersionCardProps {
  version: VersionCardVersion;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  className?: string;
}
```

**Exemplo:**
```tsx
<VersionCard
  version={{
    id: '1',
    name: 'Versão 1.0',
    description: 'Versão inicial do personagem',
    isMain: true,
    createdAt: Date.now(),
  }}
  isActive={currentVersionId === '1'}
  onSelect={() => handleVersionSelect('1')}
  onEdit={() => handleVersionEdit('1')}
  onDelete={() => handleVersionDelete('1')}
  onActivate={() => handleVersionActivate('1')}
/>
```

**Funcionalidades:**
- Card clicável para selecionar versão
- Badge "Principal" para versão ativa
- Menu dropdown com ações (3 pontos)
  - Editar
  - Tornar Principal (se não for a principal)
  - Excluir (apenas se não for a principal)
- Data de criação formatada (relativa)
- Descrição opcional
- Ring visual quando versão está ativa
- Hover effect
- Previne exclusão/ativação da versão principal

**Estados visuais:**
- Normal: Border padrão
- Hover: Background accent/50
- Ativa: Ring-2 ring-primary (destacada)
- Principal: Badge com ícone de estrela

---

### CharacterVersionManager
**Localização:** `src/components/character-version-manager.tsx`

Sistema completo de gerenciamento de versões de personagem (componente legado específico).

**⚠️ Nota:** Este componente é específico para personagens. Para novos desenvolvimentos, use o **VersionCard** genérico acima.

**Quando usar:**
- ⚠️ Legado - já implementado em Character detail
- Para novos casos, use VersionCard

**Props principais:**
```typescript
interface CharacterVersionManagerProps {
  versions: ICharacterVersion[];
  currentVersion: ICharacterVersion;
  onVersionChange: (versionId: string) => void;
  onVersionSave: (name: string, description?: string) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (versionId: string, name: string, description?: string) => void;
}
```

**Exemplo:**
```tsx
<CharacterVersionManager
  versions={characterVersions}
  currentVersion={currentVersion}
  onVersionChange={handleVersionChange}
  onVersionSave={handleVersionSave}
  onVersionDelete={handleVersionDelete}
  onVersionUpdate={handleVersionUpdate}
/>
```

**Funcionalidades:**
- Modal principal de gerenciamento
- Modal de criação de versão
- Modal de edição de versão
- Modal de confirmação de exclusão
- Badge de versão ativa
- Datas formatadas
- Dicas de uso
- Lista de versões scrollável

---

## Componentes de Texto

### RichTextEditor
**Localização:** `src/components/rich-text-editor.tsx`

Editor de texto rico com toolbar.

**Quando usar:**
- Edição de descrições longas
- Conteúdo formatado
- Anotações e notas

**Props principais:**
```typescript
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean; // default: false
  placeholder?: string; // default: "Comece a escrever..."
}
```

**Exemplo:**
```tsx
// Modo de edição
<RichTextEditor
  content={biography}
  onChange={setBiography}
  placeholder="Escreva a biografia do personagem..."
/>

// Modo de leitura
<RichTextEditor
  content={biography}
  onChange={() => {}}
  readOnly
/>
```

**Funcionalidades:**
- Toolbar com botões de formatação
- Suporte a headings (H1, H2, H3)
- Bold, Italic
- Blockquote
- Texto normal
- Modo de leitura (sem toolbar)
- Estilos customizados

---

## Componentes de Alertas

### InfoAlert
**Localização:** `src/components/ui/info-alert.tsx`

Alerta de informação estilizado.

**Quando usar:**
- Avisos informativos
- Dicas para o usuário
- Alertas não-críticos

**Props principais:**
```typescript
interface InfoAlertProps {
  children: React.ReactNode;
  className?: string;
}
```

**Exemplo:**
```tsx
<InfoAlert>
  Este personagem está relacionado a 3 regiões diferentes.
</InfoAlert>

<InfoAlert className="mt-4">
  <p className="font-semibold">Dica:</p>
  <p>Use versões para experimentar diferentes desenvolvimentos do personagem.</p>
</InfoAlert>
```

**Funcionalidades:**
- Ícone de Info integrado
- Cores primárias (bg-primary/10, border-primary/30)
- Layout flexível

---

### TitleBar
**Localização:** `src/components/title-bar.tsx`

Barra de título da aplicação (window controls).

**Quando usar:**
- Layout principal da aplicação
- Barra de título global

**Funcionalidades:**
- Título da aplicação
- Título da página atual (baseado em rota)
- Botão de inbox com contador de não lidos
- Controles de janela (minimize, maximize, close)
- Detecção de modal aberto (desabilita inbox)
- Drag region
- Integração com Tauri

**Uso:** Componente usado automaticamente no layout principal

---

## Padrões de Uso

### 1. Padrão de Detail Page

**⚠️ Importante sobre campos em Detail Pages:**

Os componentes de layout (`DetailPageLayout`, `EditControls`, `BasicInfoSection`, etc.) são **estruturais** e **não definem o conteúdo** dos campos. O conteúdo varia por entidade e tem **dois modos de exibição**:

#### **Modo de Visualização** (isEditing = false)
- Mostra dados formatados para leitura
- Usa componentes de UI simples (text, badges, avatares)
- Seções podem ser colapsáveis (`Collapsible` do shadcn)
- Exemplo: `<p className="text-sm">{character.name}</p>`

#### **Modo de Edição** (isEditing = true)
- Mostra campos editáveis
- Usa componentes de formulário (ver `forms.md`)
- Validação inline
- Exemplo: `<FormInput value={editData.name} onChange={...} />`

**Exemplo de campo que muda:**
```tsx
{/* Nome do Personagem */}
{isEditing ? (
  // MODO EDIÇÃO: Input editável
  <FormInput
    label="Nome"
    value={editData.name}
    onChange={(e) => onEditDataChange('name', e.target.value)}
    required
    maxLength={200}
  />
) : (
  // MODO VISUALIZAÇÃO: Texto simples
  <div>
    <Label>Nome</Label>
    <p className="text-lg font-semibold">{character.name}</p>
  </div>
)}
```

**Variação de campos por entidade:**

| Entidade | Campos específicos | Componentes usados |
|----------|-------------------|-------------------|
| **Character** | Nome, Idade, Raça, Facções | FormInput, FormSelect, FormEntityMultiSelectAuto |
| **Faction** | Nome, Tipo, Status, Líder | FormInput, FormSelectGrid, EntitySelect |
| **Item** | Nome, Categoria, Raridade | FormInput, FormSelect, FormSelectGrid |
| **Region** | Nome, Escala, Clima, Estações | FormInput, FormSelectGrid, FormListInput |

Todos os componentes de formulário estão documentados em **`docs/build/forms.md`**.

#### **Referência Rápida: Componentes por Tipo de Campo**

| Tipo de Dado | Modo Visualização | Modo Edição | Notas |
|--------------|-------------------|-------------|-------|
| **Texto curto** | `<p>{value}</p>` | `<FormInput>` | Nome, título |
| **Texto longo** | `<p className="whitespace-pre-wrap">{value}</p>` | `<FormTextarea>` | Descrição, biografia |
| **Imagem** | `<img src={value} />` ou Avatar | `<FormImageUpload>` | Banner, avatar |
| **Seleção única** | `<Badge>{value}</Badge>` | `<FormSelect>` ou `<FormSelectGrid>` | Tipo, status, escala |
| **Multi-seleção** | `<Collapsible>` com Badges + Avatares | `<FormEntityMultiSelectAuto>` | Facções, personagens relacionados |
| **Lista de strings** | `<div>` com Badges | `<FormListInput>` | Tags, habilidades, características |
| **Data/Timestamp** | `<p>{formatDate(value)}</p>` | `<Input type="date">` | Criação, modificação |
| **Booleano** | `<Badge>Sim/Não</Badge>` ou Ícone | `<Checkbox>` | Ativo/inativo |
| **Número** | `<p>{value}</p>` | `<FormInput type="number">` | Idade, quantidade |
| **Rich Text** | `<RichTextEditor readOnly>` | `<RichTextEditor>` | História, notas |

#### **Padrão de Collapsible para Visualização**

Quando há muitos itens relacionados (facções, personagens, etc.), use `Collapsible` no modo visualização:

```tsx
{/* MODO VISUALIZAÇÃO */}
<Collapsible open={openSections.factions} onOpenChange={() => toggleSection('factions')}>
  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted">
    <p className="text-sm font-semibold text-primary">
      Facções Relacionadas
      {factions.length > 0 && (
        <span className="ml-1 text-muted-foreground">({factions.length})</span>
      )}
    </p>
    {openSections.factions ? <ChevronDown /> : <ChevronRight />}
  </CollapsibleTrigger>
  <CollapsibleContent className="pt-2">
    <div className="flex flex-wrap gap-2">
      {factions.map((faction) => (
        <Badge key={faction.id} variant="outline" className="flex items-center gap-1">
          <Avatar className="w-4 h-4">
            <AvatarImage src={faction.image} />
            <AvatarFallback>{faction.name[0]}</AvatarFallback>
          </Avatar>
          {faction.name}
        </Badge>
      ))}
    </div>
  </CollapsibleContent>
</Collapsible>
```

---

Todas as páginas de detalhes seguem a mesma estrutura:

```tsx
import {
  DetailPageLayout,
  EditControls,
  BasicInfoSection,
  AdvancedInfoSection,
  CollapsibleSection,
} from '@/components/detail-page';

function EntityDetailView() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  return (
    <DetailPageLayout sidebar={<SideNavigation items={navItems} />}>
      {/* Controles de edição (sticky) */}
      <EditControls
        isEditing={isEditing}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {/* Informações básicas (sempre visível) */}
      <BasicInfoSection title="Informações Básicas">
        {/* Nome */}
        {isEditing ? (
          <FormInput
            label="Nome"
            value={editData.name}
            onChange={(e) => onEditDataChange('name', e.target.value)}
            required
            maxLength={200}
          />
        ) : (
          <div>
            <Label className="text-sm font-medium text-primary">Nome</Label>
            <p className="text-base text-foreground mt-1">{entity.name}</p>
          </div>
        )}

        {/* Descrição */}
        {isEditing ? (
          <FormTextarea
            label="Descrição"
            value={editData.description}
            onChange={(e) => onEditDataChange('description', e.target.value)}
            rows={4}
            maxLength={500}
          />
        ) : (
          <div>
            <Label className="text-sm font-medium text-primary">Descrição</Label>
            <p className="text-base text-foreground mt-1 whitespace-pre-wrap">
              {entity.description || 'Sem descrição'}
            </p>
          </div>
        )}
      </BasicInfoSection>

      {/* Informações avançadas (colapsável) */}
      <AdvancedInfoSection
        title="Informações Avançadas"
        isOpen={showAdvanced}
        onToggle={() => setShowAdvanced(!showAdvanced)}
      >
        {/* Tipo/Categoria - Grid Visual */}
        {isEditing ? (
          <FormSelectGrid
            label="Tipo"
            value={editData.type}
            onChange={(value) => onEditDataChange('type', value)}
            options={typeOptions}
            columns={2}
          />
        ) : (
          <div>
            <Label className="text-sm font-medium text-primary">Tipo</Label>
            <Badge variant="secondary" className="mt-1">
              {entity.type}
            </Badge>
          </div>
        )}

        {/* Facções Relacionadas - Multi-Select */}
        {isEditing ? (
          <FormEntityMultiSelectAuto
            key={`factions-${refreshKey}`}
            entityType="faction"
            bookId={bookId}
            label="Facções Relacionadas"
            value={editData.factionIds || []}
            onChange={(value) => onEditDataChange('factionIds', value)}
          />
        ) : (
          <Collapsible open={openSections.factions}>
            <CollapsibleTrigger>
              <Label>Facções Relacionadas ({factions.length})</Label>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-wrap gap-2">
                {factions.map((faction) => (
                  <Badge key={faction.id} variant="outline">
                    <Avatar className="w-4 h-4 mr-1">
                      <AvatarImage src={faction.image} />
                      <AvatarFallback>{faction.name[0]}</AvatarFallback>
                    </Avatar>
                    {faction.name}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </AdvancedInfoSection>

      {/* Seções customizadas (colapsável) */}
      <CollapsibleSection
        title="Timeline"
        icon={Clock}
        isOpen={showTimeline}
        onToggle={() => setShowTimeline(!showTimeline)}
      >
        <Timeline events={events} />
      </CollapsibleSection>
    </DetailPageLayout>
  );
}
```

---

### 2. Padrão de List Page

Todas as páginas de listagem seguem a mesma estrutura:

```tsx
import {
  EntityListHeader,
  EntitySearchBar,
  EntityFilterBadges,
} from '@/components/entity-list';
import { EmptyState } from '@/components/empty-state';

function EntityListView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Configuração de filtros
  const filterRows = createFilterRows(stats, t);

  // Lista vazia
  if (allEntities.length === 0) {
    return (
      <>
        <EntityListHeader
          title={t('title')}
          description={t('description')}
          primaryAction={{
            label: t('create_new'),
            onClick: () => setShowCreateModal(true),
            variant: 'magical',
            icon: Plus,
          }}
        />
        <EmptyState
          icon={Users}
          title={t('empty_state.title')}
          description={t('empty_state.description')}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros integrados */}
      <EntityListHeader
        title={t('title')}
        description={t('description')}
        primaryAction={{
          label: t('create_new'),
          onClick: () => setShowCreateModal(true),
          variant: 'magical',
          icon: Plus,
        }}
        secondaryActions={[
          {
            label: t('manage'),
            onClick: handleManage,
            variant: 'outline',
            icon: Settings,
          },
        ]}
      >
        <EntityFilterBadges
          totalCount={allEntities.length}
          totalLabel={t('filters.all')}
          selectedFilters={selectedFilters}
          filterRows={filterRows}
          onFilterToggle={toggleFilter}
          onClearFilters={() => setSelectedFilters([])}
        />
      </EntityListHeader>

      {/* Barra de busca */}
      <EntitySearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t('search_placeholder')}
      />

      {/* Grid de cards */}
      {filteredEntities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEntities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} onClick={handleClick} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title={t('not_found')}
          description="Try adjusting your search or filters"
        />
      )}
    </div>
  );
}
```

---

### 3. Padrão de Confirmação de Exclusão

```tsx
import { DeleteConfirmationDialog } from '@/components/dialogs/DeleteConfirmationDialog';

function EntityDetail() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    await deleteEntity(entityId);
    toast.success('Entidade excluída com sucesso');
    navigate('/entities');
  };

  return (
    <>
      {/* Botão de exclusão */}
      <Button
        variant="destructive"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir
      </Button>

      {/* Dialog de confirmação */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        entityType="personagem"
        entityName={entity.name}
        onConfirm={handleDelete}
      >
        {/* Informações adicionais (opcional) */}
        <p className="text-sm text-muted-foreground">
          Todas as versões e relacionamentos também serão excluídos.
        </p>
      </DeleteConfirmationDialog>
    </>
  );
}
```

---

## Mapa de Localização

```
src/components/
├── detail-page/
│   ├── DetailPageLayout.tsx          # Layout principal de detalhes
│   ├── BasicInfoSection.tsx          # Seção de informações básicas
│   ├── AdvancedInfoSection.tsx       # Seção de informações avançadas
│   ├── CollapsibleSection.tsx        # Seção colapsável genérica
│   ├── EditControls.tsx              # Controles de editar/salvar/cancelar
│   └── SideNavigation.tsx            # Navegação lateral genérica
│
├── entity-list/
│   ├── EntityListHeader.tsx          # Header de listagem
│   ├── EntitySearchBar.tsx           # Barra de busca
│   ├── EntityFilterBadges.tsx        # Sistema de filtros
│   └── CollapsibleEntityList.tsx     # Lista colapsável genérica
│
├── dialogs/
│   ├── DeleteConfirmationDialog.tsx  # Dialog de confirmação de exclusão
│   ├── WarningDialog.tsx             # Dialog genérico de aviso/confirmação
│   └── index.ts                      # Exportações centralizadas
│
├── common/
│   ├── book-card.tsx                 # Card de livro
│   └── stats-card.tsx                # Card de estatísticas
│
├── modals/
│   └── confirm-delete-modal.tsx      # Modal de exclusão com validação
│
├── character-navigation-sidebar.tsx  # Sidebar de navegação de personagens
├── faction-navigation-sidebar.tsx    # Sidebar de navegação de facções
├── item-navigation-sidebar.tsx       # Sidebar de navegação de itens
├── character-version-manager.tsx     # Gerenciador de versões
├── empty-state.tsx                   # Estado vazio
├── rich-text-editor.tsx              # Editor de texto rico
├── title-bar.tsx                     # Barra de título da aplicação
│
└── ui/
    └── info-alert.tsx                # Alerta informativo
```

---

## Resumo por Categoria

### Layout (Detail Page) - 6 componentes
- **DetailPageLayout** - Layout base com sidebar opcional
- **BasicInfoSection** - Seção não-colapsável para info básicas
- **AdvancedInfoSection** - Seção colapsável para info avançadas
- **CollapsibleSection** - Seção colapsável genérica com ícone
- **EditControls** - Barra de controles de edição (sticky)
- **SideNavigation** - Navegação lateral genérica

### Listagem - 4 componentes
- **EntityListHeader** - Header com título, descrição e ações
- **EntitySearchBar** - Barra de busca padronizada
- **EntityFilterBadges** - Sistema de filtros com badges
- **CollapsibleEntityList** - Lista colapsável genérica

### Cards - 1 componente
- **BookCard** - Card de livro (capa + overlay) - usado na tela Home

### Dialogs - 3 componentes
- **DeleteConfirmationDialog** ⭐ - Dialog de exclusão (padrão)
- **WarningDialog** ⭐ - Dialog de aviso/confirmação não destrutivo (padrão)
- **ConfirmDeleteModal** - Modal com validação (casos críticos)

### Navegação - 3 componentes
- **CharacterNavigationSidebar** - Navegação entre personagens
- **FactionNavigationSidebar** - Navegação entre facções
- **ItemNavigationSidebar** - Navegação entre itens

### Estado Vazio - 1 componente
- **EmptyState** - Estado vazio padronizado

### Versionamento - 2 componentes
- **VersionCard** ⭐ - Card genérico de versão (componente padrão)
- **CharacterVersionManager** - Sistema de versões completo (legado)

### Texto - 1 componente
- **RichTextEditor** - Editor de texto rico

### Alertas - 2 componentes
- **InfoAlert** - Alerta informativo
- **TitleBar** - Barra de título da aplicação

**TOTAL: 23 componentes reutilizáveis documentados**

---

## Componentes Recomendados

### Para Páginas de Detalhes
⭐ **DetailPageLayout** + **EditControls** + **BasicInfoSection** + **AdvancedInfoSection**

### Para Páginas de Listagem
⭐ **EntityListHeader** + **EntitySearchBar** + **EntityFilterBadges** + **EmptyState**

### Para Confirmação de Exclusão
⭐ **DeleteConfirmationDialog** (padrão para todos os casos de exclusão)

### Para Avisos e Confirmações Não Destrutivas
⭐ **WarningDialog** (padrão para descartar alterações, trocar imagens, resetar configs)

### Para Listagem de Livros
⭐ **BookCard** (tela Home)

### Para Sistema de Versões
⭐ **VersionCard** (componente genérico padrão para qualquer entidade)

### Para Navegação Entre Entidades
⭐ **CharacterNavigationSidebar** (personagens)
⭐ **FactionNavigationSidebar** (facções)
⭐ **ItemNavigationSidebar** (itens)

---

## Componentes Específicos de Tabs

⚠️ **Importante:** Os componentes listados neste documento são **globais e reutilizáveis**. Cada tab tem seus próprios componentes específicos que **não devem** ser usados fora do contexto da tab.

### Cards Específicos por Tab

Estes cards estão nas pastas das próprias tabs e **não são globais**:

- **World Tab:**
  - `RegionCard` → `src/pages/dashboard/tabs/world/components/region-card.tsx`

- **Factions Tab:**
  - `FactionCard` → `src/pages/dashboard/tabs/factions/components/faction-card.tsx`

- **Items Tab:**
  - `ItemCard` → `src/pages/dashboard/tabs/items/components/item-card.tsx`

- **Races Tab:**
  - `RaceCard` → `src/pages/dashboard/tabs/races/components/race-card.tsx`
  - `SpeciesCard` → `src/pages/dashboard/tabs/races/components/species-card.tsx`

- **Characters Tab:**
  - Cards de personagem estão em `src/pages/dashboard/tabs/characters/components/`

- **Power System Tab:**
  - `PowerLinkCard` → `src/pages/dashboard/tabs/power-system/components/power-link-card.tsx`
  - Hover cards específicos em `src/pages/dashboard/tabs/power-system/components/entity-views/`

### Version Cards Específicos

Cada entidade tem seu próprio version card:

- `src/pages/dashboard/tabs/characters/character-detail/components/version-card.tsx`
- `src/pages/dashboard/tabs/factions/faction-detail/components/version-card.tsx`
- `src/pages/dashboard/tabs/items/item-detail/components/version-card.tsx`
- `src/pages/dashboard/tabs/races/race-detail/components/race-version-card.tsx`
- `src/pages/dashboard/tabs/world/region-detail/components/version-card.tsx`

**Componente Global de Versão:**
- `VersionCard` → `src/components/version-system/VersionCard.tsx` (componentizado e reutilizável)

---

## Referências

- **Componentes de layout:** `src/components/detail-page/`
- **Componentes de listagem:** `src/components/entity-list/`
- **Componentes de dialogs:** `src/components/dialogs/`
- **UI primitivos:** `src/components/ui/`
- **Forms:** Ver `docs/build/forms.md`
- **Componentes específicos de tabs:** Ver seção "Componentes Específicos de Tabs" acima
