# Padrões de Desenvolvimento - Grimorium

Documentação dos padrões, práticas e arquitetura refinados da Tab Mundo que devem ser seguidos em todo o projeto.

## Índice

- [Estrutura Completa de uma Tab](#estrutura-completa-de-uma-tab)
- [Arquitetura de List Pages](#arquitetura-de-list-pages)
- [Arquitetura de Detail Pages](#arquitetura-de-detail-pages)
- [Sistema de Visibilidade de Campos](#sistema-de-visibilidade-de-campos)
- [Formulários com React Hook Form + Zod](#formulários-com-react-hook-form--zod)
- [Padrão refreshKey](#padrão-refreshkey)
- [Integração com Banco de Dados](#integração-com-banco-de-dados)
- [Routing com TanStack Router](#routing-com-tanstack-router)
- [Checklists de Implementação](#checklists-de-implementação)
- [Snippets Reutilizáveis](#snippets-reutilizáveis)

---

## Estrutura Completa de uma Tab

Uma tab completa no Grimorium segue uma estrutura padronizada com páginas de listagem, detalhes e componentes compartilhados.

### Estrutura de Arquivos Completa

```
src/pages/dashboard/tabs/[entity]/
├── index.tsx                           # List Page Controller
├── view.tsx                            # List Page View
├── types/
│   └── [entity]-types.ts              # Types da entidade
├── helpers/
│   └── [entity]-filter-config.ts      # Configuração de filtros
├── components/                         # Componentes compartilhados da tab
│   ├── [entity]-card.tsx              # Card para listagem
│   ├── delete-[entity]-dialog.tsx     # Dialog de exclusão
│   └── [custom-component].tsx         # Componentes específicos
├── [entity]-detail/                    # Detail Page
│   ├── index.tsx                      # Detail Controller
│   ├── view.tsx                       # Detail View
│   └── components/                    # Componentes específicos do detail
│       ├── create-version-dialog.tsx
│       ├── version-card.tsx
│       └── unsaved-changes-dialog.tsx
└── [additional-pages]/                # Páginas adicionais (ex: map, timeline)
    ├── index.tsx
    ├── view.tsx
    └── components/
```

### Exemplo Completo (Tab Mundo)

```
src/pages/dashboard/tabs/world/
├── index.tsx                          # WorldTab (Controller)
├── view.tsx                           # WorldView (UI)
├── types/
│   └── region-types.ts               # IRegion, RegionScale, etc.
├── helpers/
│   └── scale-filter-config.ts        # Configuração de filtros por escala
├── components/
│   ├── region-card.tsx               # Card de região
│   ├── region-hierarchy-tree.tsx     # Árvore hierárquica
│   ├── scale-picker.tsx              # Picker de escala
│   ├── delete-region-dialog.tsx      # Dialog de exclusão
│   └── hierarchy-manager-modal.tsx   # Modal de gerenciar hierarquia
├── region-detail/
│   ├── index.tsx                     # RegionDetail (Controller)
│   ├── view.tsx                      # RegionDetailView (UI)
│   └── components/
│       ├── create-version-dialog.tsx
│       ├── version-card.tsx
│       ├── region-timeline.tsx
│       └── unsaved-changes-dialog.tsx
└── region-map/                       # Página adicional de mapa
    ├── index.tsx
    ├── view.tsx
    └── components/
        ├── map-canvas.tsx
        ├── map-marker.tsx
        └── map-mode-selector.tsx
```

---

## Arquitetura de List Pages

A página principal de listagem da tab (ex: `src/pages/dashboard/tabs/world/index.tsx`).

### Responsabilidades

**Controller (index.tsx):**
- Carregar dados do banco de dados
- Gerenciar estado de listagem (loading, search, filters)
- Handlers de CRUD (create, delete)
- Lógica de filtros e busca
- Navegação

**View (view.tsx):**
- Renderização de UI
- Estados vazios (empty state)
- Loading state
- Grid de cards
- Header com ações
- Filtros e busca

### Controller Pattern

```typescript
// src/pages/dashboard/tabs/[entity]/index.tsx
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';
import {
  getEntitiesByBookId,
  createEntity,
  deleteEntity,
} from '@/lib/db/[entity].service';
import { EntityView } from './view';
import type { IEntity, IEntityFormData, EntityType } from './types/[entity]-types';

interface EntityTabProps {
  bookId: string;
}

export function EntityTab({ bookId }: EntityTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados principais
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<EntityType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Carregar dados
  const loadEntities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getEntitiesByBookId(bookId);
      setEntities(data);
    } catch (error) {
      console.error('Failed to load entities:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar entidades',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [bookId, toast]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Filtros e busca
  const filteredEntities = useMemo(() => {
    let filtered = entities;

    // Busca por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entity) =>
          entity.name.toLowerCase().includes(query) ||
          entity.description?.toLowerCase().includes(query)
      );
    }

    // Filtro por tipo
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((entity) =>
        selectedFilters.includes(entity.type)
      );
    }

    return filtered;
  }, [entities, searchQuery, selectedFilters]);

  // Estatísticas para filtros
  const filterStats = useMemo(() => {
    const stats = {
      type1: 0,
      type2: 0,
      type3: 0,
    };

    entities.forEach((entity) => {
      stats[entity.type]++;
    });

    return stats;
  }, [entities]);

  // Handlers
  const handleCreateEntity = async (data: IEntityFormData) => {
    try {
      await createEntity(data);
      await loadEntities(); // Reload
      toast({
        title: 'Sucesso',
        description: 'Entidade criada com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao criar entidade',
        variant: 'destructive',
      });
    }
  };

  const handleEntityClick = (entityId: string) => {
    navigate({
      to: '/dashboard/$dashboardId/tabs/[entity]/$entityId',
      params: { dashboardId: bookId, entityId },
    });
  };

  const handleFilterToggle = (filter: EntityType) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <EntityView
      bookId={bookId}
      entities={filteredEntities}
      allEntities={entities}
      isLoading={isLoading}
      searchQuery={searchQuery}
      selectedFilters={selectedFilters}
      filterStats={filterStats}
      showCreateModal={showCreateModal}
      onSearchChange={setSearchQuery}
      onFilterToggle={handleFilterToggle}
      onCreateEntity={handleCreateEntity}
      onEntityClick={handleEntityClick}
      onShowCreateModal={setShowCreateModal}
      onRefreshEntities={loadEntities}
    />
  );
}
```

### View Pattern

```tsx
// src/pages/dashboard/tabs/[entity]/view.tsx
import { useTranslation } from 'react-i18next';
import { Plus, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import {
  EntityListHeader,
  EntitySearchBar,
  EntityFilterBadges,
} from '@/components/entity-list';
import { CreateEntityModal } from '@/components/modals/create-[entity]-modal';
import { EntityCard } from './components/[entity]-card';
import { createFilterRows } from './helpers/[entity]-filter-config';
import type { IEntity, EntityType, IEntityFormData } from './types/[entity]-types';

interface EntityViewProps {
  bookId: string;
  entities: IEntity[];
  allEntities: IEntity[];
  isLoading: boolean;
  searchQuery: string;
  selectedFilters: EntityType[];
  filterStats: Record<EntityType, number>;
  showCreateModal: boolean;
  onSearchChange: (query: string) => void;
  onFilterToggle: (filter: EntityType) => void;
  onCreateEntity: (data: IEntityFormData) => void;
  onEntityClick: (entityId: string) => void;
  onShowCreateModal: (show: boolean) => void;
  onRefreshEntities: () => void;
}

export function EntityView({
  bookId,
  entities,
  allEntities,
  isLoading,
  searchQuery,
  selectedFilters,
  filterStats,
  showCreateModal,
  onSearchChange,
  onFilterToggle,
  onCreateEntity,
  onEntityClick,
  onShowCreateModal,
}: EntityViewProps) {
  const { t } = useTranslation('[entity]');

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Empty state (nenhuma entidade criada)
  if (allEntities.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <EntityListHeader
          title={t('title')}
          description={t('description')}
          primaryAction={{
            label: t('new_button'),
            onClick: () => onShowCreateModal(true),
            variant: 'magical',
            size: 'lg',
            icon: Plus,
            className: 'animate-glow',
          }}
        />

        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Plus}
            title={t('empty_state.title')}
            description={t('empty_state.description')}
            actionLabel={t('empty_state.action')}
            onAction={() => onShowCreateModal(true)}
          />
        </div>

        <CreateEntityModal
          open={showCreateModal}
          onOpenChange={onShowCreateModal}
          onConfirm={onCreateEntity}
          bookId={bookId}
        />
      </div>
    );
  }

  // Lista com conteúdo
  const filterRows = createFilterRows(filterStats, t);

  return (
    <div className="flex-1 h-full flex flex-col space-y-6">
      {/* Header com filtros */}
      <EntityListHeader
        title={t('title')}
        description={t('description')}
        primaryAction={{
          label: t('new_button'),
          onClick: () => onShowCreateModal(true),
          variant: 'magical',
          icon: Plus,
        }}
      >
        <EntityFilterBadges
          totalCount={allEntities.length}
          totalLabel={t('filters.all')}
          selectedFilters={selectedFilters}
          filterRows={filterRows}
          onFilterToggle={onFilterToggle}
          onClearFilters={() => setSelectedFilters([])}
        />
      </EntityListHeader>

      {/* Busca */}
      <EntitySearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t('search_placeholder')}
      />

      {/* Grid de cards */}
      {entities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
          {entities.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              onClick={() => onEntityClick(entity.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title={t('not_found.title')}
          description={t('not_found.description')}
        />
      )}

      {/* Modais */}
      <CreateEntityModal
        open={showCreateModal}
        onOpenChange={onShowCreateModal}
        onConfirm={onCreateEntity}
        bookId={bookId}
      />
    </div>
  );
}
```

---

## Arquitetura de Detail Pages

Todas as páginas de detalhes seguem a arquitetura **Controller + View** implementada na Tab Mundo.

### Estrutura de Arquivos

```
src/pages/dashboard/tabs/[entity]/[entity]-detail/
├── index.tsx                    # Controller (lógica, estado, handlers)
├── view.tsx                     # View (apresentação, UI)
├── components/                  # Componentes específicos
│   ├── create-version-dialog.tsx
│   ├── version-card.tsx
│   └── unsaved-changes-dialog.tsx
└── types/                       # Types específicos (opcional)
```

### Responsabilidades

**Controller (index.tsx):**
- Gerenciamento de estado
- Lógica de negócio
- Handlers de eventos
- Integração com banco de dados
- Refs para estado assíncrono

**View (view.tsx):**
- Renderização de UI
- Componentes visuais
- Estrutura de layout
- Sem lógica de negócio

---

## Sistema de Visibilidade de Campos

Sistema que permite usuários ocultar/mostrar campos opcionais em detail pages, com persistência no banco de dados.

### 1. Estrutura no Banco de Dados

```sql
-- Migration em src/lib/db/index.ts
ALTER TABLE [entity_table] ADD COLUMN field_visibility TEXT;
ALTER TABLE [entity_table] ADD COLUMN section_visibility TEXT;
```

**Formato dos dados:**
- `field_visibility`: `{"biography": false, "goals": false}` (JSON string)
- `section_visibility`: `{"timeline": false}` (JSON string)
- `false` = oculto, `true` ou `undefined` = visível

### 2. Service Layer (camelCase ↔ snake_case)

```typescript
// src/lib/db/[entity].service.ts

// Interface do DB (snake_case)
interface DBEntity {
  id: string;
  name: string;
  // ... outros campos
  field_visibility: string | null;
  section_visibility: string | null;
}

// Interface da aplicação (camelCase)
interface IEntity {
  id: string;
  name: string;
  // ... outros campos
  fieldVisibility?: string;
  sectionVisibility?: string;
}

// Conversão DB → App
function dbEntityToEntity(dbEntity: DBEntity): IEntity {
  return {
    id: dbEntity.id,
    name: dbEntity.name,
    // ... outros campos
    fieldVisibility: dbEntity.field_visibility,
    sectionVisibility: dbEntity.section_visibility,
  };
}

// Conversão App → DB
function entityToDBEntity(entity: IEntity): DBEntity {
  return {
    id: entity.id,
    name: entity.name,
    // ... outros campos
    field_visibility: entity.fieldVisibility || null,
    section_visibility: entity.sectionVisibility || null,
  };
}
```

### 3. Controller - Gerenciamento de Estado

```typescript
// src/pages/dashboard/tabs/[entity]/[entity]-detail/index.tsx
import {
  type IFieldVisibility,
  type ISectionVisibility,
  toggleFieldVisibility,
  toggleSectionVisibility,
} from '@/components/detail-page';
import { safeJsonParse } from '@/lib/utils/json-parse';

export function EntityDetail() {
  // Estados
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [sectionVisibility, setSectionVisibility] = useState<ISectionVisibility>({});

  // Refs para acesso ao estado mais recente (importante para handlers assíncronos)
  const fieldVisibilityRef = useRef<IFieldVisibility>({});
  const sectionVisibilityRef = useRef<ISectionVisibility>({});

  // Sincronizar refs com estados
  useEffect(() => {
    fieldVisibilityRef.current = fieldVisibility;
  }, [fieldVisibility]);

  useEffect(() => {
    sectionVisibilityRef.current = sectionVisibility;
  }, [sectionVisibility]);

  // Carregar do banco ao montar ou trocar versão
  useEffect(() => {
    const loadEntity = async () => {
      const entity = await getEntityById(entityId);

      // Parse com fallback para objeto vazio
      const loadedFieldVisibility = safeJsonParse<IFieldVisibility>(
        entity.fieldVisibility,
        {}
      );
      const loadedSectionVisibility = safeJsonParse<ISectionVisibility>(
        entity.sectionVisibility,
        {}
      );

      setFieldVisibility(loadedFieldVisibility);
      setSectionVisibility(loadedSectionVisibility);
    };

    loadEntity();
  }, [entityId, currentVersion?.id]);

  // Handlers
  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => toggleFieldVisibility(fieldName, prev));
  }, []);

  const handleSectionVisibilityToggle = useCallback((sectionName: string) => {
    setSectionVisibility((prev) => toggleSectionVisibility(sectionName, prev));
  }, []);

  // Salvar no banco (usar refs para pegar estado mais recente!)
  const handleSave = async () => {
    const currentFieldVisibility = fieldVisibilityRef.current;
    const currentSectionVisibility = sectionVisibilityRef.current;

    await updateEntity(entityId, {
      // ... outros campos
      fieldVisibility: JSON.stringify(currentFieldVisibility),
      sectionVisibility: JSON.stringify(currentSectionVisibility),
    });
  };

  return (
    <EntityDetailView
      // ... outras props
      fieldVisibility={fieldVisibility}
      sectionVisibility={sectionVisibility}
      onFieldVisibilityToggle={handleFieldVisibilityToggle}
      onSectionVisibilityToggle={handleSectionVisibilityToggle}
    />
  );
}
```

### 4. View - Renderização

```tsx
// src/pages/dashboard/tabs/[entity]/[entity]-detail/view.tsx
import {
  FieldWithVisibilityToggle,
  hasVisibleFields,
  isSectionVisible,
} from '@/components/detail-page';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function EntityDetailView({
  // ... outras props
  fieldVisibility,
  sectionVisibility,
  onFieldVisibilityToggle,
  onSectionVisibilityToggle,
  isEditing,
}) {
  // Lista de campos da seção avançada
  const advancedFields = ['biography', 'personality', 'goals', 'fears'];

  // Verificar se deve mostrar seção
  const hasVisibleAdvancedFields = hasVisibleFields(advancedFields, fieldVisibility);

  return (
    <div>
      {/* Seção Básica - Campos obrigatórios */}
      <BasicInfoSection title="Informações Básicas">
        <div>
          <Label>Nome *</Label>
          {isEditing ? (
            <FormInput value={editData.name} onChange={...} />
          ) : (
            <p>{entity.name}</p>
          )}
        </div>
      </BasicInfoSection>

      {/* Seção Avançada - Campos opcionais com visibilidade */}
      {(!isEditing && !hasVisibleAdvancedFields) ? null : (
        <AdvancedInfoSection
          title="Informações Avançadas"
          isOpen={advancedSectionOpen}
          onToggle={onAdvancedSectionToggle}
        >
          {/* Campo opcional com toggle de visibilidade */}
          <FieldWithVisibilityToggle
            fieldName="biography"
            label="Biografia"
            isOptional={true}
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <FormTextarea
                value={editData.biography || ""}
                onChange={(e) => onEditDataChange("biography", e.target.value)}
                placeholder="Escreva a biografia..."
                showLabel={false} // Label já está no FieldWithVisibilityToggle
              />
            ) : (
              entity.biography ? (
                <p className="text-sm text-foreground">{entity.biography}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Não especificado</p>
              )
            )}
          </FieldWithVisibilityToggle>

          {/* Campo obrigatório (não pode ser ocultado) */}
          <FieldWithVisibilityToggle
            fieldName="type"
            label="Tipo"
            isOptional={false} // Sem botão de toggle
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <FormSelect value={editData.type} onChange={...} />
            ) : (
              <Badge>{entity.type}</Badge>
            )}
          </FieldWithVisibilityToggle>
        </AdvancedInfoSection>
      )}

      {/* Seção especial (Timeline) com toggle */}
      {isSectionVisible('timeline', sectionVisibility) && (
        <Card>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full">
                <CardTitle>Linha do Tempo</CardTitle>
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSectionVisibilityToggle('timeline');
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {isSectionVisible('timeline', sectionVisibility) ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isSectionVisible('timeline', sectionVisibility)
                            ? 'Ocultar seção'
                            : 'Mostrar seção'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
            </CollapsibleTrigger>
          </CardHeader>
          <CardContent>
            <Timeline data={timeline} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Regras do Sistema de Visibilidade

1. **Campos obrigatórios** (`isOptional={false}`) NÃO podem ser ocultados
2. **Campos opcionais** (`isOptional={true}`) podem ser ocultados pelo usuário
3. **Modo VIEW:** Campos ocultos são completamente removidos (return null)
4. **Modo EDIT:** Campos ocultos são mostrados com opacidade reduzida e borda tracejada
5. **Seções avançadas:** Se TODOS os campos forem ocultados, a seção inteira é ocultada no modo VIEW
6. **Seções especiais** (Timeline, Map): Podem ser ocultadas por inteiro com `isSectionVisible`

---

## Formulários com React Hook Form + Zod

Padrão obrigatório para todos os modais e formulários complexos.

### Por que React Hook Form + Zod?

1. **Validação type-safe** - Zod garante tipos consistentes
2. **Performance** - Uncontrolled components, re-renders mínimos
3. **Validação inline** - Erros aparecem enquanto digita
4. **Menos código** - Menos boilerplate que validação manual
5. **Integração perfeita** - shadcn/ui Form components já suportam RHF

### Estrutura de um Modal com RHF + Zod

```tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  FormInput,
  FormTextarea,
  FormSelectGrid,
  FormListInput,
  FormEntityMultiSelectAuto,
  FormImageUpload,
} from '@/components/forms';

// 1. Schema Zod
const entityFormSchema = z.object({
  // Campos básicos
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  type: z.enum(['type1', 'type2', 'type3']),
  image: z.string().optional(),

  // Arrays
  tags: z.array(z.string()).optional(),
  relatedCharacters: z.array(z.string()).optional(),
});

// 2. Inferir tipo do schema
type EntityFormValues = z.infer<typeof entityFormSchema>;

// 3. Componente
export function CreateEntityModal({ open, onOpenChange, onConfirm, bookId }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // 4. Force refresh quando modal abre
  useEffect(() => {
    if (open) {
      setRefreshKey(prev => prev + 1);
    }
  }, [open]);

  // 5. Setup do formulário
  const form = useForm<EntityFormValues>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'type1',
      image: '',
      tags: [],
      relatedCharacters: [],
    },
  });

  // 6. Submit handler
  const onSubmit = async (data: EntityFormValues) => {
    await onConfirm(data);
    form.reset(); // Limpa o formulário
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Entidade</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo de texto */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Nome
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <FormInput
                      {...field}
                      placeholder="Digite o nome..."
                      maxLength={200}
                      showLabel={false}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Multi-select de entidades com refreshKey */}
            <FormField
              control={form.control}
              name="relatedCharacters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Personagens Relacionados</FormLabel>
                  <FormControl>
                    <FormEntityMultiSelectAuto
                      key={`related-characters-${refreshKey}`}
                      entityType="character"
                      bookId={bookId}
                      label=""
                      placeholder="Selecione personagens..."
                      value={field.value || []}
                      onChange={field.onChange}
                      showLabel={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="magical">
                Criar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### Validações Comuns com Zod

```typescript
// String obrigatório
name: z.string().min(1, 'Campo obrigatório')

// String com tamanho máximo
description: z.string().max(500, 'Máximo 500 caracteres')

// String opcional
notes: z.string().optional()

// Enum (seleção única)
type: z.enum(['type1', 'type2', 'type3'])

// Array de strings
tags: z.array(z.string())

// Array opcional
characteristics: z.array(z.string()).optional()

// Número
age: z.number().int().min(0).max(1000)

// Email
email: z.string().email('Email inválido')

// URL
website: z.string().url('URL inválida').optional()

// Booleano
isActive: z.boolean()

// Validação customizada
password: z.string().refine(
  (val) => val.length >= 8,
  'Senha deve ter pelo menos 8 caracteres'
)

// Validação condicional
z.object({
  hasCustomSeason: z.boolean(),
  customSeasonName: z.string().optional(),
}).refine(
  (data) => !data.hasCustomSeason || data.customSeasonName,
  {
    message: 'Nome customizado é obrigatório',
    path: ['customSeasonName'],
  }
)
```

---

## Padrão refreshKey

Pattern para forçar re-mount de `FormEntityMultiSelectAuto` quando modal abre ou modo de edição é ativado.

### Por que usar?

`FormEntityMultiSelectAuto` carrega dados do banco de dados ao montar. Para garantir que sempre tenha dados atualizados (ex: quando usuário cria nova entidade e abre o modal novamente), precisamos forçar re-mount.

### Implementação

```typescript
// Em modais
export function CreateEntityModal({ open, onOpenChange, bookId }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Incrementar quando modal abre
  useEffect(() => {
    if (open) {
      setRefreshKey(prev => prev + 1);
    }
  }, [open]);

  return (
    <FormEntityMultiSelectAuto
      key={`entity-name-${refreshKey}`} // Key única força re-mount
      entityType="character"
      bookId={bookId}
      // ... outras props
    />
  );
}

// Em páginas de detalhes
export function EntityDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Incrementar quando entra em modo de edição
  useEffect(() => {
    if (isEditing) {
      setRefreshKey(prev => prev + 1);
    }
  }, [isEditing]);

  return (
    <EntityDetailView
      refreshKey={refreshKey}
      // ... outras props
    />
  );
}

// Na view
<FormEntityMultiSelectAuto
  key={`entity-name-${refreshKey}`}
  // ... props
/>
```

**Regra de nomenclatura da key:**
```typescript
key={`${descriptiveName}-${refreshKey}`}
// Exemplos:
key={`resident-characters-${refreshKey}`}
key={`dominant-factions-${refreshKey}`}
key={`related-items-${refreshKey}`}
```

---

## Integração com Banco de Dados

Padrão de conversão camelCase ↔ snake_case entre aplicação e banco de dados.

### Convenções de Nomenclatura

- **Aplicação (TypeScript):** `camelCase`
- **Banco de Dados (SQL):** `snake_case`

### Service Layer Pattern

```typescript
// src/lib/db/[entity].service.ts

// 1. Interface do Banco de Dados (snake_case)
interface DBEntity {
  id: string;
  book_id: string;
  name: string;
  created_at: number;
  updated_at: number;
  parent_id: string | null;
  related_characters: string | null; // JSON array
  field_visibility: string | null;   // JSON object
  section_visibility: string | null; // JSON object
}

// 2. Interface da Aplicação (camelCase)
export interface IEntity {
  id: string;
  bookId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  parentId: string | null;
  relatedCharacters?: string;  // JSON string
  fieldVisibility?: string;    // JSON string
  sectionVisibility?: string;  // JSON string
}

// 3. Conversão DB → App
function dbEntityToEntity(dbEntity: DBEntity): IEntity {
  return {
    id: dbEntity.id,
    bookId: dbEntity.book_id,
    name: dbEntity.name,
    createdAt: dbEntity.created_at,
    updatedAt: dbEntity.updated_at,
    parentId: dbEntity.parent_id,
    relatedCharacters: dbEntity.related_characters,
    fieldVisibility: dbEntity.field_visibility,
    sectionVisibility: dbEntity.section_visibility,
  };
}

// 4. Conversão App → DB
function entityToDBEntity(entity: IEntity): DBEntity {
  return {
    id: entity.id,
    book_id: entity.bookId,
    name: entity.name,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
    parent_id: entity.parentId,
    related_characters: entity.relatedCharacters || null,
    field_visibility: entity.fieldVisibility || null,
    section_visibility: entity.sectionVisibility || null,
  };
}

// 5. Funções CRUD
export async function getEntityById(id: string): Promise<IEntity | null> {
  const db = await initDatabase();
  const row = db.exec(`SELECT * FROM entities WHERE id = ?`, [id])[0];

  if (!row || !row.values.length) return null;

  const dbEntity = rowToDBEntity(row);
  return dbEntityToEntity(dbEntity);
}

export async function updateEntity(
  id: string,
  updates: Partial<IEntity>
): Promise<void> {
  const db = await initDatabase();
  const dbUpdates = entityToDBEntity(updates as IEntity);

  const setClauses = Object.keys(dbUpdates)
    .filter(key => key !== 'id')
    .map(key => `${key} = ?`)
    .join(', ');

  const values = Object.keys(dbUpdates)
    .filter(key => key !== 'id')
    .map(key => dbUpdates[key as keyof DBEntity]);

  await db.exec(
    `UPDATE entities SET ${setClauses}, updated_at = ? WHERE id = ?`,
    [...values, Date.now(), id]
  );
}
```

### Migrations

```typescript
// src/lib/db/index.ts
const migrations = [
  // V1: Tabela inicial
  `
    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `,

  // V2: Adicionar campo parent_id
  `ALTER TABLE entities ADD COLUMN parent_id TEXT`,

  // V3: Adicionar campos de visibilidade
  `
    ALTER TABLE entities ADD COLUMN field_visibility TEXT;
    ALTER TABLE entities ADD COLUMN section_visibility TEXT;
  `,
];
```

---

## Routing com TanStack Router

O projeto usa **TanStack Router** (file-based routing) para gerenciar rotas.

### Estrutura de Rotas

```
src/routes/
├── dashboard/
│   └── $dashboardId/
│       └── tabs/
│           ├── [entity]/
│           │   ├── index.tsx              # List Page Route
│           │   └── $entityId.tsx           # Detail Page Route
│           └── [entity]-[subpage]/
│               └── $entityId.tsx           # Subpage Route (ex: map)
```

### Exemplo: Rotas da Tab Mundo

```
src/routes/dashboard/$dashboardId/tabs/
├── world/
│   ├── index.tsx                          # /dashboard/{id}/tabs/world
│   ├── $regionId.tsx                      # /dashboard/{id}/tabs/world/{regionId}
│   └── $regionId/
│       └── map.tsx                        # /dashboard/{id}/tabs/world/{regionId}/map
```

### Route Pattern: List Page

```typescript
// src/routes/dashboard/$dashboardId/tabs/[entity]/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { EntityTab } from '@/pages/dashboard/tabs/[entity]';

export const Route = createFileRoute('/dashboard/$dashboardId/tabs/[entity]/')({
  component: () => {
    const { dashboardId } = Route.useParams();
    return <EntityTab bookId={dashboardId} />;
  },
});
```

### Route Pattern: Detail Page

```typescript
// src/routes/dashboard/$dashboardId/tabs/[entity]/$entityId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { EntityDetail } from '@/pages/dashboard/tabs/[entity]/[entity]-detail';

// Optional: Search params para versões
type EntityDetailSearch = {
  versionId?: string;
};

export const Route = createFileRoute('/dashboard/$dashboardId/tabs/[entity]/$entityId')({
  component: () => {
    const { dashboardId, entityId } = Route.useParams();
    const search = Route.useSearch() as EntityDetailSearch;

    return <EntityDetail />;
  },
  validateSearch: (search: Record<string, unknown>): EntityDetailSearch => {
    return {
      versionId: search.versionId as string | undefined,
    };
  },
});
```

### Navegação

```typescript
import { useNavigate } from '@tanstack/react-router';

function MyComponent() {
  const navigate = useNavigate();

  // Navegar para detail page
  const goToDetail = (entityId: string) => {
    navigate({
      to: '/dashboard/$dashboardId/tabs/[entity]/$entityId',
      params: { dashboardId: bookId, entityId },
    });
  };

  // Navegar com search params (versão)
  const goToVersion = (entityId: string, versionId: string) => {
    navigate({
      to: '/dashboard/$dashboardId/tabs/[entity]/$entityId',
      params: { dashboardId: bookId, entityId },
      search: { versionId },
    });
  };

  // Voltar para list page
  const goToList = () => {
    navigate({
      to: '/dashboard/$dashboardId/tabs/[entity]',
      params: { dashboardId: bookId },
    });
  };
}
```

### Acessar Params e Search

```typescript
import { useParams, useSearch } from '@tanstack/react-router';

function EntityDetail() {
  // Params da URL
  const { dashboardId, entityId } = useParams({
    from: '/dashboard/$dashboardId/tabs/[entity]/$entityId',
  });

  // Search params
  const search = useSearch({ strict: false });
  const versionId = (search as { versionId?: string })?.versionId;

  // Usar params
  useEffect(() => {
    loadEntity(entityId, versionId);
  }, [entityId, versionId]);
}
```

---

## Checklists de Implementação

### ✅ Checklist: Nova Tab Completa

1. **Estrutura de Arquivos**
   - [ ] Criar pasta `src/pages/dashboard/tabs/[entity]/`
   - [ ] Criar `index.tsx` (List Controller)
   - [ ] Criar `view.tsx` (List View)
   - [ ] Criar pasta `types/` e arquivo `[entity]-types.ts`
   - [ ] Criar pasta `helpers/` (se precisar filtros)
   - [ ] Criar pasta `components/` para card e dialogs
   - [ ] Criar pasta `[entity]-detail/` com index.tsx e view.tsx

2. **Banco de Dados**
   - [ ] Criar migration em `src/lib/db/index.ts`
   - [ ] Criar service em `src/lib/db/[entity].service.ts`
   - [ ] Definir `DBEntity` (snake_case) e `IEntity` (camelCase)
   - [ ] Implementar conversões `dbEntityToEntity` e `entityToDBEntity`
   - [ ] Implementar funções CRUD

3. **Types**
   - [ ] Definir `IEntity` interface
   - [ ] Definir `IEntityFormData` para modal
   - [ ] Definir enums se necessário (ex: `EntityType`)
   - [ ] Importar `IFieldVisibility` e `ISectionVisibility`

4. **Routing**
   - [ ] Criar `src/routes/dashboard/$dashboardId/tabs/[entity]/index.tsx` (List route)
   - [ ] Criar `src/routes/dashboard/$dashboardId/tabs/[entity]/$entityId.tsx` (Detail route)
   - [ ] Configurar params e search validation

5. **List Page (Controller + View)**
   - [ ] Implementar estados (entities, loading, search, filters)
   - [ ] Implementar `loadEntities` com useCallback
   - [ ] Implementar filtros com useMemo
   - [ ] Implementar handlers (create, click, filter)
   - [ ] View com EntityListHeader, EntitySearchBar, EntityFilterBadges
   - [ ] Grid de cards com estados empty/loading/conteúdo

6. **Detail Page (Controller + View)**
   - [ ] Ver "Checklist: Nova Detail Page" abaixo

7. **Componentes**
   - [ ] Criar EntityCard para listagem
   - [ ] Criar CreateEntityModal com RHF + Zod
   - [ ] Criar DeleteConfirmationDialog
   - [ ] Criar componentes específicos da entidade

8. **Tradução (i18n)**
   - [ ] Criar `locales/pt/[entity].json`
   - [ ] Criar `locales/en/[entity].json`
   - [ ] Adicionar keys de tradução (title, description, filters, etc.)

### ✅ Checklist: Nova Detail Page

1. **Banco de Dados**
   - [ ] Criar tabela com convenção `snake_case`
   - [ ] Adicionar colunas `field_visibility` e `section_visibility` (TEXT, nullable)
   - [ ] Criar migration em `src/lib/db/index.ts`

2. **Service Layer**
   - [ ] Criar `src/lib/db/[entity].service.ts`
   - [ ] Definir `DBEntity` interface (snake_case)
   - [ ] Definir `IEntity` interface exportada (camelCase)
   - [ ] Implementar `dbEntityToEntity` e `entityToDBEntity`
   - [ ] Implementar funções CRUD

3. **Types**
   - [ ] Criar `src/pages/dashboard/tabs/[entity]/types/[entity]-types.ts`
   - [ ] Importar `IFieldVisibility` e `ISectionVisibility` de `@/components/detail-page`

4. **Controller (index.tsx)**
   - [ ] Estados: `fieldVisibility`, `sectionVisibility`
   - [ ] Refs: `fieldVisibilityRef`, `sectionVisibilityRef`
   - [ ] useEffect para sincronizar refs
   - [ ] useEffect para carregar do DB com `safeJsonParse`
   - [ ] Handlers: `handleFieldVisibilityToggle`, `handleSectionVisibilityToggle`
   - [ ] Salvar no banco com `JSON.stringify` usando refs

5. **View (view.tsx)**
   - [ ] Importar `FieldWithVisibilityToggle`, `hasVisibleFields`, `isSectionVisible`
   - [ ] Importar `Tooltip`, `TooltipContent`, `TooltipTrigger`
   - [ ] Definir lista de `advancedFields`
   - [ ] Envolver campos opcionais com `FieldWithVisibilityToggle`
   - [ ] Usar `hasVisibleFields` para ocultar seção avançada inteira
   - [ ] Usar `isSectionVisible` para seções especiais
   - [ ] Adicionar Tooltip nos botões de toggle de seção

6. **Modal de Criação**
   - [ ] Usar React Hook Form + Zod
   - [ ] Implementar refreshKey pattern
   - [ ] Usar `FormField` para todos os campos
   - [ ] Definir schema Zod completo

### ✅ Checklist: Novo Modal/Formulário

1. **Setup Básico**
   - [ ] Importar `useForm`, `zodResolver`, `z`
   - [ ] Importar shadcn/ui Form components
   - [ ] Importar form components de `@/components/forms`

2. **Schema Zod**
   - [ ] Definir schema completo
   - [ ] Usar `z.infer<>` para type
   - [ ] Validações: `.min()`, `.max()`, `.optional()`, `.enum()`, `.array()`

3. **Estado e Refs**
   - [ ] `refreshKey` state
   - [ ] useEffect para incrementar refreshKey quando modal abre

4. **Form Setup**
   - [ ] `useForm` com `zodResolver`
   - [ ] `defaultValues` completo
   - [ ] `onSubmit` handler com `form.reset()`

5. **Renderização**
   - [ ] `<Form {...form}>`
   - [ ] `form.handleSubmit(onSubmit)`
   - [ ] `<FormField>` para cada campo
   - [ ] Key única em `FormEntityMultiSelectAuto`
   - [ ] `showLabel={false}` quando label já está no FormLabel

---

## Snippets Reutilizáveis

### Sistema de Visibilidade - Controller

```typescript
// Estados
const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
const [sectionVisibility, setSectionVisibility] = useState<ISectionVisibility>({});

// Refs
const fieldVisibilityRef = useRef<IFieldVisibility>({});
const sectionVisibilityRef = useRef<ISectionVisibility>({});

// Sincronizar refs
useEffect(() => {
  fieldVisibilityRef.current = fieldVisibility;
}, [fieldVisibility]);

useEffect(() => {
  sectionVisibilityRef.current = sectionVisibility;
}, [sectionVisibility]);

// Handlers
const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
  setFieldVisibility((prev) => toggleFieldVisibility(fieldName, prev));
}, []);

const handleSectionVisibilityToggle = useCallback((sectionName: string) => {
  setSectionVisibility((prev) => toggleSectionVisibility(sectionName, prev));
}, []);

// Salvar (usar refs!)
fieldVisibility: JSON.stringify(fieldVisibilityRef.current),
sectionVisibility: JSON.stringify(sectionVisibilityRef.current),
```

### refreshKey Pattern

```typescript
const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
  if (open) {
    setRefreshKey(prev => prev + 1);
  }
}, [open]);

<FormEntityMultiSelectAuto
  key={`entity-name-${refreshKey}`}
  // ... props
/>
```

### React Hook Form Pattern

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-primary">
        Label
        <span className="text-destructive ml-1">*</span>
      </FormLabel>
      <FormControl>
        <FormInput {...field} showLabel={false} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Referências de Implementação

**Referência Completa:** Tab Mundo
- Controller: `src/pages/dashboard/tabs/world/region-detail/index.tsx`
- View: `src/pages/dashboard/tabs/world/region-detail/view.tsx`
- Modal: `src/components/modals/create-region-modal.tsx`
- Service: `src/lib/db/regions.service.ts`
- Types: `src/pages/dashboard/tabs/world/types/region-types.ts`

**Helpers:**
- Visibility: `src/components/detail-page/visibility-helpers.ts`
- JSON Parse: `src/lib/utils/json-parse.ts`

**Componentes:**
- Detail Page: `src/components/detail-page/`
- Forms: `src/components/forms/`

---

**Última atualização:** 2025-11-14
**Baseado em:** Tab Mundo (Regions)
