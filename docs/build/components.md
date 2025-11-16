# Componentes Gerais

Classificação dos componentes reutilizáveis gerais utilizados no projeto (excluindo formulários e botões).

**Localização:** `src/components/`

---

## 1. EntitySearchBar (Barra de Busca)
**Componente:** `EntitySearchBar` (`src/components/entity-list/EntitySearchBar.tsx`)
**Uso:** Barra de busca com ícone para filtrar listas de entidades
**Descrição:** Input de busca reutilizável com ícone de lupa à esquerda. Padrão consistente usado em todas as tabs.

**Exemplo de uso:**
```tsx
<EntitySearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Buscar regiões..."
/>
```

**Propriedades:**
- `value`: Valor atual da busca
- `onChange`: Callback quando o valor muda
- `placeholder`: Texto do placeholder
- `className`: (Opcional) Classes CSS adicionais
- `maxWidth`: (Opcional) Largura máxima (default: "max-w-md")

---

## 2. InfoAlert (Alerta Informativo)
**Componente:** `InfoAlert` (`src/components/ui/info-alert.tsx`)
**Uso:** Avisos e informações destacadas em modais e páginas
**Descrição:** Caixa de alerta estilizada com ícone de informação e fundo colorido. Usado para comunicar informações importantes ao usuário.

**Exemplo de uso:**
```tsx
<InfoAlert>
  Tudo pode ser editado mais tarde. Algumas seções especiais só podem ser adicionadas após a criação da região.
</InfoAlert>
```

**Propriedades:**
- `children`: Conteúdo do alerta (ReactNode)
- `className`: (Opcional) Classes CSS adicionais

**Características:**
- ✅ Fundo azul claro (primary/10)
- ✅ Borda azul (primary/30)
- ✅ Ícone de informação automático
- ✅ Tipografia otimizada

---

## 3. Badge (Distintivo)
**Componente:** `Badge` (`src/components/ui/badge.tsx`)
**Uso:** Tags e distintivos visuais para categorizar e destacar informações
**Descrição:** Distintivo pequeno e arredondado com múltiplas variantes de estilo. Usado para escalas, categorias, status, etc.

**Exemplo de uso:**
```tsx
{/* Badge simples */}
<Badge>Default</Badge>

{/* Badge com variante */}
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Destrutivo</Badge>
<Badge variant="outline">Contorno</Badge>

{/* Badge customizado com classes */}
<Badge className="bg-emerald-500 text-white">
  Escala Local
</Badge>
```

**Variantes:**
- `default`: Fundo primary, texto branco
- `secondary`: Fundo secondary
- `destructive`: Fundo vermelho destrutivo
- `outline`: Apenas contorno, sem fundo

---

## 4. CollapsibleSection (Seção Colapsável)
**Componente:** `CollapsibleSection` (`src/components/detail-page/CollapsibleSection.tsx`)
**Uso:** Seções colapsáveis genéricas para organizar conteúdo
**Descrição:** Seção com header clicável que expande/colapsa conteúdo. Permite ícone customizado e título flexível.

**Exemplo de uso:**
```tsx
<CollapsibleSection
  title="Linha do Tempo"
  icon={<Clock className="h-5 w-5" />}
  isOpen={timelineSectionOpen}
  onToggle={() => setTimelineSectionOpen(!timelineSectionOpen)}
>
  {/* Conteúdo da seção */}
  <RegionTimeline ... />
</CollapsibleSection>
```

**Propriedades:**
- `title`: Título da seção
- `icon`: (Opcional) Ícone React Component
- `isOpen`: Estado de abertura/fechamento
- `onToggle`: Callback quando seção é clicada
- `children`: Conteúdo da seção
- `className`: (Opcional) Classes CSS adicionais para container
- `contentClassName`: (Opcional) Classes CSS para conteúdo
- `headerClassName`: (Opcional) Classes CSS para header

**Características:**
- ✅ Animação suave de expansão/colapso
- ✅ Ícone de seta rotativa
- ✅ Hover state no header
- ✅ Totalmente customizável

---

## 5. FieldWithVisibilityToggle (Campo com Visibilidade)
**Componente:** `FieldWithVisibilityToggle` (`src/components/detail-page/FieldWithVisibilityToggle.tsx`)
**Uso:** Wrapper para campos opcionais que podem ser ocultados no modo visualização
**Descrição:** Componente que envolve campos permitindo ocultar/mostrar em páginas de detalhes. Usado para campos opcionais que o usuário pode não querer ver.

**Exemplo de uso:**
```tsx
<FieldWithVisibilityToggle
  fieldName="climate"
  label="Clima"
  isOptional={true}
  fieldVisibility={fieldVisibility}
  isEditing={isEditing}
  onFieldVisibilityToggle={handleToggleVisibility}
>
  {isEditing ? (
    <Textarea
      value={editData.climate}
      onChange={(e) => setEditData({ ...editData, climate: e.target.value })}
    />
  ) : (
    <p>{region.climate || "Não especificado"}</p>
  )}
</FieldWithVisibilityToggle>
```

**Propriedades:**
- `fieldName`: Identificador único do campo
- `label`: Label do campo
- `children`: Conteúdo do campo (input ou texto)
- `isOptional`: Se o campo é opcional (default: true)
- `fieldVisibility`: Objeto com estado de visibilidade dos campos
- `isEditing`: Se está em modo edição
- `onFieldVisibilityToggle`: Callback para alternar visibilidade
- `className`: (Opcional) Classes CSS adicionais

**Comportamento:**
- **Modo Visualização:**
  - Campo visível: Mostra normalmente
  - Campo oculto: Campo não aparece na tela

- **Modo Edição:**
  - Campo visível: Mostra normalmente com botão de olho
  - Campo oculto: Mostra com opacidade 50%, fundo cinza e borda pontilhada + botão de olho

**Regras importantes:**
- ✅ Apenas campos OPCIONAIS podem ser ocultados
- ✅ Campos obrigatórios (isOptional=false) não têm botão de ocultar
- ✅ Ícone de olho para alternar visibilidade
- ✅ Indicador visual (asterisco *) para campos obrigatórios

