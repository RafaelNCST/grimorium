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
          placeholder: "Buscar...",
          maxWidth: "max-w-[50%]", // Opcional: define largura máxima (padrão: max-w-md)
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

**IMPORTANTE:** Cada card é **específico** para sua tab. Não há componente reutilizável de card - apenas o **comportamento de hover é padrão**.

**Componentes base:** `@/components/ui/card` (Card, CardContent, CardHeader, CardFooter)

---

#### Hover Padrão (SEMPRE aplicar)

**1. No Card principal:**
```tsx
className="relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
```
**⚠️ IMPORTANTE:** Adicionar `relative` para que o overlay funcione corretamente.

**2. Overlay "Ver detalhes" cobrindo o card inteiro:**
- O overlay cobre **todo o card**, não apenas a imagem
- Sempre usar `rounded-lg` (borda do card) e texto `text-lg`

**Pattern completo:**
```tsx
const [isHovered, setIsHovered] = useState(false);

<Card
  className="relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
  onClick={() => onClick?.(id)}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  <CardContent>
    {/* Conteúdo do card (imagem, textos, badges, etc) */}
  </CardContent>

  {/* Overlay cobrindo todo o card */}
  <div
    className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
      isHovered ? "opacity-100" : "opacity-0"
    }`}
  >
    <span className="text-white text-lg font-semibold">
      Ver detalhes
    </span>
  </div>
</Card>
```

**⚠️ IMPORTANTE:**
- O overlay deve estar **fora** do `CardContent`, mas **dentro** do `Card`
- Sempre adicionar `z-10` no overlay
- Sempre adicionar `relative` no Card

---

#### Exemplo 1: Card com Imagem Grande (RegionCard)

```tsx
export function RegionCard({ region, onClick, parentRegion }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
      onClick={() => onClick?.(region.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Imagem grande */}
        <div className="w-full h-[28rem]">
          <img src={region.image} className="w-full h-full object-fill rounded-t-lg" />
        </div>

        {/* Conteúdo único da região */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg">{region.name}</h3>
          <div className="flex gap-1.5">
            <Badge>{region.scale}</Badge>
            {parentRegion && <Badge>{parentRegion.name}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {region.summary}
          </p>
        </div>
      </CardContent>

      {/* Overlay cobrindo todo o card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">Ver detalhes</span>
      </div>
    </Card>
  );
}
```

---

#### Exemplo 2: Card com Avatar Pequeno (CharacterCard)

```tsx
export function CharacterCard({ character, onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
      onClick={() => onClick?.(character.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex gap-4">
          {/* Avatar pequeno */}
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage src={character.image} className="object-cover" />
            <AvatarFallback>...</AvatarFallback>
          </Avatar>

          {/* Conteúdo único do personagem */}
          <div className="flex-1 min-w-0 space-y-2">
            <CardTitle className="text-base font-bold">{character.name}</CardTitle>
            <Badge className={roleData?.bgColorClass}>
              {character.role}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {character.description}
        </p>
      </CardContent>

      {/* Overlay cobrindo todo o card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">
          Ver detalhes
        </span>
      </div>
    </Card>
  );
}
```

---

**Customize conforme sua entidade:**
- Estrutura do conteúdo (cabeçalho, corpo, rodapé)
- Badges e tags
- Informações exibidas
- Tamanho e proporção da imagem/avatar
- Border-radius do overlay (rounded-t-lg, rounded-full, etc.)
- Tamanho do texto do overlay (text-lg, text-xs, etc.)
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

### 2.3 Persistência de Estado das Seções (localStorage)

**IMPORTANTE:** Todas as seções colapsáveis (avançada e especiais) devem **lembrar** seu estado (aberta/fechada) mesmo quando o usuário sair e voltar para a página.

#### 2.3.1 Seção Avançada

A seção avançada é controlada diretamente no container da entidade e deve persistir no localStorage.

**Pattern no Container (`[entidade]-detail/index.tsx`):**

```tsx
export function EntityDetail() {
  // ... outros estados

  // Estado da seção avançada com localStorage
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(() => {
    const stored = localStorage.getItem("[entidade]DetailAdvancedSectionOpen");
    return stored ? JSON.parse(stored) : false; // false = começa fechada
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(
      "[entidade]DetailAdvancedSectionOpen",
      JSON.stringify(advancedSectionOpen)
    );
  }, [advancedSectionOpen]);

  // Handler para toggle
  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  return (
    <EntityDetailView
      // ... outras props
      advancedSectionOpen={advancedSectionOpen}
      onAdvancedSectionToggle={handleAdvancedSectionToggle}
    />
  );
}
```

**Passar para a View:**

```tsx
<EntityDetailLayout
  // ... outras props
  advancedFields={renderAdvancedFields()}
  advancedSectionTitle={t("entity-detail:sections.advanced_info")}
  advancedSectionOpen={advancedSectionOpen}
  onAdvancedSectionToggle={onAdvancedSectionToggle}
/>
```

#### 2.3.2 Seções Especiais (Relacionamentos, Família, Timeline, etc.)

As seções especiais são gerenciadas automaticamente pelo `EntityDetailLayout` através do localStorage, **mas você pode adicionar controle manual se necessário**.

**Padrão Automático (Recomendado):**

O `EntityDetailLayout` já gerencia a persistência automaticamente usando a chave `entityDetailExtraSectionsState`. Apenas passe as seções com `defaultOpen`:

```tsx
<EntityDetailLayout
  extraSections={[
    {
      id: "timeline",
      title: t("entity-detail:sections.timeline"),
      content: <TimelineSection />,
      isCollapsible: true,
      defaultOpen: false, // Define o estado inicial (apenas primeira vez)
    },
    {
      id: "relationships",
      title: t("entity-detail:sections.relationships"),
      content: <RelationshipsSection />,
      isCollapsible: true,
      defaultOpen: false,
    },
  ]}
/>
```

**Padrão Manual (Opcional):**

Se você quiser controlar manualmente o estado das seções especiais (ex: para lógica específica):

```tsx
// No container
const [timelineSectionOpen, setTimelineSectionOpen] = useState(() => {
  const stored = localStorage.getItem("[entidade]DetailTimelineSectionOpen");
  return stored ? JSON.parse(stored) : false;
});

useEffect(() => {
  localStorage.setItem(
    "[entidade]DetailTimelineSectionOpen",
    JSON.stringify(timelineSectionOpen)
  );
}, [timelineSectionOpen]);
```

#### 2.3.3 Chaves do localStorage

**Convenção de nomenclatura:**

```
[entidade]Detail[NomeSeção]Open
```

**Exemplos:**
- `characterDetailAdvancedSectionOpen` - Seção avançada de personagens
- `regionDetailAdvancedSectionOpen` - Seção avançada de regiões
- `regionDetailTimelineSectionOpen` - Timeline de região (manual)
- `entityDetailExtraSectionsState` - Todas as seções especiais (automático)

#### 2.3.4 Comportamento Esperado

✅ **Primeira visita:** Seção começa no estado definido em `defaultOpen`
✅ **Usuário abre/fecha:** Estado é salvo automaticamente no localStorage
✅ **Sair e voltar:** Seção aparece exatamente como o usuário deixou
✅ **Persistência:** Estado mantido mesmo após fechar o navegador

**⚠️ IMPORTANTE:**
- Sempre definir `defaultOpen: false` para seções começarem fechadas
- O estado persiste por entidade (personagem, região, etc.)
- Não usar `defaultOpen: true` a menos que a seção deva realmente começar aberta por padrão

---

## Passo 3: Modo Visualização dos Campos

**IMPORTANTE:** Cada tipo de campo tem uma forma específica de ser exibido no modo visualização. Siga os padrões abaixo.

### 3.1 Campos Básicos vs Avançados

**⚠️ REGRA FUNDAMENTAL:**

**Campos Básicos (obrigatórios):**
- ❌ **NÃO** podem ser ocultados
- ❌ **NÃO** usam `FieldWithVisibilityToggle`
- ✅ Sempre visíveis (nome, resumo, campos obrigatórios)
- ✅ Renderizados diretamente sem toggle

**Campos Avançados (opcionais):**
- ✅ **PODEM** ser ocultados
- ✅ **DEVEM** usar `FieldWithVisibilityToggle`
- ✅ Usuário pode mostrar/ocultar em modo visualização
- ✅ Todos estão dentro da seção "Avançado"

**Exemplo de estrutura:**

```tsx
// ❌ Campo BÁSICO (obrigatório) - SEM FieldWithVisibilityToggle
{isEditing ? (
  <div className="space-y-2">
    <Label className="text-primary">
      Nome <span className="text-destructive ml-1">*</span>
    </Label>
    <Input
      value={editData.name}
      onChange={(e) => onEditDataChange("name", e.target.value)}
    />
  </div>
) : (
  <h2 className="text-3xl font-bold">{entity.name}</h2>
)}

// ✅ Campo AVANÇADO (opcional) - COM FieldWithVisibilityToggle
<FieldWithVisibilityToggle
  fieldName="climate"
  label={t("climate_label")}
  isOptional
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={onFieldVisibilityToggle}
>
  {isEditing ? (
    <Textarea value={editData.climate} ... />
  ) : entity.climate ? (
    <p className="text-sm">{entity.climate}</p>
  ) : (
    <EmptyFieldState t={t} />
  )}
</FieldWithVisibilityToggle>
```

### 3.2 Estrutura Geral com FieldWithVisibilityToggle

Apenas campos **opcionais/avançados** devem usar `FieldWithVisibilityToggle`:

```tsx
<FieldWithVisibilityToggle
  fieldName="nomeDocampo"
  label={isEditing ? t("label") : ""} // Label vazia em view mode para alguns casos
  isOptional
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={onFieldVisibilityToggle}
>
  {isEditing ? (
    {/* Renderizar campo de input */}
  ) : (
    {/* Renderizar visualização */}
  )}
</FieldWithVisibilityToggle>
```

### 3.2 Estado Vazio (EmptyFieldState)

Quando o campo está vazio em modo visualização, sempre usar:

```tsx
<EmptyFieldState t={t} />
```

**Renderiza:**
```tsx
<span className="italic text-muted-foreground/60">
  Não especificado
</span>
```

### 3.3 Padrões por Tipo de Campo

#### 3.3.1 Texto Curto (Input)

**Edição:** `<Input />`
**Visualização:** Texto simples com `text-sm`

```tsx
{isEditing ? (
  <Input
    value={editData.field || ""}
    onChange={(e) => onEditDataChange("field", e.target.value)}
    placeholder={t("placeholder")}
  />
) : entity.field ? (
  <p className="text-sm">{entity.field}</p>
) : (
  <EmptyFieldState t={t} />
)}
```

#### 3.3.2 Texto Longo (Textarea)

**Edição:** `<Textarea />` com contador de caracteres
**Visualização:** Texto com `whitespace-pre-wrap` para preservar quebras de linha

```tsx
{isEditing ? (
  <>
    <Textarea
      value={editData.description || ""}
      onChange={(e) => onEditDataChange("description", e.target.value)}
      placeholder={t("placeholder")}
      maxLength={1000}
      rows={5}
      className="resize-none"
    />
    <div className="flex justify-end text-xs text-muted-foreground">
      <span>{editData.description?.length || 0}/1000</span>
    </div>
  </>
) : entity.description ? (
  <p className="text-sm whitespace-pre-wrap">{entity.description}</p>
) : (
  <EmptyFieldState t={t} />
)}
```

#### 3.3.3 Select Personalizado (ex: SeasonPicker)

**Edição:** Componente customizado
**Visualização:** Card colorido com ícone

```tsx
{isEditing ? (
  <SeasonPicker
    value={editData.season}
    customSeasonName={editData.customSeasonName}
    onSeasonChange={(season) => onEditDataChange("season", season)}
    onCustomNameChange={(name) => onEditDataChange("customSeasonName", name)}
  />
) : entity.season ? (
  (() => {
    const selectedSeason = SEASONS.find(s => s.value === entity.season);
    if (!selectedSeason) return null;

    const Icon = selectedSeason.icon;
    const displayLabel = entity.season === "custom" && entity.customSeasonName
      ? entity.customSeasonName
      : t(`seasons.${entity.season}`);

    return (
      <div className={`relative p-4 rounded-lg border-2 text-left ${SEASON_COLORS[entity.season]} text-foreground`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{displayLabel}</p>
            <p className="text-xs mt-1 opacity-80">{selectedSeason.description}</p>
          </div>
        </div>
      </div>
    );
  })()
) : (
  <EmptyFieldState t={t} />
)}
```

#### 3.3.4 Lista de Strings (ListInput)

**Edição:** `<ListInput />`
**Visualização:** Collapsible com lista `ul > li`

**⚠️ IMPORTANTE:**
- Label **vazia** em modo edição e visualização no FieldWithVisibilityToggle (para evitar duplicação)
- Label **preenchida** no CollapsibleTrigger em visualização
- Contador de itens ao lado do label

```tsx
<FieldWithVisibilityToggle
  fieldName="mysteries"
  label=""
  isOptional
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={onFieldVisibilityToggle}
>
  {isEditing ? (
    <ListInput
      label=""
      placeholder={t("placeholder")}
      buttonText={t("add_button")}
      value={editData.mysteries ? safeJsonParse(editData.mysteries) : []}
      onChange={(value) => onEditDataChange("mysteries", JSON.stringify(value))}
      labelClassName="text-sm font-medium text-primary"
    />
  ) : (
    <Collapsible
      open={openSections.mysteries}
      onOpenChange={() => toggleSection("mysteries")}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
        <p className="text-sm font-semibold text-primary">
          {t("label")}
          {safeJsonParse(entity.mysteries).length > 0 && (
            <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
              ({safeJsonParse(entity.mysteries).length})
            </span>
          )}
        </p>
        {openSections.mysteries ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {safeJsonParse(entity.mysteries).length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {safeJsonParse(entity.mysteries).map((item: string, index: number) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        ) : (
          <EmptyFieldState t={t} />
        )}
      </CollapsibleContent>
    </Collapsible>
  )}
</FieldWithVisibilityToggle>
```

**Estado necessário para collapsibles:**

```tsx
// No container
const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

const toggleSection = (sectionName: string) => {
  setOpenSections(prev => ({
    ...prev,
    [sectionName]: !prev[sectionName]
  }));
};
```

#### 3.3.5 Multi-Select de Entidades (FormEntityMultiSelectAuto)

**Edição:** `<FormEntityMultiSelectAuto />`
**Visualização:** Collapsible com cards de entidade (imagem + nome)

**⚠️ IMPORTANTE:**
- Label **vazia** no FieldWithVisibilityToggle (para evitar duplicação)
- Label **preenchida** no CollapsibleTrigger em visualização
- Contador de itens ao lado do label

```tsx
<FieldWithVisibilityToggle
  fieldName="relatedCharacters"
  label=""
  isOptional
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={onFieldVisibilityToggle}
>
  {isEditing ? (
    <FormEntityMultiSelectAuto
      entityType="character"
      bookId={bookId}
      label=""
      placeholder={t("placeholder")}
      emptyText={t("no_characters")}
      noSelectionText={t("no_selection")}
      searchPlaceholder={t("search")}
      value={editData.relatedCharacters ? safeJsonParse(editData.relatedCharacters) : []}
      onChange={(value) => onEditDataChange("relatedCharacters", JSON.stringify(value))}
      labelClassName="text-sm font-medium text-primary"
    />
  ) : (
    <Collapsible
      open={openSections.relatedCharacters}
      onOpenChange={() => toggleSection("relatedCharacters")}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
        <p className="text-sm font-semibold text-primary">
          {t("label")}
          {safeJsonParse(entity.relatedCharacters).length > 0 && (
            <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
              ({safeJsonParse(entity.relatedCharacters).length})
            </span>
          )}
        </p>
        {openSections.relatedCharacters ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {safeJsonParse(entity.relatedCharacters).length > 0 ? (
          <div className="flex flex-col gap-2">
            {safeJsonParse(entity.relatedCharacters).map((characterId: string) => {
              const character = characters.find(c => c.id === characterId);
              return character ? (
                <div
                  key={characterId}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                >
                  {character.image ? (
                    <img
                      src={convertFileSrc(character.image)}
                      alt={character.name}
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {character.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium">{character.name}</span>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <EmptyFieldState t={t} />
        )}
      </CollapsibleContent>
    </Collapsible>
  )}
</FieldWithVisibilityToggle>
```

#### 3.3.6 Imagem (FormImageUpload)

**Edição:** `<FormImageUpload />`
**Visualização:** Imagem ou placeholder com ícone

```tsx
{isEditing ? (
  <FormImageUpload
    value={imagePreview}
    onChange={(value) => onEditDataChange("image", value)}
    label={t("image_label")}
    helperText={`opcional - ${t("recommended_size")}`}
    height="h-[28rem]"
    shape="rounded"
    placeholderIcon={IconeDoTema}
    placeholderText={t("upload_image")}
    id="entity-image-upload"
  />
) : entity.image ? (
  <div className="relative w-full h-[28rem] rounded-lg overflow-hidden border">
    <img
      src={entity.image}
      alt={entity.name}
      className="w-full h-full object-fill"
    />
  </div>
) : (
  <div className="relative w-full h-[28rem] bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
    <IconeDoTema className="w-16 h-16 text-muted-foreground/30" />
  </div>
)}
```

### 3.4 Imports Necessários

```tsx
import { convertFileSrc } from "@tauri-apps/api/core";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EmptyFieldState } from "@/components/detail-page/empty-field-state";
import { safeJsonParse } from "@/lib/utils/json-parse";
```

### 3.5 Checklist de Visualização

- [ ] **Campos básicos (obrigatórios) NÃO usam `FieldWithVisibilityToggle`**
- [ ] **Campos avançados (opcionais) DEVEM usar `FieldWithVisibilityToggle`**
- [ ] Labels vazias (`""`) em modo edição para ListInput e FormEntityMultiSelectAuto
- [ ] Labels preenchidas no `CollapsibleTrigger` em modo visualização
- [ ] Contador de itens ao lado da label nos collapsibles
- [ ] `EmptyFieldState` para campos vazios
- [ ] `whitespace-pre-wrap` para textos longos
- [ ] Estado `openSections` para controlar collapsibles
- [ ] Cards com imagem/avatar para multi-selects de entidades
- [ ] Placeholder com gradiente e ícone para imagens vazias
- [ ] Import de `convertFileSrc` do Tauri para converter caminhos de arquivo

---

## Passo 4: Tipos TypeScript

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

## Passo 4: Configuração de Filtros

**Arquivo:** `helpers/filter-config.ts`

Se a sua tab tiver filtros (badges clicáveis para filtrar entidades), você deve criar uma função helper que retorna a configuração dos filtros.

### 4.1 Estrutura do Filter Config

```tsx
import { FilterRow } from "@/components/entity-list";

export interface [Tipo]Stats {
  total: number;
  // ... stats para cada tipo de filtro
}

/**
 * Creates filter rows configuration for [entidade]
 */
export function create[Tipo]FilterRows(
  stats: [Tipo]Stats,
  t: (key: string) => string
): FilterRow<string>[] {
  return [
    {
      id: "[tipo]-filters",
      items: [
        {
          value: "filter1",
          label: t("namespace:key"),
          count: stats.filter1,
          colorConfig: {
            color: "colorName",
            inactiveClasses: "...",
            activeClasses: "...",
          },
        },
        // ... mais filtros
      ],
    },
  ];
}
```

### 4.2 Color Config (IMPORTANTE)

O `colorConfig` controla as cores do badge em dois estados:

**`inactiveClasses`** - Badge não selecionado:
- Background translúcido (`bg-[color]-500/10`)
- Border colorido (`border-[color]-500/30`)
- Texto colorido (`text-[color]-600 dark:text-[color]-400`)
- **⚠️ IMPORTANTE: Classes de hover (`hover:!bg-[color]-500 hover:!text-black hover:!border-[color]-500`)**

**`activeClasses`** - Badge selecionado:
- Background sólido (`!bg-[color]-500`)
- Texto preto (`!text-black`)
- Border sólido (`!border-[color]-500`)

**⚠️ ATENÇÃO:** As classes de `hover:` devem estar **incluídas nas `inactiveClasses`**, não em uma propriedade separada. Se você esquecer as classes de hover, todos os filtros terão hover roxo (padrão do Badge).

### 4.3 Exemplo Completo

```tsx
import { FilterRow } from "@/components/entity-list";

export interface RoleStats {
  total: number;
  protagonist: number;
  antagonist: number;
  villain: number;
  secondary: number;
  extra: number;
}

export function createRoleFilterRows(
  stats: RoleStats,
  t: (key: string) => string
): FilterRow<string>[] {
  return [
    {
      id: "character-roles",
      items: [
        {
          value: "protagonist",
          label: t("characters:page.protagonist_badge"),
          count: stats.protagonist,
          colorConfig: {
            color: "yellow",
            // ⚠️ Note as classes de hover no final das inactiveClasses:
            inactiveClasses: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-400",
            activeClasses: "!bg-yellow-500 !text-black !border-yellow-500",
          },
        },
        {
          value: "antagonist",
          label: t("characters:page.antagonist_badge"),
          count: stats.antagonist,
          colorConfig: {
            color: "orange",
            inactiveClasses: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:!bg-orange-500 hover:!text-black hover:!border-orange-500",
            activeClasses: "!bg-orange-500 !text-black !border-orange-500",
          },
        },
        {
          value: "villain",
          label: t("characters:page.villain_badge"),
          count: stats.villain,
          colorConfig: {
            color: "red",
            inactiveClasses: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-black hover:!border-red-500",
            activeClasses: "!bg-red-500 !text-black !border-red-500",
          },
        },
        {
          value: "secondary",
          label: t("characters:page.secondary_badge"),
          count: stats.secondary,
          colorConfig: {
            color: "blue",
            inactiveClasses: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
            activeClasses: "!bg-blue-500 !text-black !border-blue-500",
          },
        },
        {
          value: "extra",
          label: t("characters:page.extra_badge"),
          count: stats.extra,
          colorConfig: {
            color: "gray",
            inactiveClasses: "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400 hover:!bg-gray-500 hover:!text-black hover:!border-gray-500",
            activeClasses: "!bg-gray-500 !text-black !border-gray-500",
          },
        },
      ],
    },
  ];
}
```

### 4.4 Uso no Container

```tsx
// No index.tsx (container)
import { createRoleFilterRows } from "./helpers/role-filter-config";

export function CharactersTab() {
  const { t } = useTranslation();

  // Calcular stats
  const roleStats = useMemo(() => ({
    total: characters.length,
    protagonist: characters.filter(c => c.role === "protagonist").length,
    antagonist: characters.filter(c => c.role === "antagonist").length,
    // ... outros
  }), [characters]);

  // Criar filter rows
  const filterRows = useMemo(
    () => createRoleFilterRows(roleStats, t),
    [roleStats, t]
  );

  return (
    <CharactersView
      filterRows={filterRows}
      // ...
    />
  );
}
```

---

## Passo 5: Validação com Zod

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
- [ ] Criar `helpers/filter-config.ts` com colorConfig incluindo classes de hover
- [ ] Implementar filtros e busca no container
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
- [ ] **Implementar persistência de estado no localStorage:**
  - [ ] Seção avançada com `[entidade]DetailAdvancedSectionOpen`
  - [ ] Seções especiais usando `defaultOpen: false` (automático via EntityDetailLayout)

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
