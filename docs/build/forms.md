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

**⚠️ IMPORTANTE - Classes de Cor Obrigatórias:**
Para manter a consistência visual com o resto do projeto, você **DEVE** passar as classes de cor manualmente para cada opção:

- **`baseColorClass`**: Estado neutro/não selecionado
  - Padrão: `"bg-card text-muted-foreground border-border"`

- **`hoverColorClass`**: Estado hover (fundo transparente colorido + borda colorida fraca)
  - Padrão: `"hover:bg-{cor}-500/10 hover:border-{cor}-500/20"`
  - Exemplo: `"hover:bg-emerald-500/10 hover:border-emerald-500/20"`

- **`activeColorClass`**: Estado selecionado (fundo transparente colorido mais forte + borda colorida + ring)
  - Padrão: `"bg-{cor}-500/20 border-{cor}-500/30 ring-2 ring-{cor}-500/50 text-white"`
  - Exemplo: `"bg-emerald-500/20 border-emerald-500/30 ring-2 ring-emerald-500/50 text-white"`

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
      activeColorClass: "bg-emerald-500/20 border-emerald-500/30 ring-2 ring-emerald-500/50 text-white",
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
**Uso:** Seleção única em grid com ícone no topo e label abaixo (Roles de Personagem, Status, Categorias)
**Descrição:** Grid de botões com layout vertical: ícone no topo e label abaixo. **Diferente do FormSelectGrid** que tem layout horizontal (ícone à esquerda, label à direita). Não possui campo de descrição. Ideal para seleções visuais simples onde o ícone é o elemento principal.

**⚠️ IMPORTANTE - Classes de Cor Obrigatórias:**
Assim como o FormSelectGrid, você **DEVE** passar as classes de cor manualmente para cada opção para manter a consistência visual:

- **`baseColorClass`**: Estado neutro/não selecionado
  - Padrão: `"bg-card text-muted-foreground border-border"`

- **`hoverColorClass`**: Estado hover (fundo transparente colorido + borda colorida fraca)
  - Padrão: `"hover:bg-{cor}-500/10 hover:border-{cor}-500/20"`
  - Exemplo: `"hover:bg-yellow-500/10 hover:border-yellow-500/20"`

- **`activeColorClass`**: Estado selecionado (fundo transparente colorido mais forte + borda colorida + ring)
  - Padrão: `"bg-{cor}-500/20 border-{cor}-500/30 ring-2 ring-{cor}-500/50"`
  - Exemplo: `"bg-yellow-500/20 border-yellow-500/30 ring-2 ring-yellow-500/50"`

**Exemplo de uso:**
```tsx
<FormSimpleGrid
  value={role}
  onChange={setRole}
  label="Role do Personagem"
  required
  columns={5}
  options={[
    {
      value: "protagonist",
      label: "Protagonista",
      icon: Star,
      baseColorClass: "bg-card text-muted-foreground border-border",
      hoverColorClass: "hover:bg-yellow-500/10 hover:border-yellow-500/20",
      activeColorClass: "bg-yellow-500/20 border-yellow-500/30 ring-2 ring-yellow-500/50",
    },
    {
      value: "antagonist",
      label: "Antagonista",
      icon: Swords,
      baseColorClass: "bg-card text-muted-foreground border-border",
      hoverColorClass: "hover:bg-orange-500/10 hover:border-orange-500/20",
      activeColorClass: "bg-orange-500/20 border-orange-500/30 ring-2 ring-orange-500/50",
    },
    // ... mais opções
  ]}
/>
```

**Propriedades principais:**
- `columns`: Número de colunas (2, 3, 4, 5 ou 6)
- `label`: Texto do label do campo
- `required`: Se o campo é obrigatório
- `error`: Mensagem de erro opcional
- `className`: Classe CSS customizada para o grid
- **`baseColorClass`**: Classes CSS para estado neutro (OBRIGATÓRIO)
- **`hoverColorClass`**: Classes CSS para hover (OBRIGATÓRIO)
- **`activeColorClass`**: Classes CSS para selecionado (OBRIGATÓRIO)

**Diferenças do FormSelectGrid:**
- ✅ **Layout Vertical**: Ícone no topo, label abaixo
- ✅ **Sem Descrição**: Apenas ícone e label (mais compacto)
- ✅ **Mais Colunas**: Suporta até 6 colunas (FormSelectGrid limita a 4)
- ✅ **Uso**: Ideal para seleções simples e visuais (roles, status, categorias)

**Casos de uso no projeto:**
- **Roles de Personagem:** Protagonista, Antagonista, Vilão, Secundário, Extra
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

## 12. FormImageUpload (Upload de Imagem)
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
