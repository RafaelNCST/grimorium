# Componentes de Formulário

Classificação dos componentes base reutilizáveis de formulário utilizados no projeto.

**Localização:** `src/components/` (ui, forms)

---

## 1. Input (Texto Simples)
**Componente:** `Input` (`src/components/ui/input.tsx`)
**Uso:** Campos de texto curto (Nome, datas, valores únicos)
**Descrição:** Input padrão para textos de uma linha

---

## 2. Textarea (Texto Longo)
**Componente:** `Textarea` (`src/components/ui/textarea.tsx`)
**Uso:** Campos de texto longo (Resumo, descrições, notas)
**Descrição:** Textarea com suporte a múltiplas linhas e `resize-none`

---

## 3. Select (Seleção Única)
**Componente:** `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` (`src/components/ui/select.tsx`)
**Uso:** Seleção única de opções em dropdown
**Descrição:** Dropdown estilizado para selecionar uma opção

**Exemplo de uso:**
```tsx
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

---

## 4. Button (Botão)
**Componente:** `Button` (`src/components/ui/button.tsx`)
**Uso:** Botões de ação (Ver documentação em `buttons.md`)
**Descrição:** Botão base com múltiplas variantes (magical, destructive, secondary, ghost, etc.)

---

## 5. Label (Rótulo)
**Componente:** `Label` (`src/components/ui/label.tsx`)
**Uso:** Rótulos para campos de formulário
**Descrição:** Label padrão associado a inputs

---

## 6. Badge (Distintivo)
**Componente:** `Badge` (`src/components/ui/badge.tsx`)
**Uso:** Tags e distintivos visuais
**Descrição:** Badge com variantes (default, secondary, outline, destructive)

---

## 7. Card (Cartão)
**Componente:** `Card` + `CardHeader` + `CardTitle` + `CardContent` (`src/components/ui/card.tsx`)
**Uso:** Containers para agrupar conteúdo
**Descrição:** Container estilizado com header e conteúdo

---

## 8. FormSelectGrid (Grid de Seleção com Descrição)
**Componente:** `FormSelectGrid` (`src/components/forms/FormSelectGrid.tsx`)
**Uso:** Seleção visual em grid com ícones e descrições (Escala, Estação, Arquétipos, Alinhamento D&D)
**Descrição:** Grid de botões com ícones à esquerda, label e descrição à direita. Cores customizáveis seguindo o padrão visual do projeto.

**⚠️ IMPORTANTE - Padrão Universal de Grids:**
FormSelectGrid segue o **mesmo padrão de hover/active** usado em todos os grids do projeto (veja FormSimpleGrid para detalhes completos):
- **Hover**: Apenas muda cores (mantém border-2 p-4)
- **Active**: Mantém border-2 p-4 + adiciona ring-4 externo (ZERO movimento dos cards)

**Classes de Cor Obrigatórias:**
Para manter a consistência visual, você **DEVE** passar as classes de cor manualmente para cada opção:

- **`baseColorClass`**: Estado neutro/não selecionado
  - Padrão: `"bg-card text-muted-foreground border-border"`

- **`hoverColorClass`**: Estado hover (cores suaves SEM ring)
  - Padrão: `"hover:bg-{cor}-500/10 hover:border-{cor}-500/20"`
  - Exemplo: `"hover:bg-emerald-500/10 hover:border-emerald-500/20"`

- **`activeColorClass`**: Estado selecionado (cores fortes + ring-4)
  - Padrão: `"bg-{cor}-500/20 border-{cor}-500/30 ring-4 ring-{cor}-500/50 text-white"`
  - Exemplo: `"bg-emerald-500/20 border-emerald-500/30 ring-4 ring-emerald-500/50 text-white"`

**Exemplo de uso:**
```tsx
<FormSelectGrid
  value={scale}
  onChange={setScale}
  label="Escala da Região"
  required
  columns={2}
  options={[
    {
      value: "local",
      label: "Local",
      description: "Cidades, vilas, florestas",
      icon: MapPin,
      baseColorClass: "bg-card text-muted-foreground border-border",
      hoverColorClass: "hover:bg-emerald-500/10 hover:border-emerald-500/20",
      activeColorClass: "bg-emerald-500/20 border-emerald-500/30 ring-4 ring-emerald-500/50 text-white",
    },
    // ... mais opções
  ]}
  // Opcional: conteúdo expandido
  expandedContent={<Input placeholder="Nome customizado" />}
  showExpandedContent={value === "custom"}
/>
```

**Propriedades principais:**
- `columns`: Número de colunas (2, 3 ou 4)
- `colSpan`: Opção pode ocupar múltiplas colunas
- `expandedContent`: Conteúdo adicional (ex: input)
- `showExpandedContent`: Controla visibilidade do conteúdo expandido
- **`baseColorClass`**: Classes CSS para estado neutro (OBRIGATÓRIO)
- **`hoverColorClass`**: Classes CSS para hover (OBRIGATÓRIO)
- **`activeColorClass`**: Classes CSS para selecionado (OBRIGATÓRIO)

---

## 9. FormSimpleGrid (Grid de Seleção Simples - Ícone em Cima)
**Componente:** `FormSimpleGrid` (`src/components/forms/FormSimpleGrid.tsx`)
**Uso:** Seleção única em grid com ícone no topo e label abaixo (Roles de Personagem, Status, Categorias, Tipos de Relacionamento)
**Descrição:** Grid de botões com layout vertical: ícone no topo e label abaixo. **Diferente do FormSelectGrid** que tem layout horizontal (ícone à esquerda, label à direita). Não possui campo de descrição. Ideal para seleções visuais simples onde o ícone é o elemento principal.

**⚠️ IMPORTANTE - Padrão Universal de Hover/Active para Grids:**

### **Padrão de Bordas (CRÍTICO - VALE PARA TODOS OS GRIDS DO PROJETO):**
**Este padrão é usado em FormSimpleGrid, FormSelectGrid e todos os componentes de grid do projeto.**

**Estados:**
- **Estado Normal**: `border-2 p-4` com `baseColorClass` (borda 2px + padding 16px)
- **Estado Hover**: `border-2 p-4` com cores do active SEM ring (apenas cores mudam)
- **Estado Active**: `border-2 p-4` com cores do active + `ring-4` (ring externo de 4px cria efeito de borda grossa)

**Lógica do padrão:**
1. **Hover** "antecipa" a seleção mostrando as cores ativas (background, texto e borda coloridos)
2. **Active** mantém border-2 + p-4, mas adiciona `ring-4` que cria visualmente uma borda mais grossa via box-shadow
3. **Resultado:** Border e padding permanecem constantes em todos os estados = **ZERO movimento dos cards** 🎯

### **Classes de Cor Obrigatórias:**

- **`baseColorClass`**: Estado neutro/não selecionado
  - Padrão: `"border-muted"` (minimalista, apenas borda cinza)
  - Exemplo: `"border-muted"`

- **`hoverColorClass`**: Estado hover (cores do active SEM border-4/ring)
  - **Padrão Correto**: `"hover:{cores-do-active}"` (apenas cores, mantém border-2)
  - Exemplo: `"hover:bg-yellow-500/10 hover:text-yellow-600 hover:border-yellow-500/20"`
  - ⚠️ **ATENÇÃO**: As cores devem ser IDÊNTICAS ao activeColorClass mas SEM o ring. A borda permanece `border-2`.

- **`activeColorClass`**: Estado selecionado (fundo + texto + borda + ring coloridos)
  - **Padrão COMPLETO**: `"bg-{cor}-500/20 border-{cor}-500/30 ring-4 ring-{cor}-500/50 text-{cor}-600"`
  - Exemplo: `"bg-yellow-500/20 border-yellow-500/30 ring-4 ring-yellow-500/50 text-yellow-600"`
  - **Componentes da cor:**
    - `bg-{cor}-500/20`: Fundo com 20% de opacidade
    - `text-{cor}-600`: Texto colorido (mais escuro que o bg)
    - `border-{cor}-500/30`: Borda com 30% de opacidade
    - `ring-4 ring-{cor}-500/50`: Ring externo de 4px com 50% de opacidade (cria efeito de borda grossa)
  - **Nota técnica**: Border e padding permanecem `border-2 p-4` sempre. O `ring-4` é um box-shadow externo que não afeta o layout, criando o efeito visual de borda mais grossa sem mover cards

**Exemplo de uso CORRETO:**
```tsx
<FormSimpleGrid
  value={relationshipType}
  onChange={setRelationshipType}
  label="Tipo de Relacionamento"
  required
  columns={4}
  options={[
    {
      value: "friend",
      label: "Amigo",
      icon: Users,
      baseColorClass: "border-muted",
      // Hover = cores mais suaves do active (SEM ring)
      hoverColorClass: "hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20",
      // Active = cores mais fortes + ring-4
      activeColorClass: "bg-green-500/20 border-green-500/30 ring-4 ring-green-500/50 text-green-600",
    },
    {
      value: "rival",
      label: "Rival",
      icon: Swords,
      baseColorClass: "border-muted",
      // Hover = cores mais suaves do active (SEM ring)
      hoverColorClass: "hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/20",
      // Active = cores mais fortes + ring-4
      activeColorClass: "bg-orange-500/20 border-orange-500/30 ring-4 ring-orange-500/50 text-orange-600",
    },
    // ... mais opções
  ]}
/>
```

**Exemplo programático (recomendado para muitas opções):**
```tsx
// Primeiro, defina um constant com as cores de cada tipo
const RELATIONSHIP_TYPES = [
  {
    value: "friend",
    translationKey: "friend",
    icon: Users,
    // Active = cores fortes + ring-4
    color: "bg-green-500/20 border-green-500/30 ring-4 ring-green-500/50 text-green-600",
    // Hover = cores mais suaves (SEM ring)
    hoverColor: "hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20",
  },
  {
    value: "rival",
    translationKey: "rival",
    icon: Swords,
    color: "bg-orange-500/20 border-orange-500/30 ring-4 ring-orange-500/50 text-orange-600",
    hoverColor: "hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/20",
  },
  // ... outros tipos
];

// Depois use no FormSimpleGrid
<FormSimpleGrid
  value={selectedType}
  onChange={setSelectedType}
  label="Tipo de Relacionamento"
  columns={4}
  options={RELATIONSHIP_TYPES.map((type) => ({
    value: type.value,
    label: t(`relationship_types.${type.translationKey}`),
    icon: type.icon,
    baseColorClass: "border-muted",
    hoverColorClass: type.hoverColor,  // Cores suaves
    activeColorClass: type.color,      // Cores fortes + ring-4
  }))}
/>
```

**Propriedades principais:**
- `columns`: Número de colunas (2, 3, 4, 5 ou 6)
- `label`: Texto do label do campo
- `required`: Se o campo é obrigatório
- `error`: Mensagem de erro opcional
- `className`: Classe CSS customizada para o grid
- **`baseColorClass`**: Classes CSS para estado neutro (OBRIGATÓRIO) - apenas borda cinza
- **`hoverColorClass`**: Classes CSS para hover (OBRIGATÓRIO) - cores suaves do active SEM ring
- **`activeColorClass`**: Classes CSS para selecionado (OBRIGATÓRIO) - cores fortes + ring-4 (border-2 p-4 sempre)

**Diferenças do FormSelectGrid:**
- ✅ **Layout Vertical**: Ícone no topo, label abaixo
- ✅ **Sem Descrição**: Apenas ícone e label (mais compacto)
- ✅ **Mais Colunas**: Suporta até 6 colunas (FormSelectGrid limita a 4)
- ✅ **Mesmo Padrão de Hover/Active**: Ambos seguem o padrão universal (hover = cores, active = cores + ring-4, border constante)
- ✅ **Uso**: Ideal para seleções simples e visuais (roles, status, categorias, tipos)

**Casos de uso no projeto:**
- **Roles de Personagem:** Protagonista, Antagonista, Vilão, Secundário, Extra
- **Tipos de Relacionamento:** Amigo, Rival, Mentor, Aprendiz, Inimigo, etc. (16 tipos)
- **Status de Projeto:** Planejamento, Em Andamento, Revisão, Concluído
- **Categorias Simples:** Qualquer seleção que não precise de descrição detalhada

---

## 10. FormEntityMultiSelectAuto (Multi-Select de Entidades com Auto-Load)
**Componente:** `FormEntityMultiSelectAuto` (`src/components/forms/FormEntityMultiSelectAuto.tsx`)
**Uso:** Seleção múltipla de entidades relacionadas (Facções, Personagens, Raças, Itens, Regiões)
**Descrição:** Multi-select especializado que carrega automaticamente entidades do banco de dados. Possui busca integrada, avatares e exibição visual das seleções. Ideal para campos de relacionamento entre entidades. 

**Exemplo de uso básico (múltiplas seleções):**
```tsx
<FormEntityMultiSelectAuto
  entityType="faction"
  bookId={bookId}
  label="Facções Dominantes"
  placeholder="Selecione as facções..."
  emptyText="Nenhuma facção disponível"
  noSelectionText="Nenhuma facção selecionada"
  searchPlaceholder="Buscar facção..."
  value={dominantFactions}
  onChange={setDominantFactions}
  labelClassName="text-sm font-medium text-primary"
/>
```

**Exemplo com limite de seleção (seleção única):**
```tsx
<FormEntityMultiSelectAuto
  entityType="region"
  bookId={bookId}
  label="Local de Nascimento"
  placeholder="Selecione um local..."
  emptyText="Nenhum local disponível"
  noSelectionText="Nenhum local selecionado"
  searchPlaceholder="Buscar local..."
  value={birthPlace}
  onChange={setBirthPlace}
  maxSelections={1}
  labelClassName="text-sm font-medium text-primary"
/>
```

**Propriedades principais:**
- `entityType`: Tipo de entidade ('character' | 'faction' | 'race' | 'item' | 'region')
- `bookId`: ID do livro para carregar as entidades
- `label`: Texto do label
- `placeholder`: Texto do placeholder no dropdown
- `emptyText`: Mensagem quando não há opções disponíveis
- `noSelectionText`: Mensagem quando nenhuma entidade foi selecionada
- `searchPlaceholder`: Placeholder do campo de busca
- `value`: Array de IDs selecionados (string[])
- `onChange`: Callback quando a seleção muda
- `filter`: (Opcional) Função para filtrar entidades
- `required`: (Opcional) Se o campo é obrigatório
- `disabled`: (Opcional) Se o campo está desabilitado
- **`maxSelections`**: (Opcional) Número máximo de seleções permitidas. Quando definido, o dropdown é desabilitado ao atingir o limite e mostra uma mensagem informativa

**Funcionalidades:**
- ✅ Carregamento automático de entidades do banco de dados
- ✅ Busca integrada no dropdown
- ✅ Exibição com avatares (imagem ou iniciais)
- ✅ Contador de seleções (com exibição de limite quando definido)
- ✅ Remoção individual de itens selecionados
- ✅ Estados vazios informativos
- ✅ Scroll automático para listas longas
- ✅ Suporte a filtros customizados
- ✅ **Limite de seleções configurável** (maxSelections) - desabilita dropdown ao atingir limite

**Casos de uso no projeto:**
- **Facções Residentes/Dominantes:** Selecionar facções que habitam ou dominam uma região (múltiplas seleções)
- **Personagens Importantes:** Escolher personagens relevantes para uma região (múltiplas seleções)
- **Raças Encontradas:** Indicar quais raças são encontradas em uma região (múltiplas seleções)
- **Itens Encontrados:** Listar itens que podem ser encontrados em uma região (múltiplas seleções)
- **Local de Nascimento:** Escolher o local onde um personagem nasceu (seleção única com `maxSelections={1}`)

---

## 11. ListInput (Lista Dinâmica com Drag & Drop)
**Componente:** `ListInput` (`src/components/modals/create-region-modal/components/list-input.tsx`)
**Uso:** Listas dinâmicas de itens com adição, edição, remoção e reordenação
**Descrição:** Componente de lista editável que permite adicionar múltiplos itens de texto. Possui funcionalidade de drag-and-drop para reordenar itens, edição inline e remoção individual. Ideal para listas abertas onde a ordem importa.

**Exemplo de uso:**
```tsx
<ListInput
  label="Mistérios da Região"
  placeholder="Descreva um mistério..."
  buttonText="Adicionar Mistério"
  value={regionMysteries}
  onChange={setRegionMysteries}
  labelClassName="text-sm font-medium text-primary"
/>
```

**Propriedades principais:**
- `label`: Texto do label do campo
- `placeholder`: Placeholder para o campo de entrada
- `buttonText`: Texto do botão de adicionar (não é usado visualmente, mas mantido para compatibilidade)
- `value`: Array de strings com os itens da lista
- `onChange`: Callback quando a lista é modificada (adicionar, editar, remover ou reordenar)
- `labelClassName`: (Opcional) Classe customizada para o label

**Funcionalidades:**
- ✅ Adicionar novos itens à lista (Enter ou botão +)
- ✅ Editar itens existentes inline
- ✅ Remover itens individuais
- ✅ Drag & Drop para reordenar itens
- ✅ Validação: botão desabilitado quando campo vazio
- ✅ Atalho de teclado: Enter adiciona item, Shift+Enter quebra linha

---
## 12. FormSimplePicker (Seleção Visual com Ícone e Label)
**Componente:** `FormSimplePicker` (`src/components/forms/FormSimplePicker.tsx`)
**Uso:** Seleção visual com ícone no topo e label abaixo, com efeitos de hover e scale (Status de Item, Níveis de Prioridade, Estados)
**Descrição:** Componente leve de seleção visual baseado no StatusPicker. Exibe opções horizontalmente com ícone grande no topo e label pequeno abaixo. Possui efeitos visuais de hover (mudança de cor) e seleção (scale + cor). Perfeito para escolhas visuais onde o ícone é o elemento principal de identificação.

**Diferenças do FormSimpleGrid:**
- **Layout Horizontal**: Opções dispostas em linha (flex), não em grid
- **Mais Visual**: Foco maior no ícone (w-7 h-7 vs w-8 h-8)
- **Efeito Scale**: Hover e seleção possuem animação de escala (105% e 110%)
- **Hover Personalizado**: Usa estilos inline para cores de hover específicas por opção
- **Sem Bordas**: Não possui bordas/cards, apenas ícone + label flutuantes
- **Menos Opções**: Ideal para 3-7 opções (FormSimpleGrid suporta mais)

**Estrutura Visual:**
- **Estado Normal**: Ícone + label em `text-muted-foreground`, scale 100%
- **Estado Hover**: Cores do active (via style tag inline), scale 105%
- **Estado Selecionado**: Cores do active (via className), scale 110%

**Classes de Cor Obrigatórias:**

- **`color`**: Cor base quando NÃO selecionado
  - Geralmente: `"text-muted-foreground"` (cinza neutro)

- **`activeColor`**: Cor quando selecionado (e também hover via style tag)
  - Suporta variantes dark mode: `"text-{cor}-600 dark:text-{cor}-400"`
  - Exemplos:
    - `"text-green-600 dark:text-green-400"` (sucesso, completo)
    - `"text-red-600 dark:text-red-400"` (erro, destruído)
    - `"text-yellow-600 dark:text-yellow-400"` (aviso, ápice)
    - `"text-blue-600 dark:text-blue-400"` (info, fortalecido)
    - `"text-purple-600 dark:text-purple-400"` (especial, selado)
    - `"text-orange-600 dark:text-orange-400"` (alerta, enfraquecido)

**Cores suportadas** (light/dark mode automático):
- green, red, yellow, blue, purple, orange (cores principais)
- slate, cyan, pink, indigo, emerald, lime, amber, teal, sky (cores extras)

**Exemplo de uso básico (Status de Item):**
```tsx
import { GiBroadsword, GiBrokenShield, GiPadlock } from "react-icons/gi";
import { FormSimplePicker } from "@/components/forms/FormSimplePicker";

const ITEM_STATUSES = [
  {
    value: "complete",
    translationKey: "status.complete",
    icon: GiBroadsword,
    color: "text-muted-foreground",
    activeColor: "text-green-600 dark:text-green-400",
  },
  {
    value: "destroyed",
    translationKey: "status.destroyed",
    icon: GiBrokenShield,
    color: "text-muted-foreground",
    activeColor: "text-red-600 dark:text-red-400",
  },
  {
    value: "sealed",
    translationKey: "status.sealed",
    icon: GiPadlock,
    color: "text-muted-foreground",
    activeColor: "text-purple-600 dark:text-purple-400",
  },
];

<FormSimplePicker
  value={itemStatus}
  onChange={setItemStatus}
  label="Item Status"
  required
  options={ITEM_STATUSES}
  translationNamespace="create-item"
  error={errors.status?.message}
/>
```

**Exemplo com ícones Lucide (Prioridade):**
```tsx
import { AlertCircle, TrendingUp, Zap } from "lucide-react";
import { FormSimplePicker } from "@/components/forms/FormSimplePicker";

const PRIORITY_LEVELS = [
  {
    value: "low",
    translationKey: "priority.low",
    icon: AlertCircle,
    color: "text-muted-foreground",
    activeColor: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "medium",
    translationKey: "priority.medium",
    icon: TrendingUp,
    color: "text-muted-foreground",
    activeColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    value: "high",
    translationKey: "priority.high",
    icon: Zap,
    color: "text-muted-foreground",
    activeColor: "text-red-600 dark:text-red-400",
  },
];

<FormSimplePicker
  value={priority}
  onChange={setPriority}
  label="Priority Level"
  options={PRIORITY_LEVELS}
/>
```

**Propriedades principais:**
- `value`: Valor selecionado (string | null)
- `onChange`: Callback quando valor muda
- `options`: Array de opções (value, translationKey, icon, color, activeColor)
- `label`: Label do campo
- `required`: Se o campo é obrigatório (adiciona asterisco)
- `error`: Mensagem de erro (traduzida via i18next)
- `translationNamespace`: Namespace de tradução (default: "translation")

**Quando usar FormSimplePicker vs FormSimpleGrid:**

**Use FormSimplePicker quando:**
- ✅ Tem 3-7 opções visuais
- ✅ Ícone é o elemento principal de identificação
- ✅ Quer efeito visual de scale no hover/seleção
- ✅ Não precisa de bordas/cards (visual mais limpo)
- ✅ Layout horizontal em linha funciona bem
- ✅ Exemplos: Status de item, níveis de prioridade, estados de processo

**Use FormSimpleGrid quando:**
- ✅ Tem muitas opções (8+)
- ✅ Precisa organizar em grid multi-coluna
- ✅ Quer cards com bordas e padding
- ✅ Precisa de layout mais estruturado
- ✅ Quer efeito de ring no selecionado
- ✅ Exemplos: Roles de personagem, tipos de relacionamento, categorias

**Funcionalidades:**
- ✅ Efeito scale animado (hover 105%, selected 110%)
- ✅ Cores customizáveis por opção
- ✅ Suporte light/dark mode automático
- ✅ Tradução via react-i18next
- ✅ Validação com mensagem de erro
- ✅ Campo obrigatório (asterisco)
- ✅ Ícones de qualquer biblioteca (react-icons, lucide-react)
- ✅ Hover com cores específicas por opção (via style tag inline)

---


## 13. FormImageUpload (Upload de Imagem)
**Componente:** `FormImageUpload` (`src/components/forms/FormImageUpload.tsx`)
**Uso:** Upload de imagens com preview e customização de forma
**Descrição:** Componente de upload de imagem altamente customizável. Permite diferentes formas (quadrado, arredondado, circular), ajuste de como a imagem se encaixa no container, e ícone/texto customizável no placeholder. O placeholder possui fundo roxo escuro.

**Exemplo de uso básico:**
```tsx
<FormImageUpload
  value={imageSrc}
  onChange={(value) => form.setValue("image", value)}
  label="Imagem da Região"
  helperText="Recomendado: 1200x448px"
  height="h-[28rem]"
/>
```

**Exemplo avatar circular:**
```tsx
<FormImageUpload
  value={avatar}
  onChange={setAvatar}
  label="Avatar do Personagem"
  shape="circle"
  height="h-40"
  width="w-40"
  imageFit="cover"
  placeholderIcon={User}
/>
```

**Exemplo com ícone customizado:**
```tsx
<FormImageUpload
  value={factionImage}
  onChange={setFactionImage}
  label="Emblema da Facção"
  shape="rounded"
  height="h-64"
  width="w-64"
  placeholderIcon={Shield}
  placeholderText="Adicionar emblema"
/>
```

**Propriedades principais:**
- `value`: Imagem atual (base64 ou URL)
- `onChange`: Callback quando imagem muda
- `label`: Texto do label
- `helperText`: (Opcional) Texto auxiliar/recomendações
- `required`: (Opcional) Se o campo é obrigatório
- `height`: (Opcional) Altura do container (default: "h-[28rem]")
- `width`: (Opcional) Largura do container (default: "w-full")
- `shape`: (Opcional) Forma do container
  - `"square"`: Bordas retas
  - `"rounded"`: Bordas arredondadas (default)
  - `"circle"`: Circular (requer width/height iguais)
- `imageFit`: (Opcional) Como a imagem se encaixa
  - `"fill"`: Preenche todo espaço (pode distorcer) - default
  - `"cover"`: Cobre todo espaço (pode cortar)
  - `"contain"`: Mantém proporção (pode ter espaços vazios)
- `placeholderIcon`: (Opcional) Ícone Lucide para o placeholder (default: ImagePlus)
- `placeholderText`: (Opcional) Texto do placeholder (default: "Click to upload image")
- `accept`: (Opcional) Tipos de arquivo aceitos
- `error`: (Opcional) Mensagem de erro
- `id`: (Opcional) ID do input
- `showLabel`: (Opcional) Mostrar label (default: true)
- `labelClassName`: (Opcional) Classes CSS para label

**Funcionalidades:**
- ✅ Upload via clique
- ✅ Preview da imagem
- ✅ Botão de remover imagem
- ✅ Placeholder com fundo roxo escuro (bg-purple-950/40)
- ✅ Ícone customizável no placeholder
- ✅ Três formas: quadrado, arredondado, circular
- ✅ Três modos de fit: fill, cover, contain
- ✅ Validação e mensagens de erro
- ✅ Helper text para recomendações de tamanho
