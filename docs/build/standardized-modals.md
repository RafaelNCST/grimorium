# Modais Padronizados - Guia Completo

**Última atualização:** 2025-12-14

Este documento detalha os padrões visuais e de uso para todos os modais de delete e warning no projeto. Todos os modais seguem um design system consistente para garantir uma experiência de usuário uniforme.

---

## Índice
1. [Padrão Visual](#padrão-visual)
2. [Componentes Genéricos](#componentes-genéricos)
3. [Guia de Uso](#guia-de-uso)
4. [Especificações Técnicas](#especificações-técnicas)

---

## Padrão Visual

### DELETE MODALS (Modais de Exclusão)

**Características visuais:**
- **Ícone:** `AlertTriangle` (lucide-react)
- **Container do ícone:** `rounded-lg bg-destructive/10 p-2`
- **Cor do ícone:** `text-destructive` (vermelho)
- **Tamanho do ícone:** `h-5 w-5`
- **Título:** `text-left` (alinhado à esquerda)
- **Descrição:** `pt-4 text-left font-medium text-foreground`
- **Footer:** `flex justify-end gap-2`
- **Max-width:** `sm:max-w-md`

**Botões:**
- **Cancelar:** `AlertDialogCancel` (estilo outline padrão)
- **Excluir:** `AlertDialogAction` com `variant="destructive"` `size="lg"` `animate-glow-red`

**Exemplo visual:**
```
┌─────────────────────────────────────┐
│ [🔺]                                │  <- Ícone vermelho em container lg
│                                      │
│ Excluir Item                         │  <- Título (text-left)
│                                      │
│ Tem certeza que deseja excluir      │  <- Descrição (pt-4, font-medium)
│ este item? Esta ação não pode       │
│ ser desfeita.                       │
│                                      │
│              [Cancelar] [Excluir]   │  <- Botões (justify-end)
└─────────────────────────────────────┘
```

---

### WARNING MODALS (Modais de Aviso)

**Características visuais:**
- **Ícone:** `AlertTriangle` (lucide-react)
- **Container do ícone:** `rounded-lg bg-yellow-500/10 p-2`
- **Cor do ícone:** `text-yellow-600 dark:text-yellow-500` (amarelo)
- **Tamanho do ícone:** `h-5 w-5`
- **Título:** `text-left` (alinhado à esquerda)
- **Descrição:** `pt-4 text-left font-medium text-foreground`
- **Footer:** `flex flex-col sm:flex-row gap-2` (responsivo)
- **Max-width:** `sm:max-w-md`

**Botões:**
- **Cancelar:** `AlertDialogCancel` com `m-0 flex-1`
- **Confirmar:** `Button` com `variant="destructive"` `size="lg"` `animate-glow-red flex-1`

**Exemplo visual:**
```
┌─────────────────────────────────────┐
│ [⚠️]                                 │  <- Ícone amarelo em container lg
│                                      │
│ Descartar alterações?               │  <- Título (text-left)
│                                      │
│ Você tem alterações não salvas.     │  <- Descrição (pt-4, font-medium)
│ Se continuar, todas as mudanças     │
│ serão perdidas.                     │
│                                      │
│ [Cancelar]        [Confirmar]       │  <- Botões (flex-1, responsivo)
└─────────────────────────────────────┘
```

---

## Componentes Genéricos

### 1. StandardDeleteModal

**Localização:** `src/components/modals/standard-delete-modal.tsx`

**Uso:** Modal genérico de exclusão com validação de nome opcional e suporte a loading.

**Props:**
```typescript
interface StandardDeleteModalProps {
  open: boolean;                    // Se o modal está aberto
  onOpenChange: (open: boolean) => void;  // Callback de mudança de estado
  onConfirm: () => void | Promise<void>;  // Ação ao confirmar
  title: string;                    // Título do modal
  description: string;              // Descrição/mensagem
  cancelText?: string;              // Texto botão cancelar (default: "Cancelar")
  confirmText?: string;             // Texto botão confirmar (default: "Excluir")
  requireNameConfirmation?: boolean; // Requer digitação do nome
  itemName?: string;                // Nome a ser digitado (se requireNameConfirmation)
  itemType?: string;                // Tipo do item (default: "item")
  isDeleting?: boolean;             // Estado de loading
  children?: React.ReactNode;       // Conteúdo customizado opcional
}
```

**Exemplo de uso básico:**
```tsx
import { StandardDeleteModal } from "@/components/modals/standard-delete-modal";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem();
      setShowModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <StandardDeleteModal
      open={showModal}
      onOpenChange={setShowModal}
      onConfirm={handleDelete}
      title="Excluir Item"
      description="Tem certeza que deseja excluir este item?"
      isDeleting={isDeleting}
    />
  );
}
```

**Exemplo com validação de nome:**
```tsx
<StandardDeleteModal
  open={showModal}
  onOpenChange={setShowModal}
  onConfirm={handleDelete}
  title="Excluir Personagem"
  description="Você está prestes a excluir este personagem e todo seu histórico."
  requireNameConfirmation={true}
  itemName={character.name}
  itemType="personagem"
  isDeleting={isDeleting}
/>
```

**Exemplo com conteúdo customizado:**
```tsx
<StandardDeleteModal
  open={showModal}
  onOpenChange={setShowModal}
  onConfirm={handleDelete}
  title="Excluir Região"
  description="Isso excluirá a região e todas as suas versões."
  isDeleting={isDeleting}
>
  <div className="space-y-2">
    <p className="text-sm text-muted-foreground">
      • {versions.length} versões serão excluídas
    </p>
    <p className="text-sm text-muted-foreground">
      • Todos os dados associados serão perdidos
    </p>
  </div>
</StandardDeleteModal>
```

**Funcionalidades:**
- ✅ Confirmação simples ou com validação de nome
- ✅ Estado de loading integrado com spinner
- ✅ Suporte a conteúdo customizado
- ✅ Input com fonte monospace para melhor legibilidade
- ✅ Botão desabilitado até condições serem satisfeitas
- ✅ Animação `animate-glow-red` no botão destrutivo
- ✅ Totalmente type-safe com TypeScript

---

### 2. StandardWarningDialog

**Localização:** `src/components/modals/standard-warning-dialog.tsx`

**Uso:** Modal genérico de aviso/confirmação para ações não-destrutivas ou avisos.

**Props:**
```typescript
interface StandardWarningDialogProps {
  open: boolean;                    // Se o modal está aberto
  onOpenChange: (open: boolean) => void;  // Callback de mudança de estado
  onConfirm: () => void | Promise<void>;  // Ação ao confirmar
  title: string;                    // Título do modal
  description: string;              // Descrição/mensagem
  cancelText?: string;              // Texto botão cancelar (default: "Cancelar")
  confirmText?: string;             // Texto botão confirmar (default: "Confirmar")
  isProcessing?: boolean;           // Estado de loading
  children?: React.ReactNode;       // Conteúdo customizado opcional
  variant?: "warning" | "destructive";  // Estilo do ícone (default: "warning")
  multipleActions?: boolean;        // Layout para múltiplas ações (default: false)
}
```

**Exemplo de uso básico:**
```tsx
import { StandardWarningDialog } from "@/components/modals/standard-warning-dialog";

function MyComponent() {
  const [showWarning, setShowWarning] = useState(false);

  const handleConfirm = () => {
    // Sua lógica aqui
    setShowWarning(false);
  };

  return (
    <StandardWarningDialog
      open={showWarning}
      onOpenChange={setShowWarning}
      onConfirm={handleConfirm}
      title="Descartar alterações?"
      description="Você tem alterações não salvas. Se continuar, todas as mudanças serão perdidas."
    />
  );
}
```

**Exemplo com conteúdo customizado:**
```tsx
<StandardWarningDialog
  open={showWarning}
  onOpenChange={setShowWarning}
  onConfirm={handleConfirm}
  title="Trocar imagem do mapa?"
  description="Existem elementos posicionados neste mapa. Ao trocar a imagem, todos os elementos serão removidos."
  confirmText="Continuar e trocar imagem"
>
  <div className="space-y-1 text-sm text-muted-foreground">
    <p>• {elementCount} elementos serão removidos</p>
    <p>• Esta ação não pode ser desfeita</p>
  </div>
</StandardWarningDialog>
```

**Exemplo com múltiplas ações (layout responsivo):**
```tsx
<StandardWarningDialog
  open={showWarning}
  onOpenChange={setShowWarning}
  onConfirm={handleAction}
  title="Excluir Grupo"
  description="O que você deseja fazer com as páginas deste grupo?"
  multipleActions={true}
  variant="warning"
>
  {/* Conteúdo customizado */}
</StandardWarningDialog>
```

**Funcionalidades:**
- ✅ Ícone amarelo de warning (ou vermelho se variant="destructive")
- ✅ Layout responsivo para múltiplas ações
- ✅ Estado de loading integrado com spinner
- ✅ Suporte a conteúdo customizado
- ✅ Botões com `flex-1` quando `multipleActions` está ativo
- ✅ Animação `animate-glow-red` no botão de confirmação
- ✅ Totalmente type-safe com TypeScript

---

### 3. DeleteEntityModal

**Localização:** `src/components/modals/delete-entity-modal.tsx`

**Uso:** Modal especializado para exclusão de entidades com sistema de versões (fluxo em dois passos).

**Props:**
```typescript
interface DeleteEntityModalProps<T extends IEntityVersion> {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityType: string;              // Usado para chaves i18n
  currentVersion: T;
  versionName?: string;
  totalVersions?: number;
  onConfirmDelete: () => void;
  i18nNamespace: string;          // Ex: "world", "character-detail"
}
```

**Exemplo de uso:**
```tsx
import { DeleteEntityModal } from "@/components/modals/delete-entity-modal";

function CharacterDetail() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <DeleteEntityModal
      isOpen={showDeleteDialog}
      onClose={() => setShowDeleteDialog(false)}
      entityName={character.name}
      entityType="character"
      currentVersion={currentVersion}
      versionName={currentVersion?.name}
      totalVersions={versions.length}
      onConfirmDelete={handleDelete}
      i18nNamespace="character-detail"
    />
  );
}
```

**Fluxos:**

**Versão não-principal** (`currentVersion.isMain === false`):
1. Confirmação simples em um passo
2. Mostra nome da versão
3. Botão "Excluir Versão"

**Entidade principal** (`currentVersion.isMain === true`):
1. **Passo 1:** Usuário digita o nome da entidade para confirmar
2. **Passo 2:** Confirmação final com aviso sobre total de versões
3. Botão "Excluir Permanentemente"

**Estrutura i18n necessária:**
```json
{
  "delete": {
    "version": {
      "title": "Excluir Versão",
      "message": "Tem certeza que deseja excluir a versão \"{{versionName}}\"?",
      "cancel": "Cancelar",
      "confirm": "Excluir Versão"
    },
    "character": {
      "title": "Excluir Personagem",
      "step1": {
        "message": "Você está prestes a excluir \"{{entityName}}\"...",
        "input_label": "Digite o nome para confirmar:",
        "cancel": "Cancelar",
        "continue": "Continuar"
      },
      "step2": {
        "title": "Confirmação Final",
        "message": "Isso excluirá \"{{entityName}}\" e todas as {{totalVersions}} versões...",
        "cancel": "Cancelar",
        "confirm": "Excluir Permanentemente"
      }
    }
  }
}
```

**Funcionalidades:**
- ✅ Type-safe com generics TypeScript
- ✅ Dois fluxos distintos (versão simples vs entidade principal)
- ✅ Validação de nome digitado (passo 1)
- ✅ Informação sobre total de versões
- ✅ Totalmente configurável via i18n
- ✅ Ícone vermelho de alerta
- ✅ Animação `animate-glow-red` no botão destrutivo

---

### 4. ConfirmDeleteModal

**Localização:** `src/components/modals/confirm-delete-modal.tsx`

**Uso:** Modal de confirmação de exclusão simples (mantido para compatibilidade).

> **Nota:** Para novos desenvolvimentos, prefira usar `StandardDeleteModal` que possui mais funcionalidades.

**Props:**
```typescript
interface PropsConfirmDeleteModal {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;  // Se fornecido, requer digitação do nome
  itemType?: string;
}
```

---

### 5. WarningDialog

**Localização:** `src/components/dialogs/WarningDialog.tsx`

**Uso:** Modal de aviso/confirmação (mantido para compatibilidade).

> **Nota:** Para novos desenvolvimentos, prefira usar `StandardWarningDialog` que possui mais funcionalidades.

**Props:**
```typescript
interface WarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  children?: React.ReactNode;
}
```

---

### 6. DeleteConfirmationDialog

**Localização:** `src/components/dialogs/DeleteConfirmationDialog.tsx`

**Uso:** Modal de confirmação de exclusão com suporte a i18n e loading.

**Props:**
```typescript
interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityName: string;
  onConfirm: () => Promise<void>;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}
```

**Exemplo:**
```tsx
<DeleteConfirmationDialog
  open={showDeleteDialog}
  onOpenChange={setShowDeleteDialog}
  entityType="região"
  entityName={region.name}
  onConfirm={handleDelete}
>
  <p className="text-sm text-muted-foreground">
    Todas as versões também serão excluídas.
  </p>
</DeleteConfirmationDialog>
```

---

## Guia de Uso

### Quando usar cada componente?

#### Use StandardDeleteModal quando:
- ✅ Você precisa de um modal simples de confirmação de exclusão
- ✅ Você quer validação de nome opcional
- ✅ Você precisa mostrar conteúdo adicional (ex: lista de itens afetados)
- ✅ Você está criando um novo componente de exclusão

#### Use StandardWarningDialog quando:
- ✅ Você precisa de um aviso que NÃO é uma exclusão
- ✅ Você tem uma ação que precisa de confirmação (ex: "Descartar alterações")
- ✅ Você precisa de um layout responsivo para múltiplas ações
- ✅ Você quer o ícone amarelo de warning

#### Use DeleteEntityModal quando:
- ✅ Você está lidando com entidades que têm sistema de versões
- ✅ Você precisa do fluxo em dois passos (digitar nome + confirmação)
- ✅ Você quer mostrar informações sobre versões

#### Use DeleteConfirmationDialog quando:
- ✅ Você precisa de i18n automático via `common` namespace
- ✅ Você quer um modal de exclusão com loading integrado
- ✅ Você está atualizando código existente que já usa este componente

---

## Especificações Técnicas

### Classes CSS Padronizadas

#### Container do Ícone - Delete Modals
```tsx
<div className="rounded-lg bg-destructive/10 p-2">
  <AlertTriangle className="h-5 w-5 text-destructive" />
</div>
```

#### Container do Ícone - Warning Modals
```tsx
<div className="rounded-lg bg-yellow-500/10 p-2">
  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
</div>
```

#### Header
```tsx
<AlertDialogHeader className="text-left">
  {/* Ícone container */}
  <div className="mb-4 flex justify-start">
    {/* Ícone */}
  </div>

  <AlertDialogTitle className="text-left">
    {title}
  </AlertDialogTitle>

  <AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
    {description}
  </AlertDialogDescription>
</AlertDialogHeader>
```

#### Conteúdo Customizado
```tsx
{children && (
  <div className="space-y-2 rounded-md bg-muted p-4">
    {children}
  </div>
)}
```

#### Footer - Delete Modals
```tsx
<AlertDialogFooter className="flex justify-end gap-2">
  <AlertDialogCancel>
    {cancelText}
  </AlertDialogCancel>
  <AlertDialogAction
    variant="destructive"
    size="lg"
    className="animate-glow-red"
    onClick={onConfirm}
  >
    {confirmText}
  </AlertDialogAction>
</AlertDialogFooter>
```

#### Footer - Warning Modals (responsivo)
```tsx
<AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
  <AlertDialogCancel className="m-0 flex-1">
    {cancelText}
  </AlertDialogCancel>
  <Button
    variant="destructive"
    size="lg"
    className="animate-glow-red flex-1"
    onClick={onConfirm}
  >
    {confirmText}
  </Button>
</AlertDialogFooter>
```

---

### Animações

#### animate-glow-red

Animação de brilho pulsante vermelho aplicada aos botões destrutivos.

**Definição (deve estar no seu tailwind.config):**
```javascript
keyframes: {
  'glow-red': {
    '0%, 100%': {
      boxShadow: '0 0 20px rgba(208, 47, 47, 0.2)',
    },
    '50%': {
      boxShadow: '0 0 30px rgba(208, 47, 47, 0.4)',
    },
  },
},
animation: {
  'glow-red': 'glow-red 2s ease-in-out infinite',
},
```

---

### Cores Padrão

#### Delete Modals
- **Ícone:** `text-destructive` (vermelho do tema)
- **Background ícone:** `bg-destructive/10`
- **Botão:** `variant="destructive"`

#### Warning Modals
- **Ícone:** `text-yellow-600 dark:text-yellow-500`
- **Background ícone:** `bg-yellow-500/10`
- **Botão:** `variant="destructive"` (mesmo visual, contexto diferente)

---

### Responsividade

#### Max-width
- Modais simples: `sm:max-w-md` (448px)
- Modais com múltiplas ações: `sm:max-w-lg` (512px)

#### Layout de Botões
- Delete modals: `flex justify-end gap-2` (sempre horizontal)
- Warning modals: `flex flex-col sm:flex-row gap-2` (vertical no mobile, horizontal no desktop)

---

## Checklist de Implementação

Ao criar um novo modal de delete ou warning, garanta que:

- [ ] Usa `AlertTriangle` como ícone
- [ ] Container do ícone é `rounded-lg` (não `rounded-full`)
- [ ] Ícone tem tamanho `h-5 w-5`
- [ ] Background do ícone segue o padrão (destructive/10 ou yellow-500/10)
- [ ] Cor do ícone está correta (destructive ou yellow-600 dark:text-yellow-500)
- [ ] Descrição tem `pt-4 text-left font-medium text-foreground`
- [ ] Footer tem `gap-2`
- [ ] Botão destrutivo tem `size="lg"` e `animate-glow-red`
- [ ] Modal tem `sm:max-w-md` ou `sm:max-w-lg`
- [ ] Layout de botões está correto (justify-end para delete, flex-col sm:flex-row para warning)
- [ ] Todos os textos estão alinhados à esquerda (`text-left`)

---

## Exemplos Completos

### Exemplo 1: Modal de exclusão simples

```tsx
import { StandardDeleteModal } from "@/components/modals/standard-delete-modal";
import { useState } from "react";

export function DeleteItemButton({ item }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteItem(item.id);
      toast.success("Item excluído com sucesso");
      setShowModal(false);
    } catch (error) {
      toast.error("Erro ao excluir item");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setShowModal(true)}>
        Excluir
      </Button>

      <StandardDeleteModal
        open={showModal}
        onOpenChange={setShowModal}
        onConfirm={handleDelete}
        title="Excluir Item"
        description="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
        isDeleting={isDeleting}
      />
    </>
  );
}
```

### Exemplo 2: Modal com validação de nome

```tsx
import { StandardDeleteModal } from "@/components/modals/standard-delete-modal";
import { useState } from "react";

export function DeleteProjectButton({ project }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteProject(project.id);
      toast.success("Projeto excluído com sucesso");
      router.push("/projects");
    } catch (error) {
      toast.error("Erro ao excluir projeto");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setShowModal(true)}>
        Excluir Projeto
      </Button>

      <StandardDeleteModal
        open={showModal}
        onOpenChange={setShowModal}
        onConfirm={handleDelete}
        title="Excluir Projeto"
        description={`Você está prestes a excluir "${project.name}" e todos os seus dados.`}
        requireNameConfirmation={true}
        itemName={project.name}
        itemType="projeto"
        confirmText="Excluir Permanentemente"
        isDeleting={isDeleting}
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • {project.taskCount} tarefas serão excluídas
          </p>
          <p className="text-sm text-muted-foreground">
            • {project.memberCount} membros perderão acesso
          </p>
          <p className="text-sm font-medium text-destructive">
            Esta ação não pode ser desfeita!
          </p>
        </div>
      </StandardDeleteModal>
    </>
  );
}
```

### Exemplo 3: Modal de warning

```tsx
import { StandardWarningDialog } from "@/components/modals/standard-warning-dialog";
import { useState } from "react";

export function FormWithUnsavedChanges() {
  const [showWarning, setShowWarning] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNavigateAway = () => {
    if (hasChanges) {
      setShowWarning(true);
    } else {
      router.push("/dashboard");
    }
  };

  const handleDiscard = () => {
    setShowWarning(false);
    router.push("/dashboard");
  };

  return (
    <>
      <Button variant="outline" onClick={handleNavigateAway}>
        Voltar
      </Button>

      <StandardWarningDialog
        open={showWarning}
        onOpenChange={setShowWarning}
        onConfirm={handleDiscard}
        title="Descartar alterações?"
        description="Você tem alterações não salvas. Se sair agora, todas as mudanças serão perdidas."
        cancelText="Continuar Editando"
        confirmText="Descartar Alterações"
      >
        <div className="text-sm text-muted-foreground">
          <p>• {changedFieldsCount} campos modificados</p>
          <p>• Última alteração há {lastChangeTime}</p>
        </div>
      </StandardWarningDialog>
    </>
  );
}
```

---

## Migração de Código Legado

Se você tem código usando componentes antigos, aqui está como migrar:

### De ConfirmDeleteModal para StandardDeleteModal

**Antes:**
```tsx
<ConfirmDeleteModal
  open={show}
  onClose={() => setShow(false)}
  onConfirm={handleDelete}
  title="Excluir"
  description="Tem certeza?"
  itemName={item.name}
/>
```

**Depois:**
```tsx
<StandardDeleteModal
  open={show}
  onOpenChange={setShow}  // Mudou de onClose para onOpenChange
  onConfirm={handleDelete}
  title="Excluir"
  description="Tem certeza?"
  requireNameConfirmation={true}  // Mudou de itemName direto
  itemName={item.name}
  isDeleting={isDeleting}  // Adicione estado de loading
/>
```

### De WarningDialog para StandardWarningDialog

**Antes:**
```tsx
<WarningDialog
  open={show}
  onOpenChange={setShow}
  onConfirm={handleConfirm}
  title="Aviso"
  description="Descrição"
/>
```

**Depois:**
```tsx
<StandardWarningDialog
  open={show}
  onOpenChange={setShow}
  onConfirm={handleConfirm}
  title="Aviso"
  description="Descrição"
  isProcessing={isProcessing}  // Adicione estado de loading
/>
```

---

## FAQ

**Q: Por que não usar `rounded-full` no container do ícone?**
R: O padrão `rounded-lg` foi escolhido para manter consistência visual em todo o projeto. É mais moderno e se alinha melhor com outros elementos da interface.

**Q: Posso mudar a cor do ícone de warning?**
R: Não recomendado. Use sempre `text-yellow-600 dark:text-yellow-500` para warnings e `text-destructive` para deletes. Isso mantém a consistência e ajuda usuários a reconhecerem rapidamente o tipo de ação.

**Q: Quando usar DeleteEntityModal vs StandardDeleteModal?**
R: Use `DeleteEntityModal` apenas para entidades com sistema de versões. Para todos os outros casos, use `StandardDeleteModal`.

**Q: Posso remover a animação animate-glow-red?**
R: Não recomendado. A animação ajuda a chamar atenção para ações destrutivas e é parte do design system.

**Q: Como adicionar múltiplos botões de ação em um warning?**
R: Use `StandardWarningDialog` com `multipleActions={true}`. Veja o exemplo do DeleteGroupModal.

---

## Manutenção

Este documento deve ser atualizado sempre que:
- Novos componentes de modal forem criados
- Padrões visuais forem modificados
- Novas funcionalidades forem adicionadas aos componentes existentes

**Última revisão:** 2025-12-14
**Autor:** Sistema de Padronização de Modais
