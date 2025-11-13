# Features das Páginas de Detalhes

Este documento explica a lógica e funcionamento das 5 features principais das páginas de detalhes no Grimorium, baseado na implementação refinada do RegionDetail.

---

## 1. Menu Lateral de Navegação Rápida

### Visão Geral
Toda página de detalhes possui um menu lateral fixo que permite navegação rápida entre seções da página.

### Estrutura Visual
```
┌─────────────────────┐
│ [Version Selector]  │ ← Header (opcional)
├─────────────────────┤
│ ● Informações       │ ← Item ativo
│ ○ Linha do Tempo    │
│ ○ Mapa              │
│ ○ Relacionamentos   │
├─────────────────────┤
│ [Botão Deletar]     │ ← Footer (opcional)
└─────────────────────┘
```

### Lógica de Implementação

#### State e Navegação
```typescript
const [activeSection, setActiveSection] = useState<string>('info');

// Smooth scroll para seção
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionId);
  }
};
```

#### Estrutura de Items
```typescript
const navItems = [
  { id: 'info', label: t('information'), icon: <Info /> },
  { id: 'timeline', label: t('timeline'), icon: <Clock /> },
  { id: 'map', label: t('map'), icon: <Map /> },
  { id: 'relationships', label: t('relationships'), icon: <Users /> },
];
```

### Variações por Tipo de Entidade

| Entidade | Seções Típicas |
|----------|----------------|
| Region   | Info, Timeline, Map, Relationships |
| Character| Info, Timeline, Relationships, Inventory |
| Faction  | Info, Timeline, Members, Territories |
| Item     | Info, Timeline, Owners, Locations |

### Header e Footer
- **Header:** Normalmente contém o seletor de versões (se a entidade tiver versionamento)
- **Footer:** Botão de deletar entidade (com permissões adequadas)

### Responsividade
- Desktop: Menu lateral visível sempre
- Mobile: Menu lateral colapsável (hamburger menu)

---

## 2. Sistema de Versões

### Visão Geral
Entidades principais (Region, Character, Faction, Item) suportam versionamento para representar diferentes momentos da história.

### Conceitos Principais

#### Versão Principal (Main)
- Apenas **uma versão** pode ser principal por vez
- Representa o estado "canônico" da entidade
- Não pode ser deletada (apenas substituída por outra versão principal)

#### Versões Secundárias
- Múltiplas versões podem existir
- Úteis para diferentes períodos históricos
- Podem ser deletadas livremente

### Estrutura de Dados
```typescript
interface IVersion<T> {
  id: string;
  name: string;                    // Ex: "Era dos Dragões"
  description: string;             // Ex: "Região durante a era..."
  isMain: boolean;                 // Apenas uma pode ser true
  entityData: T;                   // Dados da entidade nesta versão
  createdAt: number;
  updatedAt: number;
}
```

### Fluxo de Uso

#### 1. Carregar Versões no Mount
```typescript
useEffect(() => {
  const loadData = async () => {
    const versions = await getRegionVersions(regionId);
    setVersions(versions);

    // Selecionar versão da URL ou main
    const versionIdFromUrl = searchParams.get('versionId');
    const selectedVersion = versionIdFromUrl
      ? versions.find(v => v.id === versionIdFromUrl)
      : versions.find(v => v.isMain);

    if (selectedVersion) {
      setCurrentVersion(selectedVersion);
      setRegion(selectedVersion.regionData);
    }
  };

  loadData();
}, [regionId]);
```

#### 2. Trocar Versão
```typescript
const handleVersionChange = async (versionId: string) => {
  // 1. Verificar mudanças não salvas
  if (hasChanges) {
    const confirm = await showConfirmDialog({
      title: t('unsaved_changes'),
      description: t('unsaved_changes_warning'),
    });
    if (!confirm) return;
  }

  // 2. Buscar versão
  const version = versions.find(v => v.id === versionId);
  if (!version) return;

  // 3. Atualizar state
  setCurrentVersion(version);
  setRegion(version.regionData);

  // 4. Atualizar URL
  navigate(`/region/${regionId}?versionId=${versionId}`);
};
```

#### 3. Criar Nova Versão
```typescript
const handleCreateVersion = async (data: { name: string; description: string }) => {
  // 1. Criar versão com dados atuais
  const newVersion = await createRegionVersion(regionId, {
    name: data.name,
    description: data.description,
    regionData: currentRegion, // Dados atuais como base
    isMain: false,
  });

  // 2. Adicionar ao state
  setVersions(prev => [...prev, newVersion]);

  // 3. Trocar para nova versão
  setCurrentVersion(newVersion);

  // 4. NO TOAST - silent operation
};
```

#### 4. Ativar Versão como Principal
```typescript
const handleActivateVersion = async (versionId: string) => {
  // 1. Atualizar no banco
  await activateRegionVersion(regionId, versionId);

  // 2. Atualizar state (desativa antiga, ativa nova)
  setVersions(prev => prev.map(v => ({
    ...v,
    isMain: v.id === versionId
  })));

  // 3. NO TOAST - silent operation
};
```

#### 5. Deletar Versão
```typescript
const handleDeleteVersion = async (versionId: string) => {
  const version = versions.find(v => v.id === versionId);

  // 1. Não pode deletar versão principal
  if (version?.isMain) {
    // Show visual feedback in the UI (disabled button or error message)
    return;
  }

  // 2. Confirmar
  const confirm = await showConfirmDialog({
    title: t('delete_version'),
    description: t('delete_version_warning', { name: version.name }),
  });
  if (!confirm) return;

  // 3. Deletar
  await deleteRegionVersion(versionId);

  // 4. Remover do state
  setVersions(prev => prev.filter(v => v.id !== versionId));

  // 5. Se era a versão atual, trocar para main
  if (currentVersion?.id === versionId) {
    const mainVersion = versions.find(v => v.isMain);
    if (mainVersion) {
      setCurrentVersion(mainVersion);
      setRegion(mainVersion.regionData);
    }
  }
};
```

### Regras de Negócio

✅ **Permitido:**
- Criar quantas versões secundárias quiser
- Trocar entre versões livremente (com confirmação se houver mudanças não salvas)
- Ativar qualquer versão secundária como principal
- Deletar versões secundárias

❌ **Não Permitido:**
- Deletar versão principal (deve ativar outra primeiro)
- Ter mais de uma versão principal
- Ter zero versões (sempre deve existir pelo menos uma)

### Integração com Outras Features
- **Edição:** Edições sempre afetam a versão atual selecionada
- **Exclusão:** Deletar entidade deleta TODAS as suas versões
- **Timeline:** Cada versão pode ter timeline diferente
- **Relacionamentos:** Cada versão pode ter relacionamentos diferentes

---

## 3. Sistema de Edição

### Visão Geral
Sistema de edição inline com dirty checking (detecção de mudanças não salvas) e validação.

### Estados Visuais

#### Estado 1: Visualização (Padrão)
```
┌────────────────────────────────┐
│ [Editar] [Deletar]            │ ← Botões no topo
├────────────────────────────────┤
│ Nome: Floresta Élfica         │ ← Campos desabilitados
│ Tipo: Floresta                │
│ Clima: Temperado              │
└────────────────────────────────┘
```

#### Estado 2: Editando
```
┌────────────────────────────────┐
│ [Salvar] [Cancelar]           │ ← Botões mudaram
├────────────────────────────────┤
│ Nome: [Floresta Élfica    ]   │ ← Campos habilitados
│ Tipo: [Floresta ▼         ]   │
│ Clima: [Temperado ▼       ]   │
└────────────────────────────────┘
```

#### Estado 3: Salvando
```
┌────────────────────────────────┐
│ [⟳ Salvando...] [Cancelar]    │ ← Loading no botão
├────────────────────────────────┤
│ Nome: [Floresta Élfica    ]   │ ← Campos desabilitados
│ Tipo: [Floresta ▼         ]   │
│ Clima: [Temperado ▼       ]   │
└────────────────────────────────┘
```

### Lógica de Implementação

#### State Management
```typescript
const [region, setRegion] = useState<IRegion | null>(null);       // Dados originais
const [editData, setEditData] = useState<IRegion | null>(null);   // Dados sendo editados
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
```

#### Dirty Checking
```typescript
const hasChanges = useMemo(() => {
  if (!region || !editData) return false;
  return JSON.stringify(region) !== JSON.stringify(editData);
}, [region, editData]);
```

#### Fluxo de Edição

##### 1. Entrar em Modo de Edição
```typescript
const handleEdit = () => {
  setEditData({ ...region }); // Copia dados para edição
  setIsEditing(true);
};
```

##### 2. Atualizar Campos
```typescript
const updateField = (field: keyof IRegion, value: any) => {
  setEditData(prev => ({
    ...prev,
    [field]: value,
  }));
};

// Uso:
<Input
  value={editData.name}
  onChange={(e) => updateField('name', e.target.value)}
  disabled={!isEditing}
/>
```

##### 3. Salvar Mudanças
```typescript
const handleSave = async () => {
  try {
    setIsSaving(true);

    // 1. Validar dados com Zod
    const validatedData = RegionSchema.parse(editData);

    // 2. Atualizar no banco
    await updateRegionVersionData(currentVersion.id, validatedData);

    // 3. Atualizar state original
    setRegion(validatedData);

    // 4. Limpar erros e sair do modo de edição
    setErrors({});
    setIsEditing(false);

    // 5. NO TOAST - silent operation with visual feedback only

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Set visual error feedback
      const newErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
    }
    // NO TOAST - visual feedback only (errors state)
  } finally {
    setIsSaving(false);
  }
};
```

##### 4. Cancelar Edição
```typescript
const handleCancel = async () => {
  // 1. Verificar se há mudanças não salvas
  if (hasChanges) {
    const confirm = await showConfirmDialog({
      title: t('unsaved_changes'),
      description: t('discard_changes_warning'),
    });

    if (!confirm) return;
  }

  // 2. Reverter para dados originais
  setEditData({ ...region });

  // 3. Sair do modo de edição
  setIsEditing(false);
};
```

### Validação de Dados

#### Validação em Tempo Real
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = (field: string, value: any) => {
  const fieldErrors = { ...errors };

  switch (field) {
    case 'name':
      if (!value || value.trim() === '') {
        fieldErrors.name = t('name_required');
      } else {
        delete fieldErrors.name;
      }
      break;

    case 'regionType':
      if (!value) {
        fieldErrors.regionType = t('type_required');
      } else {
        delete fieldErrors.regionType;
      }
      break;
  }

  setErrors(fieldErrors);
};

// Uso:
<Input
  value={editData.name}
  onChange={(e) => {
    updateField('name', e.target.value);
    validateField('name', e.target.value);
  }}
  error={errors.name}
/>
```

### Proteções e Confirmações

#### 1. Mudanças Não Salvas ao Trocar Versão
```typescript
const handleVersionChange = async (versionId: string) => {
  if (hasChanges) {
    const confirm = await showConfirmDialog({
      title: t('unsaved_changes'),
      description: t('unsaved_changes_version_warning'),
    });
    if (!confirm) return;
  }

  // Prosseguir com troca de versão...
};
```

#### 2. Mudanças Não Salvas ao Sair da Página
```typescript
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanges) {
      e.preventDefault();
      e.returnValue = ''; // Chrome requer isso
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [hasChanges]);
```

### Campos Especiais

#### Multi-Selects (Factions, Characters, etc)
```typescript
// Adicionar item
const addResidentFaction = (factionId: string) => {
  setEditData(prev => ({
    ...prev,
    residentFactions: JSON.stringify([
      ...safeJsonParse(prev.residentFactions),
      factionId
    ])
  }));
};

// Remover item
const removeResidentFaction = (factionId: string) => {
  setEditData(prev => ({
    ...prev,
    residentFactions: JSON.stringify(
      safeJsonParse(prev.residentFactions).filter(id => id !== factionId)
    )
  }));
};
```

#### Datas
```typescript
<DatePicker
  date={new Date(editData.foundedDate)}
  onDateChange={(date) => updateField('foundedDate', date.getTime())}
  disabled={!isEditing}
/>
```

---

## 4. Sistema de Exclusão

### Visão Geral
Sistema de exclusão com confirmação em duas etapas e validações de segurança.

### Fluxo de Exclusão

#### 1. Botão de Deletar
```typescript
<Button
  variant="destructive"
  onClick={() => setDeleteDialogOpen(true)}
>
  <Trash2 className="h-4 w-4 mr-2" />
  {t('delete_region')}
</Button>
```

#### 2. Dialog de Confirmação (Primeira Etapa)
```typescript
<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{t('delete_region_confirm')}</AlertDialogTitle>
      <AlertDialogDescription>
        {t('delete_region_warning', { name: region.name })}
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-destructive"
      >
        {t('delete')}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### 3. Lógica de Exclusão
```typescript
const handleDelete = async () => {
  try {
    setIsDeleting(true);

    // 1. Validações de segurança
    const canDelete = await validateDeletion();
    if (!canDelete.allowed) {
      // Validação falhou - dialog permanece aberto
      setDeleteDialogOpen(false);
      return;
    }

    // 2. Deletar no banco (cascata automática de versões)
    await deleteRegion(regionId);

    // 3. Redirecionar (sem notificação)
    navigate('/world');

  } catch (error) {
    console.error('Error deleting:', error);
  } finally {
    setIsDeleting(false);
    setDeleteDialogOpen(false);
  }
};
```

### Validações de Segurança

#### 1. Verificar Dependências
```typescript
const validateDeletion = async (): Promise<{ allowed: boolean; reason?: string }> => {
  // 1. Verificar se há sub-regiões
  const subRegions = await getSubRegions(regionId);
  if (subRegions.length > 0) {
    return {
      allowed: false,
      reason: t('cannot_delete_has_subregions', { count: subRegions.length })
    };
  }

  // 2. Verificar se é região de um marcador no mapa
  const mapMarkers = await getRegionMapMarkers(region.parentRegionId);
  const hasMarker = mapMarkers.some(m => m.childRegionId === regionId);
  if (hasMarker) {
    return {
      allowed: false,
      reason: t('cannot_delete_has_map_marker')
    };
  }

  return { allowed: true };
};
```

#### 2. Confirmação com Nome (Para Entidades Críticas)
```typescript
const [confirmName, setConfirmName] = useState('');
const canConfirm = confirmName === region.name;

<Input
  placeholder={t('type_name_to_confirm')}
  value={confirmName}
  onChange={(e) => setConfirmName(e.target.value)}
/>

<AlertDialogAction
  onClick={handleDelete}
  disabled={!canConfirm}
>
  {t('delete')}
</AlertDialogAction>
```

### Comportamento em Cascata

#### Ao Deletar Região
Automaticamente deleta:
- ✅ Todas as versões da região
- ✅ Timeline da região (eras e eventos)
- ✅ Mapa da região (se houver)
- ✅ Marcadores no mapa (se houver)

#### Não Deleta (Relacionamentos)
- ❌ Factions relacionadas (apenas remove referência)
- ❌ Characters relacionados (apenas remove referência)
- ❌ Items relacionados (apenas remove referência)

### Loading States
```typescript
<Button
  variant="destructive"
  onClick={handleDelete}
  disabled={isDeleting}
>
  {isDeleting ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      {t('deleting')}
    </>
  ) : (
    <>
      <Trash2 className="h-4 w-4 mr-2" />
      {t('delete')}
    </>
  )}
</Button>
```

---

## 5. Sistema de Validação

### Visão Geral
Sistema de validação robusto com Zod que valida campos obrigatórios e fornece feedback visual em tempo real.

### Campos Obrigatórios por Entidade

#### Region (Região)
- ✅ **Nome** (name) - 1-200 caracteres
- ✅ **Escala** (scale) - obrigatório

#### Campos Opcionais
- ⭕ Resumo (summary)
- ⭕ Clima (climate)
- ⭕ Imagem (image)
- ⭕ Região Pai (parentId)
- ⭕ Todos os outros campos

### Implementação com Zod

#### 1. Schema de Validação
```typescript
// src/lib/validation/region-schema.ts
import { z } from 'zod';

// Exemplo para Region - adapte para sua entidade
export const RegionSchema = z.object({
  // CAMPOS BÁSICOS = OBRIGATÓRIOS (defina conforme BasicInfoSection)
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

  // ... outros campos avançados
});

export type RegionFormData = z.infer<typeof RegionSchema>;
```

**Padrão:** BasicInfoSection → sem `.optional()` | AdvancedInfoSection → com `.optional()`

#### 2. Estado de Erros
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});
```

#### 3. Validação de Campo Individual (onBlur)
```typescript
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

    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      setErrors(prev => ({
        ...prev,
        [field]: error.errors[0].message
      }));
      return false;
    }
  }
}, []);
```

#### 4. Verificar Campos Básicos (Obrigatórios) Vazios
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
      console.log('Campos básicos vazios:', missing);
      return { hasRequiredFieldsEmpty: true, missingFields: missing };
    }
    return { hasRequiredFieldsEmpty: true, missingFields: [] };
  }
}, [editData]);
```

#### 5. Validação Completa ao Salvar
```typescript
const handleSave = async () => {
  if (!currentVersion || !editData) return;

  try {
    // Validar TUDO com Zod
    const validatedData = RegionSchema.parse(editData);

    // Salvar no banco
    await updateRegionVersionData(currentVersion.id, validatedData);

    // Atualizar state
    setRegion(validatedData);
    setErrors({}); // Limpar erros
    setIsEditing(false);

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Mapear erros para cada campo
      const newErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
    } else {
      console.error('Error saving:', error);
    }
  }
};
```

### Feedback Visual

#### 1. Campo com Asterisco Vermelho
```tsx
<Label>
  {t('name')}
  <span className="text-destructive ml-1">*</span>
</Label>
```

#### 2. Campo com Erro (Borda Vermelha)
```tsx
<Input
  value={editData.name}
  onChange={(e) => updateField('name', e.target.value)}
  onBlur={() => validateField('name', editData.name)}
  className={errors.name ? 'border-destructive' : ''}
/>
```

#### 3. Mensagem de Erro Abaixo do Campo
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
  onClick={handleSave}
  disabled={!hasChanges || hasRequiredFieldsEmpty}
>
  {t('save')}
</Button>
```

#### 5. Mensagem de Campos Faltando
```tsx
{hasRequiredFieldsEmpty && (
  <p className="text-xs text-destructive">
    {missingFields.length > 0 ? (
      <>
        {t('missing_fields')}:{" "}
        {missingFields.map(field => fieldNames[field]).join(", ")}
      </>
    ) : (
      t('fill_required_fields')
    )}
  </p>
)}
```

### Estados Visuais

#### Campo Normal (Não Tocado)
```
Nome *
[____________________]
```

#### Campo Vazio (Após onBlur)
```
Nome *
[____________________] ← Border vermelho
⚠️ Nome é obrigatório
```

#### Campo Preenchido Corretamente
```
Nome *
[Floresta Élfica_____]
```

#### Botão Desabilitado com Mensagem
```
[Cancelar] [Salvar] ← Desabilitado (opaco)
Campos obrigatórios faltando: Nome, Escala  ← Texto vermelho
```

### Fluxo de Validação

1. **Usuário entra em modo de edição**
   - Campos habilitados
   - Validação ainda não ativada

2. **Usuário edita um campo e sai (onBlur)**
   - Campo é validado individualmente
   - Se erro: borda vermelha + mensagem aparecem
   - Se OK: mensagem de erro removida

3. **Usuário tenta salvar**
   - Se campos obrigatórios vazios: botão desabilitado
   - Se tentar salvar com erros: validação completa é executada
   - Todos os campos com erro ficam com borda vermelha

4. **Salvamento bem-sucedido**
   - Erros limpos
   - Modo de edição desativado
   - Sem notificações (comportamento silencioso)

### Regras de Negócio

✅ **Permitido:**
- Salvar com campos opcionais vazios
- Editar e cancelar sem validar

❌ **Não Permitido:**
- Salvar sem preencher campos obrigatórios (botão bloqueado)
- Salvar com erros de validação (ex: texto muito longo)

### Comportamento Silencioso

⚠️ **IMPORTANTE:** As páginas de detalhes **NÃO** exibem toasts/snackbars:
- ✅ Salvamento: apenas sai do modo de edição silenciosamente
- ✅ Erros: apenas feedback visual (bordas vermelhas, mensagens)
- ✅ Validação: apenas mensagem embaixo dos botões

Todas as operações são **silenciosas** com feedback **apenas visual**.

---

## Resumo das 5 Features

| Feature | Estado | Validações | Confirmações |
|---------|--------|------------|--------------|
| **Menu Lateral** | Seção ativa | - | - |
| **Versões** | Versão atual | Max 1 principal | Trocar com mudanças não salvas |
| **Edição** | isEditing, hasChanges | Campos obrigatórios | Cancelar com mudanças, Sair da página |
| **Exclusão** | isDeleting | Dependências | Dialog + Nome (opcional) |
| **Validação** | errors, hasRequiredFieldsEmpty | Zod schema | Botão bloqueado se campos vazios |

---

## Boas Práticas

### 1. Loading States
Sempre mostre feedback visual para operações assíncronas:
- Salvando mudanças
- Trocando versões
- Deletando entidade

### 2. Confirmações
Sempre peça confirmação para:
- Trocar versão com mudanças não salvas
- Cancelar edição com mudanças não salvas
- Deletar entidade
- Ativar versão como principal

### 3. Validações
Sempre valide:
- Campos obrigatórios antes de salvar
- Dependências antes de deletar
- Permissões do usuário

### 4. Feedback ao Usuário
Use feedback **visual apenas** (sem toasts/snackbars):
- ✅ Validação: Bordas vermelhas + mensagens de erro
- ✅ Botões: Estado desabilitado + mensagem explicativa
- ✅ Loading: Spinner no botão durante operação
- ⚠️ Confirmações: Dialogs para ações destrutivas
- 📝 Mudanças: Comparação visual (dirty checking)

### 5. Persistência de URL
Mantenha o estado na URL quando relevante:
- `?versionId=xxx` - Versão atual
- Permite compartilhar links com versão específica
- Volta/Avança do navegador funciona

---

Fim do documento.
