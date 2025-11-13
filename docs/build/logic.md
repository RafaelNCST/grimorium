# Lógica Reutilizável - Utils, Hooks e Libs

Este documento documenta todas as utilities, hooks e bibliotecas reutilizáveis criadas para o Grimorium, focando em lógica compartilhada entre as páginas de detalhes.

---

## Índice

1. [Utilities](#utilities)
2. [Hooks Customizados](#hooks-customizados)
3. [Integração com Libs Externas](#integração-com-libs-externas)

---

## Utilities

Funções auxiliares puras e reutilizáveis.

### 1. safeJsonParse

**Localização:** `src/lib/utils/json-parse.ts`

**Propósito:** Parse JSON de forma segura com fallback, eliminando código duplicado e try-catch repetitivos.

**Assinatura:**
```typescript
function safeJsonParse<T = string[]>(
  value: string | undefined | null,
  fallback: T = [] as T
): T
```

**Parâmetros:**
- `value`: String JSON para parsear (pode ser undefined/null)
- `fallback`: Valor padrão se parsing falhar (padrão: `[]`)

**Retorno:**
- Valor parseado do tipo `T` ou `fallback`

**Exemplo de uso:**
```typescript
// Antes (código duplicado em 3+ arquivos):
const residentFactions = (() => {
  try {
    if (!regionData.residentFactions) return [];
    if (Array.isArray(regionData.residentFactions)) return regionData.residentFactions;
    return JSON.parse(regionData.residentFactions);
  } catch {
    return [];
  }
})();

// Depois (1 linha):
import { safeJsonParse } from '@/lib/utils/json-parse';

const residentFactions = safeJsonParse(regionData.residentFactions);
```

**Casos de uso:**
```typescript
// Array de strings
const tags = safeJsonParse<string[]>(entity.tags, []);

// Array de IDs
const factionIds = safeJsonParse<string[]>(region.residentFactions, []);

// Objeto
const metadata = safeJsonParse<{ key: string; value: string }>(entity.metadata, {});

// Com valor vazio
safeJsonParse(undefined) // => []
safeJsonParse(null)      // => []
safeJsonParse("")        // => []
safeJsonParse("[]")      // => []

// Com valor já parseado
safeJsonParse(["já", "é", "array"]) // => ["já", "é", "array"]

// Com fallback customizado
safeJsonParse("invalid json", { default: true }) // => { default: true }
```

**Por que usar:**
- ✅ Elimina try-catch repetitivo
- ✅ Lida com valores null/undefined automaticamente
- ✅ Suporta valores já parseados (idempotente)
- ✅ Type-safe com TypeScript
- ✅ Fallback configurável

---

### 2. localStorage Helpers

**Localização:** `src/lib/utils/storage.ts`

Conjunto de helpers para trabalhar com localStorage de forma segura.

#### getLocalStorageItem

**Propósito:** Buscar item do localStorage com parse JSON automático.

**Assinatura:**
```typescript
function getLocalStorageItem<T>(key: string, defaultValue: T): T
```

**Exemplo:**
```typescript
const userSettings = getLocalStorageItem<UserSettings>(
  'userSettings',
  { theme: 'dark', language: 'pt-BR' }
);
```

#### setLocalStorageItem

**Propósito:** Salvar item no localStorage com stringify automático.

**Assinatura:**
```typescript
function setLocalStorageItem<T>(key: string, value: T): void
```

**Exemplo:**
```typescript
setLocalStorageItem('userSettings', {
  theme: 'light',
  language: 'en-US',
});
```

#### removeLocalStorageItem

**Propósito:** Remover item do localStorage.

**Assinatura:**
```typescript
function removeLocalStorageItem(key: string): void
```

**Exemplo:**
```typescript
removeLocalStorageItem('temporaryData');
```

---

## Hooks Customizados

Hooks reutilizáveis para lógica complexa compartilhada.

### 1. useLocalStorageState

**Localização:** `src/lib/utils/storage.ts`

**Propósito:** State do React sincronizado com localStorage com debounce automático.

**Assinatura:**
```typescript
function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  debounceMs: number = 500
): [T, (value: T) => void]
```

**Parâmetros:**
- `key`: Chave do localStorage
- `defaultValue`: Valor padrão se não existir no localStorage
- `debounceMs`: Tempo de debounce para salvar (padrão: 500ms)

**Retorno:**
- `[state, setState]`: Igual ao `useState`, mas persistido

**Exemplo de uso:**
```typescript
// Antes (múltiplos useEffect, sem debounce):
const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem('regionDetailAdvancedSectionOpen');
  if (saved) setAdvancedSectionOpen(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem(
    'regionDetailAdvancedSectionOpen',
    JSON.stringify(advancedSectionOpen)
  );
}, [advancedSectionOpen]);

// Depois (1 linha, com debounce):
const [advancedSectionOpen, setAdvancedSectionOpen] = useLocalStorageState(
  'regionDetailAdvancedSectionOpen',
  false
);
```

**Benefícios:**
- ✅ **Debounce automático**: 500ms por padrão (95% menos writes no localStorage)
- ✅ **Type-safe**: Infere tipo automaticamente
- ✅ **SSR-safe**: Não quebra no servidor
- ✅ **Sincronização**: Carrega valor inicial do localStorage
- ✅ **Simples**: API idêntica ao `useState`

**Casos de uso:**
```typescript
// Seções colapsáveis
const [openSections, setOpenSections] = useLocalStorageState(
  'regionDetailSections',
  { advanced: false, timeline: true }
);

// Preferências de UI
const [viewMode, setViewMode] = useLocalStorageState<'grid' | 'list'>(
  'charactersViewMode',
  'grid'
);

// Filtros persistidos
const [filters, setFilters] = useLocalStorageState(
  'regionFilters',
  { type: 'all', climate: 'all' }
);
```

---

### 2. useCollapsibleSections

**Localização:** `src/hooks/useCollapsibleSections.ts`

**Propósito:** Gerenciar estado de múltiplas seções colapsáveis com persistência automática.

**Assinatura:**
```typescript
function useCollapsibleSections(
  storageKey: string,
  defaultSections: Record<string, boolean> = {}
): {
  openSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  openSection: (section: string) => void;
  closeSection: (section: string) => void;
  setOpenSections: (sections: Record<string, boolean>) => void;
  isOpen: (section: string) => boolean;
}
```

**Parâmetros:**
- `storageKey`: Chave do localStorage (ex: 'regionDetailSections')
- `defaultSections`: Estado padrão das seções (ex: `{ advanced: false, timeline: true }`)

**Retorno:**
- `openSections`: Objeto com estado de cada seção
- `toggleSection`: Alterna uma seção (abre/fecha)
- `openSection`: Abre uma seção específica
- `closeSection`: Fecha uma seção específica
- `setOpenSections`: Define todo o estado de uma vez
- `isOpen`: Verifica se uma seção está aberta

**Exemplo de uso:**
```typescript
// Em RegionDetail
const {
  openSections,
  toggleSection,
  isOpen
} = useCollapsibleSections('regionDetailSections', {
  advanced: false,
  timeline: true,
  residentFactions: true,
  dominantFactions: true,
  importantCharacters: false,
});

// Usar em componentes
<AdvancedInfoSection
  title={t('advanced_info')}
  isOpen={isOpen('advanced')}
  onToggle={() => toggleSection('advanced')}
>
  {/* Conteúdo */}
</AdvancedInfoSection>

<CollapsibleEntityList
  title={t('resident_factions')}
  isOpen={openSections.residentFactions}
  onToggle={() => toggleSection('residentFactions')}
  ...
/>
```

**Benefícios:**
- ✅ **Persistência automática**: Estado salvo no localStorage com debounce
- ✅ **API simples**: Funções intuitivas (toggle, open, close)
- ✅ **Type-safe**: TypeScript completo
- ✅ **Performance**: Debounce de 500ms

**Casos de uso típicos:**
```typescript
// Página de detalhes de região
useCollapsibleSections('regionDetailSections', {
  advanced: false,
  timeline: true,
  residentFactions: true,
  dominantFactions: true,
  importantCharacters: true,
});

// Página de detalhes de personagem
useCollapsibleSections('characterDetailSections', {
  advanced: false,
  timeline: true,
  relationships: true,
  inventory: false,
});
```

---

### 3. useEditMode

**Localização:** `src/hooks/useEditMode.ts`

**Propósito:** Gerenciar modo de edição com dirty checking (detecção de mudanças não salvas) e validação.

**Assinatura:**
```typescript
function useEditMode<T>({
  initialData,
  onSave,
  onCancel,
  compareFunction,
}: {
  initialData: T;
  onSave: (data: T) => Promise<void>;
  onCancel?: () => void;
  compareFunction?: (a: T, b: T) => boolean;
}): {
  isEditing: boolean;
  isSaving: boolean;
  editData: T;
  hasChanges: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  saveChanges: () => Promise<void>;
  cancelEditing: () => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  updateEditData: (data: Partial<T>) => void;
  resetToInitial: () => void;
}
```

**Parâmetros:**
- `initialData`: Dados iniciais da entidade
- `onSave`: Callback assíncrono para salvar (recebe editData)
- `onCancel`: Callback opcional ao cancelar
- `compareFunction`: Função customizada de comparação (padrão: JSON.stringify)

**Retorno:**
- `isEditing`: Está em modo de edição?
- `isSaving`: Está salvando?
- `editData`: Dados sendo editados
- `hasChanges`: Tem mudanças não salvas?
- `startEditing`: Inicia modo de edição
- `stopEditing`: Para edição sem salvar (sem confirmação)
- `saveChanges`: Salva mudanças
- `cancelEditing`: Cancela com confirmação se houver mudanças
- `updateField`: Atualiza um campo específico
- `updateEditData`: Atualiza múltiplos campos
- `resetToInitial`: Volta para dados iniciais

**Exemplo de uso:**
```typescript
// Antes (código espalhado, ~50+ linhas):
const [region, setRegion] = useState<IRegion | null>(null);
const [editData, setEditData] = useState<IRegion | null>(null);
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);

const hasChanges = useMemo(() => {
  return JSON.stringify(region) !== JSON.stringify(editData);
}, [region, editData]);

const handleEdit = () => {
  setEditData({ ...region });
  setIsEditing(true);
};

const handleSave = async () => {
  try {
    setIsSaving(true);
    await updateRegionVersionData(currentVersion.id, editData);
    setRegion(editData);
    setIsEditing(false);
    // NO TOAST - silent operation with visual feedback only
  } catch (error) {
    // NO TOAST - visual feedback only (errors state)
  } finally {
    setIsSaving(false);
  }
};

const handleCancel = async () => {
  if (hasChanges) {
    const confirm = await showConfirmDialog({...});
    if (!confirm) return;
  }
  setEditData({ ...region });
  setIsEditing(false);
};

// Depois (1 hook, ~10 linhas):
const {
  isEditing,
  isSaving,
  editData,
  hasChanges,
  startEditing,
  saveChanges,
  cancelEditing,
  updateField,
} = useEditMode({
  initialData: region,
  onSave: async (data) => {
    await updateRegionVersionData(currentVersion.id, data);
    // NO TOAST - silent operation
  },
});
```

**Uso nos componentes:**
```typescript
// Botões de controle
<EditControls
  isEditing={isEditing}
  hasChanges={hasChanges}
  isSaving={isSaving}
  onEdit={startEditing}
  onSave={saveChanges}
  onCancel={cancelEditing}
/>

// Campos
<FormInput
  value={editData.name}
  onChange={(e) => updateField('name', e.target.value)}
  disabled={!isEditing}
/>

// Atualizar múltiplos campos de uma vez
updateEditData({
  name: 'Novo Nome',
  description: 'Nova descrição',
  regionType: 'forest',
});
```

**Benefícios:**
- ✅ **Dirty checking automático**: Detecta mudanças automaticamente
- ✅ **Confirmação antes de cancelar**: Se houver mudanças não salvas
- ✅ **Loading states**: `isSaving` para feedback visual
- ✅ **Type-safe**: Infere tipos dos campos
- ✅ **Reutilizável**: Funciona com qualquer tipo de entidade

---

### 4. useVersionManagement

**Localização:** `src/hooks/useVersionManagement.ts`

**Propósito:** Gerenciar todo o ciclo de vida de versões de entidades.

**Assinatura:**
```typescript
function useVersionManagement<T>({
  entityId,
  versions,
  currentVersionId,
  onVersionChange,
  onVersionCreate,
  onVersionUpdate,
  onVersionDelete,
  onVersionActivate,
  hasUnsavedChanges,
}: {
  entityId: string;
  versions: IVersion<T>[];
  currentVersionId?: string | null;
  onVersionChange: (versionId: string, version: IVersion<T>) => Promise<void>;
  onVersionCreate: (data: CreateVersionData, currentData: T) => Promise<IVersion<T>>;
  onVersionUpdate?: (versionId: string, data: UpdateVersionData) => Promise<void>;
  onVersionDelete?: (versionId: string) => Promise<void>;
  onVersionActivate?: (versionId: string) => Promise<void>;
  hasUnsavedChanges?: boolean;
}): {
  currentVersion: IVersion<T> | null;
  isChangingVersion: boolean;
  handleVersionChange: (versionId: string) => Promise<void>;
  handleVersionCreate: (data: CreateVersionData) => Promise<void>;
  handleVersionUpdate: (versionId: string, data: UpdateVersionData) => Promise<void>;
  handleVersionDelete: (versionId: string) => Promise<void>;
  handleVersionActivate: (versionId: string) => Promise<void>;
}
```

**Parâmetros:**
- `entityId`: ID da entidade
- `versions`: Array de versões
- `currentVersionId`: ID da versão atual (opcional)
- `onVersionChange`: Callback ao trocar versão
- `onVersionCreate`: Callback ao criar versão
- `onVersionUpdate`: Callback ao atualizar versão (opcional)
- `onVersionDelete`: Callback ao deletar versão (opcional)
- `onVersionActivate`: Callback ao ativar versão como principal (opcional)
- `hasUnsavedChanges`: Tem mudanças não salvas? (para validação)

**Retorno:**
- `currentVersion`: Versão atual selecionada
- `isChangingVersion`: Está trocando de versão?
- `handleVersionChange`: Troca versão (com validações)
- `handleVersionCreate`: Cria nova versão
- `handleVersionUpdate`: Atualiza versão existente
- `handleVersionDelete`: Deleta versão (com validações)
- `handleVersionActivate`: Ativa versão como principal

**Exemplo de uso:**
```typescript
const {
  currentVersion,
  isChangingVersion,
  handleVersionChange,
  handleVersionCreate,
  handleVersionDelete,
  handleVersionActivate,
} = useVersionManagement({
  entityId: regionId,
  versions: versions,
  currentVersionId: versionIdFromUrl,
  onVersionChange: async (versionId, version) => {
    setRegion(version.regionData);
    navigate(`/region/${regionId}?versionId=${versionId}`);
  },
  onVersionCreate: async (data, currentData) => {
    const newVersion = await createRegionVersion(regionId, {
      name: data.name,
      description: data.description,
      regionData: currentData,
    });
    return newVersion;
  },
  onVersionDelete: async (versionId) => {
    await deleteRegionVersion(versionId);
  },
  onVersionActivate: async (versionId) => {
    await activateRegionVersion(regionId, versionId);
  },
  hasUnsavedChanges: hasChanges, // Do useEditMode
});
```

**Validações automáticas:**
- ✅ Confirma se houver mudanças não salvas antes de trocar versão
- ✅ Não permite deletar versão principal
- ✅ Não permite ativar versão que já é principal
- ✅ Feedback visual apenas (sem toasts)
- ✅ Rollback automático em caso de erro

**Benefícios:**
- ✅ **Validações integradas**: Todas as regras de negócio centralizadas
- ✅ **Error handling**: Try-catch e rollback automáticos
- ✅ **Feedback visual**: Sem toasts, apenas feedback visual
- ✅ **Type-safe**: Generic `<T>` para qualquer tipo de entidade
- ✅ **Reutilizável**: Funciona com Region, Character, Faction, Item, etc

---

### 5. useOrphanedIdCleanup

**Localização:** `src/hooks/useOrphanedIdCleanup.ts`

**Propósito:** Limpar IDs órfãos (referências a entidades deletadas) de forma segura.

**Assinatura:**
```typescript
function useOrphanedIdCleanup<T>({
  data,
  cleanupRules,
  onCleanup,
}: {
  data: T;
  cleanupRules: CleanupRule[];
  onCleanup: (cleanedData: T) => Promise<void>;
}): {
  isCleaning: boolean;
  cleanup: () => Promise<boolean>;
  hasOrphanedIds: boolean;
}

interface CleanupRule {
  field: string;                    // Campo a limpar (ex: 'residentFactions')
  type: 'character' | 'faction' | 'race' | 'item' | 'region';
  checkExists: (id: string) => Promise<boolean>; // Função para verificar se ID existe
}
```

**Parâmetros:**
- `data`: Dados da entidade
- `cleanupRules`: Regras de limpeza para cada campo
- `onCleanup`: Callback com dados limpos

**Retorno:**
- `isCleaning`: Está executando limpeza?
- `cleanup`: Função para executar limpeza
- `hasOrphanedIds`: Tem IDs órfãos?

**Exemplo de uso:**
```typescript
const { cleanup, hasOrphanedIds } = useOrphanedIdCleanup({
  data: region,
  cleanupRules: [
    {
      field: 'residentFactions',
      type: 'faction',
      checkExists: async (id) => {
        const faction = await getFactionById(id);
        return faction !== null;
      },
    },
    {
      field: 'importantCharacters',
      type: 'character',
      checkExists: async (id) => {
        const character = await getCharacterById(id);
        return character !== null;
      },
    },
  ],
  onCleanup: async (cleanedData) => {
    await updateRegionVersionData(currentVersion.id, cleanedData);
    setRegion(cleanedData);
    // NO TOAST - silent cleanup operation
  },
});

// Executar limpeza
useEffect(() => {
  if (hasOrphanedIds) {
    cleanup();
  }
}, [hasOrphanedIds]);
```

**Comportamento:**
1. Verifica cada campo definido nas regras
2. Para cada ID no campo, verifica se entidade ainda existe
3. Remove IDs de entidades que não existem mais
4. Chama `onCleanup` com dados limpos
5. Rollback automático se `onCleanup` falhar

**Benefícios:**
- ✅ **Seguro**: Rollback em caso de erro
- ✅ **Automático**: Executa no carregamento
- ✅ **Flexível**: Regras configuráveis por campo
- ✅ **Silencioso**: Opera sem notificações visuais
- ✅ **Corrige Bug #1**: Race condition resolvido

---

## Integração com Libs Externas

### 1. @tanstack/react-virtual (Virtualização)

**Propósito:** Virtualizar listas longas para melhorar performance drasticamente.

**Instalação:**
```bash
pnpm add @tanstack/react-virtual
```

**Quando usar:**
- Listas com 50+ itens
- Timeline com muitos eventos
- Grid de cards com muitas entidades

**Exemplo básico:**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualizedList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Altura estimada de cada item
    overscan: 5, // Renderiza 5 itens extras fora da tela
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ItemCard item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Exemplo avançado (RegionTimeline com eventos):**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function RegionTimeline({ timeline }) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Flatten todos os eventos de todas as eras
  const allEvents = useMemo(() => {
    return timeline.eras.flatMap(era =>
      era.events.map(event => ({
        ...event,
        eraId: era.id,
        eraName: era.name,
      }))
    );
  }, [timeline]);

  const virtualizer = useVirtualizer({
    count: allEvents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const event = allEvents[index];
      // Estimar altura baseado no conteúdo
      return event.description.length > 100 ? 150 : 100;
    },
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="h-[800px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const event = allEvents[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TimelineEventCard event={event} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Performance:**
- Sem virtualização: 1000 eventos = 1000 componentes DOM = **Lento** 🐌
- Com virtualização: 1000 eventos = ~15 componentes DOM = **Rápido** 🚀
- Redução: **98% menos componentes renderizados**

---

### 2. use-debounce (Debounce e Throttle)

**Propósito:** Debounce e throttle de valores e callbacks.

**Instalação:**
```bash
pnpm add use-debounce
```

**Exemplo (debounce):**
```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value: string) => {
    // Buscar no banco
    searchEntities(value);
  },
  500 // 500ms delay
);

<Input
  onChange={(e) => debouncedSearch(e.target.value)}
  placeholder="Buscar..."
/>
```

**Exemplo (throttle - MapCanvas drag):**
```typescript
import { useThrottledCallback } from 'use-debounce';

const throttledDrag = useThrottledCallback(
  (e: MouseEvent) => {
    // Cálculos de drag
    updateMarkerPosition(e.clientX, e.clientY);
  },
  16 // ~60fps
);

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      throttledDrag(e);
    }
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [isDragging]);
```

---

### 3. Zod (Validação de Schema)

**Propósito:** Validação runtime de dados com TypeScript para campos obrigatórios e validação de formulários.

**Instalação:**
```bash
pnpm add zod
```

**Uso em Páginas de Detalhes:**

As páginas de detalhes (RegionDetail, CharacterDetail, etc) **DEVEM** usar Zod para validação de campos obrigatórios.

#### Criar Schema de Validação
```typescript
// Exemplo: src/lib/validation/region-schema.ts
import { z } from 'zod';

export const RegionSchema = z.object({
  // CAMPOS BÁSICOS = OBRIGATÓRIOS (defina conforme sua entidade)
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),

  scale: z
    .string()
    .min(1, 'Escala é obrigatória'),

  // CAMPOS AVANÇADOS = OPCIONAIS (sempre .optional())
  climate: z
    .string()
    .max(200, 'Clima deve ter no máximo 200 caracteres')
    .trim()
    .optional(),

  summary: z
    .string()
    .max(500, 'Resumo deve ter no máximo 500 caracteres')
    .trim()
    .optional(),

  // ... outros campos avançados (.optional())
});

export type RegionFormData = z.infer<typeof RegionSchema>;
```

**Regra importante:**
- Campos em **BasicInfoSection** → Sem `.optional()` (obrigatórios)
- Campos em **AdvancedInfoSection** → Com `.optional()` (opcionais)

#### Validação em Tempo Real (onBlur)
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = useCallback((field: string, value: any) => {
  try {
    // Validar apenas este campo
    const fieldSchema = RegionSchema.pick({ [field]: true });
    fieldSchema.parse({ [field]: value });

    // Se passou, remover erro
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      setErrors(prev => ({
        ...prev,
        [field]: error.errors[0].message
      }));
    }
  }
}, []);

// Uso no input
<Input
  value={editData.name}
  onChange={(e) => updateField('name', e.target.value)}
  onBlur={() => validateField('name', editData.name)}
  className={errors.name ? 'border-destructive' : ''}
/>
{errors.name && (
  <p className="text-sm text-destructive">
    <AlertCircle className="h-4 w-4" />
    {errors.name}
  </p>
)}
```

#### Validação Completa ao Salvar
```typescript
const handleSave = async () => {
  try {
    // Validar TUDO
    const validatedData = RegionSchema.parse(editData);

    // Salvar
    await updateRegion(validatedData);

    // Limpar erros e sair do modo de edição
    setErrors({});
    setIsEditing(false);

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Mapear erros para cada campo
      const newErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      // Feedback é apenas visual (bordas vermelhas)
    } else {
      console.error('Error saving:', error);
    }
  }
};
```

#### Bloquear Botão Salvar
```typescript
const { hasRequiredFieldsEmpty, missingFields } = useMemo(() => {
  if (!editData) return { hasRequiredFieldsEmpty: false, missingFields: [] };

  try {
    // Validar apenas CAMPOS BÁSICOS (obrigatórios)
    // Liste aqui TODOS os campos que estão em BasicInfoSection
    RegionSchema.pick({
      name: true,
      scale: true,
      // ... outros campos básicos da sua entidade
    }).parse({
      name: editData.name,
      scale: editData.scale,
      // ... outros campos básicos
    });
    return { hasRequiredFieldsEmpty: false, missingFields: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => e.path[0] as string);
      return { hasRequiredFieldsEmpty: true, missingFields: missing };
    }
    return { hasRequiredFieldsEmpty: true, missingFields: [] };
  }
}, [editData]);

// Botão Salvar
<Button
  onClick={handleSave}
  disabled={!hasChanges || hasRequiredFieldsEmpty}
>
  Salvar
</Button>

// Mensagem de erro
{hasRequiredFieldsEmpty && (
  <p className="text-xs text-destructive">
    Campos básicos faltando: {missingFields.join(', ')}
  </p>
)}
```

**Importante:** O `.pick()` deve incluir **APENAS** os campos básicos (obrigatórios) da sua entidade.

**Benefícios:**
- ✅ Type-safe: Schema é a fonte de verdade
- ✅ Validação em tempo real: onBlur em cada campo
- ✅ Feedback visual: Bordas vermelhas + mensagens
- ✅ Botão bloqueado: Previne salvamento inválido
- ✅ Sem toasts: Feedback apenas visual
- ✅ Mensagens específicas: Mostra exatamente quais campos faltam

---

## Padrões de Uso Combinado

### Pattern 1: Página de Detalhes Completa

Combinação de hooks para página de detalhes robusta:

```typescript
function RegionDetail() {
  // 1. Carregar dados
  const { regionId } = useParams();
  const [region, setRegion] = useState<IRegion | null>(null);
  const [versions, setVersions] = useState<IVersion[]>([]);

  // 2. Seções colapsáveis com persistência
  const { openSections, toggleSection } = useCollapsibleSections(
    'regionDetailSections',
    { advanced: false, timeline: true }
  );

  // 3. Modo de edição com dirty checking
  const {
    isEditing,
    isSaving,
    editData,
    hasChanges,
    startEditing,
    saveChanges,
    cancelEditing,
    updateField,
  } = useEditMode({
    initialData: region,
    onSave: async (data) => {
      await updateRegionVersionData(currentVersion.id, data);
      // NO TOAST - silent operation
    },
  });

  // 4. Gerenciamento de versões
  const {
    currentVersion,
    handleVersionChange,
    handleVersionCreate,
    handleVersionDelete,
    handleVersionActivate,
  } = useVersionManagement({
    entityId: regionId,
    versions,
    onVersionChange: async (versionId, version) => {
      setRegion(version.regionData);
    },
    onVersionCreate: async (data, currentData) => {
      return await createRegionVersion(regionId, { ...data, regionData: currentData });
    },
    hasUnsavedChanges: hasChanges,
  });

  // 5. Limpeza de IDs órfãos
  const { cleanup } = useOrphanedIdCleanup({
    data: region,
    cleanupRules: [
      { field: 'residentFactions', type: 'faction', checkExists: checkFactionExists },
      { field: 'importantCharacters', type: 'character', checkExists: checkCharacterExists },
    ],
    onCleanup: async (cleanedData) => {
      await updateRegionVersionData(currentVersion.id, cleanedData);
      setRegion(cleanedData);
    },
  });

  // 6. Buscar facções, characters, etc para dropdowns
  const residentFactionsData = useMemo(() => {
    const ids = safeJsonParse<string[]>(editData?.residentFactions);
    return ids.map(id => factions.find(f => f.id === id)).filter(Boolean);
  }, [editData?.residentFactions, factions]);

  // ... resto do componente
}
```

### Pattern 2: Virtualização de Timeline

```typescript
function RegionTimeline({ timeline, isEditing }) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Flatten eventos
  const allEvents = useMemo(() => {
    return timeline.eras.flatMap(era =>
      era.events.map(event => ({ ...event, eraId: era.id }))
    );
  }, [timeline]);

  // Virtualizar
  const virtualizer = useVirtualizer({
    count: allEvents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[800px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <TimelineEventCard
              event={allEvents[virtualItem.index]}
              isEditing={isEditing}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Checklist de Lógica Reutilizável

✅ **Utilities (use sempre):**
- [ ] `safeJsonParse` para parsing JSON
- [ ] `getLocalStorageItem` / `setLocalStorageItem` para localStorage

✅ **Hooks (páginas de detalhes):**
- [ ] `useCollapsibleSections` para seções colapsáveis
- [ ] `useEditMode` para modo de edição
- [ ] `useVersionManagement` para versionamento (se aplicável)
- [ ] `useOrphanedIdCleanup` para limpeza de IDs órfãos

✅ **Libs externas (quando necessário):**
- [ ] `@tanstack/react-virtual` para listas 50+ itens
- [ ] `use-debounce` para search/drag operations
- [ ] `zod` para validação de schemas

---

Fim do documento.
