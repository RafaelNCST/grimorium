# Como Criar uma Tab com Detalhes de Entidade

Guia prático para criar uma tab seguindo o padrão da tab **Mundo** (regiões).

---

## Estrutura de Arquivos

```
src/pages/dashboard/tabs/[nome-da-tab]/
├── index.tsx                          # Container (lógica)
├── view.tsx                           # View (apresentação da listagem)
├── [entidade]-detail/
│   ├── index.tsx                      # Container dos detalhes
│   ├── view.tsx                       # View dos detalhes
│   └── components/                    # Componentes específicos dos detalhes
├── components/                        # Componentes da listagem
│   ├── [entidade]-card.tsx            # Card da entidade
│   └── ...
├── types/
│   └── [entidade]-types.ts            # Tipos TypeScript
└── helpers/
    └── filter-config.ts               # Configuração de filtros
```

---

## Passo 1: Listagem de Entidades

### 1.1 Container (`index.tsx`)

**Responsabilidades:**
- Estado (regiões, loading, filtros, modais)
- Lógica de negócio (carregar dados, criar, filtrar)
- Callbacks (navegação, ações)

**Pattern:**
```tsx
export function [Entidade]Tab({ bookId }: Props) {
  // Estados
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Carregar dados
  const loadEntities = useCallback(async () => {
    setIsLoading(true);
    const data = await getEntitiesByBookId(bookId);
    setEntities(data);
    setIsLoading(false);
  }, [bookId]);

  // Filtros
  const filteredEntities = useMemo(() => {
    // Lógica de filtro por busca e filtros
  }, [entities, searchQuery, selectedFilters]);

  // Callbacks
  const handleCreate = useCallback(async (data) => {
    await createEntity({ bookId, ...data });
    loadEntities();
  }, [bookId, loadEntities]);

  const handleEntityClick = useCallback((entityId) => {
    navigate({ to: "/dashboard/$dashboardId/tabs/[tab]/$entityId" });
  }, []);

  return (
    <[Entidade]View
      entities={filteredEntities}
      isLoading={isLoading}
      // ... passar estados e callbacks
    />
  );
}
```

### 1.2 View (`view.tsx`)

**Componentes principais:**
- `EntityListLayout` - Layout padrão com header, filtros, busca
- `EntityCardList` - Grid responsivo de cards

**Pattern:**
```tsx
export function [Entidade]View({ entities, isLoading, ... }: Props) {
  return (
    <>
      <EntityListLayout
        isLoading={isLoading}
        isEmpty={entities.length === 0}
        emptyState={{
          icon: IconeDoTema,
          title: "Nenhuma entidade",
          description: "Crie sua primeira entidade"
        }}
        header={{
          title: "Título da Tab",
          description: "Descrição",
          primaryAction: {
            label: "Nova Entidade",
            onClick: () => onShowCreateModal(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow"
          },
          secondaryActions: [/* ações extras */]
        }}
        filters={{
          totalCount: allEntities.length,
          selectedFilters,
          filterRows,
          onFilterToggle,
          onClearFilters
        }}
        search={{
          value: searchQuery,
          onChange: onSearchChange,
          placeholder: "Buscar..."
        }}
      >
        <EntityCardList
          items={entities}
          renderCard={(entity) => (
            <EntityCard entity={entity} onClick={onEntityClick} />
          )}
          gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        />
      </EntityListLayout>

      {/* Modais */}
      <CreateEntityModal ... />
    </>
  );
}
```

### 1.3 Card da Entidade

**IMPORTANTE:** Cada card é **específico** para sua tab. Não há componente reutilizável de card - apenas o comportamento de hover é padrão.

**Componentes base:** `@/components/ui/card` (Card, CardContent, CardHeader, CardFooter)

**Padrões comuns:**
- ✅ `cursor-pointer` - Clicável
- ✅ `hover:border-primary/50` - Borda animada no hover
- ✅ `transition-all duration-300` - Transições suaves
- ✅ Overlay com "Ver detalhes" no hover da imagem

**Exemplo (RegionCard):**
```tsx
export function RegionCard({ region, onClick, parentRegion }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
      onClick={() => onClick?.(region.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Imagem com overlay no hover */}
        <div className="relative w-full h-[28rem]">
          <img src={region.image} className="w-full h-full object-fill rounded-t-lg" />
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-t-lg ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <span className="text-white text-lg font-semibold">Ver detalhes</span>
          </div>
        </div>

        {/* Conteúdo único da região */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg">{region.name}</h3>

          {/* Badges específicos (escala, região pai) */}
          <div className="flex gap-1.5">
            <Badge>{region.scale}</Badge>
            {parentRegion && <Badge>{parentRegion.name}</Badge>}
          </div>

          {/* Resumo */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {region.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Customize conforme sua entidade:**
- Estrutura do conteúdo (cabeçalho, corpo, rodapé)
- Badges e tags
- Informações exibidas
- Tamanho e proporção da imagem
- Ícone placeholder quando sem imagem

### 1.4 Modal de Criação

**Usar:** `EntityModal` (documentado em `modals.md`)

```tsx
<EntityModal
  open={isOpen}
  onOpenChange={setIsOpen}
  header={{
    title: "Criar [Entidade]",
    icon: IconeDoTema,
    description: "Descrição",
    warning: "Aviso opcional"
  }}
  basicFields={<FormFields />}
  advancedFields={<AdvancedFields />}
  footer={{
    isSubmitting,
    isValid: form.formState.isValid,
    onSubmit: form.handleSubmit(handleSubmit),
    onCancel: handleClose
  }}
/>
```

---

## Passo 2: Detalhes de Entidade

### 2.1 Container dos Detalhes (`[entidade]-detail/index.tsx`)

**Responsabilidades:**
- Carregar entidade por ID
- Sistema de versões (main + alternativas)
- Estado de edição (view/edit mode)
- Validação (Zod)
- Salvar alterações

**Pattern:**
```tsx
export function EntityDetail() {
  const { dashboardId, entityId } = useParams();

  // Estados principais
  const [entity, setEntity] = useState<IEntity | null>(null);
  const [editData, setEditData] = useState<IEntity>(emptyEntity);
  const [isEditing, setIsEditing] = useState(false);
  const [versions, setVersions] = useState<IEntityVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<IEntityVersion | null>(null);

  // Carregar entidade
  useEffect(() => {
    const loadEntity = async () => {
      const data = await getEntityById(entityId);
      setEntity(data);
      setEditData(data);

      // Carregar versões
      const versionsData = await getEntityVersions(entityId);
      setVersions(versionsData);
      setCurrentVersion(versionsData.find(v => v.isMain));
    };
    loadEntity();
  }, [entityId]);

  // Salvar
  const handleSave = useCallback(async () => {
    // Validar com Zod
    const validated = EntitySchema.parse(editData);

    // Salvar no banco
    if (currentVersion?.isMain) {
      await updateEntity(entityId, validated);
    } else {
      await updateEntityVersionData(currentVersion.id, validated);
    }

    setIsEditing(false);
  }, [editData, currentVersion]);

  return (
    <EntityDetailView
      entity={entity}
      editData={editData}
      isEditing={isEditing}
      versions={versions}
      currentVersion={currentVersion}
      onSave={handleSave}
      onEdit={() => setIsEditing(true)}
      onCancel={() => setIsEditing(false)}
      // ... outros handlers
    />
  );
}
```

### 2.2 View dos Detalhes (`[entidade]-detail/view.tsx`)

**Componentes principais:**
- `EntityDetailLayout` - Layout padrão com header, sidebar, versões
- `Card` + `CardContent` - Seções de conteúdo
- Form fields em modo edição
- Display fields em modo visualização

**Pattern:**
```tsx
export function EntityDetailView({
  entity,
  editData,
  isEditing,
  versions,
  currentVersion,
  ...
}: Props) {
  return (
    <EntityDetailLayout
      icon={IconeDoTema}
      title={entity.name}
      isEditing={isEditing}
      hasChanges={hasChanges}
      onBack={onBack}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      onDelete={onDeleteModalOpen}
      hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
      versions={versions}
      currentVersion={currentVersion}
      onVersionChange={onVersionChange}
      onVersionCreate={onVersionCreate}
      onVersionDelete={onVersionDelete}
      primaryActions={[/* ações extras */]}
    >
      {/* Informações Básicas */}
      <Card>
        <CardContent>
          {isEditing ? (
            <FormField ... />
          ) : (
            <FieldWithVisibilityToggle
              label="Campo"
              value={entity.field}
              isVisible={fieldVisibility.field}
              onToggle={() => onFieldVisibilityToggle("field")}
            />
          )}
        </CardContent>
      </Card>

      {/* Seções Avançadas */}
      <CollapsibleSection
        title="Seção Avançada"
        isOpen={sectionOpen}
        onToggle={onToggleSec}
      >
        {/* Campos avançados */}
      </CollapsibleSection>
    </EntityDetailLayout>
  );
}
```

---

## Passo 3: Tipos TypeScript

**Arquivo:** `types/[entidade]-types.ts`

```tsx
export interface IEntity {
  id: string;
  bookId: string;
  name: string;
  // ... campos obrigatórios

  // Campos opcionais
  description?: string;
  image?: string;

  // Campos JSON (arrays armazenados como string)
  relatedIds?: string; // JSON.stringify(string[])

  // Visibilidade
  fieldVisibility?: string; // JSON.stringify(IFieldVisibility)
  sectionVisibility?: string; // JSON.stringify(ISectionVisibility)

  createdAt: number;
  updatedAt: number;
}

export interface IEntityVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isMain: boolean;
  entityData: IEntity;
}

export interface IEntityFormData extends Omit<IEntity, 'id' | 'createdAt' | 'updatedAt'> {
  // Versão do form (arrays como arrays, não strings)
  relatedIds?: string[];
}
```

---

## Passo 4: Validação com Zod

**Arquivo:** `lib/validation/[entidade]-schema.ts`

```tsx
import { z } from "zod";

export const EntitySchema = z.object({
  // Campos obrigatórios
  name: z.string().min(1, "Nome é obrigatório"),

  // Campos opcionais
  description: z.string().optional(),
  image: z.string().optional(),

  // Arrays
  relatedIds: z.array(z.string()).optional(),

  // Enums
  type: z.enum(["type1", "type2"]).optional(),
});
```

---

## Componentes Reutilizáveis Usados

### Listagem
- ✅ `EntityListLayout` - Layout principal com header, filtros, busca
- ✅ `EntityCardList` - Grid responsivo de cards
- ✅ `EntitySearchBar` - Barra de busca (dentro do EntityListLayout)
- ✅ `Badge` - Tags e badges (ver `components.md`)

### Detalhes
- ✅ `EntityDetailLayout` - Layout de detalhes com sidebar, versões, ações
- ✅ `Card` / `CardContent` - Seções de conteúdo
- ✅ `CollapsibleSection` - Seções colapsáveis (ver `components.md`)
- ✅ `FieldWithVisibilityToggle` - Campos com toggle de visibilidade (ver `components.md`)
- ✅ `InfoAlert` - Avisos e alertas (ver `components.md`)

### Forms (ver `forms.md`)
- ✅ `FormField` + `FormInput` - Inputs de texto
- ✅ `FormField` + `FormTextarea` - Texto longo
- ✅ `FormField` + `FormSelect` - Seleção simples
- ✅ `FormEntityMultiSelectAuto` - Multi-select de entidades
- ✅ `FormImageUpload` - Upload de imagem
- ✅ `ListInput` - Listas de strings (mistérios, anomalias)

### Modais (ver `modals.md`)
- ✅ `EntityModal` - Modal de criar/editar
- ✅ `DeleteEntityModal` - Modal de exclusão com versões
- ✅ `WarningDialog` - Avisos e confirmações
- ✅ `HierarchyManagerModal` - Gerenciamento de hierarquia (se aplicável)

### Botões (ver `buttons.md`)
- ✅ Variant `magical` com `animate-glow` - Ações primárias
- ✅ Variant `secondary` - Ações secundárias
- ✅ Variant `destructive` - Ações destrutivas

---

## Checklist de Implementação

### Listagem
- [ ] Criar `index.tsx` (container) com estado e lógica
- [ ] Criar `view.tsx` com `EntityListLayout` e `EntityCardList`
- [ ] Criar `[entidade]-card.tsx` para renderizar cada item
- [ ] Criar `types/[entidade]-types.ts` com interfaces
- [ ] Criar modal de criação usando `EntityModal`
- [ ] Implementar filtros e busca
- [ ] Configurar navegação para detalhes

### Detalhes
- [ ] Criar `[entidade]-detail/index.tsx` com lógica de versões
- [ ] Criar `[entidade]-detail/view.tsx` com `EntityDetailLayout`
- [ ] Implementar modo edição vs visualização
- [ ] Criar schema Zod para validação
- [ ] Implementar sistema de versões (main + alternativas)
- [ ] Adicionar toggle de visibilidade de campos
- [ ] Implementar salvar/cancelar com validação
- [ ] Adicionar modal de exclusão com `DeleteEntityModal`

### Database
- [ ] Criar service `lib/db/[entidade]s.service.ts` com CRUD
- [ ] Implementar funções de versão (create/update/delete)
- [ ] Adicionar suporte a campos JSON (arrays)

### i18n
- [ ] Criar arquivo de tradução `locales/pt/[entidade].json`
- [ ] Adicionar chaves para listagem e detalhes
- [ ] Configurar mensagens de erro e validação

---

## Exemplos de Referência

**Ver implementação completa:**
- 📁 `src/pages/dashboard/tabs/world/` - Tab Mundo (regiões)
- 📁 `src/pages/dashboard/tabs/world/region-detail/` - Detalhes de região

**Documentação:**
- 📄 `docs/build/components.md` - Componentes gerais
- 📄 `docs/build/forms.md` - Componentes de formulário
- 📄 `docs/build/modals.md` - Modais reutilizáveis
- 📄 `docs/build/buttons.md` - Estilos de botões
