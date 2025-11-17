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

**Variantes padrão:**
- `default`: Fundo primary, texto branco
- `secondary`: Fundo secondary
- `destructive`: Fundo vermelho destrutivo
- `outline`: Apenas contorno, sem fundo

---

### 3.1. EntityTagBadge (Tag Genérica)
**Componente:** `EntityTagBadge` (`src/components/ui/entity-tag-badge.tsx`)
**Uso:** Tag padronizada para categorização de entidades (Role, Scale, Status, Type, etc.)
**Descrição:** Componente genérico para exibir tags com ícone + texto + background colorido translúcido. Segue o padrão visual estabelecido no projeto.

**Exemplo de uso:**
```tsx
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { CHARACTER_ROLES_CONSTANT } from "@/constants/character-roles";

// No componente
const roleData = CHARACTER_ROLES_CONSTANT.find(r => r.value === character.role);

// Renderização
{roleData && (
  <EntityTagBadge
    config={roleData}
    label={t(`create-character:role.${character.role}`)}
  />
)}
```

**Propriedades:**
- `config`: Objeto `IEntityTagConfig` com configuração da tag (value, icon, translationKey, colorClass, bgColorClass)
- `label`: Texto a ser exibido na tag (já traduzido)
- `className`: (Opcional) Classes CSS adicionais

**Interface IEntityTagConfig:**
```typescript
export interface IEntityTagConfig {
  value: string;           // Valor único da tag
  icon: LucideIcon;        // Ícone Lucide
  translationKey: string;  // Chave de tradução
  colorClass: string;      // Classe de cor do texto
  bgColorClass: string;    // Classe de background + borda (SEM HOVER)
}
```

**Características:**
- ✅ Ícone: `w-3.5 h-3.5 mr-1.5`
- ✅ Padding: `px-3 py-1`
- ✅ Texto: `text-xs font-medium`
- ✅ SEM estado de hover (apenas visualização)
- ✅ Cores do texto: `text-[color]-600 dark:text-[color]-400`
- ✅ Background: `bg-[color]-500/10` (opacidade 10%)
- ✅ Borda: `border-[color]-500/30` (opacidade 30%)
- ❌ **NÃO usar** `hover:bg-[color]-500/20` (removido por ser apenas visualização)

---

### 3.2. Tags Padronizadas (Pattern Manual)

**Uso:** Implementação manual de tags quando não for usar o `EntityTagBadge`
**Quando usar:** Casos específicos que precisam de customização além do componente padrão
**Padrão:** Baseado no Role Badge da tab Characters
**⚠️ Recomendação:** Use o `EntityTagBadge` (seção 3.1) sempre que possível

#### Estrutura da Constante

```typescript
export interface ITagConfig {
  value: string;           // Valor único da tag
  icon: LucideIcon;        // Ícone Lucide
  translationKey: string;  // Chave de tradução
  colorClass: string;      // Classe de cor do texto
  bgColorClass: string;    // Classe de background + borda + hover
}

export const TAG_CONSTANT: ITagConfig[] = [
  {
    value: "example",
    icon: IconName,
    translationKey: "namespace.example",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20",
  },
  // ... outros valores
];
```

#### Aplicação no Badge

```tsx
// No componente
const tagData = TAG_CONSTANT.find(t => t.value === entity.tagValue);
const TagIcon = tagData?.icon;

// Renderização
<Badge className={`${tagData?.bgColorClass} ${tagData?.colorClass} border px-3 py-1`}>
  {TagIcon && <TagIcon className="w-3.5 h-3.5 mr-1.5" />}
  <span className="text-xs font-medium">
    {t(tagData?.translationKey)}
  </span>
</Badge>
```

#### Características do Padrão

- **Ícone**: `w-3.5 h-3.5 mr-1.5` (tamanho fixo + margem direita)
- **Padding**: `px-3 py-1` (horizontal e vertical)
- **Texto**: `text-xs font-medium` (pequeno e destacado)
- **Classes**: `${bgColorClass} ${colorClass} border` (exatamente nessa ordem)
- **Cores do texto**: `text-[color]-600 dark:text-[color]-400`
- **Background**: `bg-[color]-500/10` (opacidade 10%)
- **Borda**: `border-[color]-500/30` (opacidade 30%)
- **Hover**: ❌ **NÃO usar** - Tags são apenas para visualização

#### Exemplos de Implementação

**1. Role Badge (Characters)** - ⚠️ Atualizar para remover hover
```typescript
// constants/character-roles.ts
export const CHARACTER_ROLES_CONSTANT: ICharacterRole[] = [
  {
    value: "protagonist",
    icon: Crown,
    translationKey: "role.protagonist",
    colorClass: "text-yellow-600 dark:text-yellow-400",
    bgColorClass: "bg-yellow-500/10 border-yellow-500/30", // SEM HOVER
  },
  // ...
];
```

**2. Scale Badge (World)** - ⚠️ Atualizar para remover hover
```typescript
// constants/scale-colors.ts
export const REGION_SCALES_CONSTANT: IRegionScale[] = [
  {
    value: "planetary",
    icon: Globe,
    translationKey: "scales.planetary",
    colorClass: "text-violet-600 dark:text-violet-400",
    bgColorClass: "bg-violet-500/10 border-violet-500/30", // SEM HOVER
  },
  // ...
];
```

#### Diferença: Tags vs Cards

**Tags** (use este padrão):
- ✅ Pequenas (uma linha)
- ✅ Ícone + texto curto
- ✅ Background translúcido
- ✅ Usado para categorização rápida
- **Exemplos:** Role, Scale, Status, Type

**Cards** (NÃO use este padrão):
- ❌ Maiores (múltiplas linhas)
- ❌ Mais informações complexas
- ❌ Podem ter interação
- **Exemplos:** Alignment Matrix, Season Selector, Parent Region Info

#### Checklist de Implementação

**Usando EntityTagBadge (Recomendado):**
- [ ] Criar constante com interface `IEntityTagConfig`
- [ ] Definir valores, ícones e chaves de tradução
- [ ] Aplicar cores: `text-[color]-600 dark:text-[color]-400`
- [ ] Aplicar background: `bg-[color]-500/10 border-[color]-500/30` (SEM HOVER)
- [ ] Importar e usar `EntityTagBadge` passando config e label traduzido

**Implementação manual (Não recomendado):**
- [ ] Criar constante com interface customizada
- [ ] Usar estrutura: `className={`${bgColorClass} ${colorClass} border px-3 py-1`}`
- [ ] Ícone com `w-3.5 h-3.5 mr-1.5`
- [ ] Texto com `text-xs font-medium`
- [ ] NÃO incluir hover na bgColorClass

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

