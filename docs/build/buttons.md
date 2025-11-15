# Documentação de Botões - Grimorium

Este documento descreve os padrões padronizados de botões utilizados no projeto, com base no design refinado da Tab Mundo (World).

## Índice
- [Visão Geral do Padrão](#visão-geral-do-padrão)
- [Componente Base](#componente-base)
- [Variantes Padronizadas](#variantes-padronizadas)
- [Tamanhos](#tamanhos)
- [Padrões Comuns de Uso](#padrões-comuns-de-uso)
- [Animações](#animações)
- [Matriz de Decisão](#matriz-de-decisão)
- [Exemplos Completos](#exemplos-completos)

---

## Visão Geral do Padrão

O Grimorium utiliza **4 variantes principais** de botões para manter consistência visual e UX:

1. **Magical** - Ações primárias (SEMPRE com ícone + texto)
2. **Outline** - Navegação e ações secundárias (com ícone OU texto)
3. **Destructive** - Confirmações destrutivas (SOMENTE texto, em modais)
4. **Ghost** - Botões de ícone e ações sutis (SOMENTE ícone, com variação vermelha para exclusões)

> **Importante**: As variantes `default`, `secondary`, `accent` e `link` estão sendo gradualmente substituídas e **NÃO devem ser usadas** em novas implementações.

---

## Componente Base

**Localização**: `src/components/ui/button.tsx`

**Import**:
```tsx
import { Button } from "@/components/ui/button";
```

---

## Variantes Padronizadas

### 1. Magical (Ação Principal)

**Regra**: SEMPRE com ícone + texto

```tsx
// ✅ CORRETO - Com ícone + texto
<Button variant="magical" className="animate-glow">
  <Plus className="w-4 h-4 mr-2" />
  Nova Região
</Button>

<Button variant="magical" className="animate-glow">
  <Save className="w-4 h-4 mr-2" />
  Salvar
</Button>

// ❌ ERRADO - Sem ícone
<Button variant="magical" className="animate-glow">
  Salvar
</Button>
```

**Características**:
- `variant="magical"`: Gradiente roxo/violeta
- `className="animate-glow"`: **OBRIGATÓRIO** - Animação de brilho pulsante
- Ícone: **OBRIGATÓRIO** - Sempre à esquerda com `mr-2`
- Hover: Aumenta brilho e saturação

**Quando Usar**:
- Criar novas entidades (Nova Região, Criar Personagem, etc.)
- Salvar alterações
- Confirmar ações importantes em modais (não destrutivas)
- Ações primárias de CTAs

**Referências**:
- `src/pages/dashboard/tabs/world/region-detail/view.tsx:298` - Botão Salvar
- `src/components/modals/create-region-modal.tsx:865` - Botão Criar/Salvar
- `src/pages/dashboard/tabs/world/region-detail/components/create-version-dialog.tsx:209` - Botão Continuar

---

### 2. Outline (Navegação e Secundário)

**Regra**: Pode ter ícone OU texto (com ícone preferencial)

```tsx
// ✅ CORRETO - Com ícone + texto (preferencial)
<Button variant="outline">
  <ArrowLeft className="w-4 h-4 mr-2" />
  Voltar
</Button>

<Button variant="outline">
  <X className="w-4 h-4 mr-2" />
  Cancelar
</Button>

// ✅ CORRETO - Apenas ícone (para toolbars)
<Button variant="outline" size="icon">
  <Map className="w-4 h-4" />
</Button>

// ⚠️ ACEITÁVEL - Apenas texto (evitar quando possível)
<Button variant="outline">
  Cancelar
</Button>
```

**Características**:
- `variant="outline"`: Borda com fundo transparente
- `size="icon"`: Para botões quadrados apenas com ícone
- Hover: Fundo roxo com texto branco e sombra
- Ícone: **Preferencial** mas não obrigatório

**Quando Usar**:
- Botões "Voltar"
- Botões "Cancelar" em modais
- Navegação secundária
- Botões de toolbar (com `size="icon"`)

**Referências**:
- `src/pages/dashboard/tabs/world/region-detail/view.tsx:275` - Botão Voltar
- `src/pages/dashboard/tabs/world/region-detail/view.tsx:294` - Botão Cancelar
- `src/components/modals/create-region-modal.tsx:856` - Botão Cancelar (modal)

---

### 3. Destructive (Confirmações Destrutivas)

**Regra**: SOMENTE texto (em modais de confirmação)

```tsx
// ✅ CORRETO - Apenas texto em modal de confirmação
<Button variant="destructive" size="lg" className="animate-glow-red">
  Excluir Permanentemente
</Button>

<Button variant="destructive" size="lg" className="animate-glow-red">
  Descartar Alterações
</Button>

// ❌ ERRADO - Com ícone
<Button variant="destructive" size="icon">
  <Trash2 className="w-4 h-4" />
</Button>
```

**Características**:
- `variant="destructive"`: Cor vermelha destrutiva
- `size="lg"`: **Preferencial** para destaque em modais
- `className="animate-glow-red"`: **OBRIGATÓRIO** - Animação de brilho vermelho
- Ícone: **NÃO USAR** - Apenas texto

**Quando Usar**:
- Confirmação final de exclusão em AlertDialog
- Descartar alterações não salvas
- Ações destrutivas irreversíveis (APENAS em modais de confirmação)

**Referências**:
- `src/pages/dashboard/tabs/world/components/delete-region-confirmation-dialog.tsx:106` - Confirmar exclusão de versão
- `src/pages/dashboard/tabs/world/components/delete-region-confirmation-dialog.tsx:218` - Confirmar exclusão de região
- `src/pages/dashboard/tabs/world/region-detail/components/unsaved-changes-dialog.tsx:44` - Descartar alterações

---

### 4. Ghost (Botões de Ícone)

**Regra**: SOMENTE ícone (padrão ou vermelho para exclusões)

```tsx
// ✅ CORRETO - Apenas ícone (padrão)
<Button variant="ghost" size="icon">
  <Edit2 className="w-4 h-4" />
</Button>

<Button variant="ghost" size="icon">
  <Menu className="w-5 h-5" />
</Button>

// ✅ CORRETO - Apenas ícone (vermelho para exclusão)
<Button
  variant="ghost"
  size="icon"
  className="hover:bg-destructive/10 hover:text-destructive"
>
  <Trash2 className="w-4 h-4" />
</Button>

// ❌ ERRADO - Com texto
<Button variant="ghost">
  <Edit2 className="w-4 h-4 mr-2" />
  Editar
</Button>
```

**Características**:
- `variant="ghost"`: Sem fundo, apenas hover com fundo sutil
- `size="icon"`: **OBRIGATÓRIO** - Sempre quadrado
- Hover padrão: Fundo accent discreto
- Hover vermelho: `className="hover:bg-destructive/10 hover:text-destructive"`
- Ícone: **OBRIGATÓRIO** - Sem texto

**Quando Usar**:
- Botões de ação em headers (Editar, Ver Mapa, etc.)
- Botões de ação em cards/items (Adicionar, Editar, Deletar)
- Toggle de menu/sidebar
- Remover itens (com hover vermelho)
- Fechar modais/sidebars

**Referências**:
- `src/pages/dashboard/tabs/world/region-detail/view.tsx:329` - Botões do header (Ver Mapa, Editar)
- `src/pages/dashboard/tabs/world/region-detail/view.tsx:335` - Botão Deletar (hover vermelho)
- `src/pages/dashboard/tabs/world/region-detail/components/region-timeline.tsx:393` - Botões de ação em eras

---

## Tamanhos

```tsx
// Padrão (40px altura)
<Button size="default">Botão Padrão</Button>

// Pequeno (36px altura)
<Button size="sm">Botão Pequeno</Button>

// Grande (44px altura)
<Button size="lg">Botão Grande</Button>

// Ícone (40x40px quadrado)
<Button size="icon">
  <Plus className="w-4 h-4" />
</Button>
```

**Quando usar cada tamanho**:
- `default`: Uso geral em formulários e actions
- `sm`: Botões compactos em cards ou listas (ex: timeline)
- `lg`: Ações primárias importantes, modais de confirmação
- `icon`: **OBRIGATÓRIO** para botões `ghost` e `outline` apenas com ícone

---

## Padrões Comuns de Uso

### 1. Header de Detail Page (Modo Visualização)

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <Button variant="outline" onClick={onBack}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      Voltar
    </Button>
  </div>

  <div className="flex gap-2">
    {/* Botões de ação - Ghost */}
    <Button variant="ghost" size="icon" onClick={onViewMap}>
      <Map className="w-4 h-4" />
    </Button>

    <Button variant="ghost" size="icon" onClick={onEdit}>
      <Edit2 className="w-4 h-4" />
    </Button>

    {/* Deletar - Ghost com hover vermelho */}
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
</div>
```

**Referência**: `src/pages/dashboard/tabs/world/region-detail/view.tsx:270-343`

---

### 2. Header de Detail Page (Modo Edição)

```tsx
<div className="flex gap-2">
  <Button variant="outline" onClick={onCancel}>
    <X className="w-4 h-4 mr-2" />
    Cancelar
  </Button>

  <Button
    variant="magical"
    className="animate-glow"
    onClick={onSave}
    disabled={!hasChanges}
  >
    <Save className="w-4 h-4 mr-2" />
    Salvar
  </Button>
</div>
```

**Referência**: `src/pages/dashboard/tabs/world/region-detail/view.tsx:293-306`

---

### 3. Footer de Modal de Criação/Edição

```tsx
<DialogFooter>
  <Button variant="outline" onClick={onClose}>
    <X className="w-4 h-4 mr-2" />
    Cancelar
  </Button>

  <Button
    type="submit"
    variant="magical"
    size="lg"
    className="animate-glow"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        {editMode ? "Salvando..." : "Criando..."}
      </>
    ) : (
      <>
        {editMode ? (
          <Save className="w-4 h-4 mr-2" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        )}
        {editMode ? "Salvar" : "Criar"}
      </>
    )}
  </Button>
</DialogFooter>
```

**Referência**: `src/components/modals/create-region-modal.tsx:855-882`

---

### 4. Footer de Modal de Confirmação (Destrutivo)

```tsx
<AlertDialogFooter>
  <AlertDialogCancel onClick={onCancel}>
    Cancelar
  </AlertDialogCancel>

  <Button
    variant="destructive"
    size="lg"
    className="animate-glow-red"
    onClick={onConfirm}
  >
    Excluir Permanentemente
  </Button>
</AlertDialogFooter>
```

**Referência**: `src/pages/dashboard/tabs/world/components/delete-region-confirmation-dialog.tsx:214-226`

---

### 5. Botões de Ação em Cards/Listas (Timeline, etc.)

```tsx
<div className="flex gap-0.5">
  {/* Adicionar */}
  <Button size="sm" variant="ghost" onClick={onAdd}>
    <Plus className="w-3 h-3" />
  </Button>

  {/* Editar */}
  <Button size="sm" variant="ghost" onClick={onEdit}>
    <Edit className="w-3 h-3" />
  </Button>

  {/* Deletar - hover vermelho */}
  <Button
    size="sm"
    variant="ghost"
    onClick={onDelete}
    className="hover:bg-destructive/10 hover:text-destructive"
  >
    <Trash2 className="w-3 h-3" />
  </Button>
</div>
```

**Referência**: `src/pages/dashboard/tabs/world/region-detail/components/region-timeline.tsx:390-457`

---

## Animações

### animate-glow (Roxo/Violeta)

**Obrigatório** para botões `magical`.

```tsx
<Button variant="magical" className="animate-glow">
  <Save className="w-4 h-4 mr-2" />
  Salvar
</Button>
```

**CSS** (em `src/index.css`):
```css
.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px hsl(263 70% 50% / 0.2);
  }
  to {
    box-shadow: 0 0 30px hsl(263 70% 50% / 0.4);
  }
}
```

---

### animate-glow-red (Vermelho)

**Obrigatório** para botões `destructive`.

```tsx
<Button variant="destructive" className="animate-glow-red">
  Excluir Permanentemente
</Button>
```

**CSS** (em `src/index.css`):
```css
.animate-glow-red {
  animation: glow-red 2s ease-in-out infinite alternate;
}

@keyframes glow-red {
  from {
    box-shadow: 0 0 20px hsl(0 62.8% 50% / 0.2);
  }
  to {
    box-shadow: 0 0 30px hsl(0 62.8% 50% / 0.4);
  }
}
```

---

## Matriz de Decisão

| Contexto | Variante | Tamanho | Ícone | Animação | Exemplo |
|----------|----------|---------|-------|----------|---------|
| **Criar Entidade** | `magical` | `lg` | ✅ Obrigatório (esquerda) | `animate-glow` | Criar Região, Novo Personagem |
| **Salvar/Confirmar** | `magical` | `default`/`lg` | ✅ Obrigatório (esquerda) | `animate-glow` | Salvar, Confirmar |
| **Voltar** | `outline` | `default` | ✅ Preferencial (esquerda) | - | Voltar |
| **Cancelar (Modal)** | `outline` | `default` | ✅ Preferencial (esquerda) | - | Cancelar, Fechar |
| **Botão Toolbar** | `ghost` | `icon` | ✅ Obrigatório (sem texto) | - | Editar, Ver Mapa |
| **Deletar (Icon)** | `ghost` | `icon` | ✅ Obrigatório (sem texto) | - | Trash icon com hover vermelho |
| **Confirmar Exclusão** | `destructive` | `lg` | ❌ Proibido | `animate-glow-red` | Excluir Permanentemente |
| **Descartar Changes** | `destructive` | `lg` | ❌ Proibido | `animate-glow-red` | Descartar Alterações |

---

## Regras de Design

### 1. Hierarquia Visual
- **Máximo 1 botão `magical`** por seção/tela
- **Botões destrutivos** sempre à direita ou em destaque
- **Ações primárias** à direita, secundárias à esquerda

### 2. Espaçamento
```tsx
// Grupo de botões no header
<div className="flex gap-2">
  <Button variant="ghost" size="icon">...</Button>
  <Button variant="ghost" size="icon">...</Button>
</div>

// Footer de modal
<DialogFooter className="gap-2">
  <Button variant="outline">Cancelar</Button>
  <Button variant="magical">Confirmar</Button>
</DialogFooter>
```

### 3. Estados Disabled
```tsx
// Desabilitar quando não há mudanças
<Button
  variant="magical"
  disabled={!hasChanges}
  className="animate-glow"
>
  <Save className="w-4 h-4 mr-2" />
  Salvar
</Button>

// Desabilitar durante loading
<Button disabled={isLoading} variant="magical" className="animate-glow">
  {isLoading ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Salvando...
    </>
  ) : (
    <>
      <Save className="w-4 h-4 mr-2" />
      Salvar
    </>
  )}
</Button>
```

### 4. Ícones

**Tamanhos**:
- Botões normais: `className="w-4 h-4"`
- Botões pequenos (`size="sm"`): `className="w-3 h-3"`
- Botões de menu: `className="w-5 h-5"`

**Posicionamento**:
```tsx
// Ícone à esquerda (padrão)
<Button>
  <Plus className="w-4 h-4 mr-2" />
  Novo
</Button>

// Ícone à direita (raro)
<Button>
  Próximo
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>

// Apenas ícone
<Button size="icon">
  <Edit className="w-4 h-4" />
</Button>
```

---

## Checklist: Implementação de Botões

Ao criar um novo botão, verifique:

- [ ] A variante está correta (ver Matriz de Decisão)?
- [ ] Se é `magical`: Tem ícone + texto + `animate-glow`?
- [ ] Se é `destructive`: É em modal E tem apenas texto + `animate-glow-red`?
- [ ] Se é `ghost`: Tem apenas ícone + `size="icon"`?
- [ ] Se é `outline`: Tem ícone preferencial (exceto cancelar)?
- [ ] Ícones têm tamanho correto (`w-4 h-4` padrão)?
- [ ] Spacing de ícone está correto (`mr-2` ou `ml-2`)?
- [ ] Estados de loading implementados com `Loader2`?
- [ ] Estados disabled estão corretos?
- [ ] Para icon-only: Tem Tooltip explicativo?
- [ ] Textos usam tradução (`t()`) quando aplicável?
- [ ] Hierarquia visual está clara (máximo 1 magical por seção)?

---

## Variantes Descontinuadas

As seguintes variantes **NÃO devem ser usadas** em novas implementações e estão sendo gradualmente substituídas:

- ~~`default`~~ → Use `outline` para navegação/secundário ou `magical` para primário
- ~~`secondary`~~ → Use `outline`
- ~~`accent`~~ → Use `magical`
- ~~`link`~~ → Use `outline` ou `ghost`

Código existente com essas variantes será migrado progressivamente. **Não crie novos botões com essas variantes.**

---

## Componentes Auxiliares

### EditControls

Componente já pronto para botões Editar/Salvar/Cancelar (legacy - considerar deprecação).

**Localização**: `src/components/detail-page/EditControls.tsx`

> **Nota**: Este componente será revisado para seguir os novos padrões. Prefira implementar botões individuais conforme os padrões acima.
