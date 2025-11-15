# Form Components Documentation

Documentação completa dos componentes de formulário disponíveis em `src/components/forms`.

## Índice

- [Componentes Básicos](#componentes-básicos)
- [Componentes de Seleção](#componentes-de-seleção)
- [Componentes Avançados](#componentes-avançados)
- [Guia de Uso](#guia-de-uso)
- [Exemplos Práticos](#exemplos-práticos)

---

## Componentes Básicos

### FormInput
**Localização:** `src/components/forms/FormInput.tsx`

Input de texto simples com suporte a validação, contador de caracteres e labels customizáveis.

**Quando usar:**
- Campos de texto curto (nome, título, etc.)
- Inputs com limite de caracteres
- Campos que precisam de validação inline

**Props principais:**
```typescript
interface FormInputProps {
  label?: string;
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
  required?: boolean;
  error?: string;
  showLabel?: boolean;
  showOptionalLabel?: boolean;
  labelClassName?: string;
}
```

**Exemplo:**
```tsx
<FormInput
  label="Nome da Região"
  placeholder="Digite o nome..."
  maxLength={200}
  showCharCount
  required
/>
```

---

### FormTextarea
**Localização:** `src/components/forms/FormTextarea.tsx`

Área de texto multilinha com contador de caracteres e redimensionamento opcional.

**Quando usar:**
- Descrições longas
- Resumos, biografias
- Notas e observações

**Props principais:**
```typescript
interface FormTextareaProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
}
```

**Exemplo:**
```tsx
<FormTextarea
  label="Resumo"
  placeholder="Descreva a região..."
  rows={4}
  maxLength={500}
  showCharCount
  className="resize-none"
/>
```

---

## Componentes de Seleção

### FormSelect
**Localização:** `src/components/forms/FormSelect.tsx`

Select simples para escolha única entre opções.

**Quando usar:**
- Seleção única de valores
- Listas com poucas opções
- Campos obrigatórios com valor padrão

**Props principais:**
```typescript
interface FormSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

interface SelectOption {
  value: string;
  label: string;
}
```

**Exemplo:**
```tsx
<FormSelect
  label="Região Pai"
  placeholder="Selecione uma região..."
  options={regions.map(r => ({ value: r.id, label: r.name }))}
  value={parentId}
  onChange={setParentId}
/>
```

---

### FormMultiSelect
**Localização:** `src/components/forms/FormMultiSelect.tsx`

Multi-seleção simples sem avatares ou imagens.

**Quando usar:**
- Seleção múltipla de valores simples
- Tags, categorias
- Opções sem contexto visual

**Props principais:**
```typescript
interface FormMultiSelectProps {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
}

interface MultiSelectOption {
  value: string;
  label: string;
}
```

---

### EntitySelect
**Localização:** `src/components/forms/EntitySelect.tsx`

Select com avatar/imagem para entidades.

**Quando usar:**
- Seleção única de entidade (personagem, facção, etc.)
- Quando o contexto visual (avatar) é importante

**Props principais:**
```typescript
interface EntitySelectProps {
  label?: string;
  entities: Entity[];
  value: string;
  onChange: (value: string) => void;
  entityType: EntityType; // 'character', 'faction', 'race', 'item'
}

interface Entity {
  id: string;
  name: string;
  image?: string;
}
```

---

## Componentes Avançados

### FormImageUpload
**Localização:** `src/components/forms/FormImageUpload.tsx`

Upload de imagem com preview e remoção.

**Quando usar:**
- Upload de imagens para entidades
- Campos que precisam de preview visual
- Imagens de banner, avatar, capa

**Props principais:**
```typescript
interface FormImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  helperText?: string;
  required?: boolean;
  height?: string; // default: 'h-[28rem]'
  accept?: string;
  error?: string;
  id?: string;
}
```

**Exemplo:**
```tsx
<FormImageUpload
  value={image}
  onChange={setImage}
  label="Imagem da Região"
  helperText="Recomendado: 1200x448px"
  height="h-[28rem]"
  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
/>
```

**Características:**
- Preview automático da imagem selecionada
- Botão de remoção no canto superior direito
- Área de drop visual com ícone
- Suporta conversão para base64
- Altura customizável

---

### FormSelectGrid
**Localização:** `src/components/forms/FormSelectGrid.tsx`

Grid visual de seleção com ícones e descrições.

**Quando usar:**
- Seleção de escalas, níveis, categorias
- Opções que se beneficiam de contexto visual
- Quando ícones ajudam na identificação
- Choices com descrições detalhadas

**Props principais:**
```typescript
interface FormSelectGridProps<T = string> {
  value: T | null | undefined;
  onChange: (value: T) => void;
  options: GridSelectOption<T>[];
  label: string;
  required?: boolean;
  error?: string;
  columns?: number; // default: 2
  className?: string;
}

interface GridSelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
  baseColorClass?: string;
  hoverColorClass?: string;
  activeColorClass?: string;
}
```

**Exemplo (Escala de Região):**
```tsx
<FormSelectGrid
  value={scale}
  onChange={setScale}
  label="Escala"
  required
  columns={2}
  options={[
    {
      value: "local",
      label: "Local",
      description: "Cidades, vilas, florestas",
      icon: MapPin,
      activeColorClass: "bg-emerald-500 text-white border-emerald-500",
      hoverColorClass: "hover:bg-emerald-500 hover:text-white"
    },
    {
      value: "continental",
      label: "Continental",
      description: "Continentes, nações",
      icon: Globe,
      activeColorClass: "bg-blue-500 text-white border-blue-500",
      hoverColorClass: "hover:bg-blue-500 hover:text-white"
    },
    // ... mais opções
  ]}
/>
```

**Características:**
- Grid responsivo (1-3 colunas)
- Ícones opcionais com Lucide React
- Descrições para contexto
- Cores customizáveis por opção
- Estados: normal, hover, active
- Texto alinhado à esquerda

**Casos de Uso:**
- ScalePicker (escalas de região)
- SeasonPicker (estações do ano)
- Seleção de tipos/categorias visuais
- Qualquer escolha que se beneficia de ícones

---

### FormListInput
**Localização:** `src/components/forms/FormListInput.tsx`

Input para criar listas de strings (adicionar/remover itens).

**Quando usar:**
- Listas de características, anomalias
- Tags customizadas
- Itens que o usuário adiciona manualmente
- Arrays de strings simples

**Props principais:**
```typescript
interface FormListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  placeholder?: string;
  addButtonText?: string;
  required?: boolean;
  maxLength?: number;
  error?: string;
  labelClassName?: string;
}
```

**Exemplo:**
```tsx
<FormListInput
  value={anomalies}
  onChange={setAnomalies}
  label="Anomalias da Região"
  placeholder="Rios que fluem para cima..."
  addButtonText="Adicionar Anomalia"
  maxLength={200}
/>
```

**Características:**
- Input com botão de adicionar (+)
- Enter para adicionar
- Badges para itens adicionados
- Botão X para remover cada item
- Limite de caracteres por item
- Wrap automático dos badges

**Casos de Uso:**
- Anomalias, peculiaridades
- Lista de recursos naturais
- Tags, características
- Qualquer array de strings

---

### FormEntityMultiSelectAuto
**Localização:** `src/components/forms/FormEntityMultiSelectAuto.tsx`

Multi-seleção de entidades com busca, avatares e **carregamento automático do banco de dados**.

**Quando usar:**
- ✅ **Em modais** - Dados sempre atualizados ao abrir
- ✅ **Páginas de edição** - Dados atualizados ao entrar em modo edição
- ✅ Seleção múltipla de personagens, facções, raças, itens do DB
- ✅ Quando quer menos código no componente pai
- ✅ **Este é o componente padrão para multi-seleção de entidades!**

**Props principais:**
```typescript
interface FormEntityMultiSelectAutoProps {
  entityType: 'character' | 'faction' | 'race' | 'item' | 'region';
  bookId: string;
  label: string;
  placeholder?: string;
  emptyText?: string;
  noSelectionText?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  counterText?: string; // default: "selected"
  value: string[]; // IDs selecionados
  onChange: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  filter?: (entity: EntityOption) => boolean; // Filtro customizado
}

interface EntityOption {
  id: string;
  name: string;
  image?: string;
}
```

**Exemplo:**
```tsx
<FormEntityMultiSelectAuto
  entityType="character"
  bookId={bookId}
  label="Personagens Residentes"
  placeholder="Selecione personagens..."
  emptyText="Nenhum personagem disponível"
  noSelectionText="Nenhum personagem selecionado"
  searchPlaceholder="Buscar personagens..."
  noResultsText="Nenhum resultado encontrado"
  counterText="selecionado(s)"
  value={residentCharacterIds}
  onChange={setResidentCharacterIds}
/>
```

**Características:**
- **Carregamento automático do DB** baseado em `entityType` e `bookId`
- Dropdown com busca integrada
- Avatares quadrados (rounded-md)
- Iniciais como fallback
- Contador de selecionados
- Cards dos selecionados com avatar
- Botão X para remover
- Estados vazios customizáveis
- Scroll quando muitos itens
- Filtro customizado opcional

**Estados:**
1. **Carregando:** Mostra "Loading..."
2. **Sem opções:** Mostra `emptyText`
3. **Sem seleção:** Mostra `noSelectionText`
4. **Com seleção:** Mostra cards com avatares
5. **Busca vazia:** Mostra `noResultsText`

**Como funciona o carregamento automático:**
```tsx
// O componente automaticamente busca do DB baseado no entityType
useEffect(() => {
  const loadEntities = async () => {
    switch (entityType) {
      case 'character':
        const chars = await getCharactersByBookId(bookId);
        break;
      case 'faction':
        const facs = await getFactionsByBookId(bookId);
        break;
      // ... outros tipos
    }
  };
  loadEntities();
}, [entityType, bookId, filter]);
```

**Refresh automático em modais/edição:**
Para garantir que os dados sejam atualizados quando o modal abre ou quando entra em modo de edição, use o padrão `refreshKey`:

```tsx
// No componente pai (modal ou página de detalhes)
const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
  if (open) { // Para modais
    setRefreshKey(prev => prev + 1);
  }
}, [open]);

// Ou para modo de edição
useEffect(() => {
  if (isEditing) { // Para páginas de detalhes
    setRefreshKey(prev => prev + 1);
  }
}, [isEditing]);

// No FormEntityMultiSelectAuto
<FormEntityMultiSelectAuto
  key={`resident-characters-${refreshKey}`} // ⚠️ Key única força re-mount
  entityType="character"
  bookId={bookId}
  label="Personagens Residentes"
  value={residentCharacterIds}
  onChange={setResidentCharacterIds}
/>
```

---

## Guia de Uso

### Importação

```tsx
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormMultiSelect,
  EntitySelect,
  FormImageUpload,
  FormSelectGrid,
  FormListInput,
  FormEntityMultiSelectAuto,
  type GridSelectOption,
  type EntityOption,
  type FormEntityType,
} from "@/components/forms";
```

---

### Padrões de Implementação

#### 1. Campo Obrigatório
```tsx
<FormInput
  label="Nome"
  required // Adiciona asterisco vermelho *
  placeholder="Digite o nome..."
/>
```

#### 2. Campo Opcional
```tsx
<FormTextarea
  label="Resumo"
  helperText="(opcional)" // Texto em cinza
  placeholder="Descrição opcional..."
/>
```

#### 3. Campo com Validação
```tsx
<FormInput
  label="Nome"
  value={name}
  onChange={setName}
  error={errors.name} // Mensagem de erro em vermelho
  required
/>
```

#### 4. Integração com React Hook Form
```tsx
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
          error={fieldState.error?.message}
          showLabel={false} // Label já está acima
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Exemplos Práticos

### Exemplo 1: Modal de Criar Região (Campos Básicos)

```tsx
import {
  FormImageUpload,
  FormInput,
  FormSelect,
  FormSelectGrid,
  FormTextarea,
  FormEntityMultiSelectAuto,
  type GridSelectOption,
} from "@/components/forms";

// Configuração de escalas
const scaleOptions: GridSelectOption[] = [
  {
    value: "local",
    label: "Local",
    description: "Cidades, vilas, florestas",
    icon: MapPin,
    activeColorClass: "bg-emerald-500 text-white border-emerald-500",
    hoverColorClass: "hover:bg-emerald-500 hover:text-white",
  },
  // ... mais escalas
];

function CreateRegionModal() {
  return (
    <div className="space-y-6">
      {/* Imagem */}
      <FormImageUpload
        value={image}
        onChange={setImage}
        label="Imagem"
        helperText="opcional - Recomendado: 1200x448px"
        height="h-[28rem]"
      />

      {/* Nome */}
      <FormInput
        value={name}
        onChange={setName}
        label="Nome"
        placeholder="Digite o nome da região..."
        maxLength={200}
        required
      />

      {/* Região Pai */}
      <FormSelect
        label="Região Pai"
        placeholder="Selecione..."
        value={parentId}
        onChange={setParentId}
        options={[
          { value: "neutral", label: "Neutra" },
          ...regions.map(r => ({ value: r.id, label: r.name })),
        ]}
        required
      />

      {/* Escala */}
      <FormSelectGrid
        value={scale}
        onChange={setScale}
        label="Escala"
        options={scaleOptions}
        columns={2}
        required
      />

      {/* Resumo */}
      <FormTextarea
        value={summary}
        onChange={setSummary}
        label="Resumo"
        placeholder="Descreva a região..."
        rows={4}
        maxLength={500}
        showCharCount
      />
    </div>
  );
}
```

---

### Exemplo 2: Campos Avançados com FormEntityMultiSelectAuto

```tsx
import {
  FormSelectGrid,
  FormListInput,
  FormEntityMultiSelectAuto,
  type GridSelectOption,
} from "@/components/forms";

// Estações
const seasonOptions: GridSelectOption[] = [
  {
    value: "spring",
    label: "Primavera",
    icon: Flower,
    activeColorClass: "bg-green-500 text-white",
  },
  {
    value: "summer",
    label: "Verão",
    icon: Sun,
    activeColorClass: "bg-yellow-500 text-black",
  },
  // ...
];

function AdvancedFields({ bookId }: { bookId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh quando o modal abre
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Clima */}
      <FormInput
        label="Clima"
        value={climate}
        onChange={setClimate}
        placeholder="Tropical, Temperado..."
        maxLength={100}
      />

      {/* Estação Predominante */}
      <FormSelectGrid
        value={season}
        onChange={setSeason}
        label="Estação Predominante"
        options={seasonOptions}
        columns={2}
      />

      {/* Recursos Naturais */}
      <FormListInput
        value={naturalResources}
        onChange={setNaturalResources}
        label="Recursos Naturais"
        placeholder="Minério de ferro, madeira..."
        addButtonText="Adicionar Recurso"
        maxLength={100}
      />

      {/* Personagens Residentes */}
      <FormEntityMultiSelectAuto
        key={`resident-characters-${refreshKey}`}
        entityType="character"
        bookId={bookId}
        label="Personagens Residentes"
        placeholder="Selecione personagens..."
        emptyText="Crie personagens primeiro"
        noSelectionText="Nenhum personagem selecionado"
        searchPlaceholder="Buscar personagens..."
        value={residentCharacterIds}
        onChange={setResidentCharacterIds}
      />

      {/* Facções Ativas */}
      <FormEntityMultiSelectAuto
        key={`active-factions-${refreshKey}`}
        entityType="faction"
        bookId={bookId}
        label="Facções Ativas"
        placeholder="Selecione facções..."
        emptyText="Crie facções primeiro"
        noSelectionText="Nenhuma facção selecionada"
        searchPlaceholder="Buscar facções..."
        value={activeFactionIds}
        onChange={setActiveFactionIds}
      />
    </div>
  );
}
```

---

## Resumo de Componentes por Categoria

### Texto
- **FormInput** - Campo de texto curto com contador
- **FormTextarea** - Campo de texto longo com contador

### Seleção Simples
- **FormSelect** - Select dropdown tradicional
- **EntitySelect** - Select com avatares (seleção única)

### Seleção Múltipla
- **FormMultiSelect** - Multi-select simples (strings, sem avatares)
- **FormEntityMultiSelectAuto** ⭐ - Multi-select de entidades com avatares e **carregamento automático do DB**

### Seleção Visual
- **FormSelectGrid** - Grid de opções com ícones e descrições

### Especializados
- **FormImageUpload** - Upload de imagem com preview e remoção
- **FormListInput** - Input para criar/remover listas de strings

### Componente Recomendado
⭐ **FormEntityMultiSelectAuto** é o componente padrão para seleção múltipla de entidades do banco de dados (personagens, facções, raças, itens, regiões). Use este componente em vez de criar props para passar entidades manualmente.

---

## Mapa de Localização

```
src/components/forms/
├── FormInput.tsx                      # Campo de texto básico
├── FormTextarea.tsx                   # Área de texto
├── FormSelect.tsx                     # Select simples
├── FormMultiSelect.tsx                # Multi-select simples
├── EntitySelect.tsx                   # Select com avatar
├── FormImageUpload.tsx                # ✨ Upload de imagem
├── FormSelectGrid.tsx                 # ✨ Grid de seleção visual
├── FormListInput.tsx                  # ✨ Input de lista
├── FormEntityMultiSelectAuto.tsx      # ✨ Multi-select com carregamento automático
└── index.tsx                          # Exportações
```

**Componentes criados (✨):**
- **FormImageUpload** - Upload de imagem com preview
- **FormSelectGrid** - Grid visual para seleção (substitui ScalePicker, SeasonPicker)
- **FormListInput** - Input para listas de strings
- **FormEntityMultiSelectAuto** - Multi-select de entidades com carregamento automático do DB

---

## Decisões de Design

### Por que FormSelectGrid?
- **Antes:** ScalePicker, SeasonPicker (componentes específicos)
- **Agora:** FormSelectGrid genérico
- **Benefício:** Reutilização para qualquer tipo de seleção visual

### Por que FormEntityMultiSelectAuto?
- **Antes:** MultiSelect no modal com código duplicado + prop drilling de entidades
- **Agora:** FormEntityMultiSelectAuto que carrega automaticamente do DB
- **Benefício:**
  - Menos código no componente pai
  - Dados sempre atualizados quando o modal abre ou entra em modo edição
  - Não precisa passar arrays de entidades via props
  - Componentização real com responsabilidade única

### Por que FormListInput?
- **Antes:** ListInput específico no modal
- **Agora:** Componente genérico
- **Benefício:** Listas de tags, características, etc.

### Por que FormImageUpload?
- **Antes:** Código inline no modal
- **Agora:** Componente reutilizável
- **Benefício:** Upload de imagens em qualquer formulário

---

## Status de Implementação

1. ✅ Componentes criados e documentados
2. ✅ Modal de criar região migrado para FormEntityMultiSelectAuto
3. ✅ Region Detail (modo de edição) migrado para FormEntityMultiSelectAuto
4. ✅ Sistema de refresh automático implementado (refreshKey pattern)
5. ⏳ Aplicar em outros modais (personagens, facções, raças, itens, etc.)
6. ⏳ Criar variações conforme necessário

## Onde está sendo usado:

### FormEntityMultiSelectAuto
- ✅ `src/components/modals/create-region-modal.tsx` (5 instâncias)
  - Resident Factions
  - Dominant Factions
  - Important Characters
  - Races Found
  - Items Found
- ✅ `src/pages/dashboard/tabs/world/region-detail/view.tsx` (5 instâncias)
  - Resident Factions (edit mode)
  - Dominant Factions (edit mode)
  - Important Characters (edit mode)
  - Races Found (edit mode)
  - Items Found (edit mode)

---

## Referências

- **Modal de referência:** `src/components/modals/create-region-modal.tsx`
- **Componentes base:** `src/components/forms/`
- **UI primitivos:** `src/components/ui/`
