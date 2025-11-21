# Componentes de Display (Visualização)

Componentes somente leitura para exibir dados selecionados em modo visualização. Estes componentes **não possuem interatividade** e sempre exibem o estado "active" quando há dados, ou um estado vazio neutro quando não há.

**Localização:** `src/components/displays/`

**Estado vazio:** Todos os componentes exibem automaticamente "Sem dados" quando não há valor.

---

## 1. DisplaySimpleGrid
**Componente:** `DisplaySimpleGrid` (`src/components/displays/DisplaySimpleGrid.tsx`)
**Descrição:** Versão somente leitura do `FormSimpleGrid`. Exibe um único card no estado "active" com layout vertical (ícone no topo, label abaixo).

**Usado com:** `FormSimpleGrid` (versão de formulário para edição)

**Exemplo de uso:**
```tsx
import { DisplaySimpleGrid } from "@/components/displays";

{!isEditing ? (
  <DisplaySimpleGrid
    value={data.field || null}
    options={fieldOptions}
  />
) : (
  <FormSimpleGrid
    value={editData.field || ""}
    onChange={(value) => onEditDataChange("field", value)}
    options={fieldOptions}
  />
)}
```

**Propriedades:**
- `value`: string | null | undefined
- `options`: DisplaySimpleGridOption[]
- `className`: string (opcional)

**Estrutura da opção:**
```tsx
{
  value: "option1",
  label: "Opção 1",
  icon: IconComponent,
  backgroundColor: "blue-500/20",
  borderColor: "blue-500/30"
}
```

---

## 2. DisplaySelectGrid
**Componente:** `DisplaySelectGrid` (`src/components/displays/DisplaySelectGrid.tsx`)
**Descrição:** Versão somente leitura do `FormSelectGrid`. Exibe um único card no estado "active" com layout horizontal (ícone à esquerda, label e descrição à direita).

**Usado com:** `FormSelectGrid` (versão de formulário para edição)

**Exemplo de uso:**
```tsx
import { DisplaySelectGrid } from "@/components/displays";

{!isEditing ? (
  <DisplaySelectGrid
    value={data.field || null}
    options={fieldOptions}
  />
) : (
  <FormSelectGrid
    value={editData.field || ""}
    onChange={(value) => onEditDataChange("field", value)}
    options={fieldOptions}
  />
)}
```

**Propriedades:**
- `value`: string | null | undefined
- `options`: DisplaySelectGridOption[]
- `className`: string (opcional)

**Estrutura da opção:**
```tsx
{
  value: "option1",
  label: "Opção 1",
  description: "Descrição detalhada da opção",
  icon: IconComponent,
  backgroundColor: "purple-500/20",
  borderColor: "purple-500/30"
}
```

---

## 3. DisplayImage
**Componente:** `DisplayImage` (`src/components/displays/DisplayImage.tsx`)
**Descrição:** Placeholder visual para estado vazio de imagem em modo visualização. Sem interatividade.

**Usado com:** `FormImageUpload` (versão de formulário para upload)

**Exemplo:**
```tsx
import { DisplayImage } from "@/components/displays";

{!isEditing && !image && (
  <DisplayImage
    icon={ImagePlus}
    text="Sem imagem"
    height="h-64"
    shape="rounded"
  />
)}
```

**Propriedades:**
- `icon`: LucideIcon (obrigatório)
- `text`: string (opcional)
- `height`: string (default: "h-40")
- `width`: string (default: "w-40")
- `shape`: 'square' | 'rounded' | 'circle' (default: 'rounded')
- `className`: string (opcional)

---

## 4. DisplayText
**Componente:** `DisplayText` (`src/components/displays/DisplayText.tsx`)
**Descrição:** Componente para exibir texto simples e curto em modo visualização. Lida automaticamente com valores vazios mostrando "Sem dados" em itálico e cor atenuada.

**Usado com:** `Input` (versão de formulário para edição)

**Exemplo de uso:**
```tsx
import { DisplayText } from "@/components/displays";

{!isEditing ? (
  <DisplayText value={character.height} />
) : (
  <Input
    value={editData.height || ""}
    onChange={(e) => onEditDataChange("height", e.target.value)}
  />
)}
```

**Propriedades:**
- `value`: string | null | undefined
- `className`: string (opcional)

---

## 5. DisplayTextarea
**Componente:** `DisplayTextarea` (`src/components/displays/DisplayTextarea.tsx`)
**Descrição:** Componente para exibir texto longo com múltiplas linhas em modo visualização. Preserva quebras de linha (`whitespace-pre-wrap`) e lida automaticamente com valores vazios.

**Usado com:** `Textarea` (versão de formulário para edição)

**Exemplo de uso:**
```tsx
import { DisplayTextarea } from "@/components/displays";

{!isEditing ? (
  <DisplayTextarea value={character.personality} />
) : (
  <Textarea
    value={editData.personality || ""}
    onChange={(e) => onEditDataChange("personality", e.target.value)}
    rows={3}
  />
)}
```

**Propriedades:**
- `value`: string | null | undefined
- `className`: string (opcional)

---

## 6. DisplayEntityList
**Componente:** `DisplayEntityList` (`src/components/displays/DisplayEntityList.tsx`)
**Descrição:** Lista colapsável de entidades relacionadas com imagem (ou inicial como fallback) e nome. Exibe contador de itens no header e lida automaticamente com estado vazio.

**Usado com:** `FormEntityMultiSelectAuto` (versão de formulário para edição)

**Exemplo de uso:**
```tsx
import { DisplayEntityList, DisplayEntityItem } from "@/components/displays";

// Preparar dados das entidades
const raceEntities: DisplayEntityItem[] = character.speciesAndRace?.map(raceId => {
  const race = races.find(r => r.id === raceId);
  return race ? { id: race.id, name: race.name, image: race.image } : null;
}).filter(Boolean) || [];

{!isEditing ? (
  <DisplayEntityList
    label="Espécies e Raças"
    entities={raceEntities}
    open={openSections.speciesAndRace}
    onOpenChange={() => toggleSection("speciesAndRace")}
  />
) : (
  <FormEntityMultiSelectAuto
    entityType="race"
    value={editData.speciesAndRace || []}
    onChange={(value) => onEditDataChange("speciesAndRace", value)}
  />
)}
```

**Propriedades:**
- `label`: string (obrigatório)
- `entities`: DisplayEntityItem[] | null | undefined
- `defaultOpen`: boolean (default: false)
- `open`: boolean (opcional, para controle externo)
- `onOpenChange`: (open: boolean) => void (opcional)
- `className`: string (opcional)

**Estrutura do item de entidade:**
```tsx
interface DisplayEntityItem {
  id: string;
  name: string;
  image?: string; // Se não fornecido, mostra inicial do nome
}
```

---

## 7. DisplayStringList
**Componente:** `DisplayStringList` (`src/components/displays/DisplayStringList.tsx`)
**Descrição:** Lista colapsável de strings simples renderizada como lista com bullets. Exibe contador de itens no header e lida automaticamente com estado vazio.

**Usado com:** `FormListInput` (versão de formulário para edição)

**Exemplo de uso:**
```tsx
import { DisplayStringList } from "@/components/displays";

{!isEditing ? (
  <DisplayStringList
    label="Apelidos"
    items={character.nicknames}
    open={openSections.nicknames}
    onOpenChange={() => toggleSection("nicknames")}
  />
) : (
  <FormListInput
    value={editData.nicknames || []}
    onChange={(value) => onEditDataChange("nicknames", value)}
    placeholder="Digite um apelido"
    buttonText="Adicionar apelido"
  />
)}
```

**Propriedades:**
- `label`: string (obrigatório)
- `items`: string[] | null | undefined
- `defaultOpen`: boolean (default: false)
- `open`: boolean (opcional, para controle externo)
- `onOpenChange`: (open: boolean) => void (opcional)
- `className`: string (opcional)
