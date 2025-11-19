# Componentes de Display (Visualização)

Componentes somente leitura para exibir dados selecionados em modo visualização. Estes componentes **não possuem interatividade** e sempre exibem o estado "active" quando há dados, ou um estado vazio neutro quando não há.

**Localização:** `src/components/displays/`

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
    emptyText="Não definido"
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
- `emptyText`: string (default: "Não definido")
- `className`: string (opcional)

**Estrutura da opção:**
```tsx
{
  value: "option1",
  label: "Opção 1",
  icon: IconComponent,
  activeColorClass: "bg-blue-500/20 border-blue-500/30 ring-4 ring-blue-500/50 text-blue-600"
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
    emptyText="Não definido"
    emptyDescription="Nenhuma opção selecionada"
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
- `emptyText`: string (default: "Não definido")
- `emptyDescription`: string (default: "Nenhuma seleção disponível")
- `className`: string (opcional)

**Estrutura da opção:**
```tsx
{
  value: "option1",
  label: "Opção 1",
  description: "Descrição detalhada da opção",
  icon: IconComponent,
  activeColorClass: "bg-purple-500/20 border-purple-500/30 ring-4 ring-purple-500/50 text-white"
}
```
